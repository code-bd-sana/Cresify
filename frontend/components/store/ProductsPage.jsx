"use client";

import { FiSearch } from "react-icons/fi";
import { AiFillStar } from "react-icons/ai";
import { IoChevronDown } from "react-icons/io5";

import { useState } from "react";
import { Range } from "react-range";
import Link from "next/link";


export default function ProductsPage() {
  const [price, setPrice] = useState([0, 1000]);
  const [open, setOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Most Popular");

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

  const products = [
    {
      id: 1,
      tag: "New",
      tagColor: "bg-[#FFB54C]",
      title: "Genuine Leather Handbag",
      seller: "by Maria Leathercraft",
      rating: 4.8,
      reviews: 126,
      price: 599,
      oldPrice: 699,
      img: "/product/bag.jpg",
    },
    {
      id: 2,
      tag: "Organic",
      tagColor: "bg-[#A46CFF]",
      title: "Natural Lavender Soap",
      seller: "by Nature Cosmetics",
      rating: 4.9,
      reviews: 82,
      price: 89,
      oldPrice: 99,
      img: "/product/productsBG.jpg",
    },
    {
      id: 3,
      tag: "Best Seller",
      tagColor: "bg-[#FF7C7C]",
      title: "Pure Honey",
      seller: "by Honey Farm",
      rating: 4.7,
      reviews: 64,
      price: 129,
      oldPrice: 149,
      img: "/product/p1.jpg",
    },

    // second row
    {
      id: 4,
      tag: "New",
      tagColor: "bg-[#FFB54C]",
      title: "Genuine Leather Handbag",
      seller: "by Maria Leathercraft",
      rating: 4.8,
      reviews: 126,
      price: 599,
      oldPrice: 699,
      img: "/product/p2.jpg",
    },
    {
      id: 5,
      tag: "Featured",
      tagColor: "bg-[#A46CFF]",
      title: "Genuine Leather Handbag",
      seller: "by Maria Leathercraft",
      rating: 4.8,
      reviews: 126,
      price: 599,
      oldPrice: 699,
      img: "/product/p3.jpg",
    },
    {
      id: 6,
      tag: "Customer Fav",
      tagColor: "bg-[#FF7C7C]",
      title: "Pure Honey",
      seller: "by Honey Farm",
      rating: 4.7,
      reviews: 64,
      price: 129,
      oldPrice: 149,
      img: "/product/p4.jpg",
    },

    // third row
    {
      id: 7,
      tag: "New",
      tagColor: "bg-[#FFB54C]",
      title: "Genuine Leather Handbag",
      seller: "by Maria Leathercraft",
      rating: 4.8,
      reviews: 126,
      price: 599,
      oldPrice: 699,
      img: "/product/p5.jpg",
    },
    {
      id: 8,
      tag: "Sale",
      tagColor: "bg-[#FF7C7C]",
      title: "Handcrafted Vase",
      seller: "by Artisanal Home",
      rating: 4.5,
      reviews: 40,
      price: 59,
      oldPrice: 79,
      img: "/product/p6.jpg",
    },
    {
      id: 9,
      tag: "Customer Fav",
      tagColor: "bg-[#A46CFF]",
      title: "Genuine Leather Handbag",
      seller: "by Maria Leathercraft",
      rating: 4.9,
      reviews: 154,
      price: 599,
      oldPrice: 699,
      img: "/product/p7.jpg",
    },
  ];

  return (
    <main className="w-full bg-[#F7F7FA] py-10 px-6">
      <div className="max-w-[1350px] mx-auto flex gap-7">
        {/* LEFT SIDEBAR */}

      
        <aside className="hidden lg:block w-[270px]">
          <div
            className="bg-white rounded-[22px] p-6 
      shadow-[0_6px_24px_rgba(0,0,0,0.06)] 
      border border-[#F1ECF9]"
          >
            {/* HEADER */}
            <div className="flex items-center justify-between mb-7">
              <h3 className="text-[18px] font-semibold text-[#1B1B1B]">
                Filters
              </h3>
              <button className="text-[13px] text-[#F78D25] font-medium hover:underline">
                Clean everything
              </button>
            </div>

            {/* PRICE RANGE */}
            <div className="mb-9">
              <p className="text-[15px] font-semibold text-[#1B1B1B] mb-3">
                Price Range
              </p>

              {/* Top labels */}
              <div className="flex items-center justify-between text-[13px] text-[#333] mb-1">
                <span>${price[0]}</span>
                <span>${price[1]}</span>
              </div>

              {/* RANGE TRACK EXACT FIGMA */}
              <Range
                min={0}
                max={1000}
                step={1}
                values={price}
                onChange={setPrice}
                renderTrack={({ props, children }) => (
                  <div
                    {...props}
                    className="h-[8px] mt-2 rounded-full bg-[#E7DFFF] relative"
                  >
                    {/* Active range gradient */}
                    <div
                      className="absolute h-full rounded-full 
                  bg-gradient-to-r from-[#9838E1] to-[#F68E44]"
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
                    className="h-[20px] w-[20px] bg-[#4A3AFF] 
                rounded-full border-[3px] border-white
                shadow-[0_3px_8px_rgba(0,0,0,0.25)]"
                  />
                )}
              />

              {/* Inputs */}
              <div className="flex items-center gap-3 mt-4">
                <input
                  value={price[0]}
                  type="number"
                  onChange={(e) => setPrice([+e.target.value, price[1]])}
                  className="w-1/2 border border-[#E2DFF1] rounded-[12px]
              px-3 py-2 text-[14px] outline-none"
                />
                <input
                  value={price[1]}
                  type="number"
                  onChange={(e) => setPrice([price[0], +e.target.value])}
                  className="w-1/2 border border-[#E2DFF1] rounded-[12px]
              px-3 py-2 text-[14px] outline-none"
                />
              </div>
            </div>

            {/* QUALIFICATION SECTION */}
            <div className="mb-10">
              <p className="text-[15px] font-semibold text-[#1B1B1B] mb-3">
                Qualification
              </p>

              <div className="space-y-[10px]">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <label
                    key={stars}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    {/* Radio */}
                    <input
                      type="radio"
                      name="rating"
                      className="h-[16px] w-[16px] border-[#CFC9DC]"
                    />

                    {/* Stars — exact Figma spacing */}
                    <div className="flex gap-[2px]">
                      {[...Array(stars)].map((_, i) => (
                        <AiFillStar
                          key={i}
                          className="text-[#FFA534] text-[15px]"
                        />
                      ))}
                      {[...Array(5 - stars)].map((_, i) => (
                        <AiFillStar
                          key={i}
                          className="text-[#E0E0E0] text-[15px]"
                        />
                      ))}
                    </div>

                    {/* "and more" */}
                    <span className="text-[13px] text-[#999]">and more</span>
                  </label>
                ))}
              </div>
            </div>

            {/* APPLY BUTTON (Exact Figma) */}
            <button
              className="w-full py-[14px] text-[15px] font-medium text-white
          rounded-[14px]
          bg-[linear-gradient(90deg,#9838E1,#F68E44)]
          shadow-[0_6px_20px_rgba(0,0,0,0.12)]"
            >
              Apply Filters
            </button>
          </div>
        </aside>

        {/* RIGHT CONTENT */}
        <section className="flex-1">
          {/* TOP SEARCH + SORT */}
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
                  placeholder="Search for product or stores...."
                  className="flex-1 text-[14px] outline-none text-[#4A4A4A]
        placeholder:text-[#A0A0A0]"
                />
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
                    "All Product",
                    "Most Popular",
                    "Top Rated",
                    "New Arrival",
                  ].map((option) => (
                    <div
                      key={option}
                      onClick={() => {
                        setSelectedSort(option);
                        setOpen(false);
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
            Showing <span className="font-semibold text-[#444]">9</span> of{" "}
            <span className="font-semibold text-[#444]">64</span> products
          </p>

          {/* PRODUCT GRID */}
         <Link href="/product-details">
           <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.map((p) => (
              <article
                key={p.id}
                className="bg-white rounded-[24px] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.08)] 
  border border-[#F2EEF9] flex flex-col"
              >
                {/* Image */}
                <div className="relative mb-5">
                  <img
                    src={p.img}
                    alt={p.title}
                    className="w-full h-[220px] object-cover rounded-[18px]"
                  />

                  {/* Tag */}
                  <span
                    className={`absolute top-4 left-4 ${p.tagColor} text-white 
      text-[12px] rounded-full px-3 py-[4px] font-medium 
      shadow-[0_3px_10px_rgba(0,0,0,0.18)]`}
                  >
                    {p.tag}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-[17px] font-semibold text-[#1B1B1B] mb-1">
                  {p.title}
                </h3>

                {/* Seller */}
                <p className="text-[14px] text-[#A46CFF] font-medium mb-2">
                  {p.seller}
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
                  Juarez
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, idx) => (
                    <AiFillStar
                      key={idx}
                      className={`text-[17px] ${
                        idx < Math.floor(p.rating)
                          ? "text-[#FFA534]"
                          : "text-[#E0E0E0]"
                      }`}
                    />
                  ))}

                  <span className="ml-1 text-[14px] text-[#6B6B6B]">
                    {p.rating} ({p.reviews} review)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3 mb-5">
                  <span className="text-[24px] font-semibold text-[#F78D25]">
                    ${p.price}
                  </span>
                  <span className="text-[14px] text-[#B0B0B0] line-through">
                    ${p.oldPrice}
                  </span>
                </div>

                {/* Add to Cart Button */}
                <button
                  className="w-full mt-auto py-[12px] text-[15px] font-medium text-white
    rounded-[12px] bg-[linear-gradient(90deg,#9838E1,#F88D25)]
    shadow-[0_4px_14px_rgba(0,0,0,0.15)]"
                >
                  Add to cart
                </button>
              </article>
            ))}
          </div>
         </Link>
        </section>
      </div>
    </main>
  );
}
