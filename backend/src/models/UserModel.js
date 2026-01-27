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
    servicesImage: {
      type: [String], // Array of image URLs
      default: []
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
      default: function () {
        if (this.role === "provider") {
          return "pending";
        }
        return "active";
      },
    },

    // Store Information
    shopName: { type: String, default: "" },
    shopDescription: { type: String, default: "" },
    shopLogo: { type: String, default: "" },
    website: { type: String, default: "" },
    
    // Service Information
    serviceName: { type: String, default: "" },
    serviceCategory: { type: String, default: "" },
    serviceArea: { type: String, default: "" },
    serviceRedius: { type: Number, default: 0 },
    hourlyRate: { type: Number, default: 0 },
    yearsofExperience: { type: String, default: "" },
    serviceDescription: { type: String, default: "" },
    
    // Social Media Links
    instagram: { type: String, default: "" },
    facebook: { type: String, default: "" },
    twitter: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    
    // Working Hours
    workingHours: {
      start: { type: String, default: "09:00" },
      end: { type: String, default: "18:00" }
    },
    slotDuration: { type: Number, default: 30 },
    workingDays: [
      { type: String, enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
    ],
    
    // Location
    country: { type: String, default: "" },
    region: { type: String, default: "" },
    city: { type: String, default: "" },
    
    // Store Statistics
    rating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    totalProducts: { type: Number, default: 0 },
    totalServices: { type: Number, default: 0 },
    
    // Verification
    isVerified: { type: Boolean, default: false },
    verificationDate: { type: Date },
    
    // Store Settings
    storeTheme: { 
      type: String, 
      enum: ["light", "dark", "purple", "blue"],
      default: "light"
    },
    currency: { 
      type: String, 
      default: "USD" 
    },
    language: { 
      type: String, 
      default: "en" 
    },
    
    // Payment Information
    paymentMethods: [{
      type: { type: String, enum: ["card", "paypal", "bank"] },
      details: { type: String }
    }],
    
    // Store Policies
    returnPolicy: { type: String, default: "" },
    shippingPolicy: { type: String, default: "" },
    privacyPolicy: { type: String, default: "" },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for full address
userSchema.virtual('fullAddress').get(function() {
  return [this.address, this.city, this.region, this.country].filter(Boolean).join(', ');
});

// Virtual for social media links
userSchema.virtual('socialLinks').get(function() {
  return {
    website: this.website,
    instagram: this.instagram,
    facebook: this.facebook,
    twitter: this.twitter,
    linkedin: this.linkedin
  };
});

// Method to check if store is open
userSchema.methods.isStoreOpen = function() {
  const now = new Date();
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'short' });
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  if (!this.workingDays.includes(currentDay)) return false;
  
  const [startHour, startMinute] = this.workingHours.start.split(':').map(Number);
  const [endHour, endMinute] = this.workingHours.end.split(':').map(Number);
  
  const startTime = startHour * 60 + startMinute;
  const endTime = endHour * 60 + endMinute;
  
  return currentTime >= startTime && currentTime <= endTime;
};

// Method to get next available slot
userSchema.methods.getNextAvailableSlot = function() {
  if (!this.isStoreOpen()) return null;
  
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const [startHour, startMinute] = this.workingHours.start.split(':').map(Number);
  const startTime = startHour * 60 + startMinute;
  
  // Find next slot starting from current time or store opening time
  const baseTime = Math.max(currentMinutes, startTime);
  const nextSlot = Math.ceil(baseTime / this.slotDuration) * this.slotDuration;
  
  return nextSlot;
};

const User = mongoose.model("User", userSchema);
export default User;