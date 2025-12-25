"use client";

import { useGetProviderDatesQuery, useGetProviderTimeslotsQuery } from "@/feature/provider/ProviderApi";
import { Calendar, FileText } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function BookingSteps() {

    const searchParams = useSearchParams();
       const id = searchParams.get("id");

       console.log(id, 'id kire toi dfs');
  const [date, setDate] = useState(null)

    const {data:availableDate} = useGetProviderDatesQuery(id);
  console.log(availableDate, 'all available dates');
  const {data:timeSlot} =  useGetProviderTimeslotsQuery(date);
  console.log(timeSlot, 'this is time slot');
  
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
