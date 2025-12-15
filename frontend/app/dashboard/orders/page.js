"use client";
import { useGetSellerOrdersQuery, useUpdateOrderStatusMutation } from "@/feature/seller/SellerApi";
import { useSession } from "next-auth/react";
import {
  FiSearch,
  FiChevronDown,
  FiEye,
  FiCheckCircle,
  FiXCircle,
  FiTruck,
  FiPackage,
  FiClock,
} from "react-icons/fi";
import { useState, useEffect } from "react";
import Pagination from "@/components/Pagination";
import toast from "react-hot-toast";

export default function OrdersPage() {
  const { data: user } = useSession();
  const userId = user?.user?.id;

  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  // Debounce search term
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // RTK Query hooks
  const { data, isLoading, isError, error, refetch } = useGetSellerOrdersQuery({
    sellerId: userId,
    search: debouncedSearch,
    page,
    limit,
  });

  // const [updateOrderStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();

  const [updateOrderStatus, {isLoading:updateLoading}] = useUpdateOrderStatusMutation()

  // Extract data
  const orders = data?.data || [];
  const pagination = data?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
    hasMore: false,
  };

  // Handlers
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(1);
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
    setNewStatus("");
  };

  const handleStatusChange = async () => {
    if (!selectedOrder || !newStatus || newStatus === selectedOrder.status) {
      return;
    }

    try {
      console.log(selectedOrder, newStatus, "In sha allah");
      const data = {
        id:selectedOrder,
        status: newStatus
      }


      await updateOrderStatus(data);
      toast.success("Status update Successfully")


      refetch();
      handleCloseModal();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  // Format helpers
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatAmount = (amount) => {
    return `$${amount?.toFixed(2) || "0.00"}`;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <FiCheckCircle className="text-green-500" />;
      case "processing":
        return <FiClock className="text-yellow-500" />;
      case "pending":
        return <FiClock className="text-purple-500" />;
      case "canceled":
        return <FiXCircle className="text-red-500" />;
      case "shipping":
        return <FiTruck className="text-blue-500" />;
      default:
        return <FiPackage className="text-gray-500" />;
    }
  };

  const filteredOrders =
    statusFilter === "All"
      ? orders
      : orders.filter(
          (order) => order.status.toLowerCase() === statusFilter.toLowerCase()
        );

  // Loading state
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

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen px-2 pt-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p>
            Error loading orders: {error?.message || "Something went wrong"}
          </p>
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
                <th className="py-4 px-6 font-semibold">Items</th>
                <th className="py-4 px-6 font-semibold">Amount</th>
                <th className="py-4 px-6 font-semibold">Payment</th>
                <th className="py-4 px-6 font-semibold">Status</th>
                <th className="py-4 px-6 font-semibold">Date</th>
                <th className="py-4 px-6 font-semibold text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="text-sm text-[#111827]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-gray-500">
                    {orders.length === 0
                      ? "No orders found"
                      : "No orders match your filter"}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-t border-[#F0F0F5] hover:bg-[#FAF9FF] transition"
                  >
                    <td className="py-4 px-6 font-medium">
                      #
                      {order.orderId?.slice(-6) ||
                        order._id?.slice(-6).toUpperCase()}
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-medium">
                          {order.customer?.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.customer?.email}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {order.products?.reduce(
                        (sum, item) => sum + (item.quantity || 1),
                        0
                      ) ||
                        order.item ||
                        1}
                    </td>
                    <td className="py-4 px-6 font-medium text-[#FF8A34]">
                      {formatAmount(order.amount)}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-medium border ${
                          order.paymentStatus === "paid"
                            ? "bg-green-100 text-green-800 border-green-200"
                            : "bg-yellow-100 text-yellow-800 border-yellow-200"
                        }`}
                      >
                        {order.paymentStatus?.charAt(0).toUpperCase() +
                          order.paymentStatus?.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <span
                          className={`px-3 py-1 text-xs rounded-full font-medium border ${
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
                          }`}
                        >
                          {order.status?.charAt(0).toUpperCase() +
                            order.status?.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {formatDate(order.createdAt || order.orderDate)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => handleViewDetails(order)}
                        className="flex items-center gap-2 text-xs px-4 py-2 rounded-lg border border-[#D9C4FF] text-[#A855F7] hover:bg-[#F5EEFF] transition mx-auto"
                      >
                        <FiEye />
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
            page={pagination.page - 1}
            setPage={(newPage) => setPage(newPage + 1)}
            limit={pagination.limit}
            total={pagination.total}
            currentCount={filteredOrders.length}
          />
        )}
      </div>

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  Order Details
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  &times;
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Order ID: #
                {selectedOrder.orderId?.slice(-6) ||
                  selectedOrder._id?.slice(-6).toUpperCase()}
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Customer Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">
                      {selectedOrder.customer?.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">
                      {selectedOrder.customer?.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">
                      {selectedOrder.customer?.phoneNumber || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              {selectedOrder.address && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Shipping Address
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Street</p>
                      <p className="font-medium">
                        {selectedOrder.address.street}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">City</p>
                      <p className="font-medium">
                        {selectedOrder.address.city}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">State</p>
                      <p className="font-medium">
                        {selectedOrder.address.state}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Postal Code</p>
                      <p className="font-medium">
                        {selectedOrder.address.postalCode}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600">Country</p>
                      <p className="font-medium">
                        {selectedOrder.address.country}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Order Items
                </h3>
                <div className="space-y-4">
                  {selectedOrder.products?.map((product, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        {product.image && (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium">
                            {product.name || product.product?.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Quantity: {product.quantity || 1}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#FF8A34]">
                          {formatAmount(product.price || 0)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Total:{" "}
                          {formatAmount(
                            (product.price || 0) * (product.quantity || 1)
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Order Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">
                      {formatAmount(selectedOrder.amount)}
                    </span>
                  </div>
                  {selectedOrder.commission && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Commission</span>
                      <span className="font-medium text-red-600">
                        -{formatAmount(selectedOrder.commission)}
                      </span>
                    </div>
                  )}
                  {selectedOrder.netAmount && (
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-gray-900 font-semibold">
                        Net Amount
                      </span>
                      <span className="text-[#FF8A34] font-bold text-lg">
                        {formatAmount(selectedOrder.netAmount)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Status & Payment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Order Status
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(selectedOrder.status)}
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium border ${
                          selectedOrder.status === "delivered"
                            ? "bg-[#E8FFE7] text-[#2E9B3D] border-[#C4F5C0]"
                            : selectedOrder.status === "processing"
                            ? "bg-[#FFF7DB] text-[#B88A00] border-[#F6E3A1]"
                            : selectedOrder.status === "canceled"
                            ? "bg-[#FFECEC] text-[#E03131] border-[#FFC9C9]"
                            : selectedOrder.status === "pending"
                            ? "bg-[#F3EDFF] text-[#A855F7] border-[#E2D6FF]"
                            : selectedOrder.status === "shipping"
                            ? "bg-[#E1F2FF] text-[#0076D6] border-[#B5E2FF]"
                            : "bg-gray-100 text-gray-600 border-gray-200"
                        }`}
                      >
                        {selectedOrder.status?.charAt(0).toUpperCase() +
                          selectedOrder.status?.slice(1)}
                      </span>
                    </div>

                    {/* Status Update */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Update Status
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipping">Shipping</option>
                          <option value="delivered">Delivered</option>
                          <option value="canceled">Canceled</option>
                        </select>
                        <button
                          onClick={handleStatusChange}
                        className="px-4 py-2 bg-purple-600 text-white text-sm  font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                Update
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Payment Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status</span>
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-medium ${
                          selectedOrder.paymentStatus === "paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {selectedOrder.paymentStatus?.charAt(0).toUpperCase() +
                          selectedOrder.paymentStatus?.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Method</span>
                      <span className="font-medium">
                        {selectedOrder.paymentMethod || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Date</span>
                      <span className="font-medium">
                        {formatDate(
                          selectedOrder.createdAt || selectedOrder.orderDate
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200">
              <div className="flex justify-end">
                <button
                  onClick={handleCloseModal}
                  className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
