"use client";

import { useTranslation } from "react-i18next";

export default function AboutCresify() {
  const {t} = useTranslation('about');
  return (
    <section className="w-full py-20 bg-[#F5F5F7]">
      <div className="max-w-[900px] mx-auto text-center px-4">
        
        {/* Title */}
        <h2 className="text-[32px] font-bold text-[#1B1B1B] mb-3">
         {t('title')}
        </h2>

        {/* Subtitle */}
        <p className="
          text-[15px] leading-[22px] 
          text-[#A46CFF] font-medium max-w-[600px] mx-auto
        ">
          {t('subtitle')}
        </p>

      </div>
    </section>
  );
}
