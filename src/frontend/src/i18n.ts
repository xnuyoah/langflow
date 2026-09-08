import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { DEFAULT_LANGUAGE } from "./constants/languages";
import en from "./locales/en.json";
import zhHans from "./locales/zh-Hans.json";

const SUPPORTED_LANGUAGES = [
  "en",
  "de",
  "es",
  "fr",
  "ja",
  "pt",
  "zh-Hans",
] as const;

export const normalizeLanguage = (lang?: string | null): string => {
  if (!lang) return DEFAULT_LANGUAGE;

  if (
    SUPPORTED_LANGUAGES.includes(lang as (typeof SUPPORTED_LANGUAGES)[number])
  ) {
    return lang;
  }

  const lowerLang = lang.toLowerCase();

  if (["zh-hans", "zh-cn", "zh-sg"].includes(lowerLang)) {
    return "zh-Hans";
  }

  const baseLang = lang.split("-")[0].toLowerCase();

  if (
    SUPPORTED_LANGUAGES.includes(
      baseLang as (typeof SUPPORTED_LANGUAGES)[number],
    )
  ) {
    return baseLang;
  }

  return DEFAULT_LANGUAGE;
};

export const detectedLang = normalizeLanguage(
  localStorage.getItem("languagePreference"),
);

const i18n = i18next.createInstance();

// i18next hardcodes a Locize promotional message via console.info during init.
// Suppress it by temporarily replacing console.info for the synchronous init call.
const _consoleInfo = console.info.bind(console);
console.info = () => {};
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    [DEFAULT_LANGUAGE]: { translation: zhHans },
  },
  lng: detectedLang,
  fallbackLng: "en",
  returnNull: false,
  returnEmptyString: false,
  interpolation: {
    escapeValue: false,
  },
});
console.info = _consoleInfo;

/**
 * Keeps `<html lang>` in sync with the active locale so assistive technology
 * applies the right pronunciation rules (WCAG 3.1.1 Language of Page).
 * `index.html` only ever ships the hard-coded default.
 */
const syncDocumentLanguage = (lang: string) => {
  document.documentElement.lang = lang;
};

syncDocumentLanguage(detectedLang);
i18n.on("languageChanged", syncDocumentLanguage);

export async function loadLanguage(lang: string): Promise<void> {
  const normalizedLang = normalizeLanguage(lang);
  if (i18n.hasResourceBundle(normalizedLang, "translation")) return;
  try {
    const messages = await import(`./locales/${normalizedLang}.json`);
    i18n.addResourceBundle(normalizedLang, "translation", messages.default);
  } catch {
    // Unknown locale — no bundle file exists. i18next's fallbackLng: "en" takes over.
  }
}

export default i18n;
