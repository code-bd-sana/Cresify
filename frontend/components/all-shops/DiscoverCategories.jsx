"use client";

import {
  LuGrid2X2,
  LuShirt,
  LuCupSoda,
  LuMonitor,
  LuPaintbrush,
  LuDumbbell,
} from "react-icons/lu";

export default function DiscoverCategories() {
  const categories = [
    {
      title: "All Categories",
      icon: LuGrid2X2,
      circleBg: "#FFF2E5",
      iconColor: "#F78D25", // orange
    },
    {
      title: "Fashion",
      icon: LuShirt,
      circleBg: "#F5ECFF",
      iconColor: "#A46CFF", // purple
    },
    {
      title: "Food and Drinks",
      icon: LuCupSoda,
      circleBg: "#FFF2E5",
      iconColor: "#F78D25",
    },
    {
      title: "Technology",
      icon: LuMonitor,
      circleBg: "#F5ECFF",
      iconColor: "#A46CFF",
    },
    {
      title: "Painting",
      icon: LuPaintbrush,
      circleBg: "#FFF2E5",
      iconColor: "#F78D25",
    },
    {
      title: "Sports",
      icon: LuDumbbell,
      circleBg: "#F5ECFF",
      iconColor: "#A46CFF",
    },
  ];

  return (
    <section className="w-full py-14 bg-white">
      <div className="max-w-[1250px] mx-auto px-6 text-center">
        {/* Heading */}
        <h2 className="text-[32px] font-bold mb-2 text-[#1B1B1B]">
          Discover Categories
        </h2>

        {/* Subtitle */}
        <p className="text-[15px] text-[#A46CFF] mb-10 font-medium">
          Find what you need among hundreds of business.
        </p>

        {/* Categories row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-12">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center text-center"
              >
                {/* Icon circle */}
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{
                    width: 64,
                    height: 64,
                    backgroundColor: cat.circleBg,
                  }}
                >
                  <Icon
                    className="text-[26px]"
                    style={{ color: cat.iconColor }}
                  />
                </div>

                {/* Label */}
                <p className="mt-3 text-[14px] text-[#333333] font-medium">
                  {cat.title}
                </p>

                {/* Gradient underline */}
                <div
                  className="
                    mt-3 h-[3px] rounded-full
                    bg-[linear-gradient(90deg,#9838E1,#F68E44)]
                  "
                  style={{ width: 96 }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
