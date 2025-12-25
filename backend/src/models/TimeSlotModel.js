import mongoose, { Schema } from "mongoose";

const TimeSlotSchema = new Schema(
  {
    availability: {
      type: Schema.Types.ObjectId,
      ref: "ProviderAvailability",
      required: true,
    },
    startTime: {
      type: String, // Format: "HH:MM" (24-hour format)
      required: true,
    },
    endTime: {
      type: String, // Format: "HH:MM" (24-hour format)
      required: true,
    },
    duration: {
      type: String,
      default: "60m",
    },
    isBooked: {
      type: Boolean,
      default: false,
    },
    bookedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Compound index to prevent duplicate time slots for same availability
TimeSlotSchema.index(
  { availability: 1, startTime: 1, endTime: 1 },
  { unique: true }
);

const Timeslot = mongoose.model("Timeslot", TimeSlotSchema);
export default Timeslot;