import dotenv from "dotenv";
import mongoose from "mongoose";
import Stripe from "stripe";
import Booking from "../models/BookingModel.js";
import Payment from "../models/PaymentModel.js";
import ProviderAvailability from "../models/ProviderAvailabilityModel.js";
import Timeslot from "../models/TimeSlotModel.js";
import Transaction from "../models/TransactionModel.js";
import User from "../models/UserModel.js";
import Wallet from "../models/WalletModel.js";
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

    // Data from frontend booking form
    const {
      customer,
      provider,
      address,
      country,
      city,
      phone,
      fullName,
      dateId, // ProviderAvailability ID (from selectedDateId)
      timeSlot, // Timeslot ID (from selectedTimeSlot._id)
      notes,
      // Payment info from frontend
      paymentMethod = "card", // Default to COD
    } = req.body;

    console.log("📦 Received booking data:", req.body);

    // ====== 1. Basic required fields ======
    if (!customer || !provider || !dateId || !timeSlot || !fullName || !phone) {
      return res.status(400).json({
        message:
          "Missing required fields: customer, provider, dateId, timeSlot, fullName, or phone",
      });
    }

    // Validate payment method
    if (!["cod", "card"].includes(paymentMethod)) {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    // ====== 2. Validate users and time slot in parallel ======
    const [customerData, providerData, timeSlotData] = await Promise.all([
      User.findById(customer).lean(),
      User.findById(provider).lean(),
      Timeslot.findById(timeSlot).lean(),
    ]);

    if (!customerData)
      return res.status(404).json({ message: "Customer not found" });
    if (!providerData)
      return res.status(404).json({ message: "Provider not found" });
    if (!timeSlotData)
      return res.status(404).json({ message: "Time slot not found" });

    // Check if time slot is already booked
    if (timeSlotData.isBooked) {
      return res.status(409).json({
        message: "This time slot is already booked",
      });
    }

    // ====== 3. Get ProviderAvailability ======
    const providerAvailability = await ProviderAvailability.findById(
      dateId
    ).lean();

    if (!providerAvailability) {
      return res
        .status(404)
        .json({ message: "Provider availability not found" });
    }

    // Check if time slot belongs to this provider via ProviderAvailability
    if (providerAvailability.provider.toString() !== provider) {
      return res.status(403).json({
        message: "Time slot does not belong to this provider",
      });
    }

    // ====== 4. Parse & validate date ======

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // const workingDay = new Date(workingDate);
    // workingDay.setHours(0, 0, 0, 0);

    const maxDaysAhead = 7;
    const maxAllowed = new Date(today);
    maxAllowed.setDate(today.getDate() + maxDaysAhead);
    // if (workingDay > maxAllowed)
    //   return res
    //     .status(400)
    //     .json({ message: `Booking too far ahead (max ${maxDaysAhead} days)` });

    // ====== 5. Check if time slot belongs to this availability date ======
    // if (timeSlotData.availability.toString() !== dateId) {
    //   return res.status(400).json({
    //     message: "Time slot does not belong to selected date"
    //   });
    // }

    // ====== 6. Use time slot start and end times ======
    const startTime = timeSlotData.startTime;
    const endTime = timeSlotData.endTime;
    const duration = timeSlotData.duration || "60m";

    // Convert duration string to minutes
    const getDurationInMinutes = (durationStr) => {
      if (durationStr.endsWith("m")) {
        return parseInt(durationStr);
      } else if (durationStr.endsWith("h")) {
        return parseInt(durationStr) * 60;
      }
      return 60; // Default to 60 minutes
    };

    const durationMinutes = getDurationInMinutes(duration);

    // Validate time format
    // const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
    // if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
    //   return res.status(400).json({
    //     message: "Invalid time format in time slot"
    //   });
    // }

    const minutes = (t) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    };

    const slotStartMin = minutes(startTime);
    const slotEndMin = minutes(endTime);

    // Get provider working hours
    const workStart24 = providerData.workingHours?.start || "09:00";
    const workEnd24 = providerData.workingHours?.end || "18:00";
    const workStartMin = minutes(workStart24);
    const workEndMin = minutes(workEnd24);

    // Validate time slot
    // if (slotEndMin <= slotStartMin)
    //   return res
    //     .status(400)
    //     .json({ message: "End time must be after start time" });

    // Check if slot duration matches
    const actualDuration = slotEndMin - slotStartMin;
    // if (actualDuration !== durationMinutes)
    //   return res
    //     .status(400)
    //     .json({ message: `Time slot duration mismatch` });

    // if (slotStartMin < workStartMin || slotEndMin > workEndMin)
    //   return res.status(400).json({ message: "Time slot outside working hours" });

    // ====== 7. Create exact Date objects for booking ======
    // const slotStartDate = new Date(workingDate);
    // slotStartDate.setHours(...startTime.split(":").map(Number), 0, 0);

    // const slotEndDate = new Date(workingDate);
    // slotEndDate.setHours(...endTime.split(":").map(Number), 0, 0);

    // ====== 8. Additional check for any conflicting booking ======
    const existingBooking = await Booking.findOne({
      provider,
      dateId,
      timeSlot,
      status: { $in: ["pending", "accept"] },
    });

    if (existingBooking) {
      return res.status(409).json({
        message: "This time slot is already booked in another booking",
      });
    }

    // ====== 9. Calculate pricing ======
    const commissionPercent = Number(
      process.env.PLATFORM_COMMISSION_PERCENT || 10
    );
    const commissionVATRate = Number(
      process.env.PLATFORM_COMMISSION_VAT_PERCENT || 19
    );

    // Use provider's hourly rate or default
    const hourlyRate = providerData.hourlyRate || 55; // Default to $55 as in frontend
    const hours = durationMinutes / 60;
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

    // ====== 10. MARK TIME SLOT AS BOOKED ======
    await Timeslot.findByIdAndUpdate(
      timeSlot,
      {
        isBooked: true,
        bookedBy: customer,
        bookedAt: new Date(),
        bookingStatus: "reserved",
      },
      { session }
    );

    console.log(`✅ Time slot ${timeSlot} marked as booked`);

    // ====== 11. Create booking ======
    const [booking] = await Booking.create(
      [
        {
          customer,
          provider,
          dateId,
          timeSlot,
          // Customer info from form
          customerInfo: {
            fullName,
            phone,
            email: req.body.email || customerData.email,
            address: address || req.body.address,
            country,
            city,
            notes: notes || "",
          },
          // Address details for service
          address: address || req.body.address,
          country,
          city,
          phone,
          fullName,
          // Booking details
          // bookingDate: workingDate,
          startTime,
          endTime,
          duration: `${durationMinutes}m`,
          // Payment
          paymentMethod,
          status: "pending",
          paymentStatus: paymentMethod === "cod" ? "pending" : "processing",
          // Additional metadata
          bookingReference: `BK-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)
            .toUpperCase()}`,
          serviceAmount,
          hourlyRate,
          hours,
        },
      ],
      { session }
    );

    // ====== 12. Create payment record ======
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
            serviceName: providerData.serviceName || "Service",
            duration: durationMinutes,
            startTime: startTime,
            endTime: endTime,
            providerName: providerData.name || providerData.serviceName,
            customerName: fullName,
            customerPhone: phone,
            customerEmail: req.body.email || customerData.email,
            address: address || req.body.address,
            country,
            itemTypeL: "service",
            city,
            hourlyRate: hourlyRate,
            hours: hours,
            timeSlot: timeSlot,
            dateId: dateId,
            bookingReference: booking.bookingReference,
          },
        },
      ],
      { session }
    );

    // ====== 13. STRIPE PAYMENT ======
    if (paymentMethod === "card") {
      const lineItems = [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: providerData.serviceName || "Service",
              description: `${durationMinutes} minute session on  at ${startTime} - ${endTime}`,
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
        customer_email: req.body.email || customerData.email,
        success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&booking_id=${booking._id}&timeSlot=${timeSlot}`,
        cancel_url: `${process.env.FRONTEND_URL}/payment-cancel?booking_id=${booking._id}&timeSlot=${timeSlot}`,
        metadata: {
          bookingId: booking._id.toString(),
          customerId: customer,
          providerId: provider,
          paymentId: payment._id.toString(),
          timeSlot: timeSlot.toString(),
          dateId: dateId.toString(),
          itemType: "service",
          serviceName: providerData.serviceName,
          amount: serviceAmount.toString(),
          commissionPercent: commissionPercent.toString(),
          commissionVATRate: commissionVATRate.toString(),
          bookingReference: booking.bookingReference,
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
        timeSlot: timeSlot,
        amount: serviceAmount,
        sessionId: checkoutSession.id,
        bookingReference: booking.bookingReference,
      });
    }

    // ====== 14. COD PROCESSING ======
    if (paymentMethod === "cod") {
      await session.commitTransaction();

      return res.status(201).json({
        success: true,
        message: "Booking placed successfully (Cash on Delivery)",
        bookingId: booking._id,
        paymentId: payment._id,
        timeSlot: timeSlot,
        bookingReference: booking.bookingReference,
        data: {
          booking: {
            _id: booking._id,
            status: booking.status,
            bookingDate: booking.bookingDate,
            startTime: booking.startTime,
            endTime: booking.endTime,
            timeSlot: timeSlot,
            dateId: dateId,
            amount: serviceAmount,
            paymentMethod: "cod",
            bookingReference: booking.bookingReference,
          },
          payment: {
            status: "pending",
            amount: serviceAmount,
            method: "cod",
          },
          timeSlot: {
            _id: timeSlot,
            isBooked: true,
            startTime: startTime,
            endTime: endTime,
          },
          customerInfo: {
            fullName: booking.fullName,
            phone: booking.phone,
            email: req.body.email || customerData.email,
            address: booking.address,
            country: booking.country,
            city: booking.city,
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
// Helper function (make sure this exists)
// const toTwo = (num) => {
//   return Math.round((num + Number.EPSILON) * 100) / 100;
// };

/**
 * Update booking status (provider accepts/rejects)
 *
 * @route PUT /booking
 * @param {string} req.params.bookingId - Booking ID
 * @param {string} req.body.status - New
 * status: 'accept' or 'rejected'
 * @returns {Object} 200 - Success message and updated booking
 */
export const updateBookingStatus = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { bookingId } = req.params;
    const { status } = req.body;
    const providerId = req.user?.userId; // Assuming user ID from auth middleware

    if (!["accept", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    session.startTransaction();

    const booking = await Booking.findOne({
      _id: bookingId,
      provider: providerId,
    }).session(session);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Booking status cannot be changed",
      });
    }

    // If rejecting a paid booking, need to process refund
    if (status === "rejected" && booking.paymentStatus === "completed") {
      const payment = await Payment.findOne({
        booking: bookingId,
        status: "paid",
      }).session(session);

      if (payment) {
        // Process refund through Stripe
        if (payment.stripePaymentIntent) {
          const refund = await stripe.refunds.create({
            payment_intent: payment.stripePaymentIntent,
          });

          payment.status = "refunded";
          payment.metadata = {
            ...payment.metadata,
            refundId: refund.id,
            refundedAt: new Date(),
          };
          await payment.save({ session });

          // Update wallet balance (remove reserved amount)
          await Wallet.findOneAndUpdate(
            { user: payment.provider },
            { $inc: { reserved: -payment.providerPayout } },
            { session }
          );

          // Create refund transaction
          await Transaction.create(
            [
              {
                transactionId: `refund_${Date.now()}_${payment._id}`,
                type: "refund",
                user: payment.provider,
                payment: payment._id,
                amount: -payment.providerPayout,
                currency: payment.currency,
                metadata: {
                  bookingId: booking._id,
                  refundId: refund.id,
                  reason: "provider_rejection",
                },
              },
            ],
            { session }
          );
        }
      }
    }

    booking.status = status;
    await booking.save({ session });

    await session.commitTransaction();

    return res.json({
      success: true,
      message: `Booking ${status} successfully`,
      booking,
    });
  } catch (error) {
    console.error("Update booking status error:", error);
    await session.abortTransaction();

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
 * Complete service and release provider payout
 */
export const completeService = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { bookingId } = req.params;
    const providerId = req.user?.userId;

    session.startTransaction();

    const booking = await Booking.findOne({
      _id: bookingId,
      provider: providerId,
      status: "accept",
    }).session(session);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found or not accepted",
      });
    }

    const payment = await Payment.findOne({
      booking: bookingId,
      status: "paid",
    }).session(session);

    if (!payment) {
      return res.status(400).json({
        success: false,
        message: "Payment not found or not paid",
      });
    }

    // Release reserved funds to available balance
    await Wallet.findOneAndUpdate(
      { user: payment.provider },
      { $inc: { reserved: -payment.providerPayout } },
      { session }
    );

    // Create transaction for released funds
    await Transaction.create(
      [
        {
          transactionId: `release_${Date.now()}_${payment._id}`,
          type: "release",
          user: payment.provider,
          payment: payment._id,
          amount: payment.providerPayout,
          currency: payment.currency,
          metadata: {
            bookingId: booking._id,
            serviceCompleted: true,
            releasedAt: new Date(),
          },
        },
      ],
      { session }
    );

    await session.commitTransaction();

    return res.json({
      success: true,
      message: "Service completed and funds released",
    });
  } catch (error) {
    console.error("Complete service error:", error);
    await session.abortTransaction();

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

export const userBooking = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const skip = parseInt(req.query.skip) || 0;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100); // max 100
    const bookings = await Booking.find({
      customer: userId,
    })
      .sort({ createdAt: -1 }) // latest first
      .populate("provider timeSlot dateId")
      .skip(skip)
      .limit(limit)
      .lean() // FASTEST: returns plain objects, no Mongoose overhead
      .exec();

    // Attach paymentId (Payment._id) to each booking if a Payment exists
    try {
      const bookingIds = bookings.map((b) => b._id).filter(Boolean);
      if (bookingIds.length > 0) {
        const payments = await Payment.find({ booking: { $in: bookingIds } })
          .select("_id booking")
          .lean()
          .exec();

        const paymentMap = payments.reduce((acc, p) => {
          if (p && p.booking) acc[p.booking.toString()] = p._id.toString();
          return acc;
        }, {});

        // mutate plain booking objects to include paymentId when available
        for (const b of bookings) {
          const bid = b._id?.toString();
          if (bid && paymentMap[bid]) b.paymentId = paymentMap[bid];
          else b.paymentId = undefined;
        }
      }
    } catch (attachErr) {
      console.error("Failed to attach paymentId to bookings:", attachErr);
      // non-fatal — return bookings without paymentId if lookup fails
    }

    res.status(200).json({
      message: "Success",
      data: {
        total: bookings.length,
        bookings,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

export const providerBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const skip = parseInt(req.query.skip) || 0;
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);

    // Get total count
    const total = await Booking.countDocuments({ provider: id }).populate(
      "customer timeSlot dateId provider"
    );

    // Get paginated bookings
    const bookings = await Booking.find({
      provider: id,
    })
      .sort({ createdAt: -1 })
      .populate("customer timeSlot dateId provider")
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    res.status(200).json({
      message: "Success",
      data: {
        total, // This should be the total count, not bookings.length
        bookings,
        page: Math.floor(skip / limit) + 1,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + limit < total,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

export const allBookings = async (req, res) => {
  try {
    const skip = parseInt(req.query.skip) || 0;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100); // max 100
    const bookings = await Booking.find({})
      .sort({ createdAt: -1 }) // latest first
      .populate("customer provider timeSlot dateId")
      .skip(skip)
      .limit(limit)
      .lean() // FASTEST: returns plain objects, no Mongoose overhead
      .exec();
    res.status(200).json({
      message: "Success",
      data: {
        total: bookings.length,
        bookings,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

export const updateBookingStatusNew = async (req, res) => {
  try {
    const { id, status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      id,
      { status: status },
      { new: true }
    );
    res.status(200).json({ message: "Booking status updated", booking });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};
