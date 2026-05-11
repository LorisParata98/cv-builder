import { useRef, useState } from "react";
import { DotsSixVertical, Briefcase } from "@phosphor-icons/react";
import { useCVStore } from "../../store/useCVStore";
import { SectionCard } from "../ui/SectionCard";
import { DateField, DateInput } from "../ui/DateInput";
import { RichTextEditor } from "../ui/RichTextEditor";
import { useEditorLabels } from "../../locales/editorLabels";

function Field({ label, value, onChange, placeholder = "", type = "text" }) {
  return (
    <div className="mb-3.5">
      <label className="block text-xs font-medium text-gray-500 mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded px-2.5 py-2 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
  );
}


function ExperienceCard({
  exp,
  onUpdate,
  onRemove,
  dragHandleProps,
  isDragOver,
}) {
  const { experience: L, common: LC } = useEditorLabels();
  const [open, setOpen] = useState(true);

  return (
    <div
      className={`border rounded-lg mb-3.5 overflow-hidden transition-colors ${isDragOver ? "border-blue-400 bg-blue-50" : "border-gray-200"}`}
    >
      <div className="flex items-center gap-2 bg-gray-50 px-3 py-2.5 border-b border-gray-200">
        <span
          {...dragHandleProps}
          title={LC.dragToReorder}
          className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing flex-shrink-0 select-none flex items-center"
        >
          <DotsSixVertical size={18} weight="bold" />
        </span>
        <span
          className={`text-xs font-semibold truncate flex-1 ${exp.role ? "text-gray-600" : "text-gray-300"}`}
        >
          {exp.role || L.newExp}
          {exp.company ? ` @ ${exp.company}` : ""}
        </span>
        <button
          onClick={() => setOpen((v) => !v)}
          className="text-gray-400 hover:text-gray-600 flex-shrink-0 px-1 text-xs leading-none"
          title={open ? "Comprimi" : "Espandi"}
        >
          {open ? "▲" : "▼"}
        </button>
        <button
          onClick={onRemove}
          className="text-xs text-red-400 hover:text-red-600 flex-shrink-0"
        >
          {L.remove}
        </button>
      </div>

      {open && (
        <div className="px-3 pt-3">
          <Field
            label={L.role}
            value={exp.role}
            onChange={(v) => onUpdate({ role: v })}
            placeholder={L.rolePh}
          />
          <Field
            label={L.company}
            value={exp.company}
            onChange={(v) => onUpdate({ company: v })}
            placeholder={L.companyPh}
          />
          <Field
            label={L.location}
            value={exp.location}
            onChange={(v) => onUpdate({ location: v })}
            placeholder={L.locationPh}
          />

          <div className="flex gap-3">
            <div className="flex-1">
              <DateField
                label={L.startDate}
                value={exp.startDate}
                onChange={(v) => onUpdate({ startDate: v })}
              />
            </div>
            <div className="flex-1">
              <div className="mb-3.5">
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  {L.endDate}
                </label>
                <DateInput
                  value={exp.endDate === "present" ? "" : exp.endDate}
                  onChange={(v) => onUpdate({ endDate: v })}
                  disabled={exp.endDate === "present"}
                  className="w-full border border-gray-300 rounded px-2.5 py-2 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
                />
                {/* Toggle "In corso" */}
                <div className="flex items-center gap-1.5 mt-1.5">
                  <button
                    role="switch"
                    aria-checked={exp.endDate === "present"}
                    onClick={() => onUpdate({ endDate: exp.endDate === "present" ? "" : "present" })}
                    className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors flex-shrink-0 focus:outline-none ${
                      exp.endDate === "present" ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 rounded-full bg-white shadow transition-transform ${
                        exp.endDate === "present" ? "translate-x-3.5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                  <span
                    className={`text-xs transition-colors ${
                      exp.endDate === "present" ? "text-green-600 font-medium" : "text-gray-400"
                    }`}
                  >
                    {L.current}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-3.5">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              {L.description}
            </label>
            <RichTextEditor
              value={exp.description}
              onChange={(html) => onUpdate({ description: html })}
              placeholder={L.descriptionPh}
              minHeight={100}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export function ExperienceForm() {
  const experience = useCVStore((s) => s.experience);
  const setExperience = useCVStore((s) => s.setExperience);
  const addExperience = useCVStore((s) => s.addExperience);
  const removeExperience = useCVStore((s) => s.removeExperience);
  const updateExperience = useCVStore((s) => s.updateExperience);
  const { experience: L } = useEditorLabels();

  const dragIndex = useRef(null);
  const canDragRef = useRef(false);
  const [dragOver, setDragOver] = useState(null);

  const reorder = (from, to) => {
    if (from === to || from === null) return;
    const arr = [...experience];
    const [moved] = arr.splice(from, 1);
    arr.splice(to, 0, moved);
    setExperience(arr);
  };

  return (
    <SectionCard
      title={L.title}
      icon={<Briefcase size={15} weight="duotone" />}
    >
      {experience.map((exp, index) => (
        <div
          key={exp.id}
          draggable
          onDragStart={(e) => {
            if (!canDragRef.current) {
              e.preventDefault();
              return;
            }
            dragIndex.current = index;
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(index);
          }}
          onDrop={() => {
            reorder(dragIndex.current, index);
            setDragOver(null);
            dragIndex.current = null;
          }}
          onDragEnd={() => {
            canDragRef.current = false;
            setDragOver(null);
            dragIndex.current = null;
          }}
        >
          <ExperienceCard
            exp={exp}
            onUpdate={(updates) => updateExperience(exp.id, updates)}
            onRemove={() => removeExperience(exp.id)}
            isDragOver={dragOver === index && dragIndex.current !== index}
            dragHandleProps={{
              onMouseDown: () => {
                canDragRef.current = true;
              },
              onMouseUp: () => {
                canDragRef.current = false;
              },
            }}
          />
        </div>
      ))}
      <button
        onClick={addExperience}
        className="w-full text-sm py-2.5 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg hover:border-blue-400 hover:text-blue-500 transition-colors"
      >
        {L.addExperience}
      </button>
    </SectionCard>
  );
}
