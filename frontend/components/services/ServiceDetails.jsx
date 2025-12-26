"use client";

import { useGetProviderDatesQuery, useGetProviderTimeslotsQuery } from "@/feature/provider/ProviderApi";
import { useGetServiceProviderQuery } from "@/feature/UserApi";
import { MapPin, MessageSquare, Star } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ServiceDetails() {
  const searchParams = useSearchParams();
  const [date, setDate] = useState(null)
   const id = searchParams.get("id");

  const {
    data: response,
    isLoading,
    error,
  } = useGetServiceProviderQuery(id, {
    skip: !id,
  });

  console.log(id, 'id kire tui asdf');

  const provider = response?.data;
console.log(provider, 'tomi amar personal provider');

  if (isLoading) {
    return (
      <section className='w-full bg-[#F7F7FA] py-14 px-6'>
        <div className='max-w-[1300px] mx-auto'>
          <div className='animate-pulse'>
            <div className='h-6 bg-gray-300 rounded mb-6 w-48'></div>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
              <div className='h-[335px] bg-gray-300 rounded-[14px]'></div>
              <div className='space-y-4'>
                <div className='h-6 bg-gray-300 rounded w-3/4'></div>
                <div className='h-4 bg-gray-300 rounded w-1/2'></div>
                <div className='h-4 bg-gray-300 rounded w-2/3'></div>
                <div className='h-5 bg-gray-300 rounded w-1/4'></div>
                <div className='h-20 bg-gray-300 rounded'></div>
                <div className='flex gap-4'>
                  <div className='h-12 bg-gray-300 rounded w-48'></div>
                  <div className='h-12 bg-gray-300 rounded w-12'></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !response) {
    return (
      <section className='w-full bg-[#F7F7FA] py-14 px-6'>
        <div className='max-w-[1300px] mx-auto text-center'>
          <h2 className='text-[18px] font-semibold text-[#1B1B1B] mb-6'>
            Service Details
          </h2>
          <p className='text-red-500'>
            Service provider not found or error loading details.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className='w-full bg-[#F7F7FA] py-14 px-6'>
      <div className='max-w-[1300px] mx-auto'>
        {/* PAGE TITLE */}
        <h2 className='text-[18px] font-semibold text-[#1B1B1B] mb-6'>
          Service Details
        </h2>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
          {/* LEFT IMAGE */}
          <div>
            <div className='w-full h-[335px] rounded-[14px] overflow-hidden bg-[#EDEDF2]'>
              <img
                src={
                  provider.image ||
                  provider.businessLogo ||
                  "/services/serv1.jpg"
                }
                alt={provider.name || provider.shopName}
                className='h-full w-full object-cover'
              />
            </div>

            {/* IMAGE THUMBNAILS */}
            {/* <div className='flex items-center gap-4 mt-5'>
              {[
                provider.image ||
                  provider.businessLogo ||
                  "/services/serv1.jpg",
                provider.businessLogo ||
                  provider.image ||
                  "/services/serv2.jpg",
                "/services/serv3.jpg",
                "/services/serv1.jpg",
              ].map((img, i) => (
                <div
                  key={i}
                  className='h-[60px] w-[60px] rounded-[12px]
                  overflow-hidden cursor-pointer
                  border border-[#E1E1E8] hover:border-[#9838E1] transition'>
                  <img
                    src={img}
                    alt={`${provider.name || provider.shopName} image ${i + 1}`}
                    className='h-full w-full object-cover'
                  />
                </div>
              ))}
            </div> */}
          </div>

          {/* RIGHT DETAILS */}
          <div className='pt-2'>
            {/* Title */}
            <h1 className='text-[22px] font-semibold text-[#222]'>
              {provider.name || provider.shopName}
            </h1>

            {/* Category */}
            <p className='text-[13px] text-[#9838E1] mt-[2px]'>
              {provider.category ||
                provider.serviceCategory ||
                "Service Provider"}
            </p>

            {/* Location */}
            <div className='flex items-center gap-2 mt-2'>
              <MapPin size={16} className='text-[#8B8B9A]' />
              <p className='text-[13px] text-[#6A6A6A]'>
                {provider.address || "Location not specified"}
              </p>
            </div>

            {/* Rating - Placeholder */}
            <div className='flex items-center gap-[2px] mt-2'>
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Star
                    key={i}
                    size={15}
                    className='text-[#F78D25] fill-[#F78D25]'
                  />
                ))}
              <p className='text-[12px] text-[#8A8A8A] ml-1'>4.5 (0 reviews)</p>
            </div>

            {/* Price */}
            <p className='text-[20px] font-semibold text-[#F78D25] mt-3'>
              $
              {
                 provider.hourlyRate }
              
              /hr
            </p>

            {/* Status Badge */}
            {provider.status && (
              <div className='mt-2'>
                <span
                  className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                    provider.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                  {provider.status.charAt(0).toUpperCase() +
                    provider.status.slice(1)}
                </span>
              </div>
            )}

            {/* About */}
            <div className='mt-5'>
              <h3 className='text-[15px] font-semibold text-[#1B1B1B] mb-2'>
                About
              </h3>
              <p className='text-[13px] text-[#6A6A6A] leading-[20px] max-w-[420px]'>
                {provider.serviceDescription ||
                  provider.shopDescription ||
                  "Professional service provider offering quality services."}
              </p>
            </div>

            {/* BUTTON GROUP */}
            <div className='flex items-center gap-4 mt-8'>
              {/* BOOK NOW BUTTON */}
              <Link href={`/book-now?id=${provider._id}`}>
                <button
                  className='
                  w-[200px] h-[48px] rounded-[10px]
                  bg-gradient-to-r from-[#9838E1] to-[#F68E44]
                  flex items-center justify-center gap-2
                  text-white text-[14px] font-medium
                  shadow-[0_4px_14px_rgba(0,0,0,0.15)]
                '>
                  Book Now
                </button>
              </Link>

              {/* MESSAGE BUTTON (WHITE + GRADIENT BORDER) */}
              <button
                className='
                  w-[48px] h-[48px] rounded-[10px]
                  flex items-center justify-center
                  bg-white
                  border-[2px]
                  border-transparent
                '>
                <MessageSquare size={18} className='text-[#9838E1]' />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
