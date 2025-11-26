"use client";
import { FiSearch } from "react-icons/fi";
import { MdKeyboardArrowDown } from "react-icons/md";
import { HiPlus } from "react-icons/hi";

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
          <button className="flex items-center gap-2 bg-gradient-to-r from-[#AA4BF5] to-[#FF7C74] text-white px-5 py-3 rounded-lg text-sm shadow-md">
            <HiPlus className="text-lg" />
            Add New Product
          </button>
        </div>
      </div>

      {/* Search + Filter + Add Button */}
      <div className="mt-6 flex flex-col md:flex-row items-center gap-4 md:justify-between">
        {/* Search */}
        <div className="w-full md:w-[60%] relative">
          <FiSearch className="absolute top-3 left-3 text-gray-400 text-xl" />
          <input
            type="text"
            placeholder="Search customer..."
            className="w-full bg-white border border-gray-300 rounded-lg py-3 pl-10 pr-4 text-sm focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3 w-48 bg-white border border-gray-300">
          {/* Filter Dropdown */}
          <div className="relative w-full">
            <select className="  rounded-lg px-4 py-3 text-sm appearance-none pr-10">
              <option>All</option>
            </select>
            <MdKeyboardArrowDown className="absolute right-3 top-3 text-xl text-gray-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
