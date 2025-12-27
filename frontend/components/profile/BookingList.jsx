"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  TimerIcon,
  Eye,
  X,
  RefreshCw,
  Upload,
  AlertCircle,
  User,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  FileText,
  CheckCircle,
  XCircle,
  Link as LinkIcon,
  Plus,
  Trash2,
  Star,
  MessageSquare,
  StarIcon,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useGetUserBookingsQuery } from "@/feature/provider/ProviderApi";
import { useSaveReviewMutation } from "@/feature/review/ReviewApi";

export default function BookingList() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [refundForm, setRefundForm] = useState({
    reason: "",
    evidenceLinks: [{ url: "", description: "" }],
  });
  
  // New state for review
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProviderForReview, setSelectedProviderForReview] = useState(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewReply, setReviewReply] = useState("");
  const [reviewExperience, setReviewExperience] = useState(""); // good, neutral, bad
  
  const { data: bookingData, isLoading, error, refetch } = useGetUserBookingsQuery(userId);
  const [saveReview, { isLoading: isSavingReview }] = useSaveReviewMutation();
  
  console.log(bookingData, 'Actual booking data from API');

  // Tabs configuration
  const getTabCounts = () => {
    if (!bookingData?.data?.bookings) return { all: 0, upcoming: 0, pending: 0, accept: 0, reject: 0, completed: 0, cancelled: 0 };

    const bookings = bookingData.data.bookings;
    
    // Determine if a booking is "upcoming" (accepted and future date)
    const upcomingCount = bookings.filter(booking => {
      if (booking.status !== 'accept') return false;
      
      const bookingDate = new Date(booking.dateId.workingDate);
      const now = new Date();
      return bookingDate > now;
    }).length;

    return {
      all: bookingData.data.total,
      upcoming: upcomingCount,
      pending: bookings.filter(b => b.status === 'pending').length,
      accept: bookings.filter(b => b.status === 'accept').length,
      reject: bookings.filter(b => b.status === 'reject').length,
      completed: bookings.filter(b => b.status === 'completed').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length,
    };
  };

  const tabCounts = getTabCounts();

  const tabs = [
    { id: "all", label: "All Booking", count: tabCounts.all },
    { id: "upcoming", label: "Upcoming", count: tabCounts.upcoming },
    { id: "pending", label: "Pending", count: tabCounts.pending },
    { id: "accept", label: "Accepted", count: tabCounts.accept },
    { id: "completed", label: "Completed", count: tabCounts.completed },
    { id: "cancelled", label: "Cancelled", count: tabCounts.cancelled },
  ];

  // Get status badge styling
  const getStatusInfo = (status) => {
    const statusMap = {
      pending: { label: "Pending", color: "#F78D25", bg: "#FFF0E2" },
      accept: { label: "Accepted", color: "#10B981", bg: "#D1FAE5" },
      reject: { label: "Rejected", color: "#EF4444", bg: "#FEE2E2" },
      completed: { label: "Completed", color: "#00C363", bg: "#E9FFF4" },
      cancelled: { label: "Cancelled", color: "#6B7280", bg: "#F3F4F6" },
    };
    return statusMap[status] || { label: status, color: "#6B7280", bg: "#F3F4F6" };
  };

  // Check if booking is eligible for review
  const canReviewBooking = (booking) => {
    // শুধুমাত্র completed bookings এর জন্য রিভিউ দেয়া যাবে
    if (booking.status !== 'completed') return false;
    
    // চেক করুন যে ইতিমধ্যে রিভিউ দেয়া হয়েছে কিনা
    // এখানে আপনি API থেকে রিভিউ ডাটা চেক করতে পারেন
    // এখনি আমরা ধরে নিচ্ছি সব completed booking রিভিউযোগ্য
    return true;
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format time
  const formatTime = (timeString) => {
    return timeString ? timeString.replace(/:\d{2}$/, '') : '';
  };

  // Filter bookings based on active tab
  const filterBookings = () => {
    if (!bookingData?.data?.bookings) return [];

    let filtered = bookingData.data.bookings;

    if (activeTab === 'upcoming') {
      return filtered.filter(booking => {
        if (booking.status !== 'accept') return false;
        const bookingDate = new Date(booking.dateId.workingDate);
        const now = new Date();
        return bookingDate > now;
      });
    }

    if (activeTab !== 'all') {
      filtered = filtered.filter(booking => booking.status === activeTab);
    }

    return filtered;
  };

  const filteredBookings = filterBookings();

  // Pagination
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBookings = filteredBookings.slice(startIndex, endIndex);

  // View details handler
  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  // Review handler
  const handleReviewClick = (booking) => {
    setSelectedProviderForReview(booking);
    setReviewRating(0);
    setReviewText("");
    setReviewReply("");
    setReviewExperience("");
    setShowReviewModal(true);
  };

  // Submit review
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!selectedProviderForReview || !reviewText.trim() || reviewRating === 0) {
      alert("Please provide a rating and review text");
      return;
    }

    const reviewData = {
      id: userId,
      rating: reviewRating,
      review: reviewText,
      provider: selectedProviderForReview.provider._id,
      seller: selectedProviderForReview.provider._id, // same as provider in your case
      reply: reviewReply,
      // Additional fields based on your Review model
      experience: reviewExperience,
      bookingId: selectedProviderForReview._id
    };

    console.log('Submitting review:', reviewData);

    try {
      const result = await saveReview(reviewData).unwrap();
      
      if (result.success) {
        alert('Review submitted successfully!');
        setShowReviewModal(false);
        setSelectedProviderForReview(null);
        // Refetch bookings to update UI
        refetch();
      } else {
        alert('Failed to submit review: ' + result.message);
      }
    } catch (error) {
      console.error('Review submission error:', error);
      alert('Failed to submit review. Please try again.');
    }
  };

  // Refund handler - opens modal
  const handleRefundClick = (booking) => {
    setSelectedBooking(booking);
    setRefundForm({
      reason: "",
      evidenceLinks: [{ url: "", description: "" }],
    });
    setShowRefundModal(true);
  };

  // Submit refund request
  const handleRefundSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedBooking) return;
    
    // Filter out empty links
    const validLinks = refundForm.evidenceLinks.filter(link => link.url.trim() !== '');
    
    const refundData = {
      orderVendorId: selectedBooking.provider._id,
      productId: selectedBooking._id,
      quantity: 1,
      reason: refundForm.reason || undefined,
      evidence: validLinks.length > 0 ? validLinks : undefined
    };

    console.log('Submitting refund request:', refundData);
    
    try {
      // Log to console as requested
      console.log('Refund Data to be sent:', {
        ...refundData,
        bookingId: selectedBooking._id,
        customerId: userId,
        providerId: selectedBooking.provider._id,
        amount: selectedBooking.provider.hourlyRate,
        evidenceLinks: validLinks,
      });
      
      alert(`Refund request submitted successfully for Booking ID: ${selectedBooking._id.slice(-8)}`);
      
      // Reset and close modal
      setShowRefundModal(false);
      setSelectedBooking(null);
      setRefundForm({
        reason: "",
        evidenceLinks: [{ url: "", description: "" }],
      });
      
    } catch (error) {
      console.error('Error submitting refund:', error);
      alert('Failed to submit refund request. Please try again.');
    }
  };

  // Handle adding new evidence link
  const addEvidenceLink = () => {
    if (refundForm.evidenceLinks.length < 5) {
      setRefundForm(prev => ({
        ...prev,
        evidenceLinks: [...prev.evidenceLinks, { url: "", description: "" }]
      }));
    }
  };

  // Handle removing evidence link
  const removeEvidenceLink = (index) => {
    if (refundForm.evidenceLinks.length > 1) {
      setRefundForm(prev => ({
        ...prev,
        evidenceLinks: prev.evidenceLinks.filter((_, i) => i !== index)
      }));
    }
  };

  // Update evidence link
  const updateEvidenceLink = (index, field, value) => {
    const updatedLinks = [...refundForm.evidenceLinks];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    setRefundForm(prev => ({ ...prev, evidenceLinks: updatedLinks }));
  };

  // Cancel handler
  const handleCancel = (bookingId) => {
    console.log('Cancelling booking:', bookingId);
    alert(`Cancellation requested for booking: ${bookingId}\n\nAre you sure you want to cancel this booking?`);
  };

  if (isLoading) {
    return (
      <section className="w-full bg-[#F7F7FA] pb-10 px-4">
        <div className="max-w-[850px] mx-auto pt-8">
          <div className="flex justify-center">
            <div className="animate-pulse bg-white rounded-[30px] w-96 h-12"></div>
          </div>
          <div className="space-y-6 mt-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-white rounded-[16px] p-5 h-48"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full bg-[#F7F7FA] pb-10 px-4">
        <div className="max-w-[850px] mx-auto pt-8 text-center">
          <p className="text-red-500">Error loading bookings</p>
        </div>
      </section>
    );
  }

  if (!bookingData?.data?.bookings?.length) {
    return (
      <section className="w-full bg-[#F7F7FA] pb-10 px-4">
        <div className="max-w-[850px] mx-auto pt-8 text-center">
          <div className="bg-white rounded-[20px] p-8 max-w-md mx-auto">
            <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-r from-[#9838E1] to-[#F68E44] flex items-center justify-center mb-4">
              <Calendar className="text-white" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Bookings Yet</h3>
            <p className="text-gray-600 mb-6">You haven't made any bookings yet.</p>
            <button className="px-6 py-3 bg-gradient-to-r from-[#9838E1] to-[#F68E44] text-white rounded-[10px] hover:opacity-90 transition-opacity">
              Browse Services
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="w-full bg-[#F7F7FA] pb-10 px-4">
        <div className="max-w-[850px] mx-auto">
          {/* ---------------- FILTER TABS ---------------- */}
          <div className="flex justify-center mb-6">
            <div className="flex flex-wrap items-center gap-2 bg-white px-4 py-2 rounded-[30px] shadow-[0_4px_14px_rgba(0,0,0,0.06)]">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setCurrentPage(1);
                  }}
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
            {currentBookings.map((booking) => {
              const statusInfo = getStatusInfo(booking.status);
              const formattedDate = formatDate(booking.dateId.workingDate);
              const price = booking.provider.hourlyRate;
              const isReviewable = canReviewBooking(booking);

              return (
                <div
                  key={booking._id}
                  className="bg-white border border-[#EEEAF7] rounded-[16px] p-5 shadow-[0_6px_18px_rgba(0,0,0,0.06)]"
                >
                  {/* Header */}
                  <div className="flex flex-wrap justify-between gap-2">
                    <p className="text-[13px] font-semibold text-[#222]">
                      Booking ID #{booking._id.slice(-8)}
                    </p>

                    <div className="flex items-center gap-3">
                      <span
                        className="text-[11px] px-2 py-[2px] rounded-full font-medium"
                        style={{
                          backgroundColor: statusInfo.bg,
                          color: statusInfo.color,
                        }}
                      >
                        {statusInfo.label}
                      </span>

                      <p className="text-[14px] font-semibold text-[#F78D25]">
                        ${price.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Service Info */}
                  <div className="flex items-start gap-4 mt-4">
                    <div className="h-[55px] w-[55px] rounded-[12px] bg-gradient-to-r from-[#9838E1] to-[#F68E44] flex items-center justify-center">
                      <span className="text-white text-lg font-bold">
                        {booking.provider.serviceName.charAt(0)}
                      </span>
                    </div>

                    <div className="flex-1">
                      <p className="text-[14px] font-semibold text-[#333]">
                        {booking.provider.serviceName}
                      </p>
                      <p className="text-[12px] text-[#8B8B8B] capitalize">
                        {booking.provider.serviceCategory}
                      </p>
                      <p className="text-[12px] text-[#8B8B8B]">
                        by {booking.provider.fullName}
                      </p>

                      {/* Details */}
                      <div className="mt-3 space-y-1">
                        <div className="flex items-center gap-2 text-[#666] text-[12px]">
                          <Calendar size={14} />
                          {formattedDate}
                        </div>

                        <div className="flex items-center gap-2 text-[#666] text-[12px]">
                          <Clock size={14} />
                          {formatTime(booking.timeSlot.startTime)} - {formatTime(booking.timeSlot.endTime)}
                        </div>

                        <div className="flex items-center gap-2 text-[#666] text-[12px]">
                          <TimerIcon size={14} />
                          {booking.timeSlot.duration}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* -------- ACTION BUTTONS -------- */}
                  <div className="flex flex-wrap gap-3 mt-4">
                    {/* View Details */}
                    <button
                      onClick={() => handleViewDetails(booking)}
                      className="
                        flex-1 flex items-center justify-center gap-2
                        text-[13px] font-medium
                        border border-[#C9B8F5]
                        text-white
                        py-[10px] rounded-[10px]
                        bg-gradient-to-r from-[#9838E1] to-[#F68E44]
                        hover:opacity-90 transition-opacity
                      "
                    >
                      <Eye size={16} className="text-white" />
                      View Details
                    </button>

                    {/* Review Button - Only for completed bookings */}
                    {isReviewable && (
                      <button
                        onClick={() => handleReviewClick(booking)}
                        className="
                          flex-1 flex items-center justify-center gap-2
                          text-[13px] font-medium
                          text-[#F78D25]
                          py-[10px] rounded-[10px]
                          border border-[#FBC9A3]
                          bg-white
                          hover:bg-orange-50 transition-colors
                        "
                      >
                        <Star size={16} className="text-[#F78D25]" />
                        Write Review
                      </button>
                    )}

                    {/* Refund Button */}
                    {booking.paymentStatus === 'processing' || booking.paymentStatus === 'completed' ? (
                      <button
                        onClick={() => handleRefundClick(booking)}
                        className="
                          flex-1 flex items-center justify-center gap-2
                          text-[13px] font-medium
                          text-[#10B981]
                          py-[10px] rounded-[10px]
                          border border-[#A7F3D0]
                          bg-white
                          hover:bg-green-50 transition-colors
                        "
                      >
                        <RefreshCw size={16} className="text-[#10B981]" />
                        Request Refund
                      </button>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ---------------- PAGINATION ---------------- */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`
                  px-4 py-2 rounded-[10px] text-[13px] font-medium
                  ${currentPage === 1
                    ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                    : 'text-[#9838E1] bg-white border border-[#C9B8F5] hover:bg-[#F5F0FF]'
                  }
                `}
              >
                Previous
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`
                        w-8 h-8 flex items-center justify-center rounded-full text-[13px] font-medium
                        ${currentPage === pageNum
                          ? 'bg-gradient-to-r from-[#9838E1] to-[#F68E44] text-white'
                          : 'text-[#666] hover:bg-[#F5F0FF]'
                        }
                      `}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {/* Ellipsis for many pages */}
                {totalPages > 5 && page < totalPages - 2 && (
                  <>
                    <span className="px-1">...</span>
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      className="px-3 py-1.5 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`
                  px-4 py-2 rounded-[10px] text-[13px] font-medium
                  ${currentPage === totalPages
                    ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                    : 'text-[#9838E1] bg-white border border-[#C9B8F5] hover:bg-[#F5F0FF]'
                  }
                `}
              >
                Next
              </button>
            </div>
          )}

          {/* ---------------- SUMMARY ---------------- */}
          <div className="mt-6 text-center text-[12px] text-gray-500">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredBookings.length)} of {filteredBookings.length} bookings
          </div>
        </div>
      </section>

      {/* ---------------- REVIEW MODAL ---------------- */}
      {showReviewModal && selectedProviderForReview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[20px] max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10 rounded-t-[20px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-[12px] bg-gradient-to-r from-[#F78D25] to-[#FFB74D] flex items-center justify-center">
                    <Star className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Write a Review
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {selectedProviderForReview.provider.serviceName}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowReviewModal(false);
                    setSelectedProviderForReview(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Provider Info */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="h-16 w-16 rounded-[14px] bg-gradient-to-r from-[#9838E1] to-[#F68E44] flex items-center justify-center">
                  <span className="text-white text-xl font-bold">
                    {selectedProviderForReview.provider.serviceName.charAt(0)}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    {selectedProviderForReview.provider.fullName}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {selectedProviderForReview.provider.serviceName}
                  </p>
                  <p className="text-xs text-gray-500">
                    Booking: {formatDate(selectedProviderForReview.dateId.workingDate)}
                  </p>
                </div>
              </div>
            </div>

            {/* Review Form */}
            <form onSubmit={handleSubmitReview} className="p-6">
              {/* Rating */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  How would you rate this service? <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <StarIcon
                        size={32}
                        className={
                          star <= reviewRating
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300"
                        }
                      />
                    </button>
                  ))}
                </div>
                <div className="mt-2 text-center">
                  <p className="text-sm text-gray-600">
                    {reviewRating === 0 ? "Select a rating" :
                     reviewRating === 1 ? "Poor" :
                     reviewRating === 2 ? "Fair" :
                     reviewRating === 3 ? "Good" :
                     reviewRating === 4 ? "Very Good" :
                     "Excellent"}
                  </p>
                </div>
              </div>

              {/* Overall Experience */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  How was your overall experience?
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setReviewExperience("good")}
                    className={`p-3 rounded-[10px] border-2 flex flex-col items-center gap-2 transition-all ${
                      reviewExperience === "good"
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-green-300"
                    }`}
                  >
                    <ThumbsUp size={20} className={reviewExperience === "good" ? "text-green-600" : "text-gray-400"} />
                    <span className="text-sm font-medium">Good</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setReviewExperience("neutral")}
                    className={`p-3 rounded-[10px] border-2 flex flex-col items-center gap-2 transition-all ${
                      reviewExperience === "neutral"
                        ? "border-yellow-500 bg-yellow-50"
                        : "border-gray-200 hover:border-yellow-300"
                    }`}
                  >
                    <div className="h-5 w-5 flex items-center justify-center">
                      <div className="h-1 w-4 bg-gray-400 rounded"></div>
                    </div>
                    <span className="text-sm font-medium">Neutral</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setReviewExperience("bad")}
                    className={`p-3 rounded-[10px] border-2 flex flex-col items-center gap-2 transition-all ${
                      reviewExperience === "bad"
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-red-300"
                    }`}
                  >
                    <ThumbsDown size={20} className={reviewExperience === "bad" ? "text-red-600" : "text-gray-400"} />
                    <span className="text-sm font-medium">Not Good</span>
                  </button>
                </div>
              </div>

              {/* Review Text */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Your Review <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience with this service. What did you like or dislike? How was the quality of service?"
                  rows={5}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-[#9838E1] focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Be honest and specific about your experience
                </p>
              </div>

              {/* Reply (Optional) */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Any additional comments (optional)
                </label>
                <textarea
                  value={reviewReply}
                  onChange={(e) => setReviewReply(e.target.value)}
                  placeholder="Any additional comments or suggestions for improvement..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-[#9838E1] focus:border-transparent"
                />
              </div>

              {/* Guidelines */}
              <div className="bg-blue-50 border border-blue-200 rounded-[10px] p-4 mb-6">
                <div className="flex items-start gap-2">
                  <AlertCircle size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-blue-700">
                    <p className="font-medium mb-1">Review Guidelines:</p>
                    <ul className="space-y-1">
                      <li>• Be honest and fair in your assessment</li>
                      <li>• Focus on the service quality and professionalism</li>
                      <li>• Avoid personal attacks or offensive language</li>
                      <li>• Your review will help other customers</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowReviewModal(false);
                    setSelectedProviderForReview(null);
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-[10px] text-sm font-medium hover:bg-gray-50"
                  disabled={isSavingReview}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingReview || reviewRating === 0 || !reviewText.trim()}
                  className={`flex-1 px-4 py-3 rounded-[10px] text-sm font-medium flex items-center justify-center gap-2 ${
                    isSavingReview || reviewRating === 0 || !reviewText.trim()
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#F78D25] to-[#FFB74D] text-white hover:opacity-90"
                  }`}
                >
                  {isSavingReview ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Star size={16} />
                      Submit Review
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- VIEW DETAILS MODAL ---------------- */}
      {showDetailsModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[20px] max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10 rounded-t-[20px]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Booking Details
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Booking ID: #{selectedBooking._id.slice(-8)}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedBooking(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Status and Price */}
              <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-[12px]">
                <div className="flex items-center gap-3">
                  <span
                    className="text-xs px-3 py-1 rounded-full font-medium"
                    style={{
                      backgroundColor: getStatusInfo(selectedBooking.status).bg,
                      color: getStatusInfo(selectedBooking.status).color,
                    }}
                  >
                    {getStatusInfo(selectedBooking.status).label}
                  </span>
                  <div className="text-sm">
                    <span className="text-gray-500">Payment: </span>
                    <span className={`font-medium ${selectedBooking.paymentStatus === 'completed' ? 'text-green-600' : 'text-orange-600'}`}>
                      {selectedBooking.paymentStatus.charAt(0).toUpperCase() + selectedBooking.paymentStatus.slice(1)}
                    </span>
                  </div>
                </div>
                <p className="text-lg font-bold text-[#F78D25]">
                  ${selectedBooking.provider.hourlyRate.toFixed(2)}
                </p>
              </div>

              {/* Service Information */}
              <div className="mb-8">
                <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-[6px] bg-gradient-to-r from-[#9838E1] to-[#F68E44] flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {selectedBooking.provider.serviceName.charAt(0)}
                    </span>
                  </div>
                  Service Information
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <DetailItem
                      icon={<User size={16} />}
                      label="Service"
                      value={selectedBooking.provider.serviceName}
                    />
                    <DetailItem
                      icon={<FileText size={16} />}
                      label="Category"
                      value={selectedBooking.provider.serviceCategory}
                    />
                    <DetailItem
                      icon={<TimerIcon size={16} />}
                      label="Duration"
                      value={selectedBooking.timeSlot.duration}
                    />
                  </div>
                  <div className="space-y-3">
                    <DetailItem
                      icon={<Calendar size={16} />}
                      label="Date"
                      value={formatDate(selectedBooking.dateId.workingDate)}
                    />
                    <DetailItem
                      icon={<Clock size={16} />}
                      label="Time Slot"
                      value={`${formatTime(selectedBooking.timeSlot.startTime)} - ${formatTime(selectedBooking.timeSlot.endTime)}`}
                    />
                    <DetailItem
                      icon={<CreditCard size={16} />}
                      label="Payment Method"
                      value={selectedBooking.paymentMethod.charAt(0).toUpperCase() + selectedBooking.paymentMethod.slice(1)}
                    />
                  </div>
                </div>
              </div>

              {/* Provider Information */}
              <div className="mb-8">
                <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <User size={14} className="text-blue-600" />
                  </div>
                  Provider Information
                </h4>
                
                <div className="bg-blue-50 rounded-[12px] p-4">
                  <div className="space-y-3">
                    <DetailItem
                      icon={<User size={16} className="text-blue-600" />}
                      label="Name"
                      value={selectedBooking.provider.fullName}
                    />
                    <DetailItem
                      icon={<Mail size={16} className="text-blue-600" />}
                      label="Email"
                      value={selectedBooking.provider.email}
                    />
                    <DetailItem
                      icon={<Phone size={16} className="text-blue-600" />}
                      label="Phone"
                      value={selectedBooking.provider.phoneNumber}
                    />
                    <DetailItem
                      icon={<MapPin size={16} className="text-blue-600" />}
                      label="Service Area"
                      value={selectedBooking.provider.serviceArea}
                    />
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                    <FileText size={14} className="text-gray-600" />
                  </div>
                  Additional Information
                </h4>
                
                <div className="space-y-3">
                  <DetailItem
                    icon={<Calendar size={16} />}
                    label="Booking Created"
                    value={new Date(selectedBooking.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  />
                  <div className="flex items-start gap-2">
                    <FileText size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">Service Description</p>
                      <p className="text-sm text-gray-600">{selectedBooking.provider.serviceDescription}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 sticky bottom-0 bg-white rounded-b-[20px]">
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-[10px] text-sm font-medium hover:bg-gray-50"
                >
                  Close
                </button>
                
                {/* Review Button in Details Modal */}
                {canReviewBooking(selectedBooking) && (
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleReviewClick(selectedBooking);
                    }}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-[#F78D25] to-[#FFB74D] text-white rounded-[10px] text-sm font-medium hover:opacity-90"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Star size={16} />
                      Write Review
                    </div>
                  </button>
                )}
                
                {(selectedBooking.paymentStatus === 'processing' || selectedBooking.paymentStatus === 'completed') && (
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleRefundClick(selectedBooking);
                    }}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-[#10B981] to-[#34D399] text-white rounded-[10px] text-sm font-medium hover:opacity-90"
                  >
                    Request Refund
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- REFUND MODAL ---------------- */}
      {showRefundModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[20px] max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Request Refund
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Booking ID: #{selectedBooking._id.slice(-8)}
                  </p>
                </div>
                <button
                  onClick={() => setShowRefundModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Booking Summary */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-[10px] bg-gradient-to-r from-[#9838E1] to-[#F68E44] flex items-center justify-center">
                  <span className="text-white font-bold">
                    {selectedBooking.provider.serviceName.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedBooking.provider.serviceName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(selectedBooking.dateId.workingDate)} • {formatTime(selectedBooking.timeSlot.startTime)} - {formatTime(selectedBooking.timeSlot.endTime)}
                  </p>
                  <p className="text-sm font-semibold text-[#F78D25] mt-1">
                    ${selectedBooking.provider.hourlyRate.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Refund Form */}
            <form onSubmit={handleRefundSubmit} className="p-6">
              {/* Reason Field */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Reason for Refund <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={refundForm.reason}
                  onChange={(e) => setRefundForm(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Please explain why you are requesting a refund..."
                  rows={4}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-[#9838E1] focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Provide a detailed reason to help us process your request faster.
                </p>
              </div>

              {/* Evidence Links */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-900">
                    Evidence Links (Optional)
                  </label>
                  <span className="text-xs text-gray-500">
                    {refundForm.evidenceLinks.length}/5
                  </span>
                </div>
                
                <p className="text-xs text-gray-600 mb-4">
                  Add links to photos, documents, or any supporting evidence for your refund request.
                </p>

                {/* Evidence Links List */}
                <div className="space-y-4">
                  {refundForm.evidenceLinks.map((link, index) => (
                    <div key={index} className="border border-gray-200 rounded-[10px] p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <LinkIcon size={14} className="text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">
                            Evidence Link {index + 1}
                          </span>
                        </div>
                        {refundForm.evidenceLinks.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeEvidenceLink(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            URL
                          </label>
                          <input
                            type="url"
                            value={link.url}
                            onChange={(e) => updateEvidenceLink(index, 'url', e.target.value)}
                            placeholder="https://example.com/evidence.jpg"
                            className="w-full px-3 py-2 border border-gray-300 rounded-[8px] text-sm focus:outline-none focus:ring-2 focus:ring-[#9838E1] focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Description (optional)
                          </label>
                          <input
                            type="text"
                            value={link.description}
                            onChange={(e) => updateEvidenceLink(index, 'description', e.target.value)}
                            placeholder="Brief description of this evidence..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-[8px] text-sm focus:outline-none focus:ring-2 focus:ring-[#9838E1] focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Another Link Button */}
                {refundForm.evidenceLinks.length < 5 && (
                  <button
                    type="button"
                    onClick={addEvidenceLink}
                    className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 border border-dashed border-gray-300 text-gray-600 rounded-[10px] text-sm font-medium hover:border-[#9838E1] hover:text-[#9838E1] transition-colors"
                  >
                    <Plus size={16} />
                    Add Another Evidence Link
                  </button>
                )}
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-[10px] p-3 mb-6">
                <div className="flex items-start gap-2">
                  <AlertCircle size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-blue-700">
                    <p className="font-medium">Refund Information:</p>
                    <p className="mt-1">
                      • Refunds are processed within 5-7 business days<br />
                      • You will be notified via email once processed<br />
                      • Full or partial refunds are determined by our policy
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowRefundModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-[10px] text-sm font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-[#9838E1] to-[#F68E44] text-white rounded-[10px] text-sm font-medium hover:opacity-90"
                >
                  Submit Refund Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

// Helper component for detail items
function DetailItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-2">
      <div className="text-gray-400 mt-0.5 flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-700 mb-1">{label}</p>
        <p className="text-sm text-gray-900">{value}</p>
      </div>
    </div>
  );
}