import dotenv from "dotenv";
import mongoose from "mongoose";
import Stripe from "stripe";
import Booking from "../models/BookingModel.js";
import Payment from "../models/PaymentModel.js";
import User from "../models/UserModel.js";
import { toTwo } from "../utils/money.js";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-10-29.clover",
});

/**
 * Save a new booking with payment processing
 * @route POST /booking
 * @param {Object} req.body - Booking data
 * @returns {Object} 200 - Success message and saved booking
 */
export const saveBooking = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const {
      customer,
      provider,
      address,
      paymentMethod,
      bookingDate: rawDate,
      timeSlot: { start: rawStart, end: rawEnd },
      notes,
    } = req.body;

    // ====== 1. Basic required fields ======
    if (!customer || !provider || !rawDate || !rawStart || !rawEnd) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!["cod", "card"].includes(paymentMethod)) {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    // ====== 2. Validate users in parallel ======
    const [customerData, providerData] = await Promise.all([
      User.findById(customer).lean(),
      User.findById(provider).lean(),
    ]);

    if (!customerData)
      return res.status(404).json({ message: "Customer not found" });
    if (!providerData)
      return res.status(404).json({ message: "Provider not found" });
    if (providerData.status !== "active")
      return res.status(400).json({ message: "Provider is not active" });

    // Check if provider has availability configured (working hours/days)
    if (!providerData.workingDays || !providerData.workingDays.length) {
      return res
        .status(400)
        .json({ message: "Provider availability not configured" });
    }

    // ====== 3. Parse & validate date ======
    const bookingDate = new Date(rawDate);
    if (isNaN(bookingDate))
      return res.status(400).json({ message: "Invalid date" });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookingDay = new Date(bookingDate);
    bookingDay.setHours(0, 0, 0, 0);

    if (bookingDay < today)
      return res.status(400).json({ message: "Cannot book past dates" });

    const maxDaysAhead = 7;
    const maxAllowed = new Date(today);
    maxAllowed.setDate(today.getDate() + maxDaysAhead);
    if (bookingDay > maxAllowed)
      return res
        .status(400)
        .json({ message: `Booking too far ahead (max ${maxDaysAhead} days)` });

    // ====== 4. Check working day ======
    const dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
      bookingDate.getDay()
    ];
    if (!providerData.workingDays.includes(dayName))
      return res
        .status(400)
        .json({ message: `Provider does not work on ${dayName}s` });

    // ====== 5. Normalize time to 24h format ======
    const to24h = (time) => {
      const match = time.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)?$/i);
      if (!match) throw new Error("Invalid time");
      let [_, h, m, period] = match;
      let hours = parseInt(h);
      if (period) {
        if (period.toUpperCase() === "PM" && hours !== 12) hours += 12;
        if (period.toUpperCase() === "AM" && hours === 12) hours = 0;
      }
      return `${hours.toString().padStart(2, "0")}:${m}`;
    };

    let start24, end24;
    try {
      start24 = to24h(rawStart.trim());
      end24 = to24h(rawEnd.trim());
    } catch {
      return res
        .status(400)
        .json({ message: "Invalid time format. Use: 09:00 or 9:00 AM" });
    }

    const workStart24 = to24h(providerData.workingHours?.start || "09:00");
    const workEnd24 = to24h(providerData.workingHours?.end || "18:00");

    const minutes = (t) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    };

    const slotStartMin = minutes(start24);
    const slotEndMin = minutes(end24);
    const workStartMin = minutes(workStart24);
    const workEndMin = minutes(workEnd24);
    const duration = providerData.slotDuration || 60;

    // Validate duration & alignment
    if (slotEndMin <= slotStartMin)
      return res
        .status(400)
        .json({ message: "End time must be after start time" });
    if (slotEndMin - slotStartMin !== duration)
      return res
        .status(400)
        .json({ message: `Slot must be exactly ${duration} minutes` });
    if ((slotStartMin - workStartMin) % duration !== 0)
      return res
        .status(400)
        .json({ message: `Slot must start on ${duration}-minute boundary` });
    if (slotStartMin < workStartMin || slotEndMin > workEndMin)
      return res.status(400).json({ message: "Outside working hours" });

    // ====== 6. Create exact Date objects for overlap check ======
    const slotStartDate = new Date(bookingDate);
    slotStartDate.setHours(...start24.split(":").map(Number), 0, 0);

    const slotEndDate = new Date(bookingDate);
    slotEndDate.setHours(...end24.split(":").map(Number), 0, 0);

    // ====== 7. FINAL: Prevent double booking ======
    const conflict = await Booking.findOne({
      provider,
      bookingDate: bookingDay,
      status: { $in: ["pending", "accept"] },
      $or: [
        {
          "timeSlot.start": { $lt: end24 },
          "timeSlot.end": { $gt: start24 },
        },
      ],
    });

    if (conflict)
      return res.status(409).json({
        message: "Time slot already booked",
      });

    // ====== 8. Calculate pricing ======
    const commissionPercent = Number(
      process.env.PLATFORM_COMMISSION_PERCENT || 10
    );
    const commissionVATRate = Number(
      process.env.PLATFORM_COMMISSION_VAT_PERCENT || 19
    );

    // Calculate service amount from provider's hourly rate
    const hourlyRate = providerData.hourlyRate || 0;
    const hours = duration / 60;
    const serviceAmount = toTwo(hourlyRate * hours);

    if (serviceAmount <= 0) {
      return res.status(400).json({ message: "Invalid service price" });
    }

    // Platform commission calculation
    const commissionAmount = toTwo((serviceAmount * commissionPercent) / 100);
    const commissionVATAmount = toTwo(
      (commissionAmount * commissionVATRate) / 100
    );
    const commissionTotal = toTwo(commissionAmount + commissionVATAmount);
    const providerPayout = toTwo(serviceAmount - commissionTotal);

    // ====== 9. Create booking ======
    const [booking] = await Booking.create(
      [
        {
          customer,
          provider,
          address,
          paymentMethod,
          bookingDate,
          timeSlot: { start: rawStart.trim(), end: rawEnd.trim() },
          status: "pending",
          paymentStatus: paymentMethod === "cod" ? "pending" : "processing",
        },
      ],
      { session }
    );

    // ====== 10. Create payment record ======
    const [payment] = await Payment.create(
      [
        {
          booking: booking._id,
          buyer: customer,
          provider: provider,
          amount: serviceAmount,
          currency: "usd",
          status: paymentMethod === "cod" ? "pending" : "processing",
          method: paymentMethod === "cod" ? "cod" : "stripe_checkout",
          commissionAmount: commissionAmount,
          commissionVATAmount: commissionVATAmount,
          commissionVATRate: commissionVATRate,
          commissionTotal: commissionTotal,
          providerPayout: providerPayout,
          metadata: {
            serviceName: providerData.serviceName,
            duration: duration,
            startTime: rawStart.trim(),
            endTime: rawEnd.trim(),
            providerName: providerData.name || providerData.serviceName,
            customerName: customerData.name,
            hourlyRate: hourlyRate,
            hours: hours,
          },
        },
      ],
      { session }
    );

    // ====== 11. STRIPE PAYMENT ======
    if (paymentMethod === "card") {
      const lineItems = [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: providerData.serviceName || "Service",
              description: `${duration} minute session on ${bookingDate.toLocaleDateString()} at ${rawStart} - ${rawEnd}`,
            },
            unit_amount: Math.round(serviceAmount * 100),
          },
          quantity: 1,
        },
      ];

      const checkoutSession = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: lineItems,
        customer_email: customerData.email,
        success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&booking_id=${booking._id}`,
        cancel_url: `${process.env.FRONTEND_URL}/payment-cancel?booking_id=${booking._id}`,
        metadata: {
          bookingId: booking._id.toString(),
          customerId: customer,
          providerId: provider,
          paymentId: payment._id.toString(),
          itemType: "service",
          serviceName: providerData.serviceName,
          amount: serviceAmount.toString(),
          commissionPercent: commissionPercent.toString(),
          commissionVATRate: commissionVATRate.toString(),
        },
      });

      // Update payment with Stripe session ID
      payment.stripeSessionId = checkoutSession.id;
      payment.stripePaymentIntent = checkoutSession.payment_intent;
      await payment.save({ session });

      await session.commitTransaction();

      return res.json({
        success: true,
        message: "Booking created successfully. Redirect to payment.",
        checkoutUrl: checkoutSession.url,
        bookingId: booking._id,
        paymentId: payment._id,
        amount: serviceAmount,
        sessionId: checkoutSession.id,
      });
    }

    // ====== 12. COD PROCESSING ======
    if (paymentMethod === "cod") {
      await session.commitTransaction();

      return res.status(201).json({
        success: true,
        message: "Booking placed successfully (Cash on Delivery)",
        bookingId: booking._id,
        paymentId: payment._id,
        data: {
          booking: {
            _id: booking._id,
            status: booking.status,
            bookingDate: booking.bookingDate,
            timeSlot: booking.timeSlot,
            amount: serviceAmount,
            paymentMethod: "cod",
          },
          payment: {
            status: "pending",
            amount: serviceAmount,
            method: "cod",
          },
        },
      });
    }
  } catch (error) {
    console.error("saveBooking error:", error);
    await session.abortTransaction();

    // Handle specific Stripe errors
    if (error instanceof stripe.errors.StripeError) {
      return res.status(400).json({
        success: false,
        message: `Payment error: ${error.message}`,
        code: error.code,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  } finally {
    session.endSession();
  }
};

/**
 * Change the status of a booking
 * @route PUT /booking
 * @param {string} req.body.id - Booking ID
 * @param {string} req.body.status - New status
 * @returns {Object} 200 - Success message and update result
 */
export const changeStatus = async (req, res) => {
  try {
    const { id, status } = req.body;

    const updated = await Booking.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          status: status,
        },
      }
    );

    res.status(200).json({
      message: "Success",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: error?.message,
    });
  }
};

/**
 * Get today's bookings for a provider
 * @route GET /booking/today
 * @param {string} req.query.providerId - Provider ID
 * @returns {Object} 200 - List of today's bookings
 */
export const getTodaysBookings = async (req, res) => {
  try {
    const { providerId } = req.query;

    if (!providerId) {
      return res.status(400).json({ message: "providerId is required" });
    }

    // Today: from 00:00:00.000 to 23:59:59.999
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const bookings = await Booking.find({
      provider: providerId,
      bookingDate: { $gte: todayStart, $lte: todayEnd },
      status: { $in: ["pending", "accept"] }, // ignore rejected/cancelled
    })
      .sort({ "timeSlot.start": 1 }) // earliest first
      .populate([
        {
          path: "customer",
          select: "name phoneNumber image email",
        },
        {
          path: "provider",
          select: "name serviceName image phoneNumber",
        },
      ])
      .lean() // FASTEST: returns plain objects, no Mongoose overhead
      .exec();

    return res.status(200).json({
      message: "Success",
      data: {
        date: todayStart.toISOString().split("T")[0],
        total: bookings.length,
        bookings,
      },
    });
  } catch (error) {
    console.error("getTodaysBookings error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * Get upcoming bookings for a provider
 * @route GET /booking/upcoming
 * @param {string} req.query.providerId - Provider ID
 * @returns {Object} 200 - List of upcoming bookings
 */
export const getUpcomingBookings = async (req, res) => {
  try {
    const { providerId, limit = 50, skip = 0 } = req.query;

    if (!providerId) {
      return res.status(400).json({ message: "providerId is required" });
    }

    // Only from tomorrow onwards (clean & safe)
    const tomorrow = new Date();
    tomorrow.setHours(0, 0, 0, 0);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Parse limit/skip safely
    const limitNum = Math.min(parseInt(limit, 10) || 50, 100); // max 100
    const skipNum = parseInt(skip, 10) || 0;

    // ONE FAST QUERY using index + pagination
    const bookings = await Booking.find({
      provider: providerId,
      bookingDate: { $gte: tomorrow },
      status: { $in: ["pending", "accept"] }, // optional: ignore rejected
    })
      .sort({ bookingDate: 1, "timeSlot.start": 1 }) // earliest first
      .skip(skipNum)
      .limit(limitNum)
      .populate([
        { path: "customer", select: "name phoneNumber image email" },
        { path: "provider", select: "name phoneNumber image serviceName" },
      ])
      .lean(); // fastest: returns plain JS objects

    // Optional: Get total count for frontend pagination
    const total = await Booking.countDocuments({
      provider: providerId,
      bookingDate: { $gte: tomorrow },
      status: { $in: ["pending", "accept"] },
    });

    return res.status(200).json({
      message: "Success",
      data: {
        bookings,
        pagination: {
          total,
          returned: bookings.length,
          hasMore: skipNum + bookings.length < total,
        },
      },
    });
  } catch (error) {
    console.error("getUpcomingBookings error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * Get booking stats for chart (cancelled/completed counts)
 * @route GET /booking/stats
 * @param {string} req.query.providerId - Provider ID
 * @param {string} req.query.filter - Filter type: 'all', 'today', or 'week'
 * @returns {Object} 200 - Cancelled and completed booking counts
 */
export const getBookingStats = async (req, res) => {
  try {
    const { providerId, filter = "today" } = req.query;

    if (!providerId) {
      return res.status(400).json({ message: "providerId is required" });
    }

    // Build date range based on filter
    const now = new Date();
    let startDate, endDate;

    if (filter === "today") {
      startDate = new Date(now.setHours(0, 0, 0, 0));
      endDate = new Date(now.setHours(23, 59, 59, 999));
    } else if (filter === "week") {
      // This week: Monday to Sunday
      const day = now.getDay(); // 0 = Sun, 1 = Mon...
      startDate = new Date(now);
      startDate.setDate(now.getDate() - (day === 0 ? 6 : day - 1)); // Monday
      startDate.setHours(0, 0, 0, 0);

      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
    } else {
      return res
        .status(400)
        .json({ message: "Invalid filter. Use: today | week" });
    }

    // ONE SINGLE AGGREGATION = 10x faster + uses index perfectly
    const stats = await Booking.aggregate([
      {
        $match: {
          provider: new mongoose.Types.ObjectId(providerId),
          bookingDate: { $gte: startDate, $lte: endDate },
          status: { $in: ["accept", "rejected"] }, // only count relevant statuses
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Convert result to object: { accept: 12, rejected: 3 }
    const resultMap = { accept: 0, rejected: 0 };
    stats.forEach((item) => {
      if (item._id in resultMap) {
        resultMap[item._id] = item.count;
      }
    });

    return res.status(200).json({
      message: "Success",
      data: {
        completed: resultMap.accept,
        cancelled: resultMap.rejected,
        period: filter,
        dateRange: {
          from: startDate.toISOString().split("T")[0],
          to: endDate.toISOString().split("T")[0],
        },
      },
    });
  } catch (error) {
    console.error("getBookingStats error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
