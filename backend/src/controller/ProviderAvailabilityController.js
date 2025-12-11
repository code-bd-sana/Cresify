import Booking from "../models/BookingModel.js";
import ProviderAvailability from "../models/ProviderAvailabilityModel.js";

/**
 * Get provider's availability settings
 * @route GET /provider-availability/:providerId
 * @param {string} req.params.providerId - Provider ID
 * @returns {Object} 200 - Provider availability data
 */
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

/**
 * Update provider's availability settings
 * @route PUT /provider-availability/:providerId
 * @param {string} req.params.providerId - Provider ID
 * @param {Array<string>} req.body.workingDays - Working days
 * @param {Object} req.body.workingHours - Working hours
 * @param {number} req.body.slotDuration - Slot duration in minutes
 * @returns {Object} 200 - Updated provider availability
 */
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

/**
 * Block a full day for provider
 * @route POST /provider-availability/:providerId/block-day
 * @param {string} req.params.providerId - Provider ID
 * @param {string} req.body.date - Date to block (ISO string)
 * @returns {Object} 200 - Updated provider availability
 */
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

/**
 * Block a specific slot for provider
 * @route POST /provider-availability/:providerId/block-slot
 * @param {string} req.params.providerId - Provider ID
 * @param {string} req.body.date - Date of slot (ISO string)
 * @param {string} req.body.time - Time of slot (e.g., '08:00 AM')
 * @returns {Object} 200 - Updated provider availability
 */
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

/**
 * Get all bookings for a provider for a specific date
 * @route GET /provider-availability/:providerId/bookings
 * @param {string} req.params.providerId - Provider ID
 * @param {string} req.query.date - Date to fetch bookings for (ISO string)
 * @returns {Object} 200 - List of bookings for the date
 */
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
