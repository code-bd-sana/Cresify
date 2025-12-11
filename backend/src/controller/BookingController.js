import Booking from "../models/BookingModel.js";

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

// Get today's bookings for a provider
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

// Get upcoming bookings for a provider
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
