"use client";

import {
  Check,
  Package,
  ShoppingBag,
  Truck,
  Home,
  PhoneCall,
  Mail,
} from "lucide-react";

export default function OrderConfirmationPage() {
  return (
    <main className="min-h-screen bg-[#F7F7FA] py-12 px-4">
      <div className="max-w-5xl mx-auto flex flex-col gap-10">

        {/* TOP CONFIRM CARD */}
        <section className="mx-auto w-full max-w-[440px]">
       <div className="pt-[3px] rounded-t-[20px] rounded-b-[40px] bg-gradient-to-r from-[#9838E1] to-[#F68E44]">
            <div className="bg-white rounded-[20px] shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-[#E9E5F4] px-10 pt-10 pb-6 text-center">
            {/* Icon */}
            <div className="mx-auto mb-5 flex h-[70px] w-[70px] items-center justify-center rounded-full bg-[linear-gradient(135deg,#9838E1,#F68E44)] shadow-[0_6px_18px_rgba(0,0,0,0.18)]">
              <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-white/10">
                <Check className="h-[26px] w-[26px] text-white" strokeWidth={2.5} />
              </div>
            </div>

            <h1 className="text-[20px] font-semibold text-[#262626] mb-2">
              Order Confirmed!
            </h1>

            <p className="text-[12px] leading-[18px] text-[#8B8B9A] mb-6">
              Thank you for your purchase. Your order has been placed
              successfully and is being processed.
              <br />
              You&apos;ll receive an email with your order details shortly.
            </p>

            {/* Redirect bar */}
            <div className="rounded-[10px] bg-[#F7F3FF] px-3 py-[10px] text-[11px] text-[#A26AF1] font-medium">
              ⟳ Redirecting to marketplace in 10 seconds.
            </div>
          </div>
          </div>
        </section>

        {/* ORDER SUMMARY CARD */}
        <section className="w-full">
          <div className="bg-white rounded-[20px] shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-[#E9E5F4] px-8 py-7">
            <div className="flex items-start justify-between mb-5">
              <h2 className="text-[13px] font-semibold text-[#262626]">
                Order Summary
              </h2>
              <button className="text-[11px] font-medium text-[#A26AF1] hover:underline">
                #X9ER834A3
              </button>
            </div>

            <div className="grid grid-cols-[1.1fr_1.1fr] gap-10 text-[11px]">
              {/* LEFT: meta table */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#F1ECF8] pb-2">
                  <span className="text-[#8B8B9A]">Order ID</span>
                  <span className="text-[#5B5B6B] font-medium">X9ER834A3</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#F1ECF8] pb-2">
                  <span className="text-[#8B8B9A]">Date</span>
                  <span className="text-[#5B5B6B]">November 18, 2025</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#F1ECF8] pb-2">
                  <span className="text-[#8B8B9A]">Payment Method</span>
                  <span className="text-[#5B5B6B]">
                    Credit Card (Stripe)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8B8B9A]">Status</span>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#EAF8EE]">
                      <Check className="h-[11px] w-[11px] text-[#41B883]" />
                    </span>
                    <span className="text-[#41B883] font-medium">Paid</span>
                  </div>
                </div>
              </div>

              {/* RIGHT: items ordered */}
              <div>
                <p className="text-[11px] font-semibold text-[#262626] mb-3">
                  Item Ordered
                </p>

                <div className="space-y-3 text-[11px]">
                  {/* Item 1 */}
                  <div className="flex items-center justify-between gap-3 border-b border-[#F1ECF8] pb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-[46px] w-[46px] rounded-[10px] overflow-hidden bg-[#F4F4F9]">
                        <img
                          src="/product/p1.jpg"
                          alt="Handmade Ceramic Vase"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-[#333] font-semibold">
                          Handmade Ceramic Vase
                        </p>
                        <p className="text-[#8B8B9A]">Quantity: 1</p>
                      </div>
                    </div>
                    <p className="text-[#F78D25] font-semibold">$45.00</p>
                  </div>

                  {/* Item 2 */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-[46px] w-[46px] rounded-[10px] overflow-hidden bg-[#F4F4F9]">
                        <img
                          src="/product/p2.jpg"
                          alt="Organic Honey Set"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-[#333] font-semibold">
                          Organic Honey Set
                        </p>
                        <p className="text-[#8B8B9A]">Quantity: 2</p>
                      </div>
                    </div>
                    <p className="text-[#F78D25] font-semibold">$42.00</p>
                  </div>
                </div>

                {/* Total amount */}
                <div className="mt-5 flex items-center justify-between text-[11px]">
                  <span className="text-[#8B8B9A]">Total Amount</span>
                  <span className="text-[#F78D25] font-semibold text-[13px]">
                    $87.00
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ORDER JOURNEY CARD */}
        <section className="w-full">
          <div className="bg-white rounded-[20px] border border-[#E9E5F4] shadow-[0_10px_40px_rgba(0,0,0,0.05)] px-10 py-5">
            <h3 className="text-[11px] font-semibold text-center text-[#262626] mb-5">
              Your Order Journey
            </h3>

            <div className="flex items-center justify-between">
              {/* Step helper */}
              {[
                { icon: ShoppingBag, label: "Ordered", active: true },
                { icon: Package, label: "Packed", active: true },
                { icon: Truck, label: "Shipped", active: false },
                { icon: Home, label: "Delivered", active: false },
              ].map((step, idx, arr) => {
                const Icon = step.icon;
                const isLast = idx === arr.length - 1;
                return (
                  <div key={step.label} className="flex flex-1 items-center">
                    <div className="flex flex-col items-center gap-1">
                      <div
                        className={
                          step.active
                            ? "flex h-[44px] w-[44px] items-center justify-center rounded-full bg-[linear-gradient(135deg,#9838E1,#F68E44)] shadow-[0_4px_14px_rgba(0,0,0,0.18)]"
                            : "flex h-[44px] w-[44px] items-center justify-center rounded-full bg-[#EEF0F7]"
                        }
                      >
                        <Icon
                          className={
                            step.active ? "text-white" : "text-[#9A9EB3]"
                          }
                          size={20}
                        />
                      </div>
                      <span
                        className={
                          step.active
                            ? "text-[11px] text-[#262626]"
                            : "text-[11px] text-[#A0A3B5]"
                        }
                      >
                        {step.label}
                      </span>
                    </div>

                    {!isLast && (
                      <div className="mx-4 h-[2px] flex-1 rounded-full bg-[#E4E6F2]">
                        {step.active && (
                          <div className="h-full w-1/2 rounded-full bg-[linear-gradient(90deg,#9838E1,#F68E44)]" />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* BOTTOM BUTTONS + HELP */}
        <section className="w-full flex flex-col items-center gap-5">
          {/* Buttons row */}
          <div className="flex w-full max-w-[480px] gap-4">
            <button
              className="flex-1 h-[60px] rounded-[12px] bg-[linear-gradient(135deg,#9838E1,#F68E44)]
              text-white text-[14px] font-medium shadow-[0_6px_18px_rgba(0,0,0,0.18)]"
            >
              Track My Order
            </button>

            <button
              className="flex-1 h-[60px] rounded-[12px] bg-white text-[14px] font-medium 
              bg-clip-text bg-[linear-gradient(135deg,#9838E1,#F68E44)]
              border border-[#A544CC] text-[#A544CC]
              shadow-[0_4px_14px_rgba(0,0,0,0.08)]"
            >
              Continue Shopping
            </button>
          </div>

          {/* Help card */}
          <div className="w-full max-w-[480px] bg-white rounded-[14px] border border-[#E9E5F4] shadow-[0_8px_28px_rgba(0,0,0,0.05)] px-6 py-4 text-center">
            <p className="text-[11px] text-[#8B8B9A] mb-2">
              Need help? If you have any questions about your order, feel free
              to contact us.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-5 text-[11px] font-medium">
              <a
                href="mailto:support@cresify.com"
                className="flex items-center gap-1 text-[#A26AF1]"
              >
                <Mail className="h-[14px] w-[14px]" />
                support@cresify.com
              </a>
              <span className="h-[14px] w-[1px] bg-[#E3E0F0]" />
              <a
                href="tel:+11234567890"
                className="flex items-center gap-1 text-[#A26AF1]"
              >
                <PhoneCall className="h-[14px] w-[14px]" />
                +1 (123) 456-7890
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
