import { useRef, useState } from "react";
import { DotsSixVertical, GraduationCap } from "@phosphor-icons/react";
import { useCVStore } from "../../store/useCVStore";
import { SectionCard } from "../ui/SectionCard";
import { AutoTextarea } from "../ui/AutoTextarea";
import { useEditorLabels } from "../../locales/editorLabels";

function Field({ label, value, onChange, placeholder = "" }) {
  return (
    <div className="mb-3.5">
      <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded px-2.5 py-2 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
  );
}

function EducationCard({ edu, onUpdate, onRemove, isDragOver, dragHandleProps }) {
  const { education: L, common: LC } = useEditorLabels();

  return (
    <div className={`border-b mb-3.5 transition-colors ${isDragOver ? "border-blue-400 rounded-lg bg-blue-50" : "border-gray-100"}`}>
      <div className="flex justify-between items-center mb-3">
        <span
          {...dragHandleProps}
          title={LC.dragToReorder}
          className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing mr-2 mt-0.5 flex-shrink-0 select-none flex items-center"
        >
          <DotsSixVertical size={18} weight="bold" />
        </span>
        <span className="text-xs font-semibold text-gray-600 truncate flex-1">
          {edu.institution || L.newEdu}
        </span>
        <button onClick={onRemove} className="text-xs text-red-400 hover:text-red-600 ml-2 flex-shrink-0">
          {L.remove}
        </button>
      </div>

      <Field label={L.institution} value={edu.institution} onChange={(v) => onUpdate({ institution: v })} placeholder={L.institutionPh} />
      <Field label={L.degree}      value={edu.degree}      onChange={(v) => onUpdate({ degree: v })}      placeholder={L.degreePh} />
      <Field label={L.field}       value={edu.field}       onChange={(v) => onUpdate({ field: v })}       placeholder={L.fieldPh} />
      <Field label={L.grade}       value={edu.grade}       onChange={(v) => onUpdate({ grade: v })}       placeholder={L.gradePh} />

      <div className="flex gap-3">
        <div className="flex-1">
          <Field label={L.startDate} value={edu.startDate} onChange={(v) => onUpdate({ startDate: v })} placeholder={L.datePh} />
        </div>
        <div className="flex-1">
          <Field label={L.endDate} value={edu.endDate} onChange={(v) => onUpdate({ endDate: v })} placeholder={L.datePh} />
        </div>
      </div>

      <div className="mb-2">
        <label className="block text-xs font-medium text-gray-500 mb-1.5">{L.thesis}</label>
        <AutoTextarea
          value={edu.thesis}
          onChange={(e) => onUpdate({ thesis: e.target.value })}
          placeholder={L.thesisPh}
          rows={2}
          className="w-full border border-gray-300 rounded px-2.5 py-2 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}

export function EducationForm() {
  const education       = useCVStore((s) => s.education);
  const setEducation    = useCVStore((s) => s.setEducation);
  const addEducation    = useCVStore((s) => s.addEducation);
  const removeEducation = useCVStore((s) => s.removeEducation);
  const updateEducation = useCVStore((s) => s.updateEducation);
  const { education: L } = useEditorLabels();

  const dragIndex = useRef(null);
  const [dragOver, setDragOver] = useState(null);

  const reorder = (from, to) => {
    if (from === to || from === null) return;
    const arr = [...education];
    const [moved] = arr.splice(from, 1);
    arr.splice(to, 0, moved);
    setEducation(arr);
  };

  return (
    <SectionCard title={L.title} icon={<GraduationCap size={15} weight="duotone" />}>
      {education.map((edu, index) => (
        <div
          key={edu.id}
          draggable
          onDragStart={() => { dragIndex.current = index; }}
          onDragOver={(e) => { e.preventDefault(); setDragOver(index); }}
          onDrop={() => { reorder(dragIndex.current, index); setDragOver(null); dragIndex.current = null; }}
          onDragEnd={() => { setDragOver(null); dragIndex.current = null; }}
          style={{ opacity: dragIndex.current === index ? 0.5 : 1 }}
        >
          <EducationCard
            edu={edu}
            onUpdate={(updates) => updateEducation(edu.id, updates)}
            onRemove={() => removeEducation(edu.id)}
            isDragOver={dragOver === index && dragIndex.current !== index}
            dragHandleProps={{}}
          />
        </div>
      ))}
      <button
        onClick={addEducation}
        className="w-full text-sm py-2.5 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg hover:border-blue-400 hover:text-blue-500 transition-colors"
      >
        {L.addEducation}
      </button>
    </SectionCard>
  );
}
