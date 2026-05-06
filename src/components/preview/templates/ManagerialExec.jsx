// ManagerialExec.jsx — Profilo manager / executive
// Layout due colonne, Playfair Display, palette navy + bianco

import { getLocale } from "../../../locales/index.js";

const COLORS_DEFAULT = {
  bg:          '#1e3a5f',
  bgDark:      '#152c4a',
  accent:      '#1e3a5f',
  accentLight: '#e8eef5',
  white:       '#ffffff',
  body:        '#2d2d2d',
  muted:       '#6b7280',
  border:      '#e5e7eb',
  leftBg:      '#f7f6f4',
  tagBg:       '#e8eef5',
  tagText:     '#1e3a5f',
};

function formatDate(d, L) {
  if (!d) return '';
  if (d === 'present') return L.present;
  const [y, m] = d.split('-');
  if (!m) return y;
  return `${L.months[parseInt(m, 10) - 1]} ${y}`;
}

function SectionTitle({ children, C }) {
  return (
    <div style={{ marginBottom: '10px', marginTop: '4px' }}>
      <span style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: '10px',
        fontWeight: 700,
        color: C.accent,
        textTransform: 'uppercase',
        letterSpacing: '2px',
        borderBottom: `2px solid ${C.accent}`,
        paddingBottom: '3px',
        display: 'inline-block',
      }}>
        {children}
      </span>
    </div>
  );
}

function SectionTitleLight({ children, C }) {
  return (
    <div style={{ marginBottom: '8px', marginTop: '4px' }}>
      <span style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: '9px',
        fontWeight: 700,
        color: C.accent,
        textTransform: 'uppercase',
        letterSpacing: '1.5px',
        borderBottom: `1px solid ${C.accent}`,
        paddingBottom: '2px',
        display: 'inline-block',
      }}>
        {children}
      </span>
    </div>
  );
}

// ─── Colonna sinistra ─────────────────────────────────────────────────────────
function LeftColumn({ data, C, L }) {
  const { personal, skills, languages, certifications } = data;

  return (
    <div style={{
      width: '36%',
      flexShrink: 0,
      backgroundColor: C.leftBg,
      borderRight: `1px solid ${C.border}`,
      padding: '28px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    }}>
      {/* Foto circolare */}
      {personal.photo && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
          <div style={{
            width: '96px', height: '96px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: `3px solid ${C.accent}`,
            boxShadow: '0 2px 12px rgba(30,58,95,0.2)',
          }}>
            <img src={personal.photo} alt={personal.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      )}

      {/* Contatti */}
      <div>
        <SectionTitleLight C={C}>{L.contacts}</SectionTitleLight>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {[
            { icon: '✉', val: personal.email },
            { icon: '☎', val: personal.phone },
            { icon: '📍', val: personal.location },
            { icon: '🔗', val: personal.website },
            { icon: 'in', val: personal.linkedin },
          ].filter(x => x.val).map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '9px', color: C.accent, flexShrink: 0, minWidth: '14px' }}>{item.icon}</span>
              <span style={{ fontSize: '9px', color: C.body, wordBreak: 'break-all', lineHeight: 1.4 }}>{item.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Competenze */}
      {skills.length > 0 && (
        <div>
          <SectionTitleLight C={C}>{L.skillsShort}</SectionTitleLight>
          {skills.map((cat, i) => (
            <div key={i} style={{ marginBottom: '8px' }}>
              <p style={{ fontSize: '8px', fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                {cat.category}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                {cat.tags.map((tag, ti) => (
                  <span key={ti} style={{
                    backgroundColor: C.tagBg,
                    color: C.accent,
                    fontSize: '8.5px',
                    padding: '2px 6px',
                    borderRadius: '3px',
                    fontWeight: 500,
                  }}>
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
          <SectionTitleLight C={C}>{L.languages}</SectionTitleLight>
          {languages.map((l, i) => (
            <div key={i} style={{ marginBottom: '5px' }}>
              <p style={{ fontSize: '9px', fontWeight: 700, color: C.body, marginBottom: '1px' }}>{l.language}</p>
              {l.level && <p style={{ fontSize: '8px', color: C.muted }}>{l.level}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Certificazioni */}
      {certifications.filter(Boolean).length > 0 && (
        <div>
          <SectionTitleLight C={C}>{L.certifications}</SectionTitleLight>
          {certifications.filter(Boolean).map((cert, i) => (
            <div key={i} style={{ display: 'flex', gap: '5px', marginBottom: '4px', alignItems: 'flex-start' }}>
              <span style={{ color: C.accent, fontSize: '8px', flexShrink: 0 }}>★</span>
              <span style={{ fontSize: '8.5px', color: C.body, lineHeight: 1.4 }}>{cert}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Colonna destra ───────────────────────────────────────────────────────────
function RightColumn({ data, C, L }) {
  const { personal, experience, education, projects } = data;

  return (
    <div style={{ flex: 1, padding: '28px 28px 32px', overflowY: 'visible' }}>

      {/* Sommario */}
      {personal.summary && (
        <div style={{ marginBottom: '20px' }}>
          <SectionTitle C={C}>{L.profile}</SectionTitle>
          <p style={{ fontSize: '10px', lineHeight: 1.7, color: C.body, fontFamily: 'system-ui, sans-serif' }}>
            {personal.summary}
          </p>
        </div>
      )}

      {/* Esperienza */}
      {experience.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <SectionTitle C={C}>{L.experienceShort}</SectionTitle>
          {experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2px' }}>
                <div>
                  <p style={{ fontSize: '11px', fontWeight: 700, color: C.body, fontFamily: "'Playfair Display', serif" }}>
                    {exp.role}
                  </p>
                  <p style={{ fontSize: '10px', color: C.accent, fontWeight: 600, marginTop: '1px' }}>
                    {exp.company}{exp.location ? ` · ${exp.location}` : ''}
                  </p>
                </div>
                <span style={{ fontSize: '9px', color: C.muted, whiteSpace: 'nowrap', marginLeft: '10px', marginTop: '1px' }}>
                  {formatDate(exp.startDate, L)} – {formatDate(exp.endDate, L)}
                </span>
              </div>
              <ul style={{ margin: '5px 0 0', padding: 0, listStyle: 'none' }}>
                {exp.bullets.filter(Boolean).map((b, bi) => (
                  <li key={bi} style={{ display: 'flex', gap: '6px', fontSize: '10px', lineHeight: 1.6, color: C.body, marginBottom: '2px' }}>
                    <span style={{ color: C.accent, flexShrink: 0, fontWeight: 700 }}>—</span>
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
        <div style={{ marginBottom: '20px' }}>
          <SectionTitle C={C}>{L.education}</SectionTitle>
          {education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: '11px', fontWeight: 700, color: C.body, fontFamily: "'Playfair Display', serif" }}>
                    {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                  </p>
                  <p style={{ fontSize: '10px', color: C.muted, marginTop: '1px' }}>
                    {edu.institution}{edu.grade ? ` · ${edu.grade}` : ''}
                  </p>
                </div>
                <span style={{ fontSize: '9px', color: C.muted, whiteSpace: 'nowrap', marginLeft: '10px' }}>
                  {formatDate(edu.startDate, L)} – {formatDate(edu.endDate, L)}
                </span>
              </div>
              {edu.thesis && (
                <p style={{ fontSize: '9px', color: C.muted, fontStyle: 'italic', marginTop: '3px' }}>
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
          <SectionTitle C={C}>{L.projects}</SectionTitle>
          {projects.filter(Boolean).map((p, i) => (
            <div key={i} style={{ display: 'flex', gap: '6px', marginBottom: '4px', alignItems: 'flex-start' }}>
              <span style={{ color: C.accent, flexShrink: 0, fontWeight: 700 }}>—</span>
              <span style={{ fontSize: '10px', color: C.body, lineHeight: 1.6 }}>{p}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Componente principale ────────────────────────────────────────────────────
export function ManagerialExec({ data, customColors = {}, locale }) {
  const C = { ...COLORS_DEFAULT, ...customColors };
  const L = locale || getLocale('IT');

  return (
    <div style={{ width: '100%', backgroundColor: C.white, fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{
        backgroundColor: C.bg,
        padding: '28px 32px 24px',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
      }}>
        <div>
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '30px',
            fontWeight: 700,
            color: C.white,
            margin: 0,
            letterSpacing: '-0.5px',
            lineHeight: 1.15,
          }}>
            {data.personal.name || 'Il tuo nome'}
          </h1>
          <p style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '11px',
            color: C.accentLight,
            margin: '6px 0 0',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            fontWeight: 500,
          }}>
            {data.personal.title || 'Il tuo ruolo'}
          </p>
        </div>
      </div>

      {/* Corpo a due colonne */}
      <div style={{ display: 'flex', minHeight: '900px' }}>
        <LeftColumn data={data} C={C} L={L} />
        <RightColumn data={data} C={C} L={L} />
      </div>
    </div>
  );
}
