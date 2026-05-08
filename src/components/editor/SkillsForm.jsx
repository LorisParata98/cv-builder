import { useRef, useState } from "react";
import { DotsSixVertical, Lightning, Wrench } from "@phosphor-icons/react";
import { useCVStore } from "../../store/useCVStore";
import { SectionCard } from "../ui/SectionCard";
import { generateAtsKeywords } from "../../data/frameworkVersions";
import { ATS_KEYWORDS } from "../../data/atsKeywords";
import { useEditorLabels } from "../../locales/editorLabels";

function AtsHintsPanel({ template }) {
  const [open, setOpen] = useState(false);
  const { skills: L } = useEditorLabels();
  const keywords = ATS_KEYWORDS[template] || ATS_KEYWORDS.tech;
  const profileLabel = { tech: "Tech", manager: "Manager", designer: "Designer" }[template] || "Tech";

  return (
    <div className="mb-3 border border-green-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-2 bg-green-50 hover:bg-green-100 transition-colors text-left"
      >
        <span className="text-xs font-semibold text-green-800 flex items-center gap-2">
          <Lightning size={13} weight="fill" className="text-green-700" />
          {L.atsHintTitle} {profileLabel}
        </span>
        <span className="text-green-600 text-xs">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="px-3 py-3 bg-white">
          <p className="text-xs text-gray-500 mb-2">{L.atsHintBody}</p>
          <div className="flex flex-wrap gap-1">
            {keywords.map((kw, i) => (
              <span key={i} className="text-xs bg-green-50 border border-green-300 text-green-800 px-2 py-0.5 rounded-full">
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TagEditor({ tag, onUpdate, onRemove }) {
  const [showAts, setShowAts] = useState(false);
  const { skills: L } = useEditorLabels();

  const handleAutoGenerate = () => {
    onUpdate({ atsKeywords: generateAtsKeywords(tag.label) });
  };

  return (
    <div className="mb-4">
      <div className="flex gap-1.5 items-center mb-2">
        <input
          type="text"
          value={tag.label}
          onChange={(e) => onUpdate({ label: e.target.value })}
          placeholder={L.skillPh}
          className="flex-1 min-w-0 border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          onClick={onRemove}
          className="text-xs w-10 h-6 flex items-center justify-center text-gray-400 hover:text-red-500 flex-shrink-0"
          title={L.removeSkill}
        >
          ✕
        </button>
      </div>

      <div className="flex gap-1.5 items-center">
        <input
          type="text"
          value={tag.versionsRange || ""}
          onChange={(e) => onUpdate({ versionsRange: e.target.value || null })}
          placeholder={L.versionPh}
          className="flex-1 min-w-0 border border-gray-300 rounded px-2 py-1.5 text-xs text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          onClick={() => setShowAts((v) => !v)}
          className={`text-xs w-10 px-2 py-1 rounded border flex-shrink-0 transition-colors ${
            showAts
              ? "bg-green-100 text-green-700 border-green-300"
              : "bg-gray-100 text-gray-500 border-gray-300 hover:bg-green-50 hover:text-green-600 hover:border-green-300"
          }`}
        >
          ATS
        </button>
      </div>

      {showAts && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500 font-medium">{L.atsKeywords}</span>
            <button
              onClick={handleAutoGenerate}
              className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-200 rounded hover:bg-blue-100"
            >
              {L.autoGenerate}
            </button>
          </div>
          <div className="flex flex-wrap gap-1 mb-1">
            {(tag.atsKeywords || []).map((kw, ki) => (
              <span key={ki} className="inline-flex items-center gap-1 text-xs bg-gray-100 border border-gray-300 rounded px-2 py-0.5">
                {kw}
                <button
                  onClick={() => onUpdate({ atsKeywords: (tag.atsKeywords || []).filter((_, i) => i !== ki) })}
                  className="text-gray-400 hover:text-red-500 leading-none"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            placeholder={L.addKeywordPh}
            className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.target.value.trim()) {
                onUpdate({ atsKeywords: [...(tag.atsKeywords || []), e.target.value.trim()] });
                e.target.value = "";
              }
            }}
          />
          <p className="text-xs text-gray-400 mt-1">{L.atsInvisible}</p>
        </div>
      )}
    </div>
  );
}

function CategoryEditor({ category, index, isDragOver, dragHandleProps, onUpdateCategory, onRemoveCategory, onAddTag, onRemoveTag, onUpdateTag }) {
  const { skills: L, common: LC } = useEditorLabels();

  return (
    <div className={`border rounded-lg mb-2 overflow-hidden transition-colors ${isDragOver ? "border-blue-400" : "border-gray-200"}`}>
      <div className="flex items-center gap-2 bg-gray-50 px-3 py-2.5 border-b border-gray-200">
        <span
          {...dragHandleProps}
          title={LC.dragToReorder}
          className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing flex-shrink-0 select-none flex items-center"
        >
          <DotsSixVertical size={18} weight="bold" />
        </span>
        <input
          type="text"
          value={category.category}
          onChange={(e) => onUpdateCategory(index, { category: e.target.value })}
          placeholder={L.categoryPh}
          className="flex-1 min-w-0 bg-transparent border-none text-sm font-semibold text-gray-800 focus:outline-none"
        />
        <button onClick={() => onRemoveCategory(index)} className="text-xs text-red-400 hover:text-red-600 flex-shrink-0">✕</button>
      </div>
      <div className="p-3">
        {category.tags.map((tag, ti) => (
          <TagEditor key={ti} tag={tag} onUpdate={(u) => onUpdateTag(index, ti, u)} onRemove={() => onRemoveTag(index, ti)} />
        ))}
        <button
          onClick={() => onAddTag(index, { label: "", versionsRange: null, atsKeywords: [] })}
          className="w-full text-xs py-2 border border-dashed border-blue-300 text-blue-500 rounded hover:bg-blue-50 transition-colors"
        >
          {L.addSkill}
        </button>
      </div>
    </div>
  );
}

export function SkillsForm() {
  const template           = useCVStore((s) => s.template);
  const skills             = useCVStore((s) => s.skills);
  const setSkills          = useCVStore((s) => s.setSkills);
  const addSkillCategory   = useCVStore((s) => s.addSkillCategory);
  const removeSkillCategory = useCVStore((s) => s.removeSkillCategory);
  const updateSkillCategory = useCVStore((s) => s.updateSkillCategory);
  const addSkillTag        = useCVStore((s) => s.addSkillTag);
  const removeSkillTag     = useCVStore((s) => s.removeSkillTag);
  const updateSkillTag     = useCVStore((s) => s.updateSkillTag);
  const { skills: L, common: LC } = useEditorLabels();

  const dragIndex = useRef(null);
  const [dragOver, setDragOver] = useState(null);

  const reorder = (from, to) => {
    if (from === to || from === null) return;
    const arr = [...skills];
    const [moved] = arr.splice(from, 1);
    arr.splice(to, 0, moved);
    setSkills(arr);
  };

  return (
    <SectionCard title={L.title} icon={<Wrench size={15} weight="duotone" />}>
      <AtsHintsPanel template={template} />
      {skills.map((cat, i) => (
        <div
          key={i}
          draggable
          onDragStart={() => { dragIndex.current = i; }}
          onDragOver={(e) => { e.preventDefault(); setDragOver(i); }}
          onDrop={() => { reorder(dragIndex.current, i); setDragOver(null); dragIndex.current = null; }}
          onDragEnd={() => { setDragOver(null); dragIndex.current = null; }}
          style={{ opacity: dragIndex.current === i ? 0.5 : 1 }}
        >
          <CategoryEditor
            category={cat}
            index={i}
            isDragOver={dragOver === i && dragIndex.current !== i}
            dragHandleProps={{}}
            onUpdateCategory={updateSkillCategory}
            onRemoveCategory={removeSkillCategory}
            onAddTag={addSkillTag}
            onRemoveTag={removeSkillTag}
            onUpdateTag={updateSkillTag}
          />
        </div>
      ))}
      <button
        onClick={() => addSkillCategory()}
        className="w-full text-sm py-2 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg hover:border-blue-400 hover:text-blue-500 transition-colors"
      >
        {L.addCategory}
      </button>
    </SectionCard>
  );
}
