// ─── DeepL translation service ────────────────────────────────────────────────
// Free-tier keys end with ":fx" → different host.
const FREE_HOST = "https://api-free.deepl.com";
const PRO_HOST = "https://api.deepl.com";

function host(key) {
  return key.trim().endsWith(":fx") ? FREE_HOST : PRO_HOST;
}

async function deeplBatch(texts, targetLang, userApiKey) {
  // Chiamata al tuo proxy su Vercel
  const res = await fetch("/api/translate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      texts: texts,
      targetLang: targetLang,
      userApiKey: userApiKey, // La chiave presa dall'input dell'utente
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    // Gestione errori (es: "Key invalid")
    throw new Error(data.message || "Errore di traduzione");
  }

  return data.translations.map((t) => t.text);
}
// ─── Main export ──────────────────────────────────────────────────────────────
/**
 * Translate all human-readable text fields in cvData using DeepL.
 * Returns a new cvData object; does NOT mutate the original.
 * @param {object} cvData   - raw CV store data (no functions)
 * @param {string} targetLang - DeepL language code, e.g. "EN-US", "FR", "DE"
 * @param {string} apiKey   - DeepL auth_key
 */
export async function translateCV(cvData, targetLang, apiKey) {
  const strings = [];
  const setters = []; // (result, value) => void

  const add = (val, setter) => {
    if (typeof val === "string" && val.trim()) {
      strings.push(val);
      setters.push(setter);
    }
  };

  // Clone to avoid mutating original
  const result = JSON.parse(JSON.stringify(cvData));

  // Personal
  add(result.personal?.summary, (v) => {
    result.personal.summary = v;
  });

  // Experience
  result.experience?.forEach((exp, ei) => {
    add(exp.role, (v) => {
      result.experience[ei].role = v;
    });
    exp.bullets?.forEach((b, bi) => {
      add(b, (v) => {
        result.experience[ei].bullets[bi] = v;
      });
    });
  });

  // Education
  result.education?.forEach((edu, ei) => {
    add(edu.degree, (v) => {
      result.education[ei].degree = v;
    });
    add(edu.field, (v) => {
      result.education[ei].field = v;
    });
    add(edu.thesis, (v) => {
      result.education[ei].thesis = v;
    });
  });

  // Certifications
  result.certifications?.forEach((c, ci) => {
    add(c, (v) => {
      result.certifications[ci] = v;
    });
  });

  // Projects
  result.projects?.forEach((p, pi) => {
    add(p, (v) => {
      result.projects[pi] = v;
    });
  });

  // Skill category names (optional — often already in the target language)
  result.skills?.forEach((cat, ci) => {
    add(cat.category, (v) => {
      result.skills[ci].category = v;
    });
  });

  if (strings.length === 0) return result;

  const translated = await deeplBatch(strings, targetLang, apiKey);

  translated.forEach((text, i) => {
    setters[i](text); // Passa solo la stringa tradotta
  });

  return result;
}

// ─── Supported target languages ───────────────────────────────────────────────
export const DEEPL_LANGUAGES = [
  { code: "EN-US", label: "Inglese (US)" },
  { code: "EN-GB", label: "Inglese (UK)" },
  { code: "IT", label: "Italiano" },
  { code: "FR", label: "Francese" },
  { code: "DE", label: "Tedesco" },
  { code: "ES", label: "Spagnolo" },
  { code: "PT-BR", label: "Portoghese (BR)" },
  { code: "PT-PT", label: "Portoghese (PT)" },
  { code: "NL", label: "Olandese" },
  { code: "PL", label: "Polacco" },
  { code: "RU", label: "Russo" },
  { code: "JA", label: "Giapponese" },
  { code: "ZH", label: "Cinese" },
];
