"use client";

import { useState } from "react";
import { MapPin, Star, Heart, Store, MessageCircle } from "lucide-react";
import { useSingleProductQuery } from "@/feature/ProductApi";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useAddToCartMutation, useDecreaseCartMutation, useIncreaseCartMutation} from "@/feature/customer/CartApi";
import toast, { Toaster } from "react-hot-toast";

export default function ProductDetails({ id }) {
  const images = [
    "/product/bag.jpg",
    "/product/bag.jpg",
    "/product/bag.jpg",
    "/product/bag.jpg",
  ];

  const { data, isLoading } = useSingleProductQuery(id);
  const [selectedImg, setSelectedImg] = useState(images[0]);
  const [addToCart, { isLoading: addToCartLoading }] = useAddToCartMutation();
  const [qty, setQty] = useState(1);
  const { data: user } = useSession();
    const [ increaseCart] = useIncreaseCartMutation();
  const [decreaseCart] = useDecreaseCartMutation();

  const userId = user?.user?.id;

  const cartHandler = async () => {
    try {
      console.log("Product ID:", id, "User ID:", userId, "Quantity:", qty);
      
      const data = {
        product: id,
        user: userId,
        count: qty, // এখানে quantity যোগ করুন
      };
      
      const saved = await addToCart(data);
      console.log(saved, "API Response");

      if (saved.error) {
        toast.error(saved?.error?.data?.message);
        return;
      }

      toast.success(`Added ${qty} item(s) to your cart`);
      
    } catch (error) {
      console.log(error, "Error in cart handler");
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  if (isLoading) {
    return (
      <section className="w-full bg-[#F7F7FA] py-10 px-6">
        <div className="max-w-[1300px] mx-auto">
          <h2 className="text-[20px] font-semibold text-[#1B1B1B] mb-6">
            Product Details
          </h2>
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Loading product details...</p>
          </div>
        </div>
      </section>
    );
  }

  const p = data?.data;

  if (!p) {
    return (
      <section className="w-full bg-[#F7F7FA] py-10 px-6">
        <div className="max-w-[1300px] mx-auto">
          <h2 className="text-[20px] font-semibold text-[#1B1B1B] mb-6">
            Product Details
          </h2>
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Product not found</p>
          </div>
        </div>
      </section>
    );
  }

  // Calculate discount if original price exists
  const originalPrice = 709;
  const discountPercentage = Math.round(((originalPrice - p.price) / originalPrice) * 100);

  return (
    <section className="w-full bg-[#F7F7FA] py-10 px-6">
      <Toaster />
      <div className="max-w-[1300px] mx-auto">
        {/* PAGE TITLE */}
        <h2 className="text-[20px] font-semibold text-[#1B1B1B] mb-6">
          Product Details
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* LEFT SIDE */}
          <div>
            {/* MAIN IMAGE */}
            <div className="w-full bg-white rounded-[14px] overflow-hidden shadow-sm">
              <Image
                src={p.image || "/product/bag.jpg"}
                className="w-full h-full object-cover"
                alt={p.name}
                width={400}
                height={400}
              />
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="pr-4 pt-2">
            {/* TITLE */}
            <h3 className="text-[26px] font-semibold text-[#1B1B1B] leading-tight mb-1">
              {p.name}
            </h3>

            {/* CATEGORY */}
            <div className="mb-2">
              <span className="inline-block px-3 py-1 bg-[#F2E9FF] text-[#A46CFF] text-xs font-medium rounded-full">
                {p.category.charAt(0).toUpperCase() + p.category.slice(1)}
              </span>
            </div>

            {/* SELLER */}
            <p className="text-[14px] text-[#A46CFF] font-medium mb-4">
              {p.seller?.shopName || p.seller?.name || "Unknown Seller"}
            </p>

            {/* LOCATION + RATING */}
            <div className="flex items-center gap-6 mb-4">
              <div className="flex items-center gap-2 text-[14px] text-[#6D6D6D]">
                <MapPin size={16} />
                {p.location}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 text-[14px] text-[#6D6D6D]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < Math.floor(p.rating) ? "text-[#FFA534] fill-[#FFA534]" : "text-[#E0E0E0]"
                    }
                  />
                ))}
                <span className="ml-1 text-[#6B6B6B]">
                  {p.rating.toFixed(1)} ({p.rating > 0 ? "203" : "0"} review)
                </span>
              </div>
            </div>

            {/* PRICE */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[26px] font-semibold text-[#F78D25]">
                ${p.price}
              </span>
              <span className="text-[16px] text-[#B0B0B0] line-through">
                ${originalPrice}
              </span>
              <span className="text-[14px] font-medium text-[#32A35A] bg-[#E6F8EF] px-2 py-1 rounded">
                -{discountPercentage}%
              </span>
            </div>

            {/* Description */}
            <h4 className="text-[15px] font-semibold text-[#1B1B1B] mb-2">
              Description
            </h4>

            <p className="text-[14px] leading-[21px] text-[#6B6B6B] mb-7 max-w-[500px]">
              {p.description}
            </p>

            {/* Amount Section */}
        

            {/* ACTION BUTTONS */}
            <div className="flex items-center gap-4 mb-10">
              {/* Add to Cart */}
              <button
                onClick={cartHandler}
                className={`
                  flex-1 py-[12px] rounded-[10px]
                  text-white text-[15px] font-medium
                  shadow-[0_4px_14px_rgba(0,0,0,0.12)]
                  transition-all duration-200
                  ${p.stock === 0 || addToCartLoading
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-gradient-to-r from-[#9838E1] to-[#F68E44] hover:opacity-90"
                  }
                `}
                disabled={p.stock === 0 || addToCartLoading}
              >
                {addToCartLoading ? "Adding..." : (p.stock === 0 ? "Out of Stock" : "Add to cart")}
              </button>

              {/* Wishlist */}
              <button className="w-[44px] h-[44px] rounded-[10px] border border-[#D9D3E8] flex items-center justify-center hover:bg-[#F9F6FF] transition-colors">
                <Heart size={19} className="text-[#A46CFF]" />
              </button>

              {/* Message Seller */}
              <button className="w-[44px] h-[44px] rounded-[10px] border border-[#D9D3E8] flex items-center justify-center hover:bg-[#F9F6FF] transition-colors">
                <MessageCircle size={19} className="text-[#A46CFF]" />
              </button>
            </div>

            {/* Visit Store */}
            <div className="flex items-center gap-2 text-[14px] text-[#A46CFF] cursor-pointer hover:text-[#8736C5] transition-colors">
              <Store size={17} />
              <span className="font-medium">Visit {p.seller?.shopName || "Seller"}'s Store</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}