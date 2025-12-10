"use client";

import {
  useGetWishListQuery,
  useRemoveFromWishListMutation,
} from "@/feature/customer/WishlistApi";
import { X } from "lucide-react";
import { useSession } from "next-auth/react";

export default function Wishlist() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { data, isLoading } = useGetWishListQuery(
    {
      userId,
      page: 1,
      limit: 20,
    },
    { skip: !userId }
  );

  console.log(data);

  const [removeFromWishList] = useRemoveFromWishListMutation();

  if (!userId) {
    return (
      <p className='text-center text-lg py-10'>Login to view your wishlist</p>
    );
  }

  if (isLoading) {
    return <p className='text-center text-lg py-10'>Loading wishlist...</p>;
  }

  const items = data?.data || [];

  return (
    <section className='w-full bg-white rounded-lg px-4 pb-10'>
      <div className='max-w-[1100px] mx-auto'>
        {/* HEADER */}
        <div className='flex justify-between items-center mb-6 pt-4'>
          <h2 className='text-[18px] font-semibold text-[#1B1B1B]'>
            My Wishlist
          </h2>
          <p className='text-[13px] text-[#9838E1] cursor-pointer'>
            {items.length} Items
          </p>
        </div>

        {/* GRID */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6'>
          {items.map((item) => (
            <div
              key={item._id}
              className='bg-white rounded-[16px] border border-[#EEEAF7] shadow-[0_6px_18px_rgba(0,0,0,0.06)] p-4'>
              {/* IMAGE */}
              <div className='relative w-full h-[180px] rounded-[12px] overflow-hidden bg-[#F5F5F9] mb-4'>
                <img
                  src={item.product?.image}
                  className='h-full w-full object-cover'
                />

                {/* REMOVE BUTTON */}
                <button
                  onClick={() => removeFromWishList(item._id)}
                  className='absolute top-2 right-2 h-[28px] w-[28px] rounded-full bg-white border border-[#FFCFB5] flex items-center justify-center shadow-sm cursor-pointer'>
                  <X size={16} className='text-[#F78D25]' />
                </button>
              </div>

              {/* TEXT INFO */}
              <p className='text-[14px] font-semibold text-[#2B2B2B] leading-tight'>
                {item.product?.name}
              </p>

              <p className='text-[12px] text-[#9838E1] mt-[2px]'>
                by {item.product?.seller?.name || "Unknown"}
              </p>

              {/* PRICE + BUTTON */}
              <div className='flex items-center justify-between mt-4'>
                <p className='text-[18px] font-semibold text-[#F78D25]'>
                  ${item.product?.price}
                </p>

                {item.product?.stock > 0 ? (
                  <button className='px-4 py-[8px] text-[12px] text-white rounded-[8px] bg-linear-to-r from-[#9838E1] to-[#F68E44] shadow-[0_4px_14px_rgba(0,0,0,0.12)] cursor-pointer'>
                    Add to cart
                  </button>
                ) : (
                  <button className='px-4 py-[8px] text-[12px] rounded-[8px] text-[#888] bg-[#F0F0F4] cursor-default'>
                    Unavailable
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
