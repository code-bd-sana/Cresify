"use client";

import Link from "next/link";
import { useMemo, useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  useBookServiceMutation,
  useGetProviderDatesQuery,
  useGetProviderTimeslotsQuery,
} from "@/feature/provider/ProviderApi";
import { toast, Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";
function BookingDateTimeContentPage() {
  const GRADIENT_FROM = "#9838E1";
  const GRADIENT_TO = "#F68E44";

  const [bookService, { isLoading: isBookingLoading, isError, error }] =
    useBookServiceMutation();

  const { data: session } = useSession();
  const userId = session?.user?.id;

  const searchParams = useSearchParams();
  const providerId = searchParams.get("id");
    const { t } = useTranslation('booking');

  // ---------------- STATE ----------------
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selectedDateId, setSelectedDateId] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    fullName: "",
    email: "",
    telephone: "",
    address: "",
    country: "",
    city: "",
    notes: "",
  });

  // Check if providerId is available
  useEffect(() => {
    if (!providerId) {
      toast.error("Provider ID is required");
    }
  }, [providerId]);

  // ---------------- API CALLS ----------------
  const { data: datesResponse, isLoading: datesLoading } =
    useGetProviderDatesQuery(providerId, {
      skip: !providerId, // Skip if no providerId
    });

  const { data: timeslotsResponse, isLoading: timeslotsLoading } =
    useGetProviderTimeslotsQuery(selectedDateId, {
      skip: !selectedDateId, // Skip if no date selected
    });

  const availableDates = datesResponse?.data || [];
  const timeSlots = timeslotsResponse?.data || [];

  // ---------------- CALENDAR - ONLY CURRENT MONTH ----------------
  const days = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const firstWeekday = firstDayOfMonth.getDay();

    const cells = [];

    // Add empty cells for days before the 1st of the month
    for (let i = 0; i < firstWeekday; i++) {
      cells.push({
        date: null,
        isCurrentMonth: false,
        isEmpty: true,
      });
    }

    // Add current month days
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i);

      // Check if this date is available
      const isAvailable = availableDates.some((date) => {
        const dateObj = new Date(date.workingDate);
        return (
          dateObj.getFullYear() === d.getFullYear() &&
          dateObj.getMonth() === d.getMonth() &&
          dateObj.getDate() === d.getDate()
        );
      });

      cells.push({
        date: d,
        isCurrentMonth: true,
        isEmpty: false,
        isAvailable: isAvailable,
      });
    }

    return cells;
  }, [availableDates]);

  const monthLabel = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  // Format time for display
  const formatTimeDisplay = (timeString) => {
    const [hour, minute] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hour), parseInt(minute));
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Calculate duration from time slot
  const calculateSlotDuration = (startTime, endTime) => {
    const start = parseTime(startTime);
    const end = parseTime(endTime);

    const diffMs = end - start;
    const diffHours = diffMs / (1000 * 60 * 60);
    const hours = Math.floor(diffHours);
    const minutes = Math.floor((diffHours - hours) * 60);

    if (hours === 0) return `${minutes} minutes`;
    if (minutes === 0) return `${hours} hour${hours > 1 ? "s" : ""}`;
    return `${hours}h ${minutes}m`;
  };

  // Parse time string to Date object
  const parseTime = (timeString) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  // Handle date selection
  const handleDateSelect = (day) => {
    if (!day.isAvailable) {
      toast.error("This date is not available for booking");
      return;
    }

    setSelectedDate(day.date);

    // Find the date object from availableDates
    const foundDate = availableDates.find((date) => {
      const dateObj = new Date(date.workingDate);
      return isSameDay(dateObj, day.date);
    });

    if (foundDate) {
      setSelectedDateId(foundDate._id);
      setSelectedTimeSlot(null); // Reset selected time slot
      setShowBookingForm(false); // Hide booking form

      console.log("📅 Selected Date:", {
        dateId: foundDate._id,
        workingDate: foundDate.workingDate,
        provider: foundDate.provider,
        date: day.date.toDateString(),
      });
    }
  };

  // Handle time slot selection
  const handleTimeSlotSelect = (slot) => {
    if (slot.isBooked) {
      toast.error("This time slot is already booked");
      return;
    }

    setSelectedTimeSlot(slot);
    setShowBookingForm(false); // Hide form until confirmed

    console.log("⏰ Selected Time Slot:", {
      slotId: slot._id,
      startTime: slot.startTime,
      endTime: slot.endTime,
      duration: calculateSlotDuration(slot.startTime, slot.endTime),
      availabilityId: slot.availability,
      isBooked: slot.isBooked,
    });
  };

  // Format date for display
  const formatDateDisplay = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get selected date object
  const getSelectedDateObject = () => {
    return availableDates.find((date) => {
      const dateObj = new Date(date.workingDate);
      return isSameDay(dateObj, selectedDate);
    });
  };

  // Check if selected date has available slots
  const hasAvailableSlots = timeSlots.some((slot) => !slot.isBooked);

  // Handle booking form change
  const handleBookingFormChange = (e) => {
    const { name, value } = e.target;
    setBookingForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle confirm booking
  const handleConfirmBooking = async (e) => {
    e.preventDefault();

    // Validate form
    if (
      !bookingForm.fullName ||
      !bookingForm.email ||
      !bookingForm.telephone ||
      !bookingForm.address ||
      !bookingForm.country ||
      !bookingForm.city
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(bookingForm.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Create booking data
    const bookingData = {
      // Provider Info
      provider: providerId,
      customer: userId,
      address: bookingForm.address,
      country: bookingForm.country,
      city: bookingForm.city,
      phone: bookingForm.telephone,
      fullName: bookingForm.fullName,

      dateId: selectedDateId,
      timeSlot: selectedTimeSlot._id,

      // Booking Details
      date: selectedDate.toISOString(),
      startTime: selectedTimeSlot.startTime,
      endTime: selectedTimeSlot.endTime,
      duration: calculateSlotDuration(
        selectedTimeSlot.startTime,
        selectedTimeSlot.endTime
      ),
      bookingDate: new Date().toISOString(),

      // Customer Info
      customerInfo: {
        fullName: bookingForm.fullName,
        email: bookingForm.email,
        telephone: bookingForm.telephone,
        address: bookingForm.address,
        country: bookingForm.country,
        city: bookingForm.city,
        notes: bookingForm.notes,
      },

      // Payment Info
      payment: {
        subtotal: 55,
        serviceCharge: 5,
        tax: ((55 + 5) * 0.05).toFixed(2),
        total: ((55 + 5) * 1.05).toFixed(2),
        currency: "USD",
        paymentStatus: "pending",
      },

      // Booking Status
      status: "confirmed",
      bookingReference: `BK-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`,
    };

    try {
      const result = await bookService(bookingData).unwrap();

      if (result?.checkoutUrl) {
        window.location.href = result.checkoutUrl;
             toast.success("Booking confirmed!")
             return;
      } else if (isError) {
        console.log(error, "error is here");
        toast.error(error.data?.message || "Failed to confirm booking");
      } else if (result?.data?.error) {
        toast.error(result.data.error || "Failed to confirm booking");
      } else {
        toast.success("Booking confirmed!");

        // Reset form after 2 seconds
        setTimeout(() => {
          setShowBookingForm(false);
          setSelectedTimeSlot(null);
          setBookingForm({
            fullName: "",
            email: "",
            telephone: "",
            address: "",
            country: "",
            city: "",
            notes: "",
          });
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while booking");
    }
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    const subtotal = 55; // Base price
    const serviceCharge = 5;
    const tax = (subtotal + serviceCharge) * 0.05;
    return (subtotal + serviceCharge + tax).toFixed(2);
  };

  // Countries list
  const countries = [
    "United States",
    "Canada",
    "United Kingdom",
    "Australia",
    "Germany",
    "France",
    "Japan",
    "India",
    "Bangladesh",
    "Other",
  ];

  // Show loading state
  if (!providerId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Provider ID Missing
          </h2>
          <p className="text-gray-600">
            Please provide a provider ID in the URL
          </p>
          <Link
            href="/services"
            className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg"
          >
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full bg-[#F7F7FA] py-10 px-6">
      <Toaster position="top-center" />
      <div className="mx-auto max-w-[1250px] grid gap-8">
        {/* ---------------- LEFT CARD ---------------- */}
        <div className="rounded-[20px] border border-[#ECE6F7] bg-white px-8 py-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
          {/* HEADER */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[13px] font-medium text-[#111827]">
              Select Date & Time
            </p>

            <div className="flex items-center">
              <span className="text-[14px] font-semibold text-[#111827]">
                {monthLabel}
              </span>
            </div>
          </div>

          {/* CALENDAR */}
          <div className="rounded-[16px] border border-[#F0E6FF] bg-[#FBFAFF] px-5 pt-4 pb-3">
            {/* Day Names */}
            <div className="mb-3 grid grid-cols-7 text-center text-[11px] font-medium text-[#A3A3B1]">
              {dayNames.map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-[6px] text-center">
              {days.map(
                ({ date, isCurrentMonth, isEmpty, isAvailable }, index) => {
                  if (isEmpty) {
                    return (
                      <div
                        key={`empty-${index}`}
                        className="flex h-[52px] items-center justify-center rounded-[10px] text-[12px]"
                      />
                    );
                  }

                  const isSelected = date && isSameDay(date, selectedDate);
                  const isToday = date && isSameDay(date, new Date());

                  let classes =
                    "flex h-[52px] items-center justify-center rounded-[10px] text-[12px] transition relative ";

                  if (!isAvailable) {
                    classes += "text-gray-400 cursor-not-allowed opacity-50";
                  } else {
                    classes +=
                      "cursor-pointer text-[#4B4B5C] hover:bg-[#F1E8FF]";
                  }

                  if (isSelected) {
                    classes =
                      "flex h-[52px] items-center justify-center rounded-[10px] text-[12px] border border-[#9D5CFF] bg-[#F6EEFF] text-[#7C35D8] shadow-[0_0_0_1px_rgba(152,56,225,0.12)]";
                  }

                  if (!isSelected && isToday) {
                    classes += " border border-[#E2D4FF]";
                  }

                  return (
                    <button
                      key={date.toISOString()}
                      onClick={() => handleDateSelect({ date, isAvailable })}
                      disabled={!isAvailable}
                      className={classes}
                    >
                      {date.getDate()}
                      {isAvailable && !isSelected && (
                        <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      )}
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* TIME SLOTS */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[13px] font-medium text-[#111827]">
                Available Time Slots
              </p>
              {getSelectedDateObject() && (
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  Available
                </span>
              )}
            </div>

            {!selectedDateId ? (
              <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500 mb-1">
                  Select an available date first
                </p>
                <p className="text-xs text-gray-400">
                  Dates with green dots are available
                </p>
              </div>
            ) : timeslotsLoading ? (
              <div className="text-center py-6">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                <p className="mt-2 text-xs text-gray-500">
                  Loading time slots...
                </p>
              </div>
            ) : timeSlots.length === 0 ? (
              <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500 mb-1">
                  No time slots available for this date
                </p>
                <p className="text-xs text-gray-400">
                  Please select another date
                </p>
              </div>
            ) : !hasAvailableSlots ? (
              <div className="text-center py-6 border-2 border-dashed border-red-300 rounded-lg">
                <p className="text-red-500 mb-1">
                  All slots are booked for this date
                </p>
                <p className="text-xs text-red-400">
                  Please select another date
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {timeSlots.map((slot) => {
                  const isActive = selectedTimeSlot?._id === slot._id;
                  const isBooked = slot.isBooked;
                  const slotDuration = calculateSlotDuration(
                    slot.startTime,
                    slot.endTime
                  );

                  return (
                    <button
                      key={slot._id}
                      onClick={() => handleTimeSlotSelect(slot)}
                      disabled={isBooked}
                      className={
                        "p-4 rounded-[12px] text-center transition relative " +
                        (isBooked
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                          : isActive
                          ? "bg-gradient-to-r from-[#F7F4FF] to-[#FFF7F0] text-[#7A3CE5] shadow-[0_4px_14px_rgba(0,0,0,0.12)] relative overflow-hidden border-2 border-[#9D5CFF]"
                          : "border border-[#E4DDF5] bg-white text-[#4B4B5C] hover:border-[#C5B5FF] hover:bg-gray-50")
                      }
                    >
                      {isActive && (
                        <span
                          className="absolute inset-0 rounded-[10px]"
                          style={{
                            padding: "2px",
                            backgroundImage:
                              "linear-gradient(90deg,#9838E1,#F68E44)",
                            WebkitMask:
                              "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                            WebkitMaskComposite: "xor",
                            maskComposite: "exclude",
                          }}
                        />
                      )}

                      <div className="relative">
                        <div className="text-sm font-medium mb-1">
                          {formatTimeDisplay(slot.startTime)}
                        </div>
                        <div className="text-xs text-gray-500 mb-1">to</div>
                        <div className="text-sm font-medium mb-2">
                          {formatTimeDisplay(slot.endTime)}
                        </div>
                        <div className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full inline-block">
                          {slotDuration}
                        </div>
                      </div>

                      {isBooked && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">×</span>
                        </span>
                      )}

                      {isActive && !isBooked && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* BOOK SLOT BUTTON */}
          <div className="mt-6">
            <button
              onClick={() => {
                if (!selectedDateId || !selectedTimeSlot) {
                  toast.error("Please select date and time slot first");
                  return;
                }
                setShowBookingForm(true);
              }}
              disabled={!selectedDateId || !selectedTimeSlot}
              className="w-full h-[46px] rounded-[12px] text-white text-[13px] font-medium shadow-[0_6px_18px_rgba(0,0,0,0.20)] transition disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)]"
              style={{
                backgroundImage: "linear-gradient(90deg,#9838E1,#F68E44)",
              }}
            >
           {t('book')}
            </button>
          </div>
        </div>
      </div>

      {/* BOOKING FORM MODAL */}
      {showBookingForm && selectedTimeSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Form Header */}
            <div className="sticky top-0 bg-white px-8 py-6 border-b border-gray-200 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Complete Your Booking
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Please fill in your details to confirm the booking
                  </p>
                </div>
                <button
                  onClick={() => setShowBookingForm(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Booking Summary */}
              <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600">Date</p>
                    <p className="font-medium text-gray-800">
                      {formatDateDisplay(selectedDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Time Slot</p>
                    <p className="font-medium text-gray-800">
                      {formatTimeDisplay(selectedTimeSlot.startTime)} -{" "}
                      {formatTimeDisplay(selectedTimeSlot.endTime)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleConfirmBooking} className="p-8">
              <div className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Personal Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={bookingForm.fullName}
                        onChange={handleBookingFormChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={bookingForm.email}
                        onChange={handleBookingFormChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                        placeholder="yourname@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telephone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="telephone"
                      value={bookingForm.telephone}
                      onChange={handleBookingFormChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      placeholder="+880 1234 567890"
                      required
                    />
                  </div>
                </div>

                {/* Address Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Address Information
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="address"
                        value={bookingForm.address}
                        onChange={handleBookingFormChange}
                        rows="2"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                        placeholder="Street, city, region"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Country <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="country"
                          value={bookingForm.country}
                          onChange={handleBookingFormChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                          required
                        >
                          <option value="">Select Country</option>
                          {countries.map((country) => (
                            <option key={country} value={country}>
                              {country}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={bookingForm.city}
                          onChange={handleBookingFormChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                          placeholder="Your city"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Additional Information
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes (Optional)
                    </label>
                    <textarea
                      name="notes"
                      value={bookingForm.notes}
                      onChange={handleBookingFormChange}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      placeholder="Any special requirements or instructions..."
                    />
                  </div>
                </div>

                {/* Price Summary */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Price Summary
                  </h3>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Service Fee</span>
                      <span className="text-gray-800">$55.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service Charge</span>
                      <span className="text-gray-800">$5.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (5%)</span>
                      <span className="text-gray-800">
                        ${((55 + 5) * 0.05).toFixed(2)}
                      </span>
                    </div>
                    <div className="border-t border-gray-300 pt-2 mt-2">
                      <div className="flex justify-between text-lg font-bold text-gray-800">
                        <span>Total Amount</span>
                        <span>${calculateTotalPrice()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <span className="font-semibold">Note:</span> Payment will
                      be collected at the time of service.
                    </p>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowBookingForm(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isBookingLoading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[#9838E1] to-[#F68E44] text-white font-medium rounded-lg hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isBookingLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg width="17" height="17" fill="white">
                          <path d="M4 7l4 4 8-8" />
                        </svg>
                        Confirm Booking
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

import React from 'react';
import { useTranslation } from "react-i18next";

const BookingDateTimePage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <BookingDateTimeContentPage />
      </Suspense>
      
    </div>
  );
};

export default BookingDateTimePage;