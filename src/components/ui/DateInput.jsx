import { useState, useEffect } from "react";

// ─── Conversioni formato ───────────────────────────────────────────────────────
// Store interno:   "yyyy-mm"  (compatibile con formatDate dei template)
// Display utente:  "mm/yyyy"

function storeToDisplay(v) {
  if (!v) return "";
  const m = v.match(/^(\d{4})-(\d{1,2})$/);
  if (m) return `${m[2].padStart(2, "0")}/${m[1]}`;
  return v; // già in formato display o non riconosciuto → restituisce as-is
}

// ─── DateInput ────────────────────────────────────────────────────────────────
// Input mascherato: l'utente vede/digita "mm/yyyy", il parent riceve "yyyy-mm".
export function DateInput({
  value,
  onChange,
  placeholder = "mm/yyyy",
  disabled,
  className = "",
}) {
  const [inputVal, setInputVal] = useState(() => storeToDisplay(value));

  // Sincronizza se il valore cambia dall'esterno (es. toggle "In corso")
  useEffect(() => {
    setInputVal(storeToDisplay(value));
  }, [value]);

  const handleChange = (e) => {
    const raw = e.target.value;
    // Estrai solo cifre (max 6: 2 mese + 4 anno)
    const digits = raw.replace(/\D/g, "").slice(0, 6);

    // Costruisci il valore mascherato
    let display;
    if (digits.length > 2) {
      display = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    } else if (
      digits.length === 2 &&
      raw.length === 3 &&
      raw[2] === "/"
    ) {
      // L'utente ha digitato esplicitamente lo slash dopo 2 cifre
      display = `${digits}/`;
    } else {
      display = digits;
    }

    setInputVal(display);

    // Aggiorna lo store solo quando il valore è completo (mm/yyyy)
    const match = display.match(/^(\d{2})\/(\d{4})$/);
    if (match) {
      const month = parseInt(match[1], 10);
      if (month >= 1 && month <= 12) {
        onChange(`${match[2]}-${match[1]}`); // → "yyyy-mm"
        return;
      }
    }
    // Campo svuotato → reset store
    if (digits.length === 0) {
      onChange("");
    }
    // Valore parziale → non aggiornare lo store (attendi completamento)
  };

  return (
    <input
      type="text"
      value={inputVal}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
      maxLength={7}
      className={className}
    />
  );
}

// ─── DateField ────────────────────────────────────────────────────────────────
// Wrapper con label, stessa struttura degli altri Field dei form.
export function DateField({ label, value, onChange, placeholder, disabled }) {
  return (
    <div className="mb-3.5">
      <label className="block text-xs font-medium text-gray-500 mb-1.5">
        {label}
      </label>
      <DateInput
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full border border-gray-300 rounded px-2.5 py-2 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
      />
    </div>
  );
}
