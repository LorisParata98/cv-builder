import i18n from "../translation/i18n";

/**
 * Translates a level key (e.g. "levels.native") or raw string to the cv target language.
 * Falls back to the raw value if not a known key.
 */
export function translateLevel(levelKeyOrRaw, targetLanguage) {
  if (!levelKeyOrRaw) return "";
  const lang = cvLang(targetLanguage);
  const key = levelKeyOrRaw.startsWith("levels.") ? levelKeyOrRaw : null;
  if (!key) return levelKeyOrRaw; // backward compat: stored as translated string
  return i18n.t(key, { lng: lang, ns: "cv" });
}

/** Maps targetLanguage store code ("IT","EN-GB","DE","ES") to i18n file key */
export function cvLang(targetLanguage) {
  return (targetLanguage || "IT").toLowerCase().replace("-gb", "");
}

/**
 * Returns a locale object for the given targetLanguage from the cv i18n namespace.
 * Same shape as the old getLocale() — drop-in replacement for templates and exporters.
 */
export function getCVLocale(targetLanguage) {
  const lang = cvLang(targetLanguage);
  const t = (key) => i18n.t(key, { lng: lang, ns: "cv" });
  return {
    profile:         t("profile"),
    skills:          t("skills"),
    skillsShort:     t("skillsShort"),
    experience:      t("experience"),
    experienceShort: t("experienceShort"),
    education:       t("education"),
    certifications:  t("certifications"),
    languages:       t("languages"),
    projects:        t("projects"),
    notes:           t("notes"),
    contacts:        t("contacts"),
    present:         t("present"),
    thesis:          t("thesis"),
    months:          i18n.t("months", { lng: lang, ns: "cv", returnObjects: true }),
    levels:          i18n.t("levels", { lng: lang, ns: "cv", returnObjects: true }),
    lang,
  };
}
