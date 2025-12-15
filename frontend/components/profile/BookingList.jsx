"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  TimerIcon,
  Eye,
  X,
} from "lucide-react";

export default function BookingList() {
  const tabs = [
    { id: "all", label: "All Booking", count: 3 },
    { id: "upcoming", label: "Upcoming", count: 1 },
    { id: "completed", label: "Completed", count: 1 },
  ];

  const [activeTab, setActiveTab] = useState("all");

  const bookings = [
    {
      id: "CRDF5814",
      status: "Upcoming",
      badgeColor: "#F78D25",
      badgeBg: "#FFF0E2",
      price: "599.00",
      serviceName: "Smart Electricians",
      category: "Electrical",
      date: "Friday, April 12, 2024",
      time: "08:00 AM",
      duration: "2 hours",
      image: "/product/p1.jpg",
      actions: "full",
    },
    {
      id: "CRDF5814",
      status: "Complete",
      badgeColor: "#00C363",
      badgeBg: "#E9FFF4",
      price: "599.00",
      serviceName: "Smart Electricians",
      category: "Electrical",
      date: "Friday, April 12, 2024",
      time: "08:00 AM",
      duration: "2 hours",
      image: "/product/p1.jpg",
      actions: "full",
    },
    {
      id: "CRDF5814",
      status: "Canceled",
      badgeColor: "#EB5757",
      badgeBg: "#FFE8E8",
      price: "599.00",
      serviceName: "Smart Electricians",
      category: "Electrical",
      date: "Friday, April 12, 2024",
      time: "08:00 AM",
      duration: "2 hours",
      image: "/product/p1.jpg",
      actions: "view",
    },
  ];

  const filtered =
    activeTab === "all"
      ? bookings
      : bookings.filter((b) => b.status.toLowerCase() === activeTab);

  return (
    <section className="w-full bg-[#F7F7FA] pb-10 px-4">
      <div className="max-w-[850px] mx-auto">

        {/* ---------------- FILTER TABS ---------------- */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-[30px] shadow-[0_4px_14px_rgba(0,0,0,0.06)]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-[6px] text-[13px] rounded-[20px]
                  ${activeTab === tab.id
                    ? "bg-gradient-to-r from-[#9838E1] to-[#F68E44] text-white shadow-[0_4px_14px_rgba(0,0,0,0.12)]"
                    : "text-[#444]"
                  }
                `}
              >
                {tab.label}
                <span
                  className={`
                    text-[11px] w-[22px] h-[22px] flex items-center justify-center rounded-full
                    font-semibold
                    ${activeTab === tab.id
                      ? "bg-white text-[#9838E1]"
                      : "bg-[#F1F0F5] text-[#777]"
                    }
                  `}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ---------------- BOOKINGS ---------------- */}
        <div className="space-y-6">
          {filtered?.map((b, index) => (
            <div
              key={index}
              className="bg-white border border-[#EEEAF7] rounded-[16px] p-5 shadow-[0_6px_18px_rgba(0,0,0,0.06)]"
            >
              {/* Header */}
              <div className="flex justify-between">
                <p className="text-[13px] font-semibold text-[#222]">
                  Booking ID #{b.id}
                </p>

                <div className="flex items-center gap-3">
                  <span
                    className="text-[11px] px-2 py-[2px] rounded-full"
                    style={{
                      backgroundColor: b.badgeBg,
                      color: b.badgeColor,
                    }}
                  >
                    {b.status}
                  </span>

                  <p className="text-[14px] font-semibold text-[#F78D25]">
                    ${b.price}
                  </p>
                </div>
              </div>

              {/* Service Info */}
              <div className="flex items-start gap-4 mt-4">
                <img
                  src={b.image}
                  className="h-[55px] w-[55px] rounded-[12px] object-cover"
                />

                <div>
                  <p className="text-[14px] font-semibold text-[#333]">
                    {b.serviceName}
                  </p>
                  <p className="text-[12px] text-[#8B8B8B]">{b.category}</p>

                  {/* Details */}
                  <div className="mt-3 space-y-1">
                    <div className="flex items-center gap-2 text-[#666] text-[12px]">
                      <Calendar size={14} />
                      {b.date}
                    </div>

                    <div className="flex items-center gap-2 text-[#666] text-[12px]">
                      <Clock size={14} />
                      {b.time}
                    </div>

                    <div className="flex items-center gap-2 text-[#666] text-[12px]">
                      <TimerIcon size={14} />
                      {b.duration}
                    </div>
                  </div>
                </div>
              </div>

              {/* -------- ACTION BUTTONS -------- */}
              <div className="flex flex-wrap gap-3 mt-4">

                {/* View Details */}
                <button
                  className="
                    flex-1 flex items-center justify-center gap-2
                    text-[13px] font-medium
                    border border-[#C9B8F5]
                    text-white
                    py-[10px] rounded-[10px]
                   bg-gradient-to-r from-[#9838E1] to-[#F68E44]
                  "
                >
                  <Eye size={16} className="text-white" />
                  View Details
                </button>

                {/* Cancel Order */}
                {b.status !== "Canceled" && (
                  <button
                    className="
                      flex-1 flex items-center justify-center gap-2
                      text-[13px] font-medium
                      text-[#F78D25]
                      py-[10px] rounded-[10px]
                      border border-[#FBC9A3]
                      bg-white
                    "
                  >
                    <X size={16} className="text-[#F78D25]" />
                    Cancel Orders
                  </button>
                )}
              </div>

             
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
