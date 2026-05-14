import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { DotsSixVertical, Lightning, Wrench } from "@phosphor-icons/react";
import { useCVStore } from "../../store/useCVStore";
import { SectionCard } from "../ui/SectionCard";
import { generateAtsKeywords } from "../../data/frameworkVersions";
import { ATS_KEYWORDS } from "../../data/atsKeywords";
import { useTranslation } from "react-i18next";

// ─── InfoTooltip ─────────────────────────────────────────────────────────────
// Portal-based: bypasses overflow-hidden/overflow-y-auto on all ancestor containers
function InfoTooltip({ text, variant = "gray" }) {
  const colors = variant === "green"
    ? "border-green-600 text-green-700"
    : "border-gray-400 text-gray-400";
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);

  const show = () => {
    if (triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      setPos({ top: r.top - 10, left: r.left + r.width / 2 });
    }
    setVisible(true);
  };

  return (
    <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
      <span
        ref={triggerRef}
        onMouseEnter={show}
        onMouseLeave={() => setVisible(false)}
        className={`inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border ${colors} text-[9px] font-bold cursor-default select-none leading-none`}
      >
        ?
      </span>
      {visible && createPortal(
        <div
          style={{
            position: "fixed",
            top: pos.top,
            left: pos.left,
            transform: "translate(-50%, -100%)",
            zIndex: 9999,
            pointerEvents: "none",
          }}
          className="w-56 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 leading-relaxed shadow-xl"
        >
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </div>,
        document.body
      )}
    </div>
  );
}

function AtsHintsPanel({ template }) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
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
          {t("editor.skills.atsHintTitle")} {profileLabel}
          <InfoTooltip text={t("editor.skills.atsTooltip")} variant="green" />
        </span>
        <span className="text-green-600 text-xs">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="px-3 py-3 bg-white">
          <p className="text-xs text-gray-500 mb-2">{t("editor.skills.atsHintBody")}</p>
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

// ─── TagEditor: chip (view) ↔ form (edit) ─────────────────────────────────────
function TagEditor({ tag, isEditing, onStartEdit, onStopEdit, onUpdate, onRemove, chipDragProps }) {
  const { t } = useTranslation();
  const [showAts, setShowAts] = useState(false);
  const nameRef = useRef(null);

  useEffect(() => {
    if (isEditing && nameRef.current) {
      nameRef.current.focus();
      nameRef.current.select();
    }
  }, [isEditing]);

  const handleDone = () => {
    if (!tag.label.trim()) {
      onRemove();
    } else {
      setShowAts(false);
      onStopEdit();
    }
  };

  const handleAutoGenerate = () => {
    onUpdate({ atsKeywords: generateAtsKeywords(tag.label) });
  };

  // ── Chip (view mode) ──────────────────────────────────────────────────────
  if (!isEditing) {
    return (
      <div
        onClick={onStartEdit}
        {...(chipDragProps || {})}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-gray-200 bg-white hover:bg-blue-50 hover:border-blue-300 cursor-pointer group transition-colors"
        title={t("editor.skills.editSkill")}
      >
        <span className="text-xs font-medium text-gray-700 leading-tight">
          {tag.label || "…"}
        </span>
        {tag.versionsRange && (
          <span className="text-xs text-gray-400 leading-tight">· {tag.versionsRange}</span>
        )}
        {(tag.atsKeywords || []).length > 0 && (
          <span
            className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0"
            title={t("editor.skills.hasAts")}
          />
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="text-gray-300 group-hover:text-gray-400 hover:!text-red-400 ml-0.5 leading-none text-xs flex-shrink-0"
          aria-label={t("editor.skills.removeSkill")}
        >
          ×
        </button>
      </div>
    );
  }

  // ── Edit mode ──────────────────────────────────────────────────────────────
  return (
    <div className="w-full border border-blue-200 rounded-lg p-2.5 bg-blue-50/40 mb-1">
      {/* Nome + Done + Rimuovi */}
      <div className="flex gap-1.5 items-center mb-2">
        <input
          ref={nameRef}
          type="text"
          value={tag.label}
          onChange={(e) => onUpdate({ label: e.target.value })}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === "Escape") handleDone(); }}
          placeholder={t("editor.skills.skillPh")}
          className="flex-1 min-w-0 border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
        />
        <button
          onClick={handleDone}
          className="text-xs px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded flex-shrink-0 font-medium transition-colors"
          title="Fatto (Enter)"
        >
          ✓
        </button>
        <button
          onClick={onRemove}
          className="text-xs w-7 h-7 flex items-center justify-center text-gray-400 hover:text-red-500 flex-shrink-0"
          title={t("editor.skills.removeSkill")}
        >
          ✕
        </button>
      </div>

      {/* Versione + ATS toggle */}
      <div className="flex gap-1.5 items-center">
        <input
          type="text"
          value={tag.versionsRange || ""}
          onChange={(e) => onUpdate({ versionsRange: e.target.value || null })}
          onKeyDown={(e) => { if (e.key === "Escape") handleDone(); }}
          placeholder={t("editor.skills.versionPh")}
          className="flex-1 min-w-0 border border-gray-300 rounded px-2 py-1.5 text-xs text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
        />
        <button
          onClick={() => setShowAts((v) => !v)}
          className={`text-xs px-2 py-1 rounded border flex-shrink-0 transition-colors ${
            showAts
              ? "bg-green-100 text-green-700 border-green-300"
              : "bg-gray-100 text-gray-500 border-gray-300 hover:bg-green-50 hover:text-green-600 hover:border-green-300"
          }`}
        >
          ATS
        </button>
      </div>

      {/* ATS panel */}
      {showAts && (
        <div className="mt-2 pt-2 border-t border-blue-100">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
              {t("editor.skills.atsKeywords")}
              <InfoTooltip text={t("editor.skills.atsTooltip")} />
            </span>
            <button
              onClick={handleAutoGenerate}
              className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-200 rounded hover:bg-blue-100"
            >
              {t("editor.skills.autoGenerate")}
            </button>
          </div>
          <div className="flex flex-wrap gap-1 mb-1">
            {(tag.atsKeywords || []).map((kw, ki) => (
              <span key={ki} className="inline-flex items-center gap-1 text-xs bg-gray-100 border border-gray-300 rounded px-2 py-0.5">
                {kw}
                <button
                  onClick={() => onUpdate({ atsKeywords: (tag.atsKeywords || []).filter((_, i) => i !== ki) })}
                  className="text-gray-400 hover:text-red-500 leading-none"
                  aria-label={t("editor.skills.removeKeyword")}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            placeholder={t("editor.skills.addKeywordPh")}
            className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.target.value.trim()) {
                onUpdate({ atsKeywords: [...(tag.atsKeywords || []), e.target.value.trim()] });
                e.target.value = "";
              }
            }}
          />
          <p className="text-xs text-gray-400 mt-1">{t("editor.skills.atsInvisible")}</p>
        </div>
      )}
    </div>
  );
}

// ─── CategoryEditor ───────────────────────────────────────────────────────────
function CategoryEditor({ category, index, isDragOver, dragHandleProps, onUpdateCategory, onRemoveCategory, onAddTag, onRemoveTag, onUpdateTag, onReorderTags, onMoveTag }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(true);
  const [editingIndex, setEditingIndex] = useState(null);
  const tagDragIndex = useRef(null);
  const [tagDragOver, setTagDragOver] = useState(null);
  const [tagDragSrc, setTagDragSrc] = useState(null);
  const [foreignDragOver, setForeignDragOver] = useState(false);

  const handleAddTag = () => {
    const newIndex = category.tags.length;
    onAddTag(index, { label: "", versionsRange: null, atsKeywords: [] });
    setEditingIndex(newIndex);
    if (!open) setOpen(true);
  };

  const handleStopEdit = () => setEditingIndex(null);

  const handleRemoveTag = (ti) => {
    onRemoveTag(index, ti);
    setEditingIndex(null);
  };

  const tagCount = category.tags.length;

  return (
    <div className={`border rounded-lg mb-2 overflow-hidden transition-colors ${isDragOver ? "border-blue-400 bg-blue-50" : "border-gray-200"}`}>
      {/* Header */}
      <div className="flex items-center gap-2 bg-gray-50 px-3 py-2.5 border-b border-gray-200">
        <span
          {...dragHandleProps}
          title={t("editor.common.dragToReorder")}
          className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing flex-shrink-0 select-none flex items-center"
        >
          <DotsSixVertical size={18} weight="bold" />
        </span>
        <input
          type="text"
          value={category.category}
          onChange={(e) => onUpdateCategory(index, { category: e.target.value })}
          placeholder={t("editor.skills.categoryPh")}
          className="flex-1 min-w-0 bg-transparent border-none text-sm font-semibold text-gray-800 focus:outline-none"
        />
        {!open && tagCount > 0 && (
          <span className="text-xs text-gray-400 flex-shrink-0 tabular-nums">{tagCount}</span>
        )}
        <button
          onClick={() => setOpen((v) => !v)}
          className="text-gray-400 hover:text-gray-600 flex-shrink-0 px-1 text-xs leading-none"
          title={open ? "Comprimi" : "Espandi"}
        >
          {open ? "▲" : "▼"}
        </button>
        <button onClick={() => onRemoveCategory(index)} className="text-xs text-red-400 hover:text-red-600 flex-shrink-0" aria-label={t("editor.skills.removeCategory")}>✕</button>
      </div>

      {/* Body */}
      {open && (
        <div className="p-3">
          {/* Chips row */}
          <div
            className={`flex flex-wrap gap-1.5 mb-2 rounded transition-colors ${foreignDragOver ? "bg-blue-50 outline outline-2 outline-blue-300" : ""}`}
            onDragOver={(e) => {
              if (!e.dataTransfer.types.includes("cv-tag")) return;
              e.preventDefault();
              setForeignDragOver(true);
            }}
            onDrop={(e) => {
              const raw = e.dataTransfer.getData("cv-tag");
              if (!raw) return;
              const { catIndex: fromCat, tagIndex: fromTag } = JSON.parse(raw);
              if (fromCat !== index) onMoveTag(fromCat, fromTag, index, -1);
              setForeignDragOver(false); setTagDragOver(null);
            }}
            onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setForeignDragOver(false); }}
          >
            {category.tags.map((tag, ti) =>
              editingIndex === ti ? (
                <TagEditor
                  key={ti}
                  tag={tag}
                  isEditing={true}
                  onStartEdit={() => setEditingIndex(ti)}
                  onStopEdit={handleStopEdit}
                  onUpdate={(u) => onUpdateTag(index, ti, u)}
                  onRemove={() => handleRemoveTag(ti)}
                />
              ) : (
                <TagEditor
                  key={ti}
                  tag={tag}
                  isEditing={false}
                  onStartEdit={() => setEditingIndex(ti)}
                  onStopEdit={handleStopEdit}
                  onUpdate={(u) => onUpdateTag(index, ti, u)}
                  onRemove={() => handleRemoveTag(ti)}
                  chipDragProps={{
                    draggable: true,
                    onDragStart: (e) => { e.stopPropagation(); e.dataTransfer.setData("cv-tag", JSON.stringify({ catIndex: index, tagIndex: ti })); tagDragIndex.current = ti; setTagDragSrc(ti); },
                    onDragOver:  (e) => { e.preventDefault(); e.stopPropagation(); setForeignDragOver(false); setTagDragOver(ti); },
                    onDrop:      (e) => { e.stopPropagation(); const raw = e.dataTransfer.getData("cv-tag"); if (!raw) return; const { catIndex: fromCat, tagIndex: fromTag } = JSON.parse(raw); if (fromCat === index) { onReorderTags(index, fromTag, ti); } else { onMoveTag(fromCat, fromTag, index, ti); } setTagDragOver(null); setTagDragSrc(null); setForeignDragOver(false); tagDragIndex.current = null; },
                    onDragEnd:   (e) => { e.stopPropagation(); setTagDragOver(null); setTagDragSrc(null); setForeignDragOver(false); tagDragIndex.current = null; },
                    style: tagDragOver === ti && tagDragSrc !== ti ? { outline: "2px solid #3b82f6", outlineOffset: 1 } : undefined,
                  }}
                />
              )
            )}
          </div>

          <button
            onClick={handleAddTag}
            className="w-full text-xs py-2 border border-dashed border-blue-300 text-blue-500 rounded hover:bg-blue-50 transition-colors"
          >
            {t("editor.skills.addSkill")}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── SkillsForm ───────────────────────────────────────────────────────────────
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
  const reorderSkillTags   = useCVStore((s) => s.reorderSkillTags);
  const moveSkillTag       = useCVStore((s) => s.moveSkillTag);
  const { t } = useTranslation();

  const dragIndex  = useRef(null);
  const canDragRef = useRef(false);
  const [dragOver, setDragOver] = useState(null);
  const [dragSrc, setDragSrc]   = useState(null);

  const reorder = (from, to) => {
    if (from === to || from === null) return;
    const arr = [...skills];
    const [moved] = arr.splice(from, 1);
    arr.splice(to, 0, moved);
    setSkills(arr);
  };

  return (
    <SectionCard title={t("editor.skills.title")} icon={<Wrench size={15} weight="duotone" />}>
      <AtsHintsPanel template={template} />
      {skills.map((cat, i) => (
        <div
          key={i}
          draggable
          onDragStart={(e) => { if (!canDragRef.current) { e.preventDefault(); return; } dragIndex.current = i; setDragSrc(i); }}
          onDragOver={(e) => { e.preventDefault(); setDragOver(i); }}
          onDrop={() => { reorder(dragIndex.current, i); setDragOver(null); setDragSrc(null); dragIndex.current = null; }}
          onDragEnd={() => { canDragRef.current = false; setDragOver(null); setDragSrc(null); dragIndex.current = null; }}
        >
          <CategoryEditor
            category={cat}
            index={i}
            isDragOver={dragOver === i && dragSrc !== i}
            dragHandleProps={{
              onMouseDown: () => { canDragRef.current = true; },
              onMouseUp:   () => { canDragRef.current = false; },
            }}
            onUpdateCategory={updateSkillCategory}
            onRemoveCategory={removeSkillCategory}
            onAddTag={addSkillTag}
            onRemoveTag={removeSkillTag}
            onUpdateTag={updateSkillTag}
            onReorderTags={reorderSkillTags}
            onMoveTag={moveSkillTag}
          />
        </div>
      ))}
      <button
        onClick={() => addSkillCategory()}
        className="w-full text-sm py-2 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg hover:border-blue-400 hover:text-blue-500 transition-colors"
      >
        {t("editor.skills.addCategory")}
      </button>
    </SectionCard>
  );
}
