"use client";

import { useTranslation } from "react-i18next";

// localStorage key
const LANGUAGE_KEY = "app-language";

// Helper functions
const getStoredLanguage = () => {
  if (typeof window !== "undefined") {
    const lang = localStorage.getItem(LANGUAGE_KEY);
    return lang && ["en", "es"].includes(lang) ? lang : "es"; // Default Spanish
  }
  return "es";
};

const saveLanguageToStorage = (lang) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(LANGUAGE_KEY, lang);
  }
};

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  
  // Get current language from i18n
  const currentLang = i18n.language || getStoredLanguage();

  const changeLanguage = (lng) => {
    // Don't change if already the same
    if (currentLang === lng) return;
    
    console.log("Changing language to:", lng);
    
    // Save to localStorage
    saveLanguageToStorage(lng);
    
    // Change i18n language
    i18n.changeLanguage(lng);
    
    // Optional: Reload page for some use cases
    // window.location.reload();
  };

  return (
    <div className="flex items-center gap-2 border-l pl-4 ml-4">
      <button
        onClick={() => changeLanguage("en")}
        className={`text-sm px-2 py-1 rounded ${
          currentLang === "en"
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
          currentLang === "es"
            ? "bg-blue-100 text-blue-600 font-medium"
            : "text-gray-600 hover:text-blue-600"
        }`}
      >
        ES
      </button>
    </div>
  );
}