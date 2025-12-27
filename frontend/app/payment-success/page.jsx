"use client";

import React from "react";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

const PaymentSuccessPage = () => {
  return (
    <section className="w-full min-h-screen bg-[#F7F7FA] flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8 text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <CheckCircle size={60} className="text-[#32A35A]" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-[#1B1B1B] mb-2">
          Payment Successful!
        </h1>

        {/* Message */}
        <p className="text-[#6B6B6B] mb-6">
          Thank you for your purchase. Your payment has been successfully processed.
        </p>

        {/* Order Summary / Continue Shopping */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {/* <Link
            href="/orders"
            className="px-6 py-3 bg-[#9838E1] text-white font-medium rounded-lg shadow-md hover:opacity-90 transition"
          >
            View Order
          </Link> */}

            

          <Link
            href="/"
            className="px-6 py-3 border border-[#9838E1] text-[#9838E1] font-medium rounded-lg hover:bg-[#F2E9FF] transition"
          >
      Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PaymentSuccessPage;
