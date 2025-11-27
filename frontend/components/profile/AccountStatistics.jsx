"use client";

import { ShoppingBag, Heart, Bookmark } from "lucide-react";

export default function AccountStatistics() {
  return (
    <div className="bg-white rounded-[12px] border border-[#ECE6F7] shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-5 w-full">
      {/* Title */}
      <h2 className="text-[16px] font-semibold text-[#1B1B1B] mb-4">
        Account Statistics
      </h2>

      {/* 3 Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* ------ CARD 1 ------ */}
        <div className="h-[120px] rounded-[12px] bg-[#FBF9FD] flex flex-col items-center justify-center border border-[#F3ECFA]">
          <div
            className="h-[50px] w-[50px] rounded-full flex items-center justify-center mb-1"
            style={{
              background: "linear-gradient(135deg,#9838E1,#F68E44)",
            }}
          >
            <ShoppingBag className="text-white" size={22} />
          </div>

          <p className="text-[20px] font-semibold text-[#1B1B1B] leading-none">
            24
          </p>
          <p className="text-[12px] text-[#6B6B6B]">Total Orders</p>
        </div>

        {/* ------ CARD 2 ------ */}
        <div className="h-[120px] rounded-[12px] bg-[#FBF9FD] flex flex-col items-center justify-center border border-[#F3ECFA]">
          <div
            className="h-[50px] w-[50px] rounded-full flex items-center justify-center mb-1"
            style={{
              background: "linear-gradient(135deg,#9838E1,#F68E44)",
            }}
          >
            <Heart className="text-white" size={22} />
          </div>

          <p className="text-[20px] font-semibold text-[#1B1B1B] leading-none">
            12
          </p>
          <p className="text-[12px] text-[#6B6B6B]">Wishlist Items</p>
        </div>

        {/* ------ CARD 3 ------ */}
        <div className="h-[120px] rounded-[12px] bg-[#FBF9FD] flex flex-col items-center justify-center border border-[#F3ECFA]">
          <div
            className="h-[50px] w-[50px] rounded-full flex items-center justify-center mb-1"
            style={{
              background: "linear-gradient(135deg,#9838E1,#F68E44)",
            }}
          >
            <Bookmark className="text-white" size={22} />
          </div>

          <p className="text-[20px] font-semibold text-[#1B1B1B] leading-none">
            6
          </p>
          <p className="text-[12px] text-[#6B6B6B]">My Book Services</p>
        </div>

      </div>
    </div>
  );
}
