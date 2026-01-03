"use client";

import { useMyProductQuery } from "@/feature/ProductApi";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AiFillStar } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";

export default function ProductsPage({
  products: initialProducts,
  isLoading: initialLoading,
  totalProducts: initialTotal,
}) {
  const { t } = useTranslation("store");
  const params = useParams();
  const { id } = params;

  // State for search and pagination only
  const [search, setSearch] = useState("");
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(9);

  // Build query parameters
  const queryParams = {
    id,
    skip,
    limit,
    search: search || "",
    status: "active",
  };

  // Fetch data using RTK Query
  const { data: response, isLoading, refetch } = useMyProductQuery(queryParams);

  // Extract products from response
  const products = response?.data || initialProducts || [];
  const totalProducts = response?.total || initialTotal || 0;

  // Filter only active products
  const activeProducts = products.filter(
    (product) => product.status === "active"
  );
  const totalActiveProducts = totalProducts;

  // Handle search
  const handleSearch = () => {
    setSkip(0);
    refetch();
  };

  // Generate stars for rating
  const generateStars = (rating) => {
    const fullStars = Math.floor(rating);
    const stars = [];

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <AiFillStar key={i} className='text-[#FFA534] text-[17px]' />
        );
      } else {
        stars.push(
          <AiFillStar key={i} className='text-[#E0E0E0] text-[17px]' />
        );
      }
    }
    return stars;
  };

  // Get product tag with translations
  const getProductTag = (product) => {
    if (product.stock && product.stock < 10) {
      return {
        text: t("store.lowStock"),
        color: "bg-[#FF7C7C]",
      };
    }
    if (product.rating >= 4.5) {
      return {
        text: t("store.topRated"),
        color: "bg-[#A46CFF]",
      };
    }
    if (product.stock && product.stock > 20) {
      return {
        text: t("store.inStock"),
        color: "bg-[#4CAF50]",
      };
    }
    return {
      text: t("store.active"),
      color: "bg-[#FFB54C]",
    };
  };

  // Pagination
  const totalPages = Math.ceil(totalActiveProducts / limit);
  const currentPage = Math.floor(skip / limit) + 1;

  const handlePagination = (page) => {
    setSkip((page - 1) * limit);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className='w-full bg-[#F7F7FA] py-10 px-6'>
      <div className='max-w-[1350px] mx-auto'>
        {/* SEARCH BAR - TOP SECTION */}
        <div className='mb-8'>
          <div className='bg-white rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)]'>
            <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
              <div className='flex-1 w-full'>
                <h1 className='text-2xl font-bold text-[#1B1B1B] mb-4'>
                  {t("store.activeStoreProducts")}
                </h1>
                <div className='relative max-w-2xl'>
                  <div className='flex items-center bg-white border-2 border-[#E3E1ED] rounded-[16px] px-6 py-4 shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:border-[#9838E1] transition-all'>
                    <FiSearch className='text-[#F78D25] text-[22px] mr-3' />
                    <input
                      type='text'
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                      placeholder={t("store.searchActiveProducts")}
                      className='flex-1 text-[16px] outline-none text-[#4A4A4A] placeholder:text-[#A0A0A0] bg-transparent'
                    />
                    <button
                      onClick={handleSearch}
                      className='ml-4 px-6 py-2 text-[15px] font-medium text-white rounded-[12px] bg-gradient-to-r from-[#9838E1] to-[#F68E44] hover:opacity-90 transition-opacity'>
                      {t("store.search")}
                    </button>
                  </div>
                  {search && (
                    <div className='mt-3 flex items-center justify-between'>
                      <p className='text-sm text-gray-600'>
                        {t("store.searchingFor")}{" "}
                        <span className='font-semibold text-[#9838E1]'>
                          {search}
                        </span>
                      </p>
                      <button
                        onClick={() => {
                          setSearch("");
                          refetch();
                        }}
                        className='text-sm text-gray-500 hover:text-[#F78D25] transition-colors'>
                        {t("store.clearSearch")}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Results Count */}
              <div className='bg-gradient-to-r from-[#9838E1]/10 to-[#F68E44]/10 rounded-xl p-4 min-w-[200px]'>
                <p className='text-sm text-gray-600 mb-1'>
                  {t("store.activeProducts")}
                </p>
                <p className='text-3xl font-bold text-[#9838E1]'>
                  {totalActiveProducts}
                </p>
                <p className='text-xs text-gray-500 mt-1'>
                  {t("store.showingProducts", { count: activeProducts.length })}
                </p>
                <div className='mt-2 flex items-center gap-1'>
                  <span className='w-2 h-2 bg-[#9838E1] rounded-full'></span>
                  <span className='text-xs text-[#9838E1]'>
                    {t("store.allActive")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PRODUCT GRID SECTION */}
        <section>
          {isLoading ? (
            <div className='flex flex-col items-center justify-center h-96'>
              <div className='animate-spin rounded-full h-16 w-16 border-4 border-[#9838E1] border-t-transparent mb-4'></div>
              <p className='text-gray-600'>
                {t("store.loadingActiveProducts")}
              </p>
            </div>
          ) : activeProducts.length === 0 ? (
            <div className='text-center py-20 bg-white rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.08)]'>
              <div className='text-6xl mb-6'>✅</div>
              <h3 className='text-2xl font-semibold text-gray-800 mb-3'>
                {search
                  ? t("store.noProductsFound")
                  : t("store.noProductsAvailable")}
              </h3>
              <p className='text-gray-600 max-w-md mx-auto mb-8'>
                {search
                  ? t("store.noProductsMatching", { search })
                  : t("store.addActivateProducts")}
              </p>
              {search && (
                <button
                  onClick={() => {
                    setSearch("");
                    refetch();
                  }}
                  className='px-8 py-3 text-[16px] font-medium text-white rounded-[14px] bg-gradient-to-r from-[#9838E1] to-[#F68E44] hover:opacity-90 transition-opacity'>
                  {t("store.viewAllActiveProducts")}
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Active Products Info */}
              <div className='mb-6 p-4 bg-gradient-to-r from-[#9838E1]/10 to-[#F68E44]/10 rounded-xl border border-[#F2EEF9]'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className='w-3 h-3 bg-[#9838E1] rounded-full'></div>
                    <p
                      className='text-sm text-[#9838E1] font-medium'
                      dangerouslySetInnerHTML={{
                        __html: t("store.showingOnlyActive"),
                      }}
                    />
                  </div>
                  <p className='text-sm text-gray-600'>
                    {t("store.allProductsActive")}
                  </p>
                </div>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8'>
                {activeProducts.map((product) => {
                  const tag = getProductTag(product);

                  return (
                    <div key={product._id} className='block'>
                      <article className='bg-white rounded-[28px] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.1)] border border-[#F2EEF9] flex flex-col '>
                        {/* Active Status Indicator */}
                        <div className='absolute top-6 right-6 flex items-center gap-1 bg-gradient-to-r from-[#9838E1]/20 to-[#F68E44]/20 text-[#9838E1] text-xs font-medium px-3 py-1 rounded-full'>
                          <span className='w-1.5 h-1.5 bg-[#9838E1] rounded-full'></span>
                          {t("store.active")}
                        </div>

                        {/* Image */}
                        <div className='relative mb-6'>
                          <div className='w-full h-[240px] rounded-[20px] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200'>
                            {product.image ? (
                              <Image
                                src={product.image}
                                alt={product.name}
                                width={400}
                                height={240}
                                className='w-full h-full object-cover'
                                onError={(e) => {
                                  e.currentTarget.src = "/product/default.jpg";
                                }}
                              />
                            ) : (
                              <div className='w-full h-full flex items-center justify-center'>
                                <AiFillStar className='text-5xl text-gray-300' />
                              </div>
                            )}
                          </div>

                          {/* Tag */}
                          <span
                            className={`absolute top-4 left-4 ${tag.color} text-white text-[13px] rounded-full px-4 py-[6px] font-medium shadow-[0_4px_12px_rgba(0,0,0,0.2)]`}>
                            {tag.text}
                          </span>
                        </div>

                        {/* Content */}
                        <div className='flex-1'>
                          {/* Title */}
                          <h3 className='text-[19px] font-bold text-[#1B1B1B] mb-2 line-clamp-1'>
                            {product.name}
                          </h3>

                          {/* Seller */}
                          <p className='text-[15px] text-[#A46CFF] font-medium mb-3'>
                            {product.seller?.name ||
                              product.seller?.email ||
                              t("store.unknownSeller")}
                          </p>

                          {/* Location */}
                          <div className='flex items-center gap-2 text-[14px] text-[#666] mb-4'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='w-[16px] h-[16px] text-[#555]'
                              fill='none'
                              viewBox='0 0 24 24'
                              stroke='currentColor'
                              strokeWidth='2'>
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M12 11a3 3 0 100-6 3 3 0 000 6z'
                              />
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M19.5 10.5c0 7-7.5 11.5-7.5 11.5S4.5 17.5 4.5 10.5a7.5 7.5 0 1115 0z'
                              />
                            </svg>
                            {product.location ||
                              product.city ||
                              t("store.locationNotSpecified")}
                          </div>

                          {/* Rating */}
                          <div className='flex items-center gap-1 mb-4'>
                            {generateStars(product.rating || 0)}
                            <span className='ml-2 text-[14px] text-[#6B6B6B]'>
                              {t("store.reviews", {
                                rating: (product.rating || 0).toFixed(1),
                                reviews: product.reviews || 0,
                              })}
                            </span>
                          </div>

                          {/* Price and Stock */}
                          <div className='flex items-center justify-between mb-6'>
                            <div>
                              <span className='text-[28px] font-bold text-[#F78D25]'>
                                ${product.price}
                              </span>
                              {product.shippingCost &&
                                product.shippingCost > 0 && (
                                  <span className='block text-[13px] text-[#B0B0B0] mt-1'>
                                    {t("store.shippingCost", {
                                      cost: product.shippingCost,
                                    })}
                                  </span>
                                )}
                            </div>
                            <div className='text-right'>
                              <span
                                className={`inline-block px-3 py-1 text-[12px] font-medium rounded-full ${
                                  product.stock && product.stock > 10
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}>
                                {t("store.stockCount", {
                                  count: product.stock || 0,
                                })}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* View Details Button */}
                        <Link
                          href={`/product-details/${product._id}`}
                          className='w-full py-[14px] text-center text-[16px] font-semibold text-white rounded-[14px] bg-gradient-to-r from-[#9838E1] to-[#F88D25] shadow-[0_6px_20px_rgba(0,0,0,0.2)] hover:opacity-90 transition-all hover:shadow-[0_8px_25px_rgba(0,0,0,0.25)]'>
                          {t("store.viewDetails")}
                        </Link>
                      </article>
                    </div>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div className='mt-12'>
                  <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
                    <div className='text-sm text-gray-600'>
                      {t("store.pageOf", {
                        current: currentPage,
                        total: totalPages,
                      })}{" "}
                      •{" "}
                      {t("store.totalProducts", { count: totalActiveProducts })}
                    </div>

                    {/* Items per page selector */}
                    <div className='flex items-center gap-2'>
                      <span className='text-sm text-gray-600'>
                        {t("store.show")}:
                      </span>
                      <select
                        value={limit}
                        onChange={(e) => {
                          setLimit(Number(e.target.value));
                          setSkip(0);
                        }}
                        className='border border-gray-300 rounded-[12px] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#9838E1]/40 bg-white'>
                        <option value='9'>{t("store.perPage.9")}</option>
                        <option value='18'>{t("store.perPage.18")}</option>
                        <option value='27'>{t("store.perPage.27")}</option>
                        <option value='36'>{t("store.perPage.36")}</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}
