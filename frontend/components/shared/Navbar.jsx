"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaUser } from "react-icons/fa";
import { FiMenu, FiMessageCircle, FiShoppingCart, FiX } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../LanguageSwitcher";


export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { t } = useTranslation("navbar");
  const { data } = useSession();
  const user = data?.user;

  // Extract current locale from pathname
  const pathSegments = pathname.split("/").filter(Boolean);
  const currentLocale = ["en", "es"].includes(pathSegments[0]) ? pathSegments[0] : "en";

  const navItems = [
    { label: t("home"), href: `/${currentLocale}` },
    { label: t("marketplace"), href: `/${currentLocale}/marketplace` },
    { label: t("services"), href: `/${currentLocale}/services` },
    { label: t("blog"), href: `/${currentLocale}/blog` },
    { label: t("about"), href: `/${currentLocale}/about` },
    // { label: t("contact"), href: `/${currentLocale}/contact` },
  ];

  // Function to create localized href
  const createLocalizedHref = (href) => {
    if (href === "/") return `/${currentLocale}`;
    return `/${currentLocale}${href}`;
  };

  return (
    <nav className='w-full bg-white border-b border-gray-100 sticky top-0 z-50'>
      {/* ---------------- DESKTOP NAV ---------------- */}
      <div className='hidden xl:flex w-full items-center justify-between px-16 py-2'>
        {/* LEFT */}
        <div className='flex items-center gap-8 xl:gap-72'>
          {/* LOGO */}
          <Link href={`/${currentLocale}`}>
            <Image
              src='/logo.png'
              alt='logo'
              width={100}
              height={100}
              className='cursor-pointer'
            />
          </Link>

          {/* MENU */}
          <div className='flex items-center font-medium gap-8 text-[15px]'>
            {navItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href === `/${currentLocale}` && pathname === `/${currentLocale}`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative transition font-medium ${
                    isActive
                      ? "text-[#FF7A00]"
                      : "text-black hover:text-[#FF7A00]"
                  }`}>
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* RIGHT */}
        <div className='flex items-center gap-6'>
          <Link href={createLocalizedHref('/cart')}>
            <FiShoppingCart className='text-[22px] text-black cursor-pointer' />
          </Link>

          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* BUTTON */}
          {user?.role === "buyer" ? (
            <Link href={createLocalizedHref("/profile")}>
              <FaUser className='text-2xl cursor-pointer' />
            </Link>
          ) : (
            <Link href={createLocalizedHref('/dashboard')}>
              <button className='px-6 py-[10px] text-white font-medium rounded-md bg-gradient-to-r from-[#9838E1] to-[#F68E44] cursor-pointer'>
                {t("getStarted")}
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* ---------------- MOBILE NAV ---------------- */}
      <div className='xl:hidden px-4 py-3 flex items-center justify-between'>
        {/* LEFT SIDE LOGO */}
        <Link href={`/${currentLocale}`}>
          <Image
            src='/logo.png'
            alt='logo'
            width={80}
            height={80}
            className='cursor-pointer'
          />
        </Link>

        {/* ICONS + MENU BUTTON */}
        <div className='flex items-center gap-4'>
          <Link href={createLocalizedHref('/cart')}>
            <FiShoppingCart className='text-[22px] text-black cursor-pointer' />
          </Link>

          {/* Language Switcher for Mobile */}
          <div className="flex items-center gap-1">
            <button 
              onClick={() => changeLanguage("en")}
              className={`text-xs px-1 ${currentLocale === "en" ? "font-bold text-blue-600" : ""}`}
            >
              EN
            </button>
            <span className="text-gray-300">/</span>
            <button 
              onClick={() => changeLanguage("es")}
              className={`text-xs px-1 ${currentLocale === "es" ? "font-bold text-blue-600" : ""}`}
            >
              ES
            </button>
          </div>

          {/* Hamburger */}
          {open ? (
            <FiX
              className='text-[26px] cursor-pointer'
              onClick={() => setOpen(false)}
            />
          ) : (
            <FiMenu
              className='text-[26px] cursor-pointer'
              onClick={() => setOpen(true)}
            />
          )}
        </div>
      </div>

      {/* ---------------- MOBILE MENU DROPDOWN ---------------- */}
      {open && (
        <div className='xl:hidden bg-white px-4 pb-5 border-t animate-slideDown'>
          {/* MENU ITEMS */}
          <div className='flex flex-col gap-4 mt-4'>
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`text-[15px] font-medium ${
                    isActive
                      ? "text-[#FF7A00]"
                      : "text-black hover:text-[#FF7A00]"
                  }`}>
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* ICONS + BUTTON */}
          <div className='flex mt-4 items-center justify-between'>
            <Link href={createLocalizedHref('/cart')} onClick={() => setOpen(false)}>
              <FiShoppingCart className='text-[22px] text-black cursor-pointer' />
            </Link>

            {user?.role === "buyer" ? (
              <Link href={createLocalizedHref("/profile")} onClick={() => setOpen(false)}>
                <FaUser className="text-2xl" />
              </Link>
            ) : (
              <Link href={createLocalizedHref('/dashboard')} onClick={() => setOpen(false)}>
                <button className='px-5 py-[10px] text-white font-medium rounded-md bg-gradient-to-r from-[#9838E1] to-[#F68E44] cursor-pointer'>
                  {t("getStarted")}
                </button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}