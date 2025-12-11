import Booking from "../models/BookingModel.js";

/**
 * Save a new booking
 * @route POST /booking
 * @param {Object} req.body - Booking data
 * @returns {Object} 200 - Success message and saved booking
 */
export const saveBooking = async (req, res) => {
  try {
    const data = req.body;
    const newBooking = new Booking(data);
    const saved = newBooking.save();
    res.status(200).json({
      message: "Success",
      data: saved,
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: error?.message,
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
