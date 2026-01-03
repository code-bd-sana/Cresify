"use client";
import Pagination from "@/components/Pagination";
import { usePaymentHistoryQuery } from "@/feature/seller/SellerApi";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiDollarSign } from "react-icons/fi";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { MdTrendingUp } from "react-icons/md";

export default function Payments() {
  const { t } = useTranslation();
  const { data: user } = useSession();
  const id = user?.user?.id;

  // Pagination state
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const {
    data: paymentHistory,
    isLoading,
    isError,
    refetch,
  } = usePaymentHistoryQuery(id);

  // Client-side pagination
  const [displayedTransactions, setDisplayedTransactions] = useState([]);

  useEffect(() => {
    if (paymentHistory?.data) {
      let filtered = paymentHistory.data;

      // Apply search filter
      if (search) {
        filtered = filtered.filter(
          (txn) =>
            txn.orderId?.toLowerCase().includes(search.toLowerCase()) ||
            txn._id?.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Apply pagination
      const start = page * limit;
      const end = start + limit;
      setDisplayedTransactions(filtered.slice(start, end));
    }
  }, [paymentHistory, page, limit, search]);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format amount (cents to dollars)
  const formatAmount = (cents) => {
    if (!cents && cents !== 0) return "$0.00";
    return `$${cents.toFixed(2)}`;
  };

  // Calculate statistics from API data
  const calculateStats = () => {
    if (!paymentHistory?.data) {
      return {
        totalEarnings: 0,
        thisMonth: 0,
        lastMonth: 0,
        avgMonthly: 0,
        availableBalance: 0,
        paidCount: 0,
        pendingCount: 0,
        canceledCount: 0,
        totalTransactions: 0,
      };
    }

    const transactions = paymentHistory.data;
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    let totalEarnings = 0;
    let thisMonthEarnings = 0;
    let lastMonthEarnings = 0;
    let paidCount = 0;
    let pendingCount = 0;
    let canceledCount = 0;

    transactions.forEach((txn) => {
      const amount = txn.sellerPayout || txn.amount || 0;
      const txnDate = new Date(txn.createdAt || txn.updatedAt);
      const txnMonth = txnDate.getMonth();
      const txnYear = txnDate.getFullYear();

      totalEarnings += amount;

      if (txnYear === currentYear && txnMonth === currentMonth) {
        thisMonthEarnings += amount;
      }

      if (txnYear === lastMonthYear && txnMonth === lastMonth) {
        lastMonthEarnings += amount;
      }

      if (txn.status === "delivered" || txn.status === "paid") {
        paidCount++;
      } else if (txn.status === "canceled") {
        canceledCount++;
      } else {
        pendingCount++;
      }
    });

    const avgMonthly =
      transactions.length > 0 ? totalEarnings / transactions.length : 0;

    return {
      totalEarnings,
      thisMonth: thisMonthEarnings,
      lastMonth: lastMonthEarnings,
      avgMonthly,
      availableBalance: totalEarnings,
      paidCount,
      pendingCount,
      canceledCount,
      totalTransactions: transactions.length,
    };
  };

  const stats = calculateStats();
  const allTransactions = paymentHistory?.data || [];

  // Calculate filtered transactions for pagination
  const filteredTransactions = search
    ? allTransactions.filter(
        (txn) =>
          txn.orderId?.toLowerCase().includes(search.toLowerCase()) ||
          txn._id?.toLowerCase().includes(search.toLowerCase())
      )
    : allTransactions;

  const totalPages = Math.ceil(filteredTransactions.length / limit);
  const currentItems = displayedTransactions.length;

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0); // Reset to first page on new search
  };

  // Handle limit change
  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setPage(0); // Reset to first page when changing limit
  };

  // Get translated status text from seller.json
  const getTranslatedStatus = (status) => {
    if (status === "delivered" || status === "paid") {
      return t("seller:payments.summary.paid", "Paid");
    } else if (status === "canceled") {
      return t("seller:payments.summary.canceled", "Canceled");
    }
    return t("seller:payments.summary.pending", "Pending");
  };

  if (isLoading) {
    return (
      <div className='w-full min-h-screen px-2 pt-6'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>
            {t("seller:recentOrders.loading", "Loading...")}
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='w-full min-h-screen px-2 pt-6'>
        <div className='text-center text-red-600'>
          <p>
            {t("seller:recentOrders.empty", "Error loading payment history")}
          </p>
          <button
            onClick={() => refetch()}
            className='mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition'>
            {t("common:retry", "Retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full min-h-screen px-2 pt-6'>
      {/* HEADER */}
      <div>
        <h1 className='text-[28px] font-semibold text-[#1D1D1F]'>
          {t("seller:payments.title", "Payments")}
        </h1>
        <p className='text-[#A78BFA] text-sm mt-1'>
          {t(
            "seller:payments.subtitle",
            "Track your earning and transaction history"
          )}
        </p>
      </div>

      {/* TOTAL EARNING CARD */}
      <div
        className='bg-white mt-8 w-full rounded-[14px] border border-[#EEEAF5] shadow-[0_4px_22px_rgba(0,0,0,0.06)] p-6 
        bg-gradient-to-r from-[#EDE4FF] via-[#F8F3FF] to-[#F2ECDD]'>
        <p className='text-sm text-[#1D1D1F] font-medium'>
          {t("seller:payments.summary.totalEarning", "Total Earning")}
        </p>
        <h2 className='text-[32px] font-semibold text-[#F39C4A] mt-1'>
          {formatAmount(stats.totalEarnings)}
        </h2>
        <p className='text-sm text-[#8A72BE] mt-1'>
          {t("seller:payments.summary.availableBalance", "Available Balance")}:{" "}
          <span className='text-[#8A72BE]'>
            {formatAmount(stats.availableBalance)}
          </span>
        </p>
        <div className='flex gap-4 mt-3'>
          <span className='text-xs px-2 py-1 bg-[#E2FFE9] text-[#38A169] rounded-full'>
            {t("seller:payments.summary.paid", "Paid")}: {stats.paidCount}
          </span>
          <span className='text-xs px-2 py-1 bg-[#FFF1E2] text-[#F39C4A] rounded-full'>
            {t("seller:payments.summary.pending", "Pending")}:{" "}
            {stats.pendingCount}
          </span>
          <span className='text-xs px-2 py-1 bg-[#FFE2E2] text-[#E53E3E] rounded-full'>
            {t("seller:payments.summary.canceled", "Canceled")}:{" "}
            {stats.canceledCount}
          </span>
          <span className='text-xs px-2 py-1 bg-[#EBF4FF] text-[#3182CE] rounded-full'>
            {t("seller:payments.summary.total", "Total")}:{" "}
            {stats.totalTransactions}
          </span>
        </div>
      </div>

      {/* SMALL CARDS */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-8'>
        {/* This Month */}
        <div className='bg-white rounded-[14px] border border-[#EEEAF5] shadow-[0_4px_22px_rgba(0,0,0,0.06)] p-6 flex items-center gap-4'>
          <div className='w-12 h-12 rounded-xl bg-[#F4EBFF] flex items-center justify-center'>
            <FiDollarSign className='text-[#C39BFF] text-2xl' />
          </div>
          <div>
            <p className='text-sm text-[#1D1D1F] font-medium'>
              {t("seller:payments.stats.thisMonth", "This Month")}
            </p>
            <h3 className='text-[22px] font-semibold text-[#F39C4A]'>
              {formatAmount(stats.thisMonth)}
            </h3>
          </div>
        </div>

        {/* Last Month */}
        <div className='bg-white rounded-[14px] border border-[#EEEAF5] shadow-[0_4px_22px_rgba(0,0,0,0.06)] p-6 flex items-center gap-4'>
          <div className='w-12 h-12 rounded-xl bg-[#FFF3EB] flex items-center justify-center'>
            <HiOutlineShoppingCart className='text-[#F3A96B] text-2xl' />
          </div>
          <div>
            <p className='text-sm text-[#1D1D1F] font-medium'>
              {t("seller:payments.stats.lastMonth", "Last Month")}
            </p>
            <h3 className='text-[22px] font-semibold text-[#F39C4A]'>
              {formatAmount(stats.lastMonth)}
            </h3>
          </div>
        </div>

        {/* Avg Monthly */}
        <div className='bg-white rounded-[14px] border border-[#EEEAF5] shadow-[0_4px_22px_rgba(0,0,0,0.06)] p-6 flex items-center gap-4'>
          <div className='w-12 h-12 rounded-xl bg-[#EDF8FF] flex items-center justify-center'>
            <MdTrendingUp className='text-[#4F9EFF] text-2xl' />
          </div>
          <div>
            <p className='text-sm text-[#1D1D1F] font-medium'>
              {t("seller:payments.stats.avgMonthly", "Avg Monthly")}
            </p>
            <h3 className='text-[22px] font-semibold text-[#F39C4A]'>
              {formatAmount(stats.avgMonthly)}
            </h3>
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className='bg-white rounded-[14px] border border-[#EEEAF5] shadow-[0_4px_22px_rgba(0,0,0,0.06)] p-6 mt-10'>
        <div className='flex flex-col md:flex-row gap-4 justify-between items-center mb-6'>
          <div className='w-full md:w-auto'>
            <form onSubmit={handleSearch} className='flex gap-2'>
              <input
                type='text'
                placeholder={t(
                  "seller:payments.searchPlaceholder",
                  "Search by Order ID or Transaction ID..."
                )}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
              />
              <button
                type='submit'
                className='px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition'>
                {t("seller:payments.searchButton", "Search")}
              </button>
              {search && (
                <button
                  type='button'
                  onClick={() => {
                    setSearch("");
                    setPage(0);
                  }}
                  className='px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition'>
                  Clear
                </button>
              )}
            </form>
          </div>

          <div className='flex items-center gap-2'>
            <span className='text-sm text-gray-600'>
              {t("seller:payments.tableControls.show", "Show")}:
            </span>
            <select
              value={limit}
              onChange={handleLimitChange}
              className='px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'>
              <option value='10'>10</option>
              <option value='20'>20</option>
              <option value='50'>50</option>
              <option value='100'>100</option>
            </select>
            <span className='text-sm text-gray-600'>
              {t("seller:payments.tableControls.perPage", "per page")}
            </span>
          </div>
        </div>

        {/* Transaction Summary */}
        <div className='mb-4 p-4 bg-gray-50 rounded-lg'>
          <div className='flex flex-wrap gap-4 text-sm'>
            <div>
              <span className='text-gray-600'>
                {t(
                  "seller:payments.pagination.totalTransactions",
                  "Total Transactions"
                )}
                :
              </span>
              <span className='ml-2 font-semibold'>
                {filteredTransactions.length}
              </span>
            </div>
            <div>
              <span className='text-gray-600'>
                {t("seller:productsPage.pagination.showing", "Showing")}:
              </span>
              <span className='ml-2 font-semibold'>
                {displayedTransactions.length > 0
                  ? `${page * limit + 1}-${
                      page * limit + displayedTransactions.length
                    }`
                  : "0"}
              </span>
            </div>
            <div>
              <span className='text-gray-600'>
                {t("seller:payments.pagination.totalPages", "Total Pages")}:
              </span>
              <span className='ml-2 font-semibold'>{totalPages}</span>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className='overflow-auto'>
          <table className='w-full min-w-[800px]'>
            <thead>
              <tr className='text-left bg-[#F9F5FF] text-[#A78BFA] text-sm'>
                <th className='py-3 px-4 font-medium'>
                  {t(
                    "seller:wallet.transactions.table.transaction",
                    "TRANSACTION ID"
                  )}
                </th>
                <th className='py-3 px-4 font-medium'>
                  {t("seller:table.orderId", "ORDER ID")}
                </th>
                <th className='py-3 px-4 font-medium'>
                  {t("seller:table.amount", "AMOUNT")}
                </th>
                <th className='py-3 px-4 font-medium'>
                  {t("seller:table.sellerPayout", "SELLER PAYOUT")}
                </th>
                <th className='py-3 px-4 font-medium'>
                  {t("seller:payments.summary.commission", "COMMISSION")}
                </th>
                <th className='py-3 px-4 font-medium'>
                  {t("seller:table.status", "STATUS")}
                </th>
                <th className='py-3 px-4 font-medium'>
                  {t("seller:table.date", "DATE")}
                </th>
              </tr>
            </thead>

            <tbody>
              {displayedTransactions.length === 0 ? (
                <tr>
                  <td colSpan='7' className='py-8 text-center text-gray-500'>
                    {search
                      ? t(
                          "seller:productsPage.pagination.noResults",
                          "No results found"
                        )
                      : t("seller:recentOrders.empty", "No transactions found")}
                  </td>
                </tr>
              ) : (
                displayedTransactions.map((txn, idx) => (
                  <tr
                    key={txn._id}
                    className='border-b border-[#EDECF5] hover:bg-gray-50'>
                    <td className='py-4 px-4 text-[#1D1D1F]'>
                      TXN-{txn._id.substring(txn._id.length - 6).toUpperCase()}
                    </td>
                    <td className='py-4 px-4 text-[#1D1D1F] font-medium'>
                      {txn.orderId}
                    </td>
                    <td className='py-4 px-4 text-[#F39C4A] font-semibold'>
                      {formatAmount(txn.amount)}
                    </td>
                    <td className='py-4 px-4 text-[#38A169] font-semibold'>
                      {formatAmount(txn.sellerPayout)}
                    </td>
                    <td className='py-4 px-4 text-[#F39C4A]'>
                      <div className='text-sm'>
                        <div>
                          {t(
                            "seller:payments.commission.platformFee",
                            "Platform fee"
                          )}
                          : {formatAmount(txn.commissionAmount)}
                        </div>
                        <div className='text-xs text-gray-500'>
                          {t("seller:payments.commission.tax", "Tax")}:{" "}
                          {txn.commissionVATAmount?.toFixed(2) || "0.00"}
                        </div>
                        <div className='text-sm mt-1'>
                          {t("seller:payments.summary.total", "Total")}:{" "}
                          {formatAmount(txn.commissionTotal)}
                        </div>
                      </div>
                    </td>
                    <td className='py-4 px-4'>
                      {txn.status === "delivered" || txn.status === "paid" ? (
                        <span className='text-xs px-3 py-1 bg-[#E2FFE9] text-[#38A169] rounded-full'>
                          {getTranslatedStatus(txn.status)}
                        </span>
                      ) : txn.status === "canceled" ? (
                        <span className='text-xs px-3 py-1 bg-[#FFE2E2] text-[#E53E3E] rounded-full'>
                          {getTranslatedStatus(txn.status)}
                        </span>
                      ) : (
                        <span className='text-xs px-3 py-1 bg-[#FFF1E2] text-[#F39C4A] rounded-full'>
                          {getTranslatedStatus(txn.status)}
                        </span>
                      )}
                    </td>
                    <td className='py-4 px-4 text-[#1D1D1F]'>
                      {formatDate(txn.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {filteredTransactions.length > 0 && (
          <Pagination
            page={page}
            setPage={setPage}
            limit={limit}
            total={filteredTransactions.length}
            currentCount={displayedTransactions.length}
          />
        )}
      </div>
    </div>
  );
}
