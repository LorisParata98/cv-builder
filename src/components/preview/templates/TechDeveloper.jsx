// TechDeveloper.jsx — Profilo sviluppatore / ingegnere
// Palette: dark navy #0f2644 + accent teal #4ec9b0
// Font: JetBrains Mono (titoli), system-ui (corpo)
// Layout: colonna singola, ATS-safe

const COLORS = {
  bg: "#0f2644",
  bgLight: "#162f52",
  accent: "#4ec9b0",
  accentOrange: "#e07b3e",
  text: "#e8eaf0",
  textMuted: "#8fa8c8",
  tagBg: "#1a3a60",
  tagBorder: "#4ec9b0",
  white: "#ffffff",
  bodyBg: "#f8f9fa",
  bodyText: "#1a1a2e",
  bodyMuted: "#4a5568",
  border: "#dde3ed",
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatDate(dateStr) {
  if (!dateStr) return "";
  if (dateStr === "present") return "Presente";
  const [year, month] = dateStr.split("-");
  if (!month) return year;
  const months = ["Gen","Feb","Mar","Apr","Mag","Giu","Lug","Ago","Set","Ott","Nov","Dic"];
  return `${months[parseInt(month, 10) - 1]} ${year}`;
}

function SectionHeader({ icon, title }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
      <span style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "11px",
        color: COLORS.accent,
        fontWeight: 600,
      }}>{icon}</span>
      <span style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "10px",
        fontWeight: 700,
        color: COLORS.bodyMuted,
        textTransform: "uppercase",
        letterSpacing: "1.5px",
      }}>{title}</span>
      <div style={{ flex: 1, height: "1px", backgroundColor: COLORS.border }} />
    </div>
  );
}

// ─── Sezioni ────────────────────────────────────────────────────────────────

function HeaderSection({ personal }) {
  return (
    <div style={{
      backgroundColor: COLORS.bg,
      padding: "32px 40px 28px",
      display: "flex",
      gap: "24px",
      alignItems: "flex-start",
    }}>
      {/* Foto opzionale */}
      {personal.photo && (
        <div style={{
          width: "80px",
          height: "80px",
          flexShrink: 0,
          border: `2px solid ${COLORS.accent}`,
          overflow: "hidden",
          borderRadius: "4px",
        }}>
          <img
            src={personal.photo}
            alt={personal.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      )}

      {/* Info principale */}
      <div style={{ flex: 1 }}>
        <h1 style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "26px",
          fontWeight: 700,
          color: COLORS.white,
          margin: 0,
          letterSpacing: "-0.5px",
          lineHeight: 1.2,
        }}>
          {personal.name || "Il tuo nome"}
        </h1>
        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "13px",
          color: COLORS.accent,
          margin: "6px 0 14px",
          fontWeight: 500,
        }}>
          {personal.title || "Il tuo ruolo"}
        </p>

        {/* Contatti in riga */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "6px 20px",
          fontSize: "11px",
          color: COLORS.textMuted,
          fontFamily: "system-ui, sans-serif",
        }}>
          {personal.email && (
            <span>✉ {personal.email}</span>
          )}
          {personal.phone && (
            <span>☎ {personal.phone}</span>
          )}
          {personal.location && (
            <span>📍 {personal.location}</span>
          )}
          {personal.website && (
            <span style={{ color: COLORS.accent }}>⬡ {personal.website}</span>
          )}
          {personal.linkedin && (
            <span style={{ color: COLORS.accent }}>in {personal.linkedin}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function SummarySection({ summary }) {
  if (!summary) return null;
  return (
    <div style={{ marginBottom: "22px" }}>
      <SectionHeader icon="</>" title="Profilo" />
      <p style={{
        fontSize: "12px",
        lineHeight: "1.7",
        color: COLORS.bodyText,
        margin: 0,
        fontFamily: "system-ui, sans-serif",
      }}>
        {summary}
      </p>
    </div>
  );
}

function SkillsSection({ skills }) {
  if (!skills || skills.length === 0) return null;
  return (
    <div style={{ marginBottom: "22px" }}>
      <SectionHeader icon="$" title="Competenze tecniche" />
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {skills.map((cat, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "10px",
              fontWeight: 600,
              color: COLORS.bodyMuted,
              minWidth: "90px",
              paddingTop: "3px",
              flexShrink: 0,
            }}>
              {cat.category}
            </span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
              {cat.tags.map((tag, ti) => (
                <span key={ti} style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  backgroundColor: COLORS.tagBg,
                  border: `1px solid ${COLORS.tagBorder}`,
                  borderRadius: "3px",
                  padding: "2px 8px",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "10px",
                  color: COLORS.accent,
                  fontWeight: 500,
                }}>
                  {tag.label}
                  {tag.versionsRange && (
                    <span style={{ color: COLORS.textMuted, fontSize: "9px" }}>
                      {tag.versionsRange}
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExperienceSection({ experience }) {
  if (!experience || experience.length === 0) return null;
  return (
    <div style={{ marginBottom: "22px" }}>
      <SectionHeader icon="⚙" title="Esperienza professionale" />
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {experience.map((exp) => (
          <div key={exp.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
              <div>
                <span style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: COLORS.bodyText,
                  fontFamily: "system-ui, sans-serif",
                }}>
                  {exp.role}
                </span>
                <span style={{
                  fontSize: "12px",
                  color: COLORS.bodyMuted,
                  fontFamily: "system-ui, sans-serif",
                  marginLeft: "8px",
                }}>
                  @ {exp.company}
                  {exp.location && ` · ${exp.location}`}
                </span>
              </div>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "10px",
                color: COLORS.accent,
                whiteSpace: "nowrap",
                flexShrink: 0,
                marginLeft: "12px",
              }}>
                {formatDate(exp.startDate)} – {formatDate(exp.endDate)}
              </span>
            </div>
            <ul style={{ margin: "6px 0 0", padding: 0, listStyle: "none" }}>
              {exp.bullets.filter(Boolean).map((bullet, bi) => (
                <li key={bi} style={{
                  display: "flex",
                  gap: "8px",
                  fontSize: "11.5px",
                  lineHeight: "1.6",
                  color: COLORS.bodyText,
                  fontFamily: "system-ui, sans-serif",
                  marginBottom: "2px",
                }}>
                  <span style={{ color: COLORS.accent, flexShrink: 0, fontWeight: 700 }}>•</span>
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function EducationSection({ education }) {
  if (!education || education.length === 0) return null;
  return (
    <div style={{ marginBottom: "22px" }}>
      <SectionHeader icon="⬡" title="Formazione" />
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {education.map((edu) => (
          <div key={edu.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <span style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: COLORS.bodyText,
                  fontFamily: "system-ui, sans-serif",
                }}>
                  {edu.degree}{edu.field ? ` in ${edu.field}` : ""}
                </span>
                <div style={{
                  fontSize: "11.5px",
                  color: COLORS.bodyMuted,
                  fontFamily: "system-ui, sans-serif",
                  marginTop: "2px",
                }}>
                  {edu.institution}{edu.grade ? ` · ${edu.grade}` : ""}
                </div>
              </div>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "10px",
                color: COLORS.accent,
                whiteSpace: "nowrap",
                flexShrink: 0,
                marginLeft: "12px",
              }}>
                {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
              </span>
            </div>
            {edu.thesis && (
              <p style={{
                fontSize: "11px",
                color: COLORS.bodyMuted,
                fontFamily: "system-ui, sans-serif",
                margin: "4px 0 0",
                fontStyle: "italic",
              }}>
                Tesi: {edu.thesis}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function CertificationsSection({ certifications }) {
  const items = certifications?.filter(Boolean) || [];
  if (items.length === 0) return null;
  return (
    <div style={{ marginBottom: "22px" }}>
      <SectionHeader icon="★" title="Certificazioni" />
      <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
        {items.map((cert, i) => (
          <li key={i} style={{
            display: "flex",
            gap: "8px",
            fontSize: "11.5px",
            lineHeight: "1.6",
            color: COLORS.bodyText,
            fontFamily: "system-ui, sans-serif",
          }}>
            <span style={{ color: COLORS.accent, flexShrink: 0, fontWeight: 700 }}>•</span>
            {cert}
          </li>
        ))}
      </ul>
    </div>
  );
}

function LanguagesSection({ languages }) {
  if (!languages || languages.length === 0) return null;
  return (
    <div style={{ marginBottom: "22px" }}>
      <SectionHeader icon="◎" title="Lingue" />
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {languages.map((lang, i) => (
          <span key={i} style={{
            fontSize: "11.5px",
            fontFamily: "system-ui, sans-serif",
            color: COLORS.bodyText,
          }}>
            <strong>{lang.language}</strong>
            {lang.level && (
              <span style={{ color: COLORS.bodyMuted }}> — {lang.level}</span>
            )}
            {i < languages.length - 1 && (
              <span style={{ color: COLORS.border, marginLeft: "8px" }}>|</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

function ProjectsSection({ projects }) {
  const items = projects?.filter(Boolean) || [];
  if (items.length === 0) return null;
  return (
    <div style={{ marginBottom: "22px" }}>
      <SectionHeader icon="▶" title="Progetti" />
      <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
        {items.map((proj, i) => (
          <li key={i} style={{
            display: "flex",
            gap: "8px",
            fontSize: "11.5px",
            lineHeight: "1.6",
            color: COLORS.bodyText,
            fontFamily: "system-ui, sans-serif",
            marginBottom: "2px",
          }}>
            <span style={{ color: COLORS.accent, flexShrink: 0, fontWeight: 700 }}>•</span>
            {proj}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Componente principale ───────────────────────────────────────────────────

export function TechDeveloper({ data }) {
  return (
    <div style={{
      width: "100%",
      backgroundColor: COLORS.white,
      fontFamily: "system-ui, sans-serif",
      fontSize: "12px",
      color: COLORS.bodyText,
    }}>
      {/* Header navy */}
      <HeaderSection personal={data.personal} />

      {/* Body */}
      <div style={{ padding: "28px 40px 32px", backgroundColor: COLORS.white }}>
        <SummarySection summary={data.personal.summary} />
        <SkillsSection skills={data.skills} />
        <ExperienceSection experience={data.experience} />
        <EducationSection education={data.education} />
        <CertificationsSection certifications={data.certifications} />
        <LanguagesSection languages={data.languages} />
        <ProjectsSection projects={data.projects} />
      </div>
    </div>
  );
}
