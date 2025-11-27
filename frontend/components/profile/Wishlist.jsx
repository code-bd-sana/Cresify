"use client";

import { X } from "lucide-react";

export default function Wishlist() {
  const items = [
    {
      id: 1,
      name: "Genuine Leather Handbag",
      brand: "Fine Leathers",
      price: 599,
      image: "/product/p1.jpg",
      inStock: true,
    },
    {
      id: 2,
      name: "Genuine Leather Handbag",
      brand: "Fine Leathers",
      price: 599,
      image: "/product/p2.jpg",
      inStock: true,
    },
    {
      id: 3,
      name: "Genuine Leather Handbag",
      brand: "Fine Leathers",
      price: 599,
      image: "/product/p3.jpg",
      inStock: false,
    },
    {
      id: 4,
      name: "Genuine Leather Handbag",
      brand: "Fine Leathers",
      price: 599,
      image: "/product/p4.jpg",
      inStock: true,
    },
  ];

  return (
    <section className="w-full bg-white rounded-lg px-4 pb-10">
      <div className="max-w-[1100px] mx-auto">

        {/* ---------------- HEADER ---------------- */}
        <div className="flex justify-between items-center mb-6 pt-4">
          <h2 className="text-[18px] font-semibold text-[#1B1B1B]">My Wishlist</h2>
          <p className="text-[13px] text-[#9838E1] cursor-pointer">4 Items</p>
        </div>

        {/* ---------------- GRID ---------------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-[16px] border border-[#EEEAF7] shadow-[0_6px_18px_rgba(0,0,0,0.06)] p-4"
            >
              {/* IMAGE SECTION */}
              <div className="relative w-full h-[180px] rounded-[12px] overflow-hidden bg-[#F5F5F9] mb-4">
                <img
                  src={item.image}
                  className="h-full w-full object-cover"
                />

                {/* REMOVE BUTTON */}
                <button
                  className="
                    absolute top-2 right-2 h-[28px] w-[28px]
                    rounded-full bg-white border border-[#FFCFB5]
                    flex items-center justify-center shadow-sm
                  "
                >
                  <X size={16} className="text-[#F78D25]" />
                </button>
              </div>

              {/* TEXT INFO */}
              <p className="text-[14px] font-semibold text-[#2B2B2B] leading-tight">
                {item.name}
              </p>

              <p className="text-[12px] text-[#9838E1] mt-[2px]">
                by {item.brand}
              </p>

              {/* PRICE + BUTTON */}
              <div className="flex items-center justify-between mt-4">
                <p className="text-[18px] font-semibold text-[#F78D25]">
                  ${item.price}
                </p>

                {/* Add to Cart / Unavailable */}
                {item.inStock ? (
                  <button
                    className="
                      px-4 py-[8px] text-[12px] text-white rounded-[8px]
                      bg-gradient-to-r from-[#9838E1] to-[#F68E44]
                      shadow-[0_4px_14px_rgba(0,0,0,0.12)]
                    "
                  >
                    Add to cart
                  </button>
                ) : (
                  <button
                    className="
                      px-4 py-[8px] text-[12px] rounded-[8px]
                      text-[#888] bg-[#F0F0F4] cursor-default
                    "
                  >
                    Unavailable
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
