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
  Loader2,
} from 'lucide-react';

const PaymentHistory = () => {
  const { data: session } = useSession();
  const providerId = session?.user?.id;
  
  // State for pagination and filtering
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [paymentBookings, setPaymentBookings] = useState([]);
  const [paymentTotals, setPaymentTotals] = useState(null);
  
  // Calculate skip for pagination
  const skip = (currentPage - 1) * limit;
  
  const { data: bookingsData, isLoading, isError, refetch } = useGetProviderBookingsQuery(
    providerId ? { id: providerId, skip, limit } : { id: '', skip: 0, limit: 10 },
    { skip: !providerId }
  );

  console.log('Payment Booking Data:', bookingsData);

  // Process booking data when it loads
  useEffect(() => {
    if (bookingsData?.data?.bookings) {
      console.log('Processing bookings:', bookingsData.data.bookings);
      
      // Filter completed/accepted bookings
      const completedBookings = bookingsData.data.bookings.filter(booking => 
        booking.status === 'completed' || booking.status === 'accept'
      );
      
      console.log('Completed bookings:', completedBookings);
      
      // Process each booking to add payment information
      const processedBookings = completedBookings.map(booking => {
        const paymentInfo = calculatePaymentForBooking(booking);
        return {
          ...booking,
          paymentInfo,
          isPaid: booking.paymentStatus === 'completed',
          paymentDate: booking.updatedAt || booking.createdAt,
        };
      });
      
      setPaymentBookings(processedBookings);
      
      // Calculate totals
      const totals = calculatePaymentTotals(processedBookings);
      setPaymentTotals(totals);
      
      console.log('Processed bookings:', processedBookings);
      console.log('Payment totals:', totals);
    }
  }, [bookingsData]);

  // Default hourly rate if not provided
  const DEFAULT_HOURLY_RATE = 50;
  
  // Constants for commission and tax
  const COMMISSION_RATE = 0.10; // 10% commission
  const TAX_RATE = 0.19; // 19% tax on commission
  
  // Helper function to get hourly rate
  const getHourlyRate = (booking) => {
    // Try to get hourly rate from provider
    if (booking.provider?.hourlyRate) {
      return parseFloat(booking.provider.hourlyRate);
    }
    
    // Try to get from service details
    if (booking.provider?.serviceDetails?.hourlyRate) {
      return parseFloat(booking.provider.serviceDetails.hourlyRate);
    }
    
    // Check booking itself
    if (booking.hourlyRate) {
      return parseFloat(booking.hourlyRate);
    }
    
    // Default rate
    return DEFAULT_HOURLY_RATE;
  };

  // Calculate payment for a single booking
  const calculatePaymentForBooking = (booking) => {
    try {
      console.log('Calculating payment for booking:', booking._id, booking);
      
      const hourlyRate = getHourlyRate(booking);
      
      // Get duration - check multiple possible locations
      let durationInHours = 1; // Default 1 hour
      
      // Check timeSlot first
      if (booking.timeSlot?.duration) {
        durationInHours = parseDurationToHours(booking.timeSlot.duration);
      } 
      // Check dateId
      else if (booking.dateId?.duration) {
        durationInHours = parseDurationToHours(booking.dateId.duration);
      }
      // Check booking directly
      else if (booking.duration) {
        durationInHours = parseDurationToHours(booking.duration);
      }
      
      console.log('Calculation details:', {
        hourlyRate,
        durationInHours,
        timeSlot: booking.timeSlot,
        dateId: booking.dateId
      });
      
      // Calculate total earned
      const totalEarned = hourlyRate * durationInHours;
      
      // Calculate commission (10% of total)
      const commission = totalEarned * COMMISSION_RATE;
      
      // Calculate tax on commission (19% of commission)
      const taxOnCommission = commission * TAX_RATE;
      
      // Calculate net payout to provider
      const netPayout = totalEarned - commission - taxOnCommission;
      
      return {
        hourlyRate: parseFloat(hourlyRate.toFixed(2)),
        durationHours: parseFloat(durationInHours.toFixed(2)),
        totalEarned: parseFloat(totalEarned.toFixed(2)),
        commission: parseFloat(commission.toFixed(2)),
        taxOnCommission: parseFloat(taxOnCommission.toFixed(2)),
        netPayout: parseFloat(netPayout.toFixed(2)),
        paymentStatus: booking.paymentStatus || 'processing',
        calculation: `$${hourlyRate.toFixed(2)} × ${durationInHours.toFixed(2)} hours = $${totalEarned.toFixed(2)}`,
      };
    } catch (error) {
      console.error('Error calculating payment:', error);
      return {
        hourlyRate: DEFAULT_HOURLY_RATE,
        durationHours: 1,
        totalEarned: DEFAULT_HOURLY_RATE,
        commission: (DEFAULT_HOURLY_RATE * COMMISSION_RATE).toFixed(2),
        taxOnCommission: (DEFAULT_HOURLY_RATE * COMMISSION_RATE * TAX_RATE).toFixed(2),
        netPayout: (DEFAULT_HOURLY_RATE * (1 - COMMISSION_RATE - (COMMISSION_RATE * TAX_RATE))).toFixed(2),
        paymentStatus: 'error',
        calculation: 'Default calculation',
      };
    }
  };

  // Calculate total payments
  const calculatePaymentTotals = (bookings) => {
    if (!bookings || bookings.length === 0) {
      return {
        totalBookings: 0,
        totalEarned: 0,
        totalCommission: 0,
        totalTax: 0,
        totalNetPayout: 0,
        completedPayments: 0,
        pendingPayments: 0,
      };
    }

    const totals = bookings.reduce((acc, booking) => {
      const payment = booking.paymentInfo || calculatePaymentForBooking(booking);
      
      return {
        totalEarned: acc.totalEarned + payment.totalEarned,
        totalCommission: acc.totalCommission + payment.commission,
        totalTax: acc.totalTax + payment.taxOnCommission,
        totalNetPayout: acc.totalNetPayout + payment.netPayout,
        totalBookings: acc.totalBookings + 1,
        completedPayments: acc.completedPayments + (payment.paymentStatus === 'completed' ? 1 : 0),
        pendingPayments: acc.pendingPayments + (payment.paymentStatus !== 'completed' ? 1 : 0),
      };
    }, {
      totalEarned: 0,
      totalCommission: 0,
      totalTax: 0,
      totalNetPayout: 0,
      totalBookings: 0,
      completedPayments: 0,
      pendingPayments: 0,
    });

    return {
      ...totals,
      totalEarned: parseFloat(totals.totalEarned.toFixed(2)),
      totalCommission: parseFloat(totals.totalCommission.toFixed(2)),
      totalTax: parseFloat(totals.totalTax.toFixed(2)),
      totalNetPayout: parseFloat(totals.totalNetPayout.toFixed(2)),
      averagePerBooking: totals.totalBookings > 0 
        ? parseFloat((totals.totalNetPayout / totals.totalBookings).toFixed(2))
        : 0,
    };
  };

  // Helper function to convert duration string to hours
  const parseDurationToHours = (duration) => {
    if (!duration) return 1;
    
    // If duration is a number, return it directly
    if (typeof duration === 'number') return duration;
    
    const durationStr = duration.toString().toLowerCase().trim();
    
    // Handle "60m", "1.5h", etc.
    if (durationStr.includes('m')) {
      const minutes = parseFloat(durationStr.replace('m', '').trim());
      return !isNaN(minutes) ? minutes / 60 : 1;
    }
    
    if (durationStr.includes('h')) {
      const hours = parseFloat(durationStr.replace('h', '').trim());
      return !isNaN(hours) ? hours : 1;
    }
    
    // Try to parse as number
    const num = parseFloat(durationStr);
    return !isNaN(num) ? (num < 10 ? num : num / 60) : 1;
  };

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
  const filteredBookings = paymentBookings.filter(booking => {
    const matchesSearch = !searchQuery || 
      booking._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (booking.customer?.fullName || booking.customer?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
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
      console.error('Date filtering error:', error);
      return true;
    }
  });

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= Math.ceil(paymentBookings.length / limit)) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle export to CSV
  const handleExportCSV = () => {
    const csvData = [
      ['Booking ID', 'Customer', 'Service', 'Date', 'Time', 'Hourly Rate', 'Duration', 'Total Earned', 'Commission (10%)', 'Tax on Commission (19%)', 'Net Payout', 'Payment Status'],
      ...filteredBookings.map(booking => {
        const payment = booking.paymentInfo || calculatePaymentForBooking(booking);
        return [
          `#${booking._id?.slice(-8) || ''}`,
          booking.customer?.fullName || booking.customer?.name || '',
          booking.provider?.serviceName || 'Service',
          formatDate(booking.dateId?.workingDate || booking.createdAt),
          booking.timeSlot ? `${formatTime(booking.timeSlot.startTime)} - ${formatTime(booking.timeSlot.endTime)}` : 'N/A',
          `$${payment.hourlyRate}`,
          `${payment.durationHours} hour${payment.durationHours !== 1 ? 's' : ''}`,
          `$${payment.totalEarned}`,
          `$${payment.commission}`,
          `$${payment.taxOnCommission}`,
          `$${payment.netPayout}`,
          payment.paymentStatus,
        ];
      }),
      [],
      ['Total', '', '', '', '', '', '', 
       `$${paymentTotals?.totalEarned || 0}`, 
       `$${paymentTotals?.totalCommission || 0}`, 
       `$${paymentTotals?.totalTax || 0}`, 
       `$${paymentTotals?.totalNetPayout || 0}`, 
       `${paymentTotals?.completedPayments || 0} completed, ${paymentTotals?.pendingPayments || 0} pending`],
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payment_history_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Calculate pagination
  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedBookings = filteredBookings.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredBookings.length / limit);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading payment history...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <AlertCircle className="w-6 h-6 text-red-400 mr-3" />
              <h3 className="text-lg font-semibold text-red-800">Error Loading Data</h3>
            </div>
            <p className="text-red-700 mb-4">Failed to load payment history. Please try again.</p>
            <button 
              onClick={() => refetch()}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Retry Loading
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
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Payment History</h1>
              <p className="text-gray-600 mt-1">Track your earnings, commissions, and tax breakdown</p>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                {paymentBookings.length} completed bookings
              </span>
              <button
                onClick={() => refetch()}
                className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                Refresh Data
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Earnings */}
          <div className="bg-white rounded-xl shadow p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  ${paymentTotals?.totalEarned?.toLocaleString() || '0.00'}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                    {paymentTotals?.totalBookings || 0} bookings
                  </div>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          {/* Platform Commission */}
          <div className="bg-white rounded-xl shadow p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Platform Commission</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  ${paymentTotals?.totalCommission?.toLocaleString() || '0.00'}
                </p>
                <p className="text-xs text-gray-500 mt-2">10% of total earnings</p>
              </div>
              <div className="p-3 bg-red-100 rounded-xl">
                <Percent className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
          
          {/* Tax on Commission */}
          <div className="bg-white rounded-xl shadow p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Tax on Commission</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">
                  ${paymentTotals?.totalTax?.toLocaleString() || '0.00'}
                </p>
                <p className="text-xs text-gray-500 mt-2">19% of commission</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Receipt className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          
          {/* Net Payout */}
          <div className="bg-white rounded-xl shadow p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Net Payout</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  ${paymentTotals?.totalNetPayout?.toLocaleString() || '0.00'}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                    ${paymentTotals?.averagePerBooking || '0.00'} avg/booking
                  </div>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Calculation Info */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 mb-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <BarChart3 className="w-6 h-6 text-blue-600 mt-1" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">How Your Earnings Are Calculated</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-700">Hourly Rate × Duration</p>
                  <p className="text-xs text-gray-600 mt-1">Your rate multiplied by service hours</p>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-sm font-medium text-red-600">-10% Platform Fee</p>
                  <p className="text-xs text-gray-600 mt-1">Service platform commission</p>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-sm font-medium text-yellow-600">-19% Tax on Fee</p>
                  <p className="text-xs text-gray-600 mt-1">Tax applied to platform commission</p>
                </div>
                <div className="bg-white p-3 rounded-lg border-2 border-green-200">
                  <p className="text-sm font-medium text-green-600">= Your Net Earnings</p>
                  <p className="text-xs text-gray-600 mt-1">Amount deposited to your account</p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                <p className="text-sm text-blue-800 font-medium">Example Calculation:</p>
                <p className="text-sm text-blue-700 mt-1">
                  $50/hour × 2 hours = $100 → -$10 platform fee → -$1.90 tax → $88.10 net payout
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow mb-8 p-5">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
            <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
              {/* Search */}
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by booking ID, customer name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Date Filter */}
              <div className="flex items-center gap-3">
                <Calendar className="text-gray-400 w-5 h-5" />
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>
              </div>

              {/* Items Per Page */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Show:</span>
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </div>
            </div>

            {/* Export Button */}
            <button
              onClick={handleExportCSV}
              disabled={paymentBookings.length === 0}
              className={`flex items-center gap-2 px-5 py-3 rounded-lg font-medium transition-colors ${
                paymentBookings.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              <Download className="w-5 h-5" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {paymentBookings.length === 0 ? (
            <div className="p-12 text-center">
              <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Payment Records Yet</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                You don't have any completed bookings with payments yet. Once you complete services, your payment history will appear here.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => refetch()}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Check for New Bookings
                </button>
                <button
                  onClick={() => window.location.href = '/dashboard'}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="p-12 text-center">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Matching Results</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                No payment records match your search criteria. Try adjusting your filters.
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Booking Details
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Service & Duration
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Earnings Breakdown
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Payment Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {paginatedBookings.map((booking) => {
                      const payment = booking.paymentInfo || calculatePaymentForBooking(booking);
                      const isCompleted = payment.paymentStatus === 'completed';
                      
                      return (
                        <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                          {/* Booking Details */}
                          <td className="px-6 py-5">
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0">
                                <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                  <User className="h-5 w-5 text-white" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                  {booking.customer?.fullName || booking.customer?.name || 'Customer'}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  ID: #{booking._id?.slice(-8) || 'N/A'}
                                </p>
                                <div className="mt-2 space-y-1">
                                  <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <Calendar className="w-3 h-3" />
                                    {formatDate(booking.dateId?.workingDate || booking.createdAt)}
                                  </div>
                                  {booking.timeSlot && (
                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                      <Clock className="w-3 h-3" />
                                      {formatTime(booking.timeSlot.startTime)} - {formatTime(booking.timeSlot.endTime)}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          
                          {/* Service & Duration */}
                          <td className="px-6 py-5">
                            <div className="space-y-2">
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {booking.provider?.serviceName || 'Service'}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Category: {booking.provider?.serviceCategory || 'General'}
                                </p>
                              </div>
                              <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Hourly Rate:</span>
                                  <span className="font-semibold text-blue-600">${payment.hourlyRate}/hr</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Duration:</span>
                                  <span className="font-semibold">{payment.durationHours} hour{payment.durationHours !== 1 ? 's' : ''}</span>
                                </div>
                                <div className="text-xs text-gray-500 italic mt-2">
                                  {payment.calculation}
                                </div>
                              </div>
                            </div>
                          </td>
                          
                          {/* Earnings Breakdown */}
                          <td className="px-6 py-5">
                            <div className="space-y-3">
                              {/* Total Earned */}
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Total Earned:</span>
                                <span className="text-sm font-bold text-gray-900">${payment.totalEarned}</span>
                              </div>
                              
                              {/* Commission */}
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1">
                                  <Percent className="w-3 h-3 text-red-500" />
                                  <span className="text-sm text-gray-600">Commission (10%):</span>
                                </div>
                                <span className="text-sm font-medium text-red-600">-${payment.commission}</span>
                              </div>
                              
                              {/* Tax */}
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1">
                                  <Receipt className="w-3 h-3 text-yellow-500" />
                                  <span className="text-sm text-gray-600">Tax on Commission (19%):</span>
                                </div>
                                <span className="text-sm font-medium text-yellow-600">-${payment.taxOnCommission}</span>
                              </div>
                              
                              {/* Net Payout */}
                              <div className="pt-2 border-t border-gray-200">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-semibold text-gray-700">Net Payout:</span>
                                  <span className="text-lg font-bold text-green-600">${payment.netPayout}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          
                          {/* Payment Status */}
                          <td className="px-6 py-5">
                            <div className="space-y-3">
                              <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                                isCompleted
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {isCompleted ? (
                                  <CheckCircle className="w-3 h-3 mr-1.5" />
                                ) : (
                                  <Clock className="w-3 h-3 mr-1.5" />
                                )}
                                {isCompleted ? 'Paid' : 'Processing'}
                              </div>
                              
                              <div className="text-xs text-gray-600">
                                Method: {booking.paymentMethod?.toUpperCase() || 'Card'}
                              </div>
                              
                              <div className="text-xs text-gray-500">
                                {formatDate(booking.updatedAt || booking.createdAt)}
                              </div>
                              
                              {/* <button
                                onClick={() => {
                                  // Handle view details
                                  console.log('View booking details:', booking);
                                  alert(`Booking Details:\nID: ${booking._id}\nCustomer: ${booking.customer?.name}\nStatus: ${payment.paymentStatus}\nNet Payout: $${payment.netPayout}`);
                                }}
                                className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                              >
                                View Receipt
                              </button> */}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-700">
                      Showing <span className="font-semibold">{startIndex + 1}</span> to{' '}
                      <span className="font-semibold">{Math.min(endIndex, filteredBookings.length)}</span> of{' '}
                      <span className="font-semibold">{filteredBookings.length}</span> records
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {/* Previous Button */}
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-lg border ${
                          currentPage === 1
                            ? 'text-gray-400 bg-gray-100 border-gray-200 cursor-not-allowed'
                            : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      
                      {/* Page Numbers */}
                      <div className="flex items-center gap-1">
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
                              onClick={() => handlePageChange(pageNum)}
                              className={`min-w-[40px] h-10 rounded-lg text-sm font-medium ${
                                currentPage === pageNum
                                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                  : 'text-gray-700 hover:bg-gray-100 border border-gray-300'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                        
                        {totalPages > 5 && currentPage < totalPages - 2 && (
                          <>
                            <span className="px-2 text-gray-400">...</span>
                            <button
                              onClick={() => handlePageChange(totalPages)}
                              className="min-w-[40px] h-10 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 border border-gray-300"
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
                        className={`p-2 rounded-lg border ${
                          currentPage === totalPages
                            ? 'text-gray-400 bg-gray-100 border-gray-200 cursor-not-allowed'
                            : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Summary Section */}
        {paymentTotals && paymentTotals.totalBookings > 0 && (
          <div className="mt-8 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl shadow-lg p-6 text-white">
            <h3 className="text-xl font-semibold mb-6">Payment Summary</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-gray-300">Total Completed Bookings</p>
                <p className="text-3xl font-bold mt-2">{paymentTotals.totalBookings}</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className={`text-xs px-2 py-1 rounded-full ${paymentTotals.completedPayments > 0 ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-300'}`}>
                    {paymentTotals.completedPayments} paid
                  </div>
                  <div className="text-xs px-2 py-1 bg-yellow-900 text-yellow-300 rounded-full">
                    {paymentTotals.pendingPayments} pending
                  </div>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-300">Average Per Booking</p>
                <p className="text-3xl font-bold text-green-400 mt-2">${paymentTotals.averagePerBooking}</p>
                <p className="text-xs text-gray-400 mt-1">Net payout per service</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-300">Total Fees</p>
                <p className="text-3xl font-bold text-red-400 mt-2">
                  ${(paymentTotals.totalCommission + paymentTotals.totalTax).toFixed(2)}
                </p>
                <div className="text-xs text-gray-400 mt-1">
                  Commission + Tax
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-300">Next Payout</p>
                <p className="text-3xl font-bold text-blue-400 mt-2">
                  ${paymentTotals.pendingPayments > 0 ? (paymentTotals.totalNetPayout / paymentTotals.totalBookings * paymentTotals.pendingPayments).toFixed(2) : '0.00'}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Estimated from {paymentTotals.pendingPayments} pending
                </p>
              </div>
            </div>
            
            {/* Progress Bars */}
            <div className="mt-8 pt-8 border-t border-gray-700">
              <h4 className="text-sm font-medium text-gray-300 mb-4">Earnings Distribution</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-green-400">Your Net Earnings</span>
                    <span>${paymentTotals.totalNetPayout} ({paymentTotals.totalEarned > 0 ? ((paymentTotals.totalNetPayout / paymentTotals.totalEarned) * 100).toFixed(1) : '0'}%)</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="h-2.5 rounded-full bg-green-500"
                      style={{ width: `${paymentTotals.totalEarned > 0 ? (paymentTotals.totalNetPayout / paymentTotals.totalEarned) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-red-400">Platform Commission</span>
                    <span>${paymentTotals.totalCommission} ({paymentTotals.totalEarned > 0 ? ((paymentTotals.totalCommission / paymentTotals.totalEarned) * 100).toFixed(1) : '0'}%)</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="h-2.5 rounded-full bg-red-500"
                      style={{ width: `${paymentTotals.totalEarned > 0 ? (paymentTotals.totalCommission / paymentTotals.totalEarned) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-yellow-400">Tax on Commission</span>
                    <span>${paymentTotals.totalTax} ({paymentTotals.totalEarned > 0 ? ((paymentTotals.totalTax / paymentTotals.totalEarned) * 100).toFixed(1) : '0'}%)</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="h-2.5 rounded-full bg-yellow-500"
                      style={{ width: `${paymentTotals.totalEarned > 0 ? (paymentTotals.totalTax / paymentTotals.totalEarned) * 100 : 0}%` }}
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