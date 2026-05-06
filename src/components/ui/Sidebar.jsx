import { useState, useEffect } from "react";
import { useCVStore } from "../../store/useCVStore";
import { DEEPL_LANGUAGES } from "../../services/translateCV";

const SECTIONS = [
  { id: "personal",       label: "Dati Personali",  icon: "👤" },
  { id: "skills",         label: "Competenze",       icon: "⚡" },
  { id: "experience",     label: "Esperienza",       icon: "💼" },
  { id: "education",      label: "Formazione",       icon: "🎓" },
  { id: "certifications", label: "Certificazioni",   icon: "🏆" },
  { id: "languages",      label: "Lingue",           icon: "🌍" },
  { id: "projects",       label: "Progetti",         icon: "🚀" },
];

// Colori chiave editabili per ogni template
const PALETTE_KEYS = {
  tech: [
    { key: "bg",     label: "Header",  def: "#0f2644" },
    { key: "accent", label: "Accento", def: "#4ec9b0" },
  ],
  manager: [
    { key: "bg",     label: "Header",  def: "#1e3a5f" },
    { key: "accent", label: "Accento", def: "#c8a951" },
  ],
  designer: [
    { key: "accent",    label: "Accento", def: "#C8B89A" },
    { key: "sidebarBg", label: "Sidebar", def: "#1A1A1A" },
    { key: "bg",        label: "Sfondo",  def: "#0D0D0D" },
  ],
};

// Regex per colore hex completo e valido (#RRGGBB)
const HEX_VALID = /^#[0-9a-fA-F]{6}$/;

// ─── PaletteCustomizerPanel ──────────────────────────────────────────────────
function PaletteCustomizerPanel() {
  const template              = useCVStore((s) => s.template);
  const customPalettes        = useCVStore((s) => s.customPalettes);
  const setCustomPaletteColor = useCVStore((s) => s.setCustomPaletteColor);
  const resetCustomPalette    = useCVStore((s) => s.resetCustomPalette);

  const [open, setOpen]       = useState(false);
  // Stato locale per i text input: permette di digitare liberamente
  // senza applicare valori parziali/invalidi al template
  const [textInputs, setTextInputs] = useState({});

  const keys    = PALETTE_KEYS[template] || [];
  const current = customPalettes[template] || {};

  // Reset text inputs locali quando si cambia template
  useEffect(() => { setTextInputs({}); }, [template]);

  // Colore valido salvato nello store (o default di palette se assente/invalido)
  const getStoreValue = (key, def) => {
    const stored = current[key];
    return HEX_VALID.test(stored) ? stored : def;
  };

  // Valore mostrato nel text input: stato locale se in corso di digitazione,
  // altrimenti il valore dallo store/default
  const getTextValue = (key, def) =>
    textInputs[key] !== undefined ? textInputs[key] : getStoreValue(key, def);

  // Il pallino viola appare solo se c'è almeno un colore valido salvato
  const hasCustom = Object.values(current).some(v => HEX_VALID.test(v));

  return (
    <div className="border-t border-gray-700">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
      >
        <span className="flex items-center gap-2">
          <span>🎨</span>
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
            const textValue  = getTextValue(key, def);
            const isDirty    = HEX_VALID.test(current[key]) && current[key] !== def;

            return (
              <div key={key}>
                <label className="block text-xs text-gray-500 mb-1">{label}</label>
                <div className="flex gap-2 items-center">

                  {/* Color picker nativo — riceve sempre un colore #RRGGBB valido */}
                  <input
                    type="color"
                    value={storeValue}
                    onChange={(e) => {
                      const v = e.target.value; // sempre #RRGGBB
                      setCustomPaletteColor(template, key, v);
                      // Sincronizza anche il text input locale
                      setTextInputs(prev => ({ ...prev, [key]: v }));
                    }}
                    className="w-8 h-8 rounded cursor-pointer border-0 p-0 bg-transparent flex-shrink-0"
                    style={{ appearance: "none", WebkitAppearance: "none" }}
                  />

                  {/* Text input hex: mostra la digitazione in corso senza
                      aggiornare il template finché il valore non è completo */}
                  <input
                    type="text"
                    value={textValue}
                    maxLength={7}
                    placeholder={def}
                    onChange={(e) => {
                      const v = e.target.value;
                      // Aggiorna solo la visualizzazione locale
                      setTextInputs(prev => ({ ...prev, [key]: v }));
                      // Salva nello store (e aggiorna il template) solo se completo
                      if (HEX_VALID.test(v)) {
                        setCustomPaletteColor(template, key, v);
                      }
                    }}
                    onBlur={() => {
                      // Al blur scarta i valori parziali: reverte al valore store/default
                      setTextInputs(prev => {
                        const next = { ...prev };
                        delete next[key];
                        return next;
                      });
                    }}
                    className="flex-1 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-gray-100 font-mono placeholder-gray-600 focus:outline-none focus:border-purple-500"
                  />

                  {/* Ripristina singolo colore */}
                  {isDirty && (
                    <button
                      onClick={() => {
                        setCustomPaletteColor(template, key, def);
                        setTextInputs(prev => ({ ...prev, [key]: def }));
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

          {/* Reset completo */}
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
            Modifica i colori del template attivo. Il cambio e immediato nella preview.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── DeepL panel ──────────────────────────────────────────────────────────────
function DeepLPanel({ onTranslate }) {
  const deepLApiKey    = useCVStore((s) => s.deepLApiKey);
  const setDeepLApiKey = useCVStore((s) => s.setDeepLApiKey);
  const [open,        setOpen]        = useState(false);
  const [targetLang,  setTargetLang]  = useState("EN-US");
  const [showKey,     setShowKey]     = useState(false);
  const [translating, setTranslating] = useState(false);
  const [error,       setError]       = useState("");

  const handleTranslate = async () => {
    if (!deepLApiKey.trim()) { setError("Inserisci la tua API key DeepL."); return; }
    setError("");
    setTranslating(true);
    try {
      await onTranslate(targetLang, deepLApiKey);
    } catch (e) {
      setError(e.message || "Errore DeepL.");
    } finally {
      setTranslating(false);
    }
  };

  return (
    <div className="border-t border-gray-700">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
      >
        <span className="flex items-center gap-2">
          <span>🌐</span> Traduzione DeepL
        </span>
        <span className="text-gray-600 text-xs">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-2">
          <div>
            <label className="block text-xs text-gray-500 mb-1">API Key</label>
            <div className="flex gap-1">
              <input
                type={showKey ? "text" : "password"}
                value={deepLApiKey}
                onChange={(e) => setDeepLApiKey(e.target.value)}
                placeholder="xxxxxxxx-xxxx-…:fx"
                className="flex-1 min-w-0 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-gray-100 placeholder-gray-600 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={() => setShowKey(v => !v)}
                title={showKey ? "Nascondi" : "Mostra"}
                className="px-1.5 bg-gray-700 border border-gray-600 rounded text-gray-400 hover:text-white text-xs"
              >
                {showKey ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Lingua di destinazione</label>
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-gray-100 focus:outline-none focus:border-blue-500"
            >
              {DEEPL_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <p className="text-xs text-gray-600 leading-tight">
            Sovrascrive il testo del CV. Esporta il JSON prima per fare un backup.
          </p>

          <button
            onClick={handleTranslate}
            disabled={translating}
            className="w-full py-1.5 rounded text-xs font-semibold bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white transition-colors"
          >
            {translating ? "⏳ Traduzione…" : "🌐 Traduci CV"}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
export function Sidebar({ activeSection, onSectionChange, onTranslate }) {
  return (
    <aside className="w-[220px] flex-shrink-0 bg-gray-900 text-white flex flex-col h-full">
      <div className="px-5 py-4 border-b border-gray-700">
        <h1 className="text-base font-semibold text-white tracking-tight">CV Builder</h1>
        <p className="text-xs text-gray-400 mt-0.5">Editor professionale</p>
      </div>

      <nav className="flex-1 py-3 overflow-y-auto">
        <p className="px-5 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
          Sezioni
        </p>
        {SECTIONS.map((section) => (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            className={`w-full flex items-center gap-3 px-5 py-2.5 text-sm transition-colors text-left ${
              activeSection === section.id
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <span className="text-base leading-none">{section.icon}</span>
            <span>{section.label}</span>
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
