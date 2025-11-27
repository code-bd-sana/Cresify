"use client";

import Image from "next/image";
import { FiMapPin, FiStar } from "react-icons/fi";

export default function ServiceCategory() {
  const providers = Array(6).fill({
    id: 1,
    name: "Expert Plumbers",
    desc: "Fast and reliable plumbing solutions",
    location: "São Paulo",
    rating: 4.6,
    reviews: 203,
    price: "$60/hr",
    img: "/service/electrical.jpg", // change to your image path
  });

  return (
    <div className="px-4 md:px-8 py-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-2">
        Service Management <span className="mx-1">›</span>{" "}
        <span className="text-[#9C6BFF] font-medium">Electrical</span>
      </div>

      {/* Header Row */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-[24px] md:text-[26px] font-semibold text-gray-900">
          Electrical
        </h1>
        <p className="text-[#9C6BFF] font-medium text-sm cursor-pointer hover:underline">
          6 Providers
        </p>
      </div>

      {/* Provider Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers.map((p, i) => (
          <div
            key={i}
            className="bg-white border border-[#E5D8FF] rounded-xl shadow-sm p-4"
          >
            {/* Image */}
            <div className="w-full h-[262px] relative rounded-lg overflow-hidden">
              <Image
                src={p.img}
                alt={p.name}
                fill
                className="object-cover object-top"
              />
            </div>

            {/* Content */}
            <div className="mt-4">
              <h3 className="font-semibold text-gray-900 text-[17px]">
                {p.name}
              </h3>

              <p className="text-sm text-[#9C6BFF] mt-1">{p.desc}</p>

              {/* Rating + Location */}
              <div className="flex items-center gap-2 text-gray-600 text-[13px] mt-3">
                <FiMapPin className="text-gray-400" />
                {p.location}
              </div>

              <div className="flex items-center gap-2 text-[13px] mt-1">
                <FiStar className="text-yellow-500" />
                <span className="font-medium">{p.rating}</span>
                <span className="text-gray-400">({p.reviews} reviews)</span>
              </div>

              {/* Price */}
              <p className="mt-3 text-[13px] text-gray-600">Starting at</p>

              <p className="text-[22px] font-bold text-[#F88D25] leading-tight">
                {p.price}
              </p>

              {/* Book Now Button */}
              <button className="mt-4 w-full py-2.5 text-white font-medium rounded-lg bg-gradient-to-r from-[#8736C5] to-[#F88D25] shadow-md hover:opacity-90 transition">
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
