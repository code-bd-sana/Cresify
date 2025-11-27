"use client";

import { useState } from "react";
import Image from "next/image";
import {
  FiUsers,
  FiCheckCircle,
  FiClock,
  FiSearch,
  FiChevronDown,
} from "react-icons/fi";
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

export default function Services() {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const stats = [
    { id: 1, label: "Total Transaction", value: "45,500", icon: FiUsers },
    { id: 2, label: "Total Platform Revenue", value: "45,500", icon: FiCheckCircle },
    { id: 3, label: "Total Refunds", value: "45,500", icon: FiClock },
  ];
  const orders = [
    {
      id: "#TXN-2501",
      service: "Clean Pro Services",
      img: "/booking/service.jpg",
      customer: "Wade Warren",
      seller: "Electrical",
      amount: "$1,250.00",
      status: "Delivered",
      date: "2025-05-01",
    },
    {
      id: "#ORD-2501",
      service: "Clean Pro Services",
      img: "/booking/service.jpg",
      customer: "Wade Warren",
      seller: "Electrical",
      amount: "$1,250.00",
      status: "Delivered",
      date: "2025-05-01",
    },
    {
      id: "#ORD-2501",
      service: "Clean Pro Services",
      img: "/booking/service.jpg",
      customer: "Wade Warren",
      seller: "Electrical",
      amount: "$1,250.00",
      status: "Delivered",
      date: "2025-05-01",
    },
    {
      id: "#ORD-2501",
      service: "Clean Pro Services",
      img: "/booking/service.jpg",
      customer: "Wade Warren",
      seller: "Electrical",
      amount: "$1,250.00",
      status: "Delivered",
      date: "2025-05-01",
    },
    {
      id: "#ORD-2501",
      service: "Clean Pro Services",
      img: "/booking/service.jpg",
      customer: "Wade Warren",
      seller: "Electrical",
      amount: "$1,250.00",
      status: "Delivered",
      date: "2025-05-01",
    },
    {
      id: "#ORD-2501",
      service: "Clean Pro Services",
      img: "/booking/service.jpg",
      customer: "Wade Warren",
      seller: "Electrical",
      amount: "$1,250.00",
      status: "Delivered",
      date: "2025-05-01",
    },
    {
      id: "#ORD-2501",
      service: "Clean Pro Services",
      img: "/booking/service.jpg",
      customer: "Wade Warren",
      seller: "Electrical",
      amount: "$1,250.00",
      status: "Delivered",
      date: "2025-05-01",
    },
    {
      id: "#ORD-2501",
      service: "Clean Pro Services",
      img: "/booking/service.jpg",
      customer: "Wade Warren",
      seller: "Electrical",
      amount: "$1,250.00",
      status: "Delivered",
      date: "2025-05-01",
    },
  ];

  const statusStyles = {
    Delivered: "bg-[#E6F8EF] text-[#32A35A]",
    Processing: "bg-[#FFF8E6] text-[#C47F00]",
    Canceled: "bg-[#FEE2E2] text-[#D9534F]",
    Pending: "bg-[#F3E8FF] text-[#9333EA]",
  };

  const [filter, setFilter] = useState("All");

  const barData = [
    { name: "Sellers", value: 6500 },
    { name: "Service Provider", value: 8000 },
  ];

  const pieData = [
    { name: "Refunds", value: 1295654, color: "#F88D25" },
    { name: "Total Revenue", value: 1295654, color: "#9838E1" },
  ];

  return (
    <div className="min-h-screen w-full px-2 pt-6">
      {/* Header */}
      <div>
        <h1 className="text-[26px] font-semibold text-gray-900">
          Service Booking
        </h1>
        <p className="text-sm text-[#9C6BFF] mt-1">
          Manage all marketplace products
        </p>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {stats.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="bg-white rounded-xl shadow-sm border border-[#F0ECFF] px-5 py-4 flex items-center justify-between"
            >
              <div>
                <p className="text-[13px] text-gray-600">{card.label}</p>
                <p className="mt-2 text-[22px] font-semibold text-[#F88D25]">
                  {card.value}
                </p>
              </div>

              <div className="w-10 h-10 bg-[#F5F0FF] flex items-center justify-center rounded-lg text-[#9C6BFF] text-xl">
                <Icon />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* ===================== TOTAL REVENUE BAR ===================== */}
        <div className="bg-white border border-[#EFE8FF] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[17px] font-semibold text-gray-900">
              Total Revenue
            </h2>

            {/* Filter Dropdown */}
            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="appearance-none bg-[#F7F7FA] border border-gray-300 px-3 py-1.5 rounded-lg text-sm text-gray-700 pr-8 cursor-pointer"
              >
                <option>All</option>
                <option>Today</option>
                <option>This Month</option>
                <option>This Year</option>
              </select>

              <FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>

          <div className="w-full h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} fillOpacity={1}>
                  <Cell fill="#F88D25" />
                  <Cell fill="#9838E1" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ===================== REVENUE OVERVIEW PIE ===================== */}
        <div className="bg-white border border-[#EFE8FF] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[17px] font-semibold text-gray-900">
              Revenue Overview
            </h2>

            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="appearance-none bg-[#F7F7FA] border border-gray-300 px-3 py-1.5 rounded-lg text-sm text-gray-700 pr-8 cursor-pointer"
              >
                <option>All</option>
                <option>Today</option>
                <option>This Month</option>
                <option>This Year</option>
              </select>

              <FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>

          <div className="w-full h-[250px] flex items-center justify-center">
            <ResponsiveContainer width="75%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={6}
                  cornerRadius={20}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Labels exactly like screenshot */}
            <div className="text-[12px] space-y-2 ml-[-10px]">
              <p className="flex items-center gap-2 text-[#F88D25]">
                <span className="block w-3 h-3 rounded-full bg-[#F88D25]"></span>
                Total refunds <br />
                <span className="text-black font-medium">12,95,654</span>
              </p>

              <p className="flex items-center gap-2 text-[#9838E1]">
                <span className="block w-3 h-3 rounded-full bg-[#9838E1]"></span>
                Total Revenue <br />
                <span className="text-black font-medium">12,95,654</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------- */}
      {/*       SEARCH + FILTER     */}
      {/* ------------------------- */}
      <div className="mt-8 bg-white p-4 rounded-xl border border-[#ECECEC] shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
          <input
            type="text"
            placeholder="Search by order ID or customer name..."
            className="w-full bg-[#FCFCFF] border border-[#E5E7EB] rounded-lg pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#A855F7]/40"
          />
        </div>

        <div className="relative w-full md:w-80">
          <select className="appearance-none w-full px-4 py-3 bg-[#FCFCFF] border border-[#E5E7EB] text-sm rounded-lg outline-none cursor-pointer">
            <option>View All</option>
            <option>Delivered</option>
            <option>Pending</option>
            <option>Processing</option>
            <option>Canceled</option>
            <option>Shipping</option>
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg pointer-events-none" />
        </div>
      </div>

      {/* ------------------------- */}
      {/*       PRODUCT TABLE       */}
      {/* ------------------------- */}
      {/* Table */}
      {/* (Your full table is unchanged – omitted here to save space) */}
      {/* Keep your existing table code */}
      {/* Table */}
      <div className="mt-8 bg-white rounded-2xl shadow-sm border border-[#EFE8FF] p-6 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-[#9838E1] text-[13px] bg-[#F8F4FD] border-b border-[#EDE7FF]">
              <th className="py-3 px-4 font-semibold">TRANSACTION ID</th>
              <th className="py-3 px-4 font-semibold">SERVICE/PRODUCT</th>
              <th className="py-3 px-4 font-semibold">FORM</th>
              <th className="py-3 px-4 font-semibold">TO</th>
              <th className="py-3 px-4 font-semibold">AMOUNT</th>
              <th className="py-3 px-4 font-semibold">METHOD</th>
              <th className="py-3 px-4 font-semibold">STATUS</th>
              <th className="py-3 px-4 font-semibold text-right">ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((item, idx) => (
              <tr
                key={item.id}
                className="text-[12px] border-b border-gray-200 last:border-0 hover:bg-[#FAF8FF]"
              >
                {/* Order ID */}
                <td className="py-4 px-4 text-gray-700">{item.id}</td>

                {/* Product */}
                <td className="py-4 px-4 flex items-center gap-3">
                  <Image
                    src={item.img}
                    alt={item.product}
                    width={45}
                    height={45}
                    className="rounded-lg object-cover"
                  />
                  <span className="text-gray-800">{item.service}</span>
                </td>

                {/* Customer */}
                <td className="py-4 px-4 text-gray-700">{item.customer}</td>

                {/* Seller */}
                <td className="py-4 px-4 text-gray-700">{item.seller}</td>

                {/* Amount */}
                <td className="py-4 px-4 font-medium text-[#F88D25]">
                  {item.amount}
                </td>

                {/* Date */}
                <td className="py-4 px-4 text-gray-700">{item.date}</td>
                {/* Status */}
                <td className="py-4 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      statusStyles[item.status]
                    }`}
                  >
                    {item.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="py-4 px-4 text-right">
                  <button className="px-5 py-1.5 text-[13px] rounded-lg border border-[#C69CFF] text-[#9838E1] hover:bg-[#F8F1FF] transition">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
