"use client";

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

export default function Sidebar({ open, onClose }) {
  const pathname = usePathname(); // <-- Current route

  const menuItems = [
    { label: "Dashboard", icon: FiGrid, path: "/dashboard" },
    { label: "Admin Dashboard", icon: FiGrid, path: "/dashboard/admin-dashboard" },
    { label: "Users", icon: FiGrid, path: "/dashboard/admin-dashboard/users" },
    { label: "Products", icon: FiBox, path: "/dashboard/products" },
    { label: "Orders", icon: FiShoppingCart, path: "/dashboard/orders" },
    { label: "Store Profile", icon: FiUser, path: "/dashboard/store-profile" },
    { label: "Payments", icon: FiCreditCard, path: "/dashboard/payments" },
    { label: "Analytics", icon: FiBarChart2, path: "/dashboard/analytics" },
    { label: "Reviews", icon: FiStar, path: "/dashboard/reviews" },
    { label: "Messages", icon: FiMessageSquare, path: "/dashboard/messages" },
    { label: "Settings", icon: FiSettings, path: "/dashboard/settings" },
  ];

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed z-50 lg:z-20 top-0 left-0 h-full w-64 bg-white border-r 
          border-[#F0EEF7] flex flex-col px-4 pt-5 pb-4 transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Logo */}
        <div className="flex gap-2 px-2 mb-8">
          <Image
            src="/logo/logo2.png"
            alt="Cresify Logo"
            width={170}
            height={32}
            className="rounded-xl"
          />
        </div>

        {/* Menu */}
        <nav className="flex-1 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-transparent">
          {menuItems.map((item) => {
            const isActive =
              item.path === "/dashboard"
                ? pathname === "/dashboard" // Dashboard active ONLY on exact match
                : pathname.startsWith(item.path); // other items work normally

            return (
              <Link
                href={item.path}
                key={item.label}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-lg transition
                  ${
                    isActive
                      ? "bg-[#F4F0FF] text-[#4C1D95] font-semibold"
                      : "text-[#6F6C90] hover:bg-[#F6F5FF]"
                  }`}
              >
                <item.icon className="text-[18px]" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <button className="mt-4 flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-[#FF6A3D] hover:bg-[#FFF3EC]">
          <FiLogOut className="text-[18px]" />
          <span>Logout</span>
        </button>
      </aside>
    </>
  );
}
