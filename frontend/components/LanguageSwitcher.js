"use client";

import { useTranslation } from "react-i18next";
import { usePathname, useRouter } from "next/navigation";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();

  const changeLanguage = (lng) => {
    const currentPath = pathname;
    const pathSegments = currentPath.split("/").filter(Boolean);
    
    // Check if first segment is a language code
    if (["en", "es"].includes(pathSegments[0])) {
      pathSegments[0] = lng;
    } else {
      // If no language prefix, add it at the beginning
      pathSegments.unshift(lng);
    }
    
    const newPath = "/" + pathSegments.join("/");
    i18n.changeLanguage(lng);
    // router.push(newPath);
  };

  return (
    <div className="flex items-center gap-2 border-l pl-4 ml-4">
      <button
        onClick={() => changeLanguage("en")}
        className={`text-sm px-2 py-1 rounded ${
          i18n.language === "en"
            ? "bg-blue-100 text-blue-600 font-medium"
            : "text-gray-600 hover:text-blue-600"
        }`}
      >
        EN
      </button>
      <span className="text-gray-300">|</span>
      <button
        onClick={() => changeLanguage("es")}
        className={`text-sm px-2 py-1 rounded ${
          i18n.language === "es"
            ? "bg-blue-100 text-blue-600 font-medium"
            : "text-gray-600 hover:text-blue-600"
        }`}
      >
        ES
      </button>
    </div>
  );
}