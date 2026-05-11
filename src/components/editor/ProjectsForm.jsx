import { useRef, useState } from "react";
import { DotsSixVertical, Rocket } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import { useCVStore } from "../../store/useCVStore";
import { SectionCard } from "../ui/SectionCard";
import { RichTextEditor } from "../ui/RichTextEditor";

function ProjectCard({ proj, onUpdate, onRemove, dragHandleProps, isDragOver }) {
  const { t } = useTranslation();

  return (
    <div
      className={`border rounded-lg transition-colors ${
        isDragOver ? "border-blue-400 bg-blue-50" : "border-gray-200"
      }`}
    >
      <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 border-b border-gray-200 rounded-t-lg">
        <span
          {...dragHandleProps}
          className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing flex-shrink-0 select-none flex items-center"
        >
          <DotsSixVertical size={18} weight="bold" />
        </span>
        <input
          type="text"
          value={proj.title ?? ""}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder={t("editor.projects.titlePh")}
          className="flex-1 bg-transparent text-xs font-semibold text-gray-700 placeholder-gray-300 focus:outline-none min-w-0"
        />
        <button
          onClick={onRemove}
          className="text-xs text-red-400 hover:text-red-600 flex-shrink-0 ml-1"
        >
          ✕
        </button>
      </div>
      <div className="px-3 pt-3 pb-3 flex flex-col gap-2.5">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            {t("editor.projects.descriptionLabel")}
          </label>
          <RichTextEditor
            value={proj.description}
            onChange={(v) => onUpdate({ description: v })}
            placeholder={t("editor.projects.descriptionPh")}
            minHeight={60}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            {t("editor.projects.urlLabel")}
          </label>
          <input
            type="text"
            value={proj.url ?? ""}
            onChange={(e) => onUpdate({ url: e.target.value })}
            placeholder={t("editor.projects.urlPh")}
            className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-xs text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-400 placeholder-gray-400"
          />
        </div>
      </div>
    </div>
  );
}

export function ProjectsForm() {
  const projects      = useCVStore((s) => s.projects);
  const setProjects   = useCVStore((s) => s.setProjects);
  const addProject    = useCVStore((s) => s.addProject);
  const removeProject = useCVStore((s) => s.removeProject);
  const updateProject = useCVStore((s) => s.updateProject);
  const { t } = useTranslation();

  const dragIndex  = useRef(null);
  const canDragRef = useRef(false);
  const [dragOver, setDragOver] = useState(null);

  const reorder = (from, to) => {
    if (from === to || from === null) return;
    const arr = [...projects];
    const [moved] = arr.splice(from, 1);
    arr.splice(to, 0, moved);
    setProjects(arr);
  };

  return (
    <SectionCard title={t("editor.projects.title")} icon={<Rocket size={15} weight="duotone" />}>
      <div className="space-y-2.5">
        {projects.map((proj, i) => (
          <div
            key={i}
            draggable
            onDragStart={(e) => { if (!canDragRef.current) { e.preventDefault(); return; } dragIndex.current = i; }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(i); }}
            onDrop={() => { reorder(dragIndex.current, i); setDragOver(null); dragIndex.current = null; }}
            onDragEnd={() => { canDragRef.current = false; setDragOver(null); dragIndex.current = null; }}
            style={{ opacity: dragIndex.current === i ? 0.4 : 1 }}
          >
            <ProjectCard
              proj={proj}
              isDragOver={dragOver === i && dragIndex.current !== i}
              dragHandleProps={{
                title: t("editor.common.dragToReorder"),
                onMouseDown: () => { canDragRef.current = true; },
                onMouseUp: () => { canDragRef.current = false; },
              }}
              onUpdate={(updates) => updateProject(i, updates)}
              onRemove={() => removeProject(i)}
            />
          </div>
        ))}
      </div>
      <button
        onClick={addProject}
        className="mt-3.5 w-full text-sm py-2.5 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg hover:border-blue-400 hover:text-blue-500 transition-colors"
      >
        {t("editor.projects.addProject")}
      </button>
    </SectionCard>
  );
}
