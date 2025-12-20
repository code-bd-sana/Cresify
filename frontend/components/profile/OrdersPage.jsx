"use client";

import { useState } from "react";
import {
  Package,
  Truck,
  Eye,
  X,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  ShoppingBag,
  User,
  ChevronRight,
  CheckCircle,
  Clock,
  PackageCheck,
  Home,
  Calendar,
  ArrowRight,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Star,
  MessageSquare,
  StarIcon,
  FileText,
  Upload,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle2,
  Plus,
} from "lucide-react";
import { useMyOrderQuery } from "@/feature/customer/OrderApi";
import { useSession } from "next-auth/react";
import { useSaveReviewMutation } from "@/feature/review/ReviewApi";
import { useCreateRefundMutation } from "@/feature/refund/RefundApi";

export default function OrdersPage() {
  const tabs = [
    { id: "all", label: "All Orders", count: 0 },
    { id: "processing", label: "Processing", count: 0 },
    { id: "shipped", label: "Shipped", count: 0 },
    { id: "delivered", label: "Delivered", count: 0 },
  ];

  const [activeTab, setActiveTab] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedProductForReview, setSelectedProductForReview] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [selectedProductForRefund, setSelectedProductForRefund] = useState(null);
  const [refundType, setRefundType] = useState("full");
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [refundReason, setRefundReason] = useState("");
  const [evidenceFiles, setEvidenceFiles] = useState([]);
  const [isSubmittingRefund, setIsSubmittingRefund] = useState(false);

  const { data: user } = useSession();
  const id = user?.user?.id;
  const { data: MyOrder, isLoading, isError } = useMyOrderQuery(id);
  const [saveReview, { isLoading: reviewLoading }] = useSaveReviewMutation();
  const [createRefund, {isError:refundError, error:refundErr}] = useCreateRefundMutation()

  console.log(MyOrder, "egolo amar peronal");

  if(!isError){
    console.log(refundErr, "this i srefund error");
  }

  // API থেকে আসা ডেটা
  const apiOrders = MyOrder?.data || [];

  const calculateStatusCounts = () => {
    let allCount = 0;
    let processingCount = 0;
    let shippedCount = 0;
    let deliveredCount = 0;

    apiOrders.forEach((order) => {
      allCount++;

      const vendorStatuses = order.orderVendors.map((v) => v.status);
      const allDelivered = vendorStatuses.every((s) => s === "delivered");
      const anyShipped = vendorStatuses.some((s) => s === "shipping");
      const allProcessingOrPending = vendorStatuses.every(
        (s) => s === "processing" || s === "pending"
      );
      const anyCancelled = vendorStatuses.some((s) => s === "canceled");

      if (allDelivered) {
        deliveredCount++;
      } else if (anyShipped) {
        shippedCount++;
      } else if (allProcessingOrPending && !anyCancelled) {
        processingCount++;
      }
    });

    return { allCount, processingCount, shippedCount, deliveredCount };
  };

  const { allCount, processingCount, shippedCount, deliveredCount } =
    calculateStatusCounts();

  const updatedTabs = tabs.map((tab) => {
    switch (tab.id) {
      case "all":
        return { ...tab, count: allCount };
      case "processing":
        return { ...tab, count: processingCount };
      case "shipped":
        return { ...tab, count: shippedCount };
      case "delivered":
        return { ...tab, count: deliveredCount };
      default:
        return tab;
    }
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatShortDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getOrderStatus = (order) => {
    const vendorStatuses = order.orderVendors.map((v) => v.status);

    const allDelivered = vendorStatuses.every((s) => s === "delivered");
    if (allDelivered) {
      return {
        status: "Delivered",
        statusColor: "#00C363",
        expected: "",
        actions: "view",
      };
    }

    const anyShipped = vendorStatuses.some((s) => s === "shipping");
    if (anyShipped) {
      return {
        status: "Shipped",
        statusColor: "#5A3DF6",
        expected: "",
        actions: "track",
      };
    }

    const allProcessingOrPending = vendorStatuses.every(
      (s) => s === "processing" || s === "pending"
    );
    if (allProcessingOrPending) {
      const orderDate = new Date(order.createdAt);
      const deliveryDate = new Date(orderDate);
      deliveryDate.setDate(
        deliveryDate.getDate() + Math.floor(Math.random() * 3) + 3
      );

      return {
        status: "Processing",
        statusColor: "#F7A500",
        expected: `Expected Delivery: ${deliveryDate.toLocaleDateString(
          "en-US",
          {
            month: "short",
            day: "numeric",
            year: "numeric",
          }
        )}`,
        actions: "full",
      };
    }

    const anyCancelled = vendorStatuses.some((s) => s === "canceled");
    if (anyCancelled) {
      return {
        status: "Canceled",
        statusColor: "#EB5757",
        expected: "",
        actions: "view",
      };
    }

    return {
      status: "Processing",
      statusColor: "#F7A500",
      expected: "",
      actions: "full",
    };
  };

  const getAllProductsFromOrder = (order) => {
    const allProducts = [];

    order.orderVendors.forEach((vendor) => {
      vendor.products.forEach((product) => {
        const productPrice = product.price || 0;
        const quantity = product.quantity || 1;
        const subtotal = productPrice * quantity;

        allProducts.push({
          image: product.product?.image || "/product/p1.jpg",
          name: product.product?.name || "Unknown Product",
          qty: quantity,
          price: productPrice,
          subtotal: subtotal,
          vendorId: vendor._id,
          vendorStatus: vendor.status,
          productId: product.product?._id,
          description: product.product?.description,
          category: product.product?.category,
          sellerId: vendor.vendorId?._id,
          sellerName: vendor.vendorId?.name,
          canReview: vendor.status === "delivered",
          rawData: order,
          orderId: order.orderId,
        });
      });
    });

    return allProducts;
  };

  const getTotalProductCount = (order) => {
    return order.orderVendors.reduce((total, vendor) => {
      return total + vendor.products.length;
    }, 0);
  };

  const calculateOrderTotal = (order) => {
    return (order.amount).toFixed(2);
  };

  const calculateSubtotal = (allProducts) => {
    return allProducts.reduce((total, product) => {
      return total + product.subtotal;
    }, 0);
  };

  const orders = apiOrders.map((order) => {
    const statusInfo = getOrderStatus(order);
    const allProducts = getAllProductsFromOrder(order);
    const totalProducts = getTotalProductCount(order);
    const subtotal = calculateSubtotal(allProducts);
    const orderTotal = calculateOrderTotal(order);

    return {
      id: order._id.substring(order._id.length - 8).toUpperCase(),
      fullId: order._id,
      status: statusInfo.status,
      statusColor: statusInfo.statusColor,
      date: formatDate(order.createdAt),
      expected: statusInfo.expected,
      price: orderTotal,
      items: allProducts.slice(0, 2),
      totalItems: totalProducts,
      allProducts: allProducts,
      subtotal: subtotal,
      actions: statusInfo.actions,
      rawData: order,
      vendors: order.orderVendors,
      address: order.address,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  });

  const filteredOrders =
    activeTab === "all"
      ? orders
      : orders.filter((order) => {
          if (activeTab === "processing") {
            return order.status === "Processing";
          } else if (activeTab === "shipped") {
            return order.status === "Shipped";
          } else if (activeTab === "delivered") {
            return order.status === "Delivered";
          }
          return false;
        });

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleTrackOrder = (order) => {
    setTrackingOrder(order);
    setIsTrackModalOpen(true);
  };

  const handleCancelOrder = (order) => {
    console.log("=== CANCEL ORDER ===");
    console.log("Order ID to cancel:", order.fullId);
    console.log("====================");
    setOrderToCancel(order);
    setIsCancelConfirmOpen(true);
  };

  const handleConfirmCancel = () => {
    if (orderToCancel) {
      console.log("=== CONFIRM CANCEL ORDER ===");
      console.log("Cancelling Order ID:", orderToCancel.fullId);
      console.log("============================");
    }
    setIsCancelConfirmOpen(false);
    setOrderToCancel(null);
  };

  const handleReviewProduct = (product) => {
    setSelectedProductForReview(product);
    setRating(0);
    setReviewText("");
    setIsReviewModalOpen(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedProductForReview) return;

    console.log("=== SUBMIT REVIEW ===");
    console.log("User ID:", id);
    console.log("Product ID:", selectedProductForReview.productId);
    console.log("Seller ID:", selectedProductForReview);
    console.log("Rating:", rating);
    console.log("Review:", reviewText);
    console.log("====================");

    try {
      const reviewData = {
        id,
        product: selectedProductForReview.productId,
        review: selectedProductForReview,
        ratng: rating,
        reviewText: reviewText,
      };

      const result = await saveReview(reviewData);
      console.log(result, "aso he result aso aso");

      setIsReviewModalOpen(false);
      setSelectedProductForReview(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRefundRequest = (product) => {
    setSelectedProductForRefund(product);
    setRefundType("full");
    setSelectedVendors([]);
    setSelectedItems([]);
    setRefundReason("");
    setEvidenceFiles([]);
    setIsRefundModalOpen(true);
  };

  const handleVendorSelect = (vendorId) => {
    if (selectedVendors.includes(vendorId)) {
      setSelectedVendors(selectedVendors.filter((id) => id !== vendorId));
    } else {
      setSelectedVendors([...selectedVendors, vendorId]);
    }
  };

  const handleItemSelect = (item) => {
    const existingItemIndex = selectedItems.findIndex(
      (selected) =>
        selected.productId === item.productId &&
        selected.orderVendorId === item.vendorId
    );

    if (existingItemIndex >= 0) {
      const newSelectedItems = [...selectedItems];
      newSelectedItems.splice(existingItemIndex, 1);
      setSelectedItems(newSelectedItems);
    } else {
      setSelectedItems([
        ...selectedItems,
        {
          orderVendorId: item.vendorId,
          productId: item.productId,
          quantity: item.qty,
          reason: "",
          evidence: [],
        },
      ]);
    }
  };

  const handleEvidenceUpload = (e) => {
    const files = Array.from(e.target.files);

    const newEvidenceFiles = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newEvidenceFiles.push({
          url: reader.result,
          type: file.type.startsWith("image/") ? "image" : "document",
          note: "",
          file: file,
        });

        if (newEvidenceFiles.length === files.length) {
          setEvidenceFiles([...evidenceFiles, ...newEvidenceFiles]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeEvidenceFile = (index) => {
    const newFiles = [...evidenceFiles];
    newFiles.splice(index, 1);
    setEvidenceFiles(newFiles);
  };

const handleSubmitRefund = async() => {
  if (!selectedProductForRefund) return;

  const refundData = {
    paymentId: selectedProductForRefund.rawData?.paymentId || "",
    orderId: selectedProductForRefund._id || selectedProductForRefund.rawData?._id || "",
    userId: id,
    reason: refundReason,
    evidence: evidenceFiles
      .filter(e => e.url.trim()) 
      .map((file) => ({
        url: file.url,
        type: file.type,
        note: file.note,
      })),
  };

  // Partial refund হলে items যোগ করব
  if (refundType === "partial" && selectedItems.length > 0) {
    refundData.items = selectedItems.map((item) => ({
      orderVendorId: item.orderVendorId,
      productId: item.productId,
      quantity: item.quantity,
      reason: item.reason || refundReason,
    }));
  }

  console.log("=== REFUND REQUEST DATA ===");
  console.log("Refund Data:", refundData);
  console.log("Refund Type:", refundType);
  console.log("Selected Items:", selectedItems);
  console.log("Evidence Links:", evidenceFiles.filter(e => e.url.trim()));
  console.log("========================");

  try {
    const result = createRefund(refundData);
    console.log(result, "result is here");
    
  } catch (error) {
    console.log(error);
  }

  setIsSubmittingRefund(true);

  // এখানে আপনার API কল করবেন
  setTimeout(() => {
    console.log("Refund request submitted successfully");
    setIsSubmittingRefund(false);
    setIsRefundModalOpen(false);
    // Reset states
    setSelectedProductForRefund(null);
    setRefundType("full");
    setSelectedVendors([]);
    setSelectedItems([]);
    setRefundReason("");
    setEvidenceFiles([{ url: "", type: "link", note: "" }]); // একটি খালি লিঙ্ক ফিল্ড
  }, 2000);
};










  const getAllVendorsForRefund = () => {
    if (!selectedProductForRefund || !selectedProductForRefund.rawData)
      return [];

    return selectedProductForRefund.rawData.orderVendors.map((vendor) => ({
      id: vendor._id,
      name: vendor.seller?.firstName  || "Unknown Vendor",
      sellerId: vendor.seller,
      status: vendor.status,
      amount: (vendor.amount / 100).toFixed(2),
    }));
  };

  const getAllItemsForRefund = () => {
    if (!selectedProductForRefund || !selectedProductForRefund.allProducts)
      return [];

    return selectedProductForRefund.allProducts.map((product) => ({
      orderVendorId: product.vendorId,
      productId: product.productId,
      name: product.name,
      quantity: product.qty,
      price: product.price,
      subtotal: product.subtotal,
      vendorName: product.sellerName,
      canRefund: product.vendorStatus === "delivered",
    }));
  };

  const getTrackingSteps = (order) => {
    const orderDate = new Date(order.createdAt);
    const currentStatus = order.status.toLowerCase();

    const steps = [
      {
        id: 1,
        title: "Order Placed",
        description: "Your order has been placed successfully",
        icon: CheckCircle,
        status: "completed",
        date: formatShortDate(orderDate),
        time: formatTime(orderDate),
        color: "#00C363",
      },
      {
        id: 2,
        title: "Order Confirmed",
        description: "Seller has confirmed your order",
        icon: PackageCheck,
        status:
          currentStatus === "processing" ||
          currentStatus === "shipped" ||
          currentStatus === "delivered"
            ? "completed"
            : "pending",
        date: formatShortDate(new Date(orderDate.getTime() + 30 * 60 * 1000)),
        time: formatTime(new Date(orderDate.getTime() + 30 * 60 * 1000)),
        color: "#5A3DF6",
      },
      {
        id: 3,
        title: "Order Processed",
        description: "Seller is preparing your order for shipment",
        icon: Package,
        status:
          currentStatus === "processing" ||
          currentStatus === "shipped" ||
          currentStatus === "delivered"
            ? "completed"
            : "pending",
        date: formatShortDate(
          new Date(orderDate.getTime() + 2 * 60 * 60 * 1000)
        ),
        time: formatTime(new Date(orderDate.getTime() + 2 * 60 * 60 * 1000)),
        color: "#F7A500",
      },
      {
        id: 4,
        title: "Shipped",
        description: "Your order has been shipped",
        icon: Truck,
        status:
          currentStatus === "shipped" || currentStatus === "delivered"
            ? "completed"
            : "pending",
        date: formatShortDate(
          new Date(orderDate.getTime() + 24 * 60 * 60 * 1000)
        ),
        time: formatTime(new Date(orderDate.getTime() + 24 * 60 * 60 * 1000)),
        color: "#5A3DF6",
      },
      {
        id: 5,
        title: "Out for Delivery",
        description: "Your order is out for delivery",
        icon: Home,
        status: currentStatus === "delivered" ? "completed" : "pending",
        date: formatShortDate(
          new Date(orderDate.getTime() + 48 * 60 * 60 * 1000)
        ),
        time: formatTime(new Date(orderDate.getTime() + 48 * 60 * 60 * 1000)),
        color: "#9838E1",
      },
      {
        id: 6,
        title: "Delivered",
        description: "Your order has been delivered",
        icon: CheckCircle,
        status: currentStatus === "delivered" ? "completed" : "pending",
        date: formatShortDate(
          new Date(orderDate.getTime() + 72 * 60 * 60 * 1000)
        ),
        time: formatTime(new Date(orderDate.getTime() + 72 * 60 * 60 * 1000)),
        color: "#00C363",
      },
    ];

    return steps;
  };

  const getCurrentStatusIndex = (order) => {
    const vendorStatuses = order.rawData?.orderVendors?.map((v) => v.status) || [];

    const anyShipped = vendorStatuses.some((s) => s === "shipping");
    const allDelivered = vendorStatuses.every((s) => s === "delivered");

    if (allDelivered) {
      return 5;
    } else if (anyShipped) {
      return 3;
    } else {
      return 2;
    }
  };

  const getPaymentMethodText = (method) => {
    switch (method) {
      case "card":
        return "Credit/Debit Card";
      case "cod":
        return "Cash on Delivery";
      default:
        return method;
    }
  };

  const getPaymentStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "completed":
        return "Completed";
      case "failed":
        return "Failed";
      default:
        return status;
    }
  };

  const getVendorStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "processing":
        return "Processing";
      case "shipping":
        return "Shipped";
      case "delivered":
        return "Delivered";
      case "canceled":
        return "Cancelled";
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <section className="w-full bg-[#F7F7FA] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="w-full bg-[#F7F7FA] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">
            Error loading orders. Please try again.
          </p>
        </div>
      </section>
    );
  }

  if (orders.length === 0) {
    return (
      <section className="w-full bg-[#F7F7FA] min-h-screen pb-10 px-4">
        <div className="max-w-[850px] mx-auto">
          <div className="text-center pt-10">
            <div className="h-[80px] w-[80px] mx-auto rounded-full bg-gradient-to-r from-[#9838E1] to-[#F68E44] flex items-center justify-center mb-6">
              <Package size={32} className="text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              No Orders Yet
            </h2>
            <p className="text-gray-600">You haven't placed any orders yet.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="w-full bg-[#F7F7FA] pb-10 px-4">
        <div className="max-w-[850px] mx-auto">
          {/* TOP FILTER TABS */}
          <div className="flex justify-center mb-10">
            <div className="flex items-center gap-6 bg-white px-4 py-3 rounded-[20px] shadow-[0_4px_14px_rgba(0,0,0,0.04)] w-fit">
              {updatedTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-5 py-[10px] text-[13px] font-medium rounded-[30px] transition-all
                    ${
                      activeTab === tab.id
                        ? "text-white bg-gradient-to-r from-[#9838E1] to-[#F68E44] shadow-[0_4px_14px_rgba(0,0,0,0.15)]"
                        : "text-[#444]"
                    }
                  `}
                >
                  {tab.label}
                  <span
                    className={`
                      text-[11px] w-[22px] h-[22px] flex items-center justify-center rounded-full font-semibold
                      ${
                        activeTab === tab.id
                          ? "bg-white text-[#9838E1]"
                          : "bg-[#F2F1F6] text-[#7A7A85] shadow-[0_2px_8px_rgba(150,125,255,0.30)]"
                      }
                    `}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ORDER CARDS */}
          <div className="space-y-6">
            {filteredOrders.map((order, index) => (
              <div
                key={index}
                className="w-full bg-white border border-[#EEEAF7] rounded-[16px] shadow-[0_6px_18px_rgba(0,0,0,0.06)] p-5"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-semibold text-[#222]">
                    Order #{order.id}
                  </p>

                  <div className="flex items-center gap-2">
                    <span
                      className="text-[10px] px-2 py-[2px] rounded-full"
                      style={{
                        backgroundColor: `${order.statusColor}22`,
                        color: order.statusColor,
                      }}
                    >
                      {order.status}
                    </span>
                    <p className="text-[13px] font-semibold text-[#F78D25]">
                      ${order.price}
                    </p>
                  </div>
                </div>

                {/* Date */}
                <p className="text-[11px] text-[#777] mt-[2px]">
                  Placed on {order.date}
                </p>
                {order.expected && (
                  <p className="text-[11px] text-[#F78D25]">{order.expected}</p>
                )}

                {/* Products */}
                <div className="mt-4">
                  <div className="flex flex-wrap gap-4">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <img
                          src={item.image}
                          className="h-[45px] w-[45px] rounded-[10px] object-cover"
                          alt={item.name}
                        />
                        <div>
                          <p className="text-[12px] font-medium text-[#333]">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-[#888]">
                            Quantity: {item.qty} • ${item.price}
                          </p>
                        </div>
                      </div>
                    ))}

                    {order.totalItems > 2 && (
                      <div className="flex items-center ml-2">
                        <div className="h-[45px] w-[45px] rounded-[10px] bg-purple-50 flex items-center justify-center">
                          <span className="text-[12px] font-semibold text-purple-600">
                            +{order.totalItems - 2}
                          </span>
                        </div>
                        <div className="ml-2">
                          <p className="text-[11px] text-[#888]">
                            and {order.totalItems - 2} more item(s)
                          </p>
                          <p className="text-[10px] text-purple-500">
                            From {order.vendors.length} vendor(s)
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {order.vendors.length > 1 && (
                    <div className="mt-2 text-[10px] text-gray-500">
                      Multiple vendors in this order
                    </div>
                  )}
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex flex-wrap gap-3 mt-4">
                  <button
                    onClick={() => handleViewDetails(order)}
                    className="
                      flex-1 flex items-center justify-center gap-2
                      text-[13px] font-medium
                      border border-[#C9B8F5]
                      text-[#8A50DB]
                      py-[10px] rounded-[10px]
                      bg-white
                      hover:bg-[#F8F4FF] transition
                    "
                  >
                    <Eye size={16} className="text-[#8A50DB]" />
                    View Details
                  </button>

                  {(order.actions === "track" || order.actions === "full") && (
                    <button
                      onClick={() => handleTrackOrder(order)}
                      className="
                        flex-1 flex items-center justify-center gap-2
                        text-[13px] font-medium text-white
                        py-[10px] rounded-[10px]
                        bg-gradient-to-r from-[#9838E1] to-[#F68E44]
                        shadow-[0_4px_14px_rgba(0,0,0,0.15)]
                      "
                    >
                      <Truck size={16} className="text-white" />
                      Track Order
                    </button>
                  )}

                  {order.actions === "full" && (
                    <button
                      onClick={() => handleCancelOrder(order)}
                      className="
                        flex-1 flex items-center justify-center gap-2
                        text-[13px] font-medium
                        text-[#F78D25]
                        py-[10px] rounded-[10px]
                        border border-[#FBC9A3]
                        bg-[#FFF5EE]
                        hover:bg-[#FFEBDD] transition
                      "
                    >
                      <X size={16} className="text-[#F78D25]" />
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* HELP SECTION */}
          <div className="mt-10 flex justify-center">
            <div className="w-full max-w-[350px] bg-white rounded-[16px] border border-[#EEEAF7] shadow-[0_6px_18px_rgba(0,0,0,0.06)] p-6 text-center">
              <div className="h-[55px] w-[55px] mx-auto rounded-full bg-gradient-to-r from-[#9838E1] to-[#F68E44] flex items-center justify-center">
                <Package size={24} className="text-white" />
              </div>

              <p className="text-[14px] font-semibold text-[#333] mt-3">
                Need Help?
              </p>
              <p className="text-[12px] text-[#777] mt-1">
                Have questions about your order? Our customer support team is
                here to help.
              </p>

              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={() => console.log("Email Support clicked")}
                  className="flex-1 border border-[#E0D9F6] text-[#8A50DB] text-[12px] py-[8px] rounded-[8px] hover:bg-[#F8F4FF] transition"
                >
                  <Mail size={14} className="inline mr-1" />
                  Email Support
                </button>
                <button
                  onClick={() => console.log("Call Us clicked")}
                  className="flex-1 text-white text-[12px] py-[8px] rounded-[8px] bg-gradient-to-r from-[#9838E1] to-[#F68E44] flex items-center justify-center gap-2 hover:opacity-90 transition"
                >
                  <Phone size={14} />
                  Call Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ORDER DETAILS MODAL */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center z-10">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Order Details
                </h2>
                <p className="text-sm text-gray-600">
                  Order #{selectedOrder.id}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X size={24} className="text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Order Status Summary */}
              <div className="bg-gradient-to-r from-purple-50 to-orange-50 rounded-xl p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: selectedOrder.statusColor }}
                      />
                      <h3 className="font-bold text-lg">
                        {selectedOrder.status}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">
                      {selectedOrder.date}
                    </p>
                    {selectedOrder.expected && (
                      <p className="text-orange-500 text-sm font-medium mt-1">
                        {selectedOrder.expected}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-purple-700">
                      ${selectedOrder.subtotal}
                    </p>
                    <p className="text-sm text-gray-500">Total Amount</p>
                  </div>
                </div>
              </div>

              {/* Order Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Shipping Address */}
                <div className="bg-gray-50 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin size={20} className="text-purple-600" />
                    <h4 className="font-bold text-gray-800">
                      Shipping Address
                    </h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="font-medium">
                      {selectedOrder.address?.street}
                    </p>
                    <p>
                      {selectedOrder.address?.city},{" "}
                      {selectedOrder.address?.state}
                    </p>
                    <p>{selectedOrder.address?.postalCode}</p>
                    <p>{selectedOrder.address?.country}</p>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="bg-gray-50 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <CreditCard size={20} className="text-purple-600" />
                    <h4 className="font-bold text-gray-800">
                      Payment Information
                    </h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Method:</span>
                      <span className="font-medium">
                        {getPaymentMethodText(selectedOrder.paymentMethod)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span
                        className={`font-medium ${
                          selectedOrder.paymentStatus === "completed"
                            ? "text-green-600"
                            : selectedOrder.paymentStatus === "pending"
                            ? "text-orange-600"
                            : "text-red-600"
                        }`}
                      >
                        {getPaymentStatusText(selectedOrder.paymentStatus)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Date:</span>
                      <span className="font-medium">{selectedOrder.date}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* All Products Section */}
              <div className="border rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-5 py-4 border-b">
                  <div className="flex items-center gap-2">
                    <ShoppingBag size={20} className="text-purple-600" />
                    <h4 className="font-bold text-gray-800">Order Items</h4>
                    <span className="ml-2 bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">
                      {selectedOrder.totalItems} items
                    </span>
                  </div>
                </div>

                <div className="divide-y">
                  {selectedOrder.allProducts.map((product, index) => (
                    <div
                      key={index}
                      className="p-5 hover:bg-gray-50 transition"
                    >
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-20 h-20 rounded-lg object-cover border"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h5 className="font-bold text-gray-800">
                                {product.name}
                              </h5>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {product.description}
                              </p>
                              <div className="flex items-center gap-4 mt-2">
                                <span className="text-sm text-gray-500">
                                  Category: {product.category}
                                </span>
                                <span
                                  className={`text-xs px-2 py-1 rounded-full ${
                                    product.vendorStatus === "delivered"
                                      ? "bg-green-100 text-green-800"
                                      : product.vendorStatus === "shipping"
                                      ? "bg-blue-100 text-blue-800"
                                      : product.vendorStatus === "processing"
                                      ? "bg-orange-100 text-orange-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {getVendorStatusText(product.vendorStatus)}
                                </span>
                              </div>
                            </div>

                            {/* Price and Quantity */}
                            <div className="text-right">
                              <p className="text-lg font-bold text-gray-800">
                                ${product.price}
                              </p>
                              <p className="text-sm text-gray-600">
                                Qty: {product.qty}
                              </p>
                              <p className="text-sm font-medium text-purple-600 mt-1">
                                Subtotal: ${product.subtotal.toFixed(2)}
                              </p>
                            </div>
                          </div>

                          {/* Vendor Info and Action Buttons */}
                          <div className="mt-3 pt-3 border-t border-dashed">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <User size={14} />
                                <span>
                                  Vendor: {product.sellerName || "Unknown"}
                                </span>
                                <ChevronRight size={14} />
                                <span>
                                  Product ID:{" "}
                                  {product.productId?.substring(0, 8)}...
                                </span>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex gap-2">
                                {/* Review Button */}
                                {product.canReview && (
                                  <button
                                    onClick={() => handleReviewProduct(product)}
                                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 transition"
                                  >
                                    <Star size={14} />
                                    Write Review
                                  </button>
                                )}

                                {/* Refund Button */}
                                {product.canReview && (
                                  <button
                                    onClick={() => handleRefundRequest(product)}
                                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-amber-50 text-amber-700 border border-amber-200 rounded-lg hover:bg-amber-100 transition"
                                  >
                                    <FileText size={14} />
                                    Refund Request
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vendors Summary */}
              {selectedOrder.vendors.length > 0 && (
                <div className="border rounded-xl overflow-hidden">
                  <div className="bg-gray-50 px-5 py-4 border-b">
                    <div className="flex items-center gap-2">
                      <User size={20} className="text-purple-600" />
                      <h4 className="font-bold text-gray-800">Vendors</h4>
                      <span className="ml-2 bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">
                        {selectedOrder.vendors.length} vendors
                      </span>
                    </div>
                  </div>

                  <div className="divide-y">
                    {selectedOrder.vendors.map((vendor, index) => (
                      <div key={index} className="p-5">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                Vendor {index + 1}:{" "}
                                {vendor.vendorId?.name || "Unknown"}
                              </span>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  vendor.status === "delivered"
                                    ? "bg-green-100 text-green-800"
                                    : vendor.status === "shipping"
                                    ? "bg-blue-100 text-blue-800"
                                    : vendor.status === "processing"
                                    ? "bg-orange-100 text-orange-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {getVendorStatusText(vendor.status)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              ID: {vendor._id.substring(0, 8)}...
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="font-bold text-gray-800">
                              ${(vendor.amount / 100).toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500">
                              {vendor.products.length} items
                            </p>
                          </div>
                        </div>

                        {/* Vendor Products List */}
                        {vendor.products.length > 0 && (
                          <div className="mt-3 ml-4 space-y-2">
                            {vendor.products.map((item, itemIndex) => {
                              const itemTotal =
                                (item.price || 0) * (item.quantity || 1);
                              return (
                                <div
                                  key={itemIndex}
                                  className="flex items-center gap-3 text-sm"
                                >
                                  <div className="w-2 h-2 rounded-full bg-gray-300" />
                                  <span>
                                    {item.product?.name || "Unknown Product"}
                                  </span>
                                  <span className="text-gray-500">
                                    ×{item.quantity}
                                  </span>
                                  <span className="ml-auto font-medium">
                                    ${itemTotal.toFixed(2)}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-xl p-5">
                <h4 className="font-bold text-gray-800 mb-4">Order Summary</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Subtotal ({selectedOrder.totalItems} items)
                    </span>
                    <span className="font-medium">
                      ${selectedOrder.subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">$0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">$0.00</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-purple-700">
                        ${selectedOrder.subtotal}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t p-6 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                Close
              </button>
              {selectedOrder.actions === "full" && (
                <button
                  onClick={() => {
                    handleCancelOrder(selectedOrder);
                    setIsModalOpen(false);
                  }}
                  className="px-6 py-3 bg-red-50 border border-red-200 rounded-lg text-red-600 font-medium hover:bg-red-100 transition"
                >
                  Cancel Order
                </button>
              )}
              {(selectedOrder.actions === "track" ||
                selectedOrder.actions === "full") && (
                <button
                  onClick={() => {
                    handleTrackOrder(selectedOrder);
                    setIsModalOpen(false);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-[#9838E1] to-[#F68E44] rounded-lg text-white font-medium hover:opacity-90 transition"
                >
                  Track Order
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* REFUND REQUEST MODAL */}
{isRefundModalOpen && selectedProductForRefund && (
  <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      {/* Modal Header */}
      <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <FileText size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Request Refund
            </h2>
            <p className="text-sm text-gray-600">
              Order #
              {selectedProductForRefund.orderId ||
                selectedProductForRefund.rawData?.orderId}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsRefundModalOpen(false)}
          className="p-2 hover:bg-gray-100 rounded-full transition"
          disabled={isSubmittingRefund}
        >
          <X size={24} className="text-gray-500" />
        </button>
      </div>

      {/* Modal Content */}
      <div className="p-6 space-y-6">
        {/* Order Information */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-5">
          <div className="flex items-start gap-4">
            <img
              src={selectedProductForRefund.image}
              alt={selectedProductForRefund.name}
              className="w-20 h-20 rounded-lg object-cover border"
            />
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 text-lg">
                {selectedProductForRefund.name}
              </h3>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-medium">
                    {selectedProductForRefund.orderId ||
                      selectedProductForRefund.rawData?.orderId}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment ID</p>
                  <p className="font-medium">
                    {selectedProductForRefund.rawData?.paymentId?.substring(
                      0,
                      12
                    )}
                    ...
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="font-medium">
                    {new Date(
                      selectedProductForRefund.rawData?.createdAt
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Status</p>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      selectedProductForRefund.rawData?.paymentStatus === "paid"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {selectedProductForRefund.rawData?.paymentStatus || "Unknown"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Refund Type Selection */}
        <div className="border rounded-xl p-5">
          <h4 className="font-bold text-gray-800 mb-4">Refund Type</h4>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => {
                setRefundType("full");
                setSelectedItems([]); // Full refund হলে আইটেম সিলেকশন ক্লিয়ার
              }}
              className={`p-4 border-2 rounded-lg transition-all ${
                refundType === "full"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${
                    refundType === "full"
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {refundType === "full" && (
                    <CheckCircle2 size={14} className="text-white" />
                  )}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-800">Full Refund</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Refund the entire order amount
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    ${(selectedProductForRefund.rawData?.amount  || 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setRefundType("partial")}
              className={`p-4 border-2 rounded-lg transition-all ${
                refundType === "partial"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${
                    refundType === "partial"
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {refundType === "partial" && (
                    <CheckCircle2 size={14} className="text-white" />
                  )}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-800">Partial Refund</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Refund specific items from your order
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Partial Item Selection - শুধু partial হলে দেখাবে */}
     

        {/* Refund Reason */}
        <div className="border rounded-xl p-5">
          <h4 className="font-bold text-gray-800 mb-4">Refund Reason</h4>
          <div className="space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                "Item Damaged",
                "Wrong Item",
                "Not as Described",
                "Late Delivery",
                "Quality Issue",
                "Changed Mind",
                "Other",
              ].map((reason) => (
                <button
                  key={reason}
                  onClick={() => setRefundReason(reason)}
                  className={`px-4 py-2 border rounded-lg text-sm transition-all ${
                    refundReason === reason
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 text-gray-700 hover:border-blue-300"
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>
            <textarea
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              placeholder="Please provide detailed reason for your refund request..."
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
            />
          </div>
        </div>

        {/* Evidence Links */}
        <div className="border rounded-xl p-5">
          <h4 className="font-bold text-gray-800 mb-4">Evidence Links (Optional)</h4>
          <p className="text-sm text-gray-600 mb-4">
            Add links to photos, documents, or any supporting evidence for your refund request.
            You can add multiple links.
          </p>

          {/* Evidence Links Input */}
          <div className="space-y-3">
            {evidenceFiles.map((evidence, index) => (
              <div key={index} className="flex gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    <span className="text-sm font-medium text-gray-700">
                      Evidence Link {index + 1}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={evidence.url}
                      onChange={(e) => {
                        const newFiles = [...evidenceFiles];
                        newFiles[index].url = e.target.value;
                        setEvidenceFiles(newFiles);
                      }}
                      placeholder="https://example.com/evidence.jpg"
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      value={evidence.note}
                      onChange={(e) => {
                        const newFiles = [...evidenceFiles];
                        newFiles[index].note = e.target.value;
                        setEvidenceFiles(newFiles);
                      }}
                      placeholder="Description (optional)"
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                {evidenceFiles.length > 1 && (
                  <button
                    onClick={() => removeEvidenceFile(index)}
                    className="mt-7 p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            ))}

            {/* Add More Evidence Link Button */}
            <button
              onClick={() => {
                if (evidenceFiles.length < 5) {
                  setEvidenceFiles([
                    ...evidenceFiles,
                    { url: "", type: "link", note: "" }
                  ]);
                }
              }}
              disabled={evidenceFiles.length >= 5}
              className={`w-full py-3 border-2 border-dashed rounded-lg flex items-center justify-center gap-2 transition ${
                evidenceFiles.length >= 5
                  ? "border-gray-200 text-gray-400 cursor-not-allowed"
                  : "border-blue-300 text-blue-600 hover:border-blue-400 hover:bg-blue-50"
              }`}
            >
              <Plus size={18} />
              Add Another Evidence Link
              <span className="text-xs text-gray-500">
                ({evidenceFiles.length}/5)
              </span>
            </button>
          </div>

          {/* File Upload Tips */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle
                size={20}
                className="text-blue-600 flex-shrink-0 mt-0.5"
              />
              <div>
                <h5 className="font-medium text-blue-800">
                  Tips for Evidence Links
                </h5>
                <ul className="text-sm text-blue-700 mt-1 space-y-1">
                  <li>• Google Drive, Dropbox, or Imgur links for photos</li>
                  <li>• Direct links to images (jpg, png, etc.)</li>
                  <li>• Document links (PDF, Google Docs, etc.)</li>
                  <li>• YouTube or video links showing the issue</li>
                  <li>• Make sure links are publicly accessible</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Refund Summary */}
        <div className="border rounded-xl p-5">
          <h4 className="font-bold text-gray-800 mb-4">Refund Summary</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Refund Type:</span>
              <span className="font-medium capitalize">{refundType} Refund</span>
            </div>

        

            <div className="flex justify-between">
              <span className="text-gray-600">Evidence Links:</span>
              <span className="font-medium">
                {evidenceFiles.filter(e => e.url.trim()).length} link(s)
              </span>
            </div>

            {/* <div className="pt-3 border-t">
              <div className="flex justify-between text-lg font-bold">
                <span>Estimated Refund Amount</span>
                <span className="text-green-600">
                  $
                  {(() => {
                    if (refundType === "full") {
                      // Full refund হলে পুরো অর্ডারের টাকা
                      return (selectedProductForRefund.rawData?.amount  || 0).toFixed(2);
                    } else {
                      // Partial refund হলে শুধু সিলেক্টেড আইটেমের টাকা
                      return '--';
                    }
                  })()}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                * Actual refund amount may vary based on seller approval and platform policies
              </p>
            </div> */}
          </div>
        </div>
      </div>

      {/* Modal Footer */}
      <div className="sticky bottom-0 bg-white border-t p-6 flex justify-between gap-3">
        <button
          onClick={() => setIsRefundModalOpen(false)}
          className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
          disabled={isSubmittingRefund}
        >
          Cancel
        </button>
        <div className="flex gap-3">
          <button
            onClick={() => {
              const refundData = {
                paymentId: selectedProductForRefund.rawData?.paymentId,
                orderId:
                  selectedProductForRefund.orderId ||
                  selectedProductForRefund.rawData?.orderId,
                userId: id,
                items:
                  refundType === "partial" && selectedItems.length > 0
                    ? selectedItems.map((item) => ({
                        orderVendorId: item.orderVendorId,
                        productId: item.productId,
                        quantity: item.quantity,
                        reason: refundReason,
                      }))
                    : undefined,
                reason: refundReason,
                evidence: evidenceFiles
                  .filter(e => e.url.trim()) // শুধু ভরাট লিঙ্কগুলো
                  .map((file) => ({
                    url: file.url,
                    type: file.type,
                    note: file.note,
                  })),
              };
              console.log("Refund Request Preview:", refundData);
              console.log("Selected Items Details:", selectedItems);
            }}
            className="px-6 py-3 border border-blue-500 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition flex items-center gap-2"
            disabled={isSubmittingRefund}
          >
            <FileText size={16} />
            Preview Data
          </button>
          <button
            onClick={handleSubmitRefund}
            disabled={
              isSubmittingRefund ||
              !refundReason.trim() 
            
            }
            className={`px-6 py-3 rounded-lg font-medium transition flex items-center gap-2 ${
              isSubmittingRefund ||
              !refundReason.trim() ||
              (refundType === "partial" && selectedItems.length === 0)
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-9"
                : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90"
            }`}
          >
            {isSubmittingRefund ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Submitting...
              </>
            ) : (
              <>
                <Upload size={16} />
                Submit Refund Request
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  </div>
)}

      {/* TRACK ORDER MODAL */}
      {isTrackModalOpen && trackingOrder && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center z-10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#9838E1] to-[#F68E44] flex items-center justify-center">
                  <Truck size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Track Order
                  </h2>
                  <p className="text-sm text-gray-600">
                    Order #{trackingOrder.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsTrackModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X size={24} className="text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Order Status Summary */}
              <div className="bg-gradient-to-r from-purple-50 to-orange-50 rounded-xl p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: trackingOrder.statusColor }}
                      />
                      <h3 className="font-bold text-lg">
                        {trackingOrder.status}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">
                      {trackingOrder.date}
                    </p>
                    {trackingOrder.expected && (
                      <p className="text-orange-500 text-sm font-medium mt-1">
                        {trackingOrder.expected}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-purple-700">
                      ${trackingOrder.price}
                    </p>
                    <p className="text-sm text-gray-500">Total Amount</p>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="border rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin size={20} className="text-purple-600" />
                  <h4 className="font-bold text-gray-800">Delivery Address</h4>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="font-medium">{trackingOrder.address?.street}</p>
                  <p>
                    {trackingOrder.address?.city},{" "}
                    {trackingOrder.address?.state}
                  </p>
                  <p>{trackingOrder.address?.postalCode}</p>
                  <p>{trackingOrder.address?.country}</p>
                </div>
              </div>

              {/* Tracking Progress */}
              <div className="border rounded-xl p-5">
                <div className="flex items-center gap-2 mb-6">
                  <Truck size={20} className="text-purple-600" />
                  <h4 className="font-bold text-gray-800">Tracking Progress</h4>
                </div>

                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                  {/* Steps */}
                  <div className="space-y-8 relative">
                    {getTrackingSteps(trackingOrder).map((step, index) => {
                      const isCompleted = step.status === "completed";
                      const isCurrent =
                        index === getCurrentStatusIndex(trackingOrder);
                      const Icon = step.icon;

                      return (
                        <div key={step.id} className="flex items-start gap-4">
                          {/* Step Icon */}
                          <div
                            className={`relative z-10 flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center
                            ${
                              isCompleted
                                ? "bg-gradient-to-r from-[#9838E1] to-[#F68E44]"
                                : isCurrent
                                ? "bg-white border-2 border-[#9838E1] animate-pulse"
                                : "bg-gray-100 border-2 border-gray-200"
                            }`}
                            style={isCurrent ? { borderColor: step.color } : {}}
                          >
                            <Icon
                              size={20}
                              className={
                                isCompleted
                                  ? "text-white"
                                  : isCurrent
                                  ? "text-[#9838E1]"
                                  : "text-gray-400"
                              }
                            />

                            {/* Current Step Indicator */}
                            {isCurrent && (
                              <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
                                <div className="h-2 w-2 rounded-full bg-white animate-ping"></div>
                              </div>
                            )}
                          </div>

                          {/* Step Content */}
                          <div className="flex-1 pt-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h5
                                  className={`font-bold ${
                                    isCompleted || isCurrent
                                      ? "text-gray-800"
                                      : "text-gray-500"
                                  }`}
                                >
                                  {step.title}
                                </h5>
                                <p
                                  className={`text-sm mt-1 ${
                                    isCompleted || isCurrent
                                      ? "text-gray-600"
                                      : "text-gray-400"
                                  }`}
                                >
                                  {step.description}
                                </p>
                              </div>
                              <div className="text-right">
                                <p
                                  className={`text-xs font-medium ${
                                    isCompleted || isCurrent
                                      ? "text-gray-700"
                                      : "text-gray-400"
                                  }`}
                                >
                                  {step.date}
                                </p>
                                <p
                                  className={`text-xs ${
                                    isCompleted || isCurrent
                                      ? "text-gray-600"
                                      : "text-gray-400"
                                  }`}
                                >
                                  {step.time}
                                </p>
                              </div>
                            </div>

                            {/* Status Badge */}
                            <div className="mt-3">
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  isCompleted
                                    ? "bg-green-100 text-green-800"
                                    : isCurrent
                                    ? "bg-blue-100 text-blue-800 animate-pulse"
                                    : "bg-gray-100 text-gray-500"
                                }`}
                              >
                                {isCompleted
                                  ? "Completed"
                                  : isCurrent
                                  ? "In Progress"
                                  : "Pending"}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Package Details */}
              <div className="border rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Package size={20} className="text-purple-600" />
                  <h4 className="font-bold text-gray-800">Package Details</h4>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-500">Order ID</p>
                      <p className="font-medium">{trackingOrder.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Total Items</p>
                      <p className="font-medium">
                        {trackingOrder.totalItems} items
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-500">Package Weight</p>
                      <p className="font-medium">Approx. 2.5 kg</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Shipping Method</p>
                      <p className="font-medium">Standard Delivery</p>
                    </div>
                  </div>
                </div>

                {/* Products Preview */}
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Items in this order:
                  </p>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {trackingOrder.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex-shrink-0 flex items-center gap-2 bg-gray-50 rounded-lg p-2"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-md object-cover"
                        />
                        <div>
                          <p className="text-xs font-medium text-gray-800 line-clamp-1">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Qty: {item.qty}
                          </p>
                        </div>
                      </div>
                    ))}
                    {trackingOrder.totalItems > 2 && (
                      <div className="flex-shrink-0 flex items-center justify-center bg-purple-50 rounded-lg p-3">
                        <span className="text-sm font-bold text-purple-600">
                          +{trackingOrder.totalItems - 2} more
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t p-6 flex justify-between gap-3">
              <button
                onClick={() => setIsTrackModalOpen(false)}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                Close
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    handleViewDetails(trackingOrder);
                    setIsTrackModalOpen(false);
                  }}
                  className="px-6 py-3 border border-[#C9B8F5] text-[#8A50DB] rounded-lg font-medium hover:bg-[#F8F4FF] transition flex items-center gap-2"
                >
                  <Eye size={16} />
                  View Details
                </button>
                {trackingOrder.actions === "full" && (
                  <button
                    onClick={() => {
                      handleCancelOrder(trackingOrder);
                      setIsTrackModalOpen(false);
                    }}
                    className="px-6 py-3 bg-red-50 border border-red-200 rounded-lg text-red-600 font-medium hover:bg-red-100 transition flex items-center gap-2"
                  >
                    <X size={16} />
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REVIEW MODAL */}
      {isReviewModalOpen && selectedProductForReview && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                  <Star size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Write a Review
                  </h2>
                  <p className="text-sm text-gray-600">
                    {selectedProductForReview.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X size={24} className="text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Product Info */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <img
                  src={selectedProductForReview.image}
                  alt={selectedProductForReview.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-bold text-gray-800">
                    {selectedProductForReview.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Seller: {selectedProductForReview.sellerName || "Unknown"}
                  </p>
                  <p className="text-xs text-gray-500">
                    Product ID:{" "}
                    {selectedProductForReview.productId?.substring(0, 8)}...
                  </p>
                </div>
              </div>

              {/* Rating */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-800">Your Rating</h4>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1"
                    >
                      <StarIcon
                        size={32}
                        className={
                          star <= rating
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300"
                        }
                      />
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  {rating === 0
                    ? "Select a rating"
                    : rating === 1
                    ? "Poor"
                    : rating === 2
                    ? "Fair"
                    : rating === 3
                    ? "Good"
                    : rating === 4
                    ? "Very Good"
                    : "Excellent"}
                </p>
              </div>

              {/* Review Text */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-800">Your Review</h4>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience with this product..."
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows={4}
                />
              </div>

              {/* Review Guidelines */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">
                  Review Guidelines
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-blue-600 mt-2"></div>
                    <span>Be honest and objective</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-blue-600 mt-2"></div>
                    <span>Focus on the product quality and features</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-blue-600 mt-2"></div>
                    <span>Share your genuine experience</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t p-6 flex justify-end gap-3">
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={rating === 0 || !reviewText.trim()}
                className={`px-6 py-3 rounded-lg font-medium transition flex items-center gap-2 ${
                  rating === 0 || !reviewText.trim()
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:opacity-90"
                }`}
              >
                <MessageSquare size={16} />
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CANCEL CONFIRMATION MODAL */}
      {isCancelConfirmOpen && orderToCancel && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
                  <X size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Cancel Order
                  </h2>
                  <p className="text-sm text-gray-600">
                    Order #{orderToCancel.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCancelConfirmOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X size={24} className="text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Warning Message */}
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center">
                      <X size={14} className="text-red-600" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-red-800">Warning</h4>
                    <p className="text-sm text-red-700 mt-1">
                      Are you sure you want to cancel this order? This action
                      cannot be undone.
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-medium">{orderToCancel.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Date:</span>
                  <span className="font-medium">{orderToCancel.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-bold text-red-600">
                    ${orderToCancel.price}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Items:</span>
                  <span className="font-medium">
                    {orderToCancel.totalItems} items
                  </span>
                </div>
              </div>

              {/* Reason Selection */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-800">
                  Reason for Cancellation
                </h4>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                  <option value="">Select a reason</option>
                  <option value="change-mind">Changed my mind</option>
                  <option value="price-issue">Found better price</option>
                  <option value="delivery-time">Delivery time too long</option>
                  <option value="wrong-item">Ordered wrong item</option>
                  <option value="other">Other reason</option>
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t p-6 flex justify-end gap-3">
              <button
                onClick={() => setIsCancelConfirmOpen(false)}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                Go Back
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg text-white font-medium hover:opacity-90 transition flex items-center gap-2"
              >
                <X size={16} />
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}