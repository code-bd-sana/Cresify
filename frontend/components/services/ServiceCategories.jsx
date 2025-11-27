"use client";

import {
  LayoutGrid,
  Wrench,
  Zap,
  Leaf,
  Paintbrush,
  PawPrint,
} from "lucide-react";

export default function ServiceCategories() {
  const categories = [
    {
      icon: LayoutGrid,
      title: "All Services",
      providers: "See All",
    },
    {
      icon: Wrench,
      title: "Plumbing",
      providers: "48 Providers",
    },
    {
      icon: Zap,
      title: "Electrical",
      providers: "48 Providers",
    },
    {
      icon: Leaf,
      title: "Gardening",
      providers: "48 Providers",
    },
    {
      icon: Paintbrush,
      title: "Painting",
      providers: "48 Providers",
    },
    {
      icon: PawPrint,
      title: "Pet Care",
      providers: "48 Providers",
    },
  ];

  return (
    <section className="w-full py-16 bg-[#F5F5F7]">
      <div className="max-w-[1300px] mx-auto px-6 text-center">
        {/* Heading */}
        <h2 className="text-[36px] font-bold text-[#1A1A1A]">
          Service Categories
        </h2>
        <p className="text-[14px] font-bold mt-2 text-[#9A5BFF]">
          Choose from our wide range of professional services
        </p>

        {/* Category Cards */}
        <div className="mt-10 flex flex-wrap justify-center gap-6">
          {categories.map((cat, index) => {
            const Icon = cat.icon;
            const isActive = index === 0;

            return (
              <div
                key={index}
                className={`w-[165px] h-[185px] rounded-[22px] bg-white shadow-[0_8px_28px_rgba(0,0,0,0.06)]
                flex flex-col items-center justify-center cursor-pointer transition relative
               `}
              >
                <div
                  className={`w-full h-full rounded-[20px] bg-white flex flex-col items-center justify-center`}
                >
                  {/* ICON WRAPPER */}
                  <div
                    className="w-[72px] h-[72px] rounded-2xl flex items-center justify-center
                     bg-gradient-to-r from-[#9838E1] to-[#F68E44]
                    shadow-[0_8px_18px_rgba(137,56,194,0.10)]"
                  >
                    <Icon className="w-[28px] h-[28px] text-white" />
                  </div>

                  {/* Title */}
                  <p className="mt-3 text-[15px] font-semibold text-[#1A1A1A]">
                    {cat.title}
                  </p>

                  {/* Providers */}
                  <p className="text-[12px] font-bold text-[#9A5BFF] mt-[3px]">
                    {cat.providers}
                  </p>
                </div>

                {/* SVG GRADIENT FOR ICON */}
                <svg width="0" height="0">
                  <defs>
                    <linearGradient id="gradIcon" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#8938C2" />
                      <stop offset="100%" stopColor="#F18A30" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
