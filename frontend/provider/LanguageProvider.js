"use client";

import { useEffect, useState } from "react";
import i18n from "i18next";
import { initReactI18next, I18nextProvider } from "react-i18next";
import { usePathname } from "next/navigation";

// Load translations from public folder
const loadTranslations = () => {
  const translations = {
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

      // Add more namespaces as needed
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
      // Add more namespaces as needed
    }
  };
  return translations;
};

export default function LanguageProvider({ children }) {
  const [initialized, setInitialized] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const translations = loadTranslations();
    
    i18n
      .use(initReactI18next)
      .init({
        resources: translations,
        fallbackLng: "en",
        supportedLngs: ["en", "es"],
        defaultNS: "common",
        lng: "en",
        interpolation: {
          escapeValue: false,
        },
        react: {
          useSuspense: false,
        },
      })
      .then(() => {
        console.log("i18n initialized");
        setInitialized(true);
      })
      .catch(err => console.error("i18n init error:", err));
  }, []);

  // Detect language from URL
  useEffect(() => {
    if (initialized && pathname) {
      const pathSegments = pathname.split("/").filter(Boolean);
      if (pathSegments.length > 0 && ["en", "es"].includes(pathSegments[0])) {
        i18n.changeLanguage(pathSegments[0]);
      }
    }
  }, [pathname, initialized]);

  if (!initialized) {
    return <>{children}</>;
  }

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
}