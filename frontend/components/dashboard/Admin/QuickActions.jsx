"use client";

import { LuUserPlus, LuShieldCheck, LuWallet } from "react-icons/lu";
import { PiBagSimpleBold } from "react-icons/pi";
import { FaHandHoldingHeart } from "react-icons/fa";

const actions = [
  { id: 1, label: "Approve Seller", icon: LuUserPlus },
  { id: 2, label: "Approve Product", icon: PiBagSimpleBold },
  { id: 3, label: "Approve services", icon: FaHandHoldingHeart },
  { id: 4, label: "Need Verification", icon: LuShieldCheck },
  { id: 5, label: "Payment", icon: LuWallet },
];

export default function QuickActions() {
  return (
    <div>
      <h2 className="text-[16px] font-semibold text-gray-900 mb-3">
        Quick Actions
      </h2>

      <div className="flex flex-wrap gap-5">
        {actions.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className="
                w-[230px] h-[90px]
                rounded-xl
                bg-gradient-to-r from-[#8736C5] via-[#9C47C6] to-[#F88D25]
                text-white
                flex items-center justify-between
                px-6
                shadow-sm
                cursor-pointer
                hover:opacity-90 transition
              "
            >
              {/* Left side: Icon + Label */}
              <div className="flex items-center gap-3">
                <Icon className="text-[26px]" />
                <span className="text-[15px] font-medium leading-none">
                  {item.label}
                </span>
              </div>

              {/* Right side: Notification badge */}
              <div
                className="
                  w-[32px] h-[32px]
                  bg-white/30
                  rounded-full
                  flex items-center justify-center
                  text-[14px] font-semibold
                "
              >
                12
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
