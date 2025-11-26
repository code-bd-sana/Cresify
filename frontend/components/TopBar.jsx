"use client";

import { FiMenu } from "react-icons/fi";
import Image from "next/image";

export default function Topbar({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-10 bg-white ml-10 rounded-b-xl">
      <div className="flex items-center justify-between px-4 py-5">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-white shadow-sm"
            onClick={onMenuClick}
          >
            <FiMenu className="text-xl text-[#6F6C90]" />
          </button>
          <span className="hidden md:inline text-2xl font-bold">
            Dashboard
          </span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-sm font-semibold text-gray-900">
              Wade Warren
            </span>
            <span className="text-[11px] text-[#8C8CA1]">Store Owner</span>
          </div>
          <div className="w-9 h-9 rounded-full border border-[#E5E4F0] overflow-hidden bg-white">
            <Image
              src="/avatar.jpg"
              alt="User avatar"
              width={36}
              height={36}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
