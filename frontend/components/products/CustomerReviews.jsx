"use client";

import { Star } from "lucide-react";

export default function CustomerReviews() {
  const reviews = [
    {
      id: 1,
      user: "Dianne Russell",
      product: "USB-C Hub 7-in-1",
      message:
        "Exactly what I needed. All ports work perfectly and it’s very compact.",
      avatar: "/user.png",
      rating: 5,
      date: "2025-06-16",
    },
    {
      id: 2,
      user: "Dianne Russell",
      product: "USB-C Hub 7-in-1",
      message:
        "Exactly what I needed. All ports work perfectly and it’s very compact.",
      avatar: "/user2.png",
      rating: 5,
      date: "2025-06-16",
    },
  ];

  return (
    <section className="w-full bg-[#F7F7FA] py-10 px-6">
      <div className="max-w-[1300px] mx-auto">

        {/* TITLE */}
        <h2 className="text-[20px] font-semibold text-[#1B1B1B] mb-5">
          Customer Reviews
        </h2>

        <div className="space-y-5">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="
                bg-white rounded-[14px]
                border border-[#ECE6F7]
                shadow-[0px_3px_15px_rgba(0,0,0,0.05)]
                px-5 py-5
                flex flex-col
              "
            >
              {/* TOP ROW */}
              <div className="flex items-center justify-between w-full">

                {/* LEFT USER INFO */}
                <div className="flex items-center gap-3">
                  <img
                    src={r.avatar}
                    alt={r.user}
                    className="w-[38px] h-[38px] rounded-full object-cover"
                  />

                  <div>
                    <p className="text-[15px] font-medium text-[#1B1B1B]">
                      {r.user}
                    </p>
                    <p className="text-[13px] text-[#A46CFF] font-medium leading-[15px]">
                      {r.product}
                    </p>
                  </div>
                </div>

                {/* RIGHT RATING */}
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-[2px]">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className="text-[#FFA534] fill-[#FFA534]"
                      />
                    ))}
                  </div>

                  <p className="text-[12px] text-[#A46CFF] mt-[1px]">{r.date}</p>
                </div>
              </div>

              {/* REVIEW TEXT */}
              <p className="text-[14px] text-[#4B4B4B] mt-4 leading-[21px]">
                {r.message}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
