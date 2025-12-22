"use client";

import {
  User,
  BarChart3,
  ShoppingBag,
  CalendarCheck2,
  Heart,
  CreditCard,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { CiChat2 } from "react-icons/ci";
import { TbReceiptRefund } from "react-icons/tb";

export default function Sidebar({ active, setActive }) {
  const menu = [
    { key: "overview", label: "Profile Overview", icon: User },
    { key: "stats", label: "Account  Statistics", icon: BarChart3 },
    { key: "orders", label: "My Orders", icon: ShoppingBag },
    { key: "booking", label: "My Booking", icon: CalendarCheck2 },
    { key: "wishlist", label: "Wishlist", icon: Heart },
    { key: "chat", label: "chat", icon:  CiChat2 },
    { key: "refund", label: "Refund", icon: TbReceiptRefund  },
    // { key: "payments", label: "Payment Methods", icon: CreditCard },
  ];

  return (
    <aside className="bg-white rounded-[18px] border border-[#E9E5F4] shadow-[0_6px_20px_rgba(0,0,0,0.06)] px-4 py-6 h-fit w-full">

      {/* MENU BUTTONS */}
      <div className="space-y-1">
        {menu.map((item) => {
          const Icon = item.icon;

          const isActive = active === item.key;

          return (
            <button
              key={item.key}
              onClick={() => setActive(item.key)}
              className={`
                w-full flex items-center gap-3 px-4 py-[10px] rounded-[10px]
                text-left text-[14px] transition-all cursor-pointer
                ${
                  isActive
                    ? "bg-[#F4EDFF] text-[#9838E1] font-medium"
                    : "text-[#5C5C5C] hover:bg-[#F7F5FB]"
                }
              `}
            >
              <Icon
                size={17}
                className={`${isActive ? "text-[#9838E1]" : "text-[#5C5C5C]"}`}
              />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* DIVIDER */}
      <div className="w-full border-t border-[#F3E7FF] my-4"></div>

      {/* LOGOUT */}
      <button
      onClick={()=>{
        signOut();
      }}
        className="flex items-center gap-3 px-4 py-[10px] w-full text-left text-[14px]
        text-[#F78D25] font-medium hover:bg-orange-50 rounded-[10px]"
      >
        <LogOut size={17} className="text-[#F78D25]" />
        Logout
      </button>
    </aside>
  );
}
