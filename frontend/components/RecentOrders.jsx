"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { usePaymentHistoryQuery } from "@/feature/seller/SellerApi";
import { useRouter } from "next/navigation";
import { FiArrowRight } from "react-icons/fi";

export default function RecentOrders() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const router = useRouter();
  
  const { data: paymentHistory, isLoading } = usePaymentHistoryQuery(userId);
  
  // Format date exactly like Payments component
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  
  // Format amount exactly like Payments component
  const formatAmount = (amount) => {
    if (!amount) return "$0.00";
    return `$${parseFloat(amount).toFixed(2)}`;
  };
  
  // Get latest 5 transactions from API data
  const getRecentTransactions = () => {
    if (!paymentHistory?.data || paymentHistory.data.length === 0) {
      return [];
    }
    
    // Create a copy and sort by date (newest first)
    const transactionsCopy = [...paymentHistory.data];
    transactionsCopy.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
    
    // Take only the latest 5 transactions
    return transactionsCopy.slice(0, 5);
  };
  
  const recentTransactions = getRecentTransactions();
  
  const handleViewAll = () => {
    router.push("/dashboard/payments");
  };
  
  if (isLoading) {
    return (
      <div className="mt-3 overflow-x-auto rounded-xl">
        <table className="min-w-full text-left text-[12px] md:text-[13px]">
          <thead>
            <tr className="text-[#9838E1] bg-[#F8F4FD] border-b border-[#F0EEF7] text-xs uppercase tracking-[0.12em]">
              <th className="py-6 pr-4 font-medium pl-2">Order ID</th>
              <th className="py-6 pr-4 font-medium pl-2">Amount</th>
              <th className="py-6 pr-4 font-medium pl-2">Seller Payout</th>
              <th className="py-6 pr-4 font-medium pl-2">Status</th>
              <th className="py-6 pr-4 font-medium pl-2">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5} className="pl-2 py-6 pr-4 text-center text-gray-500">
                Loading transactions...
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
  
  if (recentTransactions.length === 0) {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[20px] font-semibold text-gray-900">Recent Transactions</h2>
          <button
            onClick={handleViewAll}
            className="flex items-center gap-2 text-[#9838E1] hover:text-[#7b2cbf] text-sm font-medium"
          >
            View All
            <FiArrowRight className="text-[#9838E1]" />
          </button>
        </div>
        
        <div className="mt-3 overflow-x-auto rounded-xl">
          <table className="min-w-full text-left text-[12px] md:text-[13px]">
            <thead>
              <tr className="text-[#9838E1] bg-[#F8F4FD] border-b border-[#F0EEF7] text-xs uppercase tracking-[0.12em]">
                <th className="py-6 pr-4 font-medium pl-2">Order ID</th>
                <th className="py-6 pr-4 font-medium pl-2">Amount</th>
                <th className="py-6 pr-4 font-medium pl-2">Seller Payout</th>
                <th className="py-6 pr-4 font-medium pl-2">Status</th>
                <th className="py-6 pr-4 font-medium pl-2">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5} className="pl-2 py-6 pr-4 text-center text-gray-500">
                  No transactions found
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[20px] font-semibold text-gray-900">Recent Transactions</h2>
        <button
          onClick={handleViewAll}
          className="flex items-center gap-2 text-[#9838E1] hover:text-[#7b2cbf] text-sm font-medium"
        >
          View All
          <FiArrowRight className="text-[#9838E1]" />
        </button>
      </div>
      
      <div className="mt-3 overflow-x-auto rounded-xl">
        <table className="min-w-full text-left text-[12px] md:text-[13px]">
          <thead>
            <tr className="text-[#9838E1] bg-[#F8F4FD] border-b border-[#F0EEF7] text-xs uppercase tracking-[0.12em]">
              <th className="py-6 pr-4 font-medium pl-2">Order ID</th>
              <th className="py-6 pr-4 font-medium pl-2">Amount</th>
              <th className="py-6 pr-4 font-medium pl-2">Seller Payout</th>
              <th className="py-6 pr-4 font-medium pl-2">Status</th>
              <th className="py-6 pr-4 font-medium pl-2">Date</th>
            </tr>
          </thead>
          <tbody className="text-[#4B4B63]">
            {recentTransactions.map((txn, idx) => {
              // Get status badge color exactly like Payments component
              let statusBadge = "";
              let statusText = "";
              
              if (txn.status === "delivered" || txn.status === "paid") {
                statusBadge = "bg-[#E2FFE9] text-[#38A169]";
                statusText = "Paid";
              } else if (txn.status === "canceled") {
                statusBadge = "bg-[#FFE2E2] text-[#E53E3E]";
                statusText = "Canceled";
              } else {
                statusBadge = "bg-[#FFF1E2] text-[#F39C4A]";
                statusText = "Pending";
              }
              
              return (
                <tr
                  key={txn._id}
                  className={`border-b border-[#F5F4FB] ${
                    idx % 2 === 1 ? "" : "bg-white"
                  }`}
                >
                  <td className="pl-2 py-6 pr-4 font-medium">
                    {txn.orderId || `TXN-${txn._id?.substring(txn._id.length - 6)?.toUpperCase() || "N/A"}`}
                  </td>
                  <td className="pl-2 py-6 pr-4 text-[#F39C4A] font-semibold">
                    {formatAmount(txn.amount)}
                  </td>
                  <td className="pl-2 py-6 pr-4 text-[#38A169] font-semibold">
                    {formatAmount(txn.sellerPayout)}
                  </td>
                  <td className="pl-2 py-6 pr-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${statusBadge}`}
                    >
                      {statusText}
                    </span>
                  </td>
                  <td className="py-6 pr-4 text-[#8C8CA1]">
                    {formatDate(txn.createdAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}