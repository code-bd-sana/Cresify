"use client";

import { useTranslation } from "react-i18next";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SupportEntrepreneurs() {
  const { t } = useTranslation('marketPlace');
  const pathname = usePathname();
  
  // Extract current locale from pathname
  const pathSegments = pathname.split("/").filter(Boolean);
  const currentLocale = ["en", "es"].includes(pathSegments[0]) ? pathSegments[0] : "en";

  return (
    <section
      className="
        w-full py-20 
        bg-[linear-gradient(90deg,#8736C5_0%,#F88D25_100%)]
        flex flex-col items-center text-center px-6
      "
    >
      {/* Heading */}
      <h2 className="text-white text-[28px] md:text-[32px] font-semibold mb-3 leading-tight">
        {t('sidebar.support_local')}
      </h2>

      {/* Subtext */}
      <p className="text-white text-opacity-90 text-[15px] md:text-[16px] max-w-[650px] leading-relaxed mb-8">
        {t('sidebar.community_impact')}
      </p>

      {/* Button */}
      <Link href={`/${currentLocale}/marketplace`}>
        <button
          className="
            bg-white text-[#7A3AED] font-medium text-[14px]
            px-8 py-[12px] rounded-[10px]
            shadow-[0_4px_14px_rgba(0,0,0,0.15)]
            hover:opacity-90 transition
            hover:scale-[1.02] active:scale-[0.98]
            transform transition-transform duration-200
          "
        >
          {t('sidebar.button')}
        </button>
      </Link>
    </section>
  );
}