"use client";

import Image from "next/image";
import { IoArrowForwardOutline } from "react-icons/io5";

export default function BlogSection() {
  const posts = [
    {
      tag: "Tips & Guides",
      title: "10 Tips for Finding the Best Local Services",
      desc: "Discover how to choose the right service provider for your needs with our expert guide…",
      img: "/blog/blog1.jpg",
      date: "March 15, 2024",
      read: "5 min read",
    },
    {
      tag: "Community",
      title: "Supporting Local Businesses: Why It Matters",
      desc: "Learn about the impact of shopping local and how it benefits your community…",
      img: "/blog/blog2.jpg",
      date: "March 12, 2024",
      read: "4 min read",
    },
    {
      tag: "Shopping",
      title: "How to Get the Most Out of Online Marketplaces",
      desc: "Maximize your shopping experience with these proven strategies and insider tips…",
      img: "/blog/blog3.jpg",
      date: "March 10, 2024",
      read: "6 min read",
    },
  ];

  return (
    <section className="w-full py-20 px-10">
      <div className="max-w-[1350px] mx-auto">

        {/* Heading */}
        <h2 className="text-[36px] font-bold text-center mb-2">
          Latest from Our Blog
        </h2>

        {/* Subheading */}
        <p className="text-center font-bold text-[#AC65EE] text-[15px] mb-14">
          Stay updated with tips, guides, and stories from our community
        </p>

        {/* Blog Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {posts.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-[18px] shadow-[0px_4px_18px_rgba(0,0,0,0.12)] 
              hover:shadow-[0px_6px_22px_rgba(0,0,0,0.15)] transition p-4"
            >

              {/* Image */}
              <div className="rounded-[16px] overflow-hidden mb-4">
                <Image
                  src={item.img}
                  width={400}
                  height={260}
                  alt="blog"
                  className="w-full h-[220px] object-cover"
                />
              </div>

              {/* Tag & Read Time */}
              <div className="flex justify-between items-center text-[13px] text-[#7A5FA6] font-medium mb-2 px-1">
                <span>{item.tag}</span>
                <span className="text-[#6D6D6D]">{item.read}</span>
              </div>

              {/* Title */}
              <h3 className="text-[16px] font-semibold text-[#1E1E1E] leading-[22px] mb-2 px-1">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-[14px] text-[#6D6D6D] leading-[22px] mb-4 px-1">
                {item.desc}
              </p>

              {/* Date + Read More */}
              <div className="flex justify-between items-center text-[13px] px-1">
                <span className="text-[#6D6D6D]">{item.date}</span>

                <button className="flex items-center gap-1 text-[#F68E44] font-semibold hover:underline">
                  Read More <IoArrowForwardOutline className="text-[16px]" />
                </button>
              </div>
            </div>
          ))}

        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-14">
          <button className="
            px-8 py-[12px] rounded-[10px] text-white text-[15px] font-medium
            bg-gradient-to-r from-[#9838E1] to-[#F68E44]
            shadow-[0px_4px_16px_rgba(0,0,0,0.15)]
          ">
            View All Posts
          </button>
        </div>

      </div>
    </section>
  );
}
