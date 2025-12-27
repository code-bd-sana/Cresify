"use client";

import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { MdEmail, MdPhone } from "react-icons/md";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { usePathname } from "next/navigation";

export default function Footer() {
  const { t } = useTranslation('footer');
  const pathname = usePathname();
  
  // Extract current locale from pathname
  const pathSegments = pathname.split("/").filter(Boolean);
  const currentLocale = ["en", "es"].includes(pathSegments[0]) ? pathSegments[0] : "en";
  
  // Create localized href
  const createLocalizedHref = (path) => {
    return `/${currentLocale}${path.startsWith("/") ? path : `/${path}`}`;
  };

  // Get navigation items array
  const navItems = t('navigation.items', { returnObjects: true });
  const resourceItems = t('resources.items', { returnObjects: true });

  return (
    <footer
      className="
        w-full 
        pt-16 pb-6 
        bg-[linear-gradient(135deg,#F5EEFB_0%,#FFFFFF_100%)]
        border-t border-gray-100
      "
    >
      <div className="max-w-[1350px] mx-auto px-4 md:px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-14">
        
        {/* COLUMN 1 — Logo + Text + Social */}
        <div>
          <div className="-ml-2 mb-4">
            <Link href={createLocalizedHref("/")}>
              <Image
                src="/logo.png"
                width={118}
                height={118}
                alt="Cresify Logo"
                className="hover:opacity-90 transition-opacity"
              />
            </Link>
          </div>

          <p className="text-[14px] text-[#444] leading-[22px] mb-6">
            {t('company_description')}
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#7A4ACF] hover:text-[#9838E1] transition-colors"
              aria-label={t('social_media.facebook')}
            >
              <FaFacebookF className="text-[18px]" />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#7A4ACF] hover:text-[#1DA1F2] transition-colors"
              aria-label={t('social_media.twitter')}
            >
              <FaTwitter className="text-[18px]" />
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#7A4ACF] hover:text-[#E4405F] transition-colors"
              aria-label={t('social_media.instagram')}
            >
              <FaInstagram className="text-[18px]" />
            </a>
            <a 
              href="https://youtube.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#7A4ACF] hover:text-[#FF0000] transition-colors"
              aria-label={t('social_media.youtube')}
            >
              <FaYoutube className="text-[18px]" />
            </a>
          </div>
        </div>

        {/* COLUMN 2 — Navigation */}
        <div>
          <h4 className="text-[16px] font-semibold text-[#7A4ACF] mb-4">
            {t('navigation.title')}
          </h4>

          <ul className="space-y-2">
            {Array.isArray(navItems) && navItems.map((item, index) => (
              <li key={index}>
                <Link 
                  href={createLocalizedHref(`/${item.toLowerCase().replace(/\s+/g, '-')}`)}
                  className="
                    text-[14px] text-[#444] 
                    hover:text-[#7A4ACF] 
                    transition-colors
                    block py-1
                  "
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* COLUMN 3 — Resources */}
        <div>
          <h4 className="text-[16px] font-semibold text-[#7A4ACF] mb-4">
            {t('resources.title')}
          </h4>

          <ul className="space-y-2">
            {Array.isArray(resourceItems) && resourceItems.map((item, index) => (
              <li key={index}>
                <Link 
                  href={createLocalizedHref(`/${item.toLowerCase().replace(/\s+/g, '-')}`)}
                  className="
                    text-[14px] text-[#444] 
                    hover:text-[#7A4ACF] 
                    transition-colors
                    block py-1
                  "
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* COLUMN 4 — Contact */}
        <div>
          <h4 className="text-[16px] font-semibold text-[#7A4ACF] mb-4">
            {t('contact.title')}
          </h4>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MdEmail className="text-[18px] text-[#7A4ACF] mt-1 flex-shrink-0" />
              <a 
                href={`mailto:${t('contact.email')}`}
                className="
                  text-[14px] text-[#444] 
                  hover:text-[#7A4ACF] 
                  transition-colors
                  break-all
                "
              >
                {t('contact.email')}
              </a>
            </div>

            <div className="flex items-center gap-3">
              <MdPhone className="text-[18px] text-[#7A4ACF] flex-shrink-0" />
              <a 
                href={`tel:${t('contact.phone').replace(/\s+/g, '')}`}
                className="
                  text-[14px] text-[#444] 
                  hover:text-[#7A4ACF] 
                  transition-colors
                "
              >
                {t('contact.phone')}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[#D9C7F3] w-full max-w-[1350px] mx-auto mt-12"></div>

      {/* Bottom text */}
      <div className="max-w-[1350px] mx-auto px-4 md:px-10">
        <p className="text-center text-[13px] text-[#7A4ACF] mt-6">
          {t('copyright')}
        </p>
        
        {/* Language note */}
        <p className="text-center text-[11px] text-gray-400 mt-2">
          Available in: English | Español
        </p>
      </div>
    </footer>
  );
}