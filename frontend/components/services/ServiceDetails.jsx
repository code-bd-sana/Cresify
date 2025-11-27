"use client";

import {
  MapPin,
  Star,

  MessageSquare,
} from "lucide-react";

export default function ServiceDetails() {
  return (
    <section className="w-full bg-[#F7F7FA] py-14 px-6">
      <div className="max-w-[1300px] mx-auto">

        {/* PAGE TITLE */}
        <h2 className="text-[18px] font-semibold text-[#1B1B1B] mb-6">
          Service Details
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* LEFT IMAGE */}
          <div>
            <div className="w-full h-[335px] rounded-[14px] overflow-hidden bg-[#EDEDF2]">
              <img
                src="/services/serv1.jpg"
                alt="Smart Electricians"
                className="h-full w-full object-cover"
              />
            </div>

            {/* IMAGE THUMBNAILS */}
            <div className="flex items-center gap-4 mt-5">
              {[
                "/services/serv1.jpg",
                "/services/serv2.jpg",
                "/services/serv3.jpg",
                "/services/serv1.jpg",
              ].map((img, i) => (
                <div
                  key={i}
                  className="h-[60px] w-[60px] rounded-[12px]
                  overflow-hidden cursor-pointer 
                  border border-[#E1E1E8] hover:border-[#9838E1] transition"
                >
                  <img
                    src={img}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT DETAILS */}
          <div className="pt-2">

            {/* Title */}
            <h1 className="text-[22px] font-semibold text-[#222]">
              Smart Electricians
            </h1>

            {/* Category */}
            <p className="text-[13px] text-[#9838E1] mt-[2px]">
              Electrical
            </p>

            {/* Location */}
            <div className="flex items-center gap-2 mt-2">
              <MapPin size={16} className="text-[#8B8B9A]" />
              <p className="text-[13px] text-[#6A6A6A]">
                Downtown, Midtown, North Side, South Side
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-[2px] mt-2">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Star
                    key={i}
                    size={15}
                    className="text-[#F78D25] fill-[#F78D25]"
                  />
                ))}
              <p className="text-[12px] text-[#8A8A8A] ml-1">
                4.6 (203 review)
              </p>
            </div>

            {/* Price */}
            <p className="text-[20px] font-semibold text-[#F78D25] mt-3">
              $55/hr
            </p>

            {/* About */}
            <div className="mt-5">
              <h3 className="text-[15px] font-semibold text-[#1B1B1B] mb-2">
                About
              </h3>
              <p className="text-[13px] text-[#6A6A6A] leading-[20px] max-w-[420px]">
                Smart Electricians provides safe and reliable electrical services
                for homes and businesses. Our certified electricians handle
                installations, repairs, and upgrades with precision and adherence
                to all safety codes.
              </p>
            </div>

            {/* BUTTON GROUP */}
            <div className="flex items-center gap-4 mt-8">

              {/* BOOK NOW BUTTON */}
              <button
                className="
                  w-[200px] h-[48px] rounded-[10px]
                  bg-gradient-to-r from-[#9838E1] to-[#F68E44]
                  flex items-center justify-center gap-2
                  text-white text-[14px] font-medium
                  shadow-[0_4px_14px_rgba(0,0,0,0.15)]
                "
              >
                Book Now
             
              </button>

              {/* MESSAGE BUTTON (WHITE + GRADIENT BORDER) */}
              <button
                className="
                  w-[48px] h-[48px] rounded-[10px]
                  flex items-center justify-center
                  bg-white
                  border-[2px]
                  border-transparent
                "
              >
                <MessageSquare size={18} className="text-[#9838E1]" />
              </button>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
