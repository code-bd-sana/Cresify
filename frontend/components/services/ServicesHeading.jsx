"use client";

import { useTranslation } from "react-i18next";

export default function ServiceHeading() {
  const { t } = useTranslation('serviceHeading');
  
  return (
    <section className="w-full py-28">
      <div className="max-w-[950px] mx-auto text-center px-4">
        {/* Title */}
        <h2 className="text-[28px] md:text-[32px] font-semibold text-[#1B1B1B] mb-3">
          {t('title')}
        </h2>

        {/* Subtitle */}
        <p className="text-[14px] md:text-[15px] leading-[20px] text-[#A46CFF] font-medium">
          {t('subtitle_line1')}
          <br />
          {t('subtitle_line2')}
        </p>

        {/* Additional Content */}
    
      </div>
    </section>
  );
}