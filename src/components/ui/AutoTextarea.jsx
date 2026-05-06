// AutoTextarea — textarea che si espande automaticamente al contenuto.
// Nessuna scrollbar interna, nessun handle di resize visibile.
import { useRef, useEffect } from "react";

export function AutoTextarea({ value, onChange, className = "", style = {}, rows = 2, ...props }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Resetta l'altezza a "auto" prima di rileggere scrollHeight,
    // altrimenti non si restringe quando si cancella testo.
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={onChange}
      rows={rows}
      className={className}
      style={{ ...style, overflow: "hidden", resize: "none" }}
      {...props}
    />
  );
}
