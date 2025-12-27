import ProviderAvailability from "../../models/ProviderAvailabilityModel.js";
import Timeslot from "../../models/TimeSlotModel.js";

// ========== DATE CONTROLLERS ==========
export const createDate = async (req, res) => {
  try {
    const { provider, workingDate } = req.body;

    // Check if date already exists for this provider (same day)
    const date = new Date(workingDate);
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
    const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);

    const existingDate = await ProviderAvailability.findOne({
      provider: provider,
      workingDate: {
        $gte: startOfDay,
        $lt: endOfDay
      }
    });

    if (existingDate) {
      return res.status(400).json({
        message: "This date already exists for the provider",
        data: existingDate
      });
    }

    const newAvailability = new ProviderAvailability(req.body);
    const saved = await newAvailability.save();
    
    res.status(200).json({
      message: "Date created successfully",
      data: saved
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "This date already exists for the provider",
      });
    }
    res.status(500).json({
      error: error.message,
      message: "Something went wrong!"
    });
  }
};

export const deleteDate = async (req, res) => {
  try {
    const { id } = req.params;
    
    // First delete all timeslots for this date
    await Timeslot.deleteMany({ availability: id });
    
    // Then delete the date
    const deleted = await ProviderAvailability.deleteOne({ _id: id });
    
    res.status(200).json({
      message: "Date and associated timeslots deleted successfully",
      data: deleted
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Something went wrong!"
    });
  }
};

export const getProviderDates = async (req, res) => {
  try {
    const { id } = req.params;
    const dates = await ProviderAvailability.find({ provider: id }).sort({ workingDate: 1 });
    res.status(200).json({
      message: "Success",
      data: dates
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Something went wrong!"
    });
  }
};

// ========== TIME SLOT CONTROLLERS ==========
export const createTimeslot = async (req, res) => {
  try {
    const { availability, startTime, endTime } = req.body;

    // Check if timeslot already exists for this availability
    const existingSlot = await Timeslot.findOne({
      availability: availability,
      startTime: startTime,
      endTime: endTime
    });

    if (existingSlot) {
      return res.status(400).json({
        message: "This time slot already exists for the selected date",
      });
    }

    const newTimeslot = new Timeslot(req.body);
    const saved = await newTimeslot.save();
    
    res.status(200).json({
      message: "Time slot created successfully",
      data: saved
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Time slot storing problem occurred"
    });
  }
};

export const deleteTimeslot = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Timeslot.deleteOne({ _id: id });
    res.status(200).json({
      message: "Time sltot deleted successfully",
      data: deleted
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Something went wrong!"
    });
  }
};

export const getProviderTimeslots = async (req, res) => {
  try {
    const { date } = req.params; // date = availabilityId (ProviderAvailability._id)

    console.log(date, 'kire mdrct');
    const timeslots = await Timeslot.find({ availability: date }).sort({ startTime: 1 });
    res.status(200).json({
      message: "Success",
      data: timeslots
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Something went wrong!"
    });
  }
};