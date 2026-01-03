"use client";

import { useAddToCartMutation } from "@/feature/customer/CartApi";
import {
  useAddToWishListMutation,
  useCheckWishlistQuery,
  useRemoveFromWishListMutation,
} from "@/feature/customer/WishlistApi";
import { useSingleProductQuery } from "@/feature/ProductApi";
import { Heart, MapPin, Star, Store, User } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";

export default function ProductDetails({ id }) {
  const { data, isLoading } = useSingleProductQuery(id);
  const [qty, setQty] = useState(1);
  const { data: user } = useSession();
  const { t } = useTranslation("pdetails");
  const userId = user?.user?.id;

  // Wishlist queries
  const { data: wishlistStatus, isLoading: isCheckingWishlist } =
    useCheckWishlistQuery({ id, userId }, { skip: !userId });

  const [addToWishlist, { isLoading: isAdding }] = useAddToWishListMutation();
  const [removeFromWishList, { isLoading: isRemoving }] =
    useRemoveFromWishListMutation();

  const isWishlisted = wishlistStatus?.exists;
  const wishlistId = wishlistStatus?.wishlistId;
  const wishlistLoading = isAdding || isRemoving || isCheckingWishlist;

  // Cart
  const [addToCart, { isLoading: addToCartLoading }] = useAddToCartMutation();

  // ADD TO CART HANDLER
  const cartHandler = async () => {
    try {
      const body = {
        product: id,
        user: userId,
        count: qty,
      };

      const saved = await addToCart(body);

      if (saved.error) {
        toast.error(saved?.error?.data?.message);
        return;
      }

      toast.success(`${t("addToCart")} successfully`);
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  // WISHLIST HANDLER (TOGGLE)
  const wishlistHandler = async () => {
    try {
      if (!userId) {
        toast.error("Please login first");
        return;
      }

      if (isWishlisted) {
        const res = await removeFromWishList(wishlistId);
        if (res?.error) {
          toast.error(res?.error?.data?.message || "Failed to remove");
        } else {
          toast.success("Removed from wishlist");
        }
      } else {
        const body = {
          product: id,
          user: userId,
        };

        const saved = await addToWishlist(body);
        if (saved?.error) {
          toast.error(saved?.error?.data?.message);
        } else {
          toast.success("Added to wishlist");
        }
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  if (isLoading) {
    return (
      <section className='w-full bg-[#F7F7FA] py-10 px-6'>
        <div className='max-w-[1300px] mx-auto'>
          <h2 className='text-[20px] font-semibold text-[#1B1B1B] mb-6'>
            {t("productDetails")}
          </h2>
          <div className='flex justify-center items-center h-64'>
            <p className='text-gray-500'>Loading product details...</p>
          </div>
        </div>
      </section>
    );
  }

  const p = data?.data;
  if (!p) {
    return (
      <section className='w-full bg-[#F7F7FA] py-10 px-6'>
        <div className='max-w-[1300px] mx-auto'>
          <h2 className='text-[20px] font-semibold text-[#1B1B1B] mb-6'>
            {t("productDetails")}
          </h2>
          <div className='flex justify-center items-center h-64'>
            <p className='text-gray-500'>Product not found</p>
          </div>
        </div>
      </section>
    );
  }

  const originalPrice = 709;
  const discountPercentage = Math.round(
    ((originalPrice - p.price) / originalPrice) * 100
  );

  return (
    <section className='w-full bg-[#F7F7FA] py-10 px-6'>
      <Toaster />
      <div className='max-w-[1300px] mx-auto'>
        <h2 className='text-[20px] font-semibold text-[#1B1B1B] mb-6'>
          {t("productDetails")}
        </h2>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
          {/* LEFT - IMAGE */}
          <div>
            <div className='w-full bg-white rounded-[14px] overflow-hidden shadow-sm'>
              <Image
                src={p.image || "/product/bag.jpg"}
                className='w-full h-full object-cover'
                alt={p.name}
                width={400}
                height={400}
              />
            </div>
          </div>

          {/* RIGHT - DETAILS */}
          <div className='pr-4 pt-2'>
            <h3 className='text-[26px] font-semibold text-[#1B1B1B] mb-1'>
              {p.name}
            </h3>

            <div className='mb-2'>
              <span className='inline-block px-3 py-1 bg-[#F2E9FF] text-[#A46CFF] text-xs font-medium rounded-full'>
                {t("category")}:{" "}
                {p.category.charAt(0).toUpperCase() + p.category.slice(1)}
              </span>
            </div>

            {/* SELLER SECTION WITH PROFILE BUTTON */}
            <div className='flex items-center justify-between mb-4'>
              <div>
                <p className='text-[14px] text-[#A46CFF] font-medium'>
                  {p.seller?.shopName || p.seller?.name || "Unknown Seller"}
                </p>
                {p.seller?.email && (
                  <p className='text-[12px] text-gray-500 mt-1'>
                    {p.seller.email}
                  </p>
                )}
              </div>

              {/* Store/Seller Profile Button */}
              {p.seller?._id && (
                <Link
                  href={`/store/${p.seller._id}`}
                  className='flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#9838E1] to-[#F68E44] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity shadow-sm cursor-pointer'>
                  {p.seller?.shopName ? (
                    <>
                      <Store size={16} />
                      <span>{t("viewStore")}</span>
                    </>
                  ) : (
                    <>
                      <User size={16} />
                      <span>{t("viewSeller")}</span>
                    </>
                  )}
                </Link>
              )}
            </div>

            {/* LOCATION + RATING */}
            <div className='flex items-center gap-6 mb-4'>
              <div className='flex items-center gap-2 text-[14px] text-[#6D6D6D]'>
                <MapPin size={16} />
                {p.location}
              </div>

              <div className='flex items-center gap-1 text-[14px] text-[#6D6D6D]'>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < Math.floor(p.rating)
                        ? "text-[#FFA534] fill-[#FFA534]"
                        : "text-[#E0E0E0]"
                    }
                  />
                ))}
                <span className='ml-1 text-[#6B6B6B]'>
                  {p?.rating?.toFixed(1)} ({p.rating > 0 ? "203" : "0"}{" "}
                  {t("reviewsCount")})
                </span>
              </div>
            </div>

            {/* PRICE */}
            <div className='flex items-center gap-3 mb-4'>
              <span className='text-[26px] font-semibold text-[#F78D25]'>
                ${p.price}
              </span>
              <span className='text-[16px] text-[#B0B0B0] line-through'>
                ${originalPrice}
              </span>
              <span className='text-[14px] font-medium text-[#32A35A] bg-[#E6F8EF] px-2 py-1 rounded'>
                -{discountPercentage}%
              </span>
            </div>

            {/* DESCRIPTION */}
            <h4 className='text-[15px] font-semibold text-[#1B1B1B] mb-2'>
              {t("description")}
            </h4>

            <p className='text-[14px] text-[#6B6B6B] mb-7 max-w-[500px]'>
              {p.description}
            </p>

            {/* STOCK INFO */}

            {/* QUANTITY SELECTOR */}
            <div className='mb-8'>
              <span className='text-[14px] font-medium text-gray-700 mb-2 block'>
                {t("quantity")}:
              </span>
              <div className='flex items-center gap-4'>
                <div className='flex items-center border border-gray-300 rounded-lg'>
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className='px-4 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                    disabled={qty <= 1}>
                    -
                  </button>
                  <span className='px-4 py-2 text-center min-w-[50px]'>
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className='px-4 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                    disabled={qty >= p.stock}>
                    +
                  </button>
                </div>
                <span className='text-sm text-gray-500'>
                  {p.stock > 0
                    ? `${p.stock} ${t("available")}`
                    : t("outOfStock")}
                </span>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className='flex items-center gap-4 mb-10'>
              {/* Add to Cart */}
              <button
                onClick={cartHandler}
                className={`flex-1 py-[12px] rounded-[10px] text-white text-[15px] font-medium shadow-[0_4px_14px_rgba(0,0,0,0.12)] transition-all duration-200 cursor-pointer ${
                  p.stock === 0 || addToCartLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-linear-to-r from-[#9838E1] to-[#F68E44] hover:opacity-90"
                }`}
                disabled={p.stock === 0 || addToCartLoading}>
                {addToCartLoading
                  ? t("adding")
                  : p.stock === 0
                  ? t("outOfStock")
                  : `${t("addToCart")} ($${(p.price * qty).toFixed(2)})`}
              </button>

              {/* Wishlist */}
              <button
                onClick={wishlistHandler}
                className='w-[44px] h-[44px] rounded-[10px] border border-[#D9D3E8] flex items-center justify-center hover:bg-[#F9F6FF] transition-colors cursor-pointer'
                disabled={wishlistLoading}
                title={
                  isWishlisted ? t("removeFromWishlist") : t("addToWishlist")
                }>
                <Heart
                  size={19}
                  className={`${
                    isWishlisted
                      ? "text-[#A46CFF] fill-[#A46CFF]"
                      : "text-[#A46CFF]"
                  } ${wishlistLoading ? "opacity-50" : ""}`}
                />
              </button>
            </div>

            {/* ADDITIONAL SELLER INFO */}
            {p.seller && (
              <div className='mt-8 pt-6 border-t border-gray-200'>
                <h4 className='text-[15px] font-semibold text-[#1B1B1B] mb-3'>
                  {t("sellerInfo")}
                </h4>
                <div className='grid grid-cols-2 gap-4 text-sm'>
                  <div>
                    <span className='text-gray-600'>{t("sellerName")}:</span>
                    <span className='ml-2 font-medium'>
                      {p.seller.name || p.seller.shopName}
                    </span>
                  </div>
                  {p.seller.email && (
                    <div>
                      <span className='text-gray-600'>{t("email")}:</span>
                      <span className='ml-2 font-medium'>{p.seller.email}</span>
                    </div>
                  )}
                  {p.seller.phone && (
                    <div>
                      <span className='text-gray-600'>{t("phone")}:</span>
                      <span className='ml-2 font-medium'>{p.seller.phone}</span>
                    </div>
                  )}
                  <div>
                    <span className='text-gray-600'>{t("joined")}:</span>
                    <span className='ml-2 font-medium'>
                      {new Date(p.seller.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
