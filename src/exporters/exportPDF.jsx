import { Document, Page, Text, View, StyleSheet, Image, Font, pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';

// ─── Font registration ────────────────────────────────────────────────────────
// Usiamo font system-safe: Helvetica (sans) già built-in in react-pdf
// Per monospace usiamo Courier (built-in)

// ─── Colori (stessa palette TechDeveloper HTML) ───────────────────────────────
const C = {
  navy: '#0f2644',
  navyLight: '#162f52',
  teal: '#4ec9b0',
  white: '#ffffff',
  textMuted: '#8fa8c8',
  body: '#1a1a2e',
  bodyMuted: '#4a5568',
  tagBg: '#1a3a60',
  border: '#dde3ed',
};

// ─── Stili ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: C.body,
    backgroundColor: C.white,
  },
  // Header
  header: {
    backgroundColor: C.navy,
    padding: '24 32 20 32',
    flexDirection: 'row',
    gap: 16,
  },
  photo: {
    width: 64,
    height: 64,
    objectFit: 'cover',
  },
  headerInfo: { flex: 1 },
  name: {
    fontFamily: 'Courier-Bold',
    fontSize: 20,
    color: C.white,
    marginBottom: 4,
  },
  title: {
    fontFamily: 'Courier',
    fontSize: 10,
    color: C.teal,
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  contact: {
    fontSize: 8,
    color: C.textMuted,
    marginRight: 12,
  },
  contactAccent: {
    fontSize: 8,
    color: C.teal,
    marginRight: 12,
  },
  // Body
  body: { padding: '20 32 28 32' },
  // Section header
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 4,
  },
  sectionIcon: {
    fontFamily: 'Courier-Bold',
    fontSize: 8,
    color: C.teal,
    marginRight: 5,
  },
  sectionLabel: {
    fontFamily: 'Courier-Bold',
    fontSize: 7,
    color: C.bodyMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginRight: 6,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: C.border,
  },
  section: { marginBottom: 14 },
  // Summary
  summary: { fontSize: 9.5, lineHeight: 1.6, color: C.body },
  // Skills
  skillRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  skillCategory: {
    fontFamily: 'Courier-Bold',
    fontSize: 8,
    color: C.bodyMuted,
    width: 80,
    paddingTop: 2,
  },
  skillTags: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
  },
  tag: {
    backgroundColor: C.tagBg,
    borderRadius: 2,
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginRight: 3,
    marginBottom: 3,
  },
  tagText: {
    fontFamily: 'Courier',
    fontSize: 7.5,
    color: C.teal,
  },
  tagVersion: {
    fontFamily: 'Courier',
    fontSize: 6.5,
    color: C.textMuted,
  },
  // Experience
  expHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 3,
  },
  expRole: { fontFamily: 'Helvetica-Bold', fontSize: 10, color: C.body },
  expCompany: { fontSize: 9, color: C.bodyMuted, marginTop: 1 },
  expDate: {
    fontFamily: 'Courier',
    fontSize: 8,
    color: C.teal,
  },
  bullet: {
    flexDirection: 'row',
    marginBottom: 2,
    paddingLeft: 4,
  },
  bulletDot: { color: C.teal, fontSize: 9, marginRight: 5, fontFamily: 'Helvetica-Bold' },
  bulletText: { flex: 1, fontSize: 9, lineHeight: 1.5, color: C.body },
  expBlock: { marginBottom: 12 },
  // Education
  eduHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  eduDegree: { fontFamily: 'Helvetica-Bold', fontSize: 10, color: C.body },
  eduInstitution: { fontSize: 9, color: C.bodyMuted, marginTop: 1 },
  eduDate: { fontFamily: 'Courier', fontSize: 8, color: C.teal },
  eduThesis: { fontSize: 8, color: C.bodyMuted, fontStyle: 'italic', marginTop: 3 },
  eduBlock: { marginBottom: 10 },
  // Certs / Lang / Projects
  listItem: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  listDot: { color: C.teal, fontSize: 9, marginRight: 5, fontFamily: 'Helvetica-Bold' },
  listText: { flex: 1, fontSize: 9, lineHeight: 1.5, color: C.body },
  langRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  langItem: { fontSize: 9, color: C.body },
  langLevel: { fontSize: 9, color: C.bodyMuted },
  // ATS keywords invisibili (testo bianco su bianco)
  atsHidden: {
    fontSize: 1,
    color: C.white,
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
});

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatDate(d) {
  if (!d) return '';
  if (d === 'present') return 'Presente';
  const [y, m] = d.split('-');
  if (!m) return y;
  const months = ['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic'];
  return `${months[parseInt(m,10)-1]} ${y}`;
}

function SectionHeader({ icon, label }) {
  return (
    <View style={s.sectionRow}>
      <Text style={s.sectionIcon}>{icon}</Text>
      <Text style={s.sectionLabel}>{label}</Text>
      <View style={s.sectionLine} />
    </View>
  );
}

// ─── Documento PDF ────────────────────────────────────────────────────────────
function CVDocument({ data }) {
  const { personal, skills, experience, education, certifications, languages, projects } = data;

  // Raccoglie tutte le atsKeywords per embedding invisibile
  const allAtsKeywords = skills
    .flatMap(cat => cat.tags.flatMap(tag => tag.atsKeywords || []))
    .filter(Boolean)
    .join(' ');

  return (
    <Document title={personal.name || 'CV'} author={personal.name} subject="Curriculum Vitae">
      <Page size="A4" style={s.page}>
        {/* Header navy */}
        <View style={s.header}>
          {personal.photo && (
            <Image src={personal.photo} style={s.photo} />
          )}
          <View style={s.headerInfo}>
            <Text style={s.name}>{personal.name}</Text>
            <Text style={s.title}>{personal.title}</Text>
            <View style={s.contactRow}>
              {personal.email && <Text style={s.contact}>✉ {personal.email}</Text>}
              {personal.phone && <Text style={s.contact}>☎ {personal.phone}</Text>}
              {personal.location && <Text style={s.contact}>📍 {personal.location}</Text>}
              {personal.website && <Text style={s.contactAccent}>{personal.website}</Text>}
              {personal.linkedin && <Text style={s.contactAccent}>{personal.linkedin}</Text>}
            </View>
          </View>
        </View>

        {/* Body */}
        <View style={s.body}>
          {/* Profilo */}
          {personal.summary ? (
            <View style={s.section}>
              <SectionHeader icon="</>" label="Profilo" />
              <Text style={s.summary}>{personal.summary}</Text>
            </View>
          ) : null}

          {/* Competenze */}
          {skills.length > 0 && (
            <View style={s.section}>
              <SectionHeader icon="$" label="Competenze tecniche" />
              {skills.map((cat, i) => (
                <View key={i} style={s.skillRow}>
                  <Text style={s.skillCategory}>{cat.category}</Text>
                  <View style={s.skillTags}>
                    {cat.tags.map((tag, ti) => (
                      <View key={ti} style={s.tag}>
                        <Text style={s.tagText}>
                          {tag.label}
                          {tag.versionsRange ? <Text style={s.tagVersion}> {tag.versionsRange}</Text> : null}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Esperienza */}
          {experience.length > 0 && (
            <View style={s.section}>
              <SectionHeader icon="⚙" label="Esperienza professionale" />
              {experience.map((exp) => (
                <View key={exp.id} style={s.expBlock}>
                  <View style={s.expHeader}>
                    <View>
                      <Text style={s.expRole}>{exp.role}</Text>
                      <Text style={s.expCompany}>
                        {exp.company}{exp.location ? ` · ${exp.location}` : ''}
                      </Text>
                    </View>
                    <Text style={s.expDate}>
                      {formatDate(exp.startDate)} – {formatDate(exp.endDate)}
                    </Text>
                  </View>
                  {exp.bullets.filter(Boolean).map((b, bi) => (
                    <View key={bi} style={s.bullet}>
                      <Text style={s.bulletDot}>•</Text>
                      <Text style={s.bulletText}>{b}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          )}

          {/* Formazione */}
          {education.length > 0 && (
            <View style={s.section}>
              <SectionHeader icon="⬡" label="Formazione" />
              {education.map((edu) => (
                <View key={edu.id} style={s.eduBlock}>
                  <View style={s.eduHeader}>
                    <View>
                      <Text style={s.eduDegree}>
                        {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                      </Text>
                      <Text style={s.eduInstitution}>
                        {edu.institution}{edu.grade ? ` · ${edu.grade}` : ''}
                      </Text>
                    </View>
                    <Text style={s.eduDate}>
                      {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                    </Text>
                  </View>
                  {edu.thesis ? <Text style={s.eduThesis}>Tesi: {edu.thesis}</Text> : null}
                </View>
              ))}
            </View>
          )}

          {/* Certificazioni */}
          {certifications.filter(Boolean).length > 0 && (
            <View style={s.section}>
              <SectionHeader icon="★" label="Certificazioni" />
              {certifications.filter(Boolean).map((c, i) => (
                <View key={i} style={s.listItem}>
                  <Text style={s.listDot}>•</Text>
                  <Text style={s.listText}>{c}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Lingue */}
          {languages.length > 0 && (
            <View style={s.section}>
              <SectionHeader icon="◎" label="Lingue" />
              <View style={s.langRow}>
                {languages.map((l, i) => (
                  <Text key={i} style={s.langItem}>
                    <Text style={{ fontFamily: 'Helvetica-Bold' }}>{l.language}</Text>
                    {l.level ? <Text style={s.langLevel}> — {l.level}</Text> : null}
                  </Text>
                ))}
              </View>
            </View>
          )}

          {/* Progetti */}
          {projects.filter(Boolean).length > 0 && (
            <View style={s.section}>
              <SectionHeader icon="▶" label="Progetti" />
              {projects.filter(Boolean).map((p, i) => (
                <View key={i} style={s.listItem}>
                  <Text style={s.listDot}>•</Text>
                  <Text style={s.listText}>{p}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* ATS keywords invisibili — testo bianco su bianco, non visibile all'occhio */}
        {allAtsKeywords && (
          <Text style={s.atsHidden}>{allAtsKeywords}</Text>
        )}
      </Page>
    </Document>
  );
}

// ─── Funzione export ──────────────────────────────────────────────────────────
export async function exportPDF(data) {
  const blob = await pdf(<CVDocument data={data} />).toBlob();
  const name = (data.personal.name || 'cv').replace(/\s+/g, '-').toLowerCase();
  saveAs(blob, `${name}.pdf`);
}
