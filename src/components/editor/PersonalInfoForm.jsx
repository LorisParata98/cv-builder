import { useCVStore } from "../../store/useCVStore";
import { SectionCard } from "../ui/SectionCard";

function Field({ label, value, onChange, type = "text", placeholder = "" }) {
  return (
    <div className="mb-3">
      <label className="block text-xs font-medium text-gray-600 mb-1">
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={6}
          className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      )}
    </div>
  );
}

export function PersonalInfoForm() {
  const personal = useCVStore((s) => s.personal);
  const setPersonal = useCVStore((s) => s.setPersonal);

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Foto troppo grande (max 2MB)");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setPersonal({ photo: ev.target.result });
    reader.readAsDataURL(file);
  };
  return (
    <SectionCard title="Dati Personali" icon="👤">
      {/* Foto */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 border-2 border-gray-300">
          {personal.photo ? (
            <img
              src={personal.photo}
              alt="Foto profilo"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">
              👤
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-xs font-medium text-gray-700 rounded cursor-pointer border border-gray-300 text-center">
            Carica foto
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </label>
          {personal.photo && (
            <button
              onClick={() => setPersonal({ photo: null })}
              className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-xs font-medium text-red-600 rounded border border-red-200"
            >
              Rimuovi
            </button>
          )}
        </div>
      </div>

      <Field
        label="Nome completo"
        value={personal.name}
        onChange={(v) => setPersonal({ name: v })}
        placeholder="Es. Mario Rossi"
      />
      <Field
        label="Titolo professionale"
        value={personal.title}
        onChange={(v) => setPersonal({ title: v })}
        placeholder="Es. Senior Frontend Developer"
      />
      <Field
        label="Email"
        value={personal.email}
        onChange={(v) => setPersonal({ email: v })}
        type="email"
        placeholder="mario@esempio.it"
      />
      <Field
        label="Telefono"
        value={personal.phone}
        onChange={(v) => setPersonal({ phone: v })}
        placeholder="+39 333 000 0000"
      />
      <Field
        label="Città / Nazione"
        value={personal.location}
        onChange={(v) => setPersonal({ location: v })}
        placeholder="Milano, Italia"
      />
      <Field
        label="Sito web / GitHub"
        value={personal.website}
        onChange={(v) => setPersonal({ website: v })}
        placeholder="github.com/tuoprofilo"
      />
      <Field
        label="LinkedIn"
        value={personal.linkedin}
        onChange={(v) => setPersonal({ linkedin: v })}
        placeholder="linkedin.com/in/tuoprofilo"
      />
      <Field
        label="Sommario professionale"
        value={personal.summary}
        onChange={(v) => setPersonal({ summary: v })}
        type="textarea"
        placeholder="Breve descrizione del tuo profilo..."
      />
    </SectionCard>
  );
}
