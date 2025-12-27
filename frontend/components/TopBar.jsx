"use client";

import { FiMenu } from "react-icons/fi";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useMyProfileQuery } from "@/feature/UserApi";
import { useTranslation } from "react-i18next";

import { usePathname } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Topbar({ onMenuClick }) {
  const { data } = useSession();
  const id = data?.user?.id;
  const { data: profile, isLoading, error } = useMyProfileQuery(id);
  const { t } = useTranslation('dashboard');
  const pathname = usePathname();
  
  // Extract current locale from pathname
  const pathSegments = pathname.split("/").filter(Boolean);
  const currentLocale = ["en", "es"].includes(pathSegments[0]) ? pathSegments[0] : "en";

  // Function to create localized href
  const createLocalizedHref = (href) => {
    if (href === "/") return `/${currentLocale}`;
    return `/${currentLocale}${href}`;
  };

  return (
    <header className="sticky top-0 z-10 bg-white ml-10 rounded-b-xl shadow-sm">
      <div className="flex items-center justify-between px-4 py-5">
        {/* Left */}
        <div className="flex items-center gap-4">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-50 transition-colors shadow-sm border border-gray-100"
            onClick={onMenuClick}
            aria-label="Toggle menu"
          >
            <FiMenu className="text-xl text-[#6F6C90]" />
          </button>
          <span className="hidden md:inline text-2xl font-bold text-gray-800">
            {t('dashboard_title')}
          </span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          
          {/* Mobile Language Switcher (Simplified) */}
          <div className="sm:hidden flex items-center gap-1 border border-gray-200 rounded-lg px-2 py-1">
            <a 
              href={createLocalizedHref(pathname.replace(/^\/(en|es)/, '/en'))}
              className={`text-xs px-1 ${currentLocale === "en" ? "font-bold text-blue-600" : "text-gray-600"}`}
            >
              EN
            </a>
            <span className="text-gray-300">/</span>
            <a 
              href={createLocalizedHref(pathname.replace(/^\/(en|es)/, '/es'))}
              className={`text-xs px-1 ${currentLocale === "es" ? "font-bold text-blue-600" : "text-gray-600"}`}
            >
              ES
            </a>
          </div>

          {/* Profile Info */}
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-sm font-semibold text-gray-900">
              {profile?.data?.name || t('welcome_back')}
            </span>
            <span className="text-[11px] text-[#8C8CA1] capitalize">
              {data?.user?.role}
            </span>
          </div>
          
          {/* Profile Image */}
          <div className="w-9 h-9 rounded-full border border-[#E5E4F0] overflow-hidden bg-white ring-2 ring-gray-100">
            {profile?.data?.image || profile?.data?.shopLogo ? (
              <Image
                src={profile?.data?.image || profile?.data?.shopLogo}
                alt="User avatar"
                width={36}
                height={36}
                className="w-full h-full object-cover"
              />
            ) : (
              <Image
                src="/avatar.jpg"
                alt="User avatar"
                width={36}
                height={36}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}