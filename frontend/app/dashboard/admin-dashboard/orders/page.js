"use client";

import { useState } from "react";
import Image from "next/image";
import {
  FiUsers,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiSearch,
  FiChevronDown,
} from "react-icons/fi";
import { LuTrash2 } from "react-icons/lu";
import {
  MdPlumbing,
  MdOutlineElectricalServices,
  MdOutlineHomeRepairService,
} from "react-icons/md";
import {
  GiGardeningShears,
  GiPaintRoller,
  GiPaw,
  GiBroom,
} from "react-icons/gi";
import { CiEdit } from "react-icons/ci";
import Link from "next/link";

export default function Services() {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const stats = [
    { id: 1, label: "Total Products", value: "45,500", icon: FiUsers },
    { id: 2, label: "Active", value: "45,500", icon: FiCheckCircle },
    { id: 3, label: "Pending Approve", value: "45,500", icon: FiClock },
    { id: 4, label: "Rejected", value: "500", icon: FiXCircle },
  ];
  const orders = [
    {
      id: "#ORD-2501",
      product: "Wireless Headphones",
      img: "/product/bag.jpg",
      customer: "Wade Warren",
      seller: "Cody Fisher",
      amount: "$1,250.00",
      status: "Delivered",
      date: "2025-05-01",
    },
    {
      id: "#ORD-2502",
      product: "Smart Watch Pro",
      img: "/product/bag.jpg",
      customer: "Esther Howard",
      seller: "Wade Warren",
      amount: "$850.00",
      status: "Processing",
      date: "2025-05-01",
    },
    {
      id: "#ORD-2503",
      product: "TV",
      img: "/product/bag.jpg",
      customer: "Leslie Alexander",
      seller: "Marvin McKinney",
      amount: "$5,250.00",
      status: "Canceled",
      date: "2025-05-01",
    },
    {
      id: "#ORD-2504",
      product: "Laptop Stand",
      img: "/product/bag.jpg",
      customer: "Jacob Jones",
      seller: "Guy Hawkins",
      amount: "$250.00",
      status: "Delivered",
      date: "2025-05-01",
    },
    {
      id: "#ORD-2505",
      product: "SSD",
      img: "/product/bag.jpg",
      customer: "Jacob Jones",
      seller: "Darlene Robertson",
      amount: "$750.00",
      status: "Pending",
      date: "2025-05-01",
    },
    {
      id: "#ORD-2506",
      product: "Webcam HD",
      img: "/product/bag.jpg",
      customer: "Jacob Jones",
      seller: "Guy Hawkins",
      amount: "$870.00",
      status: "Processing",
      date: "2025-05-01",
    },
  ];

  const statusStyles = {
    Delivered: "bg-[#E6F8EF] text-[#32A35A]",
    Processing: "bg-[#FFF8E6] text-[#C47F00]",
    Canceled: "bg-[#FEE2E2] text-[#D9534F]",
    Pending: "bg-[#F3E8FF] text-[#9333EA]",
  };

  const products = [
    {
      id: 1,
      name: "Wireless Headphones",
      category: "Electronics",
      seller: "Cody Fisher",
      price: "$1,250.00",
      stock: 36,
      sales: 16,
      status: "Active",
      img: "/product/bag.jpg",
    },
    {
      id: 2,
      name: "Smart Watch Pro",
      category: "Wearables",
      seller: "Wade Warren",
      price: "$850.00",
      stock: 25,
      sales: 69,
      status: "Rejected",
      img: "/product/bag.jpg",
    },
    {
      id: 3,
      name: "TV",
      category: "Electronics",
      seller: "Marvin McKinney",
      price: "$5,250.00",
      stock: 16,
      sales: 36,
      status: "Active",
      img: "/product/bag.jpg",
    },
    {
      id: 4,
      name: "Laptop Stand",
      category: "Accessories",
      seller: "Guy Hawkins",
      price: "$250.00",
      stock: 96,
      sales: 53,
      status: "Pending",
      img: "/product/bag.jpg",
    },
    {
      id: 5,
      name: "SSD",
      category: "Storage",
      seller: "Darlene Robertson",
      price: "$750.00",
      stock: 69,
      sales: 96,
      status: "Active",
      img: "/product/bag.jpg",
    },
    {
      id: 6,
      name: "Webcam HD",
      category: "Electronics",
      seller: "Guy Hawkins",
      price: "$870.00",
      stock: 53,
      sales: 25,
      status: "Pending",
      img: "/product/bag.jpg",
    },
  ];

  const statusColors = {
    Active: "bg-[#E6F8EF] text-[#32A35A]",
    Pending: "bg-[#FFF5E5] text-[#F59E0B]",
    Rejected: "bg-[#FEE2E2] text-[#D32F2F]",
  };

  return (
    <div className="min-h-screen w-full px-2 pt-6">
      {/* Header */}
      <div>
        <h1 className="text-[26px] font-semibold text-gray-900">
          Product Orders
        </h1>
        <p className="text-sm text-[#9C6BFF] mt-1">
          Manage all marketplace products
        </p>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
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
              <th className="py-3 px-4 font-semibold">ORDER ID</th>
              <th className="py-3 px-4 font-semibold">PRODUCT</th>
              <th className="py-3 px-4 font-semibold">CUSTOMER</th>
              <th className="py-3 px-4 font-semibold">SELLER</th>
              <th className="py-3 px-4 font-semibold">AMOUNT</th>
              <th className="py-3 px-4 font-semibold">STATUS</th>
              <th className="py-3 px-4 font-semibold">DATE</th>
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
                  <span className="text-gray-800">{item.product}</span>
                </td>

                {/* Customer */}
                <td className="py-4 px-4 text-gray-700">{item.customer}</td>

                {/* Seller */}
                <td className="py-4 px-4 text-gray-700">{item.seller}</td>

                {/* Amount */}
                <td className="py-4 px-4 font-medium text-[#F88D25]">
                  {item.amount}
                </td>

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

                {/* Date */}
                <td className="py-4 px-4 text-gray-700">{item.date}</td>

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
