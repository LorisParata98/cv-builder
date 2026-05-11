export const CV_LANGUAGES = [
  { code: "IT",    label: "Italiano" },
  { code: "EN-GB", label: "Inglese (UK)" },
  { code: "DE",    label: "Tedesco" },
  { code: "ES",    label: "Spagnolo" },
];

export function LanguagePicker({ value, onChange, languages = CV_LANGUAGES }) {
  return (
    <div className="flex rounded-md overflow-hidden border border-gray-700 text-xs font-semibold">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => onChange(lang.code)}
          className={`flex-1 py-1.5 transition-colors ${
            value === lang.code
              ? "bg-blue-600 text-white"
              : "bg-transparent text-gray-500 hover:text-gray-200"
          }`}
        >
          {lang.code.split("-")[0]}
        </button>
      ))}
    </div>
  );
}
