"use client";
import { useSellerRefundRequestQuery } from "@/feature/refund/RefundApi";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const SellerRefundpage = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  
  // Fetch data with pagination
  const { data, isLoading, isFetching } = useSellerRefundRequestQuery({
    sellerId: userId,
    page,
    limit
  });
  
  // Extract data
  const refunds = data?.refunds || [];
  const pagination = data?.pagination || { page: 1, limit: 10, total: 0, pages: 1 };

  console.log(refunds, 'refunds ---- all');
  
  // Format amount with currency
  const formatAmount = (amount, currency) => {
    const symbol = currency === 'usd' ? '$' : currency === 'eur' ? '€' : '₹';
    return `${symbol}${amount?.toFixed(2) || '0.00'}`;
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get product names from items
  const getProductNames = (items) => {
    if (!items || items.length === 0) return 'Full Order';
    
    return items.map(item => 
      item.product?.name || 'Product'
    ).join(', ');
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'completed':
        return {
          bg: 'bg-[#E2FFE9]',
          text: 'text-[#38A169]',
          label: 'Approved'
        };
      case 'rejected':
      case 'denied':
        return {
          bg: 'bg-[#FFE2E2]',
          text: 'text-[#E53E3E]',
          label: 'Rejected'
        };
      case 'requested':
      case 'pending':
        return {
          bg: 'bg-[#FFF1E2]',
          text: 'text-[#F39C4A]',
          label: 'Pending'
        };
      case 'processing':
        return {
          bg: 'bg-[#E2F3FF]',
          text: 'text-[#3182CE]',
          label: 'Processing'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-600',
          label: status || 'Unknown'
        };
    }
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setPage(newPage);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-4 md:p-6">
        <h2 className="text-[24px] font-semibold text-gray-900 mb-6">Refund Requests</h2>
        
        <div className="mt-3 overflow-x-auto rounded-xl">
          <table className="min-w-full text-left text-[12px] md:text-[13px]">
            <thead>
              <tr className="text-[#9838E1] bg-[#F8F4FD] border-b border-[#F0EEF7] text-xs uppercase tracking-[0.12em]">
                <th className="py-6 pr-4 font-medium pl-2">Order ID</th>
                <th className="py-6 pr-4 font-medium pl-2">Products</th>
                <th className="py-6 pr-4 font-medium pl-2">Amount</th>
                <th className="py-6 pr-4 font-medium pl-2">Items</th>
                <th className="py-6 pr-4 font-medium pl-2">Status</th>
                <th className="py-6 pr-4 font-medium pl-2">Requested Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={6} className="pl-2 py-6 pr-4 text-center text-gray-500">
                  Loading refund requests...
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (refunds.length === 0) {
    return (
      <div className="bg-white rounded-xl p-4 md:p-6">
        <h2 className="text-[24px] font-semibold text-gray-900 mb-6">Refund Requests</h2>
        
        <div className="mt-3 overflow-x-auto rounded-xl">
          <table className="min-w-full text-left text-[12px] md:text-[13px]">
            <thead>
              <tr className="text-[#9838E1] bg-[#F8F4FD] border-b border-[#F0EEF7] text-xs uppercase tracking-[0.12em]">
                <th className="py-6 pr-4 font-medium pl-2">Order ID</th>
                <th className="py-6 pr-4 font-medium pl-2">Products</th>
                <th className="py-6 pr-4 font-medium pl-2">Amount</th>
                <th className="py-6 pr-4 font-medium pl-2">Items</th>
                <th className="py-6 pr-4 font-medium pl-2">Status</th>
                <th className="py-6 pr-4 font-medium pl-2">Requested Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={6} className="pl-2 py-6 pr-4 text-center text-gray-500">
                  No refund requests found
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-[24px] font-semibold text-gray-900">Refund Requests</h2>
        
        {/* Items per page selector */}
        <div className="flex items-center gap-2 mt-2 md:mt-0">
          <span className="text-sm text-gray-600">Items per page:</span>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1); // Reset to first page when changing limit
            }}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#9838E1]/40"
            disabled={isFetching}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>
      
      {/* Status summary */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="bg-[#FFF1E2] text-[#F39C4A] px-4 py-2 rounded-lg">
          <span className="font-semibold">Pending:</span> {
            refunds.filter(r => r.status === 'requested').length
          }
        </div>
        <div className="bg-[#E2FFE9] text-[#38A169] px-4 py-2 rounded-lg">
          <span className="font-semibold">Approved:</span> {
            refunds.filter(r => r.status === 'approved').length
          }
        </div>
        <div className="bg-[#FFE2E2] text-[#E53E3E] px-4 py-2 rounded-lg">
          <span className="font-semibold">Rejected:</span> {
            refunds.filter(r => r.status === 'rejected').length
          }
        </div>
      </div>
      
      <div className="mt-3 overflow-x-auto rounded-xl">
        <table className="min-w-full text-left text-[12px] md:text-[13px]">
          <thead>
            <tr className="text-[#9838E1] bg-[#F8F4FD] border-b border-[#F0EEF7] text-xs uppercase tracking-[0.12em]">
              <th className="py-6 pr-4 font-medium pl-2">Order ID</th>
              <th className="py-6 pr-4 font-medium pl-2">Products</th>
              <th className="py-6 pr-4 font-medium pl-2">Amount</th>
              <th className="py-6 pr-4 font-medium pl-2">Items</th>
              <th className="py-6 pr-4 font-medium pl-2">Status</th>
              <th className="py-6 pr-4 font-medium pl-2">Requested Date</th>
            </tr>
          </thead>
          <tbody className="text-[#4B4B63]">
            {refunds.map((refund, idx) => {
              const statusBadge = getStatusBadge(refund.status);
              
              return (
                <tr
                  key={refund._id}
                  className={`border-b border-[#F5F4FB] ${
                    idx % 2 === 1 ? "" : "bg-white"
                  }`}
                >
                  <td className="pl-2 py-6 pr-4 font-medium">
                    {refund.order?._id?.substring(refund.order?._id.length - 6)?.toUpperCase() || 
                     `ORD-${refund._id?.substring(refund._id.length - 6)?.toUpperCase() || "N/A"}`}
                  </td>
                  <td className="pl-2 py-6 pr-4">
                    <div className="max-w-[200px] truncate" title={getProductNames(refund.items)}>
                      {getProductNames(refund.items)}
                    </div>
                  </td>
                  <td className="pl-2 py-6 pr-4 text-[#F39C4A] font-semibold">
                    {formatAmount(refund.amount, refund.currency)}
                  </td>
                  <td className="pl-2 py-6 pr-4">
                    <span className="bg-[#F8F4FD] text-[#9838E1] px-3 py-1 rounded-full text-xs font-medium">
                      {refund.items?.length || 0} items
                    </span>
                  </td>
                  <td className="pl-2 py-6 pr-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-medium ${statusBadge.bg} ${statusBadge.text}`}
                    >
                      {statusBadge.label}
                    </span>
                  </td>
                  <td className="pl-2 py-6 pr-4 text-[#8C8CA1]">
                    {formatDate(refund.createdAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex flex-col md:flex-row md:items-center justify-between mt-6 px-2 gap-4">
          <div className="text-sm text-gray-600">
            Showing {(page - 1) * limit + 1} to {Math.min(page * limit, pagination.total)} of {pagination.total} requests
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1 || isFetching}
              className={`p-2 rounded-lg ${page === 1 || isFetching
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-[#9838E1] hover:bg-[#F8F4FD]'}`}
            >
              <FiChevronLeft size={20} />
            </button>
            
            {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
              let pageNum;
              if (pagination.pages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= pagination.pages - 2) {
                pageNum = pagination.pages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  disabled={isFetching}
                  className={`w-8 h-8 rounded-lg text-sm font-medium ${
                    page === pageNum
                      ? 'bg-[#9838E1] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  } ${isFetching ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === pagination.pages || isFetching}
              className={`p-2 rounded-lg ${page === pagination.pages || isFetching
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-[#9838E1] hover:bg-[#F8F4FD]'}`}
            >
              <FiChevronRight size={20} />
            </button>
          </div>
          
          {/* Page number input */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Go to page:</span>
            <input
              type="number"
              min="1"
              max={pagination.pages}
              value={page}
              onChange={(e) => {
                const newPage = Number(e.target.value);
                if (newPage >= 1 && newPage <= pagination.pages) {
                  handlePageChange(newPage);
                }
              }}
              className="w-16 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#9838E1]/40"
              disabled={isFetching}
            />
          </div>
        </div>
      )}
      
      {/* Loading indicator during fetch */}
      {isFetching && (
        <div className="mt-4 text-center text-sm text-[#9838E1]">
          Loading...
        </div>
      )}
    </div>
  );
};

export default SellerRefundpage;