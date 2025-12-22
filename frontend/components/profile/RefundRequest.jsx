import { useMyRefundRequestQuery } from '@/feature/refund/RefundApi';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const RefundRequest = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { data, isLoading } = useMyRefundRequestQuery(userId);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Format amount with USD symbol
  const formatAmount = (amount) => {
    return `$${amount?.toFixed(2) || '0.00'}`;
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
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

  // Get product names from items
  const getProductNames = (items) => {
    if (!items || items.length === 0) return 'Full Order';
    
    return items.map(item => 
      item.product?.name || 'Product'
    ).join(', ');
  };

  // Pagination calculations
  const refunds = data?.refunds || [];
  const totalPages = Math.ceil(refunds.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRefunds = refunds.slice(startIndex, endIndex);

  // Handle pagination
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-4 md:p-6">
        <h2 className="text-[24px] font-semibold text-gray-900 mb-6">My Refund Requests</h2>
        
        <div className="mt-3 overflow-x-auto rounded-xl">
          <table className="min-w-full text-left text-[12px] md:text-[13px]">
            <thead>
              <tr className="text-[#9838E1] bg-[#F8F4FD] border-b border-[#F0EEF7] text-xs uppercase tracking-[0.12em]">
                <th className="py-6 pr-4 font-medium pl-2">Order ID</th>
                <th className="py-6 pr-4 font-medium pl-2">Products</th>
                <th className="py-6 pr-4 font-medium pl-2">Amount</th>
                <th className="py-6 pr-4 font-medium pl-2">Reason</th>
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
        <h2 className="text-[24px] font-semibold text-gray-900 mb-6">My Refund Requests</h2>
        
        <div className="mt-3 overflow-x-auto rounded-xl">
          <table className="min-w-full text-left text-[12px] md:text-[13px]">
            <thead>
              <tr className="text-[#9838E1] bg-[#F8F4FD] border-b border-[#F0EEF7] text-xs uppercase tracking-[0.12em]">
                <th className="py-6 pr-4 font-medium pl-2">Order ID</th>
                <th className="py-6 pr-4 font-medium pl-2">Products</th>
                <th className="py-6 pr-4 font-medium pl-2">Amount</th>
                <th className="py-6 pr-4 font-medium pl-2">Reason</th>
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
      <h2 className="text-[24px] font-semibold text-gray-900 mb-6">My Refund Requests</h2>
      
      <div className="mt-3 overflow-x-auto rounded-xl">
        <table className="min-w-full text-left text-[12px] md:text-[13px]">
          <thead>
            <tr className="text-[#9838E1] bg-[#F8F4FD] border-b border-[#F0EEF7] text-xs uppercase tracking-[0.12em]">
              <th className="py-6 pr-4 font-medium pl-2">Order ID</th>
              <th className="py-6 pr-4 font-medium pl-2">Products</th>
              <th className="py-6 pr-4 font-medium pl-2">Amount</th>
              <th className="py-6 pr-4 font-medium pl-2">Reason</th>
              <th className="py-6 pr-4 font-medium pl-2">Status</th>
              <th className="py-6 pr-4 font-medium pl-2">Requested Date</th>
            </tr>
          </thead>
          <tbody className="text-[#4B4B63]">
            {currentRefunds.map((refund, idx) => {
              const statusBadge = getStatusBadge(refund.status);
              
              return (
                <tr
                  key={refund._id}
                  className={`border-b border-[#F5F4FB] ${
                    idx % 2 === 1 ? "" : "bg-white"
                  }`}
                >
                  <td className="pl-2 py-6 pr-4 font-medium">
                    {refund.order?.orderId || `ORD-${refund._id?.substring(refund._id.length - 6)?.toUpperCase() || "N/A"}`}
                  </td>
                  <td className="pl-2 py-6 pr-4">
                    <div className="max-w-[200px] truncate" title={getProductNames(refund.items)}>
                      {getProductNames(refund.items)}
                    </div>
                  </td>
                  <td className="pl-2 py-6 pr-4 text-[#F39C4A] font-semibold">
                    {formatAmount(refund.amount)}
                  </td>
                  <td className="pl-2 py-6 pr-4">
                    <div className="max-w-[150px] truncate" title={refund.reason}>
                      {refund.reason}
                    </div>
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
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 px-2">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, refunds.length)} of {refunds.length} requests
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg ${currentPage === 1 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-[#9838E1] hover:bg-[#F8F4FD]'}`}
            >
              <FiChevronLeft size={20} />
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => goToPage(pageNum)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium ${
                    currentPage === pageNum
                      ? 'bg-[#9838E1] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg ${currentPage === totalPages 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-[#9838E1] hover:bg-[#F8F4FD]'}`}
            >
              <FiChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RefundRequest;