import { useCVStore } from "../../store/useCVStore";
import { TechDeveloper } from "./templates/TechDeveloper";

function TemplatePlaceholder({ name }) {
  return (
    <div style={{ padding: "60px 40px", textAlign: "center", color: "#888" }}>
      <p style={{ fontSize: "32px", marginBottom: "12px" }}>🚧</p>
      <p style={{ fontWeight: 600, marginBottom: "4px" }}>Template {name}</p>
      <p style={{ fontSize: "13px" }}>In arrivo nella Sessione 5</p>
    </div>
  );
}

function TemplateRouter({ template, designerPalette, data }) {
  if (template === "tech") return <TechDeveloper data={data} />;
  if (template === "manager") return <TemplatePlaceholder name="Manager" />;
  if (template === "designer") return <TemplatePlaceholder name={`Designer (${designerPalette})`} />;
  return <TechDeveloper data={data} />;
}

export function CVPreview() {
  const template = useCVStore((s) => s.template);
  const designerPalette = useCVStore((s) => s.designerPalette);
  const data = useCVStore((s) => s);

  return (
    /* Contenitore scroll: flex:1 + minWidth:0 per shrink, overflow:auto per entrambe le direzioni */
    <div style={{
      flex: 1,
      minWidth: 0,
      overflow: "auto",
      backgroundColor: "#d1d5db",
    }}>
      {/* Wrapper interno: minWidth fisso a 794px + padding laterale.
          Se il contenitore è più stretto → overflow → scrollbar orizzontale.
          Se il contenitore è più largo → display flex centra il foglio. */}
      <div style={{
        minWidth: "794px",
        padding: "32px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxSizing: "border-box",
      }}>
        {/* Foglio A4 */}
        <div style={{
          width: "794px",
          minHeight: "1123px",
          backgroundColor: "#ffffff",
          boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
          flexShrink: 0,
        }}>
          <TemplateRouter
            template={template}
            designerPalette={designerPalette}
            data={data}
          />
        </div>
      </div>
    </div>
  );
}
