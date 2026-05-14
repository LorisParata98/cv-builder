import DatePicker from "react-datepicker";
import { parse, format, isValid } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import "./datepicker-overrides.css";

// Store interno: "yyyy-mm" ↔ Date object per react-datepicker

function storeToDate(v) {
  if (!v) return null;
  const d = parse(v, "yyyy-MM", new Date());
  return isValid(d) ? d : null;
}

function dateToStore(d) {
  if (!d) return "";
  return format(d, "yyyy-MM");
}

// ─── DateInput ────────────────────────────────────────────────────────────────
export function DateInput({ value, onChange, disabled, className = "" }) {
  return (
    <DatePicker
      selected={storeToDate(value)}
      onChange={(d) => onChange(dateToStore(d))}
      showMonthYearPicker
      dateFormat="MM/yyyy"
      disabled={disabled}
      placeholderText="mm/yyyy"
      className={className}
      showPopperArrow={false}
    />
  );
}

// ─── DateField ────────────────────────────────────────────────────────────────
export function DateField({ label, value, onChange, disabled }) {
  return (
    <div className="mb-3.5">
      <label className="block text-xs font-medium text-gray-500 mb-1.5">
        {label}
      </label>
      <DateInput
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full border border-gray-300 rounded px-2.5 py-2 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
      />
    </div>
  );
}
