"use client";

import Image from "next/image";
import Link from "next/link";
import { AiFillStar } from "react-icons/ai";
import { IoCartOutline } from "react-icons/io5";
import { useAllProductQuery } from "@/feature/ProductApi";
import { useEffect, useState } from "react";
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
import { useTranslation } from "react-i18next";

const CATEGORY_ICONS = {
  fashion: LuShirt,
  foodDrinks: LuCupSoda,
  technology: LuMonitor,
  artsCrafts: LuPenTool,
  beauty: LuHeart,
  homeDecoration: LuHouse,
  sports: LuDumbbell,
  books: LuBookOpen,
};

const CATEGORY_NAMES = {
  fashion: "Fashion",
  foodDrinks: "Food and Drinks",
  technology: "Technology",
  artsCrafts: "Arts and Crafts",
  beauty: "Beauty",
  homeDecoration: "Home and Decoration",
  sports: "Sports",
  books: "Books",
};

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const {t} = useTranslation('feature')

  // সর্বশেষ ৪টি প্রোডাক্টের জন্য query parameters
  const queryParams = {
    skip: 0,
    limit: 4,
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc"
  };

  const { data, isLoading } = useAllProductQuery(queryParams);

  useEffect(() => {
    if (data?.data) {
      // সর্বাধিক ৪টি প্রোডাক্ট নেওয়া
      const latestProducts = data.data.slice(0, 4);
      setProducts(latestProducts);
      setLoading(false);
    } else if (!isLoading) {
      setLoading(false);
    }
  }, [data, isLoading]);

  // ডিফল্ট প্রোডাক্ট ডেটা (যদি API থেকে ডেটা না আসে)
  const defaultProducts = [
    {
      _id: "1",
      name: "Handmade Leather Bag",
      image: "/product/productsBG.jpg",
      seller: { name: "Maria Artesanias" },
      rating: 4.6,
      reviews: 24,
      price: 89,
      category: "fashion"
    },
    {
      _id: "2",
      name: "Premium Organic Coffee",
      image: "/product/productsBG.jpg",
      seller: { name: "Maria Artesanias" },
      rating: 4.6,
      reviews: 24,
      price: 89,
      category: "foodDrinks"
    },
    {
      _id: "3",
      name: "Echo Bluetooth Headphones",
      image: "/product/productsBG.jpg",
      seller: { name: "Maria Artesanias" },
      rating: 4.6,
      reviews: 24,
      price: 89,
      category: "technology"
    },
    {
      _id: "4",
      name: "Handmade Leather Bag",
      image: "/product/productsBG.jpg",
      seller: { name: "Maria Artesanias" },
      rating: 4.6,
      reviews: 24,
      price: 89,
      category: "fashion"
    },
  ];

  const displayProducts = products.length > 0 ? products : defaultProducts;

  // প্রোডাক্ট ট্যাগ নির্ধারণ
  const getProductTag = (product) => {
    if (product.stock !== undefined && product.stock < 10) {
      return { text: "Low Stock", color: "bg-[#FF7C7C]" };
    } else if (product.rating && product.rating >= 4.5) {
      return { text: "Top Rated", color: "bg-[#A46CFF]" };
    } else if (product.price && product.price < 50) {
      return { text: "Best Deal", color: "bg-[#4CAF50]" };
    }
    return { text: "New", color: "bg-[#FFB54C]" };
  };

  // ক্যাটাগরি আইকন
  const getCategoryIcon = (category) => {
    const Icon = CATEGORY_ICONS[category] || LuShirt;
    return <Icon className="text-[#9838E1] text-[20px]" />;
  };

  // ক্যাটাগরি নাম
  const getCategoryName = (category) => {
    return CATEGORY_NAMES[category] || "Product";
  };

  if (loading) {
    return (
      <section className="w-full py-20 px-4 md:px-10">
        <div className="max-w-[1350px] mx-auto">
          <h2 className="text-[36px] font-bold text-center mb-2">
          {t('title')}
          </h2>
          <p className="text-center font-bold text-[#AC65EE] text-[15px] mb-12">
          {t('description')}
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-white rounded-[20px] shadow-[0px_4px_18px_rgba(0,0,0,0.12)] p-4 animate-pulse"
              >
                <div className="rounded-[16px] overflow-hidden mb-4 bg-gray-200 h-[180px]"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-2 w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded mb-3 w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-14">
            <button className="px-8 py-[12px] rounded-[10px] text-white text-[15px] font-medium bg-gray-300 animate-pulse">
              Loading...
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-20 px-4 md:px-10">
      <div className="max-w-[1350px] mx-auto">
        {/* Heading */}
        <h2 className="text-[36px] font-bold text-center mb-2">
     {t('title')}
        </h2>

        {/* Subtext */}
        <p className="text-center font-bold text-[#AC65EE] text-[15px] mb-12">
          {t('description')}
        </p>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {displayProducts.map((product) => {
            const tag = getProductTag(product);
            
            return (
              <Link 
                href={`/product-details/${product._id}`} 
                key={product._id}
                className="block"
              >
                <div className="
                  bg-white rounded-[20px] shadow-[0px_4px_18px_rgba(0,0,0,0.12)] 
                  p-4 hover:shadow-[0px_6px_24px_rgba(0,0,0,0.18)] transition-all 
                  duration-300 h-full flex flex-col
                ">
                  {/* Product Image with Tag */}
                  <div className="relative rounded-[16px] overflow-hidden mb-4">
                    <Image
                      src={product.image || "/product/productsBG.jpg"}
                      width={400}
                      height={300}
                      className="w-full h-[180px] object-cover hover:scale-105 transition-transform duration-300"
                      alt={product.name}
                    />
                    {/* Product Tag */}
                    <span className={`
                      absolute top-3 left-3 ${tag.color} text-white 
                      text-[11px] rounded-full px-3 py-1 font-medium 
                      shadow-[0_3px_10px_rgba(0,0,0,0.18)]
                    `}>
                      {tag.text}
                    </span>
                    {/* Category Icon */}
                    <div className="absolute top-3 right-3 bg-white/90 p-2 rounded-full">
                      {getCategoryIcon(product.category || "fashion")}
                    </div>
                  </div>

                  {/* Category Badge */}
                  <div className="mb-2">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-[#9838E1] bg-[#F8F4FD] px-3 py-1 rounded-full">
                      {getCategoryIcon(product.category || "fashion")}
                      {getCategoryName(product.category || "fashion")}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-[15px] font-medium mb-1 line-clamp-2 min-h-[40px]">
                    {product.name}
                  </h3>

                  {/* Seller */}
                  <p className="text-[13px] text-[#7A5FA6] mb-2">
                    by {product.seller?.name || product.seller?.email || "Unknown Seller"}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <AiFillStar 
                        key={i} 
                        className={`text-[16px] ${
                          i < Math.floor(product.rating || 0)
                            ? "text-[#FFA534]"
                            : "text-[#E0E0E0]"
                        }`}
                      />
                    ))}
                    <span className="text-[13px] text-[#6B6B6B] ml-1">
                      {product.rating?.toFixed(1) || "0.0"} ({product.reviews || 0})
                    </span>
                  </div>

                  {/* Price + Add Button */}
                  <div className="flex items-center justify-between mt-auto pt-3">
                    <p className="text-[22px] font-semibold text-[#F78D25]">
                      ${product.price?.toFixed(2) || "0.00"}
                    </p>

                    <button 
                   
                      className="
                        flex items-center gap-1 text-white px-4 py-[8px] rounded-[10px]
                        text-[14px] font-medium shadow-[0px_2px_8px_rgba(0,0,0,0.15)]
                        bg-gradient-to-r from-[#9838E1] to-[#F68E44]
                        hover:from-[#8a2dc8] hover:to-[#e57f3a] transition-all
                      "
                    >
                      <IoCartOutline className="text-[18px]" />
                 { t('feature_1')}
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View More Button */}
        <div className="flex justify-center mt-14">
          <Link href="/marketplace">
            <button className="
              px-8 py-[12px] cursor-pointer rounded-[10px] text-white text-[15px] font-medium
              bg-gradient-to-r from-[#9838E1] to-[#F68E44]
              shadow-[0px_4px_14px_rgba(0,0,0,0.15)]
              hover:from-[#8a2dc8] hover:to-[#e57f3a] transition-all
              hover:shadow-[0px_6px_20px_rgba(152,56,225,0.3)]
            ">
   {t('button_text')}
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}