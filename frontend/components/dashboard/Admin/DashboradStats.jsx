"use client";

import { LuUsers, LuShoppingBag, LuBriefcase, LuPackage } from "react-icons/lu";
import { FiBarChart2 } from "react-icons/fi";

const stats = [
  { id: 1, label: "Total Buyers", value: "45,655.00", change: "+12.5%", icon: LuUsers },
  { id: 2, label: "Total Sellers", value: "4,566", change: "+12.5%", icon: LuBriefcase },
  { id: 3, label: "Total Service Providers", value: "400", change: "+12.5%", icon: LuUsers },
  { id: 4, label: "Total Products", value: "45,655.00", change: "+12.5%", icon: LuPackage },
  { id: 5, label: "Total Services", value: "459", change: "+12.5%", icon: LuBriefcase },
  { id: 6, label: "Total Booking Service", value: "400", change: "+12.5%", icon: FiBarChart2 },
  { id: 7, label: "Total orders", value: "95,455", change: "+12.5%", icon: LuShoppingBag },
  { id: 8, label: "Platform Revenue", value: "$45,655.00", change: "+12.5%", icon: FiBarChart2 },
];

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-sm border border-[#F0ECFF] px-4 py-4 flex items-center justify-between"
          >
            <div>
              <p className="text-[13px] text-gray-500">{item.label}</p>
              <p className="text-[20px] font-semibold text-gray-900 mt-1">
                {item.value}
              </p>
              <p className="text-[11px] text-[#39B66A] mt-1 flex items-center gap-1">
                <span>{item.change}</span>
                <span className="text-gray-500">From last period</span>
              </p>
            </div>

            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-tr from-[#8736C5] via-[#9C6BFF] to-[#F88D25] text-white text-xl">
              <Icon />
            </div>
          </div>
        );
      })}
    </div>
  );
}
