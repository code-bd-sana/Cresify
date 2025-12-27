import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is Required"],
    },
    role: {
      type: String,
      required: [true, "Role is Required"],
      enum: ["buyer", "provider", "seller", "admin"],
    },
    name: {
      type: String,
    },
    servicesImage:{
      type:Array
    },

    address: { type: String, default: "" },
    businessLogo: { type: String, default: "" },
    category: { type: String, default: "" },
    nationalId: { type: String, default: "" },
    registrationDate: { type: String, default: "" },
    image: { type: String, default: "" },

    phoneNumber: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "active", "suspend"],
      default: "active",
    },
    shopName: { type: String, default: "" },
    serviceName: { type: String, default: "" },
    serviceCategory: { type: String, default: "" },
    serviceArea: { type: String, default: "" },
    serviceRedius: { type: Number, default: 0 },
    hourlyRate: { type: Number, default: 0 },
    yearsofExperience: { type: String, default: "" },
    serviceDescription: { type: String, default: "" },
    website: { type: String, default: "" },
    shopDescription: { type: String, default: "" },
    shopLogo: { type: String, default: "" },
    country:String,
    region:String,
    city:String,
    address:String,

    workingHours: {
      start: { type: String, default: "09:00" },
      end: { type: String, default: "18:00" },
    },
    slotDuration: { type: Number, default: 30 },
    workingDays: [
      { type: String, enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
