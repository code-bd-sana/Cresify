"use client";
import { useGetSellerOrdersQuery } from "@/feature/seller/SellerApi";
import { useSession } from "next-auth/react";
import { FiSearch, FiChevronDown } from "react-icons/fi";
import { useState, useEffect } from "react";
import Pagination from "@/components/Pagination"; // Adjust the import path as needed

export default function OrdersPage() {
  const { data: user } = useSession();
  const userId = user?.user?.id;
  
  // State for search, filter, and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  
  // Debounce search term
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset to first page when searching
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch orders with query parameters
  const { data, isLoading, isError, error } = useGetSellerOrdersQuery({
    sellerId: userId,
    search: debouncedSearch,
    page,
    limit,
  });

  // Extract data from response
  const orders = data?.data || [];
  const pagination = data?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
    hasMore: false,
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(1); // Reset to first page when changing filter
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format amount with currency symbol
  const formatAmount = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  // Filter orders by status if not "All"
  const filteredOrders = statusFilter === "All" 
    ? orders 
    : orders.filter(order => order.status.toLowerCase() === statusFilter.toLowerCase());

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen px-2 pt-6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-500 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (isError) {
    return (
      <div className="min-h-screen px-2 pt-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p>Error loading orders: {error?.message || "Something went wrong"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-2 pt-6">
      {/* Page Header */}
      <h1 className="text-3xl font-semibold text-[#111827]">
        Order Management
      </h1>
      <p className="text-sm text-[#A78BFA] mt-1">
        Track and manage all your customer orders
      </p>

      {/* Search + Filter */}
      <div className="mt-8 bg-white p-4 rounded-xl border border-[#ECECEC] shadow-sm flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative w-full">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
          <input
            type="text"
            placeholder="Search by order ID or customer name..."
            className="w-full bg-[#FCFCFF] border border-[#E5E7EB] rounded-lg pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#A855F7]/40"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        {/* Filter dropdown */}
        <div className="relative w-full md:w-40">
          <select 
            className="appearance-none w-full px-4 py-3 bg-[#FCFCFF] border border-[#E5E7EB] text-sm rounded-lg outline-none cursor-pointer"
            value={statusFilter}
            onChange={handleFilterChange}
          >
            <option value="All">All</option>
            <option value="delivered">Delivered</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="canceled">Canceled</option>
            <option value="shipping">Shipping</option>
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg pointer-events-none" />
        </div>
      </div>

      {/* Orders Table */}
      <div className="mt-8 bg-white rounded-2xl border border-[#ECECEC] shadow-sm overflow-x-auto">
        <div className="px-6 py-4">
          <div className="text-sm text-gray-600 mb-4">
            Showing {filteredOrders.length} of {pagination.total} orders
          </div>
          <table className="w-full text-left min-w-[900px]">
            <thead>
              <tr className="bg-[#F9F7FF] text-[#A78BFA] text-xs uppercase">
                <th className="py-4 px-6 font-semibold">Order ID</th>
                <th className="py-4 px-6 font-semibold">Customer</th>
                <th className="py-4 px-6 font-semibold">Product</th>
                <th className="py-4 px-6 font-semibold">Items</th>
                <th className="py-4 px-6 font-semibold">Amount</th>
                <th className="py-4 px-6 font-semibold">Payment Status</th>
                <th className="py-4 px-6 font-semibold">Order Status</th>
                <th className="py-4 px-6 font-semibold">Date</th>
                <th className="py-4 px-6 font-semibold text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="text-sm text-[#111827]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-8 text-center text-gray-500">
                    {orders.length === 0 ? "No orders found" : "No orders match your filter"}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-t border-[#F0F0F5] hover:bg-[#FAF9FF] transition"
                  >
                    <td className="py-4 px-6 font-medium">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-medium">{order.customer?.name}</div>
                        <div className="text-xs text-gray-500">{order.customer?.email}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {order.products?.[0]?.image && (
                          <img 
                            src={order.products[0].image} 
                            alt={order.products[0].name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <div className="font-medium">{order.products?.[0]?.name || "N/A"}</div>
                          <div className="text-xs text-gray-500">
                            {order.products?.length > 1 ? `+${order.products.length - 1} more` : ""}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">{order.item || 1}</td>
                    <td className="py-4 px-6 font-medium text-[#FF8A34]">
                      {formatAmount(order.amount || 0)}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 text-xs rounded-full font-medium border ${
                        order.paymentStatus === "paid" 
                          ? "bg-green-100 text-green-800 border-green-200"
                          : "bg-yellow-100 text-yellow-800 border-yellow-200"
                      }`}>
                        {order.paymentStatus?.charAt(0).toUpperCase() + order.paymentStatus?.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 text-xs rounded-full font-medium border ${
                        order.status === "delivered"
                          ? "bg-[#E8FFE7] text-[#2E9B3D] border-[#C4F5C0]"
                          : order.status === "processing"
                          ? "bg-[#FFF7DB] text-[#B88A00] border-[#F6E3A1]"
                          : order.status === "canceled"
                          ? "bg-[#FFECEC] text-[#E03131] border-[#FFC9C9]"
                          : order.status === "pending"
                          ? "bg-[#F3EDFF] text-[#A855F7] border-[#E2D6FF]"
                          : order.status === "shipping"
                          ? "bg-[#E1F2FF] text-[#0076D6] border-[#B5E2FF]"
                          : "bg-gray-100 text-gray-600 border-gray-200"
                      }`}>
                        {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-6">{formatDate(order.createdAt)}</td>
                    <td className="py-4 px-6 text-center">
                      <button className="flex items-center gap-1 text-xs px-4 py-1 rounded-lg border border-[#D9C4FF] text-[#A855F7] hover:bg-[#F5EEFF] transition mx-auto">
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.total > 0 && (
          <Pagination
            page={pagination.page - 1} // Convert to zero-based index
            setPage={(newPage) => setPage(newPage + 1)} // Convert back to one-based
            limit={pagination.limit}
            total={pagination.total}
            currentCount={filteredOrders.length}
          />
        )}
      </div>
    </div>
  );
}