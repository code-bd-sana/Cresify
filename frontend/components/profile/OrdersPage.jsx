"use client";

import { useState } from "react";
import {
  Package,
  Clock4,
  Truck,
  CheckCircle,
  Mail,
  Phone,
  Eye,
  X,
} from "lucide-react";

export default function OrdersPage() {
  const tabs = [
    { id: "all", label: "All Orders", count: 10 },
    { id: "processing", label: "Processing", count: 3 },
    { id: "shipped", label: "Shipped", count: 2 },
    { id: "delivered", label: "Delivered", count: 5 },
  ];

  const [activeTab, setActiveTab] = useState("all");

  const orders = [
    {
      id: "CRDF5814",
      status: "Processing",
      statusColor: "#F7A500",
      date: "January 15, 2025",
      expected: "Expected Delivery: Jan 25, 2025",
      price: "599.00",
      items: [
        { image: "/product/p1.jpg", name: "Handmade Ceramic Vase", qty: 1 },
        { image: "/product/p2.jpg", name: "Organic Honey Set", qty: 1 },
      ],
      actions: "full",
      itemsCount: 2,
    },
    {
      id: "CRDF5814",
      status: "Shipped",
      statusColor: "#5A3DF6",
      date: "January 15, 2025",
      expected: "",
      price: "599.00",
      items: [
        { image: "/product/p1.jpg", name: "Handmade Ceramic Vase", qty: 1 },
      ],
      actions: "track",
      itemsCount: 2,
    },
    {
      id: "CRDF5814",
      status: "Delivered",
      statusColor: "#00C363",
      date: "January 15, 2025",
      expected: "",
      price: "599.00",
      items: [
        { image: "/product/p1.jpg", name: "Handmade Ceramic Vase", qty: 1 },
      ],
      actions: "track",
      itemsCount: 2,
    },
    {
      id: "CRDF5814",
      status: "Canceled",
      statusColor: "#EB5757",
      date: "January 15, 2025",
      expected: "",
      price: "599.00",
      items: [
        { image: "/product/p1.jpg", name: "Handmade Ceramic Vase", qty: 1 },
      ],
      actions: "view",
      itemsCount: 2,
    },
  ];

  const filteredOrders =
    activeTab === "all"
      ? orders
      : orders.filter((o) => o.status.toLowerCase() === activeTab);

  return (
    <section className="w-full bg-[#F7F7FA] pb-10 px-4">
      <div className="max-w-[850px] mx-auto">
        {/* ------------------- TOP FILTER TABS ------------------- */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-6 bg-white px-4 py-3 rounded-[20px] shadow-[0_4px_14px_rgba(0,0,0,0.04)] w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-5 py-[10px] text-[13px] font-medium rounded-[30px] transition-all
            ${
              activeTab === tab.id
                ? "text-white bg-gradient-to-r from-[#9838E1] to-[#F68E44] shadow-[0_4px_14px_rgba(0,0,0,0.15)]"
                : "text-[#444]"
            }
          `}
              >
                {/* LABEL */}
                {tab.label}

                {/* COUNT BADGE */}
                <span
                  className={`
              text-[11px] w-[22px] h-[22px] flex items-center justify-center rounded-full font-semibold
              ${
                activeTab === tab.id
                  ? "bg-white text-[#9838E1]"
                  : "bg-[#F2F1F6] text-[#7A7A85] shadow-[0_2px_8px_rgba(150,125,255,0.30)]"
              }
            `}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ------------------- ORDER CARDS ------------------- */}
        <div className="space-y-6">
          {filteredOrders.map((order, index) => (
            <div
              key={index}
              className="w-full bg-white border border-[#EEEAF7] rounded-[16px] shadow-[0_6px_18px_rgba(0,0,0,0.06)] p-5"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-semibold text-[#222]">
                  Order #{order.id}
                </p>

                <div className="flex items-center gap-2">
                  <span
                    className="text-[10px] px-2 py-[2px] rounded-full"
                    style={{
                      backgroundColor: `${order.statusColor}22`,
                      color: order.statusColor,
                    }}
                  >
                    {order.status}
                  </span>
                  <p className="text-[13px] font-semibold text-[#F78D25]">
                    ${order.price}
                  </p>
                </div>
              </div>

              {/* Date */}
              <p className="text-[11px] text-[#777] mt-[2px]">
                Placed on {order.date}
              </p>
              {order.expected && (
                <p className="text-[11px] text-[#F78D25]">{order.expected}</p>
              )}

              {/* Products */}
              <div className="flex items-start gap-4 mt-4">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <img
                      src={item.image}
                      className="h-[45px] w-[45px] rounded-[10px] object-cover"
                    />
                    <div>
                      <p className="text-[12px] font-medium text-[#333]">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-[#888]">
                        Quantity: {item.qty}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-wrap gap-3 mt-4">
                {/* View Details */}
                <button
                  className="
      flex-1 flex items-center justify-center gap-2
      text-[13px] font-medium
      border border-[#C9B8F5]
      text-[#8A50DB]
      py-[10px] rounded-[10px]
      bg-white
      hover:bg-[#F8F4FF] transition
    "
                >
                  <Eye size={16} className="text-[#8A50DB]" />
                  View Details
                </button>

                {/* Track Order */}
                {(order.actions === "track" || order.actions === "full") && (
                  <button
                    className="
      flex-1 flex items-center justify-center gap-2
      text-[13px] font-medium text-white
      py-[10px] rounded-[10px]
      bg-gradient-to-r from-[#9838E1] to-[#F68E44]
      shadow-[0_4px_14px_rgba(0,0,0,0.15)]
    "
                  >
                    <Truck size={16} className="text-white" />
                    Track Order
                  </button>
                )}

                {/* Cancel Order */}
                {order.actions === "full" && (
                  <button
                    className="
      flex-1 flex items-center justify-center gap-2
      text-[13px] font-medium
      text-[#F78D25]
      py-[10px] rounded-[10px]
      border border-[#FBC9A3]
      bg-[#FFF5EE]
      hover:bg-[#FFEBDD] transition
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

        {/* ------------------- HELP SECTION ------------------- */}
        <div className="mt-10 flex justify-center">
          <div className="w-full max-w-[350px] bg-white rounded-[16px] border border-[#EEEAF7] shadow-[0_6px_18px_rgba(0,0,0,0.06)] p-6 text-center">
            <div className="h-[55px] w-[55px] mx-auto rounded-full bg-gradient-to-r from-[#9838E1] to-[#F68E44] flex items-center justify-center">
              <Package size={24} className="text-white" />
            </div>

            <p className="text-[14px] font-semibold text-[#333] mt-3">
              Need Help?
            </p>
            <p className="text-[12px] text-[#777] mt-1">
              Have questions about your order? Our customer support team is here
              to help.
            </p>

            <div className="flex items-center gap-3 mt-4">
              <button className="flex-1 border border-[#E0D9F6] text-[#8A50DB] text-[12px] py-[8px] rounded-[8px]">
                Email Support
              </button>
              <button className="flex-1 text-white text-[12px] py-[8px] rounded-[8px] bg-gradient-to-r from-[#9838E1] to-[#F68E44] flex items-center justify-center gap-2">
                <Phone size={14} />
                Call Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
