"use client";

import Image from "next/image";
import Link from "next/link";
import { LuStore, LuUsers } from "react-icons/lu";

export default function AboutCresify() {
  return (
    <section className="w-full py-24 px-10 bg-[#F8F7FB]">
      <div className="max-w-[1350px] mx-auto flex flex-col lg:flex-row items-center gap-16">
        {/* LEFT — IMAGE */}
        <div className="flex-1 h-full">
          <div className="rounded-[20px] overflow-hidden shadow-[0px_4px_18px_rgba(0,0,0,0.12)]">
            <Image
              src="/about/about.jpg"
              width={600}
              height={450}
              alt="Team"
              className="w-full h-[500px] object-cover"
            />
          </div>
        </div>

        {/* RIGHT — TEXT CONTENT */}
        <div className="flex-1">
          {/* Heading */}
          <h2 className="text-[36px] font-bold mb-4">About Cresify</h2>

          {/* Description */}
          <p className="text-[15px] text-[#000000] leading-[24px] max-w-[550px] mb-6">
            CRESIFY is more than just a marketplace – we’re a community
            connecting people with the products and services they need, right in
            their neighborhood.
          </p>

          <p className="text-[15px] text-[#000000] leading-[24px] max-w-[550px] mb-10">
            Founded with a mission to empower local businesses and make quality
            services accessible to everyone, we’ve grown into Latin America’s
            trusted platform for commerce and community.
          </p>

          {/* Stats Row */}
          <div className="flex items-center gap-6 mb-10">
            {/* Card 1 */}
            <div className="bg-white rounded-[16px] shadow-[0px_4px_18px_rgba(0,0,0,0.10)] p-6 w-[160px]">
              <div
                className="w-[48px] h-[48px] rounded-[12px] 
                bg-gradient-to-br from-[#9838E1] to-[#F68E44]
                flex items-center justify-center mb-3"
              >
                <LuStore size={24} color="white" />
              </div>
              <h3 className="text-[20px] font-semibold text-[#1E1E1E] mb-1">
                10,000+
              </h3>
              <p className="text-[13px] text-[#7A5FA6]">Active Sellers</p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-[16px] shadow-[0px_4px_18px_rgba(0,0,0,0.10)] p-6 w-[160px]">
              <div
                className="w-[48px] h-[48px] rounded-[12px] 
                bg-gradient-to-br from-[#9838E1] to-[#F68E44]
                flex items-center justify-center mb-3"
              >
                <LuUsers size={24} color="white" />
              </div>
              <h3 className="text-[20px] font-semibold text-[#1E1E1E] mb-1">
                10,000+
              </h3>
              <p className="text-[13px] text-[#7A5FA6]">Active Sellers</p>
            </div>
          </div>

          {/* Button */}
          <Link href="/about">
            <button
              className="
            px-8 py-[12px] rounded-[10px] text-white text-[15px] font-medium
            bg-gradient-to-r from-[#9838E1] to-[#F68E44]
            shadow-[0px_4px_16px_rgba(0,0,0,0.15)]
          "
            >
              Learn More About Us
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
