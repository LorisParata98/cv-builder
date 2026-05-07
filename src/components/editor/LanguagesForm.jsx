import { useRef, useState } from "react";
import { DotsSixVertical, Globe } from "@phosphor-icons/react";
import { useCVStore } from "../../store/useCVStore";
import { SectionCard } from "../ui/SectionCard";
import { useTranslation } from "react-i18next";

export const LEVELS_KEYS = [
  "levels.native",
  "levels.c2",
  "levels.c1",
  "levels.b2",
  "levels.b1",
  "levels.a2",
  "levels.a1",
];

export function LanguagesForm() {
  const { t } = useTranslation();
  const languages = useCVStore((s) => s.languages);
  const setLanguages = useCVStore((s) => s.setLanguages);
  const addLanguage = useCVStore((s) => s.addLanguage);
  const removeLanguage = useCVStore((s) => s.removeLanguage);
  const updateLanguage = useCVStore((s) => s.updateLanguage);

  const dragIndex = useRef(null);
  const [dragOver, setDragOver] = useState(null);

  const reorder = (from, to) => {
    if (from === to || from === null) return;
    const arr = [...languages];
    const [moved] = arr.splice(from, 1);
    arr.splice(to, 0, moved);
    setLanguages(arr);
  };

  return (
    <SectionCard title="Lingue" icon={<Globe size={15} weight="duotone" />}>
      <div className="space-y-2.5">
        {languages.map((lang, i) => (
          <div
            key={i}
            draggable
            onDragStart={() => {
              dragIndex.current = i;
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(i);
            }}
            onDrop={() => {
              reorder(dragIndex.current, i);
              setDragOver(null);
              dragIndex.current = null;
            }}
            onDragEnd={() => {
              setDragOver(null);
              dragIndex.current = null;
            }}
            style={{ opacity: dragIndex.current === i ? 0.4 : 1 }}
            className={`flex gap-2 items-center rounded-lg transition-colors ${
              dragOver === i && dragIndex.current !== i
                ? "bg-blue-50 ring-1 ring-blue-300"
                : ""
            }`}
          >
            <span
              title="Trascina per riordinare"
              className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing flex-shrink-0 select-none flex items-center"
            >
              <DotsSixVertical size={18} weight="bold" />
            </span>
            <input
              type="text"
              value={lang.language}
              onChange={(e) => updateLanguage(i, { language: e.target.value })}
              placeholder="Es. Inglese"
              className=" w-24 border border-gray-300 rounded px-2.5 py-2 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <select
              value={lang.level}
              onChange={(e) => updateLanguage(i, { level: e.target.value })}
              className="w-32 border border-gray-300 rounded px-2 py-2 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="">Seleziona livello</option>
              {LEVELS_KEYS.map((l) => (
                <option key={l} value={t(l)}>
                  {t(l)}
                </option>
              ))}
            </select>
            {languages.length > 1 && (
              <button
                onClick={() => removeLanguage(i)}
                className="text-gray-300 hover:text-red-400 text-sm flex-shrink-0"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
      <button
        onClick={addLanguage}
        className="mt-3.5 w-full text-sm py-2.5 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg hover:border-blue-400 hover:text-blue-500 transition-colors"
      >
        + Aggiungi lingua
      </button>
    </SectionCard>
  );
}
