"use client";

import { useState } from "react";
import { MapPin, Star, Heart, Store, MessageCircle } from "lucide-react";

export default function ProductDetails() {
  const images = [
    "/product/bag.jpg",
    "/product/bag.jpg",
    "/product/bag.jpg",
    "/product/bag.jpg",
  ];

  const [selectedImg, setSelectedImg] = useState(images[0]);
  const [qty, setQty] = useState(1);

  return (
    <section className="w-full bg-[#F7F7FA] py-10 px-6">
      <div className="max-w-[1300px] mx-auto">
        {/* PAGE TITLE */}
        <h2 className="text-[20px] font-semibold text-[#1B1B1B] mb-6">
          Product Details
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* LEFT SIDE */}
          <div>
            {/* MAIN IMAGE (smaller now) */}
            <div className="w-full h-[300px] bg-white rounded-[14px] overflow-hidden shadow-sm">
              <img
                src={selectedImg}
                className="w-full h-full object-cover"
                alt="product"
              />
            </div>

            {/* THUMBNAILS */}
            <div className="flex gap-3 mt-5">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImg(img)}
                  className={`w-[58px] h-[58px] rounded-[10px] overflow-hidden 
                   shadow-sm`}
                >
                  <img
                    src={img}
                    className="w-full h-full object-cover"
                    alt="thumbnail"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE (taller + more spacing) */}
          <div className="pr-4 pt-2">
            {/* TITLE */}
            <h3 className="text-[26px] font-semibold text-[#1B1B1B] leading-tight mb-1">
              Genuine Leather Hangbag
            </h3>

            {/* SELLER */}
            <p className="text-[14px] text-[#A46CFF] font-medium mb-4">
              by Fine Leathers
            </p>

            {/* LOCATION + RATING */}
            <div className="flex items-center gap-6 mb-4">
              <div className="flex items-center gap-2 text-[14px] text-[#6D6D6D]">
                <MapPin size={16} />
                Monterrey
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 text-[14px] text-[#6D6D6D]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < 4 ? "text-[#FFA534] fill-[#FFA534]" : "text-[#E0E0E0]"
                    }
                  />
                ))}
                <span className="ml-1 text-[#6B6B6B]">4.6 (203 review)</span>
              </div>
            </div>

            {/* PRICE */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[26px] font-semibold text-[#F78D25]">
                $599
              </span>
              <span className="text-[16px] text-[#B0B0B0] line-through">
                $709
              </span>
            </div>

            {/* Description */}
            <h4 className="text-[15px] font-semibold text-[#1B1B1B] mb-2">
              Description
            </h4>

            <p className="text-[14px] leading-[21px] text-[#6B6B6B] mb-7 max-w-[500px]">
              This handcrafted product is carefully made by local entrepreneurs
              using high-quality materials. Each piece is unique and reflects
              the passion and dedication of our artisans. Perfect for those
              seeking authentic products of exceptional quality.
            </p>

            {/* Amount Section */}
            <div className="flex items-center gap-3 mb-8">
              <span className="text-[14px] text-[#1B1B1B] font-medium">
                Amount:
              </span>

              <div className="flex items-center border border-[#D8D2E9] rounded-[8px]">
                <button
                  onClick={() => qty > 1 && setQty(qty - 1)}
                  className="px-3 py-[6px] text-[16px] text-[#6B6B6B]"
                >
                  -
                </button>
                <span className="px-4 py-[6px] border-l border-r border-[#D8D2E9]">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="px-3 py-[6px] text-[16px] text-[#6B6B6B]"
                >
                  +
                </button>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex items-center gap-4 mb-10">
              {/* Add to Cart */}
              <button
                className="
                flex-1 py-[12px] rounded-[10px]
                text-white text-[15px] font-medium
                bg-gradient-to-r from-[#9838E1] to-[#F68E44]
                shadow-[0_4px_14px_rgba(0,0,0,0.12)]
                "
              >
                Add to cart
              </button>

              {/* Wishlist */}
              <button className="w-[44px] h-[44px] rounded-[10px] border border-[#D9D3E8] flex items-center justify-center">
                <Heart size={19} className="text-[#A46CFF]" />
              </button>

              {/* Bag */}
              <button className="w-[44px] h-[44px] rounded-[10px] border border-[#D9D3E8] flex items-center justify-center">
                <MessageCircle size={19} className="text-[#A46CFF]" />
              </button>
            </div>

            {/* Visit Store */}
            <div className="flex items-center gap-2 text-[14px] text-[#A46CFF] cursor-pointer">
              <Store size={17} />
              <span>Visit Fine Leather Goods Store</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
