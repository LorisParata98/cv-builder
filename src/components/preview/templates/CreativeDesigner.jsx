// CreativeDesigner.jsx — Profilo designer / UX-UI / creativo
// Layout asimmetrico con sidebar colorata, 3 sub-palette, font Fraunces

import { getLocale } from "../../../locales/index.js";

const PALETTES = {
  "noir-gold": {
    bg: "#0D0D0D",
    bgSecondary: "#2A2A2A",
    accent: "#C8B89A",
    textPrimary: "#F5F0E8",
    textMuted: "#888888",
    tagBg: "#2A2A2A",
    tagBorder: "#C8B89A",
    tagText: "#C8B89A",
    sidebarBg: "#1A1A1A",
    contentBg: "#ffffff",
    contentText: "#1a1a1a",
    contentMuted: "#555555",
    sectionLine: "#C8B89A",
    bulletChar: "—",
    headerFont: "'Fraunces', Georgia, serif",
  },
  "indigo-electric": {
    bg: "#F7F6FF",
    bgSecondary: "#EEEDFE",
    accent: "#5B4FE8",
    textPrimary: "#1A1060",
    textMuted: "#555555",
    tagBg: "#EEEDFE",
    tagBorder: "#5B4FE8",
    tagText: "#3D35B0",
    sidebarBg: "#EEEDFE",
    contentBg: "#ffffff",
    contentText: "#1A1060",
    contentMuted: "#555555",
    sectionLine: "#5B4FE8",
    bulletChar: "▸",
    headerFont: "'Fraunces', Georgia, serif",
  },
  "forest-stone": {
    bg: "#F0EDE8",
    bgSecondary: "#D8F3DC",
    accent: "#2D6A4F",
    textPrimary: "#1B4332",
    textMuted: "#4A4A4A",
    tagBg: "#D8F3DC",
    tagBorder: "#2D6A4F",
    tagText: "#1B4332",
    sidebarBg: "#E8F5E9",
    contentBg: "#FAFAF8",
    contentText: "#1B4332",
    contentMuted: "#4A4A4A",
    sectionLine: "#2D6A4F",
    bulletChar: "◆",
    headerFont: "'Fraunces', Georgia, serif",
  },
};

const FS_DEFAULT = { name: 36, role: 11, sectionHeader: 9, body: 10 };

function formatDate(d, L) {
  if (!d) return "";
  if (d === "present") return L.present;
  const [y, m] = d.split("-");
  if (!m) return y;
  return `${L.months[parseInt(m, 10) - 1]} ${y}`;
}

function SectionTitle({ children, p, fs }) {
  return (
    <div style={{ marginBottom: "10px" }}>
      <p
        style={{
          fontSize: `${fs.sectionHeader}px`,
          fontWeight: 700,
          color: p.accent,
          textTransform: "uppercase",
          letterSpacing: "2px",
          marginBottom: "4px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {children}
      </p>
      <div style={{ height: "2px", width: "28px", backgroundColor: p.accent, borderRadius: "1px" }} />
    </div>
  );
}

// ─── Sidebar sinistra colorata ────────────────────────────────────────────────
function DesignerSidebar({ data, p, L, fs }) {
  const { personal, skills, languages, certifications } = data;
  const sb = Math.max(7, fs.body - 1.5); // sidebar base (leggermente più piccolo del corpo)

  return (
    <div
      style={{
        width: "34%",
        flexShrink: 0,
        backgroundColor: p.sidebarBg,
        padding: "28px 18px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      {/* Foto */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        {personal.photo ? (
          <div
            style={{
              width: "88px", height: "88px",
              borderRadius: "50%", overflow: "hidden",
              border: `3px solid ${p.accent}`,
              boxShadow: `0 0 0 4px ${p.tagBg}`,
            }}
          >
            <img
              src={personal.photo}
              alt={personal.name}
              style={{
                width: "100%", height: "100%",
                objectFit: "cover",
                objectPosition: `${personal.photoPosition?.x ?? 50}% ${personal.photoPosition?.y ?? 50}%`,
              }}
            />
          </div>
        ) : (
          <div
            style={{
              width: "72px", height: "72px",
              borderRadius: "50%",
              border: `2px dashed ${p.accent}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: p.accent, fontSize: "24px",
            }}
          >
            ✦
          </div>
        )}
      </div>

      {/* Contatti */}
      <div>
        <p style={{ fontSize: `${Math.max(7, sb - 1)}px`, fontWeight: 700, color: p.accent, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "8px" }}>
          {L.contacts}
        </p>
        {[
          { icon: "✉", val: personal.email },
          { icon: "☎", val: personal.phone },
          { icon: "📍", val: personal.location },
          { icon: "🔗", val: personal.website },
          { icon: "in", val: personal.linkedin },
        ]
          .filter((x) => x.val)
          .map((item, i) => (
            <div key={i} style={{ display: "flex", gap: "6px", alignItems: "flex-start", marginBottom: "5px" }}>
              <span style={{ fontSize: `${sb}px`, color: p.accent, flexShrink: 0, minWidth: "14px" }}>{item.icon}</span>
              <span style={{ fontSize: `${sb - 0.5}px`, color: p.textMuted, wordBreak: "break-all", lineHeight: 1.4 }}>{item.val}</span>
            </div>
          ))}
      </div>

      {/* Skills */}
      {skills.length > 0 && (
        <div>
          <p style={{ fontSize: `${Math.max(7, sb - 1)}px`, fontWeight: 700, color: p.accent, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "8px" }}>
            {L.skillsShort}
          </p>
          {skills.map((cat, i) => (
            <div key={i} style={{ marginBottom: "10px" }}>
              <p style={{ fontSize: `${Math.max(7, sb - 1.5)}px`, color: p.textMuted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>
                {cat.category}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "3px" }}>
                {cat.tags.map((tag, ti) => (
                  <span key={ti} style={{ backgroundColor: p.tagBg, border: `1px solid ${p.tagBorder}`, color: p.tagText, fontSize: `${Math.max(7, sb - 1)}px`, padding: "2px 7px", borderRadius: "20px", fontWeight: 500, lineHeight: 1.6 }}>
                    {tag.label}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lingue */}
      {languages.length > 0 && (
        <div>
          <p style={{ fontSize: `${Math.max(7, sb - 1)}px`, fontWeight: 700, color: p.accent, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "8px" }}>
            {L.languages}
          </p>
          {languages.map((l, i) => (
            <div key={i} style={{ marginBottom: "5px" }}>
              <p style={{ fontSize: `${sb}px`, fontWeight: 600, color: p.textPrimary }}>{l.language}</p>
              {l.level && <p style={{ fontSize: `${Math.max(7, sb - 1)}px`, color: p.textMuted }}>{l.level}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Certificazioni */}
      {certifications.filter(Boolean).length > 0 && (
        <div>
          <p style={{ fontSize: `${Math.max(7, sb - 1)}px`, fontWeight: 700, color: p.accent, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "8px" }}>
            {L.certifications}
          </p>
          {certifications.filter(Boolean).map((cert, i) => (
            <div key={i} style={{ display: "flex", gap: "5px", marginBottom: "4px", alignItems: "flex-start" }}>
              <span style={{ color: p.accent, fontSize: `${Math.max(7, sb - 1)}px`, flexShrink: 0 }}>✦</span>
              <span style={{ fontSize: `${sb - 0.5}px`, color: p.textMuted, lineHeight: 1.4 }}>{cert}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Contenuto principale ─────────────────────────────────────────────────────
function DesignerContent({ data, p, L, fs }) {
  const { personal, experience, education, projects } = data;

  return (
    <div style={{ flex: 1, backgroundColor: p.contentBg, padding: "28px 28px 32px" }}>
      {/* Sommario */}
      {personal.summary && (
        <div style={{ marginBottom: "20px" }}>
          <SectionTitle p={p} fs={fs}>{L.profile}</SectionTitle>
          <p style={{ fontSize: `${fs.body}px`, lineHeight: 1.7, color: p.contentText, fontFamily: "system-ui, sans-serif" }}>
            {personal.summary}
          </p>
        </div>
      )}

      {/* Esperienza */}
      {experience.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <SectionTitle p={p} fs={fs}>{L.experienceShort}</SectionTitle>
          {experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2px" }}>
                <div>
                  <p style={{ fontSize: `${fs.body + 1}px`, fontWeight: 700, color: p.contentText, fontFamily: p.headerFont }}>
                    {exp.role}
                  </p>
                  <p style={{ fontSize: `${fs.body - 0.5}px`, color: p.accent, fontWeight: 600, marginTop: "1px" }}>
                    {exp.company}{exp.location ? ` · ${exp.location}` : ""}
                  </p>
                </div>
                <span style={{ fontSize: `${Math.max(7, fs.body - 1.5)}px`, color: p.contentMuted, whiteSpace: "nowrap", marginLeft: "10px", marginTop: "2px" }}>
                  {formatDate(exp.startDate, L)} – {formatDate(exp.endDate, L)}
                </span>
              </div>
              <ul style={{ margin: "5px 0 0", padding: 0, listStyle: "none" }}>
                {exp.bullets.filter(Boolean).map((b, bi) => (
                  <li key={bi} style={{ display: "flex", gap: "7px", fontSize: `${fs.body}px`, lineHeight: 1.6, color: p.contentText, marginBottom: "2px" }}>
                    <span style={{ color: p.accent, flexShrink: 0, fontWeight: 700 }}>{p.bulletChar}</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Formazione */}
      {education.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <SectionTitle p={p} fs={fs}>{L.education}</SectionTitle>
          {education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p style={{ fontSize: `${fs.body + 1}px`, fontWeight: 700, color: p.contentText, fontFamily: p.headerFont }}>
                    {edu.degree}{edu.field ? ` in ${edu.field}` : ""}
                  </p>
                  <p style={{ fontSize: `${fs.body - 0.5}px`, color: p.contentMuted, marginTop: "1px" }}>
                    {edu.institution}{edu.grade ? ` · ${edu.grade}` : ""}
                  </p>
                </div>
                <span style={{ fontSize: `${Math.max(7, fs.body - 1.5)}px`, color: p.contentMuted, whiteSpace: "nowrap", marginLeft: "10px" }}>
                  {formatDate(edu.startDate, L)} – {formatDate(edu.endDate, L)}
                </span>
              </div>
              {edu.thesis && (
                <p style={{ fontSize: `${Math.max(7, fs.body - 1)}px`, color: p.contentMuted, fontStyle: "italic", marginTop: "3px" }}>
                  {L.thesis}: {edu.thesis}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Progetti */}
      {projects.filter(Boolean).length > 0 && (
        <div>
          <SectionTitle p={p} fs={fs}>{L.projects}</SectionTitle>
          {projects.filter(Boolean).map((proj, i) => (
            <div key={i} style={{ display: "flex", gap: "7px", marginBottom: "5px", alignItems: "flex-start" }}>
              <span style={{ color: p.accent, flexShrink: 0, fontWeight: 700 }}>{p.bulletChar}</span>
              <span style={{ fontSize: `${fs.body}px`, color: p.contentText, lineHeight: 1.6 }}>{proj}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Componente principale ────────────────────────────────────────────────────
export function CreativeDesigner({ data, palette = "noir-gold", customColors = {}, customFontSizes = {}, locale }) {
  const baseP = PALETTES[palette] || PALETTES["noir-gold"];
  const p  = { ...baseP, ...customColors };
  const fs = { ...FS_DEFAULT, ...customFontSizes };
  const L  = locale || getLocale("IT");

  return (
    <div style={{ width: "100%", backgroundColor: p.bg, fontFamily: "system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ backgroundColor: p.bg, padding: "32px 32px 24px", borderBottom: `3px solid ${p.accent}` }}>
        <h1
          style={{
            fontFamily: p.headerFont,
            fontSize: `${fs.name}px`,
            fontWeight: 700,
            color: p.textPrimary,
            margin: 0,
            letterSpacing: "-1px",
            lineHeight: 1.1,
          }}
        >
          {data.personal.name || "Il tuo nome"}
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "8px" }}>
          <div style={{ width: "32px", height: "2px", backgroundColor: p.accent }} />
          <p
            style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: `${fs.role}px`,
              color: p.accent,
              fontWeight: 600,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            {data.personal.title || "Il tuo ruolo"}
          </p>
        </div>
      </div>

      {/* Corpo: sidebar + contenuto */}
      <div style={{ display: "flex", minHeight: "860px" }}>
        <DesignerSidebar data={data} p={p} L={L} fs={fs} />
        <DesignerContent data={data} p={p} L={L} fs={fs} />
      </div>
    </div>
  );
}
