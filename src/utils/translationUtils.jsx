import i18n from "../translation/i18n";
import { cvLang } from "./cvLocales";

export function formatDate(dateStr, L) {
  if (!dateStr) return "";

  const lang = cvLang(L?.lang || i18n.language || "it");
  const presentLabel = i18n.t("present", { lng: lang, ns: "cv" }) || "Presente";
  const months = i18n.t("months", { lng: lang, ns: "cv", returnObjects: true });

  if (dateStr === "present") return presentLabel;

  const [year, month] = dateStr.split("-");
  if (!month) return year;

  const monthIndex = parseInt(month, 10) - 1;
  const monthLabel =
    Array.isArray(months) && months[monthIndex] ? months[monthIndex] : month;

  return `${monthLabel} ${year}`;
}
