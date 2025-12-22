"use client";

import { useGetAdminOverviewQuery } from "@/feature/admin/AdminOverviewApi";
import { FiBarChart2 } from "react-icons/fi";
import { LuBriefcase, LuPackage, LuShoppingBag, LuUsers } from "react-icons/lu";

export default function DashboardStats({data}) {
  /** Fetch overview stats */
  const { data: overview } = useGetAdminOverviewQuery();
  const overviewData = overview?.data;

  /** Map API data to cards with icons, defaulting to 0 */
  const stats = [
    {
      id: 1,
      label: "Total Buyers",
      value: overviewData?.totalBuyers ?? 0,
      icon: LuUsers,
    },
    {
      id: 2,
      label: "Total Sellers",
      value: overviewData?.totalSellers ?? 0,
      icon: LuBriefcase,
    },
    {
      id: 3,
      label: "Total Service Providers",
      value: overviewData?.totalServiceProviders ?? 0,
      icon: LuUsers,
    },
    {
      id: 4,
      label: "Total Products",
      value: overviewData?.totalProduct ?? 0,
      icon: LuPackage,
    },
    {
      id: 5,
      label: "Total Services",
      value: overviewData?.totalServices ?? 0,
      icon: LuBriefcase,
    },
    {
      id: 6,
      label: "Total Booking Services",
      value: overviewData?.totalBookedServices ?? 0,
      icon: FiBarChart2,
    },
    {
      id: 7,
      label: "Total Orders",
      value: overviewData?.totalOrders ?? 0,
      icon: LuShoppingBag,
    },
    // {
    //   id: 8,
    //   label: "Platform Revenue",
    //   value: `$${overviewData?.totalPlatformRevenue ?? 0}`,
    //   icon: FiBarChart2,
    // },
  ];

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4'>
      {stats.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.id}
            className='bg-white rounded-xl shadow-sm border border-[#F0ECFF] px-4 py-4 flex items-center justify-between'>
            <div>
              <p className='text-[13px] text-gray-500'>{item.label}</p>
              <p className='text-[20px] font-semibold text-gray-900 mt-1'>
                {item.value}
              </p>
            </div>

            <div className='w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-tr from-[#8736C5] via-[#9C6BFF] to-[#F88D25] text-white text-xl'>
              <Icon />
            </div>
          </div>
        );
      })}
    </div>
  );
}
