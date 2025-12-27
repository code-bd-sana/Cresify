'use client'
import { useGetProviderBookingsQuery, useGetUserBookingsQuery, useUpdateStatusMutation } from '@/feature/provider/ProviderApi';
import { useSession } from 'next-auth/react';
import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  User,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  Eye,
  RefreshCw,
} from 'lucide-react';

const Bookingpage = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [localBookings, setLocalBookings] = useState([]);
  
  // Calculate skip for pagination
  const skip = (currentPage - 1) * limit;
  
  const { data: bookingsData, isLoading, isError, refetch } = useGetProviderBookingsQuery(
    userId ? { id: userId, skip, limit } : { id: '', skip: 0, limit: 10 },
    { skip: !userId } // Skip query if no userId
  );

  const [updateStatus, { isLoading: isUpdateLoading }] = useUpdateStatusMutation();

console.log(bookingsData, 'booking data tomi aso kase aso');

  
  // Update local bookings when data changes
  useEffect(() => {
    if (bookingsData?.data?.bookings) {
      setLocalBookings(bookingsData.data.bookings);
    }
  }, [bookingsData]);

  const bookings = localBookings;
  const totalBookings = bookingsData?.data?.total || 0;
  const totalPages = Math.ceil(totalBookings / limit);

  // Handle status update
  const handleStatusUpdate = async (bookingId, newStatus) => {
    if (isUpdateLoading) return; // Prevent multiple updates
    try {
     const result =  await updateStatus({ id: bookingId, status: newStatus }).unwrap();
        console.log('Update result:', result);
        
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
 
    
    // Update local state immediately for better UX
    setLocalBookings(prev =>
      prev.map(booking =>
        booking._id === bookingId
          ? { ...booking, status: newStatus }
          : booking
      )
    );
    
    // In a real app, you would dispatch an update action here
    // dispatch(updateBookingStatus({ bookingId, status: newStatus }));
    
    alert(`Status updated for booking ${bookingId.slice(-8)} to ${newStatus}`);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format time
  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    // Convert 24-hour to 12-hour format
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        color: '#F59E0B',
        bg: '#FEF3C7',
        icon: <ClockIcon className="w-3 h-3" />
      },
      accept: {
        color: '#10B981',
        bg: '#D1FAE5',
        icon: <CheckCircle className="w-3 h-3" />
      },
      reject: {
        color: '#EF4444',
        bg: '#FEE2E2',
        icon: <XCircle className="w-3 h-3" />
      },
      completed: {
        color: '#3B82F6',
        bg: '#DBEAFE',
        icon: <CheckCircle className="w-3 h-3" />
      },
      cancelled: {
        color: '#6B7280',
        bg: '#F3F4F6',
        icon: <XCircle className="w-3 h-3" />
      }
    };

    const config = statusConfig[status?.toLowerCase()] || { 
      color: '#6B7280', 
      bg: '#F3F4F6', 
      icon: <ClockIcon className="w-3 h-3" /> 
    };
    
    return (
      <span 
        className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
        style={{ 
          backgroundColor: config.bg,
          color: config.color
        }}
      >
        {config.icon}
        {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown'}
      </span>
    );
  };

  // Get payment status badge
  const getPaymentBadge = (status) => {
    const isCompleted = status === 'completed';
    
    return (
      <span 
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          isCompleted 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}
      >
        {isCompleted ? <CheckCircle className="w-3 h-3 mr-1" /> : <ClockIcon className="w-3 h-3 mr-1" />}
        {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown'}
      </span>
    );
  };

  // Filter bookings locally (client-side)
  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    if (!searchQuery) return matchesStatus;
    
    const searchLower = searchQuery.toLowerCase();
    return matchesStatus && (
      booking._id?.toLowerCase().includes(searchLower) ||
      (booking.customer?.fullName || '').toLowerCase().includes(searchLower) ||
      (booking.provider?.serviceName || '').toLowerCase().includes(searchLower) ||
      booking.paymentMethod?.toLowerCase().includes(searchLower)
    );
  });

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll to top when changing pages
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle limit change
  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setCurrentPage(1); // Reset to first page when changing limit
  };

  // Generate pagination buttons
  const getPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 5;
    
    if (totalPages <= maxButtons) {
      // Show all pages if total pages is less than max
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(i);
      }
    } else {
      // Always show first page
      buttons.push(1);
      
      // Calculate start and end of pagination range
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if we're near the start
      if (currentPage <= 3) {
        start = 2;
        end = 4;
      }
      
      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
        end = totalPages - 1;
      }
      
      // Add ellipsis after first page if needed
      if (start > 2) {
        buttons.push('...');
      }
      
      // Add middle pages
      for (let i = start; i <= end; i++) {
        buttons.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        buttons.push('...');
      }
      
      // Always show last page
      buttons.push(totalPages);
    }
    
    return buttons;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="bg-white rounded-lg shadow">
              <div className="h-12 bg-gray-200 rounded-t-lg"></div>
              {[...Array(limit)].map((_, i) => (
                <div key={i} className="h-16 border-b border-gray-200"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">Error loading bookings. Please try again.</p>
            <button 
              onClick={() => refetch()}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Bookings</h1>
          <p className="text-gray-600 mt-1">Manage and track all your bookings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{totalBookings}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {bookings.filter(b => b.status === 'pending').length}
                </p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <ClockIcon className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Accepted</p>
                <p className="text-2xl font-bold text-green-600">
                  {bookings.filter(b => b.status === 'accept').length}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-purple-600">
                  ${bookings.reduce((sum, booking) => sum + (booking.provider?.hourlyRate || 0), 0).toFixed(2)}
                </p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <CreditCard className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              {/* Search */}
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter className="text-gray-400 w-4 h-4" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="accept">Accepted</option>
                  <option value="reject">Rejected</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Items Per Page */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Show:</span>
                <select
                  value={limit}
                  onChange={(e) => handleLimitChange(Number(e.target.value))}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </div>
            </div>

            {/* Refresh Button */}
            <button
              onClick={() => {
                refetch();
                setCurrentPage(1); // Reset to first page on refresh
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Provider
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                   Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <Calendar className="w-12 h-12 text-gray-400 mb-3" />
                        <p className="text-lg font-medium text-gray-900">No bookings found</p>
                        <p className="text-gray-600 mt-1">
                          {bookings.length === 0 ? 
                            'You have no bookings yet' : 
                            'Try adjusting your filters or search'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          #{booking._id?.slice(-8) || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(booking.createdAt)}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="ml-3">
                           <div className="text-sm text-gray-900 font-medium">
                          {booking.provider?.email || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {booking.provider?.fullName || 'N/A'} 
                        </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 font-medium">
                          {booking.customer?.email || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {booking.customer?.fullName || 'N/A'} 
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(booking.dateId?.workingDate)}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(booking.timeSlot?.startTime)} - {formatTime(booking.timeSlot?.endTime)}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          {getPaymentBadge(booking.paymentStatus)}
                          <div className="text-xs text-gray-500">
                            {booking.paymentMethod?.charAt(0)?.toUpperCase() + booking.paymentMethod?.slice(1) || 'N/A'}
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(booking.status)}
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {/* View Details */}
                          <button
                            onClick={() => console.log('View details:', booking._id)}
                            className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          {/* Status Update Dropdown */}
                          <div className="relative">
                            <select
                              onChange={(e) => handleStatusUpdate(booking._id, e.target.value)}
                              value=""
                              className="appearance-none bg-transparent border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                            >
                              <option value="" disabled>Update Status</option>
                              <option value="pending">Set to Pending</option>
                              <option value="accept">Set to Accepted</option>
                              <option value="reject">Set to Rejected</option>
                              <option value="completed">Set to Completed</option>
                              <option value="cancelled">Set to Cancelled</option>
                            </select>
                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 0 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{Math.min((currentPage - 1) * limit + 1, totalBookings)}</span> to{' '}
                  <span className="font-medium">{Math.min(currentPage * limit, totalBookings)}</span> of{' '}
                  <span className="font-medium">{totalBookings}</span> bookings
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-2 rounded border flex items-center ${
                      currentPage === 1
                        ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                        : 'text-gray-700 border-gray-300 hover:bg-gray-50 transition-colors'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {getPaginationButtons().map((button, index) => (
                      button === '...' ? (
                        <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
                          ...
                        </span>
                      ) : (
                        <button
                          key={button}
                          onClick={() => handlePageChange(button)}
                          className={`px-3 py-2 rounded min-w-[40px] ${
                            currentPage === button
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors'
                          }`}
                        >
                          {button}
                        </button>
                      )
                    ))}
                  </div>
                  
                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-2 rounded border flex items-center ${
                      currentPage === totalPages
                        ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                        : 'text-gray-700 border-gray-300 hover:bg-gray-50 transition-colors'
                    }`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Summary Info */}
        {bookings.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Booking Status Distribution</h3>
              <div className="space-y-2">
                {['pending', 'accept', 'reject', 'completed', 'cancelled'].map((status) => {
                  const count = bookings.filter(b => b.status === status).length;
                  const percentage = bookings.length > 0 ? (count / bookings.length) * 100 : 0;
                  
                  return (
                    <div key={status} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 capitalize">{status}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: status === 'pending' ? '#F59E0B' : 
                                            status === 'accept' ? '#10B981' :
                                            status === 'reject' ? '#EF4444' :
                                            status === 'completed' ? '#3B82F6' : '#6B7280'
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Payment Status</h3>
              <div className="space-y-2">
                {['processing', 'completed'].map((status) => {
                  const count = bookings.filter(b => b.paymentStatus === status).length;
                  const percentage = bookings.length > 0 ? (count / bookings.length) * 100 : 0;
                  
                  return (
                    <div key={status} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 capitalize">{status}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: status === 'completed' ? '#10B981' : '#F59E0B'
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Recent Activity</h3>
              <div className="space-y-3">
                {bookings.slice(0, 3).map((booking) => (
                  <div key={booking._id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        #{booking._id?.slice(-8) || 'N/A'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(booking.dateId?.workingDate)}
                      </p>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookingpage;