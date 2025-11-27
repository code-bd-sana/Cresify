"use client";

import Image from "next/image";
import { FiCheck, FiClock, FiStar, FiDollarSign, FiChevronDown } from "react-icons/fi";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function ServiceProviderDashboard() {
  const incomeData = [
    { month: "JAN", value: 2500 },
    { month: "FEB", value: 4800 },
    { month: "MAR", value: 7000 },
    { month: "APR", value: 5000 },
    { month: "MAY", value: 8800 },
    { month: "JUN", value: 9500 },
  ];

  const bookingData = [
    { name: "Cancel Booking", value: 234, color: "#F88D25" },
    { name: "Complete Services", value: 1295654, color: "#9838E1" },
  ];

  const todayBookings = [
    { id: 1, name: "Cody Fisher", status: "Completed" },
    { id: 2, name: "Cody Fisher", status: "Pending" },
    { id: 3, name: "Cody Fisher", status: "Canceled" },
    { id: 4, name: "Cody Fisher", status: "Completed" },
  ];

  const upcomingBookings = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

  const statusColors = {
    Completed: "bg-[#E6FCE6] text-[#29A55A]",
    Pending: "bg-[#F3E8FF] text-[#9838E1]",
    Canceled: "bg-[#FDE8E8] text-[#D34A4A]",
  };

  return (
    <div className="px-4 py-6 space-y-6 bg-[#F6F6FA] min-h-screen">

      {/* ======================= TOP STATS CARDS ======================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* CARD 1 */}
        <StatCard
          icon={<FiDollarSign size={22} />}
          value="$45,655.00"
          label="Total Earning"
        />

        {/* CARD 2 */}
        <StatCard
          icon={<FiCheck size={22} />}
          value="459"
          label="Complete Services"
        />

        {/* CARD 3 */}
        <StatCard
          icon={<FiStar size={22} />}
          value="400"
          label="New Review"
        />

        {/* CARD 4 */}
        <StatCard
          icon={<FiClock size={22} />}
          value="95"
          label="Pending Services"
        />
      </div>

      {/* ======================= CHARTS ROW ======================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Income Chart */}
        <ChartCard title="Income Overview">
          <FilterDropdown />

          <div className="w-full h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={incomeData}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#9838E1"
                  strokeWidth={4}
                  dot={{ r: 6, fill: "#F88D25" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Booking Overview */}
        <ChartCard title="Booking Overview">
          <FilterDropdown />

          <div className="w-full h-[260px] flex items-center justify-center relative">
            <ResponsiveContainer width="75%" height="100%">
              <PieChart>
                <Pie
                  data={bookingData}
                  innerRadius={70}
                  outerRadius={95}
                  cornerRadius={40}
                  paddingAngle={6}
                  dataKey="value"
                >
                  {bookingData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Exact Labels */}
            <div className="absolute left-[20%] top-[22%] text-[13px] text-[#F88D25]">
              Cancel Booking <br /> 234
            </div>

            <div className="absolute right-[10%] bottom-[35%] text-[13px] text-[#9838E1]">
              Complete Services <br /> 12,95,654
            </div>
          </div>
        </ChartCard>
      </div>

      {/* ======================= BOOKINGS LISTS ======================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* TODAY’S BOOKINGS */}
        <BookingList
          title="Today’s Bookings"
          items={todayBookings}
          statusColors={statusColors}
          showStatus
        />

        {/* UPCOMING BOOKINGS */}
        <BookingList title="Upcoming Bookings" items={upcomingBookings} />
      </div>

    </div>
  );
}

/* ========================================================================
   SMALL COMPONENTS (Pixel Perfect)
   ======================================================================== */

function StatCard({ icon, value, label }) {
  return (
    <div className="bg-white border border-[#EFE9FF] rounded-2xl p-6 flex items-start gap-4 shadow-sm">
      <div className="w-12 h-12 bg-[#F3E8FF] rounded-xl flex items-center justify-center text-[#9838E1]">
        {icon}
      </div>
      <div>
        <p className="text-[22px] font-semibold text-[#F88D25]">{value}</p>
        <p className="text-sm text-gray-600 mt-1">{label}</p>
      </div>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white border border-[#EFE9FF] rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {children[0]}
      </div>
      {children[1]}
    </div>
  );
}

function FilterDropdown() {
  return (
    <div className="relative">
      <select className="appearance-none bg-[#F7F7FA] border border-gray-300 px-3 py-1.5 rounded-lg text-sm text-gray-700 pr-8 cursor-pointer">
        <option>All</option>
        <option>Today</option>
        <option>This Week</option>
      </select>
      <FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500" />
    </div>
  );
}

function BookingList({ title, items, statusColors, showStatus }) {
  return (
    <div className="bg-white border border-[#EFE9FF] rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <button className="text-[#9838E1] text-sm font-medium">View All</button>
      </div>

      <div className="space-y-4">
        {items.map((item, i) => (
          <div
            key={i}
            className="bg-white border border-[#E5E5E5] rounded-xl p-4 shadow-sm flex items-center justify-between"
          >
            <div className="flex items-start gap-4">
              <Image
                src="/service-provider/pic.png"
                width={50}
                height={50}
                alt="profile"
                className="rounded-full"
              />
              <div>
                <h3 className="font-semibold text-gray-900">Cody Fisher</h3>
                <p className="text-sm text-gray-600">Electrical Work</p>
                <p className="text-sm text-gray-600 mt-1 flex gap-1 items-center">
                  📍 123 Main Road Rampura, Dhaka 1205 <br />
                  ⏰ 08:00 AM
                </p>
              </div>
            </div>

            {showStatus && (
              <span
                className={`px-4 py-1 rounded-full text-sm font-medium ${statusColors[item.status]}`}
              >
                {item.status}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
