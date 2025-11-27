"use client";

import {
  Camera,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Edit,
  Trash2,
  KeyRound,
} from "lucide-react";

export default function ProfileOverviewPage() {
  return (
    <div className="w-full bg-[#F7F7FA] pb-10 px-4 flex justify-center">
      <div className="w-full max-w-[900px]">

        {/* ---------------- PROFILE OVERVIEW ---------------- */}
        <section className="bg-white rounded-[14px] border border-[#ECE6F7] shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-6 mb-6">
          <h2 className="text-[16px] font-semibold text-[#1B1B1B] mb-5">
            Profile Overview
          </h2>

          {/* PROFILE IMAGE */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative h-[95px] w-[95px] rounded-full overflow-hidden border-[3px] border-white shadow-md">
              <img
                src="/user.png"
                className="h-full w-full object-cover"
              />
              <button className="absolute bottom-0 right-0 h-[28px] w-[28px] rounded-full bg-[#9838E1] flex items-center justify-center">
                <Camera className="h-[14px] w-[14px] text-white" />
              </button>
            </div>
            <p className="text-[12px] text-[#9838E1] mt-[6px] cursor-pointer">
              Change Photo
            </p>
          </div>

          {/* USER DETAILS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Full name */}
            <div>
              <label className="block text-[12px] mb-1">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full text-[13px] h-[38px] rounded-[8px] border border-[#ECE6F7] bg-white px-3 focus:outline-none"
                  placeholder="Jane Cooper"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[12px] mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9838E1]" />
                <input
                  type="text"
                  className="w-full text-[13px] h-[38px] rounded-[8px] border border-[#ECE6F7] bg-white pl-10 pr-3 focus:outline-none"
                  placeholder="jane@domain.com"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-[12px] mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9838E1]" />
                <input
                  type="text"
                  className="w-full text-[13px] h-[38px] rounded-[8px] border border-[#ECE6F7] bg-white pl-10 pr-3 focus:outline-none"
                  placeholder="+880 555 0100"
                />
              </div>
            </div>

            {/* Member Since */}
            <div>
              <label className="block text-[12px] mb-1">Member Since</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9838E1]" />
                <input
                  type="text"
                  className="w-full text-[13px] h-[38px] rounded-[8px] border border-[#ECE6F7] bg-white pl-10 pr-3 focus:outline-none"
                  placeholder="January 2023"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- SAVED ADDRESSES ---------------- */}
        <section className="bg-white rounded-[14px] border border-[#ECE6F7] shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[15px] font-semibold text-[#1B1B1B]">
              Saved Addresses
            </h3>
            <button className="h-[34px] px-3 rounded-[8px] bg-white border border-[#E6DDF8] text-[12px] text-[#9838E1] font-medium flex items-center gap-1">
              + Add New Address
            </button>
          </div>

          {/* ADDRESS CARD 1 */}
          <div className="border border-[#ECE6F7] rounded-[10px] p-4 mb-4">
            <div className="flex justify-between items-center mb-1">
              <p className="text-[13px] font-medium">Home</p>
              <span className="text-[11px] bg-[#EDE4FF] text-[#9838E1] px-2 py-[2px] rounded-[6px]">
                Default
              </span>
            </div>

            <div className="pl-1 mt-2 space-y-1 text-[12px] text-[#666]">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#9838E1]" />
                123 Main Road Rampura, Dhaka 1205, Bangladesh
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#9838E1]" />
                +8801515-975442
              </p>
            </div>

            <div className="flex justify-end gap-4 mt-3">
              <Edit className="h-4 w-4 text-[#9838E1] cursor-pointer" />
              <Trash2 className="h-4 w-4 text-[#FF4D4F] cursor-pointer" />
            </div>
          </div>

          {/* ADDRESS CARD 2 */}
          <div className="border border-[#ECE6F7] rounded-[10px] p-4">
            <div className="flex justify-between items-center mb-1">
              <p className="text-[13px] font-medium">Office</p>
            </div>

            <div className="pl-1 mt-2 space-y-1 text-[12px] text-[#666]">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#9838E1]" />
                123 Main Road Rampura, Dhaka 1205, Bangladesh
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#9838E1]" />
                +8801515-975442
              </p>
            </div>

            <div className="flex justify-between items-center mt-3">
              <button className="px-3 py-[5px] rounded-[6px] text-[11px] border border-[#E6DDF8] text-[#9838E1]">
                Set as Default
              </button>

              <div className="flex gap-4">
                <Edit className="h-4 w-4 text-[#9838E1] cursor-pointer" />
                <Trash2 className="h-4 w-4 text-[#FF4D4F] cursor-pointer" />
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- SECURITY SETTINGS ---------------- */}
        <section className="bg-white rounded-[14px] border border-[#ECE6F7] shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-6">
          <h3 className="text-[15px] font-semibold text-[#1B1B1B] mb-4">
            Security Settings
          </h3>

          <div className="space-y-3">

            {/* Current password */}
            <div>
              <label className="block text-[12px] mb-1">Current Password</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9838E1]" />
                <input
                  type="password"
                  className="w-full h-[38px] pl-10 pr-3 rounded-[8px] border border-[#ECE6F7] focus:outline-none text-[13px]"
                  placeholder="Enter current password"
                />
              </div>
            </div>

            {/* New password */}
            <div>
              <label className="block text-[12px] mb-1">New Password</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9838E1]" />
                <input
                  type="password"
                  className="w-full h-[38px] pl-10 pr-3 rounded-[8px] border border-[#ECE6F7] text-[13px] focus:outline-none"
                  placeholder="Enter new password"
                />
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-[12px] mb-1">Confirm New Password</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9838E1]" />
                <input
                  type="password"
                  className="w-full h-[38px] pl-10 pr-3 rounded-[8px] border border-[#ECE6F7] text-[13px] focus:outline-none"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            {/* Update Button */}
            <button
              className="w-full h-[44px] rounded-[8px] text-[13px] text-white font-medium mt-3 shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
              style={{
                background: "linear-gradient(90deg,#9838E1,#F68E44)",
              }}
            >
              Update Password
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
