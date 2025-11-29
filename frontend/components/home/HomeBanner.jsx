"use client";

import { useState } from "react";
import Image from "next/image";
import { IoChevronDownOutline } from "react-icons/io5";
import Link from "next/link";

export default function HomeBanner() {
  return (
    <section
      className="
      w-full 
      min-h-[650px]
      bg-[linear-gradient(135deg,#F5EEFB_0%,#FFFFFF_100%)]
      px-6 sm:px-10 md:px-16 lg:px-24 
      py-10 md:py-14 lg:py-20
    "
    >
      <div
        className="
        max-w-[1320px] mx-auto 
        flex flex-col lg:flex-row 
        items-center lg:items-start 
        justify-between 
        gap-10 lg:gap-0
      "
      >
        {/* LEFT SIDE */}
        <div className="w-full lg:w-[45%]">
          {/* Heading */}
          <h1
            className="
            text-[32px] sm:text-[38px] md:text-[45px] lg:text-[52px]
            font-semibold 
            leading-[40px] sm:leading-[48px] md:leading-[55px] lg:leading-[62px]
            tracking-[-0.5px]
            text-[#1E1E1E]
            mb-5
          "
          >
            Discover Amazing <br className="hidden lg:block" />
            Products & <br className="hidden lg:block" />
            Services Near You
          </h1>

          {/* Subtext */}
          <p
            className="
            text-[15px] md:text-[16px]
            leading-[24px] md:leading-[26px]
            text-[#AC65EE]
            w-full md:w-[390px]
            mb-10
          "
          >
            Connect with local businesses and find exactly what you need in your
            area. From products to professional services, we’ve got you covered.
          </p>

          {/* Glass Card */}
          <div
            className="
            w-full sm:w-[380px] md:w-[420px] lg:w-[440px]
            rounded-[24px]
            px-[22px] sm:px-[26px]
            py-[22px] sm:py-[26px]
            backdrop-blur-[18px]
            bg-[linear-gradient(145deg,rgba(241,231,255,0.55)_0%,rgba(238,220,255,0.45)_35%,rgba(255,229,209,0.40)_100%)]
            shadow-[0_12px_32px_rgba(0,0,0,0.18)]
          "
          >
            <p
              className="
              text-[14px] sm:text-[15px] 
              font-semibold mb-4
              bg-gradient-to-r from-[#F78D25] to-[#9838E1]
              text-transparent bg-clip-text
            "
            >
              Select your Location
            </p>

            <Dropdown label="Country" placeholder="Select Country" />
            <Dropdown label="Region" placeholder="Select Region" />
            <Dropdown label="City" placeholder="Select City" />
          </div>

          {/* Buttons */}
          <div
            className="
            flex flex-col sm:flex-row 
            items-start sm:items-center 
            gap-3 
            mt-6
          "
          >
           <Link href="/marketplace">
             <button
              className="
              h-[38px] px-6 text-[14px] font-medium 
              text-white 
              rounded-[10px] 
              bg-gradient-to-r from-[#9838E1] to-[#F68E44] 
              shadow-[0px_3px_10px_rgba(0,0,0,0.08)]
              w-full sm:w-auto
            "
            >
              Explore Marketplace
            </button>
           </Link>

           <Link href="/services">
            <button
              className="
              h-[38px] px-6 text-[14px] font-bold 
              text-[#A140D0] 
              rounded-[10px] border-2 border-[#A140D0]
              bg-white hover:bg-[#F8F8F8]
              w-full sm:w-auto
            "
            >
              Browse Services
            </button>
           </Link>
          </div>
        </div>

        {/* RIGHT SIDE IMAGE */}
        <div className="w-full lg:w-[55%] flex justify-center">
          <Image
            src="/Home/HomeRightIMG.png"
            width={649}
            height={649}
            alt="Marketplace"
            className="
              rounded-[22px] 
              w-full max-w-[500px] sm:max-w-[600px] lg:max-w-[649px]
            "
          />
        </div>
      </div>
    </section>
  );
}

/* ----------- Dropdown ---------------- */
function Dropdown({ label, placeholder }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const options = ["Option 1", "Option 2", "Option 3"];

  return (
    <div className="mb-3 relative">
      <label className="block text-[13px] text-[#6B6B6B] mb-1">{label}</label>

      <div
        onClick={() => setOpen(!open)}
        className="
          border border-[#E1E1E1] 
          bg-white 
          rounded-[10px] 
          px-4 py-[10px]
          text-[14px] 
          text-[#575757] 
          cursor-pointer 
          relative
        "
      >
        {value || placeholder}

        <IoChevronDownOutline
          className={`absolute right-3 top-1/2 -translate-y-1/2 text-[18px] text-[#7A7A7A] transition ${
            open ? "rotate-180" : ""
          }`}
        />
      </div>

      {open && (
        <div
          className="
            absolute 
            w-full 
            left-0 mt-1 
            bg-white 
            border border-[#EAEAEA]
            rounded-[10px]
            shadow-[0_4px_18px_rgba(0,0,0,0.12)]
            z-50
          "
        >
          {options.map((item, i) => (
            <p
              key={i}
              className="px-4 py-2 text-[14px] hover:bg-[#F5F5F5] cursor-pointer"
              onClick={() => {
                setValue(item);
                setOpen(false);
              }}
            >
              {item}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
