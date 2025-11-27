"use client";

import { CalendarDays, FileText } from "lucide-react";

export default function StepIndicator() {
  return (
    <div className="w-full flex items-center justify-center py-6">

      {/* STEP 1 */}
      <div className="flex items-center gap-2">
        {/* Icon Circle */}
        <div
          className="h-[38px] w-[38px] rounded-full flex items-center justify-center 
                     text-white"
          style={{
            background: "linear-gradient(135deg,#9838E1,#F68E44)",
          }}
        >
          <CalendarDays size={18} strokeWidth={2.5} />
        </div>

        {/* Label */}
        <span className="text-[14px] font-medium text-[#222]">
          Select Date & Time
        </span>
      </div>

      {/* Active Connector Line (Gradient) */}
      <div
        className="mx-4 h-[3px] w-[120px] rounded-full"
        style={{
          background: "linear-gradient(90deg,#9838E1,#F68E44)",
        }}
      ></div>

      {/* STEP 2 */}
      <div className="flex items-center gap-2 opacity-80">
        {/* Icon Circle */}
        <div
          className="h-[38px] w-[38px] rounded-full flex items-center justify-center 
                     text-white"
           style={{
            background: "linear-gradient(135deg,#9838E1,#F68E44)",
          }}
        >
          <FileText size={18} strokeWidth={2} />
        </div>

        {/* Label */}
        <span className="text-[14px] font-medium">
          Booking Details & Payment
        </span>
      </div>
    </div>
  );
}
