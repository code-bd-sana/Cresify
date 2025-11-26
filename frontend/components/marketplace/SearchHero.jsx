"use client";

import { FiSearch } from "react-icons/fi";

export default function SearchHero() {
  return (
    <section className="w-full py-20 text-center">
      <div className="max-w-[900px] mx-auto px-6">
        {/* Heading */}
        <h2 className="text-[36px] font-bold leading-[44px] text-[#1E1E1E] mb-3">
          Discover Unique Products from Local <br /> Entrepreneurs
        </h2>

        {/* Subheading */}
        <p className="text-[15px] text-[#8F63E8] font-medium mb-10">
          Explore thousands of innovative products created by passionate
          entrepreneurs.
        </p>

        {/* Search Bar */}
        {/* Search Bar */}
        <div
          className="
    w-full max-w-[780px] mx-auto
    flex items-center
    border border-[#A766E5]
    rounded-[12px]
    bg-white
    px-3 py-2
    shadow-[0px_4px_18px_rgba(0,0,0,0.08)]
  "
        >
          {/* Icon */}
          <FiSearch className="text-[#F78D25] text-[20px] mr-3" />

          {/* Input */}
          <input
            type="text"
            placeholder="Search for product or stores...."
            className="
      flex-1 text-[15px] text-[#444]
      placeholder:text-[#A3A3A3]
      outline-none
      py-1
    "
          />

          {/* Button – moved left with ml-3 and padding from parent */}
          <button
            className="
      ml-3
      px-6 py-2
      text-white text-[15px] font-medium
      rounded-[10px]
      bg-[linear-gradient(90deg,#9838E1_0%,#F68E44_100%)]
    "
          >
            Look for
          </button>
        </div>
      </div>
    </section>
  );
}
