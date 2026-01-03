"use client";

import i18n from "i18next";
import { useEffect, useState } from "react";
import { I18nextProvider, initReactI18next } from "react-i18next";

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

// Load translations
const loadTranslations = () => {
  return {
    en: {
      navbar: require("@/public/locales/en/navbar.json"),
      home: require("@/public/locales/en/home.json"),
      feature: require("@/public/locales/en/feature.json"),
      service: require("@/public/locales/en/service.json"),
      whyChoose: require("@/public/locales/en/whyChoose.json"),
      blog: require("@/public/locales/en/blog.json"),
      about: require("@/public/locales/en/about.json"),
      cta: require("@/public/locales/en/cta.json"),
      footer: require("@/public/locales/en/footer.json"),
      marketPlace: require("@/public/locales/en/marketplace.json"),
      serviceHeading: require("@/public/locales/en/serviceHeading.json"),
      ourStory: require("@/public/locales/en/ourStory.json"),
      missionVision: require("@/public/locales/en/missionVision.json"),
      sidebar: require("@/public/locales/en/sidebar.json"),
      dashboard: require("@/public/locales/en/dashboard.json"),
      booking: require("@/public/locales/en/booking.json"),
      contact: require("@/public/locales/en/contact.json"),
      pdetails: require("@/public/locales/en/pdetails.json"),
      cart: require("@/public/locales/en/cart.json"),
      faq: require("@/public/locales/en/faq.json"),
      terms: require("@/public/locales/en/terms.json"),
      privacy: require("@/public/locales/en/privacy.json"),
      serviceDetails: require("@/public/locales/en/serviceDetails.json"),
      seller: require("@/public/locales/en/seller.json"),
      provider: require("@/public/locales/en/provider.json"),
      admin: require("@/public/locales/en/admin.json"),
      store: require("@/public/locales/en/store.json"),
    },
    es: {
      navbar: require("@/public/locales/es/navbar.json"),
      home: require("@/public/locales/es/home.json"),
      feature: require("@/public/locales/es/feature.json"),
      service: require("@/public/locales/es/service.json"),
      whyChoose: require("@/public/locales/es/whyChoose.json"),
      blog: require("@/public/locales/es/blog.json"),
      about: require("@/public/locales/es/about.json"),
      cta: require("@/public/locales/es/cta.json"),
      footer: require("@/public/locales/es/footer.json"),
      marketPlace: require("@/public/locales/es/marketplace.json"),
      serviceHeading: require("@/public/locales/es/serviceHeading.json"),
      ourStory: require("@/public/locales/es/ourStory.json"),
      missionVision: require("@/public/locales/es/missionVision.json"),
      sidebar: require("@/public/locales/es/sidebar.json"),
      dashboard: require("@/public/locales/es/dashboard.json"),
      booking: require("@/public/locales/es/booking.json"),
      contact: require("@/public/locales/es/contact.json"),
      pdetails: require("@/public/locales/es/pdetails.json"),
      cart: require("@/public/locales/es/cart.json"),
      faq: require("@/public/locales/es/faq.json"),
      terms: require("@/public/locales/es/terms.json"),
      privacy: require("@/public/locales/es/privacy.json"),
      serviceDetails: require("@/public/locales/es/serviceDetails.json"),
      seller: require("@/public/locales/es/seller.json"),
      provider: require("@/public/locales/es/provider.json"),
      admin: require("@/public/locales/es/admin.json"),
      store: require("@/public/locales/es/store.json"),
    },
  };
};

export default function LanguageProvider({ children }) {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Load stored language
    const storedLang = getStoredLanguage();
    console.log("Initializing with stored language:", storedLang);

    const translations = loadTranslations();

    i18n
      .use(initReactI18next)
      .init({
        resources: translations,
        fallbackLng: "es", // Fallback Spanish
        supportedLngs: ["en", "es"],
        defaultNS: "common",
        lng: storedLang, // Use stored language
        interpolation: {
          escapeValue: false,
        },
        react: {
          useSuspense: false,
        },
      })
      .then(() => {
        console.log("i18n initialized with language:", storedLang);
        setInitialized(true);
      })
      .catch((err) => console.error("i18n init error:", err));
  }, []);

  // Listen for language changes and save to localStorage
  useEffect(() => {
    if (!initialized) return;

    const handleLanguageChanged = (lng) => {
      console.log("Language changed to:", lng);
      saveLanguageToStorage(lng);
    };

    i18n.on("languageChanged", handleLanguageChanged);

    return () => {
      i18n.off("languageChanged", handleLanguageChanged);
    };
  }, [initialized]);

  if (!initialized) {
    return <>{children}</>;
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
