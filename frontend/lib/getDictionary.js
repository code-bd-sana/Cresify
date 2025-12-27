import en from "@/locales/en.json";
import es from "@/locals/es.json";

export const getDictionary = (locale) => {
  if (locale === "es") return es;
  return en; // default
};
