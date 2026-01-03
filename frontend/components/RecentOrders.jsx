"use client";

import { usePaymentHistoryQuery } from "@/feature/seller/SellerApi";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { FiArrowRight } from "react-icons/fi";

export default function RecentOrders() {
  const { t } = useTranslation("admin");
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const router = useRouter();

  const { data: paymentHistory, isLoading } = usePaymentHistoryQuery(userId);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format amount
  const formatAmount = (amount) => {
    if (!amount) return "$0.00";
    return `$${parseFloat(amount.toString()).toFixed(2)}`;
  };

  // Get latest 5 transactions
  const getRecentTransactions = () => {
    if (!paymentHistory?.data || paymentHistory.data.length === 0) return [];
    const transactionsCopy = [...paymentHistory.data];
    transactionsCopy.sort(
      (a, b) =>
        new Date(b.createdAt || "").getTime() -
        new Date(a.createdAt || "").getTime()
    );
    return transactionsCopy.slice(0, 5);
  };

  const recentTransactions = getRecentTransactions();

  const handleViewAll = () => router.push("/dashboard/payments");

  // Loading state
  if (isLoading) {
    return (
      <div className='mt-3 overflow-x-auto rounded-xl'>
        <table className='min-w-full text-left text-[12px] md:text-[13px]'>
          <thead>
            <tr className='text-[#9838E1] bg-[#F8F4FD] border-b border-[#F0EEF7] text-xs uppercase tracking-[0.12em]'>
              <th>{t("dashboard.tables.orderId")}</th>
              <th>{t("dashboard.tables.amount")}</th>
              <th>{t("dashboard.tables.sellerPayout")}</th>
              <th>{t("dashboard.tables.status")}</th>
              <th>{t("dashboard.tables.date")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                colSpan={5}
                className='pl-2 py-6 pr-4 text-center text-gray-500'>
                {t("dashboard.tables.loading")}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  // Empty state
  if (recentTransactions.length === 0) {
    return (
      <div>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-[20px] font-semibold text-gray-900'>
            {t("dashboard.tables.recentOrders")}
          </h2>
          <button
            onClick={handleViewAll}
            className='flex items-center gap-2 text-[#9838E1] hover:text-[#7b2cbf] text-sm font-medium'>
            {t("dashboard.tables.viewAll")}
            <FiArrowRight className='text-[#9838E1]' />
          </button>
        </div>

        <div className='mt-3 overflow-x-auto rounded-xl'>
          <table className='min-w-full text-left text-[12px] md:text-[13px]'>
            <thead>
              <tr className='text-[#9838E1] bg-[#F8F4FD] border-b border-[#F0EEF7] text-xs uppercase tracking-[0.12em]'>
                <th>{t("dashboard.tables.orderId")}</th>
                <th>{t("dashboard.tables.amount")}</th>
                <th>{t("dashboard.tables.sellerPayout")}</th>
                <th>{t("dashboard.tables.status")}</th>
                <th>{t("dashboard.tables.date")}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  colSpan={5}
                  className='pl-2 py-6 pr-4 text-center text-gray-500'>
                  {t("dashboard.tables.empty")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Main table
  return (
    <div>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-[20px] font-semibold text-gray-900'>
          {t("dashboard.tables.recentOrders")}
        </h2>
        <button
          onClick={handleViewAll}
          className='flex items-center gap-2 text-[#9838E1] hover:text-[#7b2cbf] text-sm font-medium'>
          {t("dashboard.tables.viewAll")}
          <FiArrowRight className='text-[#9838E1]' />
        </button>
      </div>

      <div className='mt-3 overflow-x-auto rounded-xl'>
        <table className='min-w-full text-left text-[12px] md:text-[13px]'>
          <thead>
            <tr className='text-[#9838E1] bg-[#F8F4FD] border-b border-[#F0EEF7] text-xs uppercase tracking-[0.12em]'>
              <th className='py-6 pr-4 font-medium pl-2'>
                {t("dashboard.tables.orderId")}
              </th>
              <th className='py-6 pr-4 font-medium pl-2'>
                {t("dashboard.tables.amount")}
              </th>
              <th className='py-6 pr-4 font-medium pl-2'>
                {t("dashboard.tables.sellerPayout")}
              </th>
              <th className='py-6 pr-4 font-medium pl-2'>
                {t("dashboard.tables.status")}
              </th>
              <th className='py-6 pr-4 font-medium pl-2'>
                {t("dashboard.tables.date")}
              </th>
            </tr>
          </thead>
          <tbody className='text-[#4B4B63]'>
            {recentTransactions.map((txn, idx) => {
              let statusBadge = "";
              let statusKey = "";

              if (txn.status === "delivered" || txn.status === "paid") {
                statusBadge = "bg-[#E2FFE9] text-[#38A169]";
                statusKey = "paid";
              } else if (txn.status === "canceled") {
                statusBadge = "bg-[#FFE2E2] text-[#E53E3E]";
                statusKey = "canceled";
              } else {
                statusBadge = "bg-[#FFF1E2] text-[#F39C4A]";
                statusKey = "pending";
              }

              return (
                <tr
                  key={txn._id}
                  className={`border-b border-[#F5F4FB] ${
                    idx % 2 === 1 ? "" : "bg-white"
                  }`}>
                  <td className='pl-2 py-6 pr-4 font-medium'>
                    {txn.orderId ||
                      `TXN-${txn._id?.slice(-6).toUpperCase() || "N/A"}`}
                  </td>
                  <td className='pl-2 py-6 pr-4 text-[#F39C4A] font-semibold'>
                    {formatAmount(txn.amount)}
                  </td>
                  <td className='pl-2 py-6 pr-4 text-[#38A169] font-semibold'>
                    {formatAmount(txn.sellerPayout)}
                  </td>
                  <td className='pl-2 py-6 pr-4'>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${statusBadge}`}>
                      {t(`dashboard.status.${statusKey}`)}
                    </span>
                  </td>
                  <td className='py-6 pr-4 text-[#8C8CA1]'>
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
