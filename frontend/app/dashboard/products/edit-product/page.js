"use client";
import React from "react";

export default function EditProductPage() {
  return (
    <div className="min-h-screen px-2 py-6 text-[#111827]">
      {/* Breadcrumb */}
      <div className="text-xs md:text-sm text-[#9CA3AF] mb-4 flex items-center gap-1">
        <span className="cursor-pointer hover:text-[#6B7280]">Product</span>
        <span className="text-[#D1D5DB]">/</span>
        <span className="text-[#111827] font-medium">Edit Product</span>
      </div>

      {/* Page Title */}
      <h1 className="text-3xl font-semibold">Edit Product</h1>
      <p className="text-sm text-[#A78BFA] mt-1">
        Update product details for ID#01
      </p>

      {/* Card */}
      <div className="mt-8 bg-white p-6 rounded-2xl border border-[#ECECEC] shadow">
        <h2 className="text-lg font-semibold mb-5">Basic Information</h2>

        {/* Product Name */}
        <div className="space-y-1 mb-5">
          <label className="text-sm text-gray-700 font-medium">
            Product Name*
          </label>
          <input
            type="text"
            defaultValue="Wireless Headphones"
            className="w-full border border-[#E5E7EB] bg-[#FCFCFF] rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#A855F7]/40"
          />
        </div>

        {/* Category & Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <div className="space-y-1">
            <label className="text-sm text-gray-700 font-medium">
              Category*
            </label>
            <input
              type="text"
              defaultValue="Electronics"
              className="w-full border border-[#E5E7EB] bg-[#FCFCFF] rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#A855F7]/40"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-700 font-medium">Price*</label>
            <input
              type="text"
              defaultValue="$1,520.00"
              className="w-full border border-[#E5E7EB] bg-[#FCFCFF] rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#A855F7]/40"
            />
          </div>
        </div>

        {/* Stock */}
        <div className="space-y-1 mb-5">
          <label className="text-sm text-gray-700 font-medium">
            Stock Quantity*
          </label>
          <input
            type="text"
            defaultValue="45"
            className="w-full border border-[#E5E7EB] bg-[#FCFCFF] rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#A855F7]/40"
          />
        </div>

        {/* Description */}
        <div className="space-y-1 mb-3">
          <label className="text-sm text-gray-700 font-medium">
            Description*
          </label>
          <textarea
            rows={4}
            defaultValue="Premium wireless headphones with active noise cancellation and 30-hours battery life."
            className="w-full border border-[#E5E7EB] bg-[#FCFCFF] rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#A855F7]/40"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-8 flex flex-col md:flex-row gap-4 md:gap-6">
        {/* Update Product Button */}
        <button
          class="w-full flex-1 sm:w-auto rounded-lg 
    bg-gradient-to-r from-[#9838e0] via-[#cc678b] to-[#f48c47]
    px-10 py-4 text-sm font-bold text-white
    shadow-[0_6px_20px_rgba(157,78,221,0.35)]
    hover:opacity-95 transition"
        >
          Update Product
        </button>

        {/* Unpublished Button */}
        <button
          className="w-full md:w-auto rounded-lg border-2 border-[#A140D0] px-14 py-4 text-sm font-bold text-[#A23BFF]
          shadow-[0_4px_10px_rgba(0,0,0,0.03)]
          hover:bg-[#FBF8FF] transition"
        >
          Unpublished
        </button>

        {/* Delete Button */}
        <button
          className="w-full md:w-auto rounded-lg border-2 border-[#F78D25] px-14 py-4 text-sm font-bold text-[#F78D25]
          hover:bg-[#FBD6D6] transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
