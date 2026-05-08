import { useRef, useState } from "react";
import { DotsSixVertical, Briefcase } from "@phosphor-icons/react";
import { useCVStore } from "../../store/useCVStore";
import { SectionCard } from "../ui/SectionCard";
import { AutoTextarea } from "../ui/AutoTextarea";
import { useEditorLabels } from "../../locales/editorLabels";

function Field({ label, value, onChange, placeholder = "", type = "text" }) {
  return (
    <div className="mb-3.5">
      <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
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

function BulletList({ bullets, onUpdate }) {
  const { experience: L, common: LC } = useEditorLabels();

  const handleChange = (i, value) => {
    const updated = bullets.map((b, bi) => (bi === i ? value : b));
    onUpdate(updated);
  };
  const handleAdd    = () => onUpdate([...bullets, ""]);
  const handleRemove = (i) => {
    if (bullets.length <= 1) return;
    onUpdate(bullets.filter((_, bi) => bi !== i));
  };
  const handleKeyDown = (e, i) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const updated = [...bullets];
      updated.splice(i + 1, 0, "");
      onUpdate(updated);
      setTimeout(() => {
        const inputs = e.target.closest("ul")?.querySelectorAll("textarea");
        if (inputs?.[i + 1]) inputs[i + 1].focus();
      }, 50);
    }
    if (e.key === "Backspace" && e.target.value === "" && bullets.length > 1) {
      e.preventDefault();
      handleRemove(i);
    }
  };

  return (
    <div className="mt-3 mb-4">
      <label className="block text-xs font-medium text-gray-500 mb-1.5">
        {L.bullets}<br />
        <span className="text-gray-400 font-normal">{L.bulletsHint}</span>
      </label>
      <ul className="space-y-2.5">
        {bullets.map((bullet, i) => (
          <li key={i} className="flex gap-1.5 items-start">
            <span className="text-blue-400 mt-2 flex-shrink-0 text-xs">•</span>
            <AutoTextarea
              value={bullet}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              placeholder={L.bulletPh}
              rows={2}
              className="flex-1 border border-gray-300 rounded px-2.5 py-2 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {bullets.length > 1 && (
              <button onClick={() => handleRemove(i)} className="text-gray-300 hover:text-red-400 mt-1.5 flex-shrink-0 text-sm leading-none">✕</button>
            )}
          </li>
        ))}
      </ul>
      <button onClick={handleAdd} className="mt-2 text-xs text-blue-500 hover:text-blue-700">
        {L.addBullet}
      </button>
    </div>
  );
}

function ExperienceCard({ exp, onUpdate, onRemove, dragHandleProps, isDragOver }) {
  const { experience: L, common: LC } = useEditorLabels();

  return (
    <div className={`border-b mb-3.5 rounded-lg px-2 pt-2 transition-colors ${isDragOver ? "border-blue-400 border bg-blue-50" : "border-gray-100"}`}>
      <div className="flex justify-between items-center mb-3">
        <span
          {...dragHandleProps}
          title={LC.dragToReorder}
          className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing mr-2 mt-0.5 flex-shrink-0 select-none flex items-center"
        >
          <DotsSixVertical size={18} weight="bold" />
        </span>
        <span className={`text-xs font-semibold truncate flex-1 ${exp.role ? "text-gray-600" : "text-gray-300"}`}>
          {exp.role || L.newExp}
          {exp.company ? ` @ ${exp.company}` : ""}
        </span>
        <button onClick={onRemove} className="text-xs text-red-400 hover:text-red-600 ml-2 flex-shrink-0">
          {L.remove}
        </button>
      </div>

      <Field label={L.role}     value={exp.role}     onChange={(v) => onUpdate({ role: v })}     placeholder={L.rolePh} />
      <Field label={L.company}  value={exp.company}  onChange={(v) => onUpdate({ company: v })}  placeholder={L.companyPh} />
      <Field label={L.location} value={exp.location} onChange={(v) => onUpdate({ location: v })} placeholder={L.locationPh} />

      <div className="flex gap-3">
        <div className="flex-1">
          <Field label={L.startDate} value={exp.startDate} onChange={(v) => onUpdate({ startDate: v })} placeholder={L.datePh} />
        </div>
        <div className="flex-1">
          <div className="mb-3.5">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">{L.endDate}</label>
            <div className="flex gap-1.5">
              <input
                type="text"
                value={exp.endDate === "present" ? "" : exp.endDate}
                onChange={(e) => onUpdate({ endDate: e.target.value })}
                placeholder={L.datePh}
                disabled={exp.endDate === "present"}
                className="flex-1 border border-gray-300 rounded px-2.5 py-2 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
              />
              <button
                onClick={() => onUpdate({ endDate: exp.endDate === "present" ? "" : "present" })}
                className={`px-2 py-1.5 text-xs rounded border transition-colors flex-shrink-0 ${
                  exp.endDate === "present"
                    ? "bg-green-100 text-green-700 border-green-300"
                    : "bg-gray-100 text-gray-500 border-gray-300 hover:bg-gray-200"
                }`}
              >
                {L.current}
              </button>
            </div>
          </div>
        </div>
      </div>

      <BulletList bullets={exp.bullets} onUpdate={(bullets) => onUpdate({ bullets })} />
    </div>
  );
}

export function ExperienceForm() {
  const experience      = useCVStore((s) => s.experience);
  const setExperience   = useCVStore((s) => s.setExperience);
  const addExperience   = useCVStore((s) => s.addExperience);
  const removeExperience = useCVStore((s) => s.removeExperience);
  const updateExperience = useCVStore((s) => s.updateExperience);
  const { experience: L } = useEditorLabels();

  const dragIndex = useRef(null);
  const [dragOver, setDragOver] = useState(null);

  const reorder = (from, to) => {
    if (from === to || from === null) return;
    const arr = [...experience];
    const [moved] = arr.splice(from, 1);
    arr.splice(to, 0, moved);
    setExperience(arr);
  };

  return (
    <SectionCard title={L.title} icon={<Briefcase size={15} weight="duotone" />}>
      {experience.map((exp, index) => (
        <div
          key={exp.id}
          draggable
          onDragStart={() => { dragIndex.current = index; }}
          onDragOver={(e) => { e.preventDefault(); setDragOver(index); }}
          onDrop={() => { reorder(dragIndex.current, index); setDragOver(null); dragIndex.current = null; }}
          onDragEnd={() => { setDragOver(null); dragIndex.current = null; }}
          style={{ opacity: dragIndex.current === index ? 0.5 : 1 }}
        >
          <ExperienceCard
            exp={exp}
            onUpdate={(updates) => updateExperience(exp.id, updates)}
            onRemove={() => removeExperience(exp.id)}
            isDragOver={dragOver === index && dragIndex.current !== index}
            dragHandleProps={{}}
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
