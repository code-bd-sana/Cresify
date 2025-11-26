"use client";

import BookingsTable from "@/components/dashboard/Admin/BookingsTable";
import DashboardStats from "@/components/dashboard/Admin/DashboradStats";
import OrdersTable from "@/components/dashboard/Admin/OrdersTable";
import QuickActions from "@/components/dashboard/Admin/QuickActions";
import SalesOverviewChart from "@/components/dashboard/Admin/SalesOverviewChart";
import ServiceOverviewChart from "@/components/dashboard/Admin/ServiceOverviewChart";



export default function DashboardPage() {
  return (
    <div className="min-h-screen w-full bg-[#F7F7FA] px-6 py-6 md:px-10 md:py-8">
      {/* Header */}
      <div>
        <h1 className="text-[26px] md:text-[28px] font-semibold text-gray-900">
          Dashboard Overview
        </h1>
        <p className="text-sm text-[#9C6BFF] mt-1">
          Welcome back! <span className="font-medium">System Admin</span>
        </p>
      </div>

      {/* Stats */}
      <div className="mt-6">
        <DashboardStats />
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <QuickActions />
      </div>

      {/* Charts */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesOverviewChart />
        <ServiceOverviewChart />
      </div>

      {/* Tables */}
      <div className="mt-8">
        <OrdersTable />
      </div>

      <div className="mt-8 mb-10">
        <BookingsTable />
      </div>
    </div>
  );
}
