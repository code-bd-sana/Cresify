"use client";

import Image from "next/image";
import { FaArrowRight } from "react-icons/fa";

const articles = [
  {
    id: 1,
    category: "Tips & Guides",
    categoryColor: "#7C3AED",
    title: "10 Tips for Finding the Best Local Services",
    description:
      "Discover how to choose the right service provider for your needs with our beginner guide...",
    date: "March 15, 2024",
    image: "/blog/blog1.jpg",
  },
  {
    id: 2,
    category: "Community",
    categoryColor: "#EC4899",
    title: "Supporting Local Businesses: Why It Matters",
    description:
      "Learn about the impact of shopping local and how it benefits your community...",
    date: "March 12, 2024",
    image: "/blog/blog2.jpg",
  },
  {
    id: 3,
    category: "Shopping",
    categoryColor: "#3B82F6",
    title: "How to Get the Most Out of Online Marketplaces",
    description:
      "Maximize your shopping experience with these proven strategies and insider tips...",
    date: "March 10, 2024",
    image: "/blog/blog3.jpg",
  },
  {
    id: 4,
    category: "Home & Living",
    categoryColor: "#F97316",
    title: "Home Maintenance: Essential Services Every Year",
    description:
      "A comprehensive guide to maintaining your home throughout the year...",
    date: "March 15, 2024",
    image: "/blog/blog2.jpg",
  },
  {
    id: 5,
    category: "Sustainability",
    categoryColor: "#22C55E",
    title: "The Rise of Eco-Friendly Products in Latin",
    description:
      "Explore the growing trend of sustainable and eco-friendly products...",
    date: "March 12, 2024",
    image: "/blog/blog3.jpg",
  },
  {
    id: 6,
    category: "Technology",
    categoryColor: "#6366F1",
    title: "How to Get the Most Out of Online Marketplaces",
    description:
      "Understand the latest payment technologies and how they benefit both consumers and sellers...",
    date: "March 10, 2024",
    image: "/blog/blog1.jpg",
  },
  {
    id: 7,
    category: "Safety & Security",
    categoryColor: "#0EA5E9",
    title: "Seasonal Services: What You Need and When",
    description:
      "A seasonal guide to services that will keep your home and family safe...",
    date: "March 15, 2024",
    image: "/blog/blog2.jpg",
  },
  {
    id: 8,
    category: "Planning",
    categoryColor: "#3B82F6",
    title: "Building Trust in Online Marketplaces",
    description:
      "Learn how platforms ensure safety and trust between buyers and sellers...",
    date: "March 12, 2024",
    image: "/blog/blog3.jpg",
  },
  {
    id: 9,
    category: "Community",
    categoryColor: "#EC4899",
    title: "Customer Reviews: How to Write Helpful",
    description:
      "Make your voice heard with reviews that help others make informed decisions...",
    date: "March 10, 2024",
    image: "/blog/blog3.jpg",
  },
];

export default function LatestArticles() {
  return (
    <div className="bg-[#F5F5F7] pt-1 pb-10">
      <div className=" max-w-7xl mx-auto mt-16">
        <h2 className="text-center text-3xl font-bold mb-8 text-gray-800">
          Latest Articles
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-[20px] overflow-hidden p-4 border border-[#EAEAEA] hover:shadow-md transition"
            >
              {/* Image */}
              <div className="relative w-full h-60">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover rounded-xl"
                />
              </div>

              {/* Content */}
              <div className="py-4">
                <p
                  className="text-[14px] text-[#AC65EE] font-medium mb-1"
                  style={{ color: item.categoryColor }}
                >
                  {item.category}
                </p>

                <h3 className="text-base font-bold text-gray-900 leading-snug">
                  {item.title}
                </h3>

                <p className="mt-2 text-[14px] leading-relaxed line-clamp-2">
                  {item.description}
                </p>

                <div className="mt-3 flex items-center justify-between text-[14px]">
                  <p className="text-gray-500">{item.date}</p>
                  <button className=" font-medium text-[#F88D25] hover:underline flex items-center gap-1">
                    Read More <FaArrowRight />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
