"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiGrid,
  FiBox,
  FiShoppingCart,
  FiUser,
  FiCreditCard,
  FiBarChart2,
  FiMessageSquare,
  FiSettings,
  FiLogOut,
  FiStar,
} from "react-icons/fi";
import { SlCalender } from "react-icons/sl";
import { TbReceiptRefund } from "react-icons/tb";

export default function Sidebar({ open, onClose }) {
  const pathname = usePathname();
  const { data } = useSession();


  const role = data?.user?.role;




  const adminItem = [
    { label: "Dashboard", icon: FiGrid, path: "/dashboard/admin-dashboard" },

    {
      label: "User Management",
      icon: FiGrid,
      path: "/dashboard/admin-dashboard/users",
    },

    {
      label: "Products",
      icon: FiGrid,
      path: "/dashboard/admin-dashboard/products",
    },
    {
      label: "Services",
      icon: FiGrid,
      path: "/dashboard/admin-dashboard/services",
    },
    ,
    { label: "Orders", icon: FiShoppingCart, path: "/dashboard/orders" },
    { label: "Booking", icon: FiShoppingCart, path: "/dashboard/orders" },
    // { label: "Store Profile", icon: FiUser, path: "/dashboard/store-profile" },
    { label: "Payments", icon: FiCreditCard, path: "/dashboard/payments" },
    { label: "Content", icon: FiCreditCard, path: "/dashboard/content" },

    // { label: "Reviews", icon: FiStar, path: "/dashboard/reviews" },
    { label: "Refund", icon: TbReceiptRefund, path: "/dashboard/adminRefund" },
    { label: "Service Refund", icon: TbReceiptRefund, path: "/dashboard/serviceRefund" },
    { label: "Settings", icon: FiSettings, path: "/dashboard/settings" },
  ];

  const sellerItem = [
    { label: "Dashboard", icon: FiGrid, path: "/dashboard" },

    { label: "Products", icon: FiBox, path: "/dashboard/products" },
    { label: "Orders", icon: FiShoppingCart, path: "/dashboard/orders" },
    { label: "Store Profile", icon: FiUser, path: "/dashboard/store-profile" },
    { label: "Payments", icon: FiCreditCard, path: "/dashboard/payments" },
    { label: "refund", icon: TbReceiptRefund, path: "/dashboard/refund" },

    // { label: "Analytics", icon: FiBarChart2, path: "/dashboard/analytics" },
    { label: "Reviews", icon: FiStar, path: "/dashboard/reviews" },
    { label: "Messages", icon: FiMessageSquare, path: "/dashboard/messages" },
    { label: "Settings", icon: FiSettings, path: "/dashboard/settings" },
  ];
  const providerItem = [
    { label: "Dashboard", icon: FiGrid, path: "/dashboard" },

    { label: "Booking", icon: FiShoppingCart, path: "/dashboard/booking" },

    {
      label: "Calender",
      icon: SlCalender,
      path: "/dashboard/service-provider-dashboard/calender",
    },
    { label: "Payments", icon: FiCreditCard, path: "/dashboard/providerPayments" },
    { label: "Messages", icon: FiMessageSquare, path: "/dashboard/messages" },
    { label: "Reviews", icon: FiStar, path: "/dashboard/reviews" },
    { label: "Settings", icon: FiSettings, path: "/dashboard/settings" },
  ];

  const menuItems =
    role === "seller"
      ? sellerItem
      : role === "provider"
      ? providerItem
      : role === "admin"
      ? adminItem
      : [];

  return (
    <>
      {/* MOBILE OVERLAY */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 z-50 lg:z-20 
          h-full w-64 bg-white border-r border-[#ECECEC]
          flex flex-col pt-6 pb-6 px-4
          transition-all duration-300
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* LOGO */}
        <Link href="/">
          <div className="px-2 mb-8">
            <Image
              src="/logo.png"
              alt="Cresify Logo"
              width={170}
              height={32}
              className="rounded-xl mx-auto"
            />
          </div>
        </Link>

        {/* NAVIGATION */}
        <nav className="flex-1 overflow-y-auto scrollbar-hide space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;

            return (
              <Link
                key={item.label}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] transition-all
                  ${
                    isActive
                      ? "bg-[#F4F0FF] text-[#4C1D95] font-semibold shadow-sm"
                      : "text-[#6F6C90] hover:bg-[#F7F6FF]"
                  }
                `}
              >
                <item.icon
                  className={`text-[18px] ${
                    isActive ? "text-[#4C1D95]" : "text-[#6F6C90]"
                  }`}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* LOGOUT BUTTON */}
        <div className="border-t border-[#F1F1F1] pt-4 mt-4">
          <button 
          
          onClick={() => {
  signOut({
    callbackUrl: "/",
  });
}}

          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] text-[#FF6A3D] hover:bg-[#FFF3EC] transition">
            <FiLogOut className="text-[18px]" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
