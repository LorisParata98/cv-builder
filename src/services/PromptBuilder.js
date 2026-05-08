/**
 * generateCoverLetterPrompt
 *
 * Funzione pura: prende i dati del CV + i campi della cover letter
 * e produce un prompt ottimizzato da incollare in Claude / ChatGPT.
 *
 * @param {object} cvData   - dati plain dallo store (personal, skills, experience, ...)
 * @param {object} cl       - stato coverLetter dallo store
 * @param {string} lang     - "IT" | "EN" (default "IT")
 * @returns {string}        - il testo del prompt
 */
export function generateCoverLetterPrompt(cvData, cl, lang = "IT") {
  const isEN = lang === "EN";
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

  const TONE_MAP = isEN
    ? {
        Formale:       "formal and reserved",
        Professionale: "professional and direct",
        Diretto:       "direct and concise",
        Entusiasta:    "enthusiastic and engaging",
      }
    : {
        Formale:       "formale e distaccato",
        Professionale: "professionale e diretto",
        Diretto:       "diretto e conciso",
        Entusiasta:    "entusiasta e coinvolgente",
      };

  const toneLabel = TONE_MAP[tone] || (isEN ? "professional and direct" : "professionale e diretto");

  // Top 3 esperienze rilevanti
  const topExps = experience
    .slice(0, 3)
    .map((e) => {
      const end = e.endDate === "present" ? (isEN ? "present" : "presente") : (e.endDate || (isEN ? "present" : "presente"));
      const period = e.startDate ? ` (${e.startDate.slice(0,7).replace("-","/")}–${end.slice(0,7).replace("-","/")})` : "";
      return `${e.role || (isEN ? "Role" : "Ruolo")} @ ${e.company || (isEN ? "Company" : "Azienda")}${period}`;
    })
    .join("; ");

  // Top skill (max 8 tag dai primi 4 blocchi)
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

  if (isEN) {
    lines.push(`Write a professional cover letter in English with a ${toneLabel} tone.`);
    lines.push("");

    lines.push("## About the applicant");
    lines.push(`Name: ${personal.name || "(not specified)"}`);
    lines.push(`Role/Title: ${personal.role || personal.title || "(not specified)"}`);
    if (personal.summary) lines.push(`Professional summary: ${personal.summary}`);
    lines.push("");

    lines.push("## Application");
    lines.push(`Company: ${company || "(not specified)"}`);
    lines.push(`Position: ${role || "(not specified)"}`);
    if (hiringManager) lines.push(`Hiring Manager: ${hiringManager}`);
    lines.push("");

    lines.push("## Job Description");
    if (jobDescription.trim()) {
      lines.push(jobDescription.trim());
    } else {
      lines.push("(Not provided — use available information to contextualize the letter.)");
    }
    lines.push("");

    lines.push("## CV data to highlight");
    if (topExps) lines.push(`Relevant experience: ${topExps}`);
    if (topSkills) lines.push(`Key skills: ${topSkills}`);
    if (filledHighlights.length)
      lines.push(`Points to emphasize: ${filledHighlights.join(", ")}`);
    if (motivation.trim())
      lines.push(`Motivation for this company: ${motivation.trim()}`);
    lines.push("");

    lines.push("## Required structure");
    lines.push(
      "1. **Opening** (2–3 lines): hook immediately with the concrete value you bring. Avoid filler phrases."
    );
    lines.push(
      "2. **Body** (2 distinct paragraphs): " +
      "first on the most relevant results/experience for the role; " +
      "second on transferable skills and specific motivation for this company."
    );
    lines.push(
      "3. **Closing** (2 lines): explicit call-to-action, availability for an interview."
    );
    lines.push("");

    lines.push("## Constraints");
    lines.push("- Maximum length: 300 words");
    lines.push(`- ${toneLabel} tone throughout the letter`);
    lines.push('- DO NOT use: "I consider myself ideal", "great passion for", "dynamic", "proactive", "I am the right candidate"');
    lines.push("- Fluid prose only — no header, no bullet points, no section titles");
    lines.push("- Do not include date, sender/recipient address — only the letter body");
  } else {
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
  }

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
 * @param {string} lang     - "IT" | "EN" (default "IT")
 * @returns {string}
 */
export function generateSpontaneousPrompt(cvData, cl, lang = "IT") {
  const isEN = lang === "EN";
  const { personal = {}, skills = [], experience = [] } = cvData;
  const {
    company = "",
    hiringManager = "",
    tone = "Professionale",
    highlights = [],
    motivation = "",
  } = cl;

  const TONE_MAP = isEN
    ? {
        Formale:       "formal and reserved",
        Professionale: "professional and direct",
        Diretto:       "direct and concise",
        Entusiasta:    "enthusiastic and engaging",
      }
    : {
        Formale:       "formale e distaccato",
        Professionale: "professionale e diretto",
        Diretto:       "diretto e conciso",
        Entusiasta:    "entusiasta e coinvolgente",
      };

  const toneLabel = TONE_MAP[tone] || (isEN ? "professional and direct" : "professionale e diretto");

  const topExps = experience
    .slice(0, 3)
    .map((e) => {
      const end = e.endDate === "present" ? (isEN ? "present" : "presente") : (e.endDate || (isEN ? "present" : "presente"));
      const period = e.startDate ? ` (${e.startDate.slice(0,7).replace("-","/")}–${end.slice(0,7).replace("-","/")})` : "";
      return `${e.role || (isEN ? "Role" : "Ruolo")} @ ${e.company || (isEN ? "Company" : "Azienda")}${period}`;
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

  if (isEN) {
    lines.push(`Write a professional unsolicited cover letter in English with a ${toneLabel} tone.`);
    lines.push("There is no specific job opening: the candidate is proactively reaching out.");
    lines.push("");

    lines.push("## About the applicant");
    lines.push(`Name: ${personal.name || "(not specified)"}`);
    lines.push(`Current Role/Title: ${personal.role || personal.title || "(not specified)"}`);
    if (personal.summary) lines.push(`Professional summary: ${personal.summary}`);
    lines.push("");

    lines.push("## Recipient");
    lines.push(`Company: ${company || "(not specified)"}`);
    if (hiringManager) lines.push(`Hiring Manager: ${hiringManager}`);
    lines.push("");

    lines.push("## CV data to highlight");
    if (topExps)   lines.push(`Relevant experience: ${topExps}`);
    if (topSkills) lines.push(`Key skills: ${topSkills}`);
    if (filledHighlights.length)
      lines.push(`Key strengths to emphasize: ${filledHighlights.join(", ")}`);
    if (motivation.trim())
      lines.push(`Why this company (to develop): ${motivation.trim()}`);
    lines.push("");

    lines.push("## Required structure");
    lines.push(
      "1. **Opening** (2–3 lines): introduce the candidate with a clear and immediate value proposition " +
      "— who they are, what they do best, why they are reaching out to this company specifically."
    );
    lines.push(
      "2. **Body** (2 paragraphs): " +
      "first on 2–3 concrete results/experiences that demonstrate the candidate's value; " +
      "second on how their skills could contribute to the company's goals " +
      "(even without knowing the exact position)."
    );
    lines.push(
      "3. **Closing** (2 lines): proposes an exploratory meeting/call, " +
      "without asking for a specific position."
    );
    lines.push("");

    lines.push("## Constraints");
    lines.push("- Maximum length: 280 words");
    lines.push(`- ${toneLabel} tone throughout the letter`);
    lines.push('- DO NOT use: "I consider myself ideal", "great passion for", "dynamic", "proactive", "I am the right candidate"');
    lines.push("- The letter must feel tailored to this company, not generic");
    lines.push("- Fluid prose only — no bullet points, no section titles");
    lines.push("- Do not include date, address — only the letter body");
  } else {
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
  }

  return lines.join("\n");
}
