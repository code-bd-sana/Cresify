"use client";
import { FiChevronDown, FiSearch } from "react-icons/fi";
import { MdKeyboardArrowDown } from "react-icons/md";
import { HiPlus } from "react-icons/hi";
import Link from "next/link";

export default function ProductHeader() {
  return (
    <div className="w-full mb-6">
      <div className="flex justify-between">
        <div>
          <h2 className="text-[28px] font-semibold">Products</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage your product inventory
          </p>
        </div>
        <div>
          {/* Add Button */}
          <Link href="/dashboard/products/add-product" className="flex items-center gap-2 bg-gradient-to-r from-[#AA4BF5] to-[#FF7C74] text-white px-5 py-3 rounded-lg text-sm shadow-md">
            <HiPlus className="text-lg" />
            Add New Product
          </Link>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="mt-8 bg-white p-4 rounded-xl border border-[#ECECEC] shadow-sm flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative w-full">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
          <input
            type="text"
            placeholder="Search by order ID or customer name..."
            className="w-full border border-[#E5E7EB] rounded-lg pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#A855F7]/40"
          />
        </div>

        {/* Filter dropdown */}
        <div className="relative w-full md:w-40">
          <select className="appearance-none w-full px-4 py-3 border border-[#E5E7EB] text-sm rounded-lg outline-none cursor-pointer">
            <option>All</option>
            <option>Delivered</option>
            <option>Pending</option>
            <option>Processing</option>
            <option>Canceled</option>
            <option>Shipping</option>
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
