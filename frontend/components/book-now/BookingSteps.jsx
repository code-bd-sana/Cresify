"use client";

import { Calendar, FileText } from "lucide-react";

export default function BookingSteps() {
  return (
    <div className="w-full flex justify-center py-10">
      <div className="flex items-center gap-8">

        {/* STEP 1 — ACTIVE */}
        <div className="flex items-center gap-2">
          <div
            className="
              w-[40px] h-[40px] rounded-full
              bg-gradient-to-r from-[#9838E1] to-[#F68E44]
              flex items-center justify-center
              shadow-[0_2px_8px_rgba(0,0,0,0.15)]
            "
          >
            <Calendar size={18} className="text-white" />
          </div>

          <span className="text-[14px] font-medium text-[#1B1B1B]">
            Select Date &amp; Time
          </span>
        </div>

        {/* GRADIENT CONNECTOR */}
        <div className="w-[120px] h-[4px] rounded-full bg-gradient-to-r from-[#9838E1] to-[#F68E44]" />

        {/* STEP 2 — INACTIVE */}
        <div className="flex items-center gap-2 opacity-60">
          <div
            className="
              w-[40px] h-[40px] rounded-full
              bg-gradient-to-r from-[#9838E1] to-[#F68E44]
              flex items-center justify-center
            "
          >
            <FileText size={18} className="text-white" />
          </div>

          <span className="text-[14px] font-medium text-[#7A7A7A]">
            Booking Details &amp; Payment
          </span>
        </div>

      </div>
    </div>
  );
}
