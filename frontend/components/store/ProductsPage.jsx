"use client";

import { useMyProductQuery } from "@/feature/ProductApi";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { 
  AiFillStar, 
  AiOutlineHeart, 
  AiOutlineShareAlt, 
  AiOutlineShoppingCart,
  AiOutlineEye,
  AiOutlineShop,
  AiOutlineEnvironment,
  AiOutlinePhone,
  AiOutlineMail,
  AiOutlineGlobal,
  AiOutlineFacebook,
  AiOutlineInstagram,
  AiOutlineTwitter,
  AiOutlineLinkedin
} from "react-icons/ai";
import { FiSearch, FiFilter, FiGrid, FiList, FiChevronRight, FiPackage } from "react-icons/fi";
import { BsShieldCheck, BsStarFill } from "react-icons/bs";

export default function StorePage() {
  const { t } = useTranslation("seller");
  const params = useParams();
  const { id } = params;

  // State for search, filter, and pagination
  const [search, setSearch] = useState("");
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(12);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Fetch store data (assuming first product has seller info)
  const queryParams = {
    id,
    skip: 0,
    limit: 1,
    search: "",
    status: "active",
  };

  const { data: storeData, isLoading: storeLoading } = useMyProductQuery(queryParams);
  
  // Fetch products data
  const productsQueryParams = {
    id,
    skip,
    limit,
    search: search || "",
    status: "active",
  };

  const { data: response, isLoading, refetch } = useMyProductQuery(productsQueryParams);

  // Extract store info from first product
  const store = response?.data?.[0]?.seller || null;
  const products = response?.data || [];
  const totalProducts = response?.total || 0;

  // Filter only active products
  const activeProducts = products.filter(
    (product) => product.status === "active"
  );
  const totalActiveProducts = totalProducts;

  // Calculate average rating from products
  const averageRating = useMemo(() => {
    if (activeProducts.length === 0) return 0;
    const totalRating = activeProducts.reduce((sum, product) => sum + (product.rating || 0), 0);
    return totalRating / activeProducts.length;
  }, [activeProducts]);

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
          <BsStarFill key={i} className='text-[#FFA534] text-[17px]' />
        );
      } else {
        stars.push(
          <BsStarFill key={i} className='text-[#E0E0E0] text-[17px]' />
        );
      }
    }
    return stars;
  };

  // Get product tag with translations
  const getProductTag = (product) => {
    if (product.stock && product.stock < 10) {
      return {
        text: t("lowStock"),
        color: "bg-[#FF7C7C]",
      };
    }
    if (product.rating >= 4.5) {
      return {
        text: t("topRated"),
        color: "bg-[#A46CFF]",
      };
    }
    if (product.stock && product.stock > 20) {
      return {
        text: t("inStock"),
        color: "bg-[#4CAF50]",
      };
    }
    return {
      text: t("active"),
      color: "bg-[#FFB54C]",
    };
  };

  // Get categories from products
  const categories = ["all", ...new Set(products.map(p => p.category).filter(Boolean))];

  // Sort products
  const sortedProducts = [...activeProducts].sort((a, b) => {
    switch(sortBy) {
      case "priceLow": return a.price - b.price;
      case "priceHigh": return b.price - a.price;
      case "rating": return (b.rating || 0) - (a.rating || 0);
      case "newest": return new Date(b.createdAt) - new Date(a.createdAt);
      default: return 0;
    }
  });

  // Filter by category
  const filteredProducts = selectedCategory === "all" 
    ? sortedProducts 
    : sortedProducts.filter(p => p.category === selectedCategory);

  // Pagination
  const totalPages = Math.ceil(totalActiveProducts / limit);
  const currentPage = Math.floor(skip / limit) + 1;

  const handlePagination = (page) => {
    setSkip((page - 1) * limit);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Store stats
  const storeProductsCount = totalActiveProducts;
  const storeJoinDate = store?.createdAt ? new Date(store.createdAt).getFullYear() : new Date().getFullYear();

  if (storeLoading) {
    return (
      <div className='w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white'>
        <div className='text-center'>
          <div className='inline-block animate-spin rounded-full h-20 w-20 border-4 border-purple-500 border-t-transparent mb-6'></div>
          <p className='text-gray-700 text-lg font-medium animate-pulse'>
            {t("loadingStoreProfile")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className='w-full bg-gradient-to-b from-[#F7F7FA] to-white'>
      {/* Store Header Banner */}
      <div className="relative h-[400px] bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-[1350px] mx-auto px-6 w-full">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Store Logo */}
              <div className="relative">
                <div className="w-48 h-48 rounded-3xl overflow-hidden border-8 border-white/30 bg-white shadow-2xl">
                  {store?.shopLogo ? (
                    <Image 
                      src={store.shopLogo} 
                      alt={store.shopName || "Store Logo"} 
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                      <AiOutlineShop className="text-6xl text-white" />
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-4 -right-4 bg-white p-3 rounded-2xl shadow-xl">
                  <FiPackage className="text-3xl text-purple-600" />
                </div>
              </div>

              {/* Store Info */}
              <div className="flex-1 text-white">
                <div className="flex items-center gap-4 mb-4">
                  <h1 className="text-4xl md:text-5xl font-bold">
                    {store?.shopName || t("storeName")}
                  </h1>
                  <span className="px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                    {store?.category || t("category")}
                  </span>
                </div>
                
                <p className="text-xl opacity-90 mb-6 max-w-3xl">
                  {store?.shopDescription || t("storeWelcomeMessage")}
                </p>

                {/* Store Stats */}
                <div className="flex flex-wrap gap-6 mb-6">
                  <div className="flex items-center gap-2">
                    <BsStarFill className="text-yellow-400 text-xl" />
                    <span className="font-semibold">{averageRating.toFixed(1)}</span>
                    <span className="opacity-80">{t("dashboard:avgRating")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AiOutlineShoppingCart className="text-xl" />
                    <span className="font-semibold">{storeProductsCount}</span>
                    <span className="opacity-80">{t("dashboard:products")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AiOutlineShop className="text-xl" />
                    <span className="font-semibold">{t("storeSince")} {storeJoinDate}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                    <BsShieldCheck className="text-white" />
                    <span className="text-sm font-medium">{t("verifiedProducts")}</span>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="flex flex-wrap gap-4">
                  {store?.phoneNumber && (
                    <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl">
                      <AiOutlinePhone />
                      <span>{store.phoneNumber}</span>
                    </div>
                  )}
                  {store?.address && (
                    <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl">
                      <AiOutlineEnvironment />
                      <span>{store.address}</span>
                    </div>
                  )}
                  {store?.email && (
                    <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl">
                      <AiOutlineMail />
                      <span>{store.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        {store && (
          <div className="absolute bottom-6 right-6 z-20">
            <div className="flex gap-3">
              {store.website && (
                <a 
                  href={store.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl transition-colors"
                >
                  <AiOutlineGlobal className="text-xl text-white" />
                </a>
              )}
              {store.instagram && (
                <a 
                  href={store.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl transition-colors"
                >
                  <AiOutlineInstagram className="text-xl text-white" />
                </a>
              )}
              {store.facebook && (
                <a 
                  href={store.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl transition-colors"
                >
                  <AiOutlineFacebook className="text-xl text-white" />
                </a>
              )}
              {store.twitter && (
                <a 
                  href={store.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl transition-colors"
                >
                  <AiOutlineTwitter className="text-xl text-white" />
                </a>
              )}
              {store.linkedin && (
                <a 
                  href={store.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl transition-colors"
                >
                  <AiOutlineLinkedin className="text-xl text-white" />
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className='max-w-[1350px] mx-auto px-6 -mt-16 relative z-20'>
        {/* Store Info Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mt-12 mb-8 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("aboutThisStore")}</h2>
              <p className="text-gray-600 leading-relaxed">
                {store?.shopDescription || t("storeWelcomeMessage")}
              </p>
              
              <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl">
                  <div className="text-sm text-gray-600 mb-1">{t("storeRating")}</div>
                  <div className="flex items-center gap-2">
                    <BsStarFill className="text-yellow-500" />
                    <span className="text-2xl font-bold text-gray-900">{averageRating.toFixed(1)}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{t("basedOnProducts")} {activeProducts.length} {t("products")}</div>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl">
                  <div className="text-sm text-gray-600 mb-1">{t("totalProducts")}</div>
                  <div className="text-2xl font-bold text-gray-900">{storeProductsCount}</div>
                  <div className="text-xs text-gray-500 mt-1">{t("activeItems")}</div>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl">
                  <div className="text-sm text-gray-600 mb-1">{t("storeSince")}</div>
                  <div className="text-2xl font-bold text-gray-900">{storeJoinDate}</div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">{t("storeCategories")}</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.slice(0, 5).map(category => category !== "all" && (
                    <span key={category} className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg">
                      {category}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">{t("storePolicies")}</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-gray-600">
                    <FiChevronRight className="text-purple-500" />
                    <span>{t("securePayment")}</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <FiChevronRight className="text-purple-500" />
                    <span>{t("qualityGuaranteed")}</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <FiChevronRight className="text-purple-500" />
                    <span>{t("fastShipping")}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH AND FILTER BAR */}
        <div className='mb-8'>
          <div className='bg-white rounded-3xl p-6 shadow-lg border border-gray-100'>
            <div className='flex flex-col md:flex-row items-center justify-between gap-6'>
              <div className='flex-1 w-full'>
                <div className='relative max-w-2xl'>
                  <div className='flex items-center bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-[20px] px-6 py-4'>
                    <FiSearch className='text-purple-600 text-[22px] mr-3' />
                    <input
                      type='text'
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                      placeholder={t("searchPlaceholder")}
                      className='flex-1 text-[16px] outline-none text-gray-800 placeholder:text-gray-400 bg-transparent'
                    />
                    <button
                      onClick={handleSearch}
                      className='flex-1 py-3 text-center font-medium text-white rounded-xl bg-gradient-to-r from-[#9838E1] to-[#F88D25] hover:shadow-lg transition-all flex items-center justify-center gap-2'>
                      {t("search")}
                    </button>
                  </div>
                </div>
              </div>

              <div className='flex items-center gap-4'>
                {/* View Mode Toggle */}
                <div className="flex bg-gray-100 p-1 rounded-xl">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg ${viewMode === "grid" ? 'bg-white shadow-md' : ''}`}
                  >
                    <FiGrid className={`text-lg ${viewMode === "grid" ? 'text-purple-600' : 'text-gray-500'}`} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg ${viewMode === "list" ? 'bg-white shadow-md' : ''}`}
                  >
                    <FiList className={`text-lg ${viewMode === "list" ? 'text-purple-600' : 'text-gray-500'}`} />
                  </button>
                </div>

                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className='border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 bg-white'
                >
                  <option value="newest">{t("newestFirst")}</option>
                  <option value="priceLow">{t("priceLowToHigh")}</option>
                  <option value="priceHigh">{t("priceHighToLow")}</option>
                  <option value="rating">{t("highestRated")}</option>
                </select>
              </div>
            </div>

            {/* Categories Filter */}
            <div className="mt-6">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedCategory === "all" ? ' py-3 text-center font-medium text-white rounded-xl bg-gradient-to-r from-[#9838E1] to-[#F88D25] hover:shadow-lg transition-all flex items-center justify-center gap-2' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {t("allProducts")}
                </button>
                {categories.filter(cat => cat !== "all").map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedCategory === category ? ' py-3 text-center font-medium text-white rounded-xl bg-gradient-to-r from-[#9838E1] to-[#F88D25] hover:shadow-lg transition-all flex items-center justify-center gap-2' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* PRODUCT GRID SECTION */}
        <section>
          {isLoading ? (
            <div className='flex flex-col items-center justify-center h-96'>
              <div className='animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mb-4'></div>
              <p className='text-gray-600'>
                {t("loadingProducts")}
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className='text-center py-20 bg-white rounded-3xl shadow-lg border border-gray-100'>
              <div className='text-6xl mb-6'>🛍️</div>
              <h3 className='text-2xl font-semibold text-gray-800 mb-3'>
                {search ? t("noProductsFound") : t("noProductsAvailable")}
              </h3>
              <p className='text-gray-600 max-w-md mx-auto mb-8'>
                {search ? t("noProductsMatching", { search }) : t("storeNoProducts")}
              </p>
              {search && (
                <button
                  onClick={() => {
                    setSearch("");
                    refetch();
                  }}
                  className='px-8 py-3 text-[16px] font-medium text-white rounded-[14px] bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg transition-all'>
                  {t("viewAllProducts")}
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Results Info */}
              <div className='mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className='w-3 h-3 bg-purple-600 rounded-full'></div>
                    <p className='text-sm text-purple-700 font-medium'>
                      {t("showingProducts", { count: filteredProducts.length, total: totalActiveProducts })}
                      {selectedCategory !== "all" && ` ${t("inCategory")} ${selectedCategory}`}
                    </p>
                  </div>
                  <div className="text-sm text-gray-600">
                    {t("sortBy")}: <span className="font-medium text-purple-700">
                      {sortBy === "newest" ? t("newest") : 
                       sortBy === "priceLow" ? t("priceLowToHigh") : 
                       sortBy === "priceHigh" ? t("priceHighToLow") : t("highestRated")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Products Grid/List */}
              <div className={`${viewMode === "grid" ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-6'}`}>
                {filteredProducts.map((product) => {
                  const tag = getProductTag(product);

                  return viewMode === "grid" ? (
                    // Grid View
                    <div key={product._id} className='group'>
                      <article className='bg-white rounded-3xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col h-full overflow-hidden'>
                        {/* Image Container */}
                        <div className='relative mb-5 overflow-hidden rounded-2xl'>
                          <div className='w-full h-[220px] bg-gradient-to-br from-gray-100 to-gray-200 relative'>
                            {product.image ? (
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className='object-cover group-hover:scale-105 transition-transform duration-500'
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                              />
                            ) : (
                              <div className='w-full h-full flex items-center justify-center'>
                                <AiOutlineShoppingCart className='text-5xl text-gray-300' />
                              </div>
                            )}
                          </div>

                          {/* Tag */}
                          <span className={`absolute top-4 left-4 ${tag.color} text-white text-xs rounded-full px-3 py-1.5 font-medium shadow-lg`}>
                            {tag.text}
                          </span>
                        </div>

                        {/* Content */}
                        <div className='flex-1'>
                          {/* Category */}
                          <div className="mb-2">
                            <span className="text-xs font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                              {product.category || t("uncategorized")}
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className='text-lg font-bold text-gray-900 mb-2 line-clamp-2 min-h-[56px]'>
                            {product.name}
                          </h3>

                          {/* Description */}
                          <p className='text-sm text-gray-500 mb-4 line-clamp-2'>
                            {product.description || t("premiumQualityProduct")}
                          </p>

                          {/* Rating */}
                          <div className='flex items-center gap-1 mb-4'>
                            {generateStars(product.rating || 0)}
                            <span className='ml-2 text-sm text-gray-500'>
                              ({product.rating?.toFixed(1) || "0.0"})
                            </span>
                          </div>

                          {/* Price and Stock */}
                          <div className='flex items-center justify-between mb-5'>
                            <div>
                              <span className='text-2xl font-bold text-gray-900'>
                                ${product.price.toLocaleString()}
                              </span>
                              {product.shippingCost > 0 && (
                                <span className='block text-xs text-gray-500 mt-1'>
                                  +${product.shippingCost} {t("shipping")}
                                </span>
                              )}
                            </div>
                            <div className='text-right'>
                              <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${product.stock > 10 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                {product.stock || 0} {t("inStock")}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          <Link
                            href={`/product-details/${product._id}`}
                            className='flex-1 py-3 text-center font-medium text-white rounded-xl bg-gradient-to-r from-[#9838E1] to-[#F88D25] hover:shadow-lg transition-all flex items-center justify-center gap-2'>
                            <AiOutlineShoppingCart />
                            {t("viewDetails")}
                          </Link>
                        </div>
                      </article>
                    </div>
                  ) : (
                    // List View
                    <div key={product._id} className='group'>
                      <article className='bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100'>
                        <div className='flex flex-col md:flex-row gap-6'>
                          {/* Image */}
                          <div className='relative w-full md:w-64 flex-shrink-0'>
                            <div className='w-full h-48 md:h-full rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200'>
                              {product.image ? (
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  fill
                                  className='object-cover'
                                />
                              ) : (
                                <div className='w-full h-full flex items-center justify-center'>
                                  <AiOutlineShoppingCart className='text-5xl text-gray-300' />
                                </div>
                              )}
                            </div>
                            <span className={`absolute top-3 left-3 ${tag.color} text-white text-xs rounded-full px-3 py-1.5 font-medium shadow-md`}>
                              {tag.text}
                            </span>
                          </div>

                          {/* Content */}
                          <div className='flex-1'>
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <span className="text-sm font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full mb-2 inline-block">
                                  {product.category}
                                </span>
                                <h3 className='text-xl font-bold text-gray-900 mb-2'>
                                  {product.name}
                                </h3>
                              </div>
                              <div className="text-2xl font-bold text-gray-900">
                                ${product.price.toLocaleString()}
                              </div>
                            </div>

                            <p className='text-gray-600 mb-4 line-clamp-2'>
                              {product.description}
                            </p>

                            <div className="flex items-center gap-4 mb-5">
                              <div className='flex items-center gap-1'>
                                {generateStars(product.rating || 0)}
                                <span className='ml-2 text-sm text-gray-500'>
                                  {t("rating")}: {product.rating?.toFixed(1) || "0.0"}
                                </span>
                              </div>
                              <span className={`px-3 py-1 text-xs font-medium rounded-full ${product.stock > 10 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                {product.stock || 0} {t("inStock")}
                              </span>
                              {product.shippingCost > 0 && (
                                <span className='text-sm text-gray-500'>
                                  {t("shipping")}: ${product.shippingCost}
                                </span>
                              )}
                            </div>

                            <div className="flex gap-3">
                              <Link
                                href={`/product-details/${product._id}`}
                                className='px-6 py-3 font-medium text-white rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg transition-all flex items-center gap-2'>
                                <AiOutlineShoppingCart />
                                {t("viewDetails")}
                              </Link>
                              <button className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors">
                                <AiOutlineHeart />
                              </button>
                              <button className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors">
                                <AiOutlineShareAlt />
                              </button>
                            </div>
                          </div>
                        </div>
                      </article>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className='mt-12'>
                  <div className='flex flex-col sm:flex-row items-center justify-between gap-6'>
                    <div className='text-sm text-gray-600'>
                      {t("pageOf", { current: currentPage, total: totalPages })} • {totalActiveProducts} {t("products")}
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Items per page selector */}
                      <div className='flex items-center gap-2'>
                        <span className='text-sm text-gray-600'>
                          {t("show")}:
                        </span>
                        <select
                          value={limit}
                          onChange={(e) => {
                            setLimit(Number(e.target.value));
                            setSkip(0);
                          }}
                          className='border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 bg-white'>
                          <option value='12'>12</option>
                          <option value='24'>24</option>
                          <option value='36'>36</option>
                          <option value='48'>48</option>
                        </select>
                      </div>

                      {/* Page Numbers */}
                      <div className="flex gap-2">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePagination(pageNum)}
                              className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${currentPage === pageNum ? ' py-3 text-center font-medium text-white rounded-xl bg-gradient-to-r from-[#9838E1] to-[#F88D25] hover:shadow-lg transition-all flex items-center justify-center gap-2' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </section>

        {/* Store Footer Info */}
        <div className="mt-12 bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">{t("storeInformation")}</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <AiOutlineShop className="text-purple-600" />
                  <span className="text-gray-600">{store?.shopName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <AiOutlineEnvironment className="text-purple-600" />
                  <span className="text-gray-600">{store?.address || t("addressNotSpecified")}</span>
                </div>
                <div className="flex items-center gap-3">
                  <AiOutlinePhone className="text-purple-600" />
                  <span className="text-gray-600">{store?.phoneNumber || t("phoneNotProvided")}</span>
                </div>
                <div className="flex items-center gap-3">
                  <AiOutlineMail className="text-purple-600" />
                  <span className="text-gray-600">{store?.email || t("emailNotProvided")}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">{t("storePerformance")}</h3>
              <ul className="space-y-2">
                <li className="text-gray-600">
                  <span className="font-medium">{t("averageRating")}:</span> {averageRating.toFixed(1)}/5
                </li>
                <li className="text-gray-600">
                  <span className="font-medium">{t("totalProducts")}:</span> {storeProductsCount}
                </li>
                <li className="text-gray-600">
                  <span className="font-medium">{t("storeSince")}:</span> {storeJoinDate}
                </li>
                <li className="text-gray-600">
                  <span className="font-medium">{t("activeProducts")}:</span> {activeProducts.length}
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">{t("connectWithStore")}</h3>
              <p className="text-gray-600 mb-4">{t("followForUpdates")}</p>
              <div className="flex gap-3">
                {store?.website && (
                  <a href={store.website} target="_blank" rel="noopener noreferrer" className="p-3 bg-purple-100 text-purple-600 rounded-xl hover:bg-purple-200 transition-colors">
                    <AiOutlineGlobal className="text-xl" />
                  </a>
                )}
                {store?.instagram && (
                  <a href={store.instagram} target="_blank" rel="noopener noreferrer" className="p-3 bg-pink-100 text-pink-600 rounded-xl hover:bg-pink-200 transition-colors">
                    <AiOutlineInstagram className="text-xl" />
                  </a>
                )}
                {store?.facebook && (
                  <a href={store.facebook} target="_blank" rel="noopener noreferrer" className="p-3 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-colors">
                    <AiOutlineFacebook className="text-xl" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}