"use client";
import { useEditProductMutation, useSingleProductQuery } from "@/feature/ProductApi";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { FiUploadCloud } from "react-icons/fi";
import Image from "next/image";
import toast from "react-hot-toast";

export default function EditProductPage() {
    const params = useParams();
    const id = params?.id;
    const { data, isLoading } = useSingleProductQuery(id);
      const [editProduct, {isLoading:editLoading, loading}] = useEditProductMutation();
      const router = useRouter();

    
    const product = data?.data;
    
    console.log(product, "tomi amar personal product");

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        price: "",
        stock: "",
        status: "active",
        description: "",
        image: null,
        imagePreview: null,
    });

    const [isUploading, setIsUploading] = useState(false);

    // Load product data into form when it's available
    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || "",
                category: product.category || "",
                price: product.price?.toString() || "",
                stock: product.stock?.toString() || "",
                status: product.status || "active",
                description: product.description || "",
                image: null,
                imagePreview: product.image || null,
            });
        }
    }, [product]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
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

    const handleUpdate = async (e) => {
        e.preventDefault();
        
        // Validate required fields
        if (!formData.name.trim()) {
            alert("Please enter product name");
            return;
        }

        if (!formData.category.trim()) {
            alert("Please enter category");
            return;
        }

        if (!formData.price || parseFloat(formData.price) <= 0) {
            alert("Please enter a valid price");
            return;
        }

        if (!formData.stock || parseInt(formData.stock) < 0) {
            alert("Please enter a valid stock quantity");
            return;
        }

        if (!formData.description.trim()) {
            alert("Please enter description");
            return;
        }

        setIsUploading(true);

        try {
            let imageUrl = formData.imagePreview;
            
            // If new image is uploaded, upload to ImgBB
            if (formData.image) {
                imageUrl = await uploadToImgBB(formData.image);
            }

            // Prepare final data
            const finalData = {
                id, // Product ID to update
                name: formData.name,
                category: formData.category,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                status: formData.status,
                description: formData.description,
                image: imageUrl,
                updatedAt: new Date().toISOString(),
            };

            // Log to console
           await editProduct(finalData);
           toast.success("Product upload successfully");
           router.push('/dashboard/products')


            // Call update mutation if you have it
            // const response = await updateProduct(finalData).unwrap();
            // console.log("Update response:", response);

            // alert("✅ Product data ready for update! Check console for data.");

        } catch (error) {
            console.error("Update error:", error);
            alert(`❌ Error: ${error.message}`);
        } finally {
            setIsUploading(false);
        }
    };

    const handleUnpublish = () => {
        setFormData(prev => ({
            ...prev,
            status: "unpublish"
        }));
        console.log("Status changed to: unpublish");
    };

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this product?")) {
            console.log("Delete product with ID:", id);
        }
    };

    const removeImage = () => {
        setFormData((prev) => ({
            ...prev,
            image: null,
            imagePreview: null,
        }));
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                    <p className="mt-4 text-gray-500">Loading product data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen px-2 py-6 text-[#111827]">
            {/* Breadcrumb */}
            <div className="text-xs md:text-sm text-[#9CA3AF] mb-4 flex items-center gap-1">
                <span className="cursor-pointer hover:text-[#6B7280]">Product</span>
                <span className="text-[#D1D5DB]">/</span>
                <span className="text-[#111827] font-medium">Edit Product</span>
            </div>

            {/* Page Title */}
            <h1 className="text-3xl font-semibold">Edit Product</h1>
            <p className="text-sm text-[#A78BFA] mt-1">
                Update product details for ID: {id?.slice(-8)}
            </p>

            <form onSubmit={handleUpdate}>
                {/* Card */}
                <div className="mt-8 bg-white p-6 rounded-2xl border border-[#ECECEC] shadow">
                    <h2 className="text-lg font-semibold mb-5">Basic Information</h2>

                    {/* Product Name */}
                    <div className="space-y-1 mb-5">
                        <label className="text-sm text-gray-700 font-medium">
                            Product Name*
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter product name"
                            className="w-full border border-[#E5E7EB] bg-[#FCFCFF] rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#A855F7]/40"
                        />
                    </div>

                    {/* Category & Price */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                        <div className="space-y-1">
                            <label className="text-sm text-gray-700 font-medium">
                                Category*
                            </label>
                            <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                placeholder="e.g. Electronics"
                                className="w-full border border-[#E5E7EB] bg-[#FCFCFF] rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#A855F7]/40"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm text-gray-700 font-medium">Price*</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    min="0.01"
                                    step="0.01"
                                    placeholder="0.00"
                                    className="w-full border border-[#E5E7EB] bg-[#FCFCFF] rounded-lg pl-8 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#A855F7]/40"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Stock & Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                        <div className="space-y-1">
                            <label className="text-sm text-gray-700 font-medium">
                                Stock Quantity*
                            </label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleInputChange}
                                min="0"
                                placeholder="0"
                                className="w-full border border-[#E5E7EB] bg-[#FCFCFF] rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#A855F7]/40"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm text-gray-700 font-medium">Status*</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                className="w-full border border-[#E5E7EB] bg-[#FCFCFF] rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#A855F7]/40"
                            >
                                <option value="active">Active</option>
                                <option value="out-of-stock">Out of Stock</option>
                                <option value="unpublish">Unpublish</option>
                            </select>
                        </div>
                    </div>

                    {/* Product Image */}
                    <div className="space-y-1 mb-5">
                        <label className="text-sm text-gray-700 font-medium">
                            Product Image
                        </label>
                        <div 
                            className="border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 p-8 text-center cursor-pointer hover:bg-gray-100 transition"
                            onClick={() => document.getElementById("imageUpload").click()}
                        >
                            <input
                                type="file"
                                id="imageUpload"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                            
                            {formData.imagePreview ? (
                                <div className="relative w-48 h-48 mx-auto rounded-lg overflow-hidden">
                                    <Image
                                        src={formData.imagePreview}
                                        alt="Product Preview"
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                document.getElementById("imageUpload").click();
                                            }}
                                            className="px-3 py-1 bg-white text-blue-600 text-xs rounded-lg shadow"
                                        >
                                            Change
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeImage();
                                            }}
                                            className="px-3 py-1 bg-white text-red-600 text-xs rounded-lg shadow"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="w-12 h-12 rounded-full bg-[#FFF5EB] flex items-center justify-center mx-auto mb-4">
                                        <FiUploadCloud className="text-2xl text-[#F97316]" />
                                    </div>
                                    <p className="text-gray-700 font-medium">Click to upload new image</p>
                                    <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1 mb-3">
                        <label className="text-sm text-gray-700 font-medium">
                            Description*
                        </label>
                        <textarea
                            rows={4}
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Describe your product details..."
                            className="w-full border border-[#E5E7EB] bg-[#FCFCFF] rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#A855F7]/40"
                        />
                    </div>
                </div>

                {/* Buttons */}
                <div className="mt-8 flex flex-col md:flex-row gap-4 md:gap-6">
                    {/* Update Product Button */}
                    <button
                        type="submit"
                        disabled={isUploading}
                        className={`w-full flex-1 rounded-lg bg-gradient-to-r from-[#9838e0] via-[#cc678b] to-[#f48c47] px-10 py-4 text-sm font-bold text-white shadow-[0_6px_20px_rgba(157,78,221,0.35)] hover:opacity-95 transition ${
                            isUploading ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                    >
                        {isUploading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Updating...
                            </span>
                        ) : (
                            "Update Product"
                        )}
                    </button>

                    {/* Unpublished Button */}
                    {/* <button
                        type="button"
                        onClick={handleUnpublish}
                        className="w-full md:w-auto rounded-lg border-2 border-[#A140D0] px-14 py-4 text-sm font-bold text-[#A23BFF] shadow-[0_4px_10px_rgba(0,0,0,0.03)] hover:bg-[#FBF8FF] transition"
                    >
                        Unpublished
                    </button> */}

                    {/* Delete Button */}
                    {/* <button
                        type="button"
                        onClick={handleDelete}
                        className="w-full md:w-auto rounded-lg border-2 border-[#F78D25] px-14 py-4 text-sm font-bold text-[#F78D25] hover:bg-[#FBD6D6] transition"
                    >
                        Delete
                    </button> */}
                </div>
            </form>
        </div>
    );
}