"use client";

import DailySales from "@/components/dashboard/product/analytics/DailySales";
import OrderStatusChart from "@/components/dashboard/product/analytics/OrderStatusChart";
import TopSellingProduct from "@/components/dashboard/product/analytics/TopSellingProduct";
import StatCard from "@/components/StatCard";
import RevenueTrend from "@/components/dashboard/product/analytics/RevenueTrend";
import { FiEye, FiShoppingCart, FiPercent, FiDollarSign } from "react-icons/fi";

export default function Analytics() {
  return (
    <div className="w-full min-h-screen bg-[#F4F3F7] px-2 py-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-[#1D1D1F]">
            Analytics
          </h1>
          <p className="text-[#A78BFA] text-sm mt-1">
            Track your store performance and insights
          </p>
        </div>

        <select className="bg-white border border-[#EEEAF5] rounded-lg px-4 py-2 shadow-sm text-sm">
          <option>All</option>
          <option>This Month</option>
          <option>Last Month</option>
        </select>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <StatCard
          icon={<FiEye className="text-[22px] text-[#A155FB]" />}
          value="15,655"
          label="Total Views"
          percent="12.5"
        />

        <StatCard
          icon={<FiShoppingCart className="text-[22px] text-[#F39C4A]" />}
          value="1248"
          label="Orders"
          percent="8.5"
        />

        <StatCard
          icon={<FiPercent className="text-[22px] text-[#A155FB]" />}
          value="5.5%"
          label="Conversion Rate"
          percent="3"
        />

        <StatCard
          icon={<FiDollarSign className="text-[22px] text-[#A155FB]" />}
          value="$129.36"
          label="Avg Order Value"
          percent="12"
        />
      </div>

      {/* CHART GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <RevenueTrend />
        <DailySales />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <OrderStatusChart />
        <TopSellingProduct />
      </div>
    </div>
  );
}
