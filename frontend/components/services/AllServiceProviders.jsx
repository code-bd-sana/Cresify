"use client";

import { useGetAllServiceProvidersQuery } from "@/feature/UserApi";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AiFillStar } from "react-icons/ai";
import { LuMapPin } from "react-icons/lu";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Filter,
} from "lucide-react";

export default function AllServiceProviders() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [allProviders, setAllProviders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [totalPages, setTotalPages] = useState(1);
  const [totalProviders, setTotalProviders] = useState(0);

  const { data, isLoading, isFetching, error } = useGetAllServiceProvidersQuery(
    { page, limit },
    { skip: !page }
  );

  // Service categories for filtering
  const serviceCategories = [
    "all",
    "cleaning",
    "plumbing",
    "electrical",
    "carpentry",
    "painting",
    "gardening",
    "moving",
    "appliance repair",
    "handyman",
    "other"
  ];

  // Handle initial data load
  useEffect(() => {
    if (data && data.data) {
      if (data.pagination?.page === 1) {
        setAllProviders(data.data.providers || data.data);
      } else {
        setAllProviders((prev) => [...prev, ...(data.data.providers || data.data)]);
      }
      
      // Update pagination info
      if (data.pagination) {
        setTotalPages(data.pagination.totalPages || 1);
        setTotalProviders(data.pagination.total || 0);
      } else if (data.data.total) {
        setTotalPages(Math.ceil(data.data.total / limit));
        setTotalProviders(data.data.total);
      }
    }
  }, [data, limit]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, serviceFilter]);

  // Filter providers based on search and service filter
  const filteredProviders = allProviders.filter((p) => {
    const matchesSearch = !searchQuery || 
      (p.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.serviceName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.serviceCategory || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.serviceArea || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesService = serviceFilter === "all" || 
      (p.serviceCategory || "").toLowerCase() === serviceFilter.toLowerCase();

    return matchesSearch && matchesService;
  });

  // Handle page navigation
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle limit change
  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page
  };

  // Calculate display range
  const startIndex = (page - 1) * limit + 1;
  const endIndex = Math.min(page * limit, totalProviders);

  if (isLoading && page === 1) {
    return (
      <section className='w-full py-10 px-5 bg-[#F5F5F7]'>
        <div className='max-w-[1350px] mx-auto'>
          <h2 className='text-[36px] px-4 font-bold text-[#1B1B1B] mb-6'>
            All Service Providers
          </h2>
          
          {/* Search and Filter Skeleton */}
          <div className="mb-8 px-4">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-300 rounded-lg mb-4"></div>
              <div className="flex gap-4">
                <div className="h-10 bg-gray-300 rounded w-1/4"></div>
                <div className="h-10 bg-gray-300 rounded w-1/4"></div>
              </div>
            </div>
          </div>

          {/* Cards Skeleton */}
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
        {/* Header */}
        <div className="mb-8 px-4">
          <h2 className='text-[36px] font-bold text-[#1B1B1B] mb-2'>
            All Service Providers
          </h2>
          <p className="text-gray-600 mb-6">Find and book professional service providers near you</p>
          
          {/* Stats */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-gray-600">
              Showing {startIndex} - {endIndex} of {totalProviders} providers
            </div>
            <div className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search providers by name, service, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Service Category Filter */}
              <div className="flex items-center gap-2">
                <Filter className="text-gray-400 w-5 h-5" />
                <select
                  value={serviceFilter}
                  onChange={(e) => setServiceFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All Services</option>
                  {serviceCategories.slice(1).map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Items Per Page */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Show:</span>
                <select
                  value={limit}
                  onChange={(e) => handleLimitChange(Number(e.target.value))}
                  className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="30">30</option>
                  <option value="50">50</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Providers Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
          {filteredProviders.length === 0 ? (
            <div className="col-span-3 text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No providers found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredProviders.map((p) => (
              <div key={p._id} className={`p-3 ` }>
                <Link href={`/service-details?id=${p._id}`}>
                  <div className='bg-white rounded-[20px] overflow-hidden p-3.5 hover:shadow-lg transition-shadow duration-300'>
                    {/* Image */}
                    <div className='relative w-full h-[210px] mb-4'>
                      <img
                        src={p.image || p.businessLogo || "/blog/blog1.jpg"}
                        className='w-full h-full object-cover rounded-[16px]'
                        alt={p.name || p.shopName}
                      />
                      <span className='absolute top-3 right-3 px-3 py-[3px] bg-[#A46CFF] text-white text-[12px] rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.20)]'>
                        {p.serviceCategory || "Service Provider"}
                      </span>
                    </div>

                    {/* Name */}
                    <h3 className='text-[16px] font-semibold text-[#1A1A1A] mb-0.5'>
                      {p.name || p.shopName || "Unnamed Provider"}
                    </h3>
                    <h3 className='text-[16px] font-semibold text-[#1A1A1A] mb-0.5'>
                      {p.serviceName}
                    </h3>

                    {/* Subtitle */}
                    <p className='text-[14px] leading-5 text-[#A46CFF] mb-3'>
                      {p.serviceName || "Professional service"}
                    </p>

                    {/* Location */}
                    <div className='flex items-center gap-2 text-[13px] text-[#6A6A6A] mb-3'>
                      <LuMapPin className='text-[16px]' />
                      {p.serviceArea || p.address || "Location not specified"}
                    </div>

                    {/* Rating */}
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

                    {/* Service Info */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Experience:</span>
                        <span className="font-medium">{p.yearsOfExperience || "Not specified"}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600 mt-1">
                        <span>Service Radius:</span>
                        <span className="font-medium">{p.serviceRadius || "N/A"} km</span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <p className='text-[13px] text-[#6B6B6B]'>Starting at</p>
                        <p className='text-[22px] font-semibold text-[#F78D25]'>
                          ${p.hourlyRate || 50}/hr
                        </p>
                      </div>
                      <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        Available
                      </div>
                    </div>

                    {/* Button */}
                    <button className='w-full py-3 text-[15px] font-medium text-white rounded-xl bg-gradient-to-r from-[#9838E1] to-[#F68E44] shadow-[0_4px_14px_rgba(0,0,0,0.15)] hover:opacity-90 transition-opacity cursor-pointer'>
                      Book Now
                    </button>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>

        {/* Pagination Controls */}
        {filteredProviders.length > 0 && totalPages > 1 && (
          <div className="mt-12 px-4">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  Showing {startIndex} to {endIndex} of {totalProviders} entries
                </div>
                
                <div className="flex items-center gap-2">
                  {/* First Page */}
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={page === 1}
                    className={`p-2 rounded-lg ${
                      page === 1
                        ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <ChevronsLeft className="w-5 h-5" />
                  </button>

                  {/* Previous Page */}
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className={`p-2 rounded-lg ${
                      page === 1
                        ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (page <= 3) {
                        pageNumber = i + 1;
                      } else if (page >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i;
                      } else {
                        pageNumber = page - 2 + i;
                      }

                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                            page === pageNumber
                              ? 'bg-purple-600 text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}

                    {/* Ellipsis for many pages */}
                    {totalPages > 5 && page < totalPages - 2 && (
                      <>
                        <span className="px-1">...</span>
                        <button
                          onClick={() => handlePageChange(totalPages)}
                          className="px-3 py-1.5 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                  </div>

                  {/* Next Page */}
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className={`p-2 rounded-lg ${
                      page === totalPages
                        ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Last Page */}
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={page === totalPages}
                    className={`p-2 rounded-lg ${
                      page === totalPages
                        ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <ChevronsRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Go to Page */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Go to page:</span>
                  <input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={page}
                    onChange={(e) => {
                      const newPage = parseInt(e.target.value);
                      if (newPage >= 1 && newPage <= totalPages) {
                        setPage(newPage);
                      }
                    }}
                    className="w-16 px-2 py-1.5 border border-gray-300 rounded text-center"
                  />
                </div>
              </div>
            </div>

            {/* Page Info */}
            <div className="mt-4 text-center text-sm text-gray-500">
              Page {page} of {totalPages} • {limit} items per page
            </div>
          </div>
        )}
      </div>
    </section>
  );
}