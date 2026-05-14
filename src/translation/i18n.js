import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";

import cvIt from "../i18n/cv/it.json";
import cvEn from "../i18n/cv/en.json";
import cvDe from "../i18n/cv/de.json";
import cvEs from "../i18n/cv/es.json";

const SUPPORTED_LANGS = ["it", "en", "de", "es"];

const detectBrowserLang = () => {
  const lang = (navigator.language || "en").split("-")[0].toLowerCase();
  return SUPPORTED_LANGS.includes(lang) ? lang : "en";
};

const getInitialLang = () => {
  try {
    const raw = localStorage.getItem("cv-builder:state");
    const lang = raw ? JSON.parse(raw)?.uiLanguage : null;
    return lang ? lang.toLowerCase() : detectBrowserLang();
  } catch {
    return detectBrowserLang();
  }
};

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    lng: getInitialLang(),
    fallbackLng: "en",
    preload: ["it", "en"],
    returnObjects: true,
    joinArrays: false,
    partialBundledLanguages: true,

    ns: ["translation", "cv"],
    defaultNS: "translation",

    resources: {
      it: { cv: cvIt },
      en: { cv: cvEn },
      de: { cv: cvDe },
      es: { cv: cvEs },
    },

    backend: {
      loadPath: `/i18n/{{lng}}.json`,
    },

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
