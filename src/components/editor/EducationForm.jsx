import { useRef, useState } from "react";
import { DotsSixVertical, GraduationCap } from "@phosphor-icons/react";
import { useCVStore } from "../../store/useCVStore";
import { SectionCard } from "../ui/SectionCard";
import { AutoTextarea } from "../ui/AutoTextarea";
import { DateField } from "../ui/DateInput";
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
  const [open, setOpen] = useState(true);

  return (
    <div className={`border rounded-lg mb-3.5 overflow-hidden transition-colors ${isDragOver ? "border-blue-400 bg-blue-50" : "border-gray-200"}`}>
      <div className="flex items-center gap-2 bg-gray-50 px-3 py-2.5 border-b border-gray-200">
        <span
          {...dragHandleProps}
          title={LC.dragToReorder}
          className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing flex-shrink-0 select-none flex items-center"
        >
          <DotsSixVertical size={18} weight="bold" />
        </span>
        <span className={`text-xs font-semibold truncate flex-1 ${edu.institution ? "text-gray-600" : "text-gray-300"}`}>
          {edu.institution || L.newEdu}
        </span>
        <button
          onClick={() => setOpen((v) => !v)}
          className="text-gray-400 hover:text-gray-600 flex-shrink-0 px-1 text-xs leading-none"
          title={open ? "Comprimi" : "Espandi"}
        >
          {open ? "▲" : "▼"}
        </button>
        <button onClick={onRemove} className="text-xs text-red-400 hover:text-red-600 flex-shrink-0">
          {L.remove}
        </button>
      </div>

      {open && (
        <div className="px-3 pt-3">
          <Field label={L.institution} value={edu.institution} onChange={(v) => onUpdate({ institution: v })} placeholder={L.institutionPh} />
          <Field label={L.degree}      value={edu.degree}      onChange={(v) => onUpdate({ degree: v })}      placeholder={L.degreePh} />
          <Field label={L.field}       value={edu.field}       onChange={(v) => onUpdate({ field: v })}       placeholder={L.fieldPh} />
          <Field label={L.grade}       value={edu.grade}       onChange={(v) => onUpdate({ grade: v })}       placeholder={L.gradePh} />

          <div className="flex gap-3">
            <div className="flex-1">
              <DateField label={L.startDate} value={edu.startDate} onChange={(v) => onUpdate({ startDate: v })} />
            </div>
            <div className="flex-1">
              <DateField label={L.endDate} value={edu.endDate} onChange={(v) => onUpdate({ endDate: v })} />
            </div>
          </div>

          <div className="mb-3">
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
      )}
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

  const dragIndex  = useRef(null);
  const canDragRef = useRef(false);
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
          onDragStart={(e) => { if (!canDragRef.current) { e.preventDefault(); return; } dragIndex.current = index; }}
          onDragOver={(e) => { e.preventDefault(); setDragOver(index); }}
          onDrop={() => { reorder(dragIndex.current, index); setDragOver(null); dragIndex.current = null; }}
          onDragEnd={() => { canDragRef.current = false; setDragOver(null); dragIndex.current = null; }}
        >
          <EducationCard
            edu={edu}
            onUpdate={(updates) => updateEducation(edu.id, updates)}
            onRemove={() => removeEducation(edu.id)}
            isDragOver={dragOver === index && dragIndex.current !== index}
            dragHandleProps={{
              onMouseDown: () => { canDragRef.current = true; },
              onMouseUp:   () => { canDragRef.current = false; },
            }}
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
