"use client";

import { Mail, Phone, X, Instagram, Facebook, MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ContactSection() {
  const { t } = useTranslation('contact');
  
  return (
    <section className="w-full bg-[#F7F7FA] py-14 px-6">
      <div className="max-w-[1350px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">

        {/* LEFT FORM CARD WITH GRADIENT BORDER */}
        <div className="p-[2px] rounded-[14px] bg-gradient-to-r from-[#9838E1] to-[#F68E44]">
          <div
            className="
              bg-white rounded-[12px] 
              shadow-[0px_4px_20px_rgba(0,0,0,0.06)]
              p-6
            "
          >
            <h3 className="text-[17px] font-semibold text-[#1B1B1B] mb-5">
              {t('sendMessage')}
            </h3>

            <div className="space-y-4">

              {/* Full Name */}
              <div>
                <label className="text-[13px] text-[#5A5A5A]">{t('fullName')}</label>
                <input
                  type="text"
                  placeholder={t('fullNamePlaceholder')}
                  className="
                    w-full mt-1 px-3 py-[10px] text-[14px]
                    border border-[#E3E1ED] rounded-[8px]
                    placeholder:text-[#A0A0A0] outline-none
                    focus:border-[#9838E1]
                  "
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-[13px] text-[#5A5A5A]">{t('emailAddress')}</label>
                <input
                  type="email"
                  placeholder={t('emailPlaceholder')}
                  className="
                    w-full mt-1 px-3 py-[10px] text-[14px]
                    border border-[#E3E1ED] rounded-[8px]
                    placeholder:text-[#A0A0A0] outline-none
                    focus:border-[#9838E1]
                  "
                />
              </div>

              {/* Subject Dropdown */}
              <div>
                <label className="text-[13px] text-[#5A5A5A]">{t('subject')}</label>
                <select
                  className="
                    w-full mt-1 px-3 py-[10px] text-[14px]
                    border border-[#E3E1ED] rounded-[8px] outline-none
                    text-[#4A4A4A]
                  "
                >
                  <option>{t('selectSubject')}</option>
                  <option>General Inquiry</option>
                  <option>Support</option>
                  <option>Business</option>
                </select>
              </div>

              {/* Message Box */}
              <div>
                <label className="text-[13px] text-[#5A5A5A]">{t('subject')}</label>
                <textarea
                  className="
                    w-full mt-1 px-3 py-[10px] text-[14px] min-h-[120px]
                    border border-[#E3E1ED] rounded-[8px]
                    placeholder:text-[#A0A0A0] outline-none
                    resize-none focus:border-[#9838E1]
                  "
                  placeholder={t('writeMessage')}
                ></textarea>

                <p className="text-[12px] text-[#A0A0A0] mt-1">0/300 {t('characters')}</p>
              </div>

              {/* SEND BUTTON */}
              <button
                className="
                  w-full mt-2 py-[12px] rounded-[10px]
                  text-white text-[15px] font-medium
                  bg-gradient-to-r from-[#9838E1] to-[#F68E44]
                  shadow-[0_4px_14px_rgba(0,0,0,0.15)]
                "
              >
                {t('sendButton')}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-6">

          {/* Contact Information Card */}
          <div className="bg-white rounded-[14px] border border-[#ECE6F7] shadow-[0px_4px_18px_rgba(0,0,0,0.06)] p-5">
            <h4 className="text-[15px] font-semibold text-[#1B1B1B] mb-4">
              {t('contactInformation')}
            </h4>

            <div className="space-y-4">

              {/* Email */}
              <div className="flex items-center gap-3">
                <div className="w-[40px] h-[40px] rounded-[10px]
                  flex items-center justify-center
                  bg-gradient-to-r from-[#9838E1] to-[#F68E44]">
                  <Mail className="text-white" size={18} />
                </div>
                <div>
                  <p className="text-[13px] text-[#5A5A5A]">{t('email')}</p>
                  <p className="text-[13px] text-[#9838E1] font-medium">
                    curtis.warren@example.com
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3">
                <div className="w-[40px] h-[40px] rounded-[10px]
                  flex items-center justify-center
                  bg-gradient-to-r from-[#9838E1] to-[#F68E44]">
                  <Phone className="text-white" size={18} />
                </div>
                <div>
                  <p className="text-[13px] text-[#5A5A5A]">{t('phone')}</p>
                  <p className="text-[13px] text-[#9838E1] font-medium">
                    (704) 555-0127
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Social Card */}
          <div className="bg-white rounded-[14px] border border-[#ECE6F7] shadow-[0px_4px_18px_rgba(0,0,0,0.06)] p-5">
            <h4 className="text-[15px] font-semibold text-[#1B1B1B] mb-4">
              {t('followUs')}
            </h4>

            <div className="flex items-center gap-3">

              {[X, Instagram, Facebook, MessageSquare].map((Icon, i) => (
                <div
                  key={i}
                  className="w-[40px] h-[40px] rounded-[10px]
                  flex items-center justify-center cursor-pointer
                  bg-gradient-to-r from-[#9838E1] to-[#F68E44]"
                >
                  <Icon className="text-white" size={18} />
                </div>
              ))}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}