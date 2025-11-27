"use client";

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
import { MdPlumbing, MdOutlineElectricalServices, MdOutlineHomeRepairService } from "react-icons/md";
import { GiGardeningShears, GiPaintRoller, GiPaw, GiBroom } from "react-icons/gi";
import { CiEdit } from "react-icons/ci";

export default function ProductManagementPage() {
  const stats = [
    {
      id: 1,
      label: "Total Products",
      value: "45,500",
      icon: FiUsers,
    },
    {
      id: 2,
      label: "Active",
      value: "45,500",
      icon: FiCheckCircle,
    },
    {
      id: 3,
      label: "Pending Approve",
      value: "45,500",
      icon: FiClock,
    },
    {
      id: 4,
      label: "Rejected",
      value: "500",
      icon: FiXCircle,
    },
  ];

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

  

const iconMap = {
  Plumbing: MdPlumbing,
  Electrical: MdOutlineElectricalServices,
  Gardening: GiGardeningShears,
  Painting: GiPaintRoller,
  "Pet Care": GiPaw,
  "Home Cleaning": GiBroom,
  "Pest Control": MdOutlineHomeRepairService,
};

const categories = [
  { id: 1, name: "Plumbing", providers: 48 },
  { id: 2, name: "Plumbing", providers: 48 },
  { id: 3, name: "Electrical", providers: 48 },
  { id: 4, name: "Gardening", providers: 48 },
  { id: 5, name: "Painting", providers: 48 },
  { id: 6, name: "Pet Care", providers: 48 },
  { id: 7, name: "Home Cleaning", providers: 48 },
  { id: 8, name: "Pest Control", providers: 48 },
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
          Product Management
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

      {/* Search + Filter */}
      <div className="mt-8 bg-white p-4 rounded-xl border border-[#ECECEC] shadow-sm flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative w-full">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
          <input
            type="text"
            placeholder="Search by order ID or customer name..."
            className="w-full bg-[#FCFCFF] border border-[#E5E7EB] rounded-lg pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#A855F7]/40"
          />
        </div>

        {/* Filter dropdown */}
        <div className="relative w-full md:w-80">
          <select className="appearance-none w-full px-4 py-3 bg-[#FCFCFF] border border-[#E5E7EB] text-sm rounded-lg outline-none cursor-pointer">
            <option>All Product</option>
            <option>Delivered</option>
            <option>Pending</option>
            <option>Processing</option>
            <option>Canceled</option>
            <option>Shipping</option>
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-[#F0ECFF] p-5 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[#9838E1] text-[12px] bg-[#F8F4FD] border-b border-gray-200">
              <th className="py-3 px-3 text-left">PRODUCT</th>
              <th className="py-3 px-3 text-left">SELLER</th>
              <th className="py-3 px-3 text-left">CATEGORY</th>
              <th className="py-3 px-3 text-left">PRICE</th>
              <th className="py-3 px-3 text-left">STOCK</th>
              <th className="py-3 px-3 text-left">SALES</th>
              <th className="py-3 px-3 text-left">STATUS</th>
              <th className="py-3 px-3 text-right">ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {products.map((item, idx) => (
              <tr
                key={item.id}
                className={`text-[13px] ${
                  idx !== products.length - 1 ? "border-b border-gray-200" : ""
                }`}
              >
                {/* Product */}
                <td className="py-3 px-3 flex items-center gap-3">
                  <Image
                    src={item.img}
                    alt={item.name}
                    width={50}
                    height={50}
                    className="rounded-lg object-cover"
                  />
                  {item.name}
                </td>

                {/* Seller */}
                <td className="py-3 px-3 text-gray-700">{item.seller}</td>

                {/* Category */}
                <td className="py-3 px-3 text-gray-700">{item.category}</td>

                {/* Price */}
                <td className="py-3 px-3 text-[#F88D25] font-medium">
                  {item.price}
                </td>

                {/* Stock */}
                <td className="py-3 px-3 text-gray-700">{item.stock}</td>

                {/* Sales */}
                <td className="py-3 px-3 text-gray-700">{item.sales}</td>

                {/* Status */}
                <td className="py-3 px-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      statusColors[item.status]
                    }`}
                  >
                    {item.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="py-3 px-3 text-right">
                  <button className="text-xs border rounded-lg px-3 py-1 text-[#9C6BFF] border-[#E2D4FF] bg-[#F9F6FF] mr-2">
                    View
                  </button>
                  <button className="text-xs bg-[#E6F8EF] text-[#32A35A] px-2 py-1 rounded-lg mr-2">
                    ✔
                  </button>
                  <button className="text-xs bg-[#FEE2E2] text-[#D32F2F] px-2 py-1 rounded-lg">
                    ✖
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
