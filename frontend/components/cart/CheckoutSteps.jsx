"use client";

import { ShoppingCart, CreditCard, CheckCircle } from "lucide-react";

export default function CheckoutSteps() {
  return (
    <div className="w-full bg-white py-10 px-6">
      <div className="max-w-[1300px] mx-auto">
        

        {/* STEPPER */}
        <div className="flex items-center justify-center gap-10">
          {/* STEP 1 — ACTIVE */}
          <div className="flex items-center gap-3">
            <div
              className="
                w-[38px] h-[38px] rounded-full flex items-center justify-center
                bg-gradient-to-r from-[#9838E1] to-[#F68E44]
                shadow-[0_3px_10px_rgba(0,0,0,0.15)]
              "
            >
              <ShoppingCart size={18} className="text-white" />
            </div>
            <span className="text-[#1B1B1B] text-[15px] font-medium">Cart</span>
          </div>

          {/* LINE */}
          <div className="w-[80px] h-[2px] bg-[#E3E3E3]" />

          {/* STEP 2 — INACTIVE */}
          <div className="flex items-center gap-3 opacity-60">
            <div
              className="
                w-[38px] h-[38px] rounded-full flex items-center justify-center
                bg-[#F1F1F1] border border-[#E0E0E0]
              "
            >
              <CreditCard size={18} className="text-[#7B7B7B]" />
            </div>
            <span className="text-[#7B7B7B] text-[15px]">Checkout</span>
          </div>

          {/* LINE */}
          <div className="w-[80px] h-[2px] bg-[#E3E3E3]" />

          {/* STEP 3 — INACTIVE */}
          <div className="flex items-center gap-3 opacity-60">
            <div
              className="
                w-[38px] h-[38px] rounded-full flex items-center justify-center
                bg-[#F1F1F1] border border-[#E0E0E0]
              "
            >
              <CheckCircle size={18} className="text-[#7B7B7B]" />
            </div>
            <span className="text-[#7B7B7B] text-[15px]">Confirmation</span>
          </div>
        </div>
      </div>
    </div>
  );
}
