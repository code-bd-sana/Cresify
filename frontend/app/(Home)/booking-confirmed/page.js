"use client";

import {
  CheckCircle,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

export default function BookingConfirmedPage() {
  return (
    <section className="w-full bg-[#F7F7FA] py-16 px-6 flex flex-col items-center">

      {/* ========= TOP CONFIRMATION CARD ========= */}
      <div className="pt-[3px] rounded-t-[24px] rounded-b-[400px] bg-gradient-to-r from-[#9838E1] to-[#F68E44] mb-14">
        <div className="w-full max-w-[500px] bg-white rounded-[20px] border border-[#E9E5F4] shadow-[0_10px_40px_rgba(15,23,42,0.08)] px-10 py-12 text-center">
        
        {/* Circle Icon */}
        <div
          className="mx-auto h-[78px] w-[78px] rounded-full flex items-center justify-center shadow-[0_6px_20px_rgba(0,0,0,0.12)] mb-6"
          style={{
            background: "linear-gradient(180deg,#9838E1,#F68E44)",
          }}
        >
          <CheckCircle size={36} className="text-white" />
        </div>

        <h2 className="text-[20px] font-semibold text-[#1B1B1B]">
          Booking Confirmed!
        </h2>
        <p className="text-[13px] text-[#777] mt-2">
          Your service has been successfully booked
        </p>

        <p className="text-[12px] text-[#999] mt-1">
          You’ll receive a confirmation email with your order details shortly.
        </p>

        {/* Redirect Notice */}
        <div className="w-full mt-6 bg-[#F6F1FF] text-[#A475E4] text-[12px] py-3 rounded-[8px]">
          Redirecting to services in <span className="font-semibold">10 seconds.</span>
        </div>
      </div>
      </div>

      {/* ========= SUMMARY CARD ========= */}
      <div className="w-full max-w-[950px] bg-white rounded-[16px] border border-[#E9E5F4] shadow-[0_10px_30px_rgba(15,23,42,0.06)] px-10 py-10 mb-12">

        <div className="grid grid-cols-2 gap-10">

          {/* LEFT SIDE */}
          <div>
            <h3 className="text-[14px] font-semibold text-[#1B1B1B] mb-4">Order Summary</h3>

            <div className="text-[12px] text-[#777] space-y-5">

              <div className="flex justify-between">
                <span>Booking ID</span>
                <span className="text-[#9838E1] font-medium">BOOK23987</span>
              </div>

              <div className="flex justify-between">
                <span>Date</span>
                <span className="text-[#333]">November 13, 2025</span>
              </div>

              <div className="flex justify-between">
                <span>Payment Method</span>
                <span className="text-[#333]">Credit Card (Stripe)</span>
              </div>

              <div className="flex justify-between">
                <span>Status</span>
                <span className="text-[#F78D25]">Pending</span>
              </div>

              <div className="pt-2 border-t border-[#F1ECF8] flex justify-between text-[13px] font-semibold">
                <span>Total Amount</span>
                <span className="text-[#F78D25]">$87.00</span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div>
            <h3 className="text-[14px] font-semibold text-[#1B1B1B] mb-4">Book Service</h3>

            <div className="flex justify-between items-start">

              {/* Service details */}
              <div className="flex items-center gap-3">
                <div className="h-[48px] w-[48px] rounded-[12px] overflow-hidden bg-[#F2F2F7]">
                  <img
                    src="/services/serv1.jpg"
                    alt="Smart Electricians"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div>
                  <p className="text-[12px] font-semibold text-[#1B1B1B]">
                    Smart Electricians
                  </p>
                  <p className="text-[12px] text-[#777]">Electrical</p>
                </div>
              </div>

              <p className="text-[13px] font-semibold text-[#F78D25]">$55.00</p>
            </div>
          </div>
        </div>
      </div>

      {/* ========= BUTTONS (BOOK SERVICES / CONTINUE SHOPPING) ========= */}
      <div className="flex items-center gap-4 mb-12">

        {/* Book Services */}
        <button
          className="h-[48px] w-[180px] rounded-[10px] font-medium text-[13px] text-white shadow-[0_8px_22px_rgba(0,0,0,0.15)] flex items-center justify-center gap-2"
          style={{
            background: "linear-gradient(90deg,#9838E1,#F68E44)",
          }}
        >
          Book Services
          <ArrowRight size={16} />
        </button>

        {/* Continue Shopping */}
        <button className="h-[48px] w-[180px] rounded-[10px] border border-[#E3DDF7] text-[#9838E1] font-medium text-[13px]">
          Continue Shopping
        </button>

      </div>

      {/* ========= NEED HELP BOX ========= */}
      <div className="w-full max-w-[480px] bg-white rounded-[14px] border border-[#E9E5F4] shadow-[0_8px_20px_rgba(0,0,0,0.06)] px-8 py-6 text-center">

        <p className="text-[12px] text-[#777]">Need Help?</p>
        <p className="text-[11px] text-[#888] mt-1">
          If you have any questions related to this order, feel free to contact us.
        </p>

        <div className="flex items-center justify-center gap-6 mt-4 text-[12px] text-[#9838E1]">
          <p>support@mail.com</p>
          <p>+1 (234) 789 9876</p>
        </div>

      </div>

    </section>
  );
}
