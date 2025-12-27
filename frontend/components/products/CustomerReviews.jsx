"use client";

import { useGetProductReviewQuery, useGetServiceReviewQuery } from "@/feature/review/ReviewApi";
import { Star, User } from "lucide-react";

export default function CustomerReviews({ id }) {
  const { data: review, isLoading, isError } = useGetServiceReviewQuery(id);
  
  // Get user data from reviews
  const reviews = review?.data || [];

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get user initials
  const getUserInitials = (user) => {
    if (!user) return "U";
    if (user.name) {
      return user.name.charAt(0).toUpperCase();
    }
    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  // Get user display name
  const getUserDisplayName = (user) => {
    if (!user) return "Anonymous User";
    if (user.name) return user.name;
    if (user.email) {
      // Extract name from email (before @)
      return user.email.split('@')[0];
    }
    return "Anonymous User";
  };

  // Generate random color for avatar
  const getAvatarColor = (userId) => {
    const colors = [
      'bg-blue-100 text-blue-600',
      'bg-green-100 text-green-600',
      'bg-purple-100 text-purple-600',
      'bg-pink-100 text-pink-600',
      'bg-orange-100 text-orange-600',
      'bg-teal-100 text-teal-600',
      'bg-indigo-100 text-indigo-600',
      'bg-red-100 text-red-600',
      'bg-yellow-100 text-yellow-600',
    ];
    
    // Simple hash function to get consistent color for same user
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  // Calculate average rating
  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    
    // Assuming all reviews have rating field
    // If your reviews don't have rating, you might need to adjust
    const total = reviews.reduce((sum, review) => {
      // If rating is in review object, use it
      // Otherwise default to 5 or adjust based on your data structure
      return sum + (review.rating || 5);
    }, 0);
    
    return (total / reviews.length).toFixed(1);
  };

  if (isLoading) {
    return (
      <section className="w-full bg-[#F7F7FA] py-10 px-6">
        <div className="max-w-[1300px] mx-auto">
          <h2 className="text-[20px] font-semibold text-[#1B1B1B] mb-5">
            Customer Reviews
          </h2>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading reviews...</p>
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="w-full bg-[#F7F7FA] py-10 px-6">
        <div className="max-w-[1300px] mx-auto">
          <h2 className="text-[20px] font-semibold text-[#1B1B1B] mb-5">
            Customer Reviews
          </h2>
          <div className="text-center py-8 text-red-600">
            <p>Error loading reviews. Please try again.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-[#F7F7FA] py-10 px-6">
      <div className="max-w-[1300px] mx-auto">

        {/* HEADER WITH STATS */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-[20px] font-semibold text-[#1B1B1B] mb-2">
              Customer Reviews
            </h2>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={`${i < Math.floor(calculateAverageRating()) ? 'text-[#FFA534] fill-[#FFA534]' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-[14px] font-medium text-[#1B1B1B]">
                {calculateAverageRating()} out of 5
              </span>
              <span className="text-[14px] text-gray-500">
                ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          </div>
          
          {/* SORTING OPTIONS (optional) */}
          <div className="mt-4 md:mt-0">
            <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div>
        </div>

        {/* REVIEWS LIST */}
        {reviews.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-[14px] border border-[#ECE6F7] shadow-[0px_3px_15px_rgba(0,0,0,0.05)]">
            <User size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Reviews Yet</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Be the first to share your thoughts about this product!
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {reviews.map((r) => (
              <div
                key={r._id}
                className="
                  bg-white rounded-[14px]
                  border border-[#ECE6F7]
                  shadow-[0px_3px_15px_rgba(0,0,0,0.05)]
                  px-5 py-5
                  flex flex-col
                  hover:shadow-md transition-shadow duration-200
                "
              >
                {/* TOP ROW */}
                <div className="flex items-center justify-between w-full">

                  {/* LEFT USER INFO */}
                  <div className="flex items-center gap-3">
                    {/* User Avatar */}
                    {r.user?.avatar ? (
                      <img
                        src={r.user.avatar}
                        alt={getUserDisplayName(r.user)}
                        className="w-[38px] h-[38px] rounded-full object-cover border border-gray-200"
                      />
                    ) : (
                      <div className={`w-[38px] h-[38px] rounded-full flex items-center justify-center ${getAvatarColor(r.user?._id || 'default')}`}>
                        <span className="font-semibold text-sm">
                          {getUserInitials(r.user)}
                        </span>
                      </div>
                    )}

                    <div>
                      <p className="text-[15px] font-medium text-[#1B1B1B]">
                        {getUserDisplayName(r.user)}
                      </p>
                      <p className="text-[13px] text-gray-500 leading-[15px]">
                        {r.user?.email || 'Verified Buyer'}
                      </p>
                    </div>
                  </div>

                  {/* RIGHT RATING & DATE */}
                  <div className="flex flex-col items-end">
                    {/* Star Rating */}
                    <div className="flex items-center gap-[2px]">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={`${i < (r.rating || 5) ? 'text-[#FFA534] fill-[#FFA534]' : 'text-gray-300'}`}
                        />
                      ))}
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        {r.rating || 5}.0
                      </span>
                    </div>

                    {/* Date */}
                    <p className="text-[12px] text-gray-500 mt-[1px]">
                      {formatDate(r.createdAt)}
                    </p>
                  </div>
                </div>

                {/* REVIEW TEXT */}
                <p className="text-[14px] text-[#4B4B4B] mt-4 leading-[21px] whitespace-pre-line">
                  {r.review || "No review text provided."}
                </p>

                {/* ADDITIONAL INFO (optional) */}
       

                {/* REPLY SECTION (optional - if seller replies exist) */}
               
              </div>
            ))}
          </div>
        )}

        {/* PAGINATION (optional) */}
        {reviews.length > 10 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center gap-2">
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                Previous
              </button>
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  className={`w-10 h-10 rounded-lg text-sm font-medium ${
                    page === 1
                      ? "bg-purple-600 text-white"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                Next
              </button>
            </nav>
          </div>
        )}

        {/* REVIEW SUMMARY STATS (optional) */}
        {reviews.length > 0 && (
          <div className="mt-10 bg-white rounded-[14px] border border-[#ECE6F7] shadow-[0px_3px_15px_rgba(0,0,0,0.05)] p-6">
            <h3 className="text-lg font-semibold text-[#1B1B1B] mb-4">Review Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-2">Average Rating</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-[#1B1B1B]">{calculateAverageRating()}</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={`${i < Math.floor(calculateAverageRating()) ? 'text-[#FFA534] fill-[#FFA534]' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">Total Reviews</p>
                <p className="text-2xl font-bold text-[#1B1B1B]">{reviews.length}</p>
              </div>
              
              {/* <div>
                <p className="text-sm text-gray-600 mb-2">Verified Buyers</p>
                <p className="text-2xl font-bold text-[#38A169]">100%</p>
              </div> */}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}