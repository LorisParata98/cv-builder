// ManagerialExec.jsx — Profilo manager / executive
// Layout due colonne, Playfair Display, palette navy + bianco

import { memo } from "react";
import { getCVLocale, translateLevel } from "../../../utils/cvLocales.js";
import {
  makeHref,
  shortenWebsite,
  shortenLinkedIn,
} from "../../../utils/urlUtils.js";
import { formatDate } from "../../../utils/translationUtils";

const COLORS_DEFAULT = {
  bg: "#1e3a5f",
  bgDark: "#152c4a",
  accent: "#1e3a5f",
  accentLight: "#e8eef5",
  white: "#ffffff",
  body: "#2d2d2d",
  muted: "#6b7280",
  border: "#e5e7eb",
  leftBg: "#f7f6f4",
  tagBg: "#e8eef5",
  tagText: "#1e3a5f",
};

const FS_DEFAULT = { name: 30, role: 11, sectionHeader: 10, body: 10 };

function SectionTitle({ children, C, fs }) {
  return (
    <div style={{ marginBottom: "10px", marginTop: "4px" }}>
      <span
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: `${fs.sectionHeader}px`,
          fontWeight: 700,
          color: C.accent,
          textTransform: "uppercase",
          letterSpacing: "2px",
          borderBottom: `2px solid ${C.accent}`,
          paddingBottom: "3px",
          display: "inline-block",
        }}
      >
        {children}
      </span>
    </div>
  );
}

function SectionTitleLight({ children, C, fs }) {
  return (
    <div style={{ marginBottom: "8px", marginTop: "4px" }}>
      <span
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: `${Math.max(7, fs.sectionHeader - 1)}px`,
          fontWeight: 700,
          color: C.accent,
          textTransform: "uppercase",
          letterSpacing: "1.5px",
          borderBottom: `1px solid ${C.accent}`,
          paddingBottom: "2px",
          display: "inline-block",
        }}
      >
        {children}
      </span>
    </div>
  );
}

// ─── Colonna sinistra ─────────────────────────────────────────────────────────
function LeftColumn({ data, C, L, fs }) {
  const { personal, skills, languages, certifications } = data;

  return (
    <div
      style={{
        width: "36%",
        flexShrink: 0,
        backgroundColor: C.leftBg,
        borderRight: `1px solid ${C.border}`,
        padding: "28px 20px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      {personal.photo && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "4px",
          }}
        >
          <div
            style={{
              width: "96px",
              height: "96px",
              borderRadius: "50%",
              overflow: "hidden",
              border: `3px solid ${C.accent}`,
              boxShadow: "0 2px 12px rgba(30,58,95,0.2)",
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
        </div>
      )}

      {/* Contatti */}
      <div>
        <SectionTitleLight C={C} fs={fs}>
          {L.contacts}
        </SectionTitleLight>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {[
            {
              icon: "✉",
              raw: `mailto:${personal.email}`,
              display: personal.email,
            },
            { icon: "☎", raw: null, display: personal.phone },
            { icon: "📍", raw: null, display: personal.location },
            {
              icon: "🔗",
              raw: makeHref(personal.website),
              display: shortenWebsite(personal.website),
            },
            {
              icon: "in",
              raw: makeHref(personal.linkedin),
              display: shortenLinkedIn(personal.linkedin),
            },
          ]
            .filter((x) => x.display)
            .map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "6px",
                  alignItems: "flex-start",
                }}
              >
                <span
                  style={{
                    fontSize: `${Math.max(7, fs.body - 1)}px`,
                    color: C.accent,
                    flexShrink: 0,
                    minWidth: "14px",
                  }}
                >
                  {item.icon}
                </span>
                <span
                  style={{
                    fontSize: `${Math.max(7, fs.body - 1)}px`,
                    color: C.body,
                    wordBreak: "break-word",
                    lineHeight: 1.4,
                  }}
                >
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
              </div>
            ))}
        </div>
      </div>

      {/* Competenze */}
      {skills.length > 0 && (
        <div>
          <SectionTitleLight C={C} fs={fs}>
            {L.skillsShort}
          </SectionTitleLight>
          {skills.map((cat, i) => (
            <div key={i} style={{ marginBottom: "8px" }}>
              <p
                style={{
                  fontSize: `${Math.max(7, fs.body - 2)}px`,
                  fontWeight: 700,
                  color: C.muted,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "4px",
                }}
              >
                {cat.category}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "3px" }}>
                {cat.tags.map((tag, ti) => (
                  <span
                    key={ti}
                    style={{
                      backgroundColor: C.tagBg,
                      color: C.accent,
                      fontSize: `${Math.max(7, fs.body - 1.5)}px`,
                      padding: "2px 6px",
                      borderRadius: "3px",
                      fontWeight: 500,
                    }}
                  >
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
          <SectionTitleLight C={C} fs={fs}>
            {L.languages}
          </SectionTitleLight>
          {languages.map((l, i) => (
            <div key={i} style={{ marginBottom: "5px" }}>
              <p
                style={{
                  fontSize: `${Math.max(7, fs.body - 1)}px`,
                  fontWeight: 700,
                  color: C.body,
                  marginBottom: "1px",
                }}
              >
                {l.language}
              </p>
              {l.level && (
                <p
                  style={{
                    fontSize: `${Math.max(7, fs.body - 2)}px`,
                    color: C.muted,
                  }}
                >
                  {translateLevel(l.level, L.lang)}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Certificazioni */}
      {certifications.filter(Boolean).length > 0 && (
        <div>
          <SectionTitleLight C={C} fs={fs}>
            {L.certifications}
          </SectionTitleLight>
          {certifications.filter(Boolean).map((cert, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "5px",
                marginBottom: "4px",
                alignItems: "flex-start",
              }}
            >
              <span
                style={{
                  color: C.accent,
                  fontSize: `${Math.max(7, fs.body - 2)}px`,
                  flexShrink: 0,
                }}
              >
                ★
              </span>
              <span
                style={{
                  fontSize: `${Math.max(7, fs.body - 1.5)}px`,
                  color: C.body,
                  lineHeight: 1.4,
                }}
              >
                {cert}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Colonna destra ───────────────────────────────────────────────────────────
function RightColumn({ data, C, L, fs }) {
  const { personal, experience, education, projects } = data;

  return (
    <div style={{ flex: 1, padding: "28px 28px 32px", overflowY: "visible" }}>
      {personal.summary && (
        <div style={{ marginBottom: "20px" }}>
          <SectionTitle C={C} fs={fs}>
            {L.profile}
          </SectionTitle>
          <div
            className="rtf-preview"
            style={{
              "--rtf-accent": C.accent,
              fontSize: `${fs.body}px`,
              lineHeight: 1.7,
              color: C.body,
              fontFamily: "system-ui, sans-serif",
            }}
            dangerouslySetInnerHTML={{ __html: personal.summary }}
          />
        </div>
      )}

      {experience.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <SectionTitle C={C} fs={fs}>
            {L.experienceShort}
          </SectionTitle>
          {experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: "14px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "2px",
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: `${fs.body + 1}px`,
                      fontWeight: 700,
                      color: C.body,
                      fontFamily: "'Playfair Display', serif",
                    }}
                  >
                    {exp.role}
                  </p>
                  <p
                    style={{
                      fontSize: `${fs.body}px`,
                      color: C.accent,
                      fontWeight: 600,
                      marginTop: "1px",
                    }}
                  >
                    {exp.company}
                    {exp.location ? ` · ${exp.location}` : ""}
                  </p>
                </div>
                <span
                  style={{
                    fontSize: `${Math.max(7, fs.body - 1)}px`,
                    color: C.muted,
                    whiteSpace: "nowrap",
                    marginLeft: "10px",
                    marginTop: "1px",
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
                    lineHeight: 1.6,
                    color: C.body,
                    fontFamily: "system-ui, sans-serif",
                    marginTop: "5px",
                  }}
                  dangerouslySetInnerHTML={{ __html: exp.description }}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {education.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <SectionTitle C={C} fs={fs}>
            {L.education}
          </SectionTitle>
          {education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: "10px" }}>
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
                      fontSize: `${fs.body + 1}px`,
                      fontWeight: 700,
                      color: C.body,
                      fontFamily: "'Playfair Display', serif",
                    }}
                  >
                    {edu.degree}
                    {edu.field ? ` in ${edu.field}` : ""}
                  </p>
                  <p
                    style={{
                      fontSize: `${fs.body}px`,
                      color: C.muted,
                      marginTop: "1px",
                    }}
                  >
                    {edu.institution}
                    {edu.grade ? ` · ${edu.grade}` : ""}
                  </p>
                </div>
                <span
                  style={{
                    fontSize: `${Math.max(7, fs.body - 1)}px`,
                    color: C.muted,
                    whiteSpace: "nowrap",
                    marginLeft: "10px",
                  }}
                >
                  {formatDate(edu.startDate, L)} – {formatDate(edu.endDate, L)}
                </span>
              </div>
              {edu.thesis && (
                <p
                  style={{
                    fontSize: `${Math.max(7, fs.body - 1)}px`,
                    color: C.muted,
                    fontStyle: "italic",
                    marginTop: "3px",
                  }}
                >
                  {L.thesis}: {edu.thesis}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {(() => {
        const norm = (p) => {
          if (typeof p === "string")
            return { title: p, description: "", url: "" };
          if (p.text !== undefined)
            return { title: p.text, description: "", url: p.url || "" };
          return p;
        };
        const items = projects
          .map(norm)
          .filter((p) => p.title || p.description);
        if (items.length === 0) return null;
        return (
          <div>
            <SectionTitle C={C} fs={fs}>
              {L.projects}
            </SectionTitle>
            {items.map((proj, i) => (
              <div key={i} style={{ marginBottom: "6px" }}>
                <div
                  style={{
                    display: "flex",
                    gap: "6px",
                    alignItems: "baseline",
                  }}
                >
                  <span
                    style={{ color: C.accent, flexShrink: 0, fontWeight: 700 }}
                  >
                    —
                  </span>
                  <span>
                    {proj.title && (
                      <span
                        style={{
                          fontSize: `${fs.body}px`,
                          color: C.body,
                          fontWeight: 700,
                          lineHeight: 1.6,
                        }}
                      >
                        {proj.title}
                      </span>
                    )}
                    {proj.url && (
                      <a
                        href={
                          proj.url.startsWith("http")
                            ? proj.url
                            : `https://${proj.url}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline",
                          fontSize: `${fs.small ?? fs.body - 1}px`,
                          color: C.accent,
                          textDecoration: "none",
                          marginLeft: "6px",
                        }}
                      >
                        {proj.url}
                      </a>
                    )}
                  </span>
                </div>
                {proj.description && (
                  <div
                    className="rtf-preview"
                    style={{
                      "--rtf-accent": C.accent,
                      fontSize: `${fs.body}px`,
                      color: C.body,
                      paddingLeft: "14px",
                    }}
                    dangerouslySetInnerHTML={{ __html: proj.description }}
                  />
                )}
              </div>
            ))}
          </div>
        );
      })()}
    </div>
  );
}

// ─── Componente principale ────────────────────────────────────────────────────
export const ManagerialExec = memo(function ManagerialExec({
  data,
  customColors = {},
  customFontSizes = {},
  locale,
}) {
  const C = { ...COLORS_DEFAULT, ...customColors };
  const fs = { ...FS_DEFAULT, ...customFontSizes };
  const L = locale || getCVLocale("IT");

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: C.white,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: C.bg,
          padding: "28px 32px 24px",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: `${fs.name}px`,
              fontWeight: 700,
              color: C.white,
              margin: 0,
              letterSpacing: "-0.5px",
              lineHeight: 1.15,
            }}
          >
            {data.personal.name || "Il tuo nome"}
          </h1>
          <p
            style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: `${fs.role}px`,
              color: C.accentLight,
              margin: "6px 0 0",
              textTransform: "uppercase",
              letterSpacing: "2px",
              fontWeight: 500,
            }}
          >
            {data.personal.title || "Il tuo ruolo"}
          </p>
        </div>
      </div>

      {/* Corpo a due colonne */}
      <div style={{ display: "flex", minHeight: "900px" }}>
        <LeftColumn data={data} C={C} L={L} fs={fs} />
        <RightColumn data={data} C={C} L={L} fs={fs} />
      </div>

      {/* Note — sezione full-width in fondo */}
      {data.note && (
        <div style={{ padding: "0 32px 28px" }}>
          <SectionTitle C={C} fs={fs}>
            {L.notes}
          </SectionTitle>
          <div
            className="rtf-preview"
            style={{
              "--rtf-accent": C.accent,
              fontSize: `${fs.body}px`,
              color: C.body,
              lineHeight: "1.7",
            }}
            dangerouslySetInnerHTML={{ __html: data.note }}
          />
        </div>
      )}
    </div>
  );
});
