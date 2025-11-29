"use client";

import { useState } from "react";
import { AiFillStar } from "react-icons/ai";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

// Swiper Styles
import "swiper/css";
import "swiper/css/pagination";
import Link from "next/link";

export default function FeaturedStores() {
  const stores = [
    {
      id: 1,
      logo: "/product/p1.jpg",
      title: "Luna Jewelry",
      subtitle: "Handmade Jewelry",
      rating: 4.9,
      products: 45,
      location: "2464 Royal Ln.",
    },
    {
      id: 2,
      logo: "/product/p2.jpg",
      title: "Mountain Coffee",
      subtitle: "Handmade Jewelry",
      rating: 4.9,
      products: 12,
      location: "3517 W Gray St.",
    },
    {
      id: 3,
      logo: "/product/p3.jpg",
      title: "Fine Leather",
      subtitle: "Handmade Jewelry",
      rating: 4.9,
      products: 64,
      location: "Delaware 10299",
    },
    {
      id: 4,
      logo: "/product/p4.jpg",
      title: "Luna Jewelry",
      subtitle: "Handmade Jewelry",
      rating: 4.9,
      products: 45,
      location: "6391 Elgin St.",
    },
    {
      id: 5,
      logo: "/product/p5.jpg",
      title: "Amazon Local",
      subtitle: "Handmade Jewelry",
      rating: 4.9,
      products: 68,
      location: "Miami 22101",
    },
  ];

  return (
    <section className="w-full py-16">
      <div className="max-w-[1360px] mx-auto">

        {/* Heading */}
        <h2 className="text-[32px] font-bold text-center mb-2">
          Featured Stores
        </h2>

        <p className="text-center text-[#A46CFF] font-semibold text-[15px] mb-12">
          Discover the more popular shop in your community of entrepreneurs
        </p>

        {/* REAL SLIDER */}
       <Link href="/store">
        <Swiper
          spaceBetween={25}
          slidesPerView={2.2}
          centeredSlides={false}
          grabCursor={true}
          pagination={{
            clickable: true,
            el: ".custom-progress",
          }}
          modules={[Pagination]}
          breakpoints={{
            0: { slidesPerView: 1.2 },
            768: { slidesPerView: 2.2 },
            1024: { slidesPerView: 3.2 },
            1280: { slidesPerView: 4 },
          }}
          className="pb-10"
        >
          {stores.map((s) => (
            <SwiperSlide key={s.id}>
              <div className="bg-white rounded-[18px] border border-[#EEE9F6]
                  shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-5">
                
                {/* Logo */}
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={s.logo}
                    alt={s.title}
                    className="w-[48px] h-[48px] rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-[15px] font-semibold">{s.title}</h3>
                    <p className="text-[13px] text-[#7A5FA6]">{s.subtitle}</p>
                  </div>
                </div>

                {/* Rating */}
                <p className="text-[14px] text-[#444] flex items-center gap-1 mb-1">
                  Qualification:
                  <AiFillStar className="text-[#FFA534]" />
                  <span className="font-semibold">{s.rating}</span>
                </p>

                {/* Products */}
                <p className="text-[14px] text-[#444] mb-1">
                  Products: <span className="font-semibold">{s.products}</span>
                </p>

                {/* Location */}
                <p className="text-[14px] text-[#444] mb-4">
                  Location: <span>{s.location}</span>
                </p>

                {/* Button */}
                <button
                  className="w-full py-[10px] rounded-[10px] text-white text-[14px] font-medium
                      bg-[linear-gradient(90deg,#9838E1,#F68E44)]
                      shadow-[0_3px_12px_rgba(0,0,0,0.12)]"
                >
                  Visit Store
                </button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
       </Link>

      
        {/* CTA Button */}
        <div className="flex justify-center mt-8">
          <Link href="/all-shops">
           <button
            className="px-8 py-[12px] text-[14px] font-semibold text-[#9A3ADD]
            border border-[#9A3ADD] rounded-[10px] hover:bg-[#F8F2FF]
            transition shadow-[0_2px_10px_rgba(0,0,0,0.06)]"
          >
            View All Stores
          </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
