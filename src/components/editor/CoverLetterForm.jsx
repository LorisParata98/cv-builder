import { useState, useCallback } from "react";
import { useCVStore } from "../../store/useCVStore";
import { generateCoverLetterPrompt, generateSpontaneousPrompt } from "../../services/PromptBuilder";

const TONES = ["Formale", "Professionale", "Diretto", "Entusiasta"];
const CLOSING_LINES = [
  "Cordiali saluti",
  "Distinti saluti",
  "Con i migliori saluti",
  "A disposizione per ulteriori informazioni",
];

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
  resize: "vertical",
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
  const coverLetter = useCVStore((s) => s.coverLetter);
  const updateCoverLetter = useCVStore((s) => s.updateCoverLetter);
  const updateCoverLetterHighlight = useCVStore((s) => s.updateCoverLetterHighlight);
  const resetCoverLetter = useCVStore((s) => s.resetCoverLetter);

  const store = useCVStore();

  // Stato bottone candidatura a offerta
  const [copied, setCopied]         = useState(false);
  const [copyError, setCopyError]   = useState(false);

  // Stato bottone candidatura spontanea
  const [copiedSp, setCopiedSp]     = useState(false);
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
      deepLApiKey: _pp, customPalettes: _qq, customFontSizes: _rr,
      ...cvData
    } = store;
    return cvData;
  }, [store]);

  const handleCopyPrompt = useCallback(() => {
    const prompt = generateCoverLetterPrompt(extractCvData(), coverLetter);
    navigator.clipboard.writeText(prompt).then(
      () => { setCopied(true);     setCopyError(false);   setTimeout(() => setCopied(false),    2500); },
      () => { setCopyError(true);  setCopied(false);      setTimeout(() => setCopyError(false), 3000); }
    );
  }, [extractCvData, coverLetter]);

  const handleCopySpontaneous = useCallback(() => {
    const prompt = generateSpontaneousPrompt(extractCvData(), coverLetter);
    navigator.clipboard.writeText(prompt).then(
      () => { setCopiedSp(true);      setCopyErrorSp(false);   setTimeout(() => setCopiedSp(false),    2500); },
      () => { setCopyErrorSp(true);   setCopiedSp(false);      setTimeout(() => setCopyErrorSp(false), 3000); }
    );
  }, [extractCvData, coverLetter]);

  const cl = coverLetter;

  return (
    <div style={{ paddingBottom: "24px" }}>
      {/* Titolo sezione */}
      <div style={{ marginBottom: "18px" }}>
        <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#1e293b", margin: 0 }}>
          Cover Letter
        </h2>
        <p style={{ fontSize: "12px", color: "#64748b", marginTop: "4px", lineHeight: 1.5 }}>
          Compila i campi, genera il prompt e incollalo in Claude o ChatGPT
          per ottenere il testo — poi incollalo qui sotto per la preview.
        </p>
      </div>

      {/* ── 1. Candidatura ── */}
      <Section title="1 · Candidatura">
        <Field label="Azienda">
          <input
            style={inputStyle}
            type="text"
            value={cl.company}
            placeholder="es. Acme S.p.A."
            onChange={(e) => updateCoverLetter({ company: e.target.value })}
          />
        </Field>
        <Field label="Posizione / Ruolo">
          <input
            style={inputStyle}
            type="text"
            value={cl.role}
            placeholder="es. Senior Frontend Developer"
            onChange={(e) => updateCoverLetter({ role: e.target.value })}
          />
        </Field>
        <Field
          label="Hiring Manager (opzionale)"
          hint="Usato per personalizzare l'intestazione nel prompt."
        >
          <input
            style={inputStyle}
            type="text"
            value={cl.hiringManager}
            placeholder="es. Dott.ssa Rossi"
            onChange={(e) => updateCoverLetter({ hiringManager: e.target.value })}
          />
        </Field>
      </Section>

      {/* ── 2. Job Description ── */}
      <Section title="2 · Job Description">
        <Field
          label="Testo dell'offerta"
          hint="Incolla il testo dell'annuncio — l'AI lo legge per calibrare il tono e le parole chiave."
        >
          <textarea
            style={{ ...textareaStyle, minHeight: "120px" }}
            value={cl.jobDescription}
            placeholder="Incolla qui il testo completo dell'offerta di lavoro..."
            onChange={(e) => updateCoverLetter({ jobDescription: e.target.value })}
          />
        </Field>
      </Section>

      {/* ── 3. Personalizzazione ── */}
      <Section title="3 · Personalizzazione">
        <Field label="Tono">
          <select
            style={inputStyle}
            value={cl.tone}
            onChange={(e) => updateCoverLetter({ tone: e.target.value })}
          >
            {TONES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </Field>

        <Field
          label="Punti di forza da evidenziare"
          hint="Fino a 3 highlight concreti (es. '5 anni React', 'team lead 8 persone', 'ridotto costi del 30%')."
        >
          {(cl.highlights || ["", "", ""]).map((h, i) => (
            <input
              key={i}
              style={{ ...inputStyle, marginBottom: i < 2 ? "6px" : 0 }}
              type="text"
              value={h}
              placeholder={`Highlight ${i + 1}`}
              onChange={(e) => updateCoverLetterHighlight(i, e.target.value)}
            />
          ))}
        </Field>

        <Field
          label="Perché questa azienda?"
          hint="1–2 frasi che spiegano la tua motivazione specifica. Migliora molto il risultato dell'AI."
        >
          <textarea
            style={{ ...textareaStyle, minHeight: "60px" }}
            value={cl.motivation}
            placeholder="es. Mi interessa il vostro approccio open-source e la cultura di engineering-first..."
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
              {copied ? "Copiato!" : copyError ? "Errore" : "Prompt offerta"}
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
              {copiedSp ? "Copiato!" : copyErrorSp ? "Errore" : "Spontanea"}
            </span>
          </button>
        </div>
        <p style={{ fontSize: "11px", color: "#94a3b8", lineHeight: 1.5, textAlign: "center" }}>
          Copia il prompt e incollalo in{" "}
          <a
            href="https://claude.ai"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#3b82f6", textDecoration: "none" }}
          >
            Claude
          </a>{" "}
          o ChatGPT, poi incolla il testo qui sotto.
        </p>
      </div>

      {/* ── 4. Testo lettera ── */}
      <Section title="4 · Testo lettera">
        <Field
          label="Corpo della lettera"
          hint="Incolla qui il testo generato dall'AI. Appare subito nella preview."
        >
          <textarea
            style={{ ...textareaStyle, minHeight: "160px" }}
            value={cl.letterBody}
            placeholder="Incolla qui il testo della cover letter generato dall'AI..."
            onChange={(e) => updateCoverLetter({ letterBody: e.target.value })}
          />
        </Field>
        <Field label="Data">
          <input
            style={inputStyle}
            type="date"
            value={cl.date}
            onChange={(e) => updateCoverLetter({ date: e.target.value })}
          />
        </Field>
        <Field label="Formula di chiusura">
          <select
            style={inputStyle}
            value={cl.closingLine}
            onChange={(e) => updateCoverLetter({ closingLine: e.target.value })}
          >
            {CLOSING_LINES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Field>
      </Section>

      {/* ── Reset ── */}
      <button
        onClick={() => {
          if (window.confirm("Resettare tutti i campi della cover letter?")) {
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
        Azzera cover letter
      </button>
    </div>
  );
}
