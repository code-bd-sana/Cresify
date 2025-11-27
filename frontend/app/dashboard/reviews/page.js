"use client";

import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { LuReply } from "react-icons/lu";
import { useState } from "react";

export default function ReviewsPage() {
  const [replyBox, setReplyBox] = useState(null);

  const reviews = [
    {
      id: 1,
      name: "Brooklyn Simmons",
      product: "Wireless Headphones Pro",
      review:
        "Absolutely amazing! The sound quality is incredible and the battery life exceeds expectations. Highly recommend!",
      date: "2025-06-16",
      rating: 5,
      showInputBox: true,
    },
    {
      id: 2,
      name: "Jenny Wilson",
      product: "Smart Watch Ultra",
      review:
        "Great product overall. The features are impressive, but the setup could be easier. Still very satisfied with my purchase.",
      reply:
        "Thank you for your feedback! We’re working on improving the setup process.",
      date: "2025-06-16",
      rating: 5,
    },
    {
      id: 3,
      name: "Wade Warren",
      product: "Laptop Stand Aluminum",
      review:
        "Perfect for my workspace! Sturdy, elegant design, and great value for money.",
      date: "2025-06-16",
      rating: 5,
    },
    {
      id: 4,
      name: "Dianne Russell",
      product: "USB-C Hub 7-in-1",
      review:
        "Exactly what I needed. All ports work perfectly and it’s very compact.",
      date: "2025-06-16",
      rating: 5,
    },
  ];

  return (
    <div className="w-full min-h-screen px-2 pt-6">
      {/* PAGE TITLE */}
      <h1 className="text-[28px] font-semibold text-gray-900">
        Reviews & Ratings
      </h1>
      <p className="text-sm text-[#9c6bff] mt-1">
        Manage customer feedback and review
      </p>

      {/* REVIEWS LIST */}
      <div className="mt-10 space-y-6">
        {reviews.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <div className="flex items-start gap-4">
              {/* USER IMAGE */}
              <Image
                src="/user.png"
                alt={item.name}
                width={48}
                height={48}
                className="rounded-full object-cover border border-gray-200"
              />

              {/* RIGHT CONTENT */}
              <div className="flex-1">
                {/* NAME + PRODUCT + RATING */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-[16px] font-semibold text-gray-800">
                      {item.name}
                    </h3>
                    <p className="text-sm text-[#9c6bff]">{item.product}</p>
                  </div>

                  <div className="space-y-2 text-end">
                    <div className="flex text-[#F78D25]">
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <FaStar key={i} size={14} />
                      ))}
                    </div>
                    <p className="text-xs text-[#9838E1]">{item.date}</p>
                  </div>
                </div>

                {/* REVIEW TEXT */}
                <p className="mt-3 text-gray-700 text-[15px] leading-relaxed">
                  {item.review}
                </p>

                {/* IF ALREADY REPLIED */}
                {item.reply && (
                  <div className="mt-4 bg-[#f5eaff] text-[#7b43ff] rounded-lg p-4 text-sm">
                    <p className="font-medium text-gray-600 mb-1">
                      Your Reply:
                    </p>
                    {item.reply}
                  </div>
                )}

                {/* REPLY BOX */}
                {item.showInputBox && (
                  <div className="mt-4">
                    <textarea
                      placeholder="Write your reply..."
                      className="w-full h-20 border border-[#d2b7ff] rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#b38aff] outline-none"
                    />

                    <div className="flex gap-3 mt-3">
                      <button className="bg-[#a675ff] text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-[#935df8] transition">
                        Send Reply
                      </button>
                      <button className="text-gray-500 hover:text-gray-700 text-sm">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* REPLY BUTTON */}
                {!item.showInputBox && !item.reply && (
                  <button
                    onClick={() => setReplyBox(item.id)}
                    className="flex items-center gap-2 mt-4 text-[#9c6bff] font-medium hover:opacity-70"
                  >
                    <LuReply size={18} />
                    Reply
                  </button>
                )}

                {/* DYNAMIC INPUT BOX */}
                {replyBox === item.id && (
                  <div className="mt-4">
                    <textarea
                      placeholder="Write your reply..."
                      className="w-full h-20 border border-[#d2b7ff] rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#b38aff] outline-none"
                    />

                    <div className="flex gap-3 mt-3">
                      <button className="bg-[#a675ff] text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-[#935df8] transition">
                        Send Reply
                      </button>
                      <button
                        onClick={() => setReplyBox(null)}
                        className="text-gray-500 hover:text-gray-700 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
