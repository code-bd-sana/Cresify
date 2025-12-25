import mongoose, { Schema } from "mongoose";

const ProviderAvailabilitySchema = new Schema(
  {
    provider: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    workingDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: String,
      default: "60m",
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Compound unique index - একই provider একই workingDate রাখতে পারবে না
ProviderAvailabilitySchema.index(
  { provider: 1, workingDate: 1 },
  { unique: true }
);

const ProviderAvailability = mongoose.model(
  "ProviderAvailability",
  ProviderAvailabilitySchema
);
export default ProviderAvailability;