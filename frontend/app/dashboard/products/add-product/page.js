// app/add-product/page.jsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { FiUploadCloud } from "react-icons/fi";
import { useSession } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import { useCreateProductMutation } from "@/feature/ProductApi";

export default function AddProduct() {
  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    price: "",
    stockQuantity: "",
    description: "",
    location: "",
    country: "",
    region: "",
    city: "",
    shippingCost: "0",
    status: "active",
    image: null,
    imagePreview: null,
  });

  const [isUploading, setIsUploading] = useState(false);
  const { data } = useSession();
  const sellerId = data?.user?.id;
  const [createProduct, { isloading, loading }] = useCreateProductMutation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStatusChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      status: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File size should be less than 10MB");
        return;
      }

      if (!file.type.match(/image\/(png|jpg|jpeg)/)) {
        alert("Please upload only PNG, JPG, or JPEG images");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const uploadToImgBB = async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=b49a7cbd3d5227c273945bd7114783a9`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (data.success) {
        return data.data.url;
      } else {
        throw new Error(data.error?.message || "Image upload failed");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      throw error;
    }
  };

  const publishHandler = async (e) => {
    e.preventDefault();

    if (!formData.productName.trim()) {
      toast.error("Please enter product name");
      return;
    }

    if (!formData.category.trim()) {
      toast.error("Please enter category");
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    if (!formData.stockQuantity || parseInt(formData.stockQuantity) < 0) {
      toast.error("Please enter a valid stock quantity");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Please enter description");
      return;
    }

    if (!formData.location.trim()) {
      toast.error("Please enter location");
      return;
    }

    if (!formData.country.trim()) {
      toast.error("Please enter country");
      return;
    }

    if (!formData.region.trim()) {
      toast.error("Please enter region");
      return;
    }

    if (!formData.city.trim()) {
      toast.error("Please enter city");
      return;
    }

    if (!formData.shippingCost || parseFloat(formData.shippingCost) < 0) {
      toast.error("Please enter a valid shipping cost");
      return;
    }

    if (!formData.image) {
      toast.error("Please upload an image first");
      return;
    }

    if (!sellerId) {
      toast.error("You must be logged in to add a product");
      return;
    }

    setIsUploading(true);

    try {
      const imageUrl = await uploadToImgBB(formData.image);

      const finalData = {
        name: formData.productName,
        seller: sellerId,
        category: formData.category,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stockQuantity),
        location: formData.location,
        country: formData.country,
        region: formData.region,
        city: formData.city,
        shippingCost: parseFloat(formData.shippingCost),
        status: formData.status,
        description: formData.description,
        image: imageUrl,
        createdAt: new Date().toISOString(),
      };

      await createProduct(finalData);
      toast.success("Product posted successfully");

      setFormData({
        productName: "",
        category: "",
        price: "",
        stockQuantity: "",
        description: "",
        location: "",
        country: "",
        region: "",
        city: "",
        shippingCost: "0",
        status: "active",
        image: null,
        imagePreview: null,
      });
    } catch (error) {
      console.error("Publish error:", error);
      toast.error(`❌ Error: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File size should be less than 10MB");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
      imagePreview: null,
    }));
  };

  return (
    <div className="min-h-screen text-[#111827]">
      <Toaster />
      <div className="w-full px-2 pt-2">
        {/* Breadcrumb */}
        <div className="text-xs sm:text-sm text-[#9CA3AF] mb-4 flex items-center gap-1">
          <span className="cursor-pointer hover:text-[#6B7280]">Products</span>
          <span className="text-[#D1D5DB]">/</span>
          <span className="text-[#111827] font-medium">Add New Product</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-[28px] font-semibold text-[#111827]">
          Add New Product
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-[#AC65EE]">
          Fill in the details to add a new product to your store
        </p>

        <form onSubmit={publishHandler}>
          {/* Basic Information Card */}
          <section className="mt-6 bg-white rounded-xl border border-[#F1F1F5] shadow-sm">
            <div className="px-4 sm:px-6 pt-4 sm:pt-5 pb-3 border-b border-[#F3F4F6]">
              <h2 className="text-sm md:text-2xl font-semibold text-[#111827]">
                Basic Information
              </h2>
            </div>

            <div className="px-4 sm:px-6 pb-6 sm:pb-7 pt-4 space-y-4 sm:space-y-5">
              {/* Product Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#4B5563]">
                  Product Name<span className="text-[#F97316]">*</span>
                </label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  className="w-full rounded-lg border border-[#E4E4EE] bg-[#FDFDFE] px-3.5 py-2.5 text-xs sm:text-sm placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/40 focus:border-[#FF7A00] transition"
                  required
                />
              </div>

              {/* Category & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-[#4B5563]">
                    Category<span className="text-[#F97316]">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-[#E4E4EE] bg-[#FDFDFE] px-3.5 py-2.5 text-xs sm:text-sm text-[#4B5563] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/40 focus:border-[#FF7A00] transition"
                    required
                  >
                    <option value="" disabled>Select Category</option>
                    <option value="fashion">Fashion</option>
                    <option value="foodDrinks">Food and Drinks</option>
                    <option value="technology">Technology</option>
                    <option value="artsCrafts">Arts and Crafts</option>
                    <option value="beauty">Beauty</option>
                    <option value="homeDecoration">Home and Decoration</option>
                    <option value="sports">Sports</option>
                    <option value="books">Books</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-[#4B5563]">
                    Price<span className="text-[#F97316]">*</span>
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-xs text-[#9CA3AF]">
                      $
                    </span>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      min="0.01"
                      step="0.01"
                      placeholder="0.00"
                      className="w-full rounded-lg border border-[#E4E4EE] bg-[#FDFDFE] pl-7 pr-3.5 py-2.5 text-xs sm:text-sm placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/40 focus:border-[#FF7A00] transition"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Stock Quantity & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-[#4B5563]">
                    Stock Quantity<span className="text-[#F97316]">*</span>
                  </label>
                  <input
                    type="number"
                    name="stockQuantity"
                    value={formData.stockQuantity}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="0"
                    className="w-full rounded-lg border border-[#E4E4EE] bg-[#FDFDFE] px-3.5 py-2.5 text-xs sm:text-sm placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/40 focus:border-[#FF7A00] transition"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-[#4B5563]">
                    Location<span className="text-[#F97316]">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Enter product location"
                    className="w-full rounded-lg border border-[#E4E4EE] bg-[#FDFDFE] px-3.5 py-2.5 text-xs sm:text-sm placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/40 focus:border-[#FF7A00] transition"
                    required
                  />
                </div>
              </div>

              {/* Country, Region & City */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-[#4B5563]">
                    Country<span className="text-[#F97316]">*</span>
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder="Enter country"
                    className="w-full rounded-lg border border-[#E4E4EE] bg-[#FDFDFE] px-3.5 py-2.5 text-xs sm:text-sm placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/40 focus:border-[#FF7A00] transition"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-[#4B5563]">
                    Region<span className="text-[#F97316]">*</span>
                  </label>
                  <input
                    type="text"
                    name="region"
                    value={formData.region}
                    onChange={handleInputChange}
                    placeholder="Enter region/state"
                    className="w-full rounded-lg border border-[#E4E4EE] bg-[#FDFDFE] px-3.5 py-2.5 text-xs sm:text-sm placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/40 focus:border-[#FF7A00] transition"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-[#4B5563]">
                    City<span className="text-[#F97316]">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Enter city"
                    className="w-full rounded-lg border border-[#E4E4EE] bg-[#FDFDFE] px-3.5 py-2.5 text-xs sm:text-sm placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/40 focus:border-[#FF7A00] transition"
                    required
                  />
                </div>
              </div>

              {/* Shipping Cost */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#4B5563]">
                  Shipping Cost ($)<span className="text-[#F97316]">*</span>
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-xs text-[#9CA3AF]">
                    $
                  </span>
                  <input
                    type="number"
                    name="shippingCost"
                    value={formData.shippingCost}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full rounded-lg border border-[#E4E4EE] bg-[#FDFDFE] pl-7 pr-3.5 py-2.5 text-xs sm:text-sm placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/40 focus:border-[#FF7A00] transition"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Enter 0 for free shipping
                </p>
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#4B5563]">
                  Status<span className="text-[#F97316]">*</span>
                </label>
                <div className="relative">
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleStatusChange}
                    className="w-full rounded-lg border border-[#E4E4EE] bg-[#FDFDFE] px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/40 focus:border-[#FF7A00] transition appearance-none"
                  >
                    <option value="active">Active</option>
                    <option value="out-of-stock">Out of Stock</option>
                    <option value="unpublish">Unpublish</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 border border-gray-100">
                <div
                  className={`w-3 h-3 rounded-full ${
                    formData.status === "active"
                      ? "bg-green-500"
                      : formData.status === "out-of-stock"
                      ? "bg-red-500"
                      : "bg-yellow-500"
                  }`}
                ></div>
                <span className="text-xs font-medium text-gray-700">
                  Status:{" "}
                  {formData.status === "active"
                    ? "Product will be visible to customers"
                    : formData.status === "out-of-stock"
                    ? "Product visible but marked as out of stock"
                    : "Product hidden from customers"}
                </span>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#4B5563]">
                  Description<span className="text-[#F97316]">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Describe your product details..."
                  className="w-full rounded-lg border border-[#E4E4EE] bg-[#FDFDFE] px-3.5 py-2.5 text-xs sm:text-sm placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/40 focus:border-[#FF7A00] transition resize-none"
                  required
                />
              </div>
            </div>
          </section>

          {/* Product Image Card */}
          <section className="mt-6 bg-white rounded-2xl border border-[#F1F1F5] shadow-sm">
            <div className="px-4 sm:px-6 pt-4 sm:pt-5 pb-3 border-b border-[#F3F4F6]">
              <h2 className="text-sm sm:text-base font-semibold text-[#111827]">
                Product Image
              </h2>
            </div>

            <div className="px-4 sm:px-6 pb-6 sm:pb-7 pt-4">
              <div
                className={`border-2 border-dashed ${
                  formData.imagePreview
                    ? "border-[#10B981]"
                    : "border-[#E5E7EB]"
                } rounded-2xl bg-[#FCFCFF] px-4 py-8 sm:px-8 sm:py-10 flex flex-col items-center justify-center text-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() =>
                  !formData.imagePreview &&
                  document.getElementById("imageUpload").click()
                }
              >
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/png, image/jpg, image/jpeg"
                  className="hidden"
                  onChange={handleImageChange}
                />

                {formData.imagePreview ? (
                  <div className="relative w-full max-w-xs">
                    <div className="relative w-full h-48 sm:h-64 rounded-lg overflow-hidden border border-gray-200">
                      <Image
                        src={formData.imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="mt-4 flex flex-col sm:flex-row gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          document.getElementById("imageUpload").click()
                        }
                        className="px-4 py-2 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        Change Image
                      </button>
                      <button
                        type="button"
                        onClick={removeImage}
                        className="px-4 py-2 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        Remove Image
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-[#FFF5EB] flex items-center justify-center shadow-sm">
                      <FiUploadCloud className="text-xl sm:text-2xl text-[#F97316]" />
                    </div>

                    <div className="space-y-1 text-xs sm:text-sm">
                      <p className="text-[#4B5563] font-medium">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-[11px] sm:text-xs text-[#9CA3AF]">
                        PNG, JPG up to 10MB
                      </p>
                    </div>
                  </>
                )}
              </div>

              {formData.imagePreview && (
                <div className="mt-4 p-3 rounded-lg bg-green-50 border border-green-100">
                  <p className="text-xs text-green-700 font-medium flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Image ready for upload: {formData.image.name} (
                    {(formData.image.size / 1024).toFixed(2)} KB)
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Actions */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              className={`w-full flex-1 sm:w-auto rounded-lg 
                bg-gradient-to-r from-[#9838e0] via-[#cc678b] to-[#f48c47]
                px-10 py-4 text-sm font-bold text-white
                shadow-[0_6px_20px_rgba(157,78,221,0.35)]
                hover:opacity-95 transition-all duration-300 transform hover:scale-[1.02]
                ${isUploading ? "opacity-70 cursor-not-allowed" : ""}`}
              disabled={isUploading}
            >
              {isUploading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Uploading & Publishing...
                </span>
              ) : (
                "Publish Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}