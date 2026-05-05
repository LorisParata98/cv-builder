import { useCVStore } from "../../store/useCVStore";
import { SectionCard } from "../ui/SectionCard";

export function ProjectsForm() {
  const projects = useCVStore((s) => s.projects);
  const addProject = useCVStore((s) => s.addProject);
  const removeProject = useCVStore((s) => s.removeProject);
  const updateProject = useCVStore((s) => s.updateProject);

  return (
    <SectionCard title="Progetti" icon="🚀">
      <p className="text-xs text-gray-400 mb-3">
        Includi nome, breve descrizione e link se disponibile
      </p>
      <div className="space-y-2">
        {projects.map((proj, i) => (
          <div key={i} className="flex gap-2 items-start">
            <span className="text-blue-400 mt-2 text-xs flex-shrink-0">▶</span>
            <textarea
              value={proj}
              onChange={(e) => updateProject(i, e.target.value)}
              placeholder="Es. CV Builder — Webapp React per la generazione di CV (github.com/...)"
              rows={2}
              className="flex-1 border border-gray-300 rounded px-2.5 py-1.5 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
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
        className="mt-3 w-full text-sm py-2 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg hover:border-blue-400 hover:text-blue-500 transition-colors"
      >
        + Aggiungi progetto
      </button>
    </SectionCard>
  );
}
