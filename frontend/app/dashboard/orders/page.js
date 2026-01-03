"use client";
import Pagination from "@/components/Pagination";
import { useOrderStatsQuery } from "@/feature/customer/OrderApi";
import {
  useGetSellerOrdersQuery,
  useUpdateOrderStatusMutation,
} from "@/feature/seller/SellerApi";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiCreditCard,
  FiDollarSign,
  FiPackage,
  FiSearch,
  FiShoppingBag,
  FiTruck,
  FiXCircle,
} from "react-icons/fi";

export default function OrdersPage() {
  const { t } = useTranslation();
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

  const [updateOrderStatus, { isLoading: updateLoading }] =
    useUpdateOrderStatusMutation();
  const { data: orderStatsData, isLoading: statsLoading } =
    useOrderStatsQuery(userId);

  // Extract order stats
  const stats = orderStatsData?.data || {
    totalOrder: 0,
    totalSales: 0,
    pendingOrders: 0,
    paidOrders: 0,
    failedOrders: 0,
  };

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
      const data = {
        id: selectedOrder?._id,
        status: newStatus,
      };

      await updateOrderStatus(data);
      toast.success(t("common:statusUpdated", "Status updated successfully"));
      refetch();
      handleCloseModal();
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error(t("common:statusUpdateFailed", "Failed to update status"));
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
        return <FiCheckCircle className='text-green-500' />;
      case "processing":
        return <FiClock className='text-yellow-500' />;
      case "pending":
        return <FiClock className='text-purple-500' />;
      case "canceled":
        return <FiXCircle className='text-red-500' />;
      case "shipping":
        return <FiTruck className='text-blue-500' />;
      default:
        return <FiPackage className='text-gray-500' />;
    }
  };

  const filteredOrders =
    statusFilter === "All"
      ? orders
      : orders.filter(
          (order) => order.status.toLowerCase() === statusFilter.toLowerCase()
        );

  // Loading state
  if (isLoading || statsLoading) {
    return (
      <div className='min-h-screen px-2 pt-6 flex items-center justify-center'>
        <div className='text-center'>
          <div className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-500 border-r-transparent'></div>
          <p className='mt-4 text-gray-600'>
            {t("common:loading", "Loading...")}
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className='min-h-screen px-2 pt-6'>
        <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg'>
          <p>
            {t("common:errorLoadingOrders", "Error loading orders:")}{" "}
            {error?.message ||
              t("common:somethingWentWrong", "Something went wrong")}
          </p>
        </div>
      </div>
    );
  }

  // Get translated status text
  const getTranslatedStatus = (status) => {
    switch (status) {
      case "pending":
        return t("seller:orderManagement.orderStatus.pending", "Pending");
      case "processing":
        return t("seller:orderManagement.orderStatus.processing", "Processing");
      case "shipping":
        return t("seller:orderManagement.orderStatus.shipping", "Shipping");
      case "delivered":
        return t("seller:orderManagement.orderStatus.delivered", "Delivered");
      case "canceled":
        return t("seller:orderManagement.orderStatus.canceled", "Canceled");
      default:
        return status?.charAt(0).toUpperCase() + status?.slice(1);
    }
  };

  // Get translated payment status
  const getTranslatedPaymentStatus = (status) => {
    if (status === "paid") {
      return t("seller:orderManagement.paymentStatus.paid", "Paid");
    } else if (status === "pending") {
      return t("seller:orderManagement.paymentStatus.pending", "Pending");
    }
    return status?.charAt(0).toUpperCase() + status?.slice(1);
  };

  return (
    <div className='min-h-screen w-full px-2 pt-6'>
      {/* Page Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-[26px] md:text-[28px] font-semibold text-gray-900'>
            {t("seller:orderManagement.title", "Order Management")}
          </h1>
          <p className='text-sm text-[#9C6BFF] mt-1'>
            {t(
              "seller:orderManagement.subtitle",
              "Track and manage all your customer orders"
            )}
          </p>
        </div>
      </div>

      {/* Stats Cards - User Management Style */}
      <div className='mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4'>
        {/* Total Orders Card */}
        <div className='bg-white rounded-2xl shadow-sm border border-[#F0ECFF] px-6 py-5 flex items-center justify-between'>
          <div>
            <p className='text-[15px] font-medium text-[#2E2E2E]'>
              {t("seller:orderManagement.stats.totalOrders", "Total Orders")}
            </p>
            <p className='mt-1 text-[28px] font-semibold text-[#F88D25] leading-none'>
              {stats.totalOrder ?? 0}
            </p>
          </div>
          <div className='w-12 h-12 rounded-xl bg-[#F2E9FF] flex items-center justify-center'>
            <FiShoppingBag className='text-[26px] text-[#8736C5]' />
          </div>
        </div>

        {/* Total Sales Card */}
        <div className='bg-white rounded-2xl shadow-sm border border-[#F0ECFF] px-6 py-5 flex items-center justify-between'>
          <div>
            <p className='text-[15px] font-medium text-[#2E2E2E]'>
              {t("seller:orderManagement.stats.totalSales", "Total Sales")}
            </p>
            <p className='mt-1 text-[28px] font-semibold text-[#F88D25] leading-none'>
              {formatAmount(stats.totalSales)}
            </p>
          </div>
          <div className='w-12 h-12 rounded-xl bg-[#F2E9FF] flex items-center justify-center'>
            <FiDollarSign className='text-[26px] text-[#8736C5]' />
          </div>
        </div>

        {/* Pending Orders Card */}
        <div className='bg-white rounded-2xl shadow-sm border border-[#F0ECFF] px-6 py-5 flex items-center justify-between'>
          <div>
            <p className='text-[15px] font-medium text-[#2E2E2E]'>
              {t(
                "seller:orderManagement.stats.pendingOrders",
                "Pending Orders"
              )}
            </p>
            <p className='mt-1 text-[28px] font-semibold text-[#F88D25] leading-none'>
              {stats.pendingOrders ?? 0}
            </p>
          </div>
          <div className='w-12 h-12 rounded-xl bg-[#F2E9FF] flex items-center justify-center'>
            <FiAlertCircle className='text-[26px] text-[#8736C5]' />
          </div>
        </div>

        {/* Paid Orders Card */}
        <div className='bg-white rounded-2xl shadow-sm border border-[#F0ECFF] px-6 py-5 flex items-center justify-between'>
          <div>
            <p className='text-[15px] font-medium text-[#2E2E2E]'>
              {t("seller:orderManagement.stats.paidOrders", "Paid Orders")}
            </p>
            <p className='mt-1 text-[28px] font-semibold text-[#F88D25] leading-none'>
              {stats.paidOrders ?? 0}
            </p>
          </div>
          <div className='w-12 h-12 rounded-xl bg-[#F2E9FF] flex items-center justify-center'>
            <FiCreditCard className='text-[26px] text-[#8736C5]' />
          </div>
        </div>
      </div>

      {/* Search + Filter */}
      <div className='mt-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
        {/* Filter Tabs */}
        <div className='flex flex-wrap gap-3'>
          {[
            "All",
            "Pending",
            "Processing",
            "Shipping",
            "Delivered",
            "Canceled",
          ].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setStatusFilter(tab);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                statusFilter === tab
                  ? "text-white bg-linear-to-r from-[#8736C5] via-[#9C47C6] to-[#F88D25] shadow"
                  : "text-gray-700 bg-white border border-[#E4E2F5]"
              }`}>
              {t(`seller:orderManagement.tabs.${tab.toLowerCase()}`, tab)}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className='w-full lg:w-[320px]'>
          <div className='relative'>
            <FiSearch
              size={18}
              className='absolute left-3 top-2.5 text-[#F88D25]'
            />
            <input
              type='text'
              placeholder={t(
                "seller:orderManagement.searchPlaceholder",
                "Search by order ID or customer name"
              )}
              className='w-full pl-9 pr-3 py-2.5 bg-white rounded-full border border-[#E4E2F5] text-sm focus:outline-none focus:ring-1 focus:ring-[#F88D25]'
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className='mt-6 mb-10 bg-white rounded-xl shadow-sm border border-[#F0ECFF] p-4 md:p-5'>
        <div className='text-[13px] text-gray-600 mb-4'>
          {t("seller:orderManagement.summary.showing", "Showing")}{" "}
          {filteredOrders.length} {t("seller:orderManagement.summary.of", "of")}{" "}
          {pagination.total}{" "}
          {t("seller:orderManagement.summary.orders", "orders")}
        </div>

        <div className='overflow-x-scroll'>
          <table className='min-w-full text-left text-sm'>
            <thead>
              <tr className='text-[12px] text-[#A3A3B5] border-b border-gray-200 bg-[#F9F6FF]'>
                <th className='py-3 px-3'>
                  {t("seller:orderManagement.table.orderId", "ORDER ID")}
                </th>
                <th className='py-3 px-3'>
                  {t("seller:orderManagement.table.customer", "CUSTOMER")}
                </th>
                <th className='py-3 px-3'>
                  {t("seller:orderManagement.table.items", "ITEMS")}
                </th>
                <th className='py-3 px-3'>
                  {t("seller:orderManagement.table.amount", "AMOUNT")}
                </th>
                <th className='py-3 px-3'>
                  {t("seller:orderManagement.table.payment", "PAYMENT")}
                </th>
                <th className='py-3 px-3'>
                  {t("seller:orderManagement.table.status", "STATUS")}
                </th>
                <th className='py-3 px-3'>
                  {t("seller:orderManagement.table.date", "DATE")}
                </th>
                <th className='py-3 px-3 text-right'>
                  {t("seller:orderManagement.table.action", "ACTION")}
                </th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className='py-6 text-center text-gray-500'>
                    {t("common:loading", "Loading...")}
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className='py-6 text-center text-gray-500'>
                    {orders.length === 0
                      ? t("common:noOrdersFound", "No orders found")
                      : t(
                          "common:noOrdersMatchFilter",
                          "No orders match your filter"
                        )}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order, idx) => (
                  <tr
                    key={order._id}
                    className={`text-[13px] ${
                      idx !== filteredOrders.length - 1
                        ? "border-b border-gray-200"
                        : ""
                    }`}>
                    <td className='py-3 px-3 font-medium'>
                      #
                      {order.orderId?.slice(-6) ||
                        order._id?.slice(-6).toUpperCase()}
                    </td>

                    <td className='py-3 px-3'>
                      <div className='flex flex-col'>
                        <span className='font-medium'>
                          {order.customer?.name}
                        </span>
                        <span className='text-xs text-gray-500'>
                          {order.customer?.email}
                        </span>
                      </div>
                    </td>

                    <td className='py-3 px-3'>
                      {order.products?.reduce(
                        (sum, item) => sum + (item.quantity || 1),
                        0
                      ) ||
                        order.item ||
                        1}
                    </td>

                    <td className='py-3 px-3 font-medium text-[#F88D25]'>
                      {formatAmount(order.amount)}
                    </td>

                    <td className='py-3 px-3'>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.paymentStatus === "paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                        {getTranslatedPaymentStatus(order.paymentStatus)}
                      </span>
                    </td>

                    <td className='py-3 px-3'>
                      <div className='flex items-center gap-2'>
                        {getStatusIcon(order.status)}
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            order.status === "delivered"
                              ? "bg-[#E6F8EF] text-[#32A35A]"
                              : order.status === "processing"
                              ? "bg-[#FFF8E1] text-[#D97706]"
                              : order.status === "canceled"
                              ? "bg-[#FEE2E2] text-[#D32F2F]"
                              : order.status === "pending"
                              ? "bg-[#F3EDFF] text-[#A855F7]"
                              : order.status === "shipping"
                              ? "bg-[#E1F2FF] text-[#0076D6]"
                              : "bg-gray-100 text-gray-600"
                          }`}>
                          {getTranslatedStatus(order.status)}
                        </span>
                      </div>
                    </td>

                    <td className='py-3 px-3'>
                      {formatDate(order.createdAt || order.orderDate)}
                    </td>

                    <td className='py-3 px-3 text-right'>
                      <button
                        className='text-xs border rounded-lg px-3 py-1 text-[#9C6BFF] border-[#E2D4FF] bg-[#F9F6FF]'
                        onClick={() => handleViewDetails(order)}
                        title={t(
                          "seller:orderManagement.actions.view",
                          "View"
                        )}>
                        {t("seller:orderManagement.actions.view", "View")}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

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
      </div>

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className='fixed inset-0 backdrop-blur-xs flex items-center justify-center p-4 z-50'>
          <div className='bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
            {/* Modal Header */}
            <div className='p-6 border-b border-gray-200'>
              <div className='flex justify-between items-center'>
                <h2 className='text-xl font-semibold text-gray-900'>
                  {t("common:orderDetails", "Order Details")}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className='text-gray-400 hover:text-gray-600 text-2xl'>
                  &times;
                </button>
              </div>
              <p className='text-sm text-gray-600 mt-1'>
                {t("common:orderId", "Order ID")}: #
                {selectedOrder.orderId?.slice(-6) ||
                  selectedOrder._id?.slice(-6).toUpperCase()}
              </p>
            </div>

            {/* Modal Body */}
            <div className='p-6 space-y-6'>
              {/* Customer Information */}
              <div className='bg-gray-50 p-4 rounded-lg'>
                <h3 className='font-semibold text-gray-900 mb-3'>
                  {t("common:customerInformation", "Customer Information")}
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <p className='text-sm text-gray-600'>
                      {t("common:name", "Name")}
                    </p>
                    <p className='font-medium'>
                      {selectedOrder.customer?.name}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-600'>
                      {t("common:email", "Email")}
                    </p>
                    <p className='font-medium'>
                      {selectedOrder.customer?.email}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-600'>
                      {t("common:phone", "Phone")}
                    </p>
                    <p className='font-medium'>
                      {selectedOrder.customer?.phoneNumber || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              {selectedOrder.address && (
                <div className='bg-gray-50 p-4 rounded-lg'>
                  <h3 className='font-semibold text-gray-900 mb-3'>
                    {t("common:shippingAddress", "Shipping Address")}
                  </h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <p className='text-sm text-gray-600'>
                        {t("common:street", "Street")}
                      </p>
                      <p className='font-medium'>
                        {selectedOrder.address.street}
                      </p>
                    </div>
                    <div>
                      <p className='text-sm text-gray-600'>
                        {t("common:city", "City")}
                      </p>
                      <p className='font-medium'>
                        {selectedOrder.address.city}
                      </p>
                    </div>
                    <div>
                      <p className='text-sm text-gray-600'>
                        {t("common:state", "State")}
                      </p>
                      <p className='font-medium'>
                        {selectedOrder.address.state}
                      </p>
                    </div>
                    <div>
                      <p className='text-sm text-gray-600'>
                        {t("common:postalCode", "Postal Code")}
                      </p>
                      <p className='font-medium'>
                        {selectedOrder.address.postalCode}
                      </p>
                    </div>
                    <div className='md:col-span-2'>
                      <p className='text-sm text-gray-600'>
                        {t("common:country", "Country")}
                      </p>
                      <p className='font-medium'>
                        {selectedOrder.address.country}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div className='bg-gray-50 p-4 rounded-lg'>
                <h3 className='font-semibold text-gray-900 mb-3'>
                  {t("common:orderItems", "Order Items")}
                </h3>
                <div className='space-y-4'>
                  {selectedOrder.products?.map((product, index) => (
                    <div
                      key={index}
                      className='flex items-center justify-between p-3 bg-white rounded-lg border'>
                      <div className='flex items-center gap-3'>
                        {product.image && (
                          <img
                            src={product.image}
                            alt={product.name}
                            className='w-12 h-12 rounded-lg object-cover'
                          />
                        )}
                        <div>
                          <p className='font-medium'>
                            {product.name || product.product?.name}
                          </p>
                          <p className='text-sm text-gray-600'>
                            {t("common:quantity", "Quantity")}:{" "}
                            {product.quantity || 1}
                          </p>
                        </div>
                      </div>
                      <div className='text-right'>
                        <p className='font-semibold text-[#FF8A34]'>
                          {formatAmount(product.price || 0)}
                        </p>
                        <p className='text-sm text-gray-600'>
                          {t("common:total", "Total")}:{" "}
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
              <div className='bg-gray-50 p-4 rounded-lg'>
                <h3 className='font-semibold text-gray-900 mb-3'>
                  {t("common:orderSummary", "Order Summary")}
                </h3>
                <div className='space-y-2'>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>
                      {t("common:subtotal", "Subtotal")}
                    </span>
                    <span className='font-medium'>
                      {formatAmount(selectedOrder.amount)}
                    </span>
                  </div>
                  {selectedOrder.commission && (
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>
                        {t("common:commission", "Commission")}
                      </span>
                      <span className='font-medium text-red-600'>
                        -{formatAmount(selectedOrder.commission)}
                      </span>
                    </div>
                  )}
                  {selectedOrder.netAmount && (
                    <div className='flex justify-between border-t pt-2'>
                      <span className='text-gray-900 font-semibold'>
                        {t("common:netAmount", "Net Amount")}
                      </span>
                      <span className='text-[#FF8A34] font-bold text-lg'>
                        {formatAmount(selectedOrder.netAmount)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Status & Payment */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='bg-gray-50 p-4 rounded-lg'>
                  <h3 className='font-semibold text-gray-900 mb-3'>
                    {t("common:orderStatus", "Order Status")}
                  </h3>
                  <div className='space-y-3'>
                    <div className='flex items-center gap-3'>
                      {getStatusIcon(selectedOrder.status)}
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          selectedOrder.status === "delivered"
                            ? "bg-[#E6F8EF] text-[#32A35A]"
                            : selectedOrder.status === "processing"
                            ? "bg-[#FFF8E1] text-[#D97706]"
                            : selectedOrder.status === "canceled"
                            ? "bg-[#FEE2E2] text-[#D32F2F]"
                            : selectedOrder.status === "pending"
                            ? "bg-[#F3EDFF] text-[#A855F7]"
                            : selectedOrder.status === "shipping"
                            ? "bg-[#E1F2FF] text-[#0076D6]"
                            : "bg-gray-100 text-gray-600"
                        }`}>
                        {getTranslatedStatus(selectedOrder.status)}
                      </span>
                    </div>

                    {/* Status Update */}
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        {t("common:updateStatus", "Update Status")}
                      </label>
                      <div className='flex gap-2'>
                        <select
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                          className='flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#F88D25] focus:border-transparent'>
                          <option value='pending'>
                            {t("common:pending", "Pending")}
                          </option>
                          <option value='processing'>
                            {t("common:processing", "Processing")}
                          </option>
                          <option value='shipping'>
                            {t("common:shipping", "Shipping")}
                          </option>
                          <option value='delivered'>
                            {t("common:delivered", "Delivered")}
                          </option>
                          <option value='canceled'>
                            {t("common:canceled", "Canceled")}
                          </option>
                        </select>
                        <button
                          onClick={handleStatusChange}
                          disabled={updateLoading}
                          className='px-4 py-2 bg-[#9C6BFF] text-white text-sm font-medium rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition'>
                          {updateLoading
                            ? t("common:updating", "Updating...")
                            : t("common:update", "Update")}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='bg-gray-50 p-4 rounded-lg'>
                  <h3 className='font-semibold text-gray-900 mb-3'>
                    {t("common:paymentInformation", "Payment Information")}
                  </h3>
                  <div className='space-y-2'>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>
                        {t("common:status", "Status")}
                      </span>
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-medium ${
                          selectedOrder.paymentStatus === "paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                        {getTranslatedPaymentStatus(
                          selectedOrder.paymentStatus
                        )}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>
                        {t("common:method", "Method")}
                      </span>
                      <span className='font-medium'>
                        {selectedOrder.paymentMethod || "N/A"}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>
                        {t("common:orderDate", "Order Date")}
                      </span>
                      <span className='font-medium'>
                        {formatDate(
                          selectedOrder.createdAt || selectedOrder.orderDate
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className='bg-gray-50 p-4 rounded-lg'>
                <h3 className='font-semibold text-gray-900 mb-3'>
                  {t("common:sellerInformation", "Seller Information")}
                </h3>
                <div className='space-y-2'>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>
                      {t("common:name", "Name")}
                    </span>
                    <span className='font-medium'>
                      {selectedOrder.seller?.name}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>
                      {t("common:email", "Email")}
                    </span>
                    <span className='font-medium'>
                      {selectedOrder.seller?.email}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>
                      {t("common:phone", "Phone")}
                    </span>
                    <span className='font-medium'>
                      {selectedOrder.seller?.phoneNumber}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className='p-6 border-t border-gray-200'>
              <div className='flex justify-end'>
                <button
                  onClick={handleCloseModal}
                  className='px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition'>
                  {t("common:close", "Close")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
