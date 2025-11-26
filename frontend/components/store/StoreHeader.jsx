"use client";

import { LuStore } from "react-icons/lu";

export default function StoreHeader() {
  return (
    <section className="w-full py-16 relative bg-white">
      <div className="max-w-[750px] mx-auto text-center px-6">

        {/* Icon */}
        <div className="w-[70px] h-[70px] rounded-[16px] mx-auto mb-4
          bg-[linear-gradient(180deg,#EDE2FF_0%,#F4EBFF_100%)]
          flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.07)]">
          <LuStore className="text-[#9838E1] text-[32px]" />
        </div>

        {/* Title */}
        <h2 className="text-[28px] md:text-[30px] font-semibold text-[#111] mb-2">
          Mountain Hub
        </h2>

        {/* Description */}
        <p className="text-[13px] md:text-[14px] text-[#8F5EFF] leading-relaxed">
          Short details Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>

      
    </section>
  );
}
