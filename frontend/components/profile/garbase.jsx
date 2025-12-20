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
} from "lucide-react";
import { useMyOrderQuery } from "@/feature/customer/OrderApi";
import { useSession } from "next-auth/react";
import { useSaveReviewMutation } from "@/feature/review/ReviewApi";

export default function OrdersPage() {
  // ... existing code remains same until the refund related states ...

  // Add these new states for refund request
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [selectedProductForRefund, setSelectedProductForRefund] = useState(null);
  const [refundType, setRefundType] = useState("full"); // "full" or "partial"
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [refundReason, setRefundReason] = useState("");
  const [evidenceFiles, setEvidenceFiles] = useState([]);
  const [isSubmittingRefund, setIsSubmittingRefund] = useState(false);

  // ... rest of the existing code remains same until the handleReviewProduct function ...

  // Handle Refund Request button click
  const handleRefundRequest = (product) => {
    setSelectedProductForRefund(product);
    setRefundType("full");
    setSelectedVendors([]);
    setSelectedItems([]);
    setRefundReason("");
    setEvidenceFiles([]);
    setIsRefundModalOpen(true);
  };

  // Handle vendor selection for refund
  const handleVendorSelect = (vendorId) => {
    if (selectedVendors.includes(vendorId)) {
      setSelectedVendors(selectedVendors.filter(id => id !== vendorId));
    } else {
      setSelectedVendors([...selectedVendors, vendorId]);
    }
  };

  // Handle product item selection for partial refund
  const handleItemSelect = (item) => {
    const existingItemIndex = selectedItems.findIndex(
      selected => selected.productId === item.productId && 
                 selected.orderVendorId === item.vendorId
    );
    
    if (existingItemIndex >= 0) {
      const newSelectedItems = [...selectedItems];
      newSelectedItems.splice(existingItemIndex, 1);
      setSelectedItems(newSelectedItems);
    } else {
      setSelectedItems([...selectedItems, {
        orderVendorId: item.vendorId,
        productId: item.productId,
        quantity: item.qty,
        reason: "",
        evidence: []
      }]);
    }
  };

  // Handle evidence file upload
  const handleEvidenceUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Convert files to base64 data URLs
    const newEvidenceFiles = [];
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newEvidenceFiles.push({
          url: reader.result,
          type: file.type.startsWith('image/') ? 'image' : 'document',
          note: "",
          file: file
        });
        
        if (newEvidenceFiles.length === files.length) {
          setEvidenceFiles([...evidenceFiles, ...newEvidenceFiles]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove evidence file
  const removeEvidenceFile = (index) => {
    const newFiles = [...evidenceFiles];
    newFiles.splice(index, 1);
    setEvidenceFiles(newFiles);
  };

  // Submit refund request
  const handleSubmitRefund = () => {
    if (!selectedProductForRefund) return;

    const refundData = {
      paymentId: selectedProductForRefund.rawData?.paymentId || "",
      orderId: selectedProductForRefund.orderId || "",
      userId: id,
      reason: refundReason,
      evidence: evidenceFiles.map(file => ({
        url: file.url,
        type: file.type,
        note: file.note
      }))
    };

    // Add vendor or item specific data based on refund type
    if (refundType === "full" && selectedVendors.length > 0) {
      refundData.sellerIds = selectedVendors;
    } else if (refundType === "partial" && selectedItems.length > 0) {
      refundData.items = selectedItems.map(item => ({
        orderVendorId: item.orderVendorId,
        productId: item.productId,
        quantity: item.quantity,
        reason: item.reason,
        evidence: item.evidence
      }));
    }

    console.log("=== REFUND REQUEST DATA ===");
    console.log("Refund Data:", refundData);
    console.log("Selected Product:", selectedProductForRefund);
    console.log("========================");

    // Here you would call your API
    setIsSubmittingRefund(true);
    
    // Simulate API call
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
      setEvidenceFiles([]);
    }, 2000);
  };

  // Get all unique vendors from the selected product's order
  const getAllVendorsForRefund = () => {
    if (!selectedProductForRefund || !selectedProductForRefund.rawData) return [];
    
    return selectedProductForRefund.rawData.orderVendors.map(vendor => ({
      id: vendor._id,
      name: vendor.seller?.name || "Unknown Vendor",
      sellerId: vendor.seller,
      status: vendor.status,
      amount: (vendor.amount / 100).toFixed(2)
    }));
  };

  // Get all items from the order for partial refund selection
  const getAllItemsForRefund = () => {
    if (!selectedProductForRefund || !selectedProductForRefund.allProducts) return [];
    
    return selectedProductForRefund.allProducts.map(product => ({
      orderVendorId: product.vendorId,
      productId: product.productId,
      name: product.name,
      quantity: product.qty,
      price: product.price,
      subtotal: product.subtotal,
      vendorName: product.sellerName,
      canRefund: product.vendorStatus === "delivered" // Only delivered items can be refunded
    }));
  };

  // ... rest of the existing code remains same until the return statement ...

  return (
    <>
      {/* ... all existing JSX code remains same ... */}

      {/* ------------------- REFUND REQUEST MODAL ------------------- */}
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
                    Order #{selectedProductForRefund.orderId || selectedProductForRefund.rawData?.orderId}
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
                          {selectedProductForRefund.orderId || selectedProductForRefund.rawData?.orderId}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Payment ID</p>
                        <p className="font-medium">
                          {selectedProductForRefund.rawData?.paymentId?.substring(0, 12)}...
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Order Date</p>
                        <p className="font-medium">
                          {new Date(selectedProductForRefund.rawData?.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Payment Status</p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          selectedProductForRefund.rawData?.paymentStatus === "paid" 
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
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
                    onClick={() => setRefundType("full")}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      refundType === "full"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${
                        refundType === "full"
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300"
                      }`}>
                        {refundType === "full" && (
                          <CheckCircle2 size={14} className="text-white" />
                        )}
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-gray-800">Full Refund</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Refund the entire order from selected vendors
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
                      <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${
                        refundType === "partial"
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300"
                      }`}>
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

              {/* Vendor/Item Selection based on refund type */}
              {refundType === "full" && (
                <div className="border rounded-xl p-5">
                  <h4 className="font-bold text-gray-800 mb-4">Select Vendors for Refund</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Select the vendor(s) you want to request refund from. This will refund all items from the selected vendors.
                  </p>
                  
                  <div className="space-y-3">
                    {getAllVendorsForRefund().map((vendor) => (
                      <div
                        key={vendor.id}
                        onClick={() => handleVendorSelect(vendor.id)}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedVendors.includes(vendor.id)
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                              selectedVendors.includes(vendor.id)
                                ? "border-blue-500 bg-blue-500"
                                : "border-gray-300"
                            }`}>
                              {selectedVendors.includes(vendor.id) && (
                                <CheckCircle2 size={12} className="text-white" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{vendor.name}</p>
                              <p className="text-sm text-gray-600">
                                Vendor ID: {vendor.id.substring(0, 8)}...
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-800">${vendor.amount}</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              vendor.status === "delivered"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}>
                              {vendor.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {refundType === "partial" && (
                <div className="border rounded-xl p-5">
                  <h4 className="font-bold text-gray-800 mb-4">Select Items for Refund</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Select specific items you want to refund. You can select multiple items.
                  </p>
                  
                  <div className="space-y-3">
                    {getAllItemsForRefund().map((item, index) => (
                      <div
                        key={`${item.productId}-${index}`}
                        onClick={() => item.canRefund && handleItemSelect(item)}
                        className={`p-4 border rounded-lg transition-all ${
                          selectedItems.some(selected => 
                            selected.productId === item.productId && 
                            selected.orderVendorId === item.orderVendorId
                          )
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        } ${!item.canRefund ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                              selectedItems.some(selected => 
                                selected.productId === item.productId && 
                                selected.orderVendorId === item.orderVendorId
                              )
                                ? "border-blue-500 bg-blue-500"
                                : "border-gray-300"
                            } ${!item.canRefund ? "bg-gray-100" : ""}`}>
                              {selectedItems.some(selected => 
                                selected.productId === item.productId && 
                                selected.orderVendorId === item.orderVendorId
                              ) && (
                                <CheckCircle2 size={12} className="text-white" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{item.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm text-gray-600">
                                  Vendor: {item.vendorName}
                                </span>
                                <span className="text-xs text-gray-500">•</span>
                                <span className="text-sm text-gray-600">
                                  Qty: {item.quantity}
                                </span>
                                <span className="text-xs text-gray-500">•</span>
                                <span className="text-sm text-gray-600">
                                  ${item.price} each
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-800">${item.subtotal.toFixed(2)}</p>
                            {!item.canRefund && (
                              <p className="text-xs text-red-600 mt-1">Not eligible for refund</p>
                            )}
                          </div>
                        </div>
                        
                        {/* Item reason input for selected items */}
                        {selectedItems.some(selected => 
                          selected.productId === item.productId && 
                          selected.orderVendorId === item.orderVendorId
                        ) && (
                          <div className="mt-3 pt-3 border-t">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Reason for refunding this item
                            </label>
                            <textarea
                              placeholder="Why are you requesting refund for this item?"
                              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              rows={2}
                              onChange={(e) => {
                                const newItems = [...selectedItems];
                                const itemIndex = newItems.findIndex(selected => 
                                  selected.productId === item.productId && 
                                  selected.orderVendorId === item.orderVendorId
                                );
                                if (itemIndex >= 0) {
                                  newItems[itemIndex].reason = e.target.value;
                                  setSelectedItems(newItems);
                                }
                              }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Refund Reason */}
              <div className="border rounded-xl p-5">
                <h4 className="font-bold text-gray-800 mb-4">Refund Reason</h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {["Item Damaged", "Wrong Item", "Not as Described", "Late Delivery", "Quality Issue", "Changed Mind", "Other"].map((reason) => (
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

              {/* Evidence Upload */}
              <div className="border rounded-xl p-5">
                <h4 className="font-bold text-gray-800 mb-4">Evidence (Optional)</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Upload photos or documents that support your refund request (max 5 files)
                </p>
                
                {/* File Upload Area */}
                <div className="mb-6">
                  <label className="block">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition cursor-pointer">
                      <Upload size={32} className="mx-auto text-gray-400 mb-3" />
                      <p className="text-gray-700 font-medium">
                        Click to upload evidence files
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Upload images, documents, or any supporting files
                      </p>
                      <input
                        type="file"
                        multiple
                        accept="image/*,.pdf,.doc,.docx"
                        className="hidden"
                        onChange={handleEvidenceUpload}
                        disabled={evidenceFiles.length >= 5}
                      />
                    </div>
                  </label>
                </div>

                {/* Uploaded Files Preview */}
                {evidenceFiles.length > 0 && (
                  <div className="space-y-3">
                    <h5 className="font-medium text-gray-700">Uploaded Files</h5>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {evidenceFiles.map((file, index) => (
                        <div key={index} className="border rounded-lg p-3 relative group">
                          <div className="flex items-start gap-3">
                            {file.type === 'image' ? (
                              <div className="flex-shrink-0">
                                <img
                                  src={file.url}
                                  alt={`Evidence ${index + 1}`}
                                  className="w-16 h-16 object-cover rounded"
                                />
                              </div>
                            ) : (
                              <div className="flex-shrink-0 h-16 w-16 bg-gray-100 rounded flex items-center justify-center">
                                <FileText size={24} className="text-gray-400" />
                              </div>
                            )}
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800 truncate">
                                {file.file?.name || `Evidence ${index + 1}`}
                              </p>
                              <p className="text-xs text-gray-500">
                                {file.type === 'image' ? 'Image' : 'Document'}
                              </p>
                              <input
                                type="text"
                                placeholder="Add a note (optional)"
                                className="w-full mt-2 p-1 text-xs border border-gray-300 rounded"
                                value={file.note}
                                onChange={(e) => {
                                  const newFiles = [...evidenceFiles];
                                  newFiles[index].note = e.target.value;
                                  setEvidenceFiles(newFiles);
                                }}
                              />
                            </div>
                          </div>
                          <button
                            onClick={() => removeEvidenceFile(index)}
                            className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* File Upload Tips */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-medium text-blue-800">Tips for Evidence</h5>
                      <ul className="text-sm text-blue-700 mt-1 space-y-1">
                        <li>• Clear photos of damaged or incorrect items</li>
                        <li>• Screenshots of product description vs received item</li>
                        <li>• Packaging photos showing damage during shipping</li>
                        <li>• Any relevant communication with the seller</li>
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
                  
                  {refundType === "full" && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Selected Vendors:</span>
                      <span className="font-medium">{selectedVendors.length} vendor(s)</span>
                    </div>
                  )}
                  
                  {refundType === "partial" && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Selected Items:</span>
                      <span className="font-medium">{selectedItems.length} item(s)</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Evidence Files:</span>
                    <span className="font-medium">{evidenceFiles.length} file(s)</span>
                  </div>
                  
                  <div className="pt-3 border-t">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Estimated Refund Amount</span>
                      <span className="text-green-600">
                        ${(() => {
                          if (refundType === "full") {
                            // Calculate total from selected vendors
                            return selectedVendors.reduce((total, vendorId) => {
                              const vendor = getAllVendorsForRefund().find(v => v.id === vendorId);
                              return total + (parseFloat(vendor?.amount || 0));
                            }, 0).toFixed(2);
                          } else {
                            // Calculate total from selected items
                            return selectedItems.reduce((total, item) => {
                              const fullItem = getAllItemsForRefund().find(i => 
                                i.productId === item.productId && 
                                i.orderVendorId === item.orderVendorId
                              );
                              return total + (fullItem?.subtotal || 0);
                            }, 0).toFixed(2);
                          }
                        })()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      * Actual refund amount may vary based on seller approval and platform policies
                    </p>
                  </div>
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
                    // Preview the data in console
                    const refundData = {
                      paymentId: selectedProductForRefund.rawData?.paymentId,
                      orderId: selectedProductForRefund.orderId || selectedProductForRefund.rawData?.orderId,
                      userId: id,
                      sellerIds: refundType === "full" ? selectedVendors : undefined,
                      items: refundType === "partial" ? selectedItems.map(item => ({
                        orderVendorId: item.orderVendorId,
                        productId: item.productId,
                        quantity: item.quantity,
                        reason: item.reason,
                        evidence: item.evidence
                      })) : undefined,
                      reason: refundReason,
                      evidence: evidenceFiles.map(file => ({
                        url: file.url,
                        type: file.type,
                        note: file.note
                      }))
                    };
                    console.log("Refund Request Preview:", refundData);
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
                    (refundType === "full" && selectedVendors.length === 0) ||
                    (refundType === "partial" && selectedItems.length === 0) ||
                    !refundReason.trim()
                  }
                  className={`px-6 py-3 rounded-lg font-medium transition flex items-center gap-2 ${
                    isSubmittingRefund ||
                    (refundType === "full" && selectedVendors.length === 0) ||
                    (refundType === "partial" && selectedItems.length === 0) ||
                    !refundReason.trim()
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
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

      {/* ... rest of the existing modals remain same ... */}
    </>
  );
}