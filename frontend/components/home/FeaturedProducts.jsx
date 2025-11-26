"use client";

import Image from "next/image";
import { AiFillStar } from "react-icons/ai";
import { IoCartOutline } from "react-icons/io5";

export default function FeaturedProducts() {
  const products = [
    {
      title: "Handmade Leather Bag",
      image: "/product/productsBG.jpg",
      seller: "Maria Artesanias",
      rating: 4.6,
      reviews: 24,
      price: 89,
    },
    {
      title: "Premium Organic Coffee",
      image: "/product/productsBG.jpg",
      seller: "Maria Artesanias",
      rating: 4.6,
      reviews: 24,
      price: 89,
    },
    {
      title: "Echo Bluetooth Headphones",
      image: "/product/productsBG.jpg",
      seller: "Maria Artesanias",
      rating: 4.6,
      reviews: 24,
      price: 89,
    },
    {
      title: "Handmade Leather Bag",
      image: "/product/productsBG.jpg",
      seller: "Maria Artesanias",
      rating: 4.6,
      reviews: 24,
      price: 89,
    },
  ];

  return (
    <section className="w-full py-20 px-10">
      <div className="max-w-[1350px] mx-auto">

        {/* Heading */}
        <h2 className="text-[36px] font-bold text-center mb-2">
          Featured Products
        </h2>

        {/* Subtext */}
        <p className="text-center font-bold text-[#AC65EE] text-[15px] mb-12">
          Discover our handpicked selection of top-quality products from trusted sellers
        </p>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {products.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-[20px] shadow-[0px_4px_18px_rgba(0,0,0,0.12)] p-4 hover:shadow-[0px_6px_24px_rgba(0,0,0,0.18)] transition"
            >
              {/* Product Image */}
              <div className="rounded-[16px] overflow-hidden mb-4">
                <Image
                  src={item.image}
                  width={400}
                  height={300}
                  className="w-full h-[180px] object-cover"
                  alt={item.title}
                />
              </div>

              {/* Title */}
              <p className="text-[15px] font-medium mb-1">{item.title}</p>

              {/* Seller */}
              <p className="text-[13px] text-[#7A5FA6] mb-2">by {item.seller}</p>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <AiFillStar key={i} className="text-[#FFA534] text-[16px]" />
                ))}
                <span className="text-[13px] text-[#6B6B6B] ml-1">
                  {item.rating} ({item.reviews})
                </span>
              </div>

              {/* Price + Add Button */}
              <div className="flex items-center justify-between mt-2">
                <p className="text-[22px] font-semibold text-[#F78D25]">
                  ${item.price}
                </p>

                <button className="
                  flex items-center gap-1 text-white px-4 py-[8px] rounded-[10px]
                  text-[14px] font-medium shadow-[0px_2px_8px_rgba(0,0,0,0.15)]
                  bg-gradient-to-r from-[#9838E1] to-[#F68E44]
                ">
                  <IoCartOutline className="text-[18px]" />
                  Add
                </button>
              </div>
            </div>
          ))}

        </div>

        {/* View More Button */}
        <div className="flex justify-center mt-14">
          <button className="
            px-8 py-[12px] rounded-[10px] text-white text-[15px] font-medium
            bg-gradient-to-r from-[#9838E1] to-[#F68E44]
            shadow-[0px_4px_14px_rgba(0,0,0,0.15)]
          ">
            View More Products
          </button>
        </div>

      </div>
    </section>
  );
}
