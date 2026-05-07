import { useRef, useState } from "react";
import { DotsSixVertical, Rocket, CaretRight } from "@phosphor-icons/react";
import { useCVStore } from "../../store/useCVStore";
import { SectionCard } from "../ui/SectionCard";
import { AutoTextarea } from "../ui/AutoTextarea";

export function ProjectsForm() {
  const projects = useCVStore((s) => s.projects);
  const setProjects = useCVStore((s) => s.setProjects);
  const addProject = useCVStore((s) => s.addProject);
  const removeProject = useCVStore((s) => s.removeProject);
  const updateProject = useCVStore((s) => s.updateProject);

  const dragIndex = useRef(null);
  const [dragOver, setDragOver] = useState(null);

  const reorder = (from, to) => {
    if (from === to || from === null) return;
    const arr = [...projects];
    const [moved] = arr.splice(from, 1);
    arr.splice(to, 0, moved);
    setProjects(arr);
  };

  return (
    <SectionCard title="Progetti" icon={<Rocket size={15} weight="duotone" />}>
      <p className="text-xs text-gray-400 mb-4">
        Includi nome, breve descrizione e link se disponibile
      </p>
      <div className="space-y-2.5">
        {projects.map((proj, i) => (
          <div
            key={i}
            draggable
            onDragStart={() => {
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
              setDragOver(null);
              dragIndex.current = null;
            }}
            style={{ opacity: dragIndex.current === i ? 0.4 : 1 }}
            className={`flex gap-2 items-start rounded-lg   transition-colors ${
              dragOver === i && dragIndex.current !== i
                ? "bg-blue-50 ring-1 ring-blue-300"
                : ""
            }`}
          >
            <span
              title="Trascina per riordinare"
              className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing flex-shrink-0 select-none mt-1.5 flex items-center"
            >
              <DotsSixVertical size={18} weight="bold" />
            </span>

            <AutoTextarea
              value={proj}
              onChange={(e) => updateProject(i, e.target.value)}
              placeholder="Es. CV Builder — Webapp React per la generazione di CV (github.com/...)"
              rows={2}
              className="flex-1 border border-gray-300 rounded px-2.5 py-2 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {projects.length > 1 && (
              <button
                onClick={() => removeProject(i)}
                className="text-gray-300 hover:text-red-400 mt-1.5 text-sm flex-shrink-0"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
      <button
        onClick={addProject}
        className="mt-3.5 w-full text-sm py-2.5 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg hover:border-blue-400 hover:text-blue-500 transition-colors"
      >
        + Aggiungi progetto
      </button>
    </SectionCard>
  );
}
