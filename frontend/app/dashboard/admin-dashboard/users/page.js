"use client";

import { useState } from "react";
import Image from "next/image";
import { FiUsers, FiShoppingBag, FiUserCheck, FiSearch } from "react-icons/fi";
import { TbUserStar } from "react-icons/tb";

const users = [
  {
    id: 1,
    name: "Cody Fisher",
    email: "debbie.baker@example.com",
    phone: "(629) 555-0129",
    type: "Buyer",
    status: "Active",
    registered: "2025-05-01",
    orders: 16,
    total: "$1,250.00",
    avatar: "/user2.png",
  },
  {
    id: 2,
    name: "Wade Warren",
    email: "kenzi.lawson@example.com",
    phone: "(208) 555-0112",
    type: "Seller",
    status: "Active",
    registered: "2025-05-01",
    orders: 69,
    total: "$850.00",
    avatar: "/user2.png",
  },
  {
    id: 3,
    name: "Marvin McKinney",
    email: "bill.sanders@example.com",
    phone: "(907) 555-0101",
    type: "Service Provider",
    status: "Suspended",
    registered: "2025-05-01",
    orders: 36,
    total: "$5,250.00",
    avatar: "/user2.png",
  },
  {
    id: 4,
    name: "Guy Hawkins",
    email: "bill.sanders@example.com",
    phone: "(252) 555-0126",
    type: "Seller",
    status: "Active",
    registered: "2025-05-01",
    orders: 53,
    total: "$250.00",
    avatar: "/user2.png",
  },
  {
    id: 5,
    name: "Darlene Robertson",
    email: "Wade Warren",
    phone: "(405) 555-0120",
    type: "Seller",
    status: "Suspended",
    registered: "2025-05-01",
    orders: 96,
    total: "$750.00",
    avatar: "/user2.png",
  },
  {
    id: 6,
    name: "Guy Hawkins",
    email: "kenzi.lawson@example.com",
    phone: "(684) 555-0102",
    type: "Service Provider",
    status: "Active",
    registered: "2025-05-01",
    orders: 25,
    total: "$870.00",
    avatar: "/user2.png",
  },
];

const statusColors = {
  Active: "bg-[#E6F8EF] text-[#32A35A]",
  Suspended: "bg-[#FEE2E2] text-[#D32F2F]",
};

const statCards = [
  { id: 1, label: "Total Users", value: "45,500", icon: FiUsers },
  { id: 2, label: "Total Sellers", value: "45,500", icon: FiUserCheck },
  { id: 3, label: "Total Buyers", value: "45,500", icon: FiShoppingBag },
  {
    id: 4,
    label: "Total Service Providers",
    value: "45,500",
    icon: TbUserStar,
  },
];

export default function UserManagementPage() {
  const [activeTab, setActiveTab] = useState("All Users");

  const filteredUsers = users.filter((u) => {
    if (activeTab === "All Users") return true;
    return u.type === activeTab;
  });

  return (
    <div className="min-h-screen w-full bg-[#F7F7FA] px-6 py-6 md:px-10 md:py-8">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[26px] md:text-[28px] font-semibold text-gray-900">
            User Management
          </h1>
          <p className="text-sm text-[#9C6BFF] mt-1">
            Manage all platform users
          </p>
        </div>

        <button className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-medium bg-gradient-to-r from-[#8736C5] via-[#9C47C6] to-[#F88D25] shadow-md hover:opacity-90 transition">
          <span className="text-lg">+</span>
          Add Users
        </button>
      </div>

      {/* STAT CARDS */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="bg-white rounded-2xl shadow-sm border border-[#F0ECFF] px-6 py-5 flex items-center justify-between"
            >
              <div>
                {/* Title */}
                <p className="text-[15px] font-medium text-[#2E2E2E]">
                  {card.label}
                </p>

                {/* Value */}
                <p className="mt-1 text-[28px] font-semibold text-[#F88D25] leading-none">
                  {card.value}
                </p>
              </div>

              {/* Right Icon */}
              <div className="w-12 h-12 rounded-xl bg-[#F2E9FF] flex items-center justify-center">
                <Icon className="text-[26px] text-[#8736C5]" />
              </div>
            </div>
          );
        })}
      </div>

      {/* TABS + SEARCH */}
      <div className="mt-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* TABS */}
        <div className="flex flex-wrap gap-3">
          {["All Users", "Buyer", "Seller", "Service Provider"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition
                ${
                  activeTab === tab
                    ? "text-white bg-gradient-to-r from-[#8736C5] via-[#9C47C6] to-[#F88D25] shadow"
                    : "text-gray-700 bg-white border border-[#E4E2F5]"
                }
              `}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* SEARCH BAR */}
        <div className="w-full lg:w-[320px]">
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-[#F88D25]">
              <FiSearch size={18} />
            </span>
            <input
              type="text"
              placeholder="Search by name or email"
              className="w-full pl-9 pr-3 py-2.5 bg-white rounded-full border border-[#E4E2F5] text-sm focus:outline-none focus:ring-1 focus:ring-[#F88D25]"
            />
          </div>
        </div>
      </div>

      {/* USERS TABLE */}
      <div className="mt-6 mb-10 bg-white rounded-xl shadow-sm border border-[#F0ECFF] p-4 md:p-5">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="text-[12px] text-[#A3A3B5] border-b border-gray-200 bg-[#F9F6FF]">
                <th className="py-3 px-3">USER</th>
                <th className="py-3 px-3">CONTACT</th>
                <th className="py-3 px-3">TYPE</th>
                <th className="py-3 px-3">STATUS</th>
                <th className="py-3 px-3">REGISTERED</th>
                <th className="py-3 px-3">ORDERS</th>
                <th className="py-3 px-3">TOTAL</th>
                <th className="py-3 px-3 text-right">ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user, idx) => (
                <tr
                  key={user.id}
                  className={`text-[13px] ${
                    idx !== filteredUsers.length - 1 ? "border-b border-gray-200" : ""
                  }`}
                >
                  {/* USER COLUMN */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={user.avatar}
                        width={40}
                        height={40}
                        alt="avatar"
                        className="rounded-full object-cover"
                      />
                      <p className="font-medium text-gray-800">{user.name}</p>
                    </div>
                  </td>

                  {/* CONTACT */}
                  <td className="py-3 px-3 text-gray-700">
                    <div className="flex flex-col">
                      <span>{user.email}</span>
                      <span className="text-xs text-gray-500">
                        {user.phone}
                      </span>
                    </div>
                  </td>

                  {/* TYPE */}
                  <td className="py-3 px-3 text-gray-700">{user.type}</td>

                  {/* STATUS */}
                  <td className="py-3 px-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        statusColors[user.status]
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>

                  {/* REGISTERED */}
                  <td className="py-3 px-3 text-gray-700">{user.registered}</td>

                  {/* ORDERS */}
                  <td className="py-3 px-3 text-gray-700">{user.orders}</td>

                  {/* TOTAL */}
                  <td className="py-3 px-3 text-[#F88D25] font-medium">
                    {user.total}
                  </td>

                  {/* ACTION BUTTON */}
                  <td className="py-3 px-3 text-right">
                    <button className="text-xs border rounded-lg px-3 py-1 text-[#9C6BFF] border-[#E2D4FF] bg-[#F9F6FF]">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
