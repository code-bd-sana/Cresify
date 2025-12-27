"use client";
import { useGetOverviewProviderQuery } from "@/feature/seller/SellerApi";
import {
  useGetProviderBookingStatsQuery,
  useGetProviderTodaysBookingsQuery,
  useGetProviderUpcomingBookingsQuery,
} from "@/feature/UserApi";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import {
  FiCheck,
  FiChevronDown,
  FiClock,
  FiDollarSign,
  FiStar,
  FiUsers,
  FiTrendingUp,
  FiCalendar,
  FiPackage,
  FiCreditCard,
  FiBarChart2,
} from "react-icons/fi";
import {
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

export default function ServiceProviderDashboard() {
  const { data: session, status } = useSession();

  // Booking Overview filter state
  const [bookingFilter, setBookingFilter] = useState("all");
  const providerId = session?.user?.id || "000000000000000000000002";

  const { data: Overview, isError, error, isLoading: overviewLoading } = useGetOverviewProviderQuery(providerId);
  
  console.log(Overview?.data, "provider overview data");

  const { data: bookingStats, isLoading: statsLoading } =
    useGetProviderBookingStatsQuery({ providerId, filter: bookingFilter });
  
  const { data: todayData, isLoading: todayLoading } =
    useGetProviderTodaysBookingsQuery(session?.user?.id);
  const { data: upcomingData, isLoading: upcomingLoading } =
    useGetProviderUpcomingBookingsQuery(session?.user?.id);

  // Use Overview data if available, otherwise use default/bookingStats
  const overviewData = Overview?.data || {
    totalSales: 0,
    totalBookings: 0,
    totalProducts: 1,
    avgRating: 0,
    totalCustomers: 0,
    totalEarnings: 0,
    pendingPayout: 0,
    averageBookingValue: 0,
    monthlyGrowth: 0,
    weeklyGrowth: 0,
    thisMonthBookings: 0,
    thisWeekBookings: 0,
    todayBookings: 0,
    chartData: [],
    monthlyEarnings: 0,
    paymentSummary: { completed: 0, processing: 0, pending: 0 },
    recentBookings: [],
    repeatCustomers: 0,
    serviceStats: { topServices: [], categories: [] },
    providerInfo: { hourlyRate: 0, serviceName: 'Service', serviceCategory: 'General' }
  };

  // Booking data for pie chart
  const bookingData = [
    {
      name: "Cancel Booking",
      value: bookingStats?.data?.cancelled ?? 0,
      color: "#F88D25",
    },
    {
      name: "Complete Services",
      value: bookingStats?.data?.completed ?? overviewData.totalBookings,
      color: "#9838E1",
    },
  ];

  // Use chartData from overview or default
  const incomeData = overviewData?.chartData?.length > 0 
    ? overviewData.chartData.map(item => ({
        month: item.month,
        value: item.value,
        bookings: item.bookings || 0
      }))
    : [
        { month: "JAN", value: 0 },
        { month: "FEB", value: 0 },
        { month: "MAR", value: 0 },
        { month: "APR", value: 0 },
        { month: "MAY", value: 0 },
        { month: "JUN", value: 0 },
      ];

  // Safely handle bookings data
  const todayBookings = Array.isArray(todayData?.data) 
    ? todayData.data 
    : Array.isArray(overviewData?.recentBookings) 
      ? overviewData.recentBookings.slice(0, 3) 
      : [];

  const upcomingBookings = Array.isArray(upcomingData?.data) ? upcomingData.data : [];

  const statusColors = {
    accept: "bg-[#E6FCE6] text-[#29A55A]",
    pending: "bg-[#F3E8FF] text-[#9838E1]",
    rejected: "bg-[#FDE8E8] text-[#D34A4A]",
    completed: "bg-[#E6FCE6] text-[#29A55A]",
    processing: "bg-[#FFF4E5] text-[#F88D25]",
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (overviewLoading) {
    return (
      <div className='px-4 py-6 space-y-6 bg-[#F6F6FA] min-h-screen flex items-center justify-center'>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9838E1] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='px-4 py-6 space-y-6 bg-[#F6F6FA] min-h-screen'>
      {/* ======================= TOP STATS CARDS ======================= */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
        {/* CARD 1 - Total Earnings */}
        <StatCard
          icon={<FiDollarSign size={22} />}
          value={formatCurrency(overviewData?.totalEarnings || overviewData?.totalSales || 0)}
          label='Total Earnings'
          sublabel={`${overviewData?.totalBookings || 0} bookings`}
          iconBg="bg-[#F3E8FF]"
          iconColor="text-[#9838E1]"
        />

        {/* CARD 2 - Total Bookings */}
        <StatCard
          icon={<FiCheck size={22} />}
          value={overviewData?.totalBookings || 0}
          label='Total Bookings'
          sublabel={`${overviewData?.averageBookingValue ? `Avg: $${overviewData.averageBookingValue}` : 'Complete Services'}`}
          iconBg="bg-[#E6FCE6]"
          iconColor="text-[#29A55A]"
        />

        {/* CARD 3 - Total Customers */}
        <StatCard 
          icon={<FiUsers size={22} />}
          value={overviewData?.totalCustomers || 0}
          label='Total Customers'
          sublabel={`${overviewData?.repeatCustomers || 0} repeat`}
          iconBg="bg-[#E0F2FE]"
          iconColor="text-[#0EA5E9]"
        />

        {/* CARD 4 - Pending Payout */}
        <StatCard
          icon={<FiCreditCard size={22} />}
          value={formatCurrency(overviewData?.pendingPayout || 0)}
          label='Pending Payout'
          sublabel={`${overviewData?.paymentSummary?.processing || 0} processing`}
          iconBg="bg-[#FEF3C7]"
          iconColor="text-[#F59E0B]"
        />
      </div>

      {/* ======================= SECOND ROW STATS ======================= */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
        {/* Average Booking Value */}
        <div className='bg-white border border-[#EFE9FF] rounded-2xl p-6 shadow-sm'>
          <div className="flex items-center gap-3 mb-3">
            <div className='w-10 h-10 bg-[#F0F9FF] rounded-xl flex items-center justify-center text-[#0EA5E9]'>
              <FiBarChart2 size={20} />
            </div>
            <div>
              <p className='text-2xl font-semibold text-gray-900'>
                ${(overviewData?.averageBookingValue || 0)?.toFixed(2)}
              </p>
              <p className='text-sm text-gray-600'>Avg Booking Value</p>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Per completed service
          </div>
        </div>

        {/* Growth Rate */}
        <div className='bg-white border border-[#EFE9FF] rounded-2xl p-6 shadow-sm'>
          <div className="flex items-center gap-3 mb-3">
            <div className='w-10 h-10 bg-[#F0FDF4] rounded-xl flex items-center justify-center text-[#10B981]'>
              <FiTrendingUp size={20} />
            </div>
            <div>
              <p className='text-2xl font-semibold text-gray-900'>
                {(overviewData?.monthlyGrowth || 0) > 0 ? '+' : ''}{overviewData?.monthlyGrowth || 0}%
              </p>
              <p className='text-sm text-gray-600'>Monthly Growth</p>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Compared to last month
          </div>
        </div>

        {/* Service Info */}
        <div className='bg-white border border-[#EFE9FF] rounded-2xl p-6 shadow-sm'>
          <div className="flex items-center gap-3 mb-3">
            <div className='w-10 h-10 bg-[#FDF4FF] rounded-xl flex items-center justify-center text-[#D946EF]'>
              <FiPackage size={20} />
            </div>
            <div>
              <p className='text-2xl font-semibold text-gray-900'>
                {overviewData?.totalProducts || 0}
              </p>
              <p className='text-sm text-gray-600'>Services</p>
            </div>
          </div>
          <div className="text-xs text-gray-500 truncate" title={overviewData?.providerInfo?.serviceName}>
            {overviewData?.providerInfo?.serviceName || 'No service name'}
          </div>
        </div>

        {/* Rating */}
        <div className='bg-white border border-[#EFE9FF] rounded-2xl p-6 shadow-sm'>
          <div className="flex items-center gap-3 mb-3">
            <div className='w-10 h-10 bg-[#FEF3C7] rounded-xl flex items-center justify-center text-[#F59E0B]'>
              <FiStar size={20} />
            </div>
            <div>
              <p className='text-2xl font-semibold text-gray-900'>
                {(overviewData?.avgRating || 0)?.toFixed(1)}
              </p>
              <p className='text-sm text-gray-600'>Average Rating</p>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Based on customer reviews
          </div>
        </div>
      </div>

      {/* ======================= CHARTS ROW ======================= */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Income Chart */}
        <ChartCard title='Monthly Earnings Overview'>
          <FilterDropdown 
            options={[
              { value: 'all', label: 'All Time' },
              { value: 'year', label: 'This Year' },
              { value: 'month', label: 'This Month' },
            ]}
          />
          <div className='w-full h-[260px]'>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart data={incomeData}>
                <XAxis 
                  dataKey='month' 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  formatter={(value) => [`$${value}`, 'Earnings']}
                  labelFormatter={(label) => `Month: ${label}`}
                  contentStyle={{ 
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB',
                    background: '#FFFFFF'
                  }}
                />
                <Line
                  type='monotone'
                  dataKey='value'
                  stroke='#9838E1'
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#9838E1" }}
                  activeDot={{ r: 8, fill: "#F88D25" }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-2 text-center text-sm text-gray-600">
              Total: {formatCurrency(overviewData?.monthlyEarnings || incomeData.reduce((sum, item) => sum + item.value, 0))}
            </div>
          </div>
        </ChartCard>

        {/* Booking Overview */}
        <ChartCard title='Booking Distribution'>
          <FilterDropdown 
            value={bookingFilter} 
            onChange={setBookingFilter}
            options={[
              { value: 'all', label: 'All' },
              { value: 'today', label: 'Today' },
              { value: 'week', label: 'This Week' },
              { value: 'month', label: 'This Month' },
            ]}
          />
          <div className='w-full h-[260px] flex flex-col items-center justify-center relative'>
            <ResponsiveContainer width='75%' height='80%'>
              <PieChart>
                <Pie
                  data={bookingData}
                  innerRadius={70}
                  outerRadius={95}
                  cornerRadius={40}
                  paddingAngle={6}
                  dataKey='value'
                  label={(entry) => `${entry.value}`}
                >
                  {bookingData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [value, name]}
                  contentStyle={{ 
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB',
                    background: '#FFFFFF'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="flex justify-center items-center gap-8 mt-4">
              {bookingData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-700">{item.name}</span>
                  <span className="text-sm font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
            
            {statsLoading && (
              <div className='absolute inset-0 flex items-center justify-center bg-white/60'>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9838E1]"></div>
              </div>
            )}
          </div>
        </ChartCard>
      </div>

      {/* ======================= BOOKINGS LISTS ======================= */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Today's Bookings */}
        <BookingList
          title={`Today's Bookings (${overviewData?.todayBookings || 0})`}
          items={todayBookings}
          statusColors={statusColors}
          showStatus
          loading={todayLoading}
        />

        {/* Recent Bookings */}
        <BookingList
          title={`Recent Bookings`}
          items={Array.isArray(overviewData?.recentBookings) ? overviewData.recentBookings.slice(0, 5) : []}
          statusColors={statusColors}
          showStatus={false}
          loading={false}
        />
      </div>

      {/* ======================= SERVICE STATS ======================= */}
      {Array.isArray(overviewData?.serviceStats?.topServices) && overviewData.serviceStats.topServices.length > 0 && (
        <div className='bg-white border border-[#EFE9FF] rounded-2xl p-6 shadow-sm'>
          <div className="flex items-center justify-between mb-6">
            <h2 className='text-lg font-semibold text-gray-900'>Service Performance</h2>
            <div className="text-sm text-gray-600">
              {(overviewData?.serviceStats?.categories?.length || 0)} categories
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {overviewData.serviceStats.topServices.map((service, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-gray-900">{service.name}</h3>
                    <p className="text-sm text-gray-600">{service.category}</p>
                  </div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    {service.count} bookings
                  </span>
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  ${(service.totalEarnings || 0)?.toFixed(2)}
                </div>
                <div className="text-xs text-gray-500 mt-1">Total earnings</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================= PAYMENT SUMMARY ======================= */}
      <div className='bg-white border border-[#EFE9FF] rounded-2xl p-6 shadow-sm'>
        <h2 className='text-lg font-semibold text-gray-900 mb-6'>Payment Status Summary</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Completed Payments */}
          <div className="bg-green-50 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-green-800 font-semibold">Completed</div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FiCheck className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-green-700">
              {overviewData?.paymentSummary?.completed || 0}
            </div>
            <div className="text-sm text-green-600 mt-1">
              Paid successfully
            </div>
          </div>

          {/* Processing Payments */}
          <div className="bg-amber-50 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-amber-800 font-semibold">Processing</div>
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <FiClock className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-amber-700">
              {overviewData?.paymentSummary?.processing || 0}
            </div>
            <div className="text-sm text-amber-600 mt-1">
              Payments in process
            </div>
          </div>

          {/* Pending Payments */}
          <div className="bg-gray-100 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-gray-800 font-semibold">Pending</div>
              <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                <FiCalendar className="w-5 h-5 text-gray-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-700">
              {overviewData?.paymentSummary?.pending || 0}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Awaiting confirmation
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Total expected payout: <span className="font-semibold text-gray-900">
                {formatCurrency(overviewData?.pendingPayout || 0)}
              </span>
            </div>
            <button className="px-4 py-2 bg-[#9838E1] text-white text-sm font-medium rounded-lg hover:bg-[#8830C8] transition-colors">
              View Payment Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========================================================================
   SMALL COMPONENTS (Pixel Perfect)
   ======================================================================== */

function StatCard({ icon, value, label, sublabel, iconBg = "bg-[#F3E8FF]", iconColor = "text-[#9838E1]" }) {
  return (
    <div className='bg-white border border-[#EFE9FF] rounded-2xl p-6 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow'>
      <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center ${iconColor}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className='text-[22px] font-semibold text-gray-900 truncate'>{value}</p>
        <p className='text-sm text-gray-600 mt-1'>{label}</p>
        {sublabel && (
          <p className='text-xs text-gray-500 mt-1'>{sublabel}</p>
        )}
      </div>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className='bg-white border border-[#EFE9FF] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-lg font-semibold text-gray-900'>{title}</h2>
        {children[0]}
      </div>
      {children[1]}
    </div>
  );
}

function FilterDropdown({ value, onChange, options = [{ value: 'all', label: 'All' }] }) {
  return (
    <div className='relative'>
      <select
        className='appearance-none bg-white border border-gray-300 px-4 py-2.5 rounded-lg text-sm text-gray-700 pr-10 cursor-pointer hover:border-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-[#9838E1] focus:border-transparent'
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <FiChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none' />
    </div>
  );
}

function BookingList({ title, items, statusColors, showStatus, loading }) {
  const getStatusText = (status) => {
    const statusMap = {
      'accept': 'Accepted',
      'pending': 'Pending',
      'rejected': 'Rejected',
      'completed': 'Completed',
      'processing': 'Processing'
    };
    return statusMap[status] || status;
  };

  return (
    <div className='bg-white border border-[#EFE9FF] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-lg font-semibold text-gray-900'>{title}</h2>
        <button className='text-[#9838E1] text-sm font-medium hover:text-[#8830C8] transition-colors'>
          View All →
        </button>
      </div>

      <div className='space-y-4'>
        {loading ? (
          <div className='flex items-center justify-center py-8'>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9838E1]"></div>
          </div>
        ) : !Array.isArray(items) || items.length === 0 ? (
          <div className='text-center py-8'>
            <div className="text-gray-400 mb-2">
              <FiCalendar className="w-12 h-12 mx-auto" />
            </div>
            <p className='text-gray-500'>No bookings found</p>
            <p className='text-sm text-gray-400 mt-1'>Bookings will appear here</p>
          </div>
        ) : (
          items.map((item, i) => (
            <div
              key={i}
              className='bg-white border border-[#F3F4F6] rounded-xl p-4 hover:border-[#E5E7EB] transition-colors'>
              <div className='flex items-center justify-between'>
                <div className='flex items-start gap-4 flex-1 min-w-0'>
                  <div className="relative">
                    <Image
                      src={item.customer?.profilePic || "/service-provider/pic.png"}
                      width={48}
                      height={48}
                      alt='profile'
                      className='rounded-full border-2 border-white shadow-sm'
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                      <FiCheck className="w-2.5 h-2.5 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className='font-semibold text-gray-900 truncate'>
                          {item.customerName || item.customer?.fullName || "Customer"}
                        </h3>
                        <p className='text-sm text-gray-600 mt-1'>
                          {item.serviceName || item.provider?.serviceName || "Service"}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                          {item.serviceDate && (
                            <span className="flex items-center gap-1">
                              <FiCalendar className="w-3 h-3" />
                              {new Date(item.serviceDate).toLocaleDateString()}
                            </span>
                          )}
                          {item.amount && (
                            <span className="flex items-center gap-1">
                              <FiDollarSign className="w-3 h-3" />
                              ${item.amount.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {showStatus && item.status && (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2 ${
                            statusColors[item.status] || 'bg-gray-100 text-gray-800'
                          }`}>
                          {getStatusText(item.status)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}