"use client";

import { Grid2x2 } from "lucide-react";

export default function MissionVision() {
  return (
    <section className="w-full bg-[#F7F7FA] py-16 px-6">
      <div className="max-w-[1300px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* MISSION CARD */}
        <div className="bg-white rounded-[18px] font-medium h-[280px] p-6 shadow-[0_6px_18px_rgba(0,0,0,0.06)] border border-[#F0ECF9]">
          
          {/* Icon */}
          <div className="w-[48px] h-[48px] rounded-[12px] 
            bg-gradient-to-r from-[#9838E1] to-[#F68E44] 
            flex items-center justify-center mb-4">
            <Grid2x2 size={26} color="#ffffff" />
          </div>

          {/* Title */}
          <h3 className="text-[16px] font-bold text-[#1B1B1B] mb-2">
            Our Mission
          </h3>

          {/* Text */}
          <p className="text-[14px] leading-[20px] text-[#A46CFF]">
            To empower local businesses and connect communities by providing 
            a trusted, accessible platform where quality products and services 
            meet customer needs. We believe in supporting local economies while 
            delivering exceptional value and convenience to our users.
          </p>
        </div>

        {/* VISION CARD */}
        <div className="bg-white font-medium rounded-[18px] h-[280px] p-6 shadow-[0_6px_18px_rgba(0,0,0,0.06)] border border-[#F0ECF9]">

          {/* Icon */}
          <div className="w-[48px] h-[48px] rounded-[12px] 
            bg-gradient-to-r from-[#9838E1] to-[#F68E44] 
            flex items-center justify-center mb-4">
            <Grid2x2 size={26} color="#ffffff" />
          </div>

          {/* Title */}
          <h3 className="text-[16px] font-bold text-[#1B1B1B] mb-2">
            Our Vision
          </h3>

          {/* Text */}
          <p className="text-[14px] leading-[20px] text-[#A46CFF]">
            To become the leading marketplace platform across Latin America, 
            where every community has access to verified, quality services 
            and products. We envision a future where local businesses thrive 
            through digital innovation and customers enjoy seamless, trustworthy 
            commerce experiences.
          </p>
        </div>

      </div>
    </section>
  );
}
