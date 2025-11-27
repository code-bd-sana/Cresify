"use client";

import Image from "next/image";

export default function BlogBanner() {
  return (
    <div className="max-w-7xl mx-auto rounded-2xl bg-gradient-to-r from-[#8736C5] via-[#9C47C6] to-[#F88D25] p-[4px] mb-12 shadow-md">

      {/* Inner white card */}
      <div className="bg-white rounded-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">

          {/* Left Image */}
          <div className="relative w-full h-[380px] lg:h-[600px]">
            <Image
              src="/blog/blog-banner.jpg"
              alt="Featured Guide"
              fill
              className="object-cover rounded-l-2xl"
            />
          </div>

          {/* Right Content */}
          <div className="p-8 flex flex-col justify-center">
            {/* Badge */}
            <span className="px-6 py-2 text-sm font-medium rounded-full bg-gradient-to-r from-[#8736C5] to-[#F88D25] text-white w-max">
              Featured Guide
            </span>

            {/* Title */}
            <h1 className="mt-4 text-[40px] font-bold leading-tight text-gray-900">
              The Ultimate Guide to<br />Finding Quality Local<br />Services
            </h1>

            {/* Description */}
            <p className="mt-4 text-[15px] w-2/3 text-[#AC65EE] leading-relaxed font-medium">
              Discover expert tips and strategies for connecting with the best
              service providers in your area. Learn how to evaluate reviews,
              compare prices, and make informed decisions.
            </p>

            {/* Author + Date */}
            <div className="flex items-center gap-3 text-base text-[#525252] mt-4">
              <span>Sarah Johnson</span>
              <span>•</span>
              <span>March 18, 2024</span>
            </div>

            {/* Read Button */}
            <button className="mt-6 w-max px-10 py-4 text-white rounded-lg font-medium bg-gradient-to-r from-[#8736C5] to-[#F88D25] shadow-sm hover:opacity-90 transition">
              Read Full Article
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
