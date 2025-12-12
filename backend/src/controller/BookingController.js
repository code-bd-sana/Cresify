import Booking from "../models/BookingModel.js";

/**
 * Save a new booking
 * @route POST /booking
 * @param {Object} req.body - Booking data
 * @returns {Object} 200 - Success message and saved booking
 */
export const saveBooking = async (req, res) => {
  try {
    const {
      customer,
      provider,
      address,
      paymentMethod,
      bookingDate,
      timeSlot,
    } = req.body;

    // ====== BASIC VALIDATIONS ======
    if (!customer || !provider || !bookingDate || !timeSlot) {
      return res.status(400).json({
        message: "Missing required booking fields",
      });
    }

    // Validate both customer and provider exist
    const [customerData, providerData] = await Promise.all([
      User.findById(customer),
      User.findById(provider),
    ]);

    if (!customerData) {
      return res.status(404).json({ message: "Customer not found" });
    }
    if (!providerData) {
      return res.status(404).json({ message: "Provider not found" });
    }

    // Check if provider is active
    if (providerData.status !== "active") {
      return res.status(400).json({
        message: "Provider is not available for booking",
      });
    }

    // Parse booking date - handle timezone
    const bookingDateObj = new Date(bookingDate);
    if (isNaN(bookingDateObj.getTime())) {
      return res.status(400).json({ message: "Invalid booking date" });
    }

    // Normalize dates to start of day for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const bookingDay = new Date(bookingDateObj);
    bookingDay.setHours(0, 0, 0, 0);

    // Check if booking is in the past
    if (bookingDay < today) {
      return res.status(400).json({
        message: "Booking date must be today or in the future",
      });
    }

    // Check if booking is too far in advance (optional)
    const maxBookingDays = 90; // 3 months in advance
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + maxBookingDays);
    if (bookingDay > maxDate) {
      return res.status(400).json({
        message: `Booking cannot be more than ${maxBookingDays} days in advance`,
      });
    }

    const { start, end } = providerData.workingHours;
    const slotDuration = providerData.slotDuration || 30;
    const workingDays = providerData.workingDays || [];

    // ====== CHECK PROVIDER WORKING DAY ======
    const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const bookingDayName = weekdayNames[bookingDateObj.getDay()];

    if (!workingDays.includes(bookingDayName)) {
      return res.status(400).json({
        message: `Provider does not work on ${bookingDayName}s`,
      });
    }

    // ====== VALIDATE TIMESLOT FORMAT ======
    const [slotStart, slotEnd] = timeSlot.split("-");
    if (!slotStart || !slotEnd) {
      return res.status(400).json({
        message: "Invalid timeSlot format. Use HH:MM-HH:MM (24-hour format)",
      });
    }

    // Validate time format
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(slotStart) || !timeRegex.test(slotEnd)) {
      return res.status(400).json({
        message: "Invalid time format. Use HH:MM (24-hour format)",
      });
    }

    // ====== ENSURE SLOT WITHIN WORKING HOURS ======
    // Convert times to minutes for accurate comparison
    const timeToMinutes = (timeStr) => {
      const [hours, minutes] = timeStr.split(":").map(Number);
      return hours * 60 + minutes;
    };

    const slotStartMinutes = timeToMinutes(slotStart);
    const slotEndMinutes = timeToMinutes(slotEnd);
    const workStartMinutes = timeToMinutes(start);
    const workEndMinutes = timeToMinutes(end);

    if (
      slotStartMinutes < workStartMinutes ||
      slotEndMinutes > workEndMinutes
    ) {
      return res.status(400).json({
        message: `Time slot must be within provider working hours (${start} - ${end})`,
      });
    }

    // Ensure slot doesn't end before it starts
    if (slotEndMinutes <= slotStartMinutes) {
      return res.status(400).json({
        message: "End time must be after start time",
      });
    }

    // ====== CHECK SLOT DURATION MATCHES PROVIDER SETTING ======
    const slotDurationMinutes = slotEndMinutes - slotStartMinutes;
    if (slotDurationMinutes !== slotDuration) {
      return res.status(400).json({
        message: `Invalid time slot duration. Must be exactly ${slotDuration} minutes.`,
      });
    }

    // ====== CHECK SLOT ALIGNMENT ======
    // Ensure slot starts at valid interval (e.g., 9:00, 9:30, 10:00 for 30-min slots)
    const timeFromWorkStart = slotStartMinutes - workStartMinutes;
    if (timeFromWorkStart % slotDuration !== 0) {
      return res.status(400).json({
        message: `Time slot must start at intervals of ${slotDuration} minutes from ${start}`,
      });
    }

    // ====== PREVENT DOUBLE BOOKING ======
    // Create start and end datetime for more accurate comparison
    const slotStartTime = new Date(bookingDateObj);
    const [startHour, startMinute] = slotStart.split(":").map(Number);
    slotStartTime.setHours(startHour, startMinute, 0, 0);

    const slotEndTime = new Date(bookingDateObj);
    const [endHour, endMinute] = slotEnd.split(":").map(Number);
    slotEndTime.setHours(endHour, endMinute, 0, 0);

    // Check for overlapping bookings
    const existingBooking = await Booking.findOne({
      provider,
      bookingDate: {
        $gte: new Date(bookingDay),
        $lt: new Date(bookingDay.getTime() + 24 * 60 * 60 * 1000),
      },
      status: { $in: ["pending", "accept"] },
      $or: [
        {
          // New slot starts during existing booking
          $expr: {
            $and: [
              {
                $lte: [
                  {
                    $toDate: {
                      $concat: [
                        {
                          $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$bookingDate",
                          },
                        },
                        "T",
                        { $arrayElemAt: [{ $split: ["$timeSlot", "-"] }, 0] },
                        ":00",
                      ],
                    },
                  },
                  slotStartTime,
                ],
              },
              {
                $gt: [
                  {
                    $toDate: {
                      $concat: [
                        {
                          $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$bookingDate",
                          },
                        },
                        "T",
                        { $arrayElemAt: [{ $split: ["$timeSlot", "-"] }, 1] },
                        ":00",
                      ],
                    },
                  },
                  slotStartTime,
                ],
              },
            ],
          },
        },
        {
          // New slot ends during existing booking
          $expr: {
            $and: [
              {
                $lt: [
                  {
                    $toDate: {
                      $concat: [
                        {
                          $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$bookingDate",
                          },
                        },
                        "T",
                        { $arrayElemAt: [{ $split: ["$timeSlot", "-"] }, 0] },
                        ":00",
                      ],
                    },
                  },
                  slotEndTime,
                ],
              },
              {
                $gte: [
                  {
                    $toDate: {
                      $concat: [
                        {
                          $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$bookingDate",
                          },
                        },
                        "T",
                        { $arrayElemAt: [{ $split: ["$timeSlot", "-"] }, 1] },
                        ":00",
                      ],
                    },
                  },
                  slotEndTime,
                ],
              },
            ],
          },
        },
        {
          // New slot completely contains existing booking
          $expr: {
            $and: [
              {
                $gte: [
                  {
                    $toDate: {
                      $concat: [
                        {
                          $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$bookingDate",
                          },
                        },
                        "T",
                        { $arrayElemAt: [{ $split: ["$timeSlot", "-"] }, 0] },
                        ":00",
                      ],
                    },
                  },
                  slotStartTime,
                ],
              },
              {
                $lte: [
                  {
                    $toDate: {
                      $concat: [
                        {
                          $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$bookingDate",
                          },
                        },
                        "T",
                        { $arrayElemAt: [{ $split: ["$timeSlot", "-"] }, 1] },
                        ":00",
                      ],
                    },
                  },
                  slotEndTime,
                ],
              },
            ],
          },
        },
      ],
    });

    if (existingBooking) {
      return res.status(409).json({
        message: "This time slot is already booked for the provider",
      });
    }

    // ====== CREATE & SAVE BOOKING ======
    const newBooking = new Booking({
      customer,
      provider,
      address: address || {}, 
      paymentMethod,
      bookingDate: bookingDateObj,
      timeSlot,
      status: "pending",
      paymentStatus: paymentMethod === "cod" ? "pending" : "unpaid",
    });

    const savedBooking = await newBooking.save();

    // Optionally: Send notification to provider

    return res.status(201).json({
      message: "Booking created successfully",
      data: savedBooking,
    });
  } catch (error) {
    console.error("Booking Error:", error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
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
    if (!providerId)
      return res.status(400).json({ message: "providerId required" });
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    const bookings = await Booking.find({
      provider: providerId,
      bookingDate: { $gte: todayStart, $lte: todayEnd },
    })
      .populate("customer provider")
      .select("-customer.password -provider.password");
    res.status(200).json({ message: "Success", data: bookings });
  } catch (error) {
    res.status(500).json({ error, message: error?.message });
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
    const { providerId } = req.query;
    if (!providerId)
      return res.status(400).json({ message: "providerId required" });
    const tomorrow = new Date();
    tomorrow.setHours(0, 0, 0, 0);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const bookings = await Booking.find({
      provider: providerId,
      bookingDate: { $gte: tomorrow },
    })
      .populate("customer provider")
      .select("-customer.password -provider.password");
    res.status(200).json({ message: "Success", data: bookings });
  } catch (error) {
    res.status(500).json({ error, message: error?.message });
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
    const { providerId, filter } = req.query;
    if (!providerId)
      return res.status(400).json({ message: "providerId required" });
    let match = { provider: providerId };
    const now = new Date();
    if (filter === "today") {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      match.bookingDate = { $gte: start, $lte: end };
    } else if (filter === "week") {
      const start = new Date();
      start.setDate(now.getDate() - now.getDay());
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      match.bookingDate = { $gte: start, $lte: end };
    }
    const cancelledCount = await Booking.countDocuments({
      ...match,
      status: "rejected",
    });
    const completedCount = await Booking.countDocuments({
      ...match,
      status: "accept",
    });
    res.status(200).json({
      message: "Success",
      data: {
        cancelled: cancelledCount,
        completed: completedCount,
      },
    });
  } catch (error) {
    res.status(500).json({ error, message: error?.message });
  }
};
