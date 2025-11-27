"use client";

import Image from "next/image";
import { FiTrendingUp, FiCheckCircle, FiStar, FiClock, FiMapPin } from "react-icons/fi";

export default function DashboardOverview() {
  const stats = [
    {
      icon: <FiTrendingUp className="text-[#8B4BFF] text-3xl" />,
      value: "$45,655.00",
      label: "Total Earning",
      color: "text-[#8B4BFF]",
    },
    {
      icon: <FiCheckCircle className="text-[#8B4BFF] text-3xl" />,
      value: "459",
      label: "Complete Services",
      color: "text-[#8B4BFF]",
    },
    {
      icon: <FiStar className="text-[#8B4BFF] text-3xl" />,
      value: "400",
      label: "New Review",
      color: "text-[#8B4BFF]",
    },
    {
      icon: <FiClock className="text-[#FF782D] text-3xl" />,
      value: "95",
      label: "Pending Services",
      color: "text-[#FF782D]",
    },
  ];

  const bookings = [
    { name: "Cody Fisher", status: "Completed", badge: "bg-[#DFFFE5] text-[#1A8F3A]" },
    { name: "Cody Fisher", status: "Pending", badge: "bg-[#FFF4D3] text-[#D6A100]" },
    { name: "Cody Fisher", status: "Canceled", badge: "bg-[#FFE1E1] text-[#D70015]" },
    { name: "Cody Fisher", status: "Completed", badge: "bg-[#DFFFE5] text-[#1A8F3A]" },
  ];

  const upcoming = [
    { name: "Cody Fisher" },
    { name: "Cody Fisher" },
    { name: "Cody Fisher" },
  ];

  return (
    <div className="min-h-screen bg-[#F4F3F7] p-6">
      <div className="max-w-[1300px] mx-auto">

        {/* Page Header */}
        <h2 className="text-[26px] font-bold text-[#1F1F1F]">Dashboard Overview</h2>
        <p className="text-sm text-[#8B8498] mb-6">Welcome back! Service Provider Admin</p>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pb-2">
          {stats.map((item, i) => (
            <div
              key={i}
              className="bg-white border border-[#EFEAF6] rounded-xl px-5 py-5 shadow-sm flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-[#F9F5FF] flex items-center justify-center">
                {item.icon}
              </div>
              <div>
                <h3 className={`text-lg font-bold ${item.color}`}>{item.value}</h3>
                <p className="text-sm text-[#7C7A87]">{item.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* TWO MAIN CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

          {/* Income Overview Card */}
          <div className="bg-white p-6 rounded-xl border border-[#EEEAF5] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Income Overview</h3>
              <select className="border rounded-lg px-3 py-1 text-sm">
                <option>All</option>
                <option>Monthly</option>
                <option>Yearly</option>
              </select>
            </div>

            {/* Chart Image (Replace with real chart later) */}
            <div className="relative w-full h-[230px]">
              <Image
                src="/c8cc1d49-0aee-4779-8e56-67c410323371.png"
                alt="Income Chart"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>

          {/* Booking Overview */}
          <div className="bg-white p-6 rounded-xl border border-[#EEEAF5] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Booking Overview</h3>
              <select className="border rounded-lg px-3 py-1 text-sm">
                <option>All</option>
                <option>Monthly</option>
                <option>Yearly</option>
              </select>
            </div>

            <div className="relative w-full h-[230px]">
              <Image
                src="/c8cc1d49-0aee-4779-8e56-67c410323371.png"
                alt="Donut Chart"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>

        </div>

        {/* BOOKINGS ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

          {/* Today's Bookings */}
          <div className="bg-white p-6 rounded-xl border border-[#EFEAF6] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Today's Bookings</h3>
              <button className="text-[#8B4BFF] text-sm">View All</button>
            </div>

            <div className="space-y-3">
              {bookings.map((b, i) => (
                <div
                  key={i}
                  className="p-4 border rounded-xl bg-[#FAFAFF] flex items-center justify-between"
                >
                  <div className="flex gap-3">
                    <Image
                      src="/avatar.png"
                      width={45}
                      height={45}
                      alt="avatar"
                      className="rounded-full"
                    />
                    <div>
                      <p className="font-semibold">Cody Fisher</p>
                      <p className="text-xs text-[#7B7985]">Electrical Work</p>
                      <div className="flex items-center gap-1 text-xs text-[#7B7985]">
                        <FiMapPin /> 123 Main Road Rampura, Dhaka 1205.
                        <FiClock /> 08.00 AM
                      </div>
                    </div>
                  </div>

                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${b.badge}`}>
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Bookings */}
          <div className="bg-white p-6 rounded-xl border border-[#EFEAF6] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Upcoming Bookings</h3>
              <button className="text-[#8B4BFF] text-sm">View All</button>
            </div>

            <div className="space-y-3">
              {upcoming.map((b, i) => (
                <div
                  key={i}
                  className="p-4 border rounded-xl bg-[#FAFAFF] flex items-center justify-between"
                >
                  <div className="flex gap-3">
                    <Image
                      src="/avatar.png"
                      width={45}
                      height={45}
                      alt="avatar"
                      className="rounded-full"
                    />
                    <div>
                      <p className="font-semibold">Cody Fisher</p>
                      <p className="text-xs text-[#7B7985]">Electrical Work</p>
                      <div className="flex items-center gap-1 text-xs text-[#7B7985]">
                        <FiMapPin /> Friday, April 12, 2024
                        <FiClock /> 08.00 AM
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
