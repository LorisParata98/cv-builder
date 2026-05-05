import { useCVStore } from "../../store/useCVStore";
import { SectionCard } from "../ui/SectionCard";

const LEVELS = [
  "Madrelingua",
  "C2 – Padronanza",
  "C1 – Avanzato",
  "B2 – Intermedio superiore",
  "B1 – Intermedio",
  "A2 – Elementare",
  "A1 – Base",
];

export function LanguagesForm() {
  const languages = useCVStore((s) => s.languages);
  const addLanguage = useCVStore((s) => s.addLanguage);
  const removeLanguage = useCVStore((s) => s.removeLanguage);
  const updateLanguage = useCVStore((s) => s.updateLanguage);

  return (
    <SectionCard title="Lingue" icon="🌍">
      <div className="space-y-2">
        {languages.map((lang, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input
              type="text"
              value={lang.language}
              onChange={(e) => updateLanguage(i, { language: e.target.value })}
              placeholder="Es. Inglese"
              className="flex-1 border border-gray-300 rounded px-2.5 py-1.5 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <select
              value={lang.level}
              onChange={(e) => updateLanguage(i, { level: e.target.value })}
              className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="">Seleziona livello</option>
              {LEVELS.map((l) => (
                <option key={l} value={l}>{l}</option>
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
        className="mt-3 w-full text-sm py-2 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg hover:border-blue-400 hover:text-blue-500 transition-colors"
      >
        + Aggiungi lingua
      </button>
    </SectionCard>
  );
}
