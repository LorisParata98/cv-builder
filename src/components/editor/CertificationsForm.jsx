import { useCVStore } from "../../store/useCVStore";
import { SectionCard } from "../ui/SectionCard";

export function CertificationsForm() {
  const certifications = useCVStore((s) => s.certifications);
  const addCertification = useCVStore((s) => s.addCertification);
  const removeCertification = useCVStore((s) => s.removeCertification);
  const updateCertification = useCVStore((s) => s.updateCertification);

  return (
    <SectionCard title="Certificazioni" icon="🏆">
      <div className="space-y-2">
        {certifications.map((cert, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-blue-400 text-xs flex-shrink-0">★</span>
            <input
              type="text"
              value={cert}
              onChange={(e) => updateCertification(i, e.target.value)}
              placeholder="Es. AWS Certified Developer – Associate (2023)"
              className="flex-1 border border-gray-300 rounded px-2.5 py-1.5 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {certifications.length > 1 && (
              <button
                onClick={() => removeCertification(i)}
                className="text-gray-300 hover:text-red-400 text-sm flex-shrink-0"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
      <button
        onClick={addCertification}
        className="mt-3 w-full text-sm py-2 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg hover:border-blue-400 hover:text-blue-500 transition-colors"
      >
        + Aggiungi certificazione
      </button>
    </SectionCard>
  );
}
