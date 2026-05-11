import { useRef, useState } from "react";
import { DotsSixVertical, Globe } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import { useCVStore } from "../../store/useCVStore";
import { SectionCard } from "../ui/SectionCard";

export const LEVELS_KEYS = [
  "levels.native",
  "levels.c2",
  "levels.c1",
  "levels.b2",
  "levels.b1",
  "levels.a2",
  "levels.a1",
];

// Normalizes old stored strings ("Madrelingua") to keys ("levels.native")
function normalizeLevelValue(value, t) {
  if (!value || value.startsWith("levels.")) return value;
  return LEVELS_KEYS.find((lk) => t(lk) === value) || value;
}

function LanguageCard({ lang, onUpdate, onRemove, dragHandleProps, isDragOver }) {
  const { t } = useTranslation();

  return (
    <div className={`border rounded-lg transition-colors ${isDragOver ? "border-blue-400 bg-blue-50" : "border-gray-200"}`}>
      <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 border-b border-gray-200 rounded-t-lg">
        <span
          {...dragHandleProps}
          className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing flex-shrink-0 select-none flex items-center"
        >
          <DotsSixVertical size={18} weight="bold" />
        </span>
        <input
          type="text"
          value={lang.language}
          onChange={(e) => onUpdate({ language: e.target.value })}
          placeholder={t("editor.languages.languagePh")}
          className="flex-1 bg-transparent text-xs font-semibold text-gray-700 placeholder-gray-300 focus:outline-none min-w-0"
        />
        <button
          onClick={onRemove}
          className="text-xs text-red-400 hover:text-red-600 flex-shrink-0 ml-1"
        >
          ✕
        </button>
      </div>
      <div className="px-3 pt-2.5 pb-3">
        <label className="block text-xs font-medium text-gray-500 mb-1">{t("editor.languages.level")}</label>
        <select
          value={normalizeLevelValue(lang.level, t)}
          onChange={(e) => onUpdate({ level: e.target.value })}
          className="w-full border border-gray-300 rounded px-2 py-2 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
        >
          <option value="">{t("editor.languages.selectLevel")}</option>
          {LEVELS_KEYS.map((lk) => (
            <option key={lk} value={lk}>{t(lk)}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export function LanguagesForm() {
  const languages      = useCVStore((s) => s.languages);
  const setLanguages   = useCVStore((s) => s.setLanguages);
  const addLanguage    = useCVStore((s) => s.addLanguage);
  const removeLanguage = useCVStore((s) => s.removeLanguage);
  const updateLanguage = useCVStore((s) => s.updateLanguage);
  const { t } = useTranslation();

  const dragIndex  = useRef(null);
  const canDragRef = useRef(false);
  const [dragOver, setDragOver] = useState(null);

  const reorder = (from, to) => {
    if (from === to || from === null) return;
    const arr = [...languages];
    const [moved] = arr.splice(from, 1);
    arr.splice(to, 0, moved);
    setLanguages(arr);
  };

  return (
    <SectionCard title={t("editor.languages.title")} icon={<Globe size={15} weight="duotone" />}>
      <div className="space-y-2.5">
        {languages.map((lang, i) => (
          <div
            key={i}
            draggable
            onDragStart={(e) => { if (!canDragRef.current) { e.preventDefault(); return; } dragIndex.current = i; }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(i); }}
            onDrop={() => { reorder(dragIndex.current, i); setDragOver(null); dragIndex.current = null; }}
            onDragEnd={() => { canDragRef.current = false; setDragOver(null); dragIndex.current = null; }}
            style={{ opacity: dragIndex.current === i ? 0.4 : 1 }}
          >
            <LanguageCard
              lang={lang}
              isDragOver={dragOver === i && dragIndex.current !== i}
              dragHandleProps={{
                title: t("editor.common.dragToReorder"),
                onMouseDown: () => { canDragRef.current = true; },
                onMouseUp:   () => { canDragRef.current = false; },
              }}
              onUpdate={(updates) => updateLanguage(i, updates)}
              onRemove={() => removeLanguage(i)}
            />
          </div>
        ))}
      </div>
      <button
        onClick={addLanguage}
        className="mt-3.5 w-full text-sm py-2.5 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg hover:border-blue-400 hover:text-blue-500 transition-colors"
      >
        {t("editor.languages.addLanguage")}
      </button>
    </SectionCard>
  );
}
