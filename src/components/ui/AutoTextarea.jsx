// AutoTextarea — textarea che si espande automaticamente al contenuto.
// Nessuna scrollbar interna, nessun handle di resize visibile.
// Prop maxRows: se fornita, limita l'altezza massima e abilita scroll oltre.
import { useRef, useEffect } from "react";

export function AutoTextarea({ value, onChange, className = "", style = {}, rows = 2, maxRows = 0, ...props }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    const scrollH = el.scrollHeight;
    if (maxRows > 0) {
      const computed = getComputedStyle(el);
      const lh = parseFloat(computed.lineHeight);
      const fs = parseFloat(computed.fontSize);
      const lineH = isNaN(lh) ? fs * 1.4 : lh;
      const maxH = maxRows * lineH;
      if (scrollH > maxH) {
        el.style.height = `${maxH}px`;
        el.style.overflowY = "auto";
      } else {
        el.style.height = `${scrollH}px`;
        el.style.overflowY = "hidden";
      }
    } else {
      el.style.height = `${scrollH}px`;
      el.style.overflowY = "hidden";
    }
  }, [value, maxRows]);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={onChange}
      rows={rows}
      className={className}
      style={{ ...style, resize: "none" }}
      {...props}
    />
  );
}
