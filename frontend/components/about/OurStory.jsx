"use client";

import { useTranslation } from "react-i18next";

export default function OurStory() {
  const { t } = useTranslation('ourStory');
  
  return (
    <section className="w-full bg-[#F7F7FA] py-20 px-6">
      <div className="max-w-[1300px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* IMAGE */}
        <div className="w-full">
          <img
            src="/about/about.jpg" 
            alt="Our Story"
            className="w-full h-[380px] object-cover rounded-[20px] shadow-lg"
          />
        </div>

        {/* TEXT BLOCK */}
        <div className="max-w-[540px]">

          {/* Title */}
          <h2 className="text-[32px] font-bold text-[#1B1B1B] mb-6">
            {t('title')}
          </h2>

          {/* Paragraph 1 */}
          <p className="text-[15px] font-medium text-[#4A4A4A] leading-[22px] mb-4">
            {t('paragraphs.p1').split(t('highlighted_texts.h1'))[0]}
            <span className="text-[#A46CFF] font-semibold">
              {t('highlighted_texts.h1')}
            </span>
            {t('paragraphs.p1').split(t('highlighted_texts.h1'))[1]}
          </p>

          {/* Paragraph 2 */}
          <p className="text-[15px] text-[#4A4A4A] leading-[22px] mb-4">
            {t('paragraphs.p2').split(t('highlighted_texts.h2'))[0]}
            <span className="text-[#A46CFF] font-semibold">
              {t('highlighted_texts.h2')}
            </span>
            {t('paragraphs.p2').split(t('highlighted_texts.h2'))[1]}
          </p>

          {/* Paragraph 3 */}
          <p className="text-[15px] text-[#4A4A4A] leading-[22px]">
            {t('paragraphs.p3').split(t('highlighted_texts.h3'))[0]}
            <span className="text-[#A46CFF] font-semibold">
              {t('highlighted_texts.h3')}
            </span>
            {t('paragraphs.p3').split(t('highlighted_texts.h3'))[1]?.split(t('highlighted_texts.h4'))[0]}
            <span className="text-[#A46CFF] font-semibold">
              {t('highlighted_texts.h4')}
            </span>
            {t('paragraphs.p3').split(t('highlighted_texts.h4'))[1]}
          </p>

        </div>
      </div>
    </section>
  );
}