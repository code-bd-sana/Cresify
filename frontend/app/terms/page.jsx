"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function TermsPage() {
  const { t } = useTranslation("terms");
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (id) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const formatDate = () => {
    return new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // SAFER: Ensure termsData is always an array
  const termsData = Array.isArray(t("sections", { returnObjects: true }))
    ? t("sections", { returnObjects: true })
    : [];

  return (
    <div className='min-h-screen bg-gradient-to-b from-[#F8F5FF] to-white'>
      {/* Hero Section */}
      <section className='bg-gradient-to-r from-[#9838E1] to-[#F68E44] text-white py-16 px-6'>
        <div className='max-w-6xl mx-auto text-center'>
          <h1 className='text-4xl md:text-5xl font-bold mb-6'>
            {t("hero.title", "Terms & Conditions")}
          </h1>
          <p className='text-xl opacity-90 max-w-3xl mx-auto'>
            {t("hero.description", { date: formatDate() })}
          </p>
          <p className='mt-4 text-lg opacity-80'>
            {t(
              "hero.subtitle",
              "Please read these terms carefully before using our platform"
            )}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className='max-w-6xl mx-auto px-6 py-12'>
        {/* Introduction */}
        <div className='bg-white rounded-2xl shadow-lg p-8 mb-10 border border-gray-100'>
          <div className='flex items-start gap-4'>
            <CheckCircle
              className='text-[#9838E1] flex-shrink-0 mt-1'
              size={24}
            />
            <div>
              <h2 className='text-2xl font-bold text-gray-800 mb-4'>
                {t("important_notice.title", "Important Notice")}
              </h2>
              {(Array.isArray(
                t("important_notice.content", { returnObjects: true })
              )
                ? t("important_notice.content", { returnObjects: true })
                : []
              ).map((paragraph, index) => (
                <p key={index} className='text-gray-600 mb-4 last:mb-0'>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Terms Sections */}
        <div className='space-y-6'>
          {termsData.map((section) => (
            <div
              key={section.id}
              className='bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:border-[#9838E1]/30 transition-all duration-300'>
              <button
                onClick={() => toggleSection(section.id)}
                className='w-full px-8 py-6 flex justify-between items-center text-left hover:bg-gray-50 transition-colors'>
                <div className='flex items-center gap-4'>
                  <div className='w-10 h-10 rounded-full bg-gradient-to-r from-[#9838E1]/10 to-[#F68E44]/10 flex items-center justify-center'>
                    <span className='text-[#9838E1] font-bold'>
                      {section.title ? section.title.charAt(0) : "T"}
                    </span>
                  </div>
                  <h3 className='text-xl font-semibold text-gray-800'>
                    {section.title || "Terms Section"}
                  </h3>
                </div>
                {openSections[section.id] ? (
                  <ChevronUp className='text-[#9838E1]' size={24} />
                ) : (
                  <ChevronDown className='text-gray-400' size={24} />
                )}
              </button>

              {openSections[section.id] && (
                <div className='px-8 pb-6 pt-2 border-t border-gray-100'>
                  <ul className='space-y-4'>
                    {(Array.isArray(section.content)
                      ? section.content
                      : []
                    ).map((item, index) => (
                      <li key={index} className='flex gap-3'>
                        <div className='w-2 h-2 rounded-full bg-[#9838E1] mt-2 flex-shrink-0'></div>
                        <p className='text-gray-600'>{item}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* More safe rendering code... */}
      </div>
    </div>
  );
}
