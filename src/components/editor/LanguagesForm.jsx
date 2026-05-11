import { useRef, useState } from "react";
import { DotsSixVertical, Globe } from "@phosphor-icons/react";
import { useCVStore } from "../../store/useCVStore";
import { SectionCard } from "../ui/SectionCard";
import { useTranslation } from "react-i18next";
import { useEditorLabels } from "../../locales/editorLabels";

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
  const { languages: L, common: LC } = useEditorLabels();

  const dragIndex = useRef(null);
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
    <SectionCard title={L.title} icon={<Globe size={15} weight="duotone" />}>
      <div className="space-y-2.5 ">
        {languages.map((lang, i) => (
          <div
            key={i}
            draggable
            onDragStart={(e) => {
              if (!canDragRef.current) {
                e.preventDefault();
                return;
              }
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
              canDragRef.current = false;
              setDragOver(null);
              dragIndex.current = null;
            }}
            style={{ opacity: dragIndex.current === i ? 0.4 : 1 }}
            className={`flex flex-col gap-2 items-start rounded-lg transition-colors py-2  ${
              dragOver === i && dragIndex.current !== i
                ? "bg-blue-50 ring-1 ring-blue-300"
                : ""
            }`}
          >
            <div className="flex w-full gap-2">
              <span
                title={LC.dragToReorder}
                onMouseDown={() => {
                  canDragRef.current = true;
                }}
                onMouseUp={() => {
                  canDragRef.current = false;
                }}
                className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing flex-shrink-0 select-none flex items-center"
              >
                <DotsSixVertical size={18} weight="bold" />
              </span>
              <input
                type="text"
                value={lang.language}
                onChange={(e) =>
                  updateLanguage(i, { language: e.target.value })
                }
                placeholder={L.languagePh}
                className="flex-1 border border-gray-300 rounded px-2.5 py-2 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {languages.length > 1 && (
                <button
                  onClick={() => removeLanguage(i)}
                  className="text-gray-300 hover:text-red-400 text-sm flex-shrink-0"
                >
                  ✕
                </button>
              )}
            </div>
            <div className="flex w-full gap-2">
              <span
                title={LC.dragToReorder}
                onMouseDown={() => {
                  canDragRef.current = true;
                }}
                onMouseUp={() => {
                  canDragRef.current = false;
                }}
                className="text-white flex-shrink-0 select-none flex items-center"
              >
                <DotsSixVertical size={18} weight="bold" />
              </span>
              <select
                value={lang.level}
                onChange={(e) => updateLanguage(i, { level: e.target.value })}
                className="w-full border border-gray-300 rounded px-2 py-2  text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              >
                <option value="">{L.selectLevel}</option>
                {LEVELS_KEYS.map((lk) => (
                  <option key={lk} value={t(lk)}>
                    {t(lk)}
                  </option>
                ))}
              </select>
              <div className="w-4"></div>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={addLanguage}
        className="mt-3.5 w-full text-sm py-2.5 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg hover:border-blue-400 hover:text-blue-500 transition-colors"
      >
        {L.addLanguage}
      </button>
    </SectionCard>
  );
}
