// app/add-product/page.jsx
import Image from "next/image";
import { FiUploadCloud } from "react-icons/fi";

export default function AddProduct() {
  return (
    <div className="min-h-screen text-[#111827]">
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

        {/* Basic Information Card */}
        <section className="mt-6 bg-white rounded-xl border border-[#F1F1F5] shadow-sm">
          <div className="px-4 sm:px-6 pt-4 sm:pt-5 pb-3 border-[#F3F4F6]">
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
                placeholder="Enter product name"
                className="w-full rounded-lg border border-[#E4E4EE] bg-[#FDFDFE] px-3.5 py-2.5 text-xs sm:text-sm placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/40 focus:border-[#FF7A00] transition"
              />
            </div>

            {/* Category & Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#4B5563]">
                  Category<span className="text-[#F97316]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Electronics"
                  className="w-full rounded-lg border border-[#E4E4EE] bg-[#FDFDFE] px-3.5 py-2.5 text-xs sm:text-sm placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/40 focus:border-[#FF7A00] transition"
                />
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
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full rounded-lg border border-[#E4E4EE] bg-[#FDFDFE] pl-7 pr-3.5 py-2.5 text-xs sm:text-sm placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/40 focus:border-[#FF7A00] transition"
                  />
                </div>
              </div>
            </div>

            {/* Stock Quantity */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[#4B5563]">
                Stock Quantity<span className="text-[#F97316]">*</span>
              </label>
              <input
                type="number"
                min="0"
                placeholder="0"
                className="w-full rounded-lg border border-[#E4E4EE] bg-[#FDFDFE] px-3.5 py-2.5 text-xs sm:text-sm placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/40 focus:border-[#FF7A00] transition"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[#4B5563]">
                Description<span className="text-[#F97316]">*</span>
              </label>
              <textarea
                rows={4}
                placeholder="Describe your product details..."
                className="w-full rounded-lg border border-[#E4E4EE] bg-[#FDFDFE] px-3.5 py-2.5 text-xs sm:text-sm placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/40 focus:border-[#FF7A00] transition resize-none"
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
            <div className="border-2 border-dashed border-[#E5E7EB] rounded-2xl bg-[#FCFCFF] px-4 py-8 sm:px-8 sm:py-10 flex flex-col items-center justify-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#FFF5EB] flex items-center justify-center shadow-sm">
                {/* If you want to use an actual image icon, put a file in /public and replace below */}
                {/* <Image src="/upload-icon.png" alt="Upload" width={28} height={28} /> */}
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
            </div>
          </div>
        </section>

        {/* Actions */}
        <div class="mt-6 flex flex-col sm:flex-row gap-4">
          <button
            class="w-1/2 rounded-lg border-2 border-[#A140D0] 
    px-10 py-4 text-sm font-bold text-[#A544CC] 
    shadow-[0_4px_10px_rgba(0,0,0,0.03)]
    hover:bg-[#FBF8FF] transition"
          >
            Save as Draft
          </button>

          <button
            class="w-full flex-1 sm:w-auto rounded-lg 
    bg-gradient-to-r from-[#9838e0] via-[#cc678b] to-[#f48c47]
    px-10 py-4 text-sm font-bold text-white
    shadow-[0_6px_20px_rgba(157,78,221,0.35)]
    hover:opacity-95 transition"
          >
            Publish Product
          </button>
        </div>
      </div>
    </div>
  );
}
