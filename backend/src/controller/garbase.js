"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  TimerIcon,
  Eye,
  X,
  MapPin,
  User,
  ChevronRight,
  CheckCircle,
  Star,
  MessageSquare,
  FileText,
  AlertCircle,
  CheckCircle2,
  Phone,
  Mail,
  ArrowRight,
  Package,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useGetUserBookingsQuery } from "@/feature/provider/ProviderApi";

export default function BookingList() {
  const tabs = [
    { id: "all", label: "All Booking", count: 0 },
    { id: "upcoming", label: "Upcoming", count: 0 },
    { id: "completed", label: "Completed", count: 0 },
    { id: "cancelled", label: "Cancelled", count: 0 },
  ];

  const [activeTab, setActiveTab] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedServiceForReview, setSelectedServiceForReview] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [selectedBookingForRefund, setSelectedBookingForRefund] = useState(null);
  const [refundReason, setRefundReason] = useState("");
  const [isSubmittingRefund, setIsSubmittingRefund] = useState(false);
  const [debugInfo, setDebugInfo] = useState("");

  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { data: bookingData, isLoading, isError } = useGetUserBookingsQuery(userId);
  
  // Debug: Check what data is coming
  useEffect(() => {
    if (bookingData) {
      console.log("🎯 RAW BOOKING DATA:", bookingData);
      console.log("📊 Bookings Array:", bookingData.data?.bookings);
      console.log("📈 Total Bookings:", bookingData.data?.total);
      console.log("👤 User ID:", userId);
      
      setDebugInfo(JSON.stringify({
        hasData: !!bookingData,
        hasBookingsArray: !!bookingData.data?.bookings,
        bookingsCount: bookingData.data?.bookings?.length || 0,
        total: bookingData.data?.total,
        message: bookingData.message
      }, null, 2));
    }
  }, [bookingData, userId]);

  // API থেকে আসা ডেটা - সঠিক পাথ ব্যবহার করুন
  const apiBookings = bookingData?.data?.bookings || bookingData?.bookings || [];

  // Calculate status counts
  const calculateStatusCounts = () => {
    let allCount = 0;
    let upcomingCount = 0;
    let completedCount = 0;
    let cancelledCount = 0;

    apiBookings.forEach((booking) => {
      console.log("📝 Processing booking:", booking);
      allCount++;
      
      const status = booking.status?.toLowerCase();
      console.log("📌 Booking status:", status);
      
      if (status === "cancelled" || status === "canceled") {
        cancelledCount++;
      } else if (status === "completed" || status === "delivered") {
        completedCount++;
      } else if (status === "accept" || status === "pending") {
        upcomingCount++;
      } else {
        // Check date for upcoming
        const bookingDate = booking.dateId?.workingDate ? new Date(booking.dateId.workingDate) : null;
        const now = new Date();
        
        if (bookingDate && bookingDate > now) {
          upcomingCount++;
        } else {
          upcomingCount++; // Default to upcoming
        }
      }
    });

    console.log("🔢 Status counts:", { allCount, upcomingCount, completedCount, cancelledCount });
    return { allCount, upcomingCount, completedCount, cancelledCount };
  };

  const { allCount, upcomingCount, completedCount, cancelledCount } = calculateStatusCounts();

  const updatedTabs = tabs.map((tab) => {
    switch (tab.id) {
      case "all":
        return { ...tab, count: allCount };
      case "upcoming":
        return { ...tab, count: upcomingCount };
      case "completed":
        return { ...tab, count: completedCount };
      case "cancelled":
        return { ...tab, count: cancelledCount };
      default:
        return tab;
    }
  });

  // Format date and time
  const formatDate = (dateString) => {
    if (!dateString) return "Date not set";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "Time not set";
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour % 12 || 12;
      return `${formattedHour}:${minutes} ${ampm}`;
    } catch (error) {
      return timeString;
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "Date not available";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  // Get booking status
  const getBookingStatus = (booking) => {
    const status = booking.status?.toLowerCase();
    console.log("🎯 Getting status for booking:", status);
    
    if (status === "cancelled" || status === "canceled") {
      return {
        status: "Cancelled",
        statusColor: "#EB5757",
        badgeColor: "#EB5757",
        badgeBg: "#FFE8E8",
        actions: "view",
      };
    } else if (status === "completed" || status === "delivered") {
      return {
        status: "Completed",
        statusColor: "#00C363",
        badgeColor: "#00C363",
        badgeBg: "#E9FFF4",
        actions: "review",
      };
    } else if (status === "accept") {
      return {
        status: "Confirmed",
        statusColor: "#00C363",
        badgeColor: "#00C363",
        badgeBg: "#E9FFF4",
        actions: "full",
      };
    } else if (status === "pending") {
      return {
        status: "Pending",
        statusColor: "#F7A500",
        badgeColor: "#F7A500",
        badgeBg: "#FFF5E6",
        actions: "full",
      };
    } else {
      // Check if booking is in future
      const bookingDate = booking.dateId?.workingDate ? new Date(booking.dateId.workingDate) : null;
      const now = new Date();
      
      if (bookingDate && bookingDate > now) {
        return {
          status: "Upcoming",
          statusColor: "#F78D25",
          badgeColor: "#F78D25",
          badgeBg: "#FFF0E2",
          actions: "full",
        };
      } else {
        return {
          status: "Processing",
          statusColor: "#5A3DF6",
          badgeColor: "#5A3DF6",
          badgeBg: "#F0EEFF",
          actions: "full",
        };
      }
    }
  };

  // Get service information from booking data
  const getServiceInfo = (booking) => {
    console.log("🔍 Getting service info for booking:", booking);
    
    // Your data structure seems to have provider info directly
    const provider = booking.provider || {};
    const dateInfo = booking.dateId || {};
    const timeInfo = booking.timeSlot || {};
    
    // Try to get service name from different possible locations
    let serviceName = "Service Booking";
    let category = "General Service";
    let price = 599.00;
    let duration = "1 hour";
    let image = "/product/p1.jpg";
    
    // Check different possible locations for service info
    if (provider.fullName) {
      serviceName = provider.fullName + "'s Service";
    }
    
    if (dateInfo.duration) {
      duration = dateInfo.duration;
    } else if (timeInfo.duration) {
      duration = timeInfo.duration;
    }
    
    // You might need to adjust these based on your actual data structure
    return {
      name: serviceName,
      category: category,
      image: image,
      description: "Professional service booking",
      price: price,
      duration: duration,
      providerName: provider.fullName || "Service Provider",
      providerEmail: provider.email || "provider@example.com",
      providerPhone: provider.phone || "N/A",
      providerId: provider._id,
    };
  };

  // Transform API data to match UI format
  const bookings = apiBookings.map((booking, index) => {
    console.log(`🔄 Transforming booking ${index}:`, booking);
    
    const statusInfo = getBookingStatus(booking);
    const serviceInfo = getServiceInfo(booking);
    const bookingId = booking._id?.substring(booking._id.length - 8).toUpperCase() || `BOOK${index + 1}`;

    const transformedBooking = {
      id: bookingId,
      fullId: booking._id,
      status: statusInfo.status,
      statusColor: statusInfo.statusColor,
      badgeColor: statusInfo.badgeColor,
      badgeBg: statusInfo.badgeBg,
      price: serviceInfo.price,
      serviceName: serviceInfo.name,
      category: serviceInfo.category,
      date: formatDate(booking.dateId?.workingDate),
      time: formatTime(booking.timeSlot?.startTime),
      duration: serviceInfo.duration,
      image: serviceInfo.image,
      actions: statusInfo.actions,
      rawData: booking,
      provider: booking.provider,
      dateId: booking.dateId,
      timeSlot: booking.timeSlot,
      paymentMethod: booking.paymentMethod,
      paymentStatus: booking.paymentStatus,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
      customer: booking.customer,
      providerName: serviceInfo.providerName,
      providerEmail: serviceInfo.providerEmail,
      providerPhone: serviceInfo.providerPhone,
      providerId: serviceInfo.providerId,
      canReview: statusInfo.status === "Completed",
      canCancel: statusInfo.status === "Upcoming" || statusInfo.status === "Pending" || statusInfo.status === "Confirmed",
    };
    
    console.log(`✅ Transformed booking ${index}:`, transformedBooking);
    return transformedBooking;
  });

  console.log("📊 Final bookings array:", bookings);
  console.log("📈 Bookings count:", bookings.length);

  // Filter bookings based on active tab
  const filteredBookings = activeTab === "all" 
    ? bookings 
    : bookings.filter((booking) => {
        if (activeTab === "upcoming") {
          return booking.status === "Upcoming" || booking.status === "Pending" || booking.status === "Confirmed";
        } else if (activeTab === "completed") {
          return booking.status === "Completed";
        } else if (activeTab === "cancelled") {
          return booking.status === "Cancelled";
        }
        return false;
      });

  console.log("🔍 Filtered bookings for tab", activeTab, ":", filteredBookings);

  // Handlers
  const handleViewDetails = (booking) => {
    console.log("👁️ Viewing details for:", booking.id);
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  // ... rest of the handlers remain the same ...

  // Loading state
  if (isLoading) {
    return (
      <section className="w-full bg-[#F7F7FA] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your bookings...</p>
        </div>
      </section>
    );
  }

  // Error state
  if (isError) {
    return (
      <section className="w-full bg-[#F7F7FA] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error loading bookings. Please try again.</p>
        </div>
      </section>
    );
  }

  // Debug view - remove in production
  const showDebug = false; // Set to true to see debug info

  return (
    <>
      {showDebug && (
        <div className="fixed top-4 right-4 z-50 bg-yellow-100 border border-yellow-300 rounded-lg p-4 max-w-md">
          <h3 className="font-bold text-yellow-800 mb-2">Debug Info</h3>
          <pre className="text-xs text-yellow-700 overflow-auto max-h-64">
            {debugInfo}
          </pre>
          <div className="mt-2 text-xs">
            <p>📊 Bookings from API: {apiBookings.length}</p>
            <p>🎯 Transformed bookings: {bookings.length}</p>
            <p>🔍 Filtered bookings: {filteredBookings.length}</p>
          </div>
        </div>
      )}

      <section className="w-full bg-[#F7F7FA] pb-10 px-4">
        <div className="max-w-[850px] mx-auto">

          {/* Header with counts */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">My Bookings</h1>
            <p className="text-gray-600">
              {bookings.length} booking{bookings.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {/* FILTER TABS */}
          <div className="flex justify-center mb-10">
            <div className="flex items-center gap-4 bg-white px-4 py-3 rounded-[30px] shadow-[0_4px_14px_rgba(0,0,0,0.06)]">
              {updatedTabs.map((tab) => (
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

          {/* Debug info in UI */}
          {bookings.length === 0 && apiBookings.length > 0 && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle size={20} className="text-blue-600" />
                <h3 className="font-semibold text-blue-800">Data Found but Not Displaying</h3>
              </div>
              <p className="text-sm text-blue-700">
                API returned {apiBookings.length} booking(s) but transformation failed.
                Check console for details.
              </p>
              <button 
                onClick={() => console.log("API Data:", bookingData, "Transformed:", bookings)}
                className="mt-2 text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded"
              >
                Show Debug Info
              </button>
            </div>
          )}

          {/* BOOKINGS */}
          {filteredBookings.length > 0 ? (
            <div className="space-y-6">
              {filteredBookings.map((booking, index) => (
                <div
                  key={index}
                  className="bg-white border border-[#EEEAF7] rounded-[16px] p-5 shadow-[0_6px_18px_rgba(0,0,0,0.06)]"
                >
                  {/* Header */}
                  <div className="flex justify-between">
                    <p className="text-[13px] font-semibold text-[#222]">
                      Booking ID #{booking.id}
                    </p>

                    <div className="flex items-center gap-3">
                      <span
                        className="text-[11px] px-2 py-[2px] rounded-full"
                        style={{
                          backgroundColor: booking.badgeBg,
                          color: booking.badgeColor,
                        }}
                      >
                        {booking.status}
                      </span>

                      <p className="text-[14px] font-semibold text-[#F78D25]">
                        ${booking.price}
                      </p>
                    </div>
                  </div>

                  {/* Date */}
                  <p className="text-[11px] text-[#777] mt-[2px]">
                    Booked on {formatDateTime(booking.createdAt)}
                  </p>

                  {/* Service Info */}
                  <div className="flex items-start gap-4 mt-4">
                    <img
                      src={booking.image}
                      className="h-[55px] w-[55px] rounded-[12px] object-cover bg-gray-200"
                      alt={booking.serviceName}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/55x55/F3F4F6/6B7280?text=S";
                      }}
                    />

                    <div className="flex-1">
                      <p className="text-[14px] font-semibold text-[#333]">
                        {booking.serviceName}
                      </p>
                      <p className="text-[12px] text-[#8B8B8B]">{booking.category}</p>

                      {/* Details */}
                      <div className="mt-3 space-y-1">
                        <div className="flex items-center gap-2 text-[#666] text-[12px]">
                          <Calendar size={14} />
                          {booking.date}
                        </div>

                        <div className="flex items-center gap-2 text-[#666] text-[12px]">
                          <Clock size={14} />
                          {booking.time}
                        </div>

                        <div className="flex items-center gap-2 text-[#666] text-[12px]">
                          <TimerIcon size={14} />
                          {booking.duration}
                        </div>

                        <div className="flex items-center gap-2 text-[#666] text-[12px]">
                          <User size={14} />
                          {booking.providerName}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
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
                      "
                    >
                      <Eye size={16} className="text-white" />
                      View Details
                    </button>

                    {/* Cancel Order */}
                    {booking.canCancel && (
                      <button
                        onClick={() => {
                          setBookingToCancel(booking);
                          setIsCancelConfirmOpen(true);
                        }}
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
                        Cancel Booking
                      </button>
                    )}

                    {/* Review Button */}
                    {booking.canReview && (
                      <button
                        onClick={() => {
                          setSelectedServiceForReview(booking);
                          setIsReviewModalOpen(true);
                        }}
                        className="
                          flex-1 flex items-center justify-center gap-2
                          text-[13px] font-medium
                          text-white
                          py-[10px] rounded-[10px]
                          bg-gradient-to-r from-green-500 to-emerald-600
                        "
                      >
                        <Star size={16} className="text-white" />
                        Write Review
                      </button>
                    )}

                    {/* Refund Button */}
                    {booking.canReview && (
                      <button
                        onClick={() => {
                          setSelectedBookingForRefund(booking);
                          setIsRefundModalOpen(true);
                        }}
                        className="
                          flex-1 flex items-center justify-center gap-2
                          text-[13px] font-medium
                          text-white
                          py-[10px] rounded-[10px]
                          bg-gradient-to-r from-blue-500 to-purple-600
                        "
                      >
                        <FileText size={16} className="text-white" />
                        Refund Request
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Empty state when no bookings match filter
            <div className="text-center py-12 bg-white rounded-2xl border border-[#EEEAF7] shadow-[0_6px_18px_rgba(0,0,0,0.06)]">
              <div className="h-[80px] w-[80px] mx-auto rounded-full bg-gradient-to-r from-[#9838E1] to-[#F68E44] flex items-center justify-center mb-6">
                <Package size={32} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                No {activeTab !== 'all' ? activeTab : ''} Bookings
              </h3>
              <p className="text-gray-600 mb-6">
                {activeTab === 'all' 
                  ? "You don't have any bookings yet."
                  : `You don't have any ${activeTab} bookings.`
                }
              </p>
              {activeTab !== 'all' && (
                <button
                  onClick={() => setActiveTab('all')}
                  className="px-6 py-2 bg-gradient-to-r from-[#9838E1] to-[#F68E44] text-white rounded-lg hover:opacity-90 transition"
                >
                  View All Bookings
                </button>
              )}
            </div>
          )}

          {/* HELP SECTION - Show only when there are bookings */}
          {bookings.length > 0 && (
            <div className="mt-10 flex justify-center">
              <div className="w-full max-w-[350px] bg-white rounded-[16px] border border-[#EEEAF7] shadow-[0_6px_18px_rgba(0,0,0,0.06)] p-6 text-center">
                <div className="h-[55px] w-[55px] mx-auto rounded-full bg-gradient-to-r from-[#9838E1] to-[#F68E44] flex items-center justify-center">
                  <Calendar size={24} className="text-white" />
                </div>

                <p className="text-[14px] font-semibold text-[#333] mt-3">
                  Need Help?
                </p>
                <p className="text-[12px] text-[#777] mt-1">
                  Have questions about your booking? Our customer support team is here to help.
                </p>

                <div className="flex items-center gap-3 mt-4">
                  <button
                    className="flex-1 border border-[#E0D9F6] text-[#8A50DB] text-[12px] py-[8px] rounded-[8px] hover:bg-[#F8F4FF] transition"
                  >
                    <Mail size={14} className="inline mr-1" />
                    Email Support
                  </button>
                  <button
                    className="flex-1 text-white text-[12px] py-[8px] rounded-[8px] bg-gradient-to-r from-[#9838E1] to-[#F68E44] flex items-center justify-center gap-2 hover:opacity-90 transition"
                  >
                    <Phone size={14} />
                    Call Us
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Modals remain the same as before */}
      {/* ... (keep all modal code from previous version) ... */}
    </>
  );
}