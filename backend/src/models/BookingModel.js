import mongoose, { Schema } from "mongoose";
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
    address: {
      street: {
        type: String,
        required: [true, "Street is required"],
        trim: true,
      },
      city: {
        type: String,
        required: [true, "City is required"],
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      postalCode: {
        type: String,
        trim: true,
      },
      fullName: String,
      country: {
        type: String,
        required: [true, "Country is required"],
        trim: true,
      },
    },
    status: {
      type: String,
      enum: ["pending", "rejected", "accept"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      required: [true, "Payment method is Required"],
      enum: ["cod", "card"],
    },
    // Booking date & time
    bookingDate: {
      type: Date,
      required: true,
    },
    timeSlot: {
      start: { type: String, required: true },
      end: { type: String, required: true },
    },
    paymentStatus: {type: String, enum: ["pending", "completed"], default: "pending"},
  },
  { timestamps: true }
);

const Booking = mongoose.model("booking", BookingSchema);

export default Booking;
