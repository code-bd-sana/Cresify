"use client";

import Image from "next/image";
import Link from "next/link";
import { LuStore, LuUsers } from "react-icons/lu";
import { useTranslation } from "react-i18next";

export default function AboutCresify() {
  const { t } = useTranslation('about');
  
  return (
    <section className="w-full py-24 px-10 bg-[#F8F7FB]">
      <div className="max-w-[1350px] mx-auto flex flex-col lg:flex-row items-center gap-16">
        {/* LEFT — IMAGE */}
        <div className="flex-1 h-full">
          <div className="rounded-[20px] overflow-hidden shadow-[0px_4px_18px_rgba(0,0,0,0.12)]">
            <Image
              src="/about/about.jpg"
              width={600}
              height={450}
              alt="Team"
              className="w-full h-[500px] object-cover"
            />
          </div>
        </div>

        {/* RIGHT — TEXT CONTENT */}
        <div className="flex-1">
          {/* Heading */}
          <h2 className="text-[36px] font-bold mb-4">{t('title')}</h2>

          {/* Description */}
          <p className="text-[15px] text-[#000000] leading-[24px] max-w-[550px] mb-6">
            {t('description1')}
          </p>

          <p className="text-[15px] text-[#000000] leading-[24px] max-w-[550px] mb-10">
            {t('description2')}
          </p>

          {/* Stats Row */}
          <div className="flex items-center gap-6 mb-10">
            {/* Card 1 - Active Sellers */}
            <div className="bg-white rounded-[16px] shadow-[0px_4px_18px_rgba(0,0,0,0.10)] p-6 w-[160px]">
              <div
                className="w-[48px] h-[48px] rounded-[12px] 
                bg-gradient-to-br from-[#9838E1] to-[#F68E44]
                flex items-center justify-center mb-3"
              >
                <LuStore size={24} color="white" />
              </div>
              <h3 className="text-[20px] font-semibold text-[#1E1E1E] mb-1">
                10,000+
              </h3>
              <p className="text-[13px] text-[#7A5FA6]">
                {t('stats.active_sellers')}
              </p>
            </div>

            {/* Card 2 - Happy Customers */}
            <div className="bg-white rounded-[16px] shadow-[0px_4px_18px_rgba(0,0,0,0.10)] p-6 w-[160px]">
              <div
                className="w-[48px] h-[48px] rounded-[12px] 
                bg-gradient-to-br from-[#9838E1] to-[#F68E44]
                flex items-center justify-center mb-3"
              >
                <LuUsers size={24} color="white" />
              </div>
              <h3 className="text-[20px] font-semibold text-[#1E1E1E] mb-1">
                50,000+
              </h3>
              <p className="text-[13px] text-[#7A5FA6]">
                {t('stats.happy_customers')}
              </p>
            </div>
          </div>

          {/* Button */}
          <Link href="/about">
            <button
              className="
              px-8 py-[12px] cursor-pointer rounded-[10px] text-white text-[15px] font-medium
              bg-gradient-to-r from-[#9838E1] to-[#F68E44]
              shadow-[0px_4px_14px_rgba(0,0,0,0.15)]
              hover:from-[#8a2dc8] hover:to-[#e57f3a] transition-all
              hover:shadow-[0px_6px_20px_rgba(152,56,225,0.3)]
              "
            >
              {t('button')}
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}