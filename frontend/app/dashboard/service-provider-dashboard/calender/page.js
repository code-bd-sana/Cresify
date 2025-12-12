"use client";

import { useState } from "react";
import { FiChevronLeft, FiChevronRight, FiClock } from "react-icons/fi";

export default function AvailabilityPage() {
  // simple UI states (for highlight only)
  const [selectedDate, setSelectedDate] = useState("7");
  const [selectedDuration, setSelectedDuration] = useState("60m");

  const calendarDays = [
    { label: "30", muted: true },
    { label: "31", muted: true },
    { label: "1", highlight: true },
    { label: "2" },
    { label: "3", highlight: true },
    { label: "4", highlight: true },
    { label: "5" },
    { label: "6" },
    { label: "7", highlight: true },
    { label: "8", highlight: true },
    { label: "9", highlight: true },
    { label: "10" },
    { label: "11" },
    { label: "12" },
    { label: "13" },
    { label: "14" },
    { label: "15" },
    { label: "16" },
    { label: "17" },
    { label: "18" },
    { label: "19" },
    { label: "20" },
    { label: "21" },
    { label: "22" },
    { label: "23" },
    { label: "24" },
    { label: "7", isSecondRow: true }, // outlined one in screenshot
    { label: "26" },
    { label: "27" },
    { label: "28" },
    { label: "29", highlight: true },
    { label: "30" },
    { label: "01", muted: true },
    { label: "02", muted: true },
    { label: "03", muted: true },
  ];

  const slots = [
    { time: "09:00 AM", name: "Makbul Hossain Tamim", status: "Booked" },
    { time: "10:00 AM", name: "Makbul Hossain Tamim", status: "Booked" },
    { time: "11:00 AM", name: "", status: "Block" },
    { time: "12:00 PM", name: "Makbul Hossain Tamim", status: "Booked" },
    { time: "01:00 PM", name: "Makbul Hossain Tamim", status: "Booked" },
    { time: "02:00 PM", name: "", status: "Block" },
  ];

  const workingDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const activeWorkingDays = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const durations = ["30m", "60m", "90m", "120m"];

  return (
    <div className='min-h-screen px-2 pt-6 flex justify-center'>
      <div className='w-full space-y-6'>
        {/* ================== TOP: CALENDAR + SLOTS ================== */}
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-5'>
          {/* LEFT: CALENDAR CARD */}
          <div className='bg-white rounded-2xl border border-[#EFE9FF] shadow-sm p-5'>
            <h2 className='text-[18px] font-semibold text-gray-900 mb-4'>
              Select Date &amp; Time
            </h2>

            {/* Month header */}
            <div className='flex items-center justify-between mb-3'>
              <button className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100'>
                <FiChevronLeft className='text-gray-500' />
              </button>
              <p className='text-sm font-medium text-gray-800'>October 2024</p>
              <button className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100'>
                <FiChevronRight className='text-gray-500' />
              </button>
            </div>

            {/* Week days header */}
            <div className='grid grid-cols-7 text-center text-[11px] text-gray-400 mb-2'>
              <span>Su</span>
              <span>Mo</span>
              <span>Tu</span>
              <span>We</span>
              <span>Th</span>
              <span>Fr</span>
              <span>Sa</span>
            </div>

            {/* Calendar days */}
            <div className='grid grid-cols-7 gap-y-2 text-[13px]'>
              {calendarDays.map((d, idx) => {
                const isSelected =
                  d.label === selectedDate &&
                  !d.muted &&
                  !d.highlight &&
                  !d.isSecondRow;
                const isOutline = d.label === "7" && d.isSecondRow;
                const isPurpleDot = d.highlight;

                return (
                  <button
                    key={idx}
                    type='button'
                    onClick={() => setSelectedDate(d.label)}
                    className={[
                      "flex items-center justify-center h-10 rounded-xl transition",
                      d.muted ? "text-[#F97316]" : "text-gray-800",
                      isPurpleDot ? "text-white bg-[#8B5CF6]" : "",
                      isOutline ? "border border-[#C4B5FD] text-[#8B5CF6]" : "",
                      !isPurpleDot && !isOutline && !d.muted
                        ? "hover:bg-gray-100"
                        : "",
                    ].join(" ")}>
                    {d.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT: SLOTS CARD */}
          <div className='bg-white rounded-2xl border border-[#EFE9FF] shadow-sm p-5 flex flex-col'>
            <h2 className='text-[18px] font-semibold text-gray-900 mb-4'>
              Friday, Oct 07
            </h2>

            <div className='space-y-2 flex-1'>
              {slots.map((slot, idx) => (
                <div
                  key={idx}
                  className='flex items-center justify-between rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3'>
                  <div>
                    <p className='text-sm font-medium text-gray-900'>
                      {slot.time}
                    </p>
                    {slot.name && (
                      <p className='text-xs text-gray-500 mt-1'>{slot.name}</p>
                    )}
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      slot.status === "Booked"
                        ? "text-[#3B82F6]"
                        : "text-[#EF4444]"
                    }`}>
                    {slot.status}
                  </span>
                </div>
              ))}
            </div>

            <button className='mt-4 w-full py-3 rounded-xl text-white font-medium bg-gradient-to-r from-[#8736C5] to-[#F88D25] shadow hover:opacity-90 transition'>
              Block Entire Day
            </button>
          </div>
        </div>

        {/* ================== BOTTOM: AVAILABILITY SETTINGS ================== */}
        <div className='bg-white rounded-2xl border border-[#EFE9FF] shadow-sm p-5 space-y-4'>
          <h2 className='text-[18px] font-semibold text-gray-900'>
            Availability Settings
          </h2>

          {/* WORKING DAYS + HOURS + DURATION */}
          <div className='grid grid-cols-1 md:grid-cols-[2fr_2fr_2fr] gap-4 mt-2'>
            {/* Working Days */}
            <div>
              <p className='text-sm font-medium text-gray-700 mb-2'>
                Working Days
              </p>
              <div className='flex flex-wrap gap-2'>
                {workingDays.map((day) => {
                  const active = activeWorkingDays.includes(day);
                  return (
                    <button
                      key={day}
                      className={`min-w-[40px] px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                        active
                          ? "bg-[#8B5CF6] text-white"
                          : "bg-[#F3F4F6] text-gray-700"
                      }`}>
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Working Hours */}
            <div>
              <p className='text-sm font-medium text-gray-700 mb-2'>
                Working Hours
              </p>
              <div className='flex items-center gap-3'>
                <div className='relative flex-1'>
                  <input
                    defaultValue='09:00 AM'
                    className='w-full rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2 text-sm pr-9 outline-none focus:ring-2 focus:ring-[#C4B5FD]'
                  />
                  <FiClock className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-[16px]' />
                </div>
                <span className='text-gray-500 text-sm'>—</span>
                <div className='relative flex-1'>
                  <input
                    defaultValue='06:00 PM'
                    className='w-full rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2 text-sm pr-9 outline-none focus:ring-2 focus:ring-[#C4B5FD]'
                  />
                  <FiClock className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-[16px]' />
                </div>
              </div>
            </div>

            {/* Slot Duration */}
            <div>
              <p className='text-sm font-medium text-gray-700 mb-2'>
                Slot Duration
              </p>
              <div className='flex flex-wrap gap-2'>
                {durations.map((d) => {
                  const active = d === selectedDuration;
                  return (
                    <button
                      key={d}
                      onClick={() => setSelectedDuration(d)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-medium transition ${
                        active
                          ? "bg-[#4B5563] text-white"
                          : "bg-[#F3F4F6] text-gray-700"
                      }`}>
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className='mt-4 flex justify-end'>
            <button className='px-8 py-2.5 rounded-xl text-white font-medium bg-gradient-to-r from-[#8736C5] to-[#F88D25] shadow hover:opacity-90 transition'>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
