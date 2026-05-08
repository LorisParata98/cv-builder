import { useState, useCallback } from "react";
import { useCVStore } from "../../store/useCVStore";
import { generateCoverLetterPrompt, generateSpontaneousPrompt } from "../../services/PromptBuilder";
import { AutoTextarea } from "../ui/AutoTextarea";

const TONES = ["Formale", "Professionale", "Diretto", "Entusiasta"];
const CLOSING_LINES = [
  "Cordiali saluti",
  "Distinti saluti",
  "Con i migliori saluti",
  "A disposizione per ulteriori informazioni",
];

// Display label per tono in base alla lingua
const TONE_DISPLAY = {
  IT: { Formale: "Formale", Professionale: "Professionale", Diretto: "Diretto", Entusiasta: "Entusiasta" },
  EN: { Formale: "Formal", Professionale: "Professional", Diretto: "Direct", Entusiasta: "Enthusiastic" },
};

// Display label per formula di chiusura in base alla lingua
const CLOSING_DISPLAY = {
  IT: {
    "Cordiali saluti": "Cordiali saluti",
    "Distinti saluti": "Distinti saluti",
    "Con i migliori saluti": "Con i migliori saluti",
    "A disposizione per ulteriori informazioni": "A disposizione per ulteriori informazioni",
  },
  EN: {
    "Cordiali saluti": "Best regards",
    "Distinti saluti": "Kind regards",
    "Con i migliori saluti": "With best regards",
    "A disposizione per ulteriori informazioni": "Available for further information",
  },
};

// Testi UI per lingua
const LABELS = {
  IT: {
    title: "Cover Letter",
    subtitle:
      "Compila i campi, genera il prompt e incollalo in Claude o ChatGPT per ottenere il testo — poi incollalo qui sotto per la preview.",
    sec1: "1 · Candidatura",
    sec2: "2 · Job Description",
    sec3: "3 · Personalizzazione",
    sec4: "4 · Testo lettera",
    company: "Azienda",
    companyPh: "es. Acme S.p.A.",
    role: "Posizione / Ruolo",
    rolePh: "es. Senior Frontend Developer",
    hiringManager: "Hiring Manager (opzionale)",
    hiringManagerHint: "Usato per personalizzare l'intestazione nel prompt.",
    hiringManagerPh: "es. Dott.ssa Rossi",
    jobDesc: "Testo dell'offerta",
    jobDescHint:
      "Incolla il testo dell'annuncio — l'AI lo legge per calibrare il tono e le parole chiave.",
    jobDescPh: "Incolla qui il testo completo dell'offerta di lavoro...",
    tone: "Tono",
    highlights: "Punti di forza da evidenziare",
    highlightsHint:
      "Fino a 3 highlight concreti (es. '5 anni React', 'team lead 8 persone', 'ridotto costi del 30%').",
    motivation: "Perché questa azienda?",
    motivationHint:
      "1–2 frasi che spiegano la tua motivazione specifica. Migliora molto il risultato dell'AI.",
    motivationPh:
      "es. Mi interessa il vostro approccio open-source e la cultura di engineering-first...",
    letterBody: "Corpo della lettera",
    letterBodyHint:
      "Incolla qui il testo generato dall'AI. Appare subito nella preview.",
    letterBodyPh: "Incolla qui il testo della cover letter generato dall'AI...",
    date: "Data",
    closingLine: "Formula di chiusura",
    btnOffer: "Prompt offerta",
    btnSpontaneous: "Spontanea",
    copied: "Copiato!",
    copyError: "Errore",
    promptHint: "Copia il prompt e incollalo in",
    promptHintEnd: "o ChatGPT, poi incolla il testo qui sotto.",
    reset: "Azzera cover letter",
    resetConfirm: "Resettare tutti i campi della cover letter?",
  },
  EN: {
    title: "Cover Letter",
    subtitle:
      "Fill in the fields, generate the prompt and paste it into Claude or ChatGPT — then paste the generated text below for the preview.",
    sec1: "1 · Application",
    sec2: "2 · Job Description",
    sec3: "3 · Customization",
    sec4: "4 · Letter text",
    company: "Company",
    companyPh: "e.g. Acme Inc.",
    role: "Position / Role",
    rolePh: "e.g. Senior Frontend Developer",
    hiringManager: "Hiring Manager (optional)",
    hiringManagerHint: "Used to personalize the header in the prompt.",
    hiringManagerPh: "e.g. Dr. Smith",
    jobDesc: "Job posting text",
    jobDescHint:
      "Paste the job ad — the AI reads it to calibrate tone and keywords.",
    jobDescPh: "Paste the full job posting text here...",
    tone: "Tone",
    highlights: "Key strengths to highlight",
    highlightsHint:
      "Up to 3 concrete highlights (e.g. '5 years React', 'led team of 8', 'reduced costs by 30%').",
    motivation: "Why this company?",
    motivationHint:
      "1–2 sentences explaining your specific motivation. Greatly improves the AI output.",
    motivationPh:
      "e.g. I'm drawn to your open-source approach and engineering-first culture...",
    letterBody: "Letter body",
    letterBodyHint:
      "Paste the AI-generated text here. It appears instantly in the preview.",
    letterBodyPh: "Paste the AI-generated cover letter text here...",
    date: "Date",
    closingLine: "Closing formula",
    btnOffer: "Job offer prompt",
    btnSpontaneous: "Unsolicited",
    copied: "Copied!",
    copyError: "Error",
    promptHint: "Copy the prompt and paste it into",
    promptHintEnd: "or ChatGPT, then paste the text below.",
    reset: "Reset cover letter",
    resetConfirm: "Reset all cover letter fields?",
  },
};

// ─── Componente label + field ─────────────────────────────────────────────────
function Field({ label, hint, children }) {
  return (
    <div style={{ marginBottom: "14px" }}>
      <label
        style={{
          display: "block",
          fontSize: "11px",
          fontWeight: 600,
          color: "#64748b",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          marginBottom: "5px",
        }}
      >
        {label}
      </label>
      {children}
      {hint && (
        <p style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px", lineHeight: 1.5 }}>
          {hint}
        </p>
      )}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "7px 10px",
  borderRadius: "6px",
  border: "1px solid #e2e8f0",
  backgroundColor: "#fff",
  fontSize: "13px",
  color: "#1e293b",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.15s",
};

const textareaStyle = {
  ...inputStyle,
  lineHeight: 1.55,
  fontFamily: "inherit",
};

// ─── Sezione collassabile ─────────────────────────────────────────────────────
function Section({ title, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      style={{
        marginBottom: "16px",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 14px",
          backgroundColor: "#f8fafc",
          border: "none",
          cursor: "pointer",
          fontSize: "12px",
          fontWeight: 700,
          color: "#334155",
          textAlign: "left",
        }}
      >
        <span>{title}</span>
        <span style={{ color: "#94a3b8", fontSize: "11px" }}>{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div style={{ padding: "14px", backgroundColor: "#fff" }}>{children}</div>
      )}
    </div>
  );
}

// ─── CoverLetterForm ──────────────────────────────────────────────────────────
export function CoverLetterForm() {
  const coverLetter               = useCVStore((s) => s.coverLetter);
  const updateCoverLetter         = useCVStore((s) => s.updateCoverLetter);
  const updateCoverLetterHighlight = useCVStore((s) => s.updateCoverLetterHighlight);
  const resetCoverLetter          = useCVStore((s) => s.resetCoverLetter);
  const uiLanguage                = useCVStore((s) => s.uiLanguage);
  const store                     = useCVStore();

  const L = LABELS[uiLanguage] || LABELS.IT;
  const toneDisplay    = TONE_DISPLAY[uiLanguage]    || TONE_DISPLAY.IT;
  const closingDisplay = CLOSING_DISPLAY[uiLanguage] || CLOSING_DISPLAY.IT;

  // Stato bottone candidatura a offerta
  const [copied,      setCopied]      = useState(false);
  const [copyError,   setCopyError]   = useState(false);

  // Stato bottone candidatura spontanea
  const [copiedSp,    setCopiedSp]    = useState(false);
  const [copyErrorSp, setCopyErrorSp] = useState(false);

  // Estrae i dati CV plain escludendo tutte le action dallo store
  const extractCvData = useCallback(() => {
    const {
      updateCoverLetter: _a, updateCoverLetterHighlight: _b, resetCoverLetter: _c,
      setTemplate: _d, setDesignerPalette: _e, setPersonal: _f,
      setSkills: _g, addSkillCategory: _h, removeSkillCategory: _i, updateSkillCategory: _j,
      addSkillTag: _k, removeSkillTag: _l, updateSkillTag: _m,
      setExperience: _n, addExperience: _o, removeExperience: _p, updateExperience: _q,
      setEducation: _r, addEducation: _s, removeEducation: _t, updateEducation: _u,
      setCertifications: _v, addCertification: _w, removeCertification: _x, updateCertification: _y,
      setLanguages: _z, addLanguage: _aa, removeLanguage: _bb, updateLanguage: _cc,
      setProjects: _dd, addProject: _ee, removeProject: _ff, updateProject: _gg,
      setTargetLanguage: _hh, setDeepLApiKey: _ii, resetCV: _jj, importCV: _kk,
      setCustomPaletteColor: _ll, resetCustomPalette: _mm,
      setCustomFontSize: _nn, resetCustomFontSizes: _oo,
      setUiLanguage: _pp,
      deepLApiKey: _qq, customPalettes: _rr, customFontSizes: _ss,
      ...cvData
    } = store;
    return cvData;
  }, [store]);

  const handleCopyPrompt = useCallback(() => {
    const prompt = generateCoverLetterPrompt(extractCvData(), coverLetter, uiLanguage);
    navigator.clipboard.writeText(prompt).then(
      () => { setCopied(true);    setCopyError(false);   setTimeout(() => setCopied(false),    2500); },
      () => { setCopyError(true); setCopied(false);      setTimeout(() => setCopyError(false), 3000); }
    );
  }, [extractCvData, coverLetter, uiLanguage]);

  const handleCopySpontaneous = useCallback(() => {
    const prompt = generateSpontaneousPrompt(extractCvData(), coverLetter, uiLanguage);
    navigator.clipboard.writeText(prompt).then(
      () => { setCopiedSp(true);    setCopyErrorSp(false);   setTimeout(() => setCopiedSp(false),    2500); },
      () => { setCopyErrorSp(true); setCopiedSp(false);      setTimeout(() => setCopyErrorSp(false), 3000); }
    );
  }, [extractCvData, coverLetter, uiLanguage]);

  const cl = coverLetter;

  return (
    <div style={{ paddingBottom: "24px" }}>
      {/* Titolo sezione */}
      <div style={{ marginBottom: "18px" }}>
        <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#1e293b", margin: 0 }}>
          {L.title}
        </h2>
        <p style={{ fontSize: "12px", color: "#64748b", marginTop: "4px", lineHeight: 1.5 }}>
          {L.subtitle}
        </p>
      </div>

      {/* ── 1. Candidatura ── */}
      <Section title={L.sec1}>
        <Field label={L.company}>
          <input
            style={inputStyle}
            type="text"
            value={cl.company}
            placeholder={L.companyPh}
            onChange={(e) => updateCoverLetter({ company: e.target.value })}
          />
        </Field>
        <Field label={L.role}>
          <input
            style={inputStyle}
            type="text"
            value={cl.role}
            placeholder={L.rolePh}
            onChange={(e) => updateCoverLetter({ role: e.target.value })}
          />
        </Field>
        <Field label={L.hiringManager} hint={L.hiringManagerHint}>
          <input
            style={inputStyle}
            type="text"
            value={cl.hiringManager}
            placeholder={L.hiringManagerPh}
            onChange={(e) => updateCoverLetter({ hiringManager: e.target.value })}
          />
        </Field>
      </Section>

      {/* ── 2. Job Description ── */}
      <Section title={L.sec2}>
        <Field label={L.jobDesc} hint={L.jobDescHint}>
          <AutoTextarea
            style={textareaStyle}
            value={cl.jobDescription}
            placeholder={L.jobDescPh}
            rows={4}
            maxRows={10}
            onChange={(e) => updateCoverLetter({ jobDescription: e.target.value })}
          />
        </Field>
      </Section>

      {/* ── 3. Personalizzazione ── */}
      <Section title={L.sec3}>
        <Field label={L.tone}>
          <select
            style={inputStyle}
            value={cl.tone}
            onChange={(e) => updateCoverLetter({ tone: e.target.value })}
          >
            {TONES.map((t) => (
              <option key={t} value={t}>{toneDisplay[t]}</option>
            ))}
          </select>
        </Field>

        <Field label={L.highlights} hint={L.highlightsHint}>
          {(cl.highlights || ["", "", ""]).map((h, i) => (
            <input
              key={i}
              style={{ ...inputStyle, marginBottom: i < 2 ? "6px" : 0 }}
              type="text"
              value={h}
              placeholder={`${uiLanguage === "EN" ? "Highlight" : "Highlight"} ${i + 1}`}
              onChange={(e) => updateCoverLetterHighlight(i, e.target.value)}
            />
          ))}
        </Field>

        <Field label={L.motivation} hint={L.motivationHint}>
          <AutoTextarea
            style={textareaStyle}
            value={cl.motivation}
            placeholder={L.motivationPh}
            rows={2}
            maxRows={10}
            onChange={(e) => updateCoverLetter({ motivation: e.target.value })}
          />
        </Field>
      </Section>

      {/* ── Bottoni genera prompt ── */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
          {/* Bottone candidatura a offerta */}
          <button
            onClick={handleCopyPrompt}
            style={{
              flex: 1,
              padding: "11px 10px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: copied ? "#16a34a" : copyError ? "#dc2626" : "#0f2644",
              color: "#fff",
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer",
              transition: "background-color 0.2s",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "3px",
              lineHeight: 1.3,
            }}
          >
            <span style={{ fontSize: "15px" }}>
              {copied ? "✓" : copyError ? "✗" : "✦"}
            </span>
            <span>
              {copied ? L.copied : copyError ? L.copyError : L.btnOffer}
            </span>
          </button>

          {/* Bottone candidatura spontanea */}
          <button
            onClick={handleCopySpontaneous}
            style={{
              flex: 1,
              padding: "11px 10px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: copiedSp ? "#16a34a" : copyErrorSp ? "#dc2626" : "#4f46e5",
              color: "#fff",
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer",
              transition: "background-color 0.2s",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "3px",
              lineHeight: 1.3,
            }}
          >
            <span style={{ fontSize: "15px" }}>
              {copiedSp ? "✓" : copyErrorSp ? "✗" : "◈"}
            </span>
            <span>
              {copiedSp ? L.copied : copyErrorSp ? L.copyError : L.btnSpontaneous}
            </span>
          </button>
        </div>
        <p style={{ fontSize: "11px", color: "#94a3b8", lineHeight: 1.5, textAlign: "center" }}>
          {L.promptHint}{" "}
          <a
            href="https://claude.ai"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#3b82f6", textDecoration: "none" }}
          >
            Claude
          </a>{" "}
          {L.promptHintEnd}
        </p>
      </div>

      {/* ── 4. Testo lettera ── */}
      <Section title={L.sec4}>
        <Field label={L.letterBody} hint={L.letterBodyHint}>
          <AutoTextarea
            style={textareaStyle}
            value={cl.letterBody}
            placeholder={L.letterBodyPh}
            rows={6}
            maxRows={10}
            onChange={(e) => updateCoverLetter({ letterBody: e.target.value })}
          />
        </Field>
        <Field label={L.date}>
          <input
            style={inputStyle}
            type="date"
            value={cl.date}
            onChange={(e) => updateCoverLetter({ date: e.target.value })}
          />
        </Field>
        <Field label={L.closingLine}>
          <select
            style={inputStyle}
            value={cl.closingLine}
            onChange={(e) => updateCoverLetter({ closingLine: e.target.value })}
          >
            {CLOSING_LINES.map((c) => (
              <option key={c} value={c}>{closingDisplay[c]}</option>
            ))}
          </select>
        </Field>
      </Section>

      {/* ── Reset ── */}
      <button
        onClick={() => {
          if (window.confirm(L.resetConfirm)) {
            resetCoverLetter();
          }
        }}
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: "6px",
          border: "1px solid #fca5a5",
          backgroundColor: "transparent",
          color: "#ef4444",
          fontSize: "12px",
          cursor: "pointer",
        }}
      >
        {L.reset}
      </button>
    </div>
  );
}
