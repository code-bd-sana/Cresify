import Booking from "../models/BookingModel.js";
import ProviderAvailability from "../models/ProviderAvailabilityModel.js";

// Get provider's availability settings
export const getProviderAvailability = async (req, res) => {
  try {
    const { providerId } = req.params;
    const availability = await ProviderAvailability.findOne({
      provider: providerId,
    });
    res.status(200).json({ success: true, data: availability });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update provider's availability settings
export const updateProviderAvailability = async (req, res) => {
  try {
    const { providerId } = req.params;
    const { workingDays, workingHours, slotDuration } = req.body;
    const updated = await ProviderAvailability.findOneAndUpdate(
      { provider: providerId },
      { workingDays, workingHours, slotDuration },
      { upsert: true, new: true }
    );
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Block a full day for provider
export const blockProviderDay = async (req, res) => {
  try {
    const { providerId } = req.params;
    const { date } = req.body;
    const updated = await ProviderAvailability.findOneAndUpdate(
      { provider: providerId },
      { $addToSet: { blockedDates: date } },
      { upsert: true, new: true }
    );
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Block a specific slot for provider
export const blockProviderSlot = async (req, res) => {
  try {
    const { providerId } = req.params;
    const { date, time } = req.body;
    const updated = await ProviderAvailability.findOneAndUpdate(
      { provider: providerId },
      { $addToSet: { blockedSlots: { date, time } } },
      { upsert: true, new: true }
    );
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all bookings for a provider for a specific date
export const getProviderBookingsForDate = async (req, res) => {
  try {
    const { providerId } = req.params;
    const { date } = req.query;
    const bookings = await Booking.find({
      provider: providerId,
      bookingDate: { $eq: new Date(date) },
    });
    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
