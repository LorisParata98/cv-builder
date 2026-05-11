/**
 * urlUtils.js
 * Funzioni per compattare URL da visualizzare nei template CV.
 * Il testo display è il minimo leggibile; l'href mantiene l'URL completo.
 */

/** Garantisce che l'URL abbia un protocollo valido per l'href. */
export function makeHref(url) {
  if (!url) return "#";
  if (/^(mailto:|tel:|https?:\/\/)/i.test(url)) return url;
  return `https://${url}`;
}

/** Rimuove protocollo, www e slash finale — robusto anche senza protocollo. */
export function shortenUrl(url) {
  if (!url) return "";
  return url
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/\/$/, "");
}

/**
 * LinkedIn → "in/username"
 * Es: https://www.linkedin.com/in/lorisparata → in/lorisparata
 */
export function shortenLinkedIn(url) {
  if (!url) return "";
  const m = url.match(/linkedin\.com\/in\/([^/?#\s]+)/i);
  return m ? `in/${m[1]}` : shortenUrl(url);
}

/**
 * GitHub → solo username
 * Es: https://github.com/lorisparata → lorisparata
 */
export function shortenGitHub(url) {
  if (!url) return "";
  const m = url.match(/github\.com\/([^/?#\s]+)/i);
  return m ? m[1] : shortenUrl(url);
}

/**
 * Sito generico: rileva automaticamente GitHub e LinkedIn,
 * altrimenti ritorna il dominio pulito.
 */
export function shortenWebsite(url) {
  if (!url) return "";
  if (/github\.com/i.test(url)) return shortenGitHub(url);
  if (/linkedin\.com/i.test(url)) return shortenLinkedIn(url);
  return shortenUrl(url);
}
