import mongoose, { Schema } from "mongoose";

const ProviderAvailabilitySchema = new Schema(
  {
    provider: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    workingDays: [
      {
        type: String,
        enum: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      },
    ],
    workingHours: {
      start: { type: String, required: true }, // e.g. "09:00 AM"
      end: { type: String, required: true }, // e.g. "06:00 PM"
    },
    slotDuration: {
      type: Number,
      default: 60, // in minutes
    },
    blockedDates: [{ type: Date }], // full days blocked
    blockedSlots: [
      {
        date: { type: Date, required: true },
        time: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

const ProviderAvailability = mongoose.model(
  "ProviderAvailability",
  ProviderAvailabilitySchema
);
export default ProviderAvailability;
