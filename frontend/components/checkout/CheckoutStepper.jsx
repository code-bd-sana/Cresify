"use client";

import { ShoppingCart, CreditCard, CheckCircle } from "lucide-react";

export default function CheckoutStepper() {
  return (
    <div className="w-full py-10 px-6">

      <div className="flex items-center justify-center gap-6">

        {/* CART — Completed */}
        <div className="flex items-center gap-2">

          {/* Icon */}
          <div className="
            w-[34px] h-[34px] rounded-full
            bg-gradient-to-r from-[#9838E1] to-[#F68E44]
            flex items-center justify-center
            shadow-[0px_4px_10px_rgba(0,0,0,0.15)]
          ">
            <ShoppingCart size={16} className="text-white" />
          </div>

          {/* Text */}
          <span className="text-[14px] font-medium text-[#000]">
            Cart
          </span>
        </div>

        {/* LINE (active gradient) */}
        <div className="
          w-[90px] h-[4px] rounded-full
          bg-gradient-to-r from-[#9838E1] to-[#F68E44]
        "></div>

        {/* CHECKOUT — Active */}
        <div className="flex items-center gap-2">

          <div className="
            w-[34px] h-[34px] rounded-full
            bg-gradient-to-r from-[#9838E1] to-[#F68E44]
            flex items-center justify-center
            shadow-[0px_4px_10px_rgba(0,0,0,0.15)]
          ">
            <CreditCard size={16} className="text-white" />
          </div>

          <span className="text-[14px] font-medium text-[#9838E1]">
            Checkout
          </span>
        </div>

        {/* LINE (upcoming gray) */}
        <div className="w-[90px] h-[4px] rounded-full bg-[#E6E6E9]"></div>

        {/* CONFIRMATION — Inactive */}
        <div className="flex items-center gap-2">
          <div className="
            w-[34px] h-[34px] rounded-full
            bg-[#E6E6E9]
            flex items-center justify-center
          ">
            <CheckCircle size={16} className="text-[#6B6B6B]" />
          </div>

          <span className="text-[14px] font-medium text-[#6B6B6B]">
            Confirmation
          </span>
        </div>

      </div>

    </div>
  );
}
