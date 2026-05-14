import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}
import {
  User,
  Wrench,
  Briefcase,
  GraduationCap,
  Certificate,
  Globe,
  Rocket,
  NotePencil,
  Palette,
  Translate,
  Warning,
  EyeIcon,
  EyeSlashIcon,
  EnvelopeSimple,
  TextAa,
} from "@phosphor-icons/react";
import { useCVStore } from "../../store/useCVStore";
import { LanguagePicker, CV_LANGUAGES } from "./LanguagePicker";

const CV_SECTIONS = [
  { id: "personal", Icon: User },
  { id: "skills", Icon: Wrench },
  { id: "experience", Icon: Briefcase },
  { id: "education", Icon: GraduationCap },
  { id: "certifications", Icon: Certificate },
  { id: "languages", Icon: Globe },
  { id: "projects", Icon: Rocket },
  { id: "note", Icon: NotePencil },
];

const EXTRA_SECTIONS = [{ id: "coverLetter", Icon: EnvelopeSimple }];

const PALETTE_KEYS = {
  tech: [
    { key: "bg", labelKey: "header", def: "#0f2644" },
    { key: "accent", labelKey: "accent", def: "#4ec9b0" },
  ],
  manager: [
    { key: "bg", labelKey: "header", def: "#1e3a5f" },
    { key: "accent", labelKey: "accent", def: "#c8a951" },
  ],
  designer: [
    { key: "accent", labelKey: "accent", def: "#C8B89A" },
    { key: "sidebarBg", labelKey: "sidebar", def: "#1A1A1A" },
    { key: "bg", labelKey: "background", def: "#0D0D0D" },
  ],
};

const HEX_VALID = /^#[0-9a-fA-F]{6}$/;

// ─── PaletteCustomizerPanel ───────────────────────────────────────────────────
function PaletteCustomizerPanel() {
  const template = useCVStore((s) => s.template);
  const customPalettes = useCVStore((s) => s.customPalettes);
  const setCustomPaletteColor = useCVStore((s) => s.setCustomPaletteColor);
  const resetCustomPalette = useCVStore((s) => s.resetCustomPalette);
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [textInputs, setTextInputs] = useState({});
  const [localColors, setLocalColors] = useState({});

  const debouncedSetColorRef = useRef(null);
  if (!debouncedSetColorRef.current) {
    debouncedSetColorRef.current = debounce(
      (tpl, k, v) => setCustomPaletteColor(tpl, k, v),
      80,
    );
  }
  const debouncedSetColor = debouncedSetColorRef.current;

  const keys = PALETTE_KEYS[template] || [];
  const current = customPalettes[template] || {};

  useEffect(() => {
    setTextInputs({});
    setLocalColors({});
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
          <span>{t("sidebar.palette.title")}</span>
          {hasCustom && (
            <span
              className="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block"
              title={t("sidebar.palette.modified")}
            />
          )}
        </span>
        <span className="text-gray-600 text-xs">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3">
          {keys.map(({ key, labelKey, def }) => {
            const label = t("sidebar.palette.keyLabels." + labelKey, {
              defaultValue: labelKey,
            });
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
                    value={localColors[key] ?? storeValue}
                    onChange={(e) => {
                      const v = e.target.value;
                      setLocalColors((prev) => ({ ...prev, [key]: v }));
                      setTextInputs((prev) => ({ ...prev, [key]: v }));
                      debouncedSetColor(template, key, v);
                    }}
                    onBlur={() => {
                      const v = localColors[key];
                      if (v) setCustomPaletteColor(template, key, v);
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
                    className="w-24 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-gray-100 font-mono placeholder-gray-600 focus:outline-none focus:border-purple-500"
                  />
                  {isDirty && (
                    <button
                      onClick={() => {
                        setCustomPaletteColor(template, key, def);
                        setTextInputs((prev) => ({ ...prev, [key]: def }));
                        setLocalColors((prev) => {
                          const n = { ...prev };
                          delete n[key];
                          return n;
                        });
                      }}
                      title={t("sidebar.palette.reset")}
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
              setLocalColors({});
            }}
            disabled={!hasCustom}
            className="w-full py-1.5 rounded text-xs font-medium border border-gray-600 text-gray-400 hover:text-white hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            {t("sidebar.palette.reset")}
          </button>
          <p className="text-xs text-gray-600 leading-tight">
            {t("sidebar.palette.hint")}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── FontSizeCustomizerPanel ──────────────────────────────────────────────────
const FONT_SIZE_KEYS = {
  tech: [
    { key: "name", labelKey: "name", def: 26, min: 16, max: 44 },
    { key: "role", labelKey: "role", def: 12, min: 8, max: 20 },
    {
      key: "sectionHeader",
      labelKey: "sectionHeader",
      def: 10,
      min: 7,
      max: 16,
    },
    { key: "body", labelKey: "body", def: 11, min: 8, max: 16 },
  ],
  manager: [
    { key: "name", labelKey: "name", def: 30, min: 16, max: 44 },
    { key: "role", labelKey: "role", def: 11, min: 8, max: 20 },
    {
      key: "sectionHeader",
      labelKey: "sectionHeader",
      def: 10,
      min: 7,
      max: 16,
    },
    { key: "body", labelKey: "body", def: 10, min: 8, max: 16 },
  ],
  designer: [
    { key: "name", labelKey: "name", def: 36, min: 20, max: 48 },
    { key: "role", labelKey: "role", def: 11, min: 8, max: 20 },
    {
      key: "sectionHeader",
      labelKey: "sectionHeader",
      def: 9,
      min: 7,
      max: 14,
    },
    { key: "body", labelKey: "body", def: 10, min: 8, max: 16 },
  ],
};

function FontSizeCustomizerPanel() {
  const template = useCVStore((s) => s.template);
  const customFontSizes = useCVStore((s) => s.customFontSizes);
  const setCustomFontSize = useCVStore((s) => s.setCustomFontSize);
  const resetCustomFontSizes = useCVStore((s) => s.resetCustomFontSizes);
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [localSizes, setLocalSizes] = useState({});

  const debouncedSetSizeRef = useRef(null);
  if (!debouncedSetSizeRef.current) {
    debouncedSetSizeRef.current = debounce(
      (tpl, k, v) => setCustomFontSize(tpl, k, v),
      80,
    );
  }
  const debouncedSetSize = debouncedSetSizeRef.current;

  useEffect(() => {
    setLocalSizes({});
  }, [template]);

  const keys = FONT_SIZE_KEYS[template] || [];
  const current = customFontSizes[template] || {};

  const getValue = (key, def) =>
    current[key] !== undefined ? current[key] : def;

  const hasCustom = Object.keys(current).length > 0;

  return (
    <div className="border-t border-gray-700">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
      >
        <span className="flex items-center gap-2">
          <TextAa size={14} weight="duotone" />
          <span>{t("sidebar.fontSizes.title")}</span>
          {hasCustom && (
            <span
              className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"
              title={t("sidebar.fontSizes.modified")}
            />
          )}
        </span>
        <span className="text-gray-600 text-xs">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3">
          {keys.map(({ key, labelKey, def, min, max }) => {
            const label = t("sidebar.fontSizes.keyLabels." + labelKey, {
              defaultValue: labelKey,
            });
            const val = getValue(key, def);
            const localVal = localSizes[key] ?? val;
            const isDirty = current[key] !== undefined && current[key] !== def;
            return (
              <div key={key}>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs text-gray-500">{label}</label>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="text-xs font-mono font-semibold"
                      style={{
                        color: isDirty ? "#34d399" : "#94a3b8",
                        minWidth: "28px",
                        textAlign: "right",
                      }}
                    >
                      {localVal}px
                    </span>
                    {isDirty && (
                      <button
                        onClick={() => {
                          setCustomFontSize(template, key, def);
                          setLocalSizes((prev) => {
                            const n = { ...prev };
                            delete n[key];
                            return n;
                          });
                        }}
                        title={t("sidebar.fontSizes.reset")}
                        className="text-gray-600 hover:text-gray-300 text-xs px-0.5 flex-shrink-0"
                      >
                        ↺
                      </button>
                    )}
                  </div>
                </div>
                <input
                  type="range"
                  min={min}
                  max={max}
                  step={1}
                  value={localVal}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setLocalSizes((prev) => ({ ...prev, [key]: v }));
                    debouncedSetSize(template, key, v);
                  }}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{
                    accentColor: isDirty ? "#34d399" : "#4b5563",
                    background: `linear-gradient(to right, ${isDirty ? "#34d399" : "#6b7280"} ${((val - min) / (max - min)) * 100}%, #374151 0%)`,
                  }}
                />
                <div className="flex justify-between text-gray-700 text-xs mt-0.5">
                  <span>{min}</span>
                  <span className="text-gray-600">
                    {def} {t("sidebar.fontSizes.defSuffix")}
                  </span>
                  <span>{max}</span>
                </div>
              </div>
            );
          })}

          <button
            onClick={() => resetCustomFontSizes(template)}
            disabled={!hasCustom}
            className="w-full py-1.5 rounded text-xs font-medium border border-gray-600 text-gray-400 hover:text-white hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors mt-1"
          >
            {t("sidebar.fontSizes.reset")}
          </button>
          <p className="text-xs text-gray-600 leading-tight">
            {t("sidebar.fontSizes.hint")}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Modale conferma traduzione ───────────────────────────────────────────────
function TranslateConfirmModal({
  onDownloadAndProceed,
  onProceed,
  onCancel,
  translating,
}) {
  const { t } = useTranslation();
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
          {t("sidebar.modal.title")}
        </h2>
        <p
          style={{
            color: "#94a3b8",
            fontSize: "12px",
            lineHeight: 1.65,
            marginBottom: "22px",
          }}
        >
          {t("sidebar.modal.body")}
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
              textAlign: "center",
            }}
          >
            {t("sidebar.modal.downloadAndProceed")}
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
              textAlign: "center",
            }}
          >
            {translating
              ? t("sidebar.modal.translating")
              : t("sidebar.modal.proceedWithout")}
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
            {t("sidebar.modal.cancel")}
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
  const personal = useCVStore((s) => s.personal);
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState("");

  const downloadBackup = () => {
    const state = useCVStore.getState();
    const {
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
      setError(t("sidebar.deepl.errorEmpty"));
      setShowModal(false);
      return;
    }
    setError("");
    setTranslating(true);
    try {
      await onTranslate(targetLanguage, deepLApiKey);
      setShowModal(false);
    } catch (e) {
      setError(e.message || t("sidebar.deepl.errorGeneric"));
      setShowModal(false);
    } finally {
      setTranslating(false);
    }
  };

  const handleClickTranslate = () => {
    if (!deepLApiKey.trim()) {
      setError(t("sidebar.deepl.errorEmpty"));
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
            <span>{t("sidebar.deepl.title")}</span>
          </span>
          <span className="text-gray-600 text-xs">{open ? "▲" : "▼"}</span>
        </button>

        {open && (
          <div className="px-4 pb-4 space-y-2">
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                {t("sidebar.deepl.apiKey")}
              </label>
              <div className="flex gap-1">
                <input
                  type={showKey ? "text" : "password"}
                  value={deepLApiKey}
                  onChange={(e) => setDeepLApiKey(e.target.value)}
                  placeholder="xxxxxxxx-xxxx-...:fx"
                  className="flex-1 min-w-0 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-gray-100 placeholder-gray-600 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={() => setShowKey((v) => !v)}
                  title={
                    showKey ? t("sidebar.deepl.hide") : t("sidebar.deepl.show")
                  }
                  className="px-1.5 bg-gray-700 border border-gray-600 rounded text-gray-400 hover:text-white text-xs"
                >
                  {showKey ? <EyeSlashIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                {t("sidebar.deepl.targetLang")}
              </label>
              <LanguagePicker
                value={targetLanguage}
                onChange={setTargetLanguage}
                languages={CV_LANGUAGES}
              />
              <p className="text-xs text-gray-600 mt-1 leading-tight">
                {t("sidebar.deepl.hint")}
              </p>
            </div>
            {error && <p className="text-xs text-red-400">{error}</p>}
            <button
              onClick={handleClickTranslate}
              disabled={translating}
              className="w-full py-1.5 rounded text-xs font-semibold bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white transition-colors"
            >
              {translating
                ? t("sidebar.deepl.translating")
                : t("sidebar.deepl.translate")}
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
  const uiLanguage = useCVStore((s) => s.uiLanguage);
  const setUiLanguage = useCVStore((s) => s.setUiLanguage);
  const { t } = useTranslation();

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white overflow-hidden">
      {/* Logo / Brand — fisso */}
      <div className="px-4 py-4 border-b border-gray-700 flex-shrink-0">
        <h1 className="text-sm font-bold text-white tracking-wide">
          CV Builder
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">{t("nav.subtitle")}</p>
      </div>

      {/* Language SelectButton — fisso */}
      <div className="px-4 py-2.5 border-b border-gray-700 flex-shrink-0">
        <div className="flex rounded-md overflow-hidden border border-gray-700 text-xs font-semibold">
          {["IT", "EN"].map((lang) => (
            <button
              key={lang}
              onClick={() => setUiLanguage(lang)}
              className={`flex-1 py-1.5 transition-colors ${
                uiLanguage === lang
                  ? "bg-blue-600 text-white"
                  : "bg-transparent text-gray-500 hover:text-gray-200"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Navigazione sezioni CV — scrollabile, occupa lo spazio disponibile */}
      <nav
        className="flex-1 min-h-0 overflow-y-auto py-2"
        style={{ scrollbarGutter: "stable" }}
      >
        <p className="px-4 py-1 text-xs font-semibold text-gray-600 uppercase tracking-widest">
          {t("nav.cvGroup")}
        </p>
        {CV_SECTIONS.map(({ id, Icon }) => (
          <button
            key={id}
            onClick={() => onSectionChange(id)}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors text-left ${
              activeSection === id
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            <Icon size={16} weight="duotone" />
            <span className="truncate">{t("nav.sections." + id)}</span>
          </button>
        ))}

        <div className="mx-4 my-2 border-t border-gray-700" />

        <p className="px-4 py-1 text-xs font-semibold text-gray-600 uppercase tracking-widest">
          {t("nav.docsGroup")}
        </p>
        {EXTRA_SECTIONS.map(({ id, Icon }) => (
          <button
            key={id}
            onClick={() => onSectionChange(id)}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors text-left ${
              activeSection === id
                ? "bg-indigo-600 text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            <Icon size={16} weight="duotone" />
            <span className="truncate">{t("nav.sections." + id)}</span>
          </button>
        ))}
      </nav>

      {/* Pannelli settings — ancorati in fondo, non scrollano con la nav */}
      <div
        className="flex-shrink-0 overflow-y-auto"
        style={{ scrollbarGutter: "stable" }}
      >
        <DeepLPanel onTranslate={onTranslate} />
        <PaletteCustomizerPanel />
        <FontSizeCustomizerPanel />
      </div>
    </div>
  );
}
