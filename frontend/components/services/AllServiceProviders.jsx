"use client";

import Link from "next/link";
import { AiFillStar } from "react-icons/ai";
import { LuMapPin } from "react-icons/lu";

export default function AllServiceProviders() {
  const providers = [
    {
      id: 1,
      tag: "Outstanding",
      image: "/blog/blog1.jpg",
      name: "Clean Pro Services",
      subtitle: "Professional home cleaning with eco-friendly products",
      location: "Buenos Aires",
      rating: 4.6,
      reviews: 203,
      price: 45,
    },
    {
      id: 2,
      tag: "Expert",
      image: "/blog/blog2.jpg",
      name: "Expert Plumbers",
      subtitle: "Reliable plumbing specialists at your service",
      location: "New York",
      rating: 4.8,
      reviews: 159,
      price: 60,
    },
    {
      id: 3,
      tag: "Top Rated",
      image: "/blog/blog3.jpg",
      name: "Bright Electricians",
      subtitle: "Licensed electricians for all your needs",
      location: "Los Angeles",
      rating: 4.7,
      reviews: 216,
      price: 55,
    },
    {
      id: 4,
      tag: "Outstanding",
      image: "/blog/blog1.jpg",
      name: "Green Thumb Gardens",
      subtitle: "Transform your garden into paradise",
      location: "Mexico City",
      rating: 4.6,
      reviews: 203,
      price: 40,
    },
    {
      id: 5,
      tag: "Top Rated",
      image: "/blog/blog1.jpg",
      name: "Perfect Paint Co.",
      subtitle: "Quality painting with great finishes and colors",
      location: "Chicago",
      rating: 4.8,
      reviews: 187,
      price: 50,
    },
    {
      id: 6,
      tag: "Outstanding",
      image: "/blog/blog2.jpg",
      name: "Sparkle Clean Team",
      subtitle: "Deep cleaning experts for your home",
      location: "New York",
      rating: 4.5,
      reviews: 142,
      price: 42,
    },
    // ⭐ Added 3 more
    {
      id: 7,
      tag: "Recommended",
      image: "/blog/blog1.jpg",
      name: "Master Fix Technicians",
      subtitle: "Appliance repair by certified experts",
      location: "San Diego",
      rating: 4.9,
      reviews: 310,
      price: 52,
    },
    {
      id: 8,
      tag: "Premium",
      image: "/blog/blog2.jpg",
      name: "Elite Movers",
      subtitle: "Safe & fast home/office moving service",
      location: "Seattle",
      rating: 4.7,
      reviews: 180,
      price: 70,
    },
    {
      id: 9,
      tag: "Outstanding",
      image: "/blog/blog1.jpg",
      name: "Luxury Pet Care",
      subtitle: "Top-tier pet sitting and grooming",
      location: "Austin",
      rating: 4.8,
      reviews: 260,
      price: 38,
    },
  ];

  return (
    <section className="w-full py-10 px-5 bg-[#F5F5F7]">
      <div className="max-w-[1350px] mx-auto">
        <h2 className="text-[36px] px-4 font-bold text-[#1B1B1B] mb-6">
          All Service Providers
        </h2>

        {/* GRID */}
        <Link href="/service-details">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {providers.map((p) => (
              <div
                key={p.id}
                className="
          p-3 
             
             
            "
              >
                {/* Inner white card */}
                <div className="bg-white rounded-[20px] overflow-hidden p-[14px]">
                  {/* Image */}
                  <div className="relative w-full h-[210px] mb-4">
                    <img
                      src={p.image}
                      className="w-full h-full object-cover rounded-[16px]"
                      alt=""
                    />
                    <span
                      className="
                    absolute top-3 right-3 px-3 py-[3px]
                    bg-[#A46CFF] text-white text-[12px] rounded-full
                    shadow-[0_2px_8px_rgba(0,0,0,0.20)]
                    "
                    >
                      {p.tag}
                    </span>
                  </div>

                  {/* Name */}
                  <h3 className="text-[16px] font-semibold text-[#1A1A1A] mb-[2px]">
                    {p.name}
                  </h3>

                  {/* subtitle */}
                  <p className="text-[14px] leading-[20px] text-[#A46CFF] mb-3">
                    {p.subtitle}
                  </p>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-[13px] text-[#6A6A6A] mb-3">
                    <LuMapPin className="text-[16px]" />
                    {p.location}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center text-[14px] text-[#6A6A6A] mb-4">
                    {[...Array(5)].map((_, i) => (
                      <AiFillStar
                        key={i}
                        className={`text-[17px] ${
                          i < Math.floor(p.rating)
                            ? "text-[#FFA534]"
                            : "text-[#E0E0E0]"
                        }`}
                      />
                    ))}
                    <span className="ml-1">
                      {p.rating} ({p.reviews} review)
                    </span>
                  </div>

                  {/* Price */}
                  <p className="text-[13px] text-[#6B6B6B]">Starting at</p>
                  <p className="text-[22px] font-semibold text-[#F78D25] mb-5">
                    ${p.price}/hr
                  </p>

                  {/* Button */}
                  <button
                    className="
                  w-full py-[12px] text-[15px] font-medium text-white
                  rounded-[12px]
                  bg-[linear-gradient(90deg,#9838E1,#F68E44)]
                  shadow-[0_4px_14px_rgba(0,0,0,0.15)]
                  "
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Link>
      </div>
    </section>
  );
}
