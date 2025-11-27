"use client";

import {
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  CheckCircle2,
  Receipt,
} from "lucide-react";

export default function BookingPaymentPage() {
  return (
    <section className="w-full bg-[#F7F7FA] py-10 px-4">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
        {/* -------------------- LEFT COLUMN -------------------- */}
        <div className="space-y-8">
          {/* BOOKING DETAILS CARD */}
          <div className="bg-white rounded-[18px] border border-[#E9E5F4] shadow-[0_10px_30px_rgba(15,23,42,0.06)] p-6">
            <h3 className="flex items-center gap-2 text-[15px] font-semibold text-[#1B1B1B] mb-4">
              <User size={16} className="text-[#9838E1]" />
              Booking Details
            </h3>

            {/* Full Name */}
            <div className="space-y-1 mb-4">
              <label className="text-[12px] text-[#6A6A6A]">Full Name*</label>
              <input
                placeholder="yourname@example.com"
                className="w-full px-3 py-[10px] border border-[#E3E1ED] rounded-[10px] text-[13px] outline-none focus:border-[#9838E1]"
              />
            </div>

            {/* Email + Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-1">
                <label className="text-[12px] text-[#6A6A6A]">Email*</label>
                <div className="flex items-center gap-2 px-3 py-[10px] border border-[#E3E1ED] rounded-[10px]">
                  <Mail size={16} className="text-[#A3A3A3]" />
                  <input
                    className="flex-1 outline-none text-[13px]"
                    placeholder="youremail@example.com"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[12px] text-[#6A6A6A]">Telephone*</label>
                <div className="flex items-center gap-2 px-3 py-[10px] border border-[#E3E1ED] rounded-[10px]">
                  <Phone size={16} className="text-[#A3A3A3]" />
                  <input
                    className="flex-1 outline-none text-[13px]"
                    placeholder="+880"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-1 mb-4">
              <label className="text-[12px] text-[#6A6A6A]">Address*</label>
              <div className="flex items-center gap-2 px-3 py-[10px] border border-[#E3E1ED] rounded-[10px]">
                <MapPin size={16} className="text-[#A3A3A3]" />
                <input
                  className="flex-1 outline-none text-[13px]"
                  placeholder="Street, city, region"
                />
              </div>
            </div>

            {/* Country + City */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
              <div className="space-y-1">
                <label className="text-[12px] text-[#6A6A6A]">Country*</label>
                <select className="w-full px-3 py-[10px] border border-[#E3E1ED] rounded-[10px] text-[13px] outline-none">
                  <option>Select Country</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[12px] text-[#6A6A6A]">City*</label>
                <select className="w-full px-3 py-[10px] border border-[#E3E1ED] rounded-[10px] text-[13px] outline-none">
                  <option>Select City</option>
                </select>
              </div>
            </div>
          </div>

          {/* PAYMENT METHOD CARD */}
          <div className="bg-white rounded-[18px] border border-[#E9E5F4] shadow-[0_10px_30px_rgba(15,23,42,0.06)] p-6">
            <h3 className="text-[15px] font-semibold text-[#1B1B1B] mb-4 flex items-center gap-2">
              <CreditCard size={16} className="text-[#9838E1]" />
              Payment Method
            </h3>

            {/* Credit Card Option */}
            <div className="flex items-center justify-between px-4 py-3 rounded-[12px] border border-[#D7CBF5] bg-[#F9F6FF] mb-4 cursor-pointer">
              <div>
                <p className="text-[12px] font-semibold text-[#333]">
                  Credit/Debit Card
                </p>
                <p className="text-[10px] text-[#888]">
                  Visa, Mastercard, American Express
                </p>
              </div>
              <div className="h-[14px] w-[14px] rounded-full border-[3px] border-[#9838E1]" />
            </div>

            {/* Pay After Service */}
            <div className="flex items-center justify-between px-4 py-3 rounded-[12px] border border-[#E3E1ED] mb-4 cursor-pointer">
              <p className="text-[12px] text-[#333] font-medium">
                Pay after service
              </p>
              <div className="h-[14px] w-[14px] rounded-full border border-[#AAA]" />
            </div>

            {/* Card Number */}
            <div className="space-y-1 mb-3">
              <label className="text-[12px] text-[#6A6A6A]">Card Number*</label>
              <input
                className="w-full px-3 py-[10px] border border-[#E3E1ED] rounded-[10px] text-[13px] outline-none"
                placeholder="245513302878930"
              />
            </div>

            {/* Expiration + CVV */}
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div className="space-y-1">
                <label className="text-[12px] text-[#6A6A6A]">
                  Expiration Date*
                </label>
                <input
                  className="w-full px-3 py-[10px] border border-[#E3E1ED] rounded-[10px] outline-none text-[13px]"
                  placeholder="MM/AA"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[12px] text-[#6A6A6A]">CVV*</label>
                <input
                  className="w-full px-3 py-[10px] border border-[#E3E1ED] rounded-[10px] outline-none text-[13px]"
                  placeholder="123"
                />
              </div>
            </div>

            {/* Holder Name */}
            <div className="space-y-1 mb-4">
              <label className="text-[12px] text-[#6A6A6A]">
                Name of the Holder*
              </label>
              <input
                className="w-full px-3 py-[10px] border border-[#E3E1ED] rounded-[10px] outline-none text-[13px]"
                placeholder="Name of the card"
              />
            </div>

            {/* Security Line */}
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 size={15} className="text-[#52B788]" />
              <p className="text-[11px] text-[#777]">
                Your payment is protected by Stripe.
              </p>
            </div>

            {/* Checkbox */}
            <label className="flex items-center gap-2 text-[11px] text-[#777]">
              <input type="checkbox" />
              My billing address is the same as my shipping address
            </label>
          </div>
        </div>

        {/* ================= RIGHT SIDEBAR (3 CARDS) ================= */}
        <div className="w-full space-y-6">
          {/* ========== CARD 1: ORDER SUMMARY ========== */}
          <aside className="bg-white rounded-[18px] border border-[#E9E5F4] shadow-[0_10px_30px_rgba(15,23,42,0.06)] px-6 py-5">
            <h3 className="text-[14px] font-semibold text-[#1B1B1B] mb-4">
              Order Summary
            </h3>

            <div className="text-[11px] text-[#777] space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-[#333]">$120.00</span>
              </div>

              <div className="flex justify-between">
                <span>Shipment</span>
                <span className="text-[#333]">$5.00</span>
              </div>

              <div className="flex justify-between">
                <span>Tax (5%)</span>
                <span className="text-[#333]">$6.00</span>
              </div>
            </div>

            <div className="flex justify-between text-[12px] font-semibold mb-2">
              <span>Total</span>
              <span className="text-[#F78D25]">$131.00</span>
            </div>
          </aside>

          {/* ========== CARD 2: CUSTOMER INFORMATION ========== */}
          <aside className="bg-white rounded-[18px] border border-[#E9E5F4] shadow-[0_10px_30px_rgba(15,23,42,0.06)] px-6 py-5">
            <h3 className="text-[14px] font-semibold text-[#1B1B1B] mb-4">
              Customer Information
            </h3>

            <div className="space-y-4 text-[12px]">
              {/* Name */}
              <div className="flex items-start gap-3">
                <User size={16} className="text-[#9838E1] mt-[2px]" />
                <p className="text-[#333]">Sarah Ahmed</p>
              </div>

              {/* Address */}
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-[#9838E1] mt-[2px]" />
                <p className="text-[#333] leading-[16px]">
                  123 Main Road Rampura, Dhaka 1205,
                  <br /> Bangladesh
                </p>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-[#9838E1]" />
                <p className="text-[#333]">+8801555-975442</p>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-[#9838E1]" />
                <p className="text-[#333]">sarah.ahmed@gmail.com</p>
              </div>
            </div>
          </aside>

          {/* ========== CARD 3: PAYMENT DETAILS ========== */}
          <aside className="bg-white rounded-[18px] border border-[#E9E5F4] shadow-[0_10px_30px_rgba(15,23,42,0.06)] px-6 py-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-semibold text-[#1B1B1B]">
                Payment Details
              </h3>

              <button
                className="flex items-center gap-1 text-white text-[11px] px-3 py-[6px] rounded-[8px]"
                style={{ background: "linear-gradient(90deg,#9838E1,#F68E44)" }}
              >
                <Receipt size={14} />
                Invoice
              </button>
            </div>

            <div className="text-[12px] space-y-3">
              <div>
                <p className="text-[#6A6A6A]">Payment Method</p>
                <p className="text-[#333] mt-[2px]">Credit Card (Stripe)</p>
              </div>

              <div>
                <p className="text-[#6A6A6A]">Transaction ID</p>
                <p className="text-[#333] mt-[2px]">#PAYX-222415</p>
              </div>

              <div>
                <p className="text-[#6A6A6A]">Payment Status</p>
                <p className="text-[#2ECC71] mt-[2px]">Paid</p>
              </div>

              <div>
                <p className="text-[#6A6A6A]">Paid Amount</p>
                <p className="text-[#F78D25] font-semibold mt-[2px]">$87.00</p>
              </div>

              <div>
                <p className="text-[#6A6A6A]">Billing Address</p>
                <p className="text-[#333] mt-[2px]">Same as shipping</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
