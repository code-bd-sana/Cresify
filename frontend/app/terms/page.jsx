"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function TermsPage() {
  const { t } = useTranslation('terms');
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (id) => {
    setOpenSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const termsData = t('sections', { returnObjects: true });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F5FF] to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#9838E1] to-[#F68E44] text-white py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {t('hero.title')}
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            {t('hero.description', { date: formatDate() })}
          </p>
          <p className="mt-4 text-lg opacity-80">
            {t('hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-10 border border-gray-100">
          <div className="flex items-start gap-4">
            <CheckCircle className="text-[#9838E1] flex-shrink-0 mt-1" size={24} />
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {t('important_notice.title')}
              </h2>
              {t('important_notice.content', { returnObjects: true }).map((paragraph, index) => (
                <p key={index} className="text-gray-600 mb-4 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Terms Sections */}
        <div className="space-y-6">
          {Array.isArray(termsData) && termsData.map((section) => (
            <div 
              key={section.id}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:border-[#9838E1]/30 transition-all duration-300"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-8 py-6 flex justify-between items-center text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#9838E1]/10 to-[#F68E44]/10 flex items-center justify-center">
                    <span className="text-[#9838E1] font-bold">
                      {section.title.charAt(0)}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {section.title}
                  </h3>
                </div>
                {openSections[section.id] ? (
                  <ChevronUp className="text-[#9838E1]" size={24} />
                ) : (
                  <ChevronDown className="text-gray-400" size={24} />
                )}
              </button>
              
              {openSections[section.id] && (
                <div className="px-8 pb-6 pt-2 border-t border-gray-100">
                  <ul className="space-y-4">
                    {Array.isArray(section.content) && section.content.map((item, index) => (
                      <li key={index} className="flex gap-3">
                        <div className="w-2 h-2 rounded-full bg-[#9838E1] mt-2 flex-shrink-0"></div>
                        <p className="text-gray-600">{item}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Acceptance Section */}
        <div className="mt-12 bg-gradient-to-r from-[#9838E1]/5 to-[#F68E44]/5 rounded-2xl p-8 border border-[#9838E1]/20">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {t('acceptance.title')}
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700">
                {t('acceptance.continuation_title')}
              </h4>
              <ul className="space-y-2">
                {t('acceptance.acknowledgements', { returnObjects: true }).map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700">
                {t('acceptance.help_title')}
              </h4>
              <p className="text-gray-600">
                {t('acceptance.help_content')}
              </p>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  Email: {t('acceptance.contact.email')}
                </p>
                <p className="text-sm text-gray-600">
                  Phone: {t('acceptance.contact.phone')}
                </p>
                <p className="text-sm text-gray-600">
                  {t('acceptance.contact.business_hours')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </p>
          <p className="text-gray-400 text-xs mt-2">
            {t('footer.note')}
          </p>
        </div>
      </div>
    </div>
  );
}