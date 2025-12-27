"use client";

import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { LuReply } from "react-icons/lu";
import { useState } from "react";
import { useGetReviewBySellerIdQuery } from "@/feature/review/ReviewApi";
import { useSession } from "next-auth/react";

export default function ReviewsPage() {
  const [replyBox, setReplyBox] = useState(null);
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { data: reviewData, isLoading } = useGetReviewBySellerIdQuery(userId);
  console.log(reviewData, 'revie data');
  
  // Extract reviews from API response or use empty array
  const apiReviews = reviewData?.data || [];
  
  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen px-2 pt-6">
        <h1 className="text-[28px] font-semibold text-gray-900">
          Reviews & Ratings
        </h1>
        <p className="text-sm text-[#9c6bff] mt-1">
          Manage customer feedback and review
        </p>
        <div className="mt-10 flex justify-center items-center h-64">
          <div className="text-gray-500">Loading reviews...</div>
        </div>
      </div>
    );
  }

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
        {apiReviews.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 text-center py-12">
            <p className="text-gray-500">No reviews found</p>
          </div>
        ) : (
          apiReviews.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <div className="flex items-start gap-4">
                {/* USER IMAGE */}
                <div className="relative w-12 h-12">
                  <Image
                    src={item.user?.image || "/user.png"}
                    alt={item.user?.name || "User"}
                    width={48}
                    height={48}
                    className="rounded-full object-cover border border-gray-200"
                    onError={(e) => {
                      e.currentTarget.src = "/user.png";
                    }}
                  />
                </div>

                {/* RIGHT CONTENT */}
                <div className="flex-1">
                  {/* NAME + PRODUCT + RATING */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-[16px] font-semibold text-gray-800">
                        {item.user?.name || "Anonymous User"}
                      </h3>
                      <p className="text-sm text-[#9c6bff]">
                        {item.product?.name || "Unknown Product"}
                      </p>
                    </div>

                    <div className="space-y-2 text-end">
                   <div className="flex gap-1">
  {Array.from({ length: 5 }).map((_, i) => (
    <FaStar
      key={i}
      size={14}
      className={
        i < item.rating
          ? "text-[#F78D25]"   // filled (yellow)
          : "text-gray-300"   // empty (white/gray)
      }
    />
  ))}
</div>

                      <p className="text-xs text-[#9838E1]">
                        {formatDate(item.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* REVIEW TEXT */}
                  <p className="mt-3 text-gray-700 text-[15px] leading-relaxed">
                    {item.review}
                  </p>

                  {/* COMMENT/REPLY SECTION - HARDCODED COMMENT FOR DESIGN */}
                  {/* <div className="mt-4 bg-[#f5eaff] text-[#7b43ff] rounded-lg p-4 text-sm">
                    <p className="font-medium text-gray-600 mb-1">
                      Your Reply:
                    </p>
                    Thank you for your feedback! We're glad you're enjoying the product.
                  </div> */}

                  {/* REPLY BUTTON */}
                  {/* <button
                    onClick={() => setReplyBox(item._id)}
                    className="flex items-center gap-2 mt-4 text-[#9c6bff] font-medium hover:opacity-70"
                  >
                    <LuReply size={18} />
                    Reply
                  </button> */}

                  {/* DYNAMIC INPUT BOX */}
                  {replyBox === item._id && (
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
          ))
        )}
      </div>
    </div>
  );
}