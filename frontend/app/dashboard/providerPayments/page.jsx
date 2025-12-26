'use client';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useGetProviderBookingsQuery } from '@/feature/provider/ProviderApi';
import {
  Calendar,
  Clock,
  DollarSign,
  Percent,
  TrendingUp,
  Download,
  Filter,
  Search,
  User,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Receipt,
  AlertCircle,
  BarChart3,
} from 'lucide-react';

const PaymentHistory = () => {
  const { data: session } = useSession();
  const providerId = session?.user?.id;
  
  // State for pagination and filtering
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  
  // Calculate skip for pagination
  const skip = (currentPage - 1) * limit;
  
  const { data: bookingsData, isLoading, isError, refetch } = useGetProviderBookingsQuery(
    providerId ? { id: providerId, skip, limit } : { id: '', skip: 0, limit: 10 },
    { skip: !providerId }
  );

  // Debug: log the data structure
  useEffect(() => {
    if (bookingsData?.data?.bookings) {
      console.log('Raw bookings data:', bookingsData.data.bookings);
      console.log('Sample booking:', bookingsData.data.bookings[0]);
    }
  }, [bookingsData]);

  // Constants for commission and tax
  const COMMISSION_RATE = 0.10; // 10% commission
  const TAX_RATE = 0.19; // 19% tax on commission
  
  const bookings = bookingsData?.data?.bookings || [];
  const totalBookings = bookingsData?.data?.total || 0;
  const totalPages = Math.ceil(totalBookings / limit);

  // Filter to only show accepted bookings
  const acceptedBookings = bookings.filter(booking => booking.status === 'accept');
  
  // Helper function to convert duration string to hours
  const parseDurationToHours = (duration) => {
    if (!duration) return 1; // Default to 1 hour if not specified
    
    // If duration is a number, return it directly
    if (typeof duration === 'number') return duration;
    
    // If duration is a string like "60m", "1h", "2.5h", etc.
    const durationStr = duration.toString().toLowerCase();
    
    // Check for minutes format like "60m"
    if (durationStr.includes('m')) {
      const minutes = parseFloat(durationStr.replace('m', '').trim());
      return minutes / 60; // Convert minutes to hours
    }
    
    // Check for hours format like "2h" or "1.5h"
    if (durationStr.includes('h')) {
      return parseFloat(durationStr.replace('h', '').trim());
    }
    
    // If it's just a number, assume it's in minutes if less than 10
    const num = parseFloat(durationStr);
    if (!isNaN(num)) {
      return num < 10 ? num : num / 60; // If < 10, assume hours, else assume minutes
    }
    
    return 1; // Default to 1 hour
  };

  // Calculate payment breakdown for each booking
  const calculatePaymentBreakdown = (booking) => {
    try {
      const hourlyRate = parseFloat(booking.provider?.hourlyRate) || 0;
      
      // Get duration from timeSlot or dateId
      let durationInHours = 1; // Default
      
      // Check timeSlot first
      if (booking.timeSlot?.duration) {
        durationInHours = parseDurationToHours(booking.timeSlot.duration);
      } 
      // Fallback to dateId duration
      else if (booking.dateId?.duration) {
        durationInHours = parseDurationToHours(booking.dateId.duration);
      }
      
      console.log('Calculation for booking:', booking._id);
      console.log('Hourly rate:', hourlyRate);
      console.log('Duration (hours):', durationInHours);
      
      // Calculate total earned
      const totalEarned = hourlyRate * durationInHours;
      
      // Calculate commission (10% of total)
      const commission = totalEarned * COMMISSION_RATE;
      
      // Calculate tax on commission (19% of commission)
      const taxOnCommission = commission * TAX_RATE;
      
      // Calculate net payout to provider
      const netPayout = totalEarned - commission - taxOnCommission;
      
      return {
        totalEarned: parseFloat(totalEarned.toFixed(2)),
        commission: parseFloat(commission.toFixed(2)),
        taxOnCommission: parseFloat(taxOnCommission.toFixed(2)),
        netPayout: parseFloat(netPayout.toFixed(2)),
        serviceDuration: parseFloat(durationInHours.toFixed(2)),
        hourlyRate: parseFloat(hourlyRate.toFixed(2)),
        paymentStatus: booking.paymentStatus || 'processing',
        breakdownDetails: {
          hourlyRate,
          durationInHours,
          calculation: `$${hourlyRate} × ${durationInHours} hours = $${totalEarned.toFixed(2)}`,
        }
      };
    } catch (error) {
      console.error('Error calculating payment breakdown:', error);
      return {
        totalEarned: 0,
        commission: 0,
        taxOnCommission: 0,
        netPayout: 0,
        serviceDuration: 0,
        hourlyRate: 0,
        paymentStatus: 'error',
        breakdownDetails: {
          hourlyRate: 0,
          durationInHours: 0,
          calculation: 'Calculation error',
        }
      };
    }
  };

  // Calculate totals for all accepted bookings
  const calculateTotals = () => {
    const totals = acceptedBookings.reduce((acc, booking) => {
      const breakdown = calculatePaymentBreakdown(booking);
      
      return {
        totalEarned: acc.totalEarned + breakdown.totalEarned,
        totalCommission: acc.totalCommission + breakdown.commission,
        totalTax: acc.totalTax + breakdown.taxOnCommission,
        totalNetPayout: acc.totalNetPayout + breakdown.netPayout,
        count: acc.count + 1,
      };
    }, { totalEarned: 0, totalCommission: 0, totalTax: 0, totalNetPayout: 0, count: 0 });

    return {
      ...totals,
      totalEarned: parseFloat(totals.totalEarned.toFixed(2)),
      totalCommission: parseFloat(totals.totalCommission.toFixed(2)),
      totalTax: parseFloat(totals.totalTax.toFixed(2)),
      totalNetPayout: parseFloat(totals.totalNetPayout.toFixed(2)),
    };
  };

  const totals = calculateTotals();

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Format time
  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    } catch (error) {
      return timeString;
    }
  };

  // Filter bookings based on search and date
  const filteredBookings = acceptedBookings.filter(booking => {
    const matchesSearch = !searchQuery || 
      booking._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (booking.customer?.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (booking.provider?.serviceName || '').toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (dateFilter === 'all') return true;
    
    try {
      const bookingDate = new Date(booking.dateId?.workingDate || booking.createdAt);
      const now = new Date();
      
      switch (dateFilter) {
        case 'today':
          return bookingDate.toDateString() === now.toDateString();
        case 'week':
          const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return bookingDate >= oneWeekAgo;
        case 'month':
          const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return bookingDate >= oneMonthAgo;
        case 'year':
          const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          return bookingDate >= oneYearAgo;
        default:
          return true;
      }
    } catch (error) {
      return true;
    }
  });

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle export to CSV
  const handleExportCSV = () => {
    const csvData = [
      ['Booking ID', 'Customer', 'Service', 'Date', 'Time', 'Hourly Rate', 'Duration', 'Total Earned', 'Commission (10%)', 'Tax on Commission (19%)', 'Net Payout', 'Payment Status'],
      ...filteredBookings.map(booking => {
        const breakdown = calculatePaymentBreakdown(booking);
        return [
          `#${booking._id?.slice(-8) || ''}`,
          booking.customer?.fullName || '',
          booking.provider?.serviceName || '',
          formatDate(booking.dateId?.workingDate),
          `${formatTime(booking.timeSlot?.startTime)} - ${formatTime(booking.timeSlot?.endTime)}`,
          `$${breakdown.hourlyRate}`,
          `${breakdown.serviceDuration} hour${breakdown.serviceDuration !== 1 ? 's' : ''}`,
          `$${breakdown.totalEarned}`,
          `$${breakdown.commission}`,
          `$${breakdown.taxOnCommission}`,
          `$${breakdown.netPayout}`,
          breakdown.paymentStatus,
        ];
      }),
      [],
      ['Total', '', '', '', '', '', '', `$${totals.totalEarned}`, `$${totals.totalCommission}`, `$${totals.totalTax}`, `$${totals.totalNetPayout}`, ''],
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payment_history_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="bg-white rounded-lg shadow">
              <div className="h-12 bg-gray-200 rounded-t-lg"></div>
              {[...Array(5)].map((_, i) => (
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
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
              <p className="text-red-700">Error loading payment history. Please try again.</p>
            </div>
            <button 
              onClick={() => refetch()}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Payment History</h1>
          <p className="text-gray-600 mt-1">Track your earnings, commissions, and tax breakdown</p>
          
          {/* Debug Info - Remove in production */}
          <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
            <p className="font-medium">Data Status:</p>
            <p>Total Bookings: {bookings.length}</p>
            <p>Accepted Bookings: {acceptedBookings.length}</p>
            <p>Provider Hourly Rate: ${acceptedBookings[0]?.provider?.hourlyRate || 'N/A'}</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Total Earnings */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">${totals.totalEarned}</p>
                <p className="text-xs text-gray-500 mt-1">{totals.count} accepted bookings</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          {/* Platform Commission */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Platform Commission</p>
                <p className="text-2xl font-bold text-red-600">${totals.totalCommission}</p>
                <p className="text-xs text-gray-500 mt-1">10% of earnings</p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <Percent className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
          
          {/* Tax on Commission */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tax on Commission</p>
                <p className="text-2xl font-bold text-yellow-600">${totals.totalTax}</p>
                <p className="text-xs text-gray-500 mt-1">19% of commission</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Receipt className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          
          {/* Net Payout */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Net Payout</p>
                <p className="text-2xl font-bold text-green-600">${totals.totalNetPayout}</p>
                <p className="text-xs text-gray-500 mt-1">Amount you receive</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Commission & Tax Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-0.5">
              <BarChart3 className="w-5 h-5 text-blue-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Payment Calculation Formula</h3>
              <div className="mt-2 text-sm text-blue-700 space-y-1">
                <p>• <span className="font-semibold">Total Earnings</span> = Hourly Rate × Service Duration</p>
                <p>• <span className="font-semibold">Platform Commission</span> = Total Earnings × 10%</p>
                <p>• <span className="font-semibold">Tax on Commission</span> = Platform Commission × 19%</p>
                <p>• <span className="font-semibold">Net Payout</span> = Total Earnings - Commission - Tax</p>
                <p className="mt-2 text-xs text-blue-600 bg-blue-100 p-2 rounded">
                  Example: $100/hour × 2 hours = $200 → $20 commission → $3.80 tax → $176.20 net payout
                </p>
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

              {/* Date Filter */}
              <div className="flex items-center gap-2">
                <Calendar className="text-gray-400 w-4 h-4" />
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>
              </div>

              {/* Items Per Page */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Show:</span>
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
            </div>

            {/* Export Button */}
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
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
                    Booking Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Earnings Breakdown
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <CreditCard className="w-12 h-12 text-gray-400 mb-3" />
                        <p className="text-lg font-medium text-gray-900">No payment records found</p>
                        <p className="text-gray-600 mt-1">
                          {acceptedBookings.length === 0 
                            ? 'No accepted bookings yet' 
                            : 'Try adjusting your filters'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => {
                    const breakdown = calculatePaymentBreakdown(booking);
                    
                    return (
                      <tr key={booking._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {booking.customer?.fullName || 'N/A'}
                              </div>
                              <div className="text-xs text-gray-500">
                                #{booking._id?.slice(-8) || 'N/A'}
                              </div>
                            </div>
                          </div>
                          <div className="mt-2 text-sm text-gray-900">
                            {formatDate(booking.dateId?.workingDate)}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTime(booking.timeSlot?.startTime)} - {formatTime(booking.timeSlot?.endTime)}
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {booking.provider?.serviceName || 'N/A'}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Hourly Rate: <span className="font-semibold">${breakdown.hourlyRate}/hr</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Duration: <span className="font-semibold">{breakdown.serviceDuration} hour{breakdown.serviceDuration !== 1 ? 's' : ''}</span>
                            {booking.timeSlot?.duration && (
                              <span className="text-gray-400 ml-1">({booking.timeSlot.duration})</span>
                            )}
                          </div>
                          <div className="mt-1 text-xs text-blue-600">
                            {breakdown.breakdownDetails.calculation}
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            {/* Total Earned */}
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Total Earned:</span>
                              <span className="font-medium text-gray-900">${breakdown.totalEarned}</span>
                            </div>
                            
                            {/* Commission */}
                            <div className="flex justify-between text-sm">
                              <div className="flex items-center gap-1 text-gray-600">
                                <Percent className="w-3 h-3" />
                                <span>Commission (10%):</span>
                              </div>
                              <span className="font-medium text-red-600">-${breakdown.commission}</span>
                            </div>
                            
                            {/* Tax on Commission */}
                            <div className="flex justify-between text-sm">
                              <div className="flex items-center gap-1 text-gray-600">
                                <Receipt className="w-3 h-3" />
                                <span>Tax on Commission (19%):</span>
                              </div>
                              <span className="font-medium text-yellow-600">-${breakdown.taxOnCommission}</span>
                            </div>
                            
                            {/* Net Payout */}
                            <div className="flex justify-between text-sm pt-1 border-t border-gray-100">
                              <span className="font-medium text-gray-700">Net Payout:</span>
                              <span className="font-bold text-green-600">${breakdown.netPayout}</span>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col items-start gap-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              breakdown.paymentStatus === 'completed' 
                                ? 'bg-green-100 text-green-800' 
                                : breakdown.paymentStatus === 'processing'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {breakdown.paymentStatus === 'completed' 
                                ? <CheckCircle className="w-3 h-3 mr-1" />
                                : <Clock className="w-3 h-3 mr-1" />
                              }
                              {breakdown.paymentStatus?.charAt(0).toUpperCase() + breakdown.paymentStatus?.slice(1) || 'Processing'}
                            </span>
                            
                            <div className="text-xs text-gray-500">
                              {booking.paymentMethod?.charAt(0)?.toUpperCase() + booking.paymentMethod?.slice(1) || 'N/A'}
                            </div>
                            
                            <button
                              onClick={() => console.log('View receipt for:', booking._id, 'Breakdown:', breakdown)}
                              className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              View Details
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
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
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i;
                      } else {
                        pageNumber = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`px-3 py-2 rounded min-w-[40px] ${
                            currentPage === pageNumber
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                    
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <>
                        <span className="px-1">...</span>
                        <button
                          onClick={() => handlePageChange(totalPages)}
                          className="px-3 py-2 rounded text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors"
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
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

        {/* Summary Section */}
        {filteredBookings.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Accepted Bookings</div>
                <div className="text-2xl font-bold text-gray-900">{acceptedBookings.length}</div>
                <div className="text-xs text-gray-500 mt-1">Total completed services</div>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-600">Average Earnings per Booking</div>
                <div className="text-2xl font-bold text-blue-700">
                  ${acceptedBookings.length > 0 ? (totals.totalEarned / acceptedBookings.length).toFixed(2) : '0.00'}
                </div>
                <div className="text-xs text-blue-500 mt-1">Mean value per service</div>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-sm text-green-600">Average Net Payout</div>
                <div className="text-2xl font-bold text-green-700">
                  ${acceptedBookings.length > 0 ? (totals.totalNetPayout / acceptedBookings.length).toFixed(2) : '0.00'}
                </div>
                <div className="text-xs text-green-500 mt-1">After commission & tax</div>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-sm text-purple-600">Total Fees</div>
                <div className="text-2xl font-bold text-purple-700">
                  ${(totals.totalCommission + totals.totalTax).toFixed(2)}
                </div>
                <div className="text-xs text-purple-500 mt-1">Commission + Tax</div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Payment Distribution</h4>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Your Net Payout</span>
                    <span>${totals.totalNetPayout} ({totals.totalEarned > 0 ? ((totals.totalNetPayout / totals.totalEarned) * 100).toFixed(1) : '0'}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-green-600 transition-all duration-300"
                      style={{ width: `${totals.totalEarned > 0 ? (totals.totalNetPayout / totals.totalEarned) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Platform Commission</span>
                    <span>${totals.totalCommission} ({totals.totalEarned > 0 ? ((totals.totalCommission / totals.totalEarned) * 100).toFixed(1) : '0'}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-red-600 transition-all duration-300"
                      style={{ width: `${totals.totalEarned > 0 ? (totals.totalCommission / totals.totalEarned) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Tax on Commission</span>
                    <span>${totals.totalTax} ({totals.totalEarned > 0 ? ((totals.totalTax / totals.totalEarned) * 100).toFixed(1) : '0'}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-yellow-600 transition-all duration-300"
                      style={{ width: `${totals.totalEarned > 0 ? (totals.totalTax / totals.totalEarned) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;