"use client";

import RecentOrders from "@/components/RecentOrders";
import SalesChart from "@/components/SalesCard";
import StatCard from "@/components/StatCard";
import { useGetOverviewQuery } from "@/feature/seller/SellerApi";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { FiBox, FiStar } from "react-icons/fi";
import { IoCartOutline } from "react-icons/io5";
import { LuClipboardPenLine } from "react-icons/lu";

export default function DashboardPage() {
  const { data: session } = useSession();
  const { t } = useTranslation("seller");
  const userId = session?.user?.id;
  const role = session?.user?.role;
  const router = useRouter();

  if (role === "admin") {
    router.push("/dashboard/admin-dashboard");
    return null;
  }
  if (role === "provider") {
    router.push("dashboard/service-provider-dashboard");
    return null;
  }

  const { data: Overview, isError, error } = useGetOverviewQuery(userId);

  if (isError) {
    console.error("Overview fetch error:", error);
  }

  return (
    <div className='px-2 pt-6'>
      {/* ======= DASHBOARD HEADER ======= */}
      <div className='mb-6'>
        <h1 className='text-lg md:text-2xl font-semibold text-gray-900'>
          {t("dashboard.title")}
        </h1>
        <p className='mt-1 md:text-xl text-[#AC65EE]'>
          {t(
            "dashboard.subtitle",
            "Welcome back! Here’s what’s happening with your store today"
          )}
        </p>
      </div>

      {/* ======= STAT CARDS ======= */}
      <div className='rounded-2xl'>
        <div className='mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          <StatCard
            icon={<IoCartOutline />}
            value={Overview?.data?.totalSales}
            label={t("dashboard.totalSales", "Total Sales")}
            color='bg-[#E8FFF3]'
          />

          <StatCard
            icon={<LuClipboardPenLine />}
            value={Overview?.data?.totalOrders}
            label={t("dashboard.totalOrders", "Total Orders")}
            color='bg-[#E8FFF3]'
          />

          <StatCard
            icon={<FiBox />}
            value={Overview?.data?.totalProduct}
            label={t("dashboard.products", "Products")}
            color='bg-[#EEF2FF]'
          />

          <StatCard
            icon={<FiStar />}
            value={Overview?.data?.avgRating}
            label={t("dashboard.avgRating", "Avg Rating")}
            color='bg-[#E8FFF3]'
          />
        </div>
      </div>

      {/* ======= SALES ANALYTICS ======= */}
      <div className='mt-6 bg-white rounded-2xl shadow-sm'>
        <h3 className='text-sm md:text-base font-semibold text-gray-900 mb-3 px-4 md:px-6 pt-4'>
          {t("dashboard.salesAnalytics", "Sales Analytics")}
        </h3>
        <SalesChart data={Overview?.data?.chartData} />
      </div>

      {/* ======= RECENT ORDERS ======= */}
      <div className='mt-6 bg-white rounded-2xl shadow-sm px-4 md:px-6 pt-4 pb-5 border border-[#F0EEF7]'>
        <h3 className='text-sm md:text-base font-semibold text-gray-900 mb-3'>
          {t("dashboard.recentOrders")}
        </h3>

        <RecentOrders />
      </div>
    </div>
  );
}
