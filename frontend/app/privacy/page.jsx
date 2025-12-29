"use client";

import { useState } from "react";
import { 
  Shield, 
  Lock, 
  Eye, 
  Users, 
  Globe, 
  Bell,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useTranslation } from "react-i18next";

export default function PrivacyPage() {
  const { t } = useTranslation('privacy');
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

  const privacyData = t('sections', { returnObjects: true });
  const retentionData = t('data_retention.table.rows', { returnObjects: true });
  const tableHeaders = t('data_retention.table.headers', { returnObjects: true });

  const iconComponents = {
    Eye,
    Users,
    Globe,
    Lock,
    Bell,
    Shield
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F7FF] to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#9838E1] to-[#F68E44] text-white py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
              <Shield size={40} />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {t('hero.title')}
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            {t('hero.description')}
          </p>
          <p className="mt-4 text-lg opacity-80">
            {t('hero.date', { date: formatDate() })}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-10 border border-gray-100">
          <div className="flex items-start gap-6">
            <div className="bg-gradient-to-r from-[#9838E1]/10 to-[#F68E44]/10 p-4 rounded-xl">
              <Lock className="text-[#9838E1]" size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {t('introduction.title')}
              </h2>
              {t('introduction.content', { returnObjects: true }).map((paragraph, index) => (
                <p key={index} className="text-gray-600 mb-4 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Privacy Sections */}
        <div className="space-y-6">
          {Array.isArray(privacyData) && privacyData.map((section) => {
            const IconComponent = iconComponents[section.icon];
            
            return (
              <div 
                key={section.id}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300"
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full px-8 py-6 flex justify-between items-center text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-[#9838E1]/10 to-[#F68E44]/10 flex items-center justify-center">
                      {IconComponent && <IconComponent className="text-[#9838E1]" size={20} />}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {section.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {openSections[section.id] ? t('ui.collapse') : t('ui.expand')}
                      </p>
                    </div>
                  </div>
                  {openSections[section.id] ? (
                    <ChevronUp className="text-[#9838E1]" size={24} />
                  ) : (
                    <ChevronDown className="text-gray-400" size={24} />
                  )}
                </button>
                
                {openSections[section.id] && (
                  <div className="px-8 pb-8 pt-4 border-t border-gray-100">
                    <div className="grid md:grid-cols-3 gap-6">
                      {Array.isArray(section.content) && section.content.map((item, index) => (
                        <div key={index} className="bg-gray-50 p-5 rounded-lg">
                          <h4 className="font-semibold text-gray-700 mb-3">
                            {item.title}
                          </h4>
                          <ul className="space-y-2">
                            {Array.isArray(item.items) && item.items.map((point, idx) => (
                              <li key={idx} className="flex gap-2 text-sm text-gray-600">
                                <span className="text-[#9838E1]">•</span>
                                {point}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Data Retention Table */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {t('data_retention.title')}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-[#9838E1]/10 to-[#F68E44]/10">
                  {Array.isArray(tableHeaders) && tableHeaders.map((header, index) => (
                    <th 
                      key={index}
                      className={`text-left p-4 font-semibold text-gray-700 ${
                        index === 0 ? 'rounded-l-lg' : 
                        index === tableHeaders.length - 1 ? 'rounded-r-lg' : ''
                      }`}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.isArray(retentionData) && retentionData.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-700">
                      {item.category}
                    </td>
                    <td className="p-4">
                      <span className="inline-block px-3 py-1 bg-[#9838E1]/10 text-[#9838E1] rounded-full text-sm font-medium">
                        {item.duration}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {item.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Contact & Updates */}
        <div className="mt-8 grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-r from-[#9838E1]/5 to-[#F68E44]/5 rounded-2xl p-8">
            <h4 className="text-xl font-bold text-gray-800 mb-4">
              {t('contact.title')}
            </h4>
            <div className="space-y-3">
              <p className="text-gray-600">
                {t('contact.description')}
              </p>
              <div className="bg-white p-4 rounded-lg">
                <p className="font-medium text-gray-700">{t('contact.dpo')}</p>
                <p className="text-sm text-gray-600">Email: {t('contact.email')}</p>
                <p className="text-sm text-gray-600">Phone: {t('contact.phone')}</p>
                <p className="text-sm text-gray-600">Address: {t('contact.address')}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-[#9838E1]/5 to-[#F68E44]/5 rounded-2xl p-8">
            <h4 className="text-xl font-bold text-gray-800 mb-4">
              {t('updates.title')}
            </h4>
            <p className="text-gray-600 mb-4">
              {t('updates.description')}
            </p>
            <ul className="space-y-2">
              {t('updates.points', { returnObjects: true }).map((point, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#9838E1]"></div>
                  <span className="text-sm text-gray-600">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
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