"use client";

import { 
  useDecreaseCartMutation, 
  useIncreaseCartMutation, 
  useMyCartQuery,
  useDeleteCartMutation // Add this import
} from "@/feature/customer/CartApi";
import { MapPin, Star, X } from "lucide-react"; // Added X icon
import { useSession } from "next-auth/react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function CartProductList() {
  const { data } = useSession();
  const id = data?.user?.id;

  const { data: cartData, isLoading } = useMyCartQuery(id);
  const [increaseCart] = useIncreaseCartMutation();
  const [decreaseCart] = useDecreaseCartMutation();
  const [deleteCart] = useDeleteCartMutation(); // Add delete mutation

  // Get cart items from API response
  const cartItems = cartData?.data || [];
  
  console.log(cartItems, "tomi amar personal cart");

  // Handle increase quantity
  const handleIncrease = async (cartId) => {
    try {
      await increaseCart(cartId);
    } catch (error) {
      console.error("Failed to increase quantity:", error);
    }
  };

  // Handle decrease quantity
  const handleDecrease = async (cartItem) => {
    try {
      // If count is 1, remove the item instead of decreasing
      if (cartItem.count === 1) {
        toast.error("")
      } else {
        await decreaseCart(cartItem._id);
      }
    } catch (error) {
      console.error("Failed to decrease quantity:", error);
    }
  };

  // Handle delete item
  const handleDelete = async (cartId) => {
    try {
      console.log("Deleting cart item with ID:", cartId);
      await deleteCart(cartId);
    } catch (error) {
      console.error("Failed to delete cart item:", error);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <section className="w-full bg-[#F5F5FA] py-8 px-5">
        <div className="max-w-[1300px] mx-auto">
          <div className="text-center py-12">
            <p>Loading cart items...</p>
          </div>
        </div>
      </section>
    );
  }

  // Empty cart state
  if (!cartItems || cartItems.length === 0) {
    return (
      <section className="w-full bg-[#F5F5FA] py-8 px-5">
        <div className="max-w-[1300px] mx-auto">
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Your cart is empty
            </h3>
            <p className="text-gray-500 mb-6">
              Add some products to your cart to see them here.
            </p>
            <Link href="/marketplace">
              <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#9838E1] to-[#F68E44] text-white font-medium">
                Browse Products
              </button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-[#F5F5FA] py-8 px-5">
      <div className="max-w-[1300px] mx-auto space-y-6">
        {cartItems.map((item) => (
          <div
            key={item._id}
            className="
              relative
              flex items-center gap-6 bg-white rounded-[16px] 
              shadow-[0px_4px_20px_rgba(0,0,0,0.05)]
              p-5 border border-[#F1ECF8]
            "
          >
            {/* DELETE BUTTON (Top-right corner) */}
            <button
              onClick={() => handleDelete(item._id)}
              className="
                absolute top-4 right-4
                w-8 h-8
                rounded-full
                flex items-center justify-center
                bg-gray-100 hover:bg-gray-200
                text-gray-600 hover:text-red-600
                transition-colors
                z-10
              "
              title="Remove item"
            >
              <X size={18} />
            </button>

            {/* PRODUCT IMAGE */}
            <div className="w-[170px] h-[140px] rounded-[12px] overflow-hidden">
              <img
                src={item.product?.image || "/placeholder.jpg"}
                alt={item.product?.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* PRODUCT DETAILS */}
            <div className="flex-grow">
              {/* Title */}
              <h3 className="text-[17px] font-semibold text-[#1B1B1B] mb-1">
                {item.product?.name}
              </h3>

              {/* Category */}
              <p className="text-[13px] text-[#A46CFF] mb-[2px] capitalize">
                {item.product?.category}
              </p>

              {/* Location */}
              <div className="flex items-center gap-2 text-[13px] text-[#6A6A6A] mb-[6px]">
                <MapPin size={15} />
                {item.product?.location}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-[4px] text-[13px] mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={15}
                    fill={i < Math.floor(item.product?.rating || 0) ? "#FFA534" : "#E0E0E0"}
                    stroke={i < Math.floor(item.product?.rating || 0) ? "#FFA534" : "#E0E0E0"}
                  />
                ))}
                <span className="text-[#6A6A6A] ml-1">
                  {item.product?.rating || 0} (0 reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[20px] font-semibold text-[#F78D25]">
                  ${item.product?.price}
                </span>
              </div>

              {/* QUANTITY CONTROLS */}
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleDecrease(item)}
                    className="
                      w-10 h-10
                      flex items-center justify-center
                      text-gray-600 hover:text-[#9838E1]
                      hover:bg-gray-50
                      disabled:opacity-50 disabled:cursor-not-allowed
                    "
                  >
                    −
                  </button>
                  <span className="w-12 text-center font-medium">
                    {item.count}
                  </span>
                  <button
                    onClick={() => handleIncrease(item._id)}
                    className="
                      w-10 h-10
                      flex items-center justify-center
                      text-gray-600 hover:text-[#9838E1]
                      hover:bg-gray-50
                    "
                  >
                    +
                  </button>
                </div>

                <div className="text-sm text-gray-600 ml-2">
                  Total: <span className="font-semibold text-[#F78D25]">
                    ${(item.product?.price * item.count).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex flex-col gap-3">
              {/* Quick View */}
              <button
                className="
                  px-5 h-[36px]
                  rounded-[8px]
                  text-[13px] font-medium
                  text-[#9838E1]
                  border border-[#9838E1]
                  bg-white
                  hover:bg-[#FAF7FF]
                  transition
                  min-w-[120px]
                "
              >
                Quick View
              </button>

              {/* Checkout */}
              <Link href="/checkout">
                <button
                  className="
                    px-5 h-[36px]
                    rounded-[8px]
                    text-[13px] font-medium text-white
                    bg-gradient-to-r from-[#9838E1] to-[#F68E44]
                    shadow-[0px_4px_12px_rgba(0,0,0,0.12)]
                    min-w-[120px]
                  "
                >
                  Checkout
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}