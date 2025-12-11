"use client";

import { useGetAllServiceProvidersQuery } from "@/feature/UserApi";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AiFillStar } from "react-icons/ai";
import { LuMapPin } from "react-icons/lu";
import InfiniteScroll from "react-infinite-scroll-component";

export default function AllServiceProviders() {
  const [page, setPage] = useState(1);
  const [allProviders, setAllProviders] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  const { data, isLoading, isFetching, error } = useGetAllServiceProvidersQuery(
    page,
    limit,
    (page - 1) * limit
  );

  useEffect(() => {
    if (data && data.data) {
      if (page === 1) {
        setAllProviders(data.data);
      } else {
        setAllProviders((prev) => [...prev, ...data.data]);
      }
      setHasMore(data.pagination?.hasMore || false);
    }
  }, [data, page]);

  const fetchMoreData = () => {
    if (!isFetching && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  if (isLoading && page === 1) {
    return (
      <section className='w-full py-10 px-5 bg-[#F5F5F7]'>
        <div className='max-w-[1350px] mx-auto'>
          <h2 className='text-[36px] px-4 font-bold text-[#1B1B1B] mb-6'>
            All Service Providers
          </h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className='bg-white rounded-[20px] p-[14px] animate-pulse'>
                <div className='w-full h-[210px] bg-gray-300 rounded-[16px] mb-4'></div>
                <div className='h-4 bg-gray-300 rounded mb-2'></div>
                <div className='h-3 bg-gray-300 rounded mb-3'></div>
                <div className='h-3 bg-gray-300 rounded mb-4'></div>
                <div className='h-4 bg-gray-300 rounded mb-5'></div>
                <div className='h-10 bg-gray-300 rounded-[12px]'></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className='w-full py-10 px-5 bg-[#F5F5F7]'>
        <div className='max-w-[1350px] mx-auto text-center'>
          <h2 className='text-[36px] px-4 font-bold text-[#1B1B1B] mb-6'>
            All Service Providers
          </h2>
          <p className='text-red-500'>
            Error loading service providers. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className='w-full py-10 px-5 bg-[#F5F5F7]'>
      <div className='max-w-[1350px] mx-auto'>
        <h2 className='text-[36px] px-4 font-bold text-[#1B1B1B] mb-6'>
          All Service Providers
        </h2>

        <InfiniteScroll
          dataLength={allProviders.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8'>
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className='bg-white rounded-[20px] p-[14px] animate-pulse'>
                  <div className='w-full h-[210px] bg-gray-300 rounded-[16px] mb-4'></div>
                  <div className='h-4 bg-gray-300 rounded mb-2'></div>
                  <div className='h-3 bg-gray-300 rounded mb-3'></div>
                  <div className='h-3 bg-gray-300 rounded mb-4'></div>
                  <div className='h-4 bg-gray-300 rounded mb-5'></div>
                  <div className='h-10 bg-gray-300 rounded-[12px]'></div>
                </div>
              ))}
            </div>
          }
          endMessage={
            <p className='text-center text-gray-500 mt-8'>
              You&apos;ve seen all service providers!
            </p>
          }>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
            {allProviders.map((p) => (
              <div key={p._id} className='p-3'>
                <Link href={`/service-details?id=${p._id}`}>
                  <div className='bg-white rounded-[20px] overflow-hidden p-3.5'>
                    {/* Image */}
                    <div className='relative w-full h-[210px] mb-4'>
                      <img
                        src={p.image || p.businessLogo || "/blog/blog1.jpg"}
                        className='w-full h-full object-cover rounded-[16px]'
                        alt={p.name || p.shopName}
                      />
                      <span className='absolute top-3 right-3 px-3 py-[3px] bg-[#A46CFF] text-white text-[12px] rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.20)]'>
                        {p.category || "Service Provider"}
                      </span>
                    </div>

                    {/* Name */}
                    <h3 className='text-[16px] font-semibold text-[#1A1A1A] mb-0.5'>
                      {p.name || p.shopName || "Unnamed Provider"}
                    </h3>

                    {/* subtitle */}
                    <p className='text-[14px] leading-5 text-[#A46CFF] mb-3'>
                      {p.serviceDescription ||
                        p.shopDescription ||
                        "Professional service provider"}
                    </p>

                    {/* Location */}
                    <div className='flex items-center gap-2 text-[13px] text-[#6A6A6A] mb-3'>
                      <LuMapPin className='text-[16px]' />
                      {p.address || "Location not specified"}
                    </div>

                    {/* Rating - Placeholder since we don't have reviews yet */}
                    <div className='flex items-center text-[14px] text-[#6A6A6A] mb-4'>
                      {[...Array(5)].map((_, i) => (
                        <AiFillStar
                          key={i}
                          className={`text-[17px] ${
                            i < 4 ? "text-[#FFA534]" : "text-[#E0E0E0]"
                          }`}
                        />
                      ))}
                      <span className='ml-1'>4.5 (0 reviews)</span>
                    </div>

                    {/* Price */}
                    <p className='text-[13px] text-[#6B6B6B]'>Starting at</p>
                    <p className='text-[22px] font-semibold text-[#F78D25] mb-5'>
                      ${p.hourlyRate || 50}/hr
                    </p>

                    {/* Button */}
                    <button className='w-full py-3 text-[15px] font-medium text-white rounded-xl bg-[linear-gradient(90deg,#9838E1,#F68E44)] shadow-[0_4px_14px_rgba(0,0,0,0.15)] cursor-pointer'>
                      Book Now
                    </button>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </InfiniteScroll>
      </div>
    </section>
  );
}
