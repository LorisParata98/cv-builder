import { useState, useEffect } from "react";
import {
  User,
  Wrench,
  Briefcase,
  GraduationCap,
  Certificate,
  Globe,
  Rocket,
  Palette,
  Translate,
  DotsSixVertical,
  Warning,
} from "@phosphor-icons/react";
import { useCVStore } from "../../store/useCVStore";
import { UI_LANGUAGES } from "../../locales/index.js";

const SECTIONS = [
  { id: "personal", label: "Dati Personali", Icon: User },
  { id: "skills", label: "Competenze", Icon: Wrench },
  { id: "experience", label: "Esperienza", Icon: Briefcase },
  { id: "education", label: "Formazione", Icon: GraduationCap },
  { id: "certifications", label: "Certificazioni", Icon: Certificate },
  { id: "languages", label: "Lingue", Icon: Globe },
  { id: "projects", label: "Progetti", Icon: Rocket },
];

const PALETTE_KEYS = {
  tech: [
    { key: "bg", label: "Header", def: "#0f2644" },
    { key: "accent", label: "Accento", def: "#4ec9b0" },
  ],
  manager: [
    { key: "bg", label: "Header", def: "#1e3a5f" },
    { key: "accent", label: "Accento", def: "#c8a951" },
  ],
  designer: [
    { key: "accent", label: "Accento", def: "#C8B89A" },
    { key: "sidebarBg", label: "Sidebar", def: "#1A1A1A" },
    { key: "bg", label: "Sfondo", def: "#0D0D0D" },
  ],
};

const HEX_VALID = /^#[0-9a-fA-F]{6}$/;

// ─── PaletteCustomizerPanel ──────────────────────────────────────────────────
function PaletteCustomizerPanel() {
  const template = useCVStore((s) => s.template);
  const customPalettes = useCVStore((s) => s.customPalettes);
  const setCustomPaletteColor = useCVStore((s) => s.setCustomPaletteColor);
  const resetCustomPalette = useCVStore((s) => s.resetCustomPalette);

  const [open, setOpen] = useState(false);
  const [textInputs, setTextInputs] = useState({});

  const keys = PALETTE_KEYS[template] || [];
  const current = customPalettes[template] || {};

  useEffect(() => {
    setTextInputs({});
  }, [template]);

  const getStoreValue = (key, def) => {
    const stored = current[key];
    return HEX_VALID.test(stored) ? stored : def;
  };
  const getTextValue = (key, def) =>
    textInputs[key] !== undefined ? textInputs[key] : getStoreValue(key, def);

  const hasCustom = Object.values(current).some((v) => HEX_VALID.test(v));

  return (
    <div className="border-t border-gray-700">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
      >
        <span className="flex items-center gap-2">
          <Palette size={14} weight="duotone" />
          <span>Personalizza Palette</span>
          {hasCustom && (
            <span
              className="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block"
              title="Palette modificata"
            />
          )}
        </span>
        <span className="text-gray-600 text-xs">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3">
          {keys.map(({ key, label, def }) => {
            const storeValue = getStoreValue(key, def);
            const textValue = getTextValue(key, def);
            const isDirty =
              HEX_VALID.test(current[key]) && current[key] !== def;
            return (
              <div key={key}>
                <label className="block text-xs text-gray-500 mb-1">
                  {label}
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={storeValue}
                    onChange={(e) => {
                      const v = e.target.value;
                      setCustomPaletteColor(template, key, v);
                      setTextInputs((prev) => ({ ...prev, [key]: v }));
                    }}
                    className="w-8 h-8 rounded cursor-pointer border-0 p-0 bg-transparent flex-shrink-0"
                    style={{ appearance: "none", WebkitAppearance: "none" }}
                  />
                  <input
                    type="text"
                    value={textValue}
                    maxLength={7}
                    placeholder={def}
                    onChange={(e) => {
                      const v = e.target.value;
                      setTextInputs((prev) => ({ ...prev, [key]: v }));
                      if (HEX_VALID.test(v))
                        setCustomPaletteColor(template, key, v);
                    }}
                    onBlur={() =>
                      setTextInputs((prev) => {
                        const n = { ...prev };
                        delete n[key];
                        return n;
                      })
                    }
                    className=" w-24 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-gray-100 font-mono placeholder-gray-600 focus:outline-none focus:border-purple-500"
                  />
                  {isDirty && (
                    <button
                      onClick={() => {
                        setCustomPaletteColor(template, key, def);
                        setTextInputs((prev) => ({ ...prev, [key]: def }));
                      }}
                      title="Ripristina default"
                      className="text-gray-600 hover:text-gray-300 text-xs px-1 flex-shrink-0"
                    >
                      ↺
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          <button
            onClick={() => {
              resetCustomPalette(template);
              setTextInputs({});
            }}
            disabled={!hasCustom}
            className="w-full py-1.5 rounded text-xs font-medium border border-gray-600 text-gray-400 hover:text-white hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ↺ Ripristina default
          </button>
          <p className="text-xs text-gray-600 leading-tight">
            Modifica i colori del template attivo.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Modale di conferma traduzione ────────────────────────────────────────────
function TranslateConfirmModal({
  onDownloadAndProceed,
  onProceed,
  onCancel,
  translating,
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.65)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9998,
        padding: "24px",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        style={{
          backgroundColor: "#1e293b",
          borderRadius: "14px",
          padding: "28px 24px",
          maxWidth: "360px",
          width: "100%",
          boxShadow: "0 24px 64px rgba(0,0,0,0.55)",
          border: "1px solid #334155",
        }}
      >
        <Warning
          size={32}
          weight="duotone"
          color="#f59e0b"
          style={{ marginBottom: 10 }}
        />
        <h2
          style={{
            color: "#f1f5f9",
            fontSize: "14px",
            fontWeight: 700,
            marginBottom: "10px",
            lineHeight: 1.4,
          }}
        >
          Attenzione: la traduzione sovrascriverà i testi
        </h2>
        <p
          style={{
            color: "#94a3b8",
            fontSize: "12px",
            lineHeight: 1.65,
            marginBottom: "22px",
          }}
        >
          La traduzione sovrascriverà i testi attuali. Ti consigliamo di
          scaricare un backup in formato JSON prima di procedere.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <button
            onClick={onDownloadAndProceed}
            disabled={translating}
            style={{
              padding: "10px 14px",
              borderRadius: "8px",
              backgroundColor: "#2563eb",
              color: "#fff",
              border: "none",
              cursor: translating ? "not-allowed" : "pointer",
              fontSize: "12px",
              fontWeight: 600,
              opacity: translating ? 0.6 : 1,
              textAlign: "left",
            }}
          >
            ⬇ Scarica backup e procedi
          </button>
          <button
            onClick={onProceed}
            disabled={translating}
            style={{
              padding: "10px 14px",
              borderRadius: "8px",
              backgroundColor: "#374151",
              color: "#e2e8f0",
              border: "1px solid #4b5563",
              cursor: translating ? "not-allowed" : "pointer",
              fontSize: "12px",
              opacity: translating ? 0.6 : 1,
              textAlign: "left",
            }}
          >
            {translating
              ? "⏳ Traduzione in corso…"
              : "Procedi senza scaricare"}
          </button>
          <button
            onClick={onCancel}
            disabled={translating}
            style={{
              padding: "10px 14px",
              borderRadius: "8px",
              backgroundColor: "transparent",
              color: "#6b7280",
              border: "1px solid #374151",
              cursor: translating ? "not-allowed" : "pointer",
              fontSize: "12px",
              opacity: translating ? 0.5 : 1,
            }}
          >
            Annulla
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── DeepL panel ──────────────────────────────────────────────────────────────
function DeepLPanel({ onTranslate }) {
  const deepLApiKey = useCVStore((s) => s.deepLApiKey);
  const setDeepLApiKey = useCVStore((s) => s.setDeepLApiKey);
  const targetLanguage = useCVStore((s) => s.targetLanguage);
  const setTargetLanguage = useCVStore((s) => s.setTargetLanguage);

  const [open, setOpen] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState("");

  const downloadBackup = () => {
    const state = useCVStore.getState();
    const {
      personal,
      skills,
      experience,
      education,
      certifications,
      languages,
      projects,
      template,
      designerPalette,
    } = state;
    const data = {
      personal,
      skills,
      experience,
      education,
      certifications,
      languages,
      projects,
      template,
      designerPalette,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const lang = targetLanguage.toLowerCase().replace("-", "_");
    const name = (personal.name || "cv")
      .replace(/[^a-z0-9]+/gi, "_")
      .toLowerCase();
    a.href = url;
    a.download = `${name}_${lang}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const doTranslate = async () => {
    if (!deepLApiKey.trim()) {
      setError("Inserisci la tua API key DeepL.");
      setShowModal(false);
      return;
    }
    setError("");
    setTranslating(true);
    try {
      await onTranslate(targetLanguage, deepLApiKey);
      setShowModal(false);
    } catch (e) {
      setError(e.message || "Errore DeepL.");
      setShowModal(false);
    } finally {
      setTranslating(false);
    }
  };

  const handleClickTranslate = () => {
    if (!deepLApiKey.trim()) {
      setError("Inserisci la tua API key DeepL.");
      return;
    }
    setError("");
    setShowModal(true);
  };

  return (
    <>
      <div className="border-t border-gray-700">
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Translate size={14} weight="duotone" />
            <span>Traduzione DeepL</span>
          </span>
          <span className="text-gray-600 text-xs">{open ? "▲" : "▼"}</span>
        </button>

        {open && (
          <div className="px-4 pb-4 space-y-2">
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                API Key
              </label>
              <div className="flex gap-1">
                <input
                  type={showKey ? "text" : "password"}
                  value={deepLApiKey}
                  onChange={(e) => setDeepLApiKey(e.target.value)}
                  placeholder="xxxxxxxx-xxxx-…:fx"
                  className="flex-1 min-w-0 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-gray-100 placeholder-gray-600 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={() => setShowKey((v) => !v)}
                  title={showKey ? "Nascondi" : "Mostra"}
                  className="px-1.5 bg-gray-700 border border-gray-600 rounded text-gray-400 hover:text-white text-xs"
                >
                  {showKey ? "🙈" : "👁"}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Lingua di destinazione
              </label>
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-gray-100 focus:outline-none focus:border-blue-500"
              >
                {UI_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-600 mt-1 leading-tight">
                I titoli delle sezioni si aggiornano subito nella preview.
              </p>
            </div>
            {error && <p className="text-xs text-red-400">{error}</p>}
            <button
              onClick={handleClickTranslate}
              disabled={translating}
              className="w-full py-1.5 rounded text-xs font-semibold bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white transition-colors"
            >
              {translating ? "⏳ Traduzione…" : "🌐 Traduci contenuto CV"}
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <TranslateConfirmModal
          translating={translating}
          onDownloadAndProceed={async () => {
            downloadBackup();
            await doTranslate();
          }}
          onProceed={doTranslate}
          onCancel={() => {
            if (!translating) setShowModal(false);
          }}
        />
      )}
    </>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
export function Sidebar({ activeSection, onSectionChange, onTranslate }) {
  return (
    <aside className="w-[220px] flex-shrink-0 bg-gray-900 text-white flex flex-col h-full">
      <div className="px-5 py-4 border-b border-gray-700">
        <h1 className="text-base font-semibold text-white tracking-tight">
          CV Builder
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">Editor professionale</p>
      </div>

      <nav className="flex-1 py-3 overflow-y-auto">
        <p className="px-5 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
          Sezioni
        </p>
        {SECTIONS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => onSectionChange(id)}
            className={`w-full flex items-center gap-3 px-5 py-2.5 text-sm transition-colors text-left ${
              activeSection === id
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <Icon size={16} weight="duotone" />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <PaletteCustomizerPanel />
      <DeepLPanel onTranslate={onTranslate} />

      <div className="px-5 py-3 border-t border-gray-700 text-xs text-gray-500">
        v1.0.0 · Client-side
      </div>
    </aside>
  );
}
