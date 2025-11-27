"use client";

import Image from "next/image";
import { FiCamera, FiChevronDown } from "react-icons/fi";

export default function ProfileSettingsPage() {
  return (
    <div className="min-h-screen px-2 pt-6 flex justify-center">
      <div className="w-full space-y-8">

        {/* ================= BASIC INFORMATION CARD ================= */}
        <div className="bg-white border border-[#EFE9FF] rounded-2xl shadow-sm p-6">
          <h2 className="text-[18px] font-semibold text-gray-900 mb-6">
            Basic Information
          </h2>

          {/* Profile Picture */}
          <div className="flex items-start gap-5 mb-6">
            <div className="relative w-20 h-20 rounded-full overflow-hidden">
              <Image
                src="/user3.png"
                alt="Profile"
                fill
                className="object-cover"
              />
            </div>

            <div>
              <p className="text-sm font-medium text-gray-900">Profile Picture</p>
              <p className="text-xs text-[#9C6BFF] mb-2">PNG, JPG up to 5MB</p>

              <button className="w-8 h-8 rounded-full bg-[#F3E8FF] flex items-center justify-center text-[#A855F7]">
                <FiCamera />
              </button>
            </div>
          </div>

          {/* Full Name */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700">Full Name*</label>
            <input
              defaultValue="John Seller"
              className="mt-1 w-full px-3 py-2 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] text-sm outline-none focus:ring-2 focus:ring-[#C4B5FD]"
            />
          </div>

          {/* Email + Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Email Address*</label>
              <input
                defaultValue="contact@techshiven.com"
                className="mt-1 w-full px-3 py-2 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] text-sm outline-none focus:ring-2 focus:ring-[#C4B5FD]"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Phone Number*</label>
              <input
                defaultValue="(623) 555-0123"
                className="mt-1 w-full px-3 py-2 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] text-sm outline-none focus:ring-2 focus:ring-[#C4B5FD]"
              />
            </div>
          </div>

          {/* Service Name + Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Service Name*</label>
              <input
                defaultValue="Electrician"
                className="mt-1 w-full px-3 py-2 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] text-sm outline-none focus:ring-2 focus:ring-[#C4B5FD]"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Service Categories*</label>
              <input
                defaultValue="Electrical"
                className="mt-1 w-full px-3 py-2 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] text-sm outline-none focus:ring-2 focus:ring-[#C4B5FD]"
              />
            </div>
          </div>

          {/* Service Area + Radius */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Service Area</label>
              <input
                defaultValue="New York"
                className="mt-1 w-full px-3 py-2 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] text-sm outline-none focus:ring-2 focus:ring-[#C4B5FD]"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Service Radius</label>
              <div className="relative">
                <input
                  defaultValue="12"
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] text-sm pr-8 outline-none focus:ring-2 focus:ring-[#C4B5FD]"
                />
                <FiChevronDown className="absolute right-3 top-[55%] -translate-y-1/2 text-gray-500 text-[18px]" />
              </div>
            </div>
          </div>

          {/* Hourly Rate + Experience */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Hourly Rate ($)</label>
              <div className="relative">
                <input
                  defaultValue="60"
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] text-sm pr-8 outline-none focus:ring-2 focus:ring-[#C4B5FD]"
                />
                <FiChevronDown className="absolute right-3 top-[55%] -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Years of Experience</label>
              <div className="relative">
                <input
                  defaultValue="12"
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] text-sm pr-8 outline-none focus:ring-2 focus:ring-[#C4B5FD]"
                />
                <FiChevronDown className="absolute right-3 top-[55%] -translate-y-1/2 text-gray-500" />
              </div>
            </div>
          </div>

          {/* Service Description */}
          <div>
            <label className="text-sm font-medium text-gray-700">Service Description</label>
            <textarea
              rows={4}
              defaultValue="Electrician"
              className="mt-1 w-full px-3 py-2 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] text-sm outline-none focus:ring-2 focus:ring-[#C4B5FD]"
            />
          </div>

          {/* Save Button */}
          <div className="mt-6 flex">
            <button className="px-10 py-2.5 rounded-xl text-white font-medium bg-gradient-to-r from-[#8736C5] to-[#F88D25] shadow hover:opacity-90 transition">
              Save Changes
            </button>
          </div>
        </div>

        {/* ================= PASSWORD CHANGE CARD ================= */}
        <div className="bg-white border border-[#EFE9FF] rounded-2xl shadow-sm p-6">
          <h2 className="text-[18px] font-semibold text-gray-900 mb-6">
            Change Password
          </h2>

          {/* Current Password */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700">Current Password*</label>
            <input
              defaultValue="KNXLK"
              className="mt-1 w-full px-3 py-2 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] text-sm outline-none focus:ring-2 focus:ring-[#C4B5FD]"
            />
          </div>

          {/* New Password + Confirm */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium text-gray-700">New Password*</label>
              <input
                defaultValue="KDKDVCX"
                className="mt-1 w-full px-3 py-2 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] text-sm outline-none focus:ring-2 focus:ring-[#C4B5FD]"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Confirm New Password*</label>
              <input
                defaultValue="DKJBCDD"
                className="mt-1 w-full px-3 py-2 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] text-sm outline-none focus:ring-2 focus:ring-[#C4B5FD]"
              />
            </div>
          </div>

          {/* Update Button */}
          <div className="mt-6 flex">
            <button className="px-10 py-2.5 rounded-xl text-white font-medium bg-gradient-to-r from-[#8736C5] to-[#F88D25] shadow hover:opacity-90 transition">
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
