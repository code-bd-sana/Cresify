"use client";

import { FiSearch } from "react-icons/fi";
import { AiFillStar } from "react-icons/ai";
import { IoChevronDown } from "react-icons/io5";
import { useState, useEffect } from "react";
import { Range } from "react-range";
import {
  LuShirt,
  LuCupSoda,
  LuMonitor,
  LuPenTool,
  LuHeart,
  LuHouse,
  LuDumbbell,
  LuBookOpen,
} from "react-icons/lu";
import Link from "next/link";
import { useAllProductQuery } from "@/feature/ProductApi";
import Image from "next/image";

const CATEGORY_ICONS = [
  LuShirt,
  LuCupSoda,
  LuMonitor,
  LuPenTool,
  LuHeart,
  LuHouse,
  LuDumbbell,
  LuBookOpen,
];

export default function ProductsPage({ searchTerm = "" }) {
  const [price, setPrice] = useState([0, 1000]);
  const [open, setOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Most Popular");
  const [search, setSearch] = useState(searchTerm);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(9);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [isFiltersApplied, setIsFiltersApplied] = useState(false);
  const [selectedRating, setSelectedRating] = useState(null);

  // Sync with parent search term
  useEffect(() => {
    if (searchTerm !== search) {
      setSearch(searchTerm);
      setSkip(0);
    }
  }, [searchTerm]);

  // Build query parameters
  const queryParams = {
    skip,
    limit,
    search: search,
    minPrice: price[0],
    maxPrice: price[1],
    sortBy: selectedSort === "Most Popular" ? "rating" : 
            selectedSort === "Top Rated" ? "rating" : "createdAt",
    sortOrder: "desc"
  };

  // Add category filter
  if (isFiltersApplied && selectedCategories.length > 0) {
    const categoryKeys = selectedCategories.map(cat => {
      const categoryMap = {
        "Fashion": "fashion",
        "Food and Drinks": "foodDrinks", 
        "Technology": "technology",
        "Arts and Crafts": "artsCrafts",
        "Beauty": "beauty",
        "Home and Decoration": "homeDecoration",
        "Sports": "sports",
        "Books": "books"
      };
      return categoryMap[cat] || cat.toLowerCase().replace(/\s+/g, '');
    }).join(',');
    queryParams.category = categoryKeys;
  }

  // Add location filter
  if (isFiltersApplied && selectedLocations.length > 0) {
    queryParams.location = selectedLocations.join(',');
  }

  const { data, isLoading, isFetching } = useAllProductQuery(queryParams);
  
  const products = data?.data || [];
  const totalProducts = data?.total || 0;

  const categories = [
    "Fashion",
    "Food and Drinks",
    "Technology",
    "Arts and Crafts",
    "Beauty",
    "Home and Decoration",
    "Sports",
    "Books",
  ];



  // Extract unique locations
  const locations = [...new Set(products.map(p => p.location).filter(Boolean))];

  // Handle search
  const handleSearch = () => {
    setSkip(0);
  };

  // Handle category select
  const handleCategorySelect = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Handle location select
  const handleLocationSelect = (location) => {
    setSelectedLocations(prev =>
      prev.includes(location)
        ? prev.filter(l => l !== location)
        : [...prev, location]
    );
  };

  // Apply filters
  const applyFilters = () => {
    setIsFiltersApplied(true);
    setSkip(0);
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedLocations([]);
    setPrice([0, 1000]);
    setSearch("");
    setSelectedRating(null);
    setIsFiltersApplied(false);
    setSkip(0);
  };

  // Pagination handler
  const handlePagination = (page) => {
    setSkip((page - 1) * limit);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = Math.ceil(totalProducts / limit);
  const currentPage = Math.floor(skip / limit) + 1;

  return (
    <main className="w-full bg-[#F7F7FA] py-10 px-6">
      <div className="max-w-[1350px] mx-auto flex gap-7">
        {/* LEFT SIDEBAR - আপনার আগের ডিজাইন */}
        <aside className="hidden lg:block w-[270px]">
          <div className="bg-white rounded-[18px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-[#F2EEF9]">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[17px] font-semibold text-[#1B1B1B]">
                Filters
              </h3>
              <button 
                onClick={clearFilters}
                className="text-[12px] text-[#F78D25] font-medium hover:underline"
              >
                Clean everything
              </button>
            </div>

            {/* Categories */}
            <div className="mb-8">
              <p className="text-[14px] font-semibold text-[#1B1B1B] mb-3">
                Categories
              </p>

              <div className="space-y-3">
                {categories.map((item, i) => {
                  const Icon = CATEGORY_ICONS[i];
                  return (
                    <label
                      key={i}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(item)}
                        onChange={() => handleCategorySelect(item)}
                        className="h-[16px] w-[16px] rounded border-[#CFC9DC] text-[#9838E1] focus:ring-0"
                      />
                      <Icon className="text-[#9838E1] text-[16px]" />
                      <span className="text-[13px] text-[#3A3A3A]">{item}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-8">
              <p className="text-[14px] text-[#1B1B1B] font-semibold mb-3">
                Price Range
              </p>

              {/* Labels */}
              <div className="flex items-center justify-between text-[12px] text-[#777] mb-1">
                <span>${price[0]}</span>
                <span>${price[1]}</span>
              </div>

              {/* Real Range Slider */}
              <Range
                step={1}
                min={0}
                max={1000}
                values={price}
                onChange={setPrice}
                renderTrack={({ props, children }) => (
                  <div
                    {...props}
                    className="h-[7px] rounded-full bg-[#E7DFFF] relative mb-3"
                  >
                    <div
                      className="absolute h-full rounded-full bg-gradient-to-r from-[#9838E1] to-[#F68E44]"
                      style={{
                        left: `${(price[0] / 1000) * 100}%`,
                        width: `${((price[1] - price[0]) / 1000) * 100}%`,
                      }}
                    />
                    {children}
                  </div>
                )}
                renderThumb={({ props }) => (
                  <div
                    {...props}
                    className="h-[16px] w-[16px] bg-white border border-[#9838E1] rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.15)]"
                  />
                )}
              />

              {/* Inputs */}
              <div className="flex items-center gap-3">
                <input
                  value={price[0]}
                  onChange={(e) => setPrice([+e.target.value, price[1]])}
                  type="number"
                  className="w-1/2 border border-[#E5E0F3] rounded-[10px] px-3 py-2 text-[13px] outline-none"
                />
                <input
                  value={price[1]}
                  onChange={(e) => setPrice([price[0], +e.target.value])}
                  type="number"
                  className="w-1/2 border border-[#E5E0F3] rounded-[10px] px-3 py-2 text-[13px] outline-none"
                />
              </div>
            </div>

            {/* Qualification */}
            <div className="mb-8">
              <p className="text-[14px] font-semibold text-[#1B1B1B] mb-3">
                Qualification
              </p>

              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <div
                    key={stars}
                    className="flex items-center gap-2 text-[13px]"
                  >
                    <input 
                      type="radio" 
                      name="rating"
                      checked={selectedRating === stars}
                      onChange={() => setSelectedRating(stars)}
                      className="h-[14px] w-[14px]" 
                    />
                    <div className="flex gap-[2px]">
                      {[...Array(stars)].map((_, i) => (
                        <AiFillStar
                          key={i}
                          className="text-[#FFA534] text-[14px]"
                        />
                      ))}
                      {[...Array(5 - stars)].map((_, i) => (
                        <AiFillStar
                          key={i}
                          className="text-[#DDD] text-[14px]"
                        />
                      ))}
                    </div>
                    <span className="text-[#A8A8A8]">and more</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="mb-7">
              <p className="text-[14px] font-semibold text-[#1B1B1B] mb-3">
                Location
              </p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {locations.map((location, index) => (
                  <label
                    key={index}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedLocations.includes(location)}
                      onChange={() => handleLocationSelect(location)}
                      className="h-[16px] w-[16px] rounded border-[#CFC9DC] text-[#9838E1] focus:ring-0"
                    />
                    <span className="text-[13px] text-[#3A3A3A]">{location}</span>
                  </label>
                ))}
                {locations.length === 0 && (
                  <p className="text-[12px] text-gray-500 italic">No locations found</p>
                )}
              </div>
            </div>

            {/* Apply Button */}
            <button
              onClick={applyFilters}
              className="w-full py-[12px] text-white text-[14px] font-medium rounded-[12px]
        bg-[linear-gradient(90deg,#9838E1,#F68E44)]
        shadow-[0_4px_14px_rgba(0,0,0,0.15)] hover:opacity-90"
            >
              Apply Filters
            </button>
          </div>
        </aside>

        {/* RIGHT CONTENT */}
        <section className="flex-1">
          {/* TOP SEARCH + SORT - আপনার আগের ডিজাইন */}
          <div className="w-full flex flex-col mb-2 bg-white p-3 rounded-3xl gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search Bar */}
            <div className="flex-1">
              <div
                className="flex items-center gap-2 bg-white border border-[#E3E1ED]
      rounded-[12px] px-4 py-[10px] shadow-[0px_4px_10px_rgba(0,0,0,0.06)]
      max-w-[420px]"
              >
                <FiSearch className="text-[#F78D25] text-[18px]" />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search for product or stores...."
                  className="flex-1 text-[14px] outline-none text-[#4A4A4A]
        placeholder:text-[#A0A0A0]"
                />
                <button
                  onClick={handleSearch}
                  className="text-[#F78D25] text-sm font-medium hover:underline"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              {/* Button */}
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center justify-between gap-2 bg-white
      border border-[#E3E1ED] rounded-[12px] px-4 py-[10px]
      text-[14px] text-[#4A4A4A] w-[180px]
      shadow-[0px_4px_10px_rgba(0,0,0,0.06)]"
              >
                {selectedSort}
                <IoChevronDown className="text-[#777] text-[16px]" />
              </button>

              {/* Dropdown */}
              {open && (
                <div
                  className="absolute mt-2 left-0 w-[220px] bg-white rounded-[12px]
        shadow-[0px_6px_18px_rgba(0,0,0,0.10)] overflow-hidden z-20"
                >
                  {[
                    "Most Popular",
                    "Top Rated",
                    "New Arrival",
                  ].map((option) => (
                    <div
                      key={option}
                      onClick={() => {
                        setSelectedSort(option);
                        setOpen(false);
                        setSkip(0);
                      }}
                      className={`px-4 py-3 text-[14px] cursor-pointer 
              ${
                selectedSort === option
                  ? "text-white font-semibold bg-[linear-gradient(90deg,#9838E1,#F68E44)] flex justify-between items-center"
                  : "hover:bg-[#F5F3FF] text-[#4A4A4A]"
              }`}
                    >
                      {option}
                      {selectedSort === option && (
                        <span className="text-white text-[16px]">✓</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Showing text */}
          <p className="text-[13px] text-[#777] mb-5">
            Showing <span className="font-semibold text-[#444]">{products.length}</span> of{" "}
            <span className="font-semibold text-[#444]">{totalProducts}</span> products
          </p>

          {/* PRODUCT GRID - আপনার আগের ডিজাইন */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9838E1]"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl">
              <div className="text-5xl mb-4">😔</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No products found</h3>
              <p className="text-gray-500 mb-4">
                {search 
                  ? `No products found for "${search}"`
                  : "No products available"}
              </p>
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="mt-2 px-6 py-2 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-[#9838E1] to-[#F68E44] hover:opacity-90"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => {
                  // Get category icon
                  const categoryIconMap = {
                    fashion: LuShirt,
                    foodDrinks: LuCupSoda,
                    technology: LuMonitor,
                    artsCrafts: LuPenTool,
                    beauty: LuHeart,
                    homeDecoration: LuHouse,
                    sports: LuDumbbell,
                    books: LuBookOpen,
                  };
                  
                  const Icon = categoryIconMap[product.category] || LuShirt;
                  
                  // Get category name
                  const categoryNameMap = {
                    fashion: "Fashion",
                    foodDrinks: "Food and Drinks",
                    technology: "Technology",
                    artsCrafts: "Arts and Crafts",
                    beauty: "Beauty",
                    homeDecoration: "Home and Decoration",
                    sports: "Sports",
                    books: "Books",
                  };
                  
                  const categoryName = categoryNameMap[product.category] || product.category;

                  // Determine tag
                  let tag = "New";
                  let tagColor = "bg-[#FFB54C]";
                  
                  if (product.stock < 10) {
                    tag = "Low Stock";
                    tagColor = "bg-[#FF7C7C]";
                  } else if (product.rating >= 4.5) {
                    tag = "Top Rated";
                    tagColor = "bg-[#A46CFF]";
                  } else if (product.price < 50) {
                    tag = "Best Deal";
                    tagColor = "bg-[#4CAF50]";
                  }

                  return (
                    <Link 
                      href={`/product-details/${product._id}`} 
                      key={product._id}
                      className="block"
                    >
                      <article
                        className="bg-white rounded-[24px] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.08)] 
  border border-[#F2EEF9] flex flex-col"
                      >
                        {/* Image */}
                        <div className="relative mb-5">
                          <div className="w-full h-[220px] rounded-[18px] overflow-hidden bg-gray-100">
                            {product.image ? (
                              <Image
                                src={product.image}
                                alt={product.name}
                                width={400}
                                height={220}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                <Icon className="text-4xl text-gray-400" />
                              </div>
                            )}
                          </div>

                          {/* Tag */}
                          <span
                            className={`absolute top-4 left-4 ${tagColor} text-white 
      text-[12px] rounded-full px-3 py-[4px] font-medium 
      shadow-[0_3px_10px_rgba(0,0,0,0.18)]`}
                          >
                            {tag}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-[17px] font-semibold text-[#1B1B1B] mb-1">
                          {product.name}
                        </h3>

                        {/* Seller */}
                        <p className="text-[14px] text-[#A46CFF] font-medium mb-2">
                          by {product.seller?.name || product.seller?.email || "Unknown Seller"}
                        </p>

                        {/* Location */}
                        <div className="flex items-center gap-2 text-[13px] text-[#666] mb-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-[15px] h-[15px] text-[#555]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 11a3 3 0 100-6 3 3 0 000 6z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19.5 10.5c0 7-7.5 11.5-7.5 11.5S4.5 17.5 4.5 10.5a7.5 7.5 0 1115 0z"
                            />
                          </svg>
                          {product.location || "N/A"}
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-3">
                          {[...Array(5)].map((_, idx) => (
                            <AiFillStar
                              key={idx}
                              className={`text-[17px] ${
                                idx < Math.floor(product.rating || 0)
                                  ? "text-[#FFA534]"
                                  : "text-[#E0E0E0]"
                              }`}
                            />
                          ))}

                          <span className="ml-1 text-[14px] text-[#6B6B6B]">
                            {product.rating?.toFixed(1) || "0.0"} ({product.reviews || 0} reviews)
                          </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-3 mb-5">
                          <span className="text-[24px] font-semibold text-[#F78D25]">
                            ${product.price}
                          </span>
                          {product.oldPrice && (
                            <span className="text-[14px] text-[#B0B0B0] line-through">
                              ${product.oldPrice}
                            </span>
                          )}
                        </div>

                        {/* Add to Cart Button */}
                        <button
                          className="w-full mt-auto py-[12px] text-[15px] font-medium text-white
    rounded-[12px] bg-[linear-gradient(90deg,#9838E1,#F88D25)]
    shadow-[0_4px_14px_rgba(0,0,0,0.15)] hover:opacity-90 cursor-pointer"
                        >
                          Add to cart
                        </button>
                      </article>
                    </Link>
                  );
                })}
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="mt-10 flex justify-center">
                  <div className="flex items-center gap-2 bg-white rounded-[18px] p-2 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                    <button
                      onClick={() => handlePagination(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                    >
                      Previous
                    </button>

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
                          className={`w-10 h-10 rounded-lg text-sm font-medium ${
                            currentPage === pageNum
                              ? "bg-gradient-to-r from-[#9838E1] to-[#F68E44] text-white"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => handlePagination(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {/* Items per page selector */}
              <div className="mt-6 flex justify-end">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Items per page:</span>
                  <select
                    value={limit}
                    onChange={(e) => {
                      setLimit(Number(e.target.value));
                      setSkip(0);
                    }}
                    className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#9838E1]/40"
                  >
                    <option value="9">9</option>
                    <option value="18">18</option>
                    <option value="27">27</option>
                    <option value="36">36</option>
                  </select>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}