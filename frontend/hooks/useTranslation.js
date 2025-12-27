// hooks/useTranslation.js
import { useTranslation as useTranslationOriginal } from 'react-i18next';

export const useTranslation = (ns) => {
  const { t, i18n } = useTranslationOriginal(ns);
  return { t, i18n };
};