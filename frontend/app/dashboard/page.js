"use client";

import RecentOrders from "@/components/RecentOrders";
import SalesChart from "@/components/SalesCard";
import StatCard from "@/components/StatCard";
import { useGetOverviewQuery } from "@/feature/seller/SellerApi";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FiBox, FiStar } from "react-icons/fi";
import { IoCartOutline } from "react-icons/io5";
import { LuClipboardPenLine } from "react-icons/lu";

export default function DashboardPage() {
  const { data: session } = useSession();
    const userId = session?.user?.id;



const role = session?.user?.role;

const router = useRouter()

if(role === 'admin'){
  router.push('/dashboard/admin-dashboard')
  return 
}

    console.log(userId, "userID");
    const {data:Overview, isError, error} = useGetOverviewQuery(userId);
    console.log(Overview?.data, "kire overview tui kmn asci");

    if(isError){
      console.log(error, "error is herer");
    }
  
  return (
    <div className="px-2 pt-6">
      {/* <h1 className="text-lg md:text-[28px] font-semibold text-gray-900">
        Dashboard Overview 
      </h1>

      <p className="mt-1 md:text-xl text-[#AC65EE]">
        Welcome back! Here’s what’s happening with your store today
      </p> */}
      {/* ======= HEADER ======= */}
      <div className=" rounded-2xl">
        {/* ======= STAT CARDS ======= */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<IoCartOutline />}
            value={Overview?.data?.totalSales}
            label="Total Sales"
          
            color="bg-[#E8FFF3]"
          />

          <StatCard
            icon={<LuClipboardPenLine />}
            value={Overview?.data?.totalOrders}
            label="Total Orders"
     
            color="bg-[#E8FFF3]"
          />

          <StatCard
            icon={<FiBox />}
            value={Overview?.data?.totalProduct}
            label="Products"
          
            color="bg-[#EEF2FF]"
          />

          <StatCard
            icon={<FiStar />}
            value={Overview?.data?.avgRating}
            label="Avg Rating"
            color="bg-[#E8FFF3]"
          />
        </div>
      </div>

      {/* ======= SALES ANALYTICS ======= */}
      <div className="mt-6 bg-white rounded-2xl shadow-sm">
        <SalesChart data={Overview?.data?.chartData} />
      </div>

      {/* ======= RECENT ORDERS ======= */}
      <div className="mt-6 bg-white rounded-2xl shadow-sm px-4 md:px-6 pt-4 pb-5 border border-[#F0EEF7]">
        <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-3">
          Recent Orders
        </h3>

        <RecentOrders />
      </div>
    </div>
  );
}
