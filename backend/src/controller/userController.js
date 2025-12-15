import bcrypt from "bcrypt";
import mongoose from "mongoose";
import Booking from "../models/BookingModel.js";
import ProviderAvailability from "../models/ProviderAvailabilityModel.js";
import User from "../models/UserModel.js";
import {
  extractBase64FromDataURL,
  uploadImageToImgBB,
} from "../utils/imageUpload.js";
export const saveUser = async (req, res) => {
  try {
    const data = await req.body;

    const isExist = await User.findOne({ email: data.email });

    if (isExist) {
      res.status(401).json({
        message: "User already exist!",
      });
    }

    const plainPassword = data.password;
    const hashPassword = await bcrypt.hash(plainPassword, 10);
    data.password = hashPassword;

    const newUser = User(data);
    const saved = await newUser.save();

    res.status(200).json({
      message: "Success",
      data: saved,
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: error?.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const isExist = await User.findOne({ email });

    if (!isExist) {
      return res.status(401).json({
        message: "User not found!",
      });
    }

    const compare = await bcrypt.compare(password, isExist.password);
    if (!compare) {
      return res.status(401).json({
        message: "Wrong password!",
      });
    }

    // remove password
    const { password: pwd, ...safeUser } = isExist._doc;

    res.status(200).json({
      message: "Success",
      data: safeUser,
    });
  } catch (error) {
    res.status(500).json({
      message: error?.message,
      error,
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { id, oldPassword, newPassword } = req.body;
    console.log(id, oldPassword, newPassword, "old password is here");

    const isExist = await User.findOne({ _id: id });

    if (!isExist) {
      res.status(401).json({
        message: "User not found!",
      });
      return;
    }

    const compare = await bcrypt.compare(oldPassword, isExist.password);

    console.log(compare, "he he compare");

    if (!compare) {
      res.status(401).json({
        message: "Password does not matched!",
      });
      return;
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);

    const updated = await User.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          password: hashPassword,
        },
      }
    );

    res.status(201).json({
      message: "Success",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: error?.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  console.log(req.body, "hey");
  try {
    const id = req.body.id; // Ensure you're using the correct identifier (you had `id = req.body` previously)

    const {
      name,
      phoneNumber,
      shopName,
      categories,
      serviceName,
      serviceCategory,
      serviceArea,
      shopDescription,
      serviceRedius,

      address,
      hourlyRate,
      yearsofExperience,
      serviceDescription,
      category,
      website,
      shopLogo,
    } = req.body;

    // Perform the update operation
    const updated = await User.updateOne(
      { _id: id },
      {
        $set: {
          name,
          phoneNumber,
          shopName,
          categories,
          serviceName,
          serviceCategory,
          serviceArea,
          serviceRedius,
          hourlyRate,
          yearsofExperience,
          serviceDescription,
          shopDescription,
          addresss: address,

          category,
          website,
          shopLogo,
        },
      }
    );

    // Return a simple success message or the update count
    res.status(200).json({
      message: "Profile updated successfully",
      updatedCount: updated.nModified, // `nModified` will tell you how many documents were modified
    });
  } catch (error) {
    console.log(error, "Tumi aamar personal error");
    res.status(500).json({
      error: error.message || error,
      message: "An error occurred while updating the profile",
    });
  }
};

export const myProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const proflie = await User.findOne({ _id: id });
    res.status(200).json({
      message: "Success",
      data: proflie,
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: error?.message,
    });
  }
};

export const registerProvider = async (req, res) => {
  try {
    const data = req.body;

    const isExist = await User.findOne({ email: data.email });

    if (isExist) {
      return res.status(401).json({
        message: "User already exist!",
      });
    }

    let imageUrl = "";
    if (data.image) {
      try {
        const base64 = extractBase64FromDataURL(data.image);
        if (base64) {
          const uploadResult = await uploadImageToImgBB(base64);
          imageUrl = uploadResult.url;
        }
      } catch (uploadError) {
        console.error("Image upload failed:", uploadError);
        // Continue without image or handle error? For now continuing but could throw.
      }
    }

    const plainPassword = data.password;
    const hashPassword = await bcrypt.hash(plainPassword, 10);

    // Create new user object with provider role and uploaded image
    const userData = {
      ...data,
      password: hashPassword,
      role: "provider",
      image: imageUrl,
      businessLogo: imageUrl,
    };

    const newUser = User(userData);
    const saved = await newUser.save();

    res.status(200).json({
      message: "Success",
      data: saved,
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: error?.message,
    });
  }
};

export const getServiceProviders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Fetch providers with pagination, sorting by newest first
    const providers = await User.find({ role: "provider" })
      .select("-password") // Exclude password
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments({ role: "provider" });
    const hasMore = skip + providers.length < total;

    res.status(200).json({
      message: "Success",
      data: providers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasMore,
      },
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: error?.message,
    });
  }
};

export const getSingleProvider = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Get provider + availability in parallel
    const [provider, availabilityDoc] = await Promise.all([
      User.findOne({ _id: id, role: "provider" }).select("-password").lean(),
      ProviderAvailability.findOne({ provider: id }).lean(),
    ]);

    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    // Fallback to User model fields if no availability doc
    const workingDays = availabilityDoc?.workingDays?.length
      ? availabilityDoc.workingDays
      : provider.workingDays || [];

    const workingHours = availabilityDoc?.workingHours || {
      start: provider.workingHours?.start || "09:00",
      end: provider.workingHours?.end || "18:00",
    };

    const slotDuration =
      availabilityDoc?.slotDuration || provider.slotDuration || 60;

    const blockedDates = (availabilityDoc?.blockedDates || []).map(
      (d) => new Date(d).toISOString().split("T")[0]
    );

    // 2. Get ONLY next 7 days (you said 7 days now)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sevenDaysLater = new Date(today);
    sevenDaysLater.setDate(today.getDate() + 7);

    // ONE SUPER FAST AGGREGATION QUERY
    const bookedSlots = await Booking.aggregate([
      {
        $match: {
          provider: new mongoose.Types.ObjectId(id),
          status: "accept",
          bookingDate: { $gte: today, $lt: sevenDaysLater },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$bookingDate" } },
          slots: {
            $push: { $concat: ["$timeSlot.start", "-", "$timeSlot.end"] },
          },
        },
      },
    ]);

    // Manual blocked slots (from ProviderAvailability)
    const manualBlocked = (availabilityDoc?.blockedSlots || [])
      .filter((bs) => {
        const d = new Date(bs.date);
        return d >= today && d < sevenDaysLater;
      })
      .reduce((acc, bs) => {
        const dateStr = new Date(bs.date).toISOString().split("T")[0];
        const key = bs.time;
        if (!acc[dateStr]) acc[dateStr] = [];
        if (!acc[dateStr].includes(key)) acc[dateStr].push(key);
        return acc;
      }, {});

    // Merge booked + manual blocked
    const blockedSlotsMap = {};
    bookedSlots.forEach((item) => {
      blockedSlotsMap[item._id] = item.slots;
    });
    Object.entries(manualBlocked).forEach(([date, slots]) => {
      if (!blockedSlotsMap[date]) blockedSlotsMap[date] = [];
      blockedSlotsMap[date] = [
        ...new Set([...blockedSlotsMap[date], ...slots]),
      ];
    });

    // Helper: 24h → 12h
    const formatTime12 = (time24) => {
      const [h, m] = time24.split(":");
      const hour = parseInt(h);
      const suffix = hour >= 12 ? "PM" : "AM";
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      return `${displayHour}:${m} ${suffix}`;
    };

    // Generate only next 7 working days
    const availableDates = [];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];
      const dayName = dayNames[date.getDay()];

      if (!workingDays.includes(dayName) || blockedDates.includes(dateStr))
        continue;

      // Generate slots
      const startHour = parseInt(workingHours.start.split(":")[0], 10);
      const endHour = parseInt(workingHours.end.split(":")[0], 10);

      const slots = [];
      let time = new Date(date);
      time.setHours(startHour, 0, 0, 0);
      const endTime = new Date(date);
      endTime.setHours(endHour, 0, 0, 0);

      while (time < endTime) {
        const startStr = time.toTimeString().slice(0, 5);
        const endTemp = new Date(time);
        endTemp.setMinutes(endTemp.getMinutes() + slotDuration);
        const endStr = endTemp.toTimeString().slice(0, 5);

        const key = `${startStr}-${endStr}`;
        slots.push({
          key,
          display: `${formatTime12(startStr)} - ${formatTime12(endStr)}`,
        });

        time = endTemp;
      }

      const blockedKeys = blockedSlotsMap[dateStr] || [];
      const blockedDisplays = slots
        .filter((s) => blockedKeys.includes(s.key))
        .map((s) => s.display);

      availableDates.push({
        date: dateStr,
        blockedSlots: blockedDisplays,
      });
    }

    // Final clean response
    res.status(200).json({
      message: "Success",
      data: {
        ...provider,
        availability: {
          blockedDates: blockedDates.filter((d) => {
            const dt = new Date(d);
            return dt >= today && dt < sevenDaysLater;
          }),
          availableDays: workingDays,
          availableDates,
        },
      },
    });
  } catch (error) {
    console.error("getSingleProvider error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
