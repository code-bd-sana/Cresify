"use client";

import {
  useDecreaseCartMutation,
  useDeleteCartMutation,
  useIncreaseCartMutation,
  useMyCartQuery,
} from "@/feature/customer/CartApi";
import Cookies from "js-cookie";
import { MapPin, Star, X } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

/* -------------------------------------------------------
    COOKIE HELPERS
-------------------------------------------------------- */

// Get selected IDs from cookie
const getSelected = () => {
  try {
    return JSON.parse(Cookies.get("selectedProducts") || "[]");
  } catch {
    return [];
  }
};

// Save selected IDs to cookie
const saveSelected = (ids) => {
  Cookies.set("selectedProducts", JSON.stringify(ids), {
    expires: 7, // 7 days
    sameSite: "Lax",
  });
};

// Toggle a selected ID
const toggleSelected = (id) => {
  const selected = getSelected();
  const exists = selected.includes(id);

  const updated = exists ? selected.filter((x) => x !== id) : [...selected, id];

  saveSelected(updated);
  return updated;
};

// Clear selection
const clearSelected = () => {
  saveSelected([]);
  return [];
};

// Select all items
const selectAll = (cartItems) => {
  const ids = cartItems.map((item) => item._id);
  saveSelected(ids);
  return ids;
};

export default function CartProductList() {
  const { data } = useSession();
  const id = data?.user?.id;

  const { data: cartData, isLoading } = useMyCartQuery(id);
  const [increaseCart] = useIncreaseCartMutation();
  const [decreaseCart] = useDecreaseCartMutation();
  const [deleteCart] = useDeleteCartMutation();

  const cartItems = cartData?.data || [];

  /* -------------------------------------------------------
      LOCAL STATE FOR COOKIE SELECTED ITEMS
  -------------------------------------------------------- */
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    queueMicrotask(() => {
      const cookieSelected = getSelected();
      setSelectedProducts(cookieSelected);
    });
  }, [cartItems]);

  /* -------------------------------------------------------
      HANDLERS
  -------------------------------------------------------- */

  const handleSelect = (cartId) => {
    const updated = toggleSelected(cartId);
    setSelectedProducts(updated);
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === cartItems.length) {
      setSelectedProducts(clearSelected());
    } else {
      setSelectedProducts(selectAll(cartItems));
    }
  };

  const handleIncrease = async (cartId) => {
    try {
      await increaseCart(cartId);
    } catch (error) {}
  };

  // cart product

  // Handle decrease quantity
  const handleDecrease = async (cartItem) => {
    try {
      if (cartItem.count === 1) {
        toast.error("Cannot decrease below 1");
      } else {
        await decreaseCart(cartItem._id);
      }
    } catch (error) {}
  };

  const handleDelete = async (cartId) => {
    try {
      await deleteCart(cartId);

      // remove from cookie selection
      const updated = selectedProducts.filter((id) => id !== cartId);
      saveSelected(updated);
      setSelectedProducts(updated);
    } catch (error) {}
  };

  /* -------------------------------------------------------
      LOADING & EMPTY STATE
  -------------------------------------------------------- */

  if (isLoading) {
    return (
      <section className='w-full bg-[#F5F5FA] py-8 px-5 text-center'>
        Loading cart...
      </section>
    );
  }

  if (!cartItems.length) {
    return (
      <section className='w-full bg-[#F5F5FA] py-8 px-5 text-center'>
        <h3>Your cart is empty</h3>
        <Link href='/marketplace'>
          <button className='px-6 py-3 rounded-lg bg-linear-to-r from-[#9838E1] to-[#F68E44] text-white font-medium mt-4'>
            Browse Products
          </button>
        </Link>
      </section>
    );
  }

  const finalTotal = cartItems
    .filter((item) => selectedProducts.includes(item._id))
    .reduce((acc, item) => acc + item.product.price * item.count, 0);

  /* -------------------------------------------------------
      MAIN UI
  -------------------------------------------------------- */

  console.log(cartItems);

  return (
    <section className='w-full bg-[#F5F5FA] py-8 px-5'>
      <div className='max-w-[1300px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* LEFT SIDE */}
        <div className='lg:col-span-2'>
          <div className='flex items-center justify-between text-sm text-gray-700 mb-4 pl-1'>
            <div className='flex items-center gap-2'>
              <input
                type='checkbox'
                onChange={handleSelectAll}
                checked={
                  selectedProducts.length === cartItems.length &&
                  cartItems.length > 0
                }
                className='w-4 h-4 accent-[#9838E1]'
              />
              <span>Select All ({cartItems.length} Items)</span>
            </div>
          </div>

          {/* PRODUCT LIST */}
          <div className='space-y-6'>
            {cartItems.map((item) => (
              <div
                key={item._id}
                className='relative bg-white rounded-xl p-5 shadow-sm border border-[#EDEAF4] flex items-start gap-5'>
                {/* Checkbox */}
                <input
                  type='checkbox'
                  checked={selectedProducts.includes(item._id)}
                  onChange={() => handleSelect(item._id)}
                  className='mt-2 w-5 h-5 accent-[#9838E1]'
                />

                {/* Product Image */}
                <div className='w-[130px] h-[120px] rounded-lg overflow-hidden border'>
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className='w-full h-full object-cover'
                  />
                </div>

                {/* Product Info */}
                <div className='flex-grow'>
                  <h3 className='font-semibold text-lg'>{item.product.name}</h3>

                  <p className='text-sm text-[#A46CFF] mt-1'>
                    by {item.product.seller.name || "Unknown Brand"}
                  </p>

                  <div className='flex items-center gap-3 text-sm text-gray-600 mt-1'>
                    <MapPin size={15} />
                    {item.product.location}
                  </div>

                  <div className='flex items-center gap-1 mt-2 text-yellow-500'>
                    <Star size={16} fill='#FFC107' stroke='#FFC107' />
                    <span className='text-gray-700 text-sm'>
                      4.6 (203 reviews)
                    </span>
                  </div>

                  <p className='mt-2 text-[20px] font-semibold text-[#F78D25]'>
                    ${item.product.price}
                  </p>

                  <div className='flex items-center gap-6 mt-3'>
                    <div className='flex items-center border border-gray-300 rounded-lg'>
                      <button
                        onClick={() => handleDecrease(item)}
                        className='w-10 h-10 text-lg'>
                        −
                      </button>
                      <span className='w-12 text-center'>{item.count}</span>
                      <button
                        onClick={() => handleIncrease(item._id)}
                        className='w-10 h-10 text-lg'>
                        +
                      </button>
                    </div>

                    <span className='text-sm text-gray-700'>
                      Total:{" "}
                      <b className='text-[#F78D25]'>
                        ${(item.product.price * item.count).toFixed(2)}
                      </b>
                    </span>
                  </div>
                </div>

                {/* Delete */}
                <div className='flex flex-col items-end gap-3'>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className='cursor-pointer'>
                    <X size={18} className='text-gray-500 hover:text-red-500' />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SUMMARY */}
        <div className='bg-white rounded-xl shadow p-6 h-max sticky top-20 mt-9'>
          <h3 className='text-lg font-semibold mb-6'>Order Summary</h3>

          {/* Selected Products Preview */}
          <div className='space-y-5 mb-6'>
            {cartItems
              .filter((item) => selectedProducts.includes(item._id))
              .map((item) => (
                <div
                  key={item._id}
                  className='flex items-center justify-between'>
                  <div className='flex items-center gap-4'>
                    <div className='w-[60px] h-[60px] rounded-lg overflow-hidden border'>
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className='w-full h-full object-cover'
                      />
                    </div>

                    <div>
                      <p className='font-medium text-sm'>{item.product.name}</p>
                      <p className='text-gray-500 text-xs'>
                        Quantity:{" "}
                        <span className='font-medium'>x{item.count}</span>
                      </p>
                    </div>
                  </div>

                  <p className='text-[#F78D25] font-semibold'>
                    ${(item.product.price * item.count).toFixed(2)}
                  </p>
                </div>
              ))}
          </div>

          <hr className='my-4 border-gray-300' />

          <div className='space-y-3 text-sm text-gray-700'>
            <div className='flex justify-between text-lg font-semibold text-[#F78D25]'>
              <span>Total</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>
          </div>

          <Link href='/checkout'>
            <button
              disabled={selectedProducts.length === 0}
              className='w-full mt-6 py-3 rounded-lg bg-linear-to-r from-[#9838E1] to-[#F68E44] text-white font-medium disabled:opacity-40 cursor-pointer'>
              Proceed To Checkout ({selectedProducts.length})
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
