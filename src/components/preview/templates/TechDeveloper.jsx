// TechDeveloper.jsx — Profilo sviluppatore / ingegnere
// Palette: dark navy #0f2644 + accent teal #4ec9b0
// Font: JetBrains Mono (titoli), system-ui (corpo)
// Layout: colonna singola, ATS-safe

import { getLocale } from "../../../locales/index.js";
import {
  makeHref,
  shortenWebsite,
  shortenLinkedIn,
} from "../../../utils/urlUtils.js";

const COLORS_DEFAULT = {
  bg: "#0f2644",
  bgLight: "#162f52",
  accent: "#4ec9b0",
  accentOrange: "#e07b3e",
  text: "#e8eaf0",
  textMuted: "#8fa8c8",
  tagBg: "#1a3a60",
  tagText: "#ffffff",
  tagBorder: "#4ec9b0",
  white: "#ffffff",
  bodyBg: "#f8f9fa",
  bodyText: "#1a1a2e",
  bodyMuted: "#4a5568",
  border: "#dde3ed",
};

// Font sizes di default (px) — sovrascrivibili con customFontSizes
const FS_DEFAULT = { name: 26, role: 12, sectionHeader: 10, body: 11 };

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatDate(dateStr, L) {
  if (!dateStr) return "";
  if (dateStr === "present") return L.present;
  const [year, month] = dateStr.split("-");
  if (!month) return year;
  return `${L.months[parseInt(month, 10) - 1]} ${year}`;
}

function SectionHeader({ icon, title, C, fs }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "12px",
      }}
    >
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: `${fs.sectionHeader + 1}px`,
          color: C.accent,
          fontWeight: 600,
        }}
      >
        {icon}
      </span>
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: `${fs.sectionHeader}px`,
          fontWeight: 700,
          color: C.bodyMuted,
          textTransform: "uppercase",
          letterSpacing: "1.5px",
        }}
      >
        {title}
      </span>
      <div style={{ flex: 1, height: "1px", backgroundColor: C.border }} />
    </div>
  );
}

// ─── Sezioni ────────────────────────────────────────────────────────────────

function HeaderSection({ personal, C, fs }) {
  return (
    <div
      style={{
        backgroundColor: C.bg,
        padding: "32px 40px 28px",
        display: "flex",
        gap: "24px",
        alignItems: "flex-start",
      }}
    >
      {personal.photo && (
        <div
          style={{
            width: "80px",
            height: "80px",
            flexShrink: 0,
            border: `2px solid ${C.accent}`,
            overflow: "hidden",
            borderRadius: "4px",
          }}
        >
          <img
            src={personal.photo}
            alt={personal.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: `${personal.photoPosition?.x ?? 50}% ${personal.photoPosition?.y ?? 50}%`,
            }}
          />
        </div>
      )}

      <div>
        <h1
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: `${fs.name}px`,
            fontWeight: 700,
            color: C.white,
            margin: 0,
            letterSpacing: "-0.5px",
            lineHeight: 1.2,
          }}
        >
          {personal.name || "Il tuo nome"}
        </h1>
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: `${fs.role}px`,
            color: C.accent,
            margin: "6px 0 12px",
            fontWeight: 500,
          }}
        >
          {personal.title || "Il tuo ruolo"}
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 18px" }}>
          {[
            personal.email && {
              raw: `mailto:${personal.email}`,
              display: personal.email,
              prefix: "✉",
            },
            personal.phone && {
              raw: null,
              display: personal.phone,
              prefix: "☎",
            },
            personal.location && {
              raw: null,
              display: personal.location,
              prefix: "📍",
            },
            personal.website && {
              raw: makeHref(personal.website),
              display: shortenWebsite(personal.website),
              prefix: "gh",
            },
            personal.linkedin && {
              raw: makeHref(personal.linkedin),
              display: shortenLinkedIn(personal.linkedin),
              prefix: "in",
            },
          ]
            .filter(Boolean)
            .map((item, i) => (
              <span
                key={i}
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: `${Math.max(8, fs.body - 2)}px`,
                  color: C.textMuted,
                }}
              >
                <span style={{ color: C.accent }}>{item.prefix} </span>
                {item.raw ? (
                  <a
                    href={item.raw}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "inherit", textDecoration: "none" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.textDecoration = "underline")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.textDecoration = "none")
                    }
                  >
                    {item.display}
                  </a>
                ) : (
                  item.display
                )}
              </span>
            ))}
        </div>
      </div>
    </div>
  );
}

function SummarySection({ summary, C, L, fs }) {
  if (!summary) return null;
  return (
    <div style={{ marginBottom: "22px" }}>
      <SectionHeader icon="</>" title={L.profile} C={C} fs={fs} />
      <div
        className="rtf-preview"
        style={{
          "--rtf-accent": C.accent,
          fontSize: `${fs.body + 1}px`,
          lineHeight: "1.7",
          color: C.bodyText,
          fontFamily: "system-ui, sans-serif",
        }}
        dangerouslySetInnerHTML={{ __html: summary }}
      />
    </div>
  );
}

function SkillsSection({ skills, C, L, fs }) {
  if (!skills || skills.length === 0) return null;
  return (
    <div style={{ marginBottom: "22px" }}>
      <SectionHeader icon="$" title={L.skills} C={C} fs={fs} />
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {skills.map((cat, i) => (
          <div
            key={i}
            style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: `${fs.body - 1}px`,
                fontWeight: 600,
                color: C.bodyMuted,
                minWidth: "90px",
                paddingTop: "3px",
                flexShrink: 0,
              }}
            >
              {cat.category}
            </span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
              {cat.tags.map((tag, ti) => (
                <span
                  key={ti}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    backgroundColor: C.tagBg,
                    border: `1px solid ${C.accent}`,
                    borderRadius: "3px",
                    padding: "2px 8px",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: `${fs.body - 1}px`,
                    color: C.accent,
                    fontWeight: 500,
                  }}
                >
                  {tag.label}
                  {tag.versionsRange && (
                    <span
                      style={{
                        color: C.textMuted,
                        fontSize: `${Math.max(8, fs.body - 2)}px`,
                      }}
                    >
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

function ExperienceSection({ experience, C, L, fs }) {
  if (!experience || experience.length === 0) return null;
  return (
    <div style={{ marginBottom: "22px" }}>
      <SectionHeader icon=">>" title={L.experience} C={C} fs={fs} />
      {experience.map((exp) => (
        <div key={exp.id} style={{ marginBottom: "16px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "6px",
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: "system-ui, sans-serif",
                  fontSize: `${fs.body + 2}px`,
                  fontWeight: 700,
                  color: C.bodyText,
                  margin: 0,
                }}
              >
                {exp.role}
              </p>
              <p
                style={{
                  fontSize: `${fs.body}px`,
                  color: C.bodyMuted,
                  margin: "2px 0 0",
                  fontFamily: "system-ui, sans-serif",
                }}
              >
                {exp.company}
                {exp.location ? ` · ${exp.location}` : ""}
              </p>
            </div>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: `${Math.max(8, fs.body - 2)}px`,
                color: C.accent,
                whiteSpace: "nowrap",
                marginLeft: "12px",
              }}
            >
              {formatDate(exp.startDate, L)} – {formatDate(exp.endDate, L)}
            </span>
          </div>
          {exp.description && (
            <div
              className="rtf-preview"
              style={{
                "--rtf-accent": C.accent,
                fontSize: `${fs.body}px`,
                lineHeight: "1.65",
                color: C.bodyText,
                fontFamily: "system-ui, sans-serif",
              }}
              dangerouslySetInnerHTML={{ __html: exp.description }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function EducationSection({ education, C, L, fs }) {
  if (!education || education.length === 0) return null;
  return (
    <div style={{ marginBottom: "22px" }}>
      <SectionHeader icon="[]" title={L.education} C={C} fs={fs} />
      {education.map((edu) => (
        <div key={edu.id} style={{ marginBottom: "12px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: "system-ui, sans-serif",
                  fontSize: `${fs.body + 2}px`,
                  fontWeight: 700,
                  color: C.bodyText,
                  margin: 0,
                }}
              >
                {edu.degree}
                {edu.field ? ` in ${edu.field}` : ""}
              </p>
              <p
                style={{
                  fontSize: `${fs.body}px`,
                  color: C.bodyMuted,
                  margin: "2px 0 0",
                  fontFamily: "system-ui, sans-serif",
                }}
              >
                {edu.institution}
                {edu.grade ? ` · ${edu.grade}` : ""}
              </p>
            </div>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: `${Math.max(8, fs.body - 2)}px`,
                color: C.accent,
                whiteSpace: "nowrap",
                marginLeft: "12px",
              }}
            >
              {formatDate(edu.startDate, L)} – {formatDate(edu.endDate, L)}
            </span>
          </div>
          {edu.thesis && (
            <p
              style={{
                fontSize: `${Math.max(8, fs.body - 1)}px`,
                color: C.bodyMuted,
                fontStyle: "italic",
                marginTop: "4px",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              {L.thesis}: {edu.thesis}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function CertificationsSection({ certifications, C, L, fs }) {
  const items = (certifications || []).filter(Boolean);
  if (items.length === 0) return null;
  return (
    <div style={{ marginBottom: "22px" }}>
      <SectionHeader icon="[*]" title={L.certifications} C={C} fs={fs} />
      {items.map((cert, i) => (
        <div
          key={i}
          style={{ display: "flex", gap: "8px", marginBottom: "4px" }}
        >
          <span
            style={{
              color: C.accent,
              flexShrink: 0,
              fontWeight: 700,
              fontSize: `${fs.body}px`,
            }}
          >
            ★
          </span>
          <span
            style={{
              fontSize: `${fs.body}px`,
              color: C.bodyText,
              lineHeight: 1.6,
              fontFamily: "system-ui, sans-serif",
            }}
          >
            {cert}
          </span>
        </div>
      ))}
    </div>
  );
}

function LanguagesSection({ languages, C, L, fs }) {
  if (!languages || languages.length === 0) return null;
  return (
    <div style={{ marginBottom: "22px" }}>
      <SectionHeader icon="Aa" title={L.languages} C={C} fs={fs} />
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {languages.map((lang, i) => (
          <span
            key={i}
            style={{
              fontSize: `${fs.body}px`,
              color: C.bodyText,
              fontFamily: "system-ui, sans-serif",
            }}
          >
            <strong>{lang.language}</strong>
            {lang.level && (
              <span style={{ color: C.bodyMuted }}> – {lang.level}</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

function ProjectsSection({ projects, C, L, fs }) {
  const items = (projects || []).filter(Boolean);
  if (items.length === 0) return null;
  return (
    <div style={{ marginBottom: "22px" }}>
      <SectionHeader icon=">" title={L.projects} C={C} fs={fs} />
      {items.map((proj, i) => (
        <div
          key={i}
          style={{ display: "flex", gap: "8px", marginBottom: "5px" }}
        >
          <span
            style={{
              color: C.accent,
              flexShrink: 0,
              fontWeight: 700,
              fontSize: `${fs.body}px`,
            }}
          >
            ▶
          </span>
          <span
            style={{
              fontSize: `${fs.body}px`,
              color: C.bodyText,
              lineHeight: 1.6,
              fontFamily: "system-ui, sans-serif",
            }}
          >
            {proj}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Componente principale ────────────────────────────────────────────────────
export function TechDeveloper({
  data,
  customColors = {},
  customFontSizes = {},
  locale,
}) {
  const C = { ...COLORS_DEFAULT, ...customColors };
  const fs = { ...FS_DEFAULT, ...customFontSizes };
  const L = locale || getLocale("IT");
  const {
    personal,
    skills,
    experience,
    education,
    certifications,
    languages,
    projects,
  } = data;

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: C.bodyBg,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <HeaderSection personal={personal} C={C} fs={fs} />
      <div style={{ padding: "28px 40px 32px" }}>
        <SummarySection summary={personal.summary} C={C} L={L} fs={fs} />
        <SkillsSection skills={skills} C={C} L={L} fs={fs} />
        <ExperienceSection experience={experience} C={C} L={L} fs={fs} />
        <EducationSection education={education} C={C} L={L} fs={fs} />
        <CertificationsSection
          certifications={certifications}
          C={C}
          L={L}
          fs={fs}
        />
        <LanguagesSection languages={languages} C={C} L={L} fs={fs} />
        <ProjectsSection projects={projects} C={C} L={L} fs={fs} />
      </div>
    </div>
  );
}
