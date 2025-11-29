"use client";
import Link from "next/link";
import { AiFillStar } from "react-icons/ai";

export default function AllShops() {
  const stores = [
    {
      id: 1,
      logo: "/product/p1.jpg",
      title: "Luna Jewelry",
      subtitle: "Handmade Jewelry",
      rating: 4.9,
      products: 45,
      location: "2464 Royal Ln.",
    },
    {
      id: 2,
      logo: "/product/p2.jpg",
      title: "Mountain coffee",
      subtitle: "Technology",
      rating: 4.9,
      products: 12,
      location: "3517 W. Gray St.",
    },
    {
      id: 3,
      logo: "/product/p3.jpg",
      title: "Fine Leather",
      subtitle: "Food and Drinks",
      rating: 4.9,
      products: 64,
      location: "Delaware 10299",
    },
    {
      id: 4,
      logo: "/product/p4.jpg",
      title: "Luna Jewelry",
      subtitle: "Fashion",
      rating: 4.9,
      products: 45,
      location: "6391 Elgin St.",
    },

    // ROW 2
    {
      id: 5,
      logo: "/product/p1.jpg",
      title: "Luna Jewelry",
      subtitle: "Sports",
      rating: 4.9,
      products: 45,
      location: "2511 Ranchview",
    },
    {
      id: 6,
      logo: "/product/p2.jpg",
      title: "Mountain coffee",
      subtitle: "Technology",
      rating: 4.9,
      products: 12,
      location: "3517 W. Gray St.",
    },
    {
      id: 7,
      logo: "/product/p3.jpg",
      title: "Fine Leather",
      subtitle: "Food and Drinks",
      rating: 4.9,
      products: 64,
      location: "Delaware 10299",
    },
    {
      id: 8,
      logo: "/product/p4.jpg",
      title: "Luna Jewelry",
      subtitle: "Fashion",
      rating: 4.9,
      products: 45,
      location: "6391 Elgin St.",
    },

    // ROW 3
    {
      id: 9,
      logo: "/product/p1.jpg",
      title: "Luna Jewelry",
      subtitle: "Sports",
      rating: 4.9,
      products: 45,
      location: "2511 Ranchview",
    },
    {
      id: 10,
      logo: "/product/p2.jpg",
      title: "Mountain coffee",
      subtitle: "Technology",
      rating: 4.9,
      products: 12,
      location: "3517 W. Gray St.",
    },
    {
      id: 11,
      logo: "/product/p3.jpg",
      title: "Fine Leather",
      subtitle: "Food and Drinks",
      rating: 4.9,
      products: 64,
      location: "Delaware 10299",
    },
    {
      id: 12,
      logo: "/product/p4.jpg",
      title: "Luna Jewelry",
      subtitle: "Fashion",
      rating: 4.9,
      products: 45,
      location: "6391 Elgin St.",
    },
  ];

  return (
    <section className="w-full py-12 bg-[#F7F7FA]">
      <div className="max-w-[1300px] mx-auto px-6">
        {/* Heading */}
        <h2 className="text-[30px] font-bold mb-8">All Shops</h2>

        {/* Grid */}
        <Link href="/store">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {stores.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-[14px] border border-[#EDE9F7]
              shadow-[0_4px_18px_rgba(0,0,0,0.06)] p-5"
              >
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={s.logo}
                    alt={s.title}
                    className="w-[46px] h-[46px] rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-[15px] font-semibold text-[#1B1B1B]">
                      {s.title}
                    </h3>
                    <p className="text-[13px] text-[#7A5FA6]">{s.subtitle}</p>
                  </div>
                </div>

                {/* Qualification */}
                <p className="text-[14px] text-[#333] flex items-center gap-1 mb-1">
                  Qualification:
                  <AiFillStar className="text-[#FFA534] text-[15px]" />
                  <span className="font-semibold">{s.rating}</span>
                </p>

                {/* Products */}
                <p className="text-[14px] text-[#333] mb-1">
                  Products: <span className="font-semibold">{s.products}</span>
                </p>

                {/* Location */}
                <p className="text-[14px] text-[#333] mb-4">
                  Location: <span className="text-[#555]">{s.location}</span>
                </p>

                {/* Button */}
                <button
                  className="w-full py-[10px] rounded-[10px]
                text-[14px] font-medium text-white
                bg-[linear-gradient(90deg,#9838E1,#F68E44)]
                shadow-[0_3px_10px_rgba(0,0,0,0.12)]"
                >
                  Visit Store
                </button>
              </div>
            ))}
          </div>
        </Link>
      </div>
    </section>
  );
}
