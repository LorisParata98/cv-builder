/**
 * generateCoverLetterPrompt
 *
 * Funzione pura: prende i dati del CV + i campi della cover letter
 * e produce un prompt ottimizzato da incollare in Claude / ChatGPT.
 *
 * @param {object} cvData   - dati plain dallo store (personal, skills, experience, ...)
 * @param {object} cl       - stato coverLetter dallo store
 * @returns {string}        - il testo del prompt
 */
export function generateCoverLetterPrompt(cvData, cl) {
  const { personal = {}, skills = [], experience = [] } = cvData;
  const {
    company = "",
    role = "",
    jobDescription = "",
    hiringManager = "",
    tone = "Professionale",
    highlights = [],
    motivation = "",
  } = cl;

  const TONE_MAP = {
    Formale:       "formale e distaccato",
    Professionale: "professionale e diretto",
    Diretto:       "diretto e conciso",
    Entusiasta:    "entusiasta e coinvolgente",
  };
  const toneLabel = TONE_MAP[tone] || "professionale e diretto";

  // Top 3 esperienze rilevanti
  const topExps = experience
    .slice(0, 3)
    .map((e) => {
      const end = e.endDate === "present" ? "presente" : (e.endDate || "presente");
      const period = e.startDate ? ` (${e.startDate.slice(0,7).replace("-","/")}–${end.slice(0,7).replace("-","/")})` : "";
      return `${e.role || "Ruolo"} @ ${e.company || "Azienda"}${period}`;
    })
    .join("; ");

  // Top skill (max 8 tag dai primi 3 blocchi)
  const topSkills = skills
    .slice(0, 4)
    .flatMap((cat) =>
      (cat.tags || []).slice(0, 3).map((t) => (typeof t === "string" ? t : t.label || ""))
    )
    .filter(Boolean)
    .slice(0, 8)
    .join(", ");

  const filledHighlights = highlights.filter((h) => h && h.trim());

  // ─── Composizione prompt ──────────────────────────────────────────────────
  const lines = [];

  lines.push(`Scrivi una cover letter professionale in italiano con tono ${toneLabel}.`);
  lines.push("");

  lines.push("## Chi scrive");
  lines.push(`Nome: ${personal.name || "(non specificato)"}`);
  lines.push(`Ruolo/Titolo: ${personal.role || personal.title || "(non specificato)"}`);
  if (personal.summary) lines.push(`Sommario professionale: ${personal.summary}`);
  lines.push("");

  lines.push("## Candidatura");
  lines.push(`Azienda: ${company || "(non specificata)"}`);
  lines.push(`Posizione: ${role || "(non specificata)"}`);
  if (hiringManager) lines.push(`Responsabile/Hiring manager: ${hiringManager}`);
  lines.push("");

  lines.push("## Job description");
  if (jobDescription.trim()) {
    lines.push(jobDescription.trim());
  } else {
    lines.push("(Non fornita — usa le informazioni disponibili per contestualizzare la lettera.)");
  }
  lines.push("");

  lines.push("## Dati dal CV da valorizzare");
  if (topExps) lines.push(`Esperienze rilevanti: ${topExps}`);
  if (topSkills) lines.push(`Competenze chiave: ${topSkills}`);
  if (filledHighlights.length)
    lines.push(`Punti da enfatizzare: ${filledHighlights.join(", ")}`);
  if (motivation.trim())
    lines.push(`Motivazione per questa azienda: ${motivation.trim()}`);
  lines.push("");

  lines.push("## Struttura richiesta");
  lines.push(
    "1. **Apertura** (2–3 righe): aggancia subito con il valore concreto che porti. Evita frasi di circostanza."
  );
  lines.push(
    "2. **Corpo** (2 paragrafi distinti): " +
    "primo sui risultati/esperienze più pertinenti al ruolo; " +
    "secondo su competenze trasversali e motivazione specifica per questa azienda."
  );
  lines.push(
    "3. **Chiusura** (2 righe): call-to-action esplicito, disponibilità a un colloquio."
  );
  lines.push("");

  lines.push("## Vincoli");
  lines.push("- Lunghezza massima: 300 parole");
  lines.push(`- Tono ${toneLabel} costante per tutta la lettera`);
  lines.push('- NON usare: "mi ritengo ideale", "grande passione per", "dinamico", "proattivo", "sono un candidato"');
  lines.push("- Solo prosa fluida — niente intestazione, niente elenchi puntati, niente titoli di sezione");
  lines.push("- Non includere data, indirizzo mittente/destinatario — solo il corpo della lettera");

  return lines.join("\n");
}

/**
 * generateSpontaneousPrompt
 *
 * Variante per candidatura spontanea: nessuna job description,
 * focus sulla value proposition proattiva del candidato.
 *
 * @param {object} cvData   - dati plain dallo store
 * @param {object} cl       - stato coverLetter dallo store
 * @returns {string}
 */
export function generateSpontaneousPrompt(cvData, cl) {
  const { personal = {}, skills = [], experience = [] } = cvData;
  const {
    company = "",
    hiringManager = "",
    tone = "Professionale",
    highlights = [],
    motivation = "",
  } = cl;

  const TONE_MAP = {
    Formale:       "formale e distaccato",
    Professionale: "professionale e diretto",
    Diretto:       "diretto e conciso",
    Entusiasta:    "entusiasta e coinvolgente",
  };
  const toneLabel = TONE_MAP[tone] || "professionale e diretto";

  const topExps = experience
    .slice(0, 3)
    .map((e) => {
      const end = e.endDate === "present" ? "presente" : (e.endDate || "presente");
      const period = e.startDate ? ` (${e.startDate.slice(0,7).replace("-","/")}–${end.slice(0,7).replace("-","/")})` : "";
      return `${e.role || "Ruolo"} @ ${e.company || "Azienda"}${period}`;
    })
    .join("; ");

  const topSkills = skills
    .slice(0, 4)
    .flatMap((cat) =>
      (cat.tags || []).slice(0, 3).map((t) => (typeof t === "string" ? t : t.label || ""))
    )
    .filter(Boolean)
    .slice(0, 8)
    .join(", ");

  const filledHighlights = highlights.filter((h) => h && h.trim());

  const lines = [];

  lines.push(`Scrivi una lettera di candidatura spontanea in italiano con tono ${toneLabel}.`);
  lines.push("Non c'è un'offerta di lavoro specifica: il candidato si propone proattivamente.");
  lines.push("");

  lines.push("## Chi scrive");
  lines.push(`Nome: ${personal.name || "(non specificato)"}`);
  lines.push(`Ruolo/Titolo attuale: ${personal.role || personal.title || "(non specificato)"}`);
  if (personal.summary) lines.push(`Sommario professionale: ${personal.summary}`);
  lines.push("");

  lines.push("## Destinatario");
  lines.push(`Azienda: ${company || "(non specificata)"}`);
  if (hiringManager) lines.push(`Responsabile/Hiring manager: ${hiringManager}`);
  lines.push("");

  lines.push("## Dati dal CV da valorizzare");
  if (topExps)   lines.push(`Esperienze rilevanti: ${topExps}`);
  if (topSkills) lines.push(`Competenze chiave: ${topSkills}`);
  if (filledHighlights.length)
    lines.push(`Punti di forza da enfatizzare: ${filledHighlights.join(", ")}`);
  if (motivation.trim())
    lines.push(`Perché questa azienda (da sviluppare): ${motivation.trim()}`);
  lines.push("");

  lines.push("## Struttura richiesta");
  lines.push(
    "1. **Apertura** (2–3 righe): presenta il candidato con una value proposition chiara e immediata " +
    "— chi è, cosa sa fare meglio, perché scrive a questa azienda in particolare."
  );
  lines.push(
    "2. **Corpo** (2 paragrafi): " +
    "primo su 2–3 risultati/esperienze concreti che dimostrano il valore del candidato; " +
    "secondo su come le sue competenze potrebbero contribuire agli obiettivi dell'azienda " +
    "(anche se non conosce la posizione esatta)."
  );
  lines.push(
    "3. **Chiusura** (2 righe): propone un incontro/colloquio esplorativo, " +
    "senza pretendere una posizione specifica."
  );
  lines.push("");

  lines.push("## Vincoli");
  lines.push("- Lunghezza massima: 280 parole");
  lines.push(`- Tono ${toneLabel} costante per tutta la lettera`);
  lines.push('- NON usare: "mi ritengo ideale", "grande passione per", "dinamico", "proattivo", "sono il candidato giusto"');
  lines.push("- La lettera deve sembrare scritta su misura per questa azienda, non generica");
  lines.push("- Solo prosa fluida — niente elenchi puntati, niente titoli di sezione");
  lines.push("- Non includere data, indirizzo — solo il corpo della lettera");

  return lines.join("\n");
}
