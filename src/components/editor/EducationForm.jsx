import { useCVStore } from "../../store/useCVStore";
import { SectionCard } from "../ui/SectionCard";

function Field({ label, value, onChange, placeholder = "" }) {
  return (
    <div className="mb-2">
      <label className="block text-xs font-medium text-gray-500 mb-0.5">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
  );
}

function EducationCard({ edu, onUpdate, onRemove }) {
  return (
    <div className="border border-gray-200 rounded-lg p-3 mb-3 bg-white">
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-semibold text-gray-600 truncate flex-1">
          {edu.institution || "Nuovo titolo di studio"}
        </span>
        <button onClick={onRemove} className="text-xs text-red-400 hover:text-red-600 ml-2 flex-shrink-0">
          Rimuovi
        </button>
      </div>

      <Field label="Istituto" value={edu.institution} onChange={(v) => onUpdate({ institution: v })} placeholder="Es. Politecnico di Milano" />
      <Field label="Titolo" value={edu.degree} onChange={(v) => onUpdate({ degree: v })} placeholder="Es. Laurea Magistrale" />
      <Field label="Indirizzo / Materia" value={edu.field} onChange={(v) => onUpdate({ field: v })} placeholder="Es. Ingegneria Informatica" />
      <Field label="Voto" value={edu.grade} onChange={(v) => onUpdate({ grade: v })} placeholder="Es. 110/110" />

      <div className="flex gap-2">
        <div className="flex-1">
          <Field label="Inizio" value={edu.startDate} onChange={(v) => onUpdate({ startDate: v })} placeholder="YYYY-MM" />
        </div>
        <div className="flex-1">
          <Field label="Fine" value={edu.endDate} onChange={(v) => onUpdate({ endDate: v })} placeholder="YYYY-MM" />
        </div>
      </div>

      <div className="mb-2">
        <label className="block text-xs font-medium text-gray-500 mb-0.5">Tesi (opzionale)</label>
        <textarea
          value={edu.thesis}
          onChange={(e) => onUpdate({ thesis: e.target.value })}
          placeholder="Titolo o argomento della tesi..."
          rows={2}
          className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
        />
      </div>
    </div>
  );
}

export function EducationForm() {
  const education = useCVStore((s) => s.education);
  const addEducation = useCVStore((s) => s.addEducation);
  const removeEducation = useCVStore((s) => s.removeEducation);
  const updateEducation = useCVStore((s) => s.updateEducation);

  return (
    <SectionCard title="Formazione" icon="🎓">
      {education.map((edu) => (
        <EducationCard
          key={edu.id}
          edu={edu}
          onUpdate={(updates) => updateEducation(edu.id, updates)}
          onRemove={() => removeEducation(edu.id)}
        />
      ))}
      <button
        onClick={addEducation}
        className="w-full text-sm py-2 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg hover:border-blue-400 hover:text-blue-500 transition-colors"
      >
        + Aggiungi titolo di studio
      </button>
    </SectionCard>
  );
}
