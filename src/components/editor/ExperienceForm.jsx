import { useCVStore } from "../../store/useCVStore";
import { SectionCard } from "../ui/SectionCard";

function Field({ label, value, onChange, placeholder = "", type = "text" }) {
  return (
    <div className="mb-2">
      <label className="block text-xs font-medium text-gray-500 mb-0.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
  );
}

function BulletList({ bullets, onUpdate }) {
  const handleChange = (i, value) => {
    const updated = bullets.map((b, bi) => (bi === i ? value : b));
    onUpdate(updated);
  };

  const handleAdd = () => onUpdate([...bullets, ""]);

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
      // Focus sul nuovo campo dopo il re-render
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
    <div className="mt-2">
      <label className="block text-xs font-medium text-gray-500 mb-1">
        Bullet point <span className="text-gray-400 font-normal">(Invio = nuovo, Backspace su riga vuota = rimuovi)</span>
      </label>
      <ul className="space-y-1">
        {bullets.map((bullet, i) => (
          <li key={i} className="flex gap-1 items-start">
            <span className="text-blue-400 mt-1.5 flex-shrink-0 text-xs">•</span>
            <textarea
              value={bullet}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              placeholder="Descrivi il tuo contributo con numeri di impatto..."
              rows={2}
              className="flex-1 border border-gray-300 rounded px-2 py-1 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
            />
            {bullets.length > 1 && (
              <button
                onClick={() => handleRemove(i)}
                className="text-gray-300 hover:text-red-400 mt-1 flex-shrink-0 text-sm leading-none"
              >
                ✕
              </button>
            )}
          </li>
        ))}
      </ul>
      <button
        onClick={handleAdd}
        className="mt-1 text-xs text-blue-500 hover:text-blue-700"
      >
        + Aggiungi bullet
      </button>
    </div>
  );
}

function ExperienceCard({ exp, onUpdate, onRemove }) {
  return (
    <div className="border border-gray-200 rounded-lg p-3 mb-3 bg-white">
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-semibold text-gray-600 truncate flex-1">
          {exp.role || "Nuova esperienza"}{exp.company ? ` @ ${exp.company}` : ""}
        </span>
        <button
          onClick={onRemove}
          className="text-xs text-red-400 hover:text-red-600 ml-2 flex-shrink-0"
        >
          Rimuovi
        </button>
      </div>

      <Field label="Ruolo" value={exp.role} onChange={(v) => onUpdate({ role: v })} placeholder="Es. Senior Frontend Developer" />
      <Field label="Azienda" value={exp.company} onChange={(v) => onUpdate({ company: v })} placeholder="Es. Acme Corp" />
      <Field label="Città / Nazione" value={exp.location} onChange={(v) => onUpdate({ location: v })} placeholder="Es. Milano, Italia" />

      <div className="flex gap-2">
        <div className="flex-1">
          <Field label="Data inizio" value={exp.startDate} onChange={(v) => onUpdate({ startDate: v })} placeholder="YYYY-MM" />
        </div>
        <div className="flex-1">
          <div className="mb-2">
            <label className="block text-xs font-medium text-gray-500 mb-0.5">Data fine</label>
            <div className="flex gap-1">
              <input
                type="text"
                value={exp.endDate === "present" ? "" : exp.endDate}
                onChange={(e) => onUpdate({ endDate: e.target.value })}
                placeholder="YYYY-MM"
                disabled={exp.endDate === "present"}
                className="flex-1 border border-gray-300 rounded px-2.5 py-1.5 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
              />
              <button
                onClick={() => onUpdate({ endDate: exp.endDate === "present" ? "" : "present" })}
                className={`px-2 py-1 text-xs rounded border transition-colors flex-shrink-0 ${
                  exp.endDate === "present"
                    ? "bg-green-100 text-green-700 border-green-300"
                    : "bg-gray-100 text-gray-500 border-gray-300 hover:bg-gray-200"
                }`}
              >
                Attuale
              </button>
            </div>
          </div>
        </div>
      </div>

      <BulletList
        bullets={exp.bullets}
        onUpdate={(bullets) => onUpdate({ bullets })}
      />
    </div>
  );
}

export function ExperienceForm() {
  const experience = useCVStore((s) => s.experience);
  const addExperience = useCVStore((s) => s.addExperience);
  const removeExperience = useCVStore((s) => s.removeExperience);
  const updateExperience = useCVStore((s) => s.updateExperience);

  return (
    <SectionCard title="Esperienza" icon="💼">
      {experience.map((exp) => (
        <ExperienceCard
          key={exp.id}
          exp={exp}
          onUpdate={(updates) => updateExperience(exp.id, updates)}
          onRemove={() => removeExperience(exp.id)}
        />
      ))}
      <button
        onClick={addExperience}
        className="w-full text-sm py-2 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg hover:border-blue-400 hover:text-blue-500 transition-colors"
      >
        + Aggiungi esperienza
      </button>
    </SectionCard>
  );
}
