"use client";
import Image from "next/image";
import { HiOutlineHomeModern } from "react-icons/hi2";
import { FiUploadCloud } from "react-icons/fi";

export default function StoreProfile() {
  return (
    <div className="w-full min-h-screen px-2 pt-6">
      {/* PAGE TITLE */}
      <div>
        <h1 className="text-[28px] font-semibold text-[#1D1D1F]">Store Profile</h1>
        <p className="text-[#8A72BE] text-sm mt-1">
          Manage your store information and settings
        </p>
      </div>

      {/* STORE LOGO CARD */}
      <div className="bg-white rounded-[14px] border border-[#EEEAF5] shadow-[0_4px_22px_rgba(0,0,0,0.06)] p-6 mt-8">
        <h2 className="text-[20px] font-semibold text-[#1D1D1F] mb-5">
          Store Logo
        </h2>

        <div className="flex items-center gap-6">
          {/* Current Logo */}
          <div className="w-[90px] h-[90px] rounded-xl bg-[#F4EBFF] flex items-center justify-center border border-[#E8D9FF]">
            <HiOutlineHomeModern className="text-[40px] text-[#C39BFF]" />
          </div>

          {/* Upload Button */}
          <label
            htmlFor="logo"
            className="w-[200px] h-[90px] border-2 border-dashed border-[#E2D7F7] rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-[#FBF9FF] transition"
          >
            <FiUploadCloud className="text-[32px] text-[#D29CF7]" />
            <p className="text-sm text-[#A38CCB] mt-1">
              PNG, JPG up to 5MB
            </p>
            <input id="logo" type="file" className="hidden" />
          </label>
        </div>
      </div>

      {/* STORE INFORMATION */}
      <div className="bg-white rounded-[14px] border border-[#EEEAF5] shadow-[0_4px_22px_rgba(0,0,0,0.06)] p-6 mt-8">
        <h2 className="text-[20px] font-semibold text-[#1D1D1F] mb-5">
          Store Information
        </h2>

        {/* FORM GRID */}
        <div className="flex flex-col gap-6">
          {/* Store Name */}
          <div>
            <label className="text-sm text-[#1D1D1F] font-medium">Store Name*</label>
            <input
              type="text"
              placeholder="Tech Haven Store"
              className="mt-2 w-full h-[48px] px-4 rounded-xl border border-[#E8E6F2] bg-white focus:ring-2 focus:ring-[#C39BFF] outline-none"
            />
          </div>

          {/* Store Description */}
          <div>
            <label className="text-sm text-[#1D1D1F] font-medium">Store Description*</label>
            <textarea
              placeholder="Your one-stop shop for premium tech accessories and gadgets"
              className="mt-2 w-full h-[90px] px-4 py-3 rounded-xl border border-[#E8E6F2] bg-white focus:ring-2 focus:ring-[#C39BFF] outline-none"
            />
          </div>

          {/* EMAIL + PHONE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-[#1D1D1F] font-medium">Email Address*</label>
              <input
                type="email"
                placeholder="contact@techhaven.com"
                className="mt-2 w-full h-[48px] px-4 rounded-xl border border-[#E8E6F2] bg-white focus:ring-2 focus:ring-[#C39BFF] outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-[#1D1D1F] font-medium">Phone Number*</label>
              <input
                type="text"
                placeholder="(603) 555-0123"
                className="mt-2 w-full h-[48px] px-4 rounded-xl border border-[#E8E6F2] bg-white focus:ring-2 focus:ring-[#C39BFF] outline-none"
              />
            </div>
          </div>

          {/* ADDRESS + CATEGORY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-[#1D1D1F] font-medium">Store Address*</label>
              <input
                type="text"
                placeholder="1901 Thornridge Cir. Shiloh, Hawaii 81063"
                className="mt-2 w-full h-[48px] px-4 rounded-xl border border-[#E8E6F2] bg-white focus:ring-2 focus:ring-[#C39BFF] outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-[#1D1D1F] font-medium">Category*</label>
              <input
                type="text"
                placeholder="Technology"
                className="mt-2 w-full h-[48px] px-4 rounded-xl border border-[#E8E6F2] bg-white focus:ring-2 focus:ring-[#C39BFF] outline-none"
              />
            </div>
          </div>

          {/* WEBSITE */}
          <div>
            <label className="text-sm text-[#1D1D1F] font-medium">Website</label>
            <input
              type="text"
              placeholder="www.techhaven.com"
              className="mt-2 w-full h-[48px] px-4 rounded-xl border border-[#E8E6F2] bg-white focus:ring-2 focus:ring-[#C39BFF] outline-none"
            />
          </div>
        </div>

        {/* SAVE BUTTON */}
        <button className="w-full h-[50px] mt-6 rounded-xl text-white font-medium text-[15px] bg-gradient-to-r from-[#A155FB] to-[#F68E44]">
          Save Changes
        </button>
      </div>
    </div>
  );
}
