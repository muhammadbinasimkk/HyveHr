import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation files
import en from './locales/en/translation.json';
import fr from './locales/fr/translation.json';

i18n
  .use(LanguageDetector) // Detects the language of the user's browser
  .use(initReactI18next) // Connects with React
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
    },
    fallbackLng: 'en', // Default language if none is detected
    debug: true,
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
  });

export default i18n;
