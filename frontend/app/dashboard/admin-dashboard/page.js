"use client";

import DashboardStats from "@/components/dashboard/Admin/DashboradStats";
import OrdersTable from "@/components/dashboard/Admin/OrdersTable";
import SalesOverviewChart from "@/components/dashboard/Admin/SalesOverviewChart";
import ServiceOverviewChart from "@/components/dashboard/Admin/ServiceOverviewChart";
import { useGetAdminOverviewQuery } from "@/feature/admin/AdminUserApi";
import { useTranslation } from "react-i18next";

export default function DashboardPage() {
  const { t } = useTranslation("admin");
  const { data: overview } = useGetAdminOverviewQuery();
  console.log(overview?.data, "overview is here");
  const data = overview?.data;
  console.log(overview, "hey chart data how are you");

  return (
    <div className='min-h-screen w-full px-2 pt-6'>
      {/* Header */}
      <div>
        <h1 className='text-[26px] md:text-[28px] font-semibold text-gray-900'>
          {t("dashboard.title")}
        </h1>
        <p className='text-sm text-[#9C6BFF] mt-1'>
          {t("dashboard.welcome")}{" "}
          <span className='font-medium'>{t("dashboard.role")}</span>
        </p>
      </div>

      {/* Stats */}
      <div className='mt-6'>
        <DashboardStats data={data} />
      </div>

      {/* Quick Actions */}
      {/* <div className="mt-8">
        <QuickActions />
      </div> */}

      {/* Charts */}
      <div className='mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <SalesOverviewChart data={data?.chartData} />
        <ServiceOverviewChart />
      </div>

      {/* Tables */}
      <div className='mt-8'>
        <OrdersTable />
      </div>

      {/* <div className="mt-8 mb-10">
        <BookingsTable />
      </div> */}
    </div>
  );
}
