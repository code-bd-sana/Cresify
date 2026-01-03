"use client";
import { useGetAllBookingsQuery } from "@/feature/provider/ProviderApi";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  Download,
  Eye,
  FileText,
  Filter,
  Mail,
  MapPin,
  MoreVertical,
  Phone,
  Printer,
  Search,
  Trash2,
  User,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const BookingsPage = () => {
  const { t } = useTranslation("admin");
  const { data, isLoading, isError } = useGetAllBookingsQuery();
  const bookings = data?.data?.bookings || [];
  const totalBookings = data?.data?.total || 0;

  // State for pagination and filtering
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  console.log(data, "all services is here re rwek jfkewaf");

  // Filter bookings based on search and status
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.customer?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      booking.customer?.email
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      booking.provider?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      booking._id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" || booking.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBookings = filteredBookings.slice(startIndex, endIndex);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatShortDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status display text
  const getStatusDisplay = (status) => {
    const statusMap = {
      accept: t("bookings.status.accept"),
      pending: t("bookings.status.pending"),
      processing: t("bookings.status.processing"),
      canceled: t("bookings.status.canceled"),
      completed: t("bookings.status.completed"),
    };
    return statusMap[status] || status;
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "accept":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "canceled":
        return "bg-red-100 text-red-800 border-red-200";
      case "completed":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "accept":
        return <CheckCircle size={16} className='text-green-600' />;
      case "pending":
        return <Clock size={16} className='text-yellow-600' />;
      case "processing":
        return <AlertCircle size={16} className='text-blue-600' />;
      case "canceled":
        return <XCircle size={16} className='text-red-600' />;
      case "completed":
        return <CheckCircle size={16} className='text-purple-600' />;
      default:
        return <AlertCircle size={16} className='text-gray-600' />;
    }
  };

  // Get payment status display text
  const getPaymentStatusDisplay = (status) => {
    const statusMap = {
      completed: t("bookings.paymentStatus.completed"),
      processing: t("bookings.paymentStatus.processing"),
      failed: t("bookings.paymentStatus.failed"),
    };
    return statusMap[status] || status;
  };

  // Get payment status color
  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get payment method display text
  const getPaymentMethodDisplay = (method) => {
    if (method === "card") {
      return t("bookings.table.paymentMethod.card");
    }
    return method;
  };

  // Handle view details
  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setIsDetailModalOpen(true);
  };

  // Handle status change
  const handleStatusChange = (bookingId, newStatus) => {
    // Here you would typically call an API to update the status
    console.log(`Changing booking ${bookingId} status to ${newStatus}`);
    // Update the booking status in your state or refetch data
  };

  // Handle delete booking
  const handleDeleteBooking = (bookingId) => {
    if (window.confirm(t("bookings.actions.deleteConfirm"))) {
      console.log(`Deleting booking ${bookingId}`);
      // Call API to delete booking
    }
  };

  // Export data
  const handleExport = (format) => {
    console.log(t("bookings.actions.exportAs", { format }));
    // Implement export logic here
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>{t("bookings.loading.loading")}</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4'>
            <XCircle size={24} className='text-red-600' />
          </div>
          <h3 className='text-lg font-semibold text-gray-800'>
            {t("bookings.loading.error.title")}
          </h3>
          <p className='text-gray-600 mt-2'>
            {t("bookings.loading.error.message")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 p-4 md:p-6'>
      {/* Header */}
      <div className='mb-8'>
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
          <div>
            <h1 className='text-2xl md:text-3xl font-bold text-gray-800'>
              {t("bookings.title")}
            </h1>
            <p className='text-gray-600 mt-2'>
              {t("bookings.subtitle", { count: totalBookings })}
            </p>
          </div>
          <div className='flex items-center gap-3'>
            {/* <button
              onClick={() => handleExport("csv")}
              className='flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition'>
              <Download size={18} />
              {t("bookings.actions.exportCSV")}
            </button>
            <button
              onClick={() => handleExport("pdf")}
              className='flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition'>
              <Printer size={18} />
              {t("bookings.actions.printReport")}
            </button> */}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
        <div className='bg-white rounded-xl border border-gray-200 p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-gray-500 text-sm'>
                {t("bookings.stats.totalBookings")}
              </p>
              <p className='text-2xl font-bold text-gray-800 mt-1'>
                {totalBookings}
              </p>
            </div>
            <div className='h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center'>
              <Calendar size={24} className='text-blue-600' />
            </div>
          </div>
          <div className='mt-4'>
            <div className='flex items-center gap-2 text-sm text-green-600'>
              <span>↑ 12%</span>
              <span>{t("bookings.stats.fromLastMonth")}</span>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-xl border border-gray-200 p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-gray-500 text-sm'>
                {t("bookings.stats.pending")}
              </p>
              <p className='text-2xl font-bold text-gray-800 mt-1'>
                {bookings.filter((b) => b.status === "pending").length}
              </p>
            </div>
            <div className='h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center'>
              <Clock size={24} className='text-yellow-600' />
            </div>
          </div>
          <div className='mt-4'>
            <div className='flex items-center gap-2 text-sm text-gray-600'>
              <span>{t("bookings.stats.requiresAttention")}</span>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-xl border border-gray-200 p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-gray-500 text-sm'>
                {t("bookings.stats.confirmed")}
              </p>
              <p className='text-2xl font-bold text-gray-800 mt-1'>
                {bookings.filter((b) => b.status === "accept").length}
              </p>
            </div>
            <div className='h-12 w-12 rounded-full bg-green-100 flex items-center justify-center'>
              <CheckCircle size={24} className='text-green-600' />
            </div>
          </div>
          <div className='mt-4'>
            <div className='flex items-center gap-2 text-sm text-green-600'>
              <span>↑ 8%</span>
              <span>{t("bookings.stats.fromLastMonth")}</span>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-xl border border-gray-200 p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-gray-500 text-sm'>
                {t("bookings.stats.revenue")}
              </p>
              <p className='text-2xl font-bold text-gray-800 mt-1'>$--</p>
            </div>
            <div className='h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center'>
              <CreditCard size={24} className='text-purple-600' />
            </div>
          </div>
          <div className='mt-4'>
            <div className='flex items-center gap-2 text-sm text-green-600'>
              <span>↑ 15%</span>
              <span>{t("bookings.stats.fromLastMonth")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className='bg-white rounded-xl border border-gray-200 p-6 mb-6'>
        <div className='flex flex-col lg:flex-row gap-4'>
          {/* Search */}
          <div className='flex-1'>
            <div className='relative'>
              <Search
                className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                size={20}
              />
              <input
                type='text'
                placeholder={t("bookings.actions.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>
          </div>

          {/* Filters */}
          <div className='flex gap-3'>
            <div className='relative'>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className='appearance-none bg-white border border-gray-300 rounded-lg py-2.5 px-4 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent'>
                <option value='all'>{t("bookings.filters.allStatus")}</option>
                <option value='pending'>{t("bookings.filters.pending")}</option>
                <option value='accept'>{t("bookings.filters.accept")}</option>
                <option value='processing'>
                  {t("bookings.filters.processing")}
                </option>
                <option value='completed'>
                  {t("bookings.filters.completed")}
                </option>
                <option value='canceled'>
                  {t("bookings.filters.canceled")}
                </option>
              </select>
              <Filter
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none'
                size={20}
              />
            </div>

            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className='bg-white border border-gray-300 rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent'>
              <option value='5'>5 {t("bookings.actions.perPage")}</option>
              <option value='10'>10 {t("bookings.actions.perPage")}</option>
              <option value='25'>25 {t("bookings.actions.perPage")}</option>
              <option value='50'>50 {t("bookings.actions.perPage")}</option>
            </select>
          </div>
        </div>

        {/* Quick Status Filters */}
        <div className='flex flex-wrap gap-2 mt-4'>
          {[
            "all",
            "pending",
            "accept",
            "processing",
            "completed",
            "canceled",
          ].map((status) => {
            const displayStatus =
              status === "all"
                ? t("bookings.filters.allStatus")
                : getStatusDisplay(status);
            return (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                  selectedStatus === status
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}>
                {displayStatus}
                {status !== "all" && (
                  <span className='ml-1 bg-white bg-opacity-20 px-1.5 py-0.5 rounded-full text-xs'>
                    {bookings.filter((b) => b.status === status).length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bookings Table */}
      <div className='bg-white rounded-xl border border-gray-200 overflow-hidden mb-6'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='py-3 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  {t("bookings.table.headers.bookingId")}
                </th>
                <th className='py-3 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  {t("bookings.table.headers.customer")}
                </th>
                <th className='py-3 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  {t("bookings.table.headers.provider")}
                </th>
                <th className='py-3 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  {t("bookings.table.headers.dateTime")}
                </th>
                <th className='py-3 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  {t("bookings.table.headers.status")}
                </th>
                <th className='py-3 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  {t("bookings.table.headers.payment")}
                </th>
                <th className='py-3 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  {t("bookings.table.headers.actions")}
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {currentBookings.map((booking) => (
                <tr key={booking._id} className='hover:bg-gray-50 transition'>
                  <td className='py-4 px-6'>
                    <div>
                      <p className='font-medium text-gray-900'>
                        #
                        {booking._id
                          .substring(booking._id.length - 8)
                          .toUpperCase()}
                      </p>
                      <p className='text-xs text-gray-500 mt-1'>
                        {formatShortDate(booking.createdAt)}
                      </p>
                    </div>
                  </td>
                  <td className='py-4 px-6'>
                    <div className='flex items-center gap-3'>
                      <div className='h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center'>
                        <User size={20} className='text-blue-600' />
                      </div>
                      <div>
                        <p className='font-medium text-gray-900'>
                          {booking.customer?.name}
                        </p>
                        <p className='text-sm text-gray-500'>
                          {booking.customer?.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className='py-4 px-6'>
                    <div className='flex items-center gap-3'>
                      <div className='h-10 w-10 rounded-full bg-green-100 flex items-center justify-center'>
                        <User size={20} className='text-green-600' />
                      </div>
                      <div>
                        <p className='font-medium text-gray-900'>
                          {booking.provider?.name}
                        </p>
                        <p className='text-sm text-gray-500'>
                          {booking.provider?.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className='py-4 px-6'>
                    <div>
                      <div className='flex items-center gap-2 text-sm text-gray-600'>
                        <Calendar size={14} />
                        <span>
                          {formatShortDate(booking.dateId?.workingDate)}
                        </span>
                      </div>
                      <div className='flex items-center gap-2 text-sm text-gray-600 mt-1'>
                        <Clock size={14} />
                        <span>
                          {booking.timeSlot?.startTime} -{" "}
                          {booking.timeSlot?.endTime}
                        </span>
                      </div>
                      <div className='text-xs text-gray-500 mt-1'>
                        {booking.timeSlot?.duration}{" "}
                        {t("bookings.table.duration")}
                      </div>
                    </div>
                  </td>
                  <td className='py-4 px-6'>
                    <div className='flex items-center gap-2'>
                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(
                          booking.status
                        )}`}>
                        {getStatusIcon(booking.status)}
                        <span className='capitalize'>
                          {getStatusDisplay(booking.status)}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className='py-4 px-6'>
                    <div className='space-y-1'>
                      <div
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(
                          booking.paymentStatus
                        )}`}>
                        {getPaymentStatusDisplay(booking.paymentStatus)}
                      </div>
                      <div className='text-xs text-gray-500'>
                        {getPaymentMethodDisplay(booking.paymentMethod)}
                      </div>
                    </div>
                  </td>
                  <td className='py-4 px-6'>
                    <div className='flex items-center gap-2'>
                      <button
                        onClick={() => handleViewDetails(booking)}
                        className='p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition'
                        title={t("bookings.actions.viewDetails")}>
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(booking._id, "accept")
                        }
                        className='p-2 text-green-600 hover:bg-green-50 rounded-lg transition'
                        title={t("bookings.actions.acceptBooking")}>
                        <CheckCircle size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteBooking(booking._id)}
                        className='p-2 text-red-600 hover:bg-red-50 rounded-lg transition'
                        title={t("bookings.actions.deleteBooking")}>
                        <Trash2 size={18} />
                      </button>
                      <div className='relative'>
                        <button className='p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition'>
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {currentBookings.length === 0 && (
          <div className='text-center py-12'>
            <div className='h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4'>
              <Calendar size={24} className='text-gray-400' />
            </div>
            <h3 className='text-lg font-semibold text-gray-800'>
              {t("bookings.table.emptyState.title")}
            </h3>
            <p className='text-gray-600 mt-2'>
              {searchTerm || selectedStatus !== "all"
                ? t("bookings.table.emptyState.search")
                : t("bookings.table.emptyState.noBookings")}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className='flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-xl border border-gray-200 p-4'>
          <div className='text-sm text-gray-600'>
            {t("bookings.pagination.showing", {
              start: startIndex + 1,
              end: Math.min(endIndex, filteredBookings.length),
              total: filteredBookings.length,
            })}
          </div>
          <div className='flex items-center gap-2'>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg border ${
                currentPage === 1
                  ? "border-gray-200 text-gray-400 cursor-not-allowed"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}>
              <ChevronLeft size={20} />
            </button>

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
                  className={`h-10 w-10 rounded-lg font-medium ${
                    currentPage === pageNum
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}>
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg border ${
                currentPage === totalPages
                  ? "border-gray-200 text-gray-400 cursor-not-allowed"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Booking Details Modal */}
      {isDetailModalOpen && selectedBooking && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto'>
            {/* Modal Header */}
            <div className='sticky top-0 bg-white border-b p-6 flex justify-between items-center z-10'>
              <div>
                <h2 className='text-2xl font-bold text-gray-800'>
                  {t("bookings.modal.title")}
                </h2>
                <p className='text-gray-600'>
                  {t("bookings.modal.bookingId", {
                    id: selectedBooking._id
                      .substring(selectedBooking._id.length - 8)
                      .toUpperCase(),
                  })}
                </p>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className='p-2 hover:bg-gray-100 rounded-full transition'>
                <XCircle size={24} className='text-gray-500' />
              </button>
            </div>

            {/* Modal Content */}
            <div className='p-6 space-y-6'>
              {/* Status Banner */}
              <div
                className={`rounded-xl p-5 ${getStatusColor(
                  selectedBooking.status
                ).replace("border", "bg")}`}>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    {getStatusIcon(selectedBooking.status)}
                    <div>
                      <h3 className='font-bold text-lg capitalize'>
                        {getStatusDisplay(selectedBooking.status)}
                      </h3>
                      <p className='text-gray-600'>
                        {t("bookings.modal.createdOn", {
                          date: formatDate(selectedBooking.createdAt),
                        })}
                      </p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='text-2xl font-bold'>
                      ${/* Add amount if available */}
                    </p>
                    <p className='text-sm text-gray-600'>
                      {t("bookings.modal.totalAmount")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer and Provider Info */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {/* Customer Info */}
                <div className='border rounded-xl p-5'>
                  <div className='flex items-center gap-2 mb-4'>
                    <User size={20} className='text-blue-600' />
                    <h4 className='font-bold text-gray-800'>
                      {t("bookings.modal.customerInfo")}
                    </h4>
                  </div>
                  <div className='space-y-3'>
                    <div className='flex items-center gap-3'>
                      <div className='h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center'>
                        <User size={20} className='text-blue-600' />
                      </div>
                      <div>
                        <p className='font-semibold text-gray-800'>
                          {selectedBooking.customer?.name}
                        </p>
                        <p className='text-sm text-gray-600'>
                          {selectedBooking.customer?.role}
                        </p>
                      </div>
                    </div>
                    <div className='space-y-2 text-sm'>
                      <div className='flex items-center gap-2 text-gray-600'>
                        <Mail size={14} />
                        <span>{selectedBooking.customer?.email}</span>
                      </div>
                      <div className='flex items-center gap-2 text-gray-600'>
                        <Phone size={14} />
                        <span>
                          {selectedBooking.customer?.phone ||
                            t("bookings.modal.sections.notProvided")}
                        </span>
                      </div>
                      <div className='flex items-center gap-2 text-gray-600'>
                        <MapPin size={14} />
                        <span>
                          {selectedBooking.customer?.address ||
                            t("bookings.modal.sections.addressNotAvailable")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Provider Info */}
                <div className='border rounded-xl p-5'>
                  <div className='flex items-center gap-2 mb-4'>
                    <User size={20} className='text-green-600' />
                    <h4 className='font-bold text-gray-800'>
                      {t("bookings.modal.providerInfo")}
                    </h4>
                  </div>
                  <div className='space-y-3'>
                    <div className='flex items-center gap-3'>
                      <div className='h-12 w-12 rounded-full bg-green-100 flex items-center justify-center'>
                        <User size={20} className='text-green-600' />
                      </div>
                      <div>
                        <p className='font-semibold text-gray-800'>
                          {selectedBooking.provider?.name}
                        </p>
                        <p className='text-sm text-gray-600'>
                          {selectedBooking.provider?.role}
                        </p>
                      </div>
                    </div>
                    <div className='space-y-2 text-sm'>
                      <div className='flex items-center gap-2 text-gray-600'>
                        <Mail size={14} />
                        <span>{selectedBooking.provider?.email}</span>
                      </div>
                      <div className='flex items-center gap-2 text-gray-600'>
                        <Phone size={14} />
                        <span>
                          {selectedBooking.provider?.phone ||
                            t("bookings.modal.sections.notProvided")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div className='border rounded-xl p-5'>
                <div className='flex items-center gap-2 mb-4'>
                  <Calendar size={20} className='text-purple-600' />
                  <h4 className='font-bold text-gray-800'>
                    {t("bookings.modal.bookingDetails")}
                  </h4>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='space-y-4'>
                    <div>
                      <p className='text-sm text-gray-600'>
                        {t("bookings.modal.sections.serviceDate")}
                      </p>
                      <p className='font-medium'>
                        {formatDate(selectedBooking.dateId?.workingDate)}
                      </p>
                    </div>
                    <div>
                      <p className='text-sm text-gray-600'>
                        {t("bookings.modal.sections.timeSlot")}
                      </p>
                      <p className='font-medium'>
                        {selectedBooking.timeSlot?.startTime} -{" "}
                        {selectedBooking.timeSlot?.endTime}
                      </p>
                    </div>
                    <div>
                      <p className='text-sm text-gray-600'>
                        {t("bookings.modal.sections.duration")}
                      </p>
                      <p className='font-medium'>
                        {selectedBooking.timeSlot?.duration}
                      </p>
                    </div>
                  </div>
                  <div className='space-y-4'>
                    <div>
                      <p className='text-sm text-gray-600'>
                        {t("bookings.modal.sections.serviceType")}
                      </p>
                      <p className='font-medium'>
                        {selectedBooking.dateId?.serviceType ||
                          t("bookings.modal.sections.generalService")}
                      </p>
                    </div>
                    <div>
                      <p className='text-sm text-gray-600'>
                        {t("bookings.modal.sections.location")}
                      </p>
                      <p className='font-medium'>
                        {selectedBooking.dateId?.location ||
                          t("bookings.modal.sections.notSpecified")}
                      </p>
                    </div>
                    <div>
                      <p className='text-sm text-gray-600'>
                        {t("bookings.modal.sections.availability")}
                      </p>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedBooking.dateId?.isAvailable
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                        {selectedBooking.dateId?.isAvailable
                          ? t("bookings.modal.availability.available")
                          : t("bookings.modal.availability.unavailable")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className='border rounded-xl p-5'>
                <div className='flex items-center gap-2 mb-4'>
                  <CreditCard size={20} className='text-orange-600' />
                  <h4 className='font-bold text-gray-800'>
                    {t("bookings.modal.paymentInfo")}
                  </h4>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='space-y-3'>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>
                        {t("bookings.modal.sections.paymentMethod")}
                      </span>
                      <span className='font-medium capitalize'>
                        {getPaymentMethodDisplay(selectedBooking.paymentMethod)}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>
                        {t("bookings.modal.sections.paymentStatus")}
                      </span>
                      <span
                        className={`font-medium ${getPaymentStatusColor(
                          selectedBooking.paymentStatus
                        )} px-2.5 py-0.5 rounded-full text-xs`}>
                        {getPaymentStatusDisplay(selectedBooking.paymentStatus)}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>
                        {t("bookings.modal.sections.transactionDate")}
                      </span>
                      <span className='font-medium'>
                        {formatDate(selectedBooking.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className='space-y-3'>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>
                        {t("bookings.modal.sections.bookingStatus")}
                      </span>
                      <span
                        className={`font-medium ${getStatusColor(
                          selectedBooking.status
                        )} px-2.5 py-0.5 rounded-full text-xs`}>
                        {getStatusDisplay(selectedBooking.status)}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>
                        {t("bookings.modal.sections.lastUpdated")}
                      </span>
                      <span className='font-medium'>
                        {formatDate(selectedBooking.updatedAt)}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>
                        {t("bookings.modal.sections.bookingId")}
                      </span>
                      <span className='font-medium font-mono'>
                        {selectedBooking._id
                          .substring(selectedBooking._id.length - 8)
                          .toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes and Actions */}
              <div className='border rounded-xl p-5'>
                <div className='flex items-center gap-2 mb-4'>
                  <FileText size={20} className='text-gray-600' />
                  <h4 className='font-bold text-gray-800'>
                    {t("bookings.modal.notesActions")}
                  </h4>
                </div>
                <div className='space-y-4'>
                  <textarea
                    placeholder={t("bookings.modal.notes.placeholder")}
                    className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    rows={3}
                  />
                  <div className='flex flex-wrap gap-3'>
                    <button className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition'>
                      {t("bookings.modal.buttons.sendReminder")}
                    </button>
                    <button className='px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition'>
                      {t("bookings.modal.buttons.confirmBooking")}
                    </button>
                    <button className='px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition'>
                      {t("bookings.modal.buttons.reschedule")}
                    </button>
                    <button className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition'>
                      {t("bookings.modal.buttons.cancelBooking")}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className='sticky bottom-0 bg-white border-t p-6 flex justify-end gap-3'>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className='px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition'>
                {t("bookings.modal.buttons.close")}
              </button>
              <button className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition'>
                {t("bookings.modal.buttons.saveChanges")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
