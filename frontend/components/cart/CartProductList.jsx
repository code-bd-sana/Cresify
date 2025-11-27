"use client";

import { MapPin, Star } from "lucide-react";

export default function CartProductList() {
  const products = [
    {
      id: 1,
      image: "/product/p1.jpg",
      name: "Genuine Leather Handbag",
      brand: "Fine Leathers",
      location: "Juarez",
      rating: 4.6,
      reviews: 203,
      price: 599,
      oldPrice: 709,
    },
    {
      id: 2,
      image: "/product/p3.jpg",
      name: "Pure Honey",
      brand: "AgroBee Wild",
      location: "Juarez",
      rating: 4.6,
      reviews: 203,
      price: 129,
      oldPrice: 179,
    },
    {
      id: 3,
      image: "/product/p2.jpg",
      name: "Natural Lavender Soap",
      brand: "Natural Cosmetics",
      location: "Juarez",
      rating: 4.6,
      reviews: 203,
      price: 89,
      oldPrice: 139,
    },
  ];

  return (
    <section className="w-full bg-[#F5F5FA] py-8 px-5">
      <div className="max-w-[1300px] mx-auto space-y-6">
        {products.map((item) => (
          <div
            key={item.id}
            className="
              flex items-center gap-6 bg-white rounded-[16px] 
              shadow-[0px_4px_20px_rgba(0,0,0,0.05)]
              p-5 border border-[#F1ECF8]
            "
          >
            {/* PRODUCT IMAGE */}
            <div className="w-[170px] h-[140px] rounded-[12px] overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* PRODUCT DETAILS */}
            <div className="flex-grow">
              {/* Title */}
              <h3 className="text-[17px] font-semibold text-[#1B1B1B] mb-1">
                {item.name}
              </h3>

              {/* Brand */}
              <p className="text-[13px] text-[#A46CFF] mb-[2px]">
                by {item.brand}
              </p>

              {/* Location */}
              <div className="flex items-center gap-2 text-[13px] text-[#6A6A6A] mb-[6px]">
                <MapPin size={15} />
                {item.location}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-[4px] text-[13px] mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={15}
                    fill="#FFA534"
                    stroke="#FFA534"
                    className={i < 5 ? "text-[#FFA534]" : "text-[#E0E0E0]"}
                  />
                ))}
                <span className="text-[#6A6A6A] ml-1">
                  {item.rating} ({item.reviews} review)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-[20px] font-semibold text-[#F78D25]">
                  ${item.price}
                </span>
                <span className="text-[14px] text-[#9B9B9B] line-through">
                  ${item.oldPrice}
                </span>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex items-center gap-3">
              {/* Quick View */}
              <button
                className="
      px-5 h-[36px]
      rounded-[8px]
      text-[13px] font-medium
      text-[#9838E1]
      border border-[#9838E1]
      bg-white
      hover:bg-[#FAF7FF]
      transition
    "
              >
                Quick View
              </button>

              {/* Checkout */}
              <button
                className="
      px-5 h-[36px]
      rounded-[8px]
      text-[13px] font-medium text-white
      bg-gradient-to-r from-[#9838E1] to-[#F68E44]
      shadow-[0px_4px_12px_rgba(0,0,0,0.12)]
    "
              >
                Checkout
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
