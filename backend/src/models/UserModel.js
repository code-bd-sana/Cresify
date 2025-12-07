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

    fullName: {
      type: String,
    },

    adress:String,
    businessLogo:String,
    category:String,
    nationalId:String,
    registrationDate:String,
    
    phoneNumber: {
      type: String,
    },
    status:{
        type:String,
        enum:['pending', 'active', 'suspend']

    },

    shopName: String,
    categories: String,
    serviceName: String,
    serviceCategory: String,
    serviceArea: String,
    serviceRedius: Number,
    hourlyRate: Number,
    yearsofExperience: String,
    serviceDescription: String,
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
