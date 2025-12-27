import mongoose, { Schema } from "mongoose";
import ProviderAvailability from "./ProviderAvailabilityModel.js";
import Timeslot from "./TimeSlotModel.js";
import User from "./UserModel.js";

export const BookingSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: User,
    },
    provider: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: User,
    },
    dateId: {
      type: Schema.Types.ObjectId,
      ref: ProviderAvailability,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "rejected",
        "accept",
        "processing",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "card"],
    },
    timeSlot: {
      type: Schema.Types.ObjectId,
      ref: Timeslot,
      required: true,
      unique: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "processing", "failed"], // "processing" add koro
      default: "pending",
    },
  },
  { timestamps: true }
);
BookingSchema.index({ provider: 1, status: 1, bookingDate: 1 });
BookingSchema.index({ provider: 1, bookingDate: 1 });
BookingSchema.index({ customer: 1 });
BookingSchema.index({
  provider: 1,
  bookingDate: 1,
  "timeSlot.start": 1,
  "timeSlot.end": 1,
});

const Booking = mongoose.model("booking", BookingSchema);

export default Booking;
