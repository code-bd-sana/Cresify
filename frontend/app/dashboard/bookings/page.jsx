'use client';
import { useGetAllBookingsQuery } from '@/feature/provider/ProviderApi';
import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreVertical,
  Download,
  Printer,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Package,
  Truck,
  Home,
  Star,
  FileText
} from "lucide-react";

const BookingsPage = () => {
  const { data, isLoading, isError } = useGetAllBookingsQuery();
  const bookings = data?.data?.bookings || [];
  const totalBookings = data?.data?.total || 0;

  // State for pagination and filtering
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);


  console.log(data, 'all services is here re rwek jfkewaf');

  // Filter bookings based on search and status
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.provider?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking._id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      selectedStatus === 'all' || 
      booking.status === selectedStatus;

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
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatShortDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'accept':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'canceled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'accept':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'pending':
        return <Clock size={16} className="text-yellow-600" />;
      case 'processing':
        return <AlertCircle size={16} className="text-blue-600" />;
      case 'canceled':
        return <XCircle size={16} className="text-red-600" />;
      case 'completed':
        return <CheckCircle size={16} className="text-purple-600" />;
      default:
        return <AlertCircle size={16} className="text-gray-600" />;
    }
  };

  // Get payment status color
  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
    if (window.confirm('Are you sure you want to delete this booking?')) {
      console.log(`Deleting booking ${bookingId}`);
      // Call API to delete booking
    }
  };

  // Export data
  const handleExport = (format) => {
    console.log(`Exporting data as ${format}`);
    // Implement export logic here
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <XCircle size={24} className="text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Error Loading Bookings</h3>
          <p className="text-gray-600 mt-2">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Bookings Management</h1>
            <p className="text-gray-600 mt-2">
              Manage all bookings ({totalBookings} total)
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleExport('csv')}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              <Download size={18} />
              Export CSV
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              <Printer size={18} />
              Print Report
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{totalBookings}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Calendar size={24} className="text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center gap-2 text-sm text-green-600">
              <span>↑ 12%</span>
              <span>from last month</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pending</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {bookings.filter(b => b.status === 'pending').length}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <Clock size={24} className="text-yellow-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Requires attention</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Confirmed</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {bookings.filter(b => b.status === 'accept').length}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle size={24} className="text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center gap-2 text-sm text-green-600">
              <span>↑ 8%</span>
              <span>from last month</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Revenue</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">$--</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
              <CreditCard size={24} className="text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center gap-2 text-sm text-green-600">
              <span>↑ 15%</span>
              <span>from last month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by customer name, email, or booking ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg py-2.5 px-4 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="accept">Accepted</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="canceled">Canceled</option>
              </select>
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            </div>

            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="bg-white border border-gray-300 rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="5">5 per page</option>
              <option value="10">10 per page</option>
              <option value="25">25 per page</option>
              <option value="50">50 per page</option>
            </select>
          </div>
        </div>

        {/* Quick Status Filters */}
        <div className="flex flex-wrap gap-2 mt-4">
          {['all', 'pending', 'accept', 'processing', 'completed', 'canceled'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                selectedStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
              {status !== 'all' && (
                <span className="ml-1 bg-white bg-opacity-20 px-1.5 py-0.5 rounded-full text-xs">
                  {bookings.filter(b => b.status === status).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Booking ID
                </th>
                <th className="py-3 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Customer
                </th>
                <th className="py-3 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Provider
                </th>
                <th className="py-3 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="py-3 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Payment
                </th>
                <th className="py-3 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentBookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50 transition">
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-gray-900">#{booking._id.substring(booking._id.length - 8).toUpperCase()}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatShortDate(booking.createdAt)}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <User size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{booking.customer?.name}</p>
                        <p className="text-sm text-gray-500">{booking.customer?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <User size={20} className="text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{booking.provider?.name}</p>
                        <p className="text-sm text-gray-500">{booking.provider?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={14} />
                        <span>{formatShortDate(booking.dateId?.workingDate)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <Clock size={14} />
                        <span>{booking.timeSlot?.startTime} - {booking.timeSlot?.endTime}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {booking.timeSlot?.duration}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        <span className="capitalize">{booking.status}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(booking.paymentStatus)}`}>
                        {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {booking.paymentMethod === 'card' ? 'Credit Card' : booking.paymentMethod}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewDetails(booking)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleStatusChange(booking._id, 'accept')}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                        title="Accept Booking"
                      >
                        <CheckCircle size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteBooking(booking._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete Booking"
                      >
                        <Trash2 size={18} />
                      </button>
                      <div className="relative">
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
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
          <div className="text-center py-12">
            <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Calendar size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">No bookings found</h3>
            <p className="text-gray-600 mt-2">
              {searchTerm || selectedStatus !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'No bookings have been made yet'}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredBookings.length)} of {filteredBookings.length} bookings
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg border ${
                currentPage === 1
                  ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
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
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg border ${
                currentPage === totalPages
                  ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Booking Details Modal */}
      {isDetailModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center z-10">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Booking Details</h2>
                <p className="text-gray-600">
                  Booking #{selectedBooking._id.substring(selectedBooking._id.length - 8).toUpperCase()}
                </p>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <XCircle size={24} className="text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Status Banner */}
              <div className={`rounded-xl p-5 ${getStatusColor(selectedBooking.status).replace('border', 'bg')}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(selectedBooking.status)}
                    <div>
                      <h3 className="font-bold text-lg capitalize">{selectedBooking.status}</h3>
                      <p className="text-gray-600">
                        Created on {formatDate(selectedBooking.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">${/* Add amount if available */}</p>
                    <p className="text-sm text-gray-600">Total Amount</p>
                  </div>
                </div>
              </div>

              {/* Customer and Provider Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Info */}
                <div className="border rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <User size={20} className="text-blue-600" />
                    <h4 className="font-bold text-gray-800">Customer Information</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <User size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{selectedBooking.customer?.name}</p>
                        <p className="text-sm text-gray-600">{selectedBooking.customer?.role}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail size={14} />
                        <span>{selectedBooking.customer?.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone size={14} />
                        <span>{selectedBooking.customer?.phone || 'Not provided'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin size={14} />
                        <span>{selectedBooking.customer?.address || 'Address not available'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Provider Info */}
                <div className="border rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <User size={20} className="text-green-600" />
                    <h4 className="font-bold text-gray-800">Provider Information</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                        <User size={20} className="text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{selectedBooking.provider?.name}</p>
                        <p className="text-sm text-gray-600">{selectedBooking.provider?.role}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail size={14} />
                        <span>{selectedBooking.provider?.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone size={14} />
                        <span>{selectedBooking.provider?.phone || 'Not provided'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div className="border rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar size={20} className="text-purple-600" />
                  <h4 className="font-bold text-gray-800">Booking Details</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Service Date</p>
                      <p className="font-medium">
                        {formatDate(selectedBooking.dateId?.workingDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Time Slot</p>
                      <p className="font-medium">
                        {selectedBooking.timeSlot?.startTime} - {selectedBooking.timeSlot?.endTime}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="font-medium">{selectedBooking.timeSlot?.duration}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Service Type</p>
                      <p className="font-medium">{selectedBooking.dateId?.serviceType || 'General Service'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-medium">{selectedBooking.dateId?.location || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Availability</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedBooking.dateId?.isAvailable 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedBooking.dateId?.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="border rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard size={20} className="text-orange-600" />
                  <h4 className="font-bold text-gray-800">Payment Information</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method</span>
                      <span className="font-medium capitalize">
                        {selectedBooking.paymentMethod === 'card' ? 'Credit Card' : selectedBooking.paymentMethod}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Status</span>
                      <span className={`font-medium ${getPaymentStatusColor(selectedBooking.paymentStatus)} px-2.5 py-0.5 rounded-full text-xs`}>
                        {selectedBooking.paymentStatus.charAt(0).toUpperCase() + selectedBooking.paymentStatus.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transaction Date</span>
                      <span className="font-medium">{formatDate(selectedBooking.createdAt)}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Booking Status</span>
                      <span className={`font-medium ${getStatusColor(selectedBooking.status)} px-2.5 py-0.5 rounded-full text-xs`}>
                        {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Updated</span>
                      <span className="font-medium">{formatDate(selectedBooking.updatedAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Booking ID</span>
                      <span className="font-medium font-mono">
                        {selectedBooking._id.substring(selectedBooking._id.length - 8).toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes and Actions */}
              <div className="border rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <FileText size={20} className="text-gray-600" />
                  <h4 className="font-bold text-gray-800">Notes & Actions</h4>
                </div>
                <div className="space-y-4">
                  <textarea
                    placeholder="Add notes about this booking..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                  <div className="flex flex-wrap gap-3">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                      Send Reminder
                    </button>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                      Confirm Booking
                    </button>
                    <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition">
                      Reschedule
                    </button>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                      Cancel Booking
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t p-6 flex justify-end gap-3">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Close
              </button>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;