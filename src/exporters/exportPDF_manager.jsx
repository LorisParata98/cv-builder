import {
  Document,
  Image,
  Link,
  Page,
  pdf,
  Text,
  View,
} from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import { useTranslation } from "react-i18next";
import { getCVLocale, translateLevel } from "../utils/cvLocales.js";
import { makeHref, shortenLinkedIn, shortenWebsite } from "../utils/urlUtils.js";

// ─── Palette default (ManagerialExec) ────────────────────────────────────────
// accent  = sezione titoli, icone sidebar (default navy, customizzabile)
// accentLight = sottotitolo intestazione (sempre chiaro, non customizzabile)
const C_DEFAULT = {
  headerBg:    "#1e3a5f",
  accent:      "#1e3a5f",
  accentLight: "#e8eef5",
  leftBg:      "#f7f6f4",
  white:       "#ffffff",
  body:        "#2d2d2d",
  muted:       "#6b7280",
  border:      "#e5e7eb",
  tagBg:       "#e8eef5",
  tagText:     "#1e3a5f",
};

const FS_DEFAULT = { name: 24, role: 10, sectionHeader: 8, body: 9 };

function resolveC(customPalette) {
  const cp = customPalette || {};
  return {
    ...C_DEFAULT,
    ...(cp.bg     ? { headerBg: cp.bg }  : {}),
    ...(cp.accent ? { accent: cp.accent, tagText: cp.accent } : {}),
  };
}

function resolveFS(customFS) {
  return { ...FS_DEFAULT, ...(customFS || {}) };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatDate(d, L) {
  if (!d) return "";
  if (d === "present") return L?.present || "Presente";
  const [y, m] = d.split("-");
  if (!m) return y;
  const months = L?.months || ["Gen","Feb","Mar","Apr","Mag","Giu","Lug","Ago","Set","Ott","Nov","Dic"];
  return `${months[parseInt(m, 10) - 1]} ${y}`;
}

function getInlineText(domNode, baseStyle, keyBase) {
  const items = [];
  let i = 0;
  for (const child of domNode.childNodes) {
    const k = `${keyBase}-i${i++}`;
    if (child.nodeType === Node.TEXT_NODE) {
      const t = child.textContent;
      if (t) items.push(<Text key={k} style={baseStyle}>{t}</Text>);
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      const tag = child.tagName.toLowerCase();
      const st = { ...baseStyle };
      if (tag === "strong" || tag === "b") st.fontFamily = "Helvetica-Bold";
      if (tag === "em"     || tag === "i") st.fontFamily = "Helvetica-Oblique";
      if (tag === "u") st.textDecoration = "underline";
      items.push(...getInlineText(child, st, k));
    }
  }
  return items;
}

function htmlToPdfBlocks(html, textStyle, accentColor, bodySize) {
  if (!html) return null;
  const container = document.createElement("div");
  container.innerHTML = html;
  const blocks = [];
  let ki = 0;

  for (const node of container.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      const t = node.textContent?.trim();
      if (t) blocks.push(<Text key={ki++} style={textStyle}>{t}</Text>);
      continue;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) continue;
    const tag = node.tagName.toLowerCase();

    if (tag === "p") {
      const text = node.textContent?.trim();
      if (!text) { ki++; continue; }
      const inline = getInlineText(node, textStyle, String(ki));
      blocks.push(
        <Text key={ki++} style={{ ...textStyle, marginBottom: 3 }}>
          {inline.length > 0 ? inline : text}
        </Text>,
      );
    } else if (tag === "ul" || tag === "ol") {
      let num = 1;
      for (const li of node.children) {
        if (li.tagName.toLowerCase() !== "li") continue;
        const liInner = li.querySelector("p") || li;
        const text = liInner.textContent?.trim();
        if (!text) { ki++; continue; }
        const inline = getInlineText(liInner, { ...textStyle, flex: 1 }, String(ki));
        const dot = tag === "ol" ? `${num++}.` : "-";
        blocks.push(
          <View key={ki++} style={{ flexDirection: "row", marginBottom: 3, alignItems: "flex-start" }}>
            <Text style={{ color: accentColor, fontSize: bodySize, marginRight: 5, fontFamily: "Helvetica-Bold", flexShrink: 0 }}>
              {dot}
            </Text>
            <Text style={{ ...textStyle, flex: 1 }}>
              {inline.length > 0 ? inline : text}
            </Text>
          </View>,
        );
      }
    }
  }
  return blocks.length > 0 ? blocks : null;
}

// ─── Section header (colonna destra) ─────────────────────────────────────────
function RightSectionHeader({ label, C, fs }) {
  return (
    <View style={{ marginBottom: 8, marginTop: 4 }}>
      <Text style={{
        fontSize: fs.sectionHeader,
        fontFamily: "Helvetica-Bold",
        color: C.accent,
        textTransform: "uppercase",
        letterSpacing: 1.8,
        marginBottom: 3,
      }}>
        {label}
      </Text>
      <View style={{ height: 1, backgroundColor: C.accent }} />
    </View>
  );
}

// ─── Section header (colonna sinistra) ───────────────────────────────────────
function LeftSectionHeader({ label, C, fs }) {
  return (
    <View style={{ marginBottom: 6, marginTop: 14 }}>
      <Text style={{
        fontSize: Math.max(6, fs.sectionHeader - 1),
        fontFamily: "Helvetica-Bold",
        color: C.accent,
        textTransform: "uppercase",
        letterSpacing: 1.2,
        marginBottom: 3,
      }}>
        {label}
      </Text>
      <View style={{ height: 0.8, backgroundColor: C.accent, width: 20 }} />
    </View>
  );
}

// ─── Documento PDF ────────────────────────────────────────────────────────────
function CVDocumentManager({ data }) {
  const C  = resolveC(data.customPalettes?.manager);
  const fs = resolveFS(data.customFontSizes?.manager);
  const L  = getCVLocale(data.targetLanguage || "IT");
  const { t } = useTranslation();

  const {
    personal, skills, experience, education,
    certifications, languages, projects, note,
  } = data;

  const bodyStyle  = { fontSize: fs.body, lineHeight: 1.55, color: C.body, fontFamily: "Helvetica" };
  const mutedStyle = { fontSize: Math.max(7, fs.body - 1), color: C.muted, fontFamily: "Helvetica" };

  const norm = (p) => {
    if (typeof p === "string") return { title: p, description: "", url: "" };
    if (p.text !== undefined) return { title: p.text, description: "", url: p.url || "" };
    return p;
  };
  const projItems = projects.map(norm).filter((p) => p.title || p.description);

  const PAGE_PT = 20; // paddingTop della Page (riprodotto su ogni pagina)
  // Altezza approssimata dell'header (fisicamente: 0 → headerH grazie a marginTop:-PAGE_PT)
  const headerH = Math.ceil(22 + fs.name * 1.35 + 6 + fs.role * 1.3 + 18);
  // top sidebar: coordinate content-area = headerH - PAGE_PT (header sormonta padding)
  const sidebarTop = headerH - PAGE_PT;
  // A4 = 841.89pt. Sidebar clippata a pag. 1: fine content-area - inizio fisico sidebar
  const sidebarMaxH = 842 - 40 - headerH;

  return (
    <Document title={personal.name || "CV"} author={personal.name} subject="Curriculum Vitae">
      {/*
        Strategia multi-pagina:
        - Page bg = leftBg → il lato sinistro appare colorato su tutte le pagine
        - Header: flow normale, full-width
        - Sidebar: position:absolute (visibile solo pag. 1, su pag. 2+ leftBg funge da sfondo)
        - Contenuto principale: flow normale con marginLeft: "35%" → pagina correttamente
      */}
      <Page size="A4" style={{
        fontFamily: "Helvetica",
        backgroundColor: C.white,
        paddingTop: PAGE_PT,
        paddingBottom: 40,
      }}>

        {/* ── Sfondo colonna sinistra — fixed: copre tutte le pagine, evita strip colorata ── */}
        <View fixed style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "35%",
          height: 2000,
          backgroundColor: C.leftBg,
        }} />

        {/* ── Header full-width ── */}
        {/* marginTop: -PAGE_PT annulla il paddingTop su pag. 1; su pag. 2+ il paddingTop
            garantisce spazio dall'alto per il contenuto principale */}
        <View style={{ backgroundColor: C.headerBg, padding: "22 32 18 32", marginTop: -PAGE_PT }}>
          <Text style={{ fontFamily: "Helvetica-Bold", fontSize: fs.name, color: C.white, marginBottom: 4 }}>
            {personal.name}
          </Text>
          {/* sottotitolo usa accentLight (bianco/azzurro chiaro), non l'accent customizzabile */}
          <Text style={{ fontSize: fs.role, color: C.accentLight, textTransform: "uppercase", letterSpacing: 1.5 }}>
            {personal.title}
          </Text>
        </View>

        {/* ── Sidebar (assoluta — solo pag. 1, clippata a maxHeight) ── */}
        <View style={{
          position: "absolute",
          left: 0,
          top: sidebarTop,
          width: "35%",
          maxHeight: sidebarMaxH,
          overflow: "hidden",
          padding: "28 14 20 16",
        }}>

          {/* Foto */}
          {personal.photo && (
            <View style={{ alignItems: "center", marginBottom: 12 }}>
              <View style={{ width: 70, height: 70, borderRadius: 35, overflow: "hidden" }}>
                <Image
                  src={personal.photo}
                  style={{
                    width: 70,
                    height: 70,
                    objectFit: "cover",
                    objectPosition: `${personal.photoPosition?.x ?? 50}% ${personal.photoPosition?.y ?? 50}%`,
                  }}
                />
              </View>
            </View>
          )}

          {/* Contatti */}
          <View style={{ marginBottom: 4 }}>
            <LeftSectionHeader label={L.contacts} C={C} fs={fs} />
            {personal.email && (
              <Text style={{ ...mutedStyle, marginBottom: 4 }}>
                <Text style={{ color: C.accent }}>{t("editor.personal.email")}: </Text>
                {personal.email}
              </Text>
            )}
            {personal.phone && (
              <Text style={{ ...mutedStyle, marginBottom: 4 }}>
                <Text style={{ color: C.accent }}>{t("editor.personal.phone")}: </Text>
                {personal.phone}
              </Text>
            )}
            {personal.location && (
              <Text style={{ ...mutedStyle, marginBottom: 4 }}>
                <Text style={{ color: C.accent }}>{t("editor.personal.location")}: </Text>
                {personal.location}
              </Text>
            )}
            {personal.website && (
              <Link src={makeHref(personal.website)} style={{ ...mutedStyle, marginBottom: 4, textDecoration: "none", color: C.accent, fontFamily: "Helvetica-Bold" }}>
                {shortenWebsite(personal.website)}
              </Link>
            )}
            {personal.linkedin && (
              <Link src={makeHref(personal.linkedin)} style={{ ...mutedStyle, marginBottom: 4, textDecoration: "none", color: C.accent, fontFamily: "Helvetica-Bold" }}>
                {shortenLinkedIn(personal.linkedin)}
              </Link>
            )}
          </View>

          {/* Competenze */}
          {skills.length > 0 && (
            <View style={{ marginBottom: 4 }}>
              <LeftSectionHeader label={L.skillsShort} C={C} fs={fs} />
              {skills.map((cat, i) => (
                <View key={i}>
                  <Text style={{ fontSize: Math.max(6, fs.body - 2), fontFamily: "Helvetica-Bold", color: C.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 3, marginTop: i > 0 ? 12 : 0 }}>
                    {cat.category}
                  </Text>
                  <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    {cat.tags.map((tag, ti) => (
                      <View key={ti} style={{ backgroundColor: C.tagBg, paddingHorizontal: 5, paddingVertical: 2, marginRight: 2, marginBottom: 2, borderRadius: 2 }}>
                        <Text style={{ fontSize: Math.max(6, fs.body - 2), color: C.tagText }}>
                          {tag.label}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Lingue */}
          {languages.length > 0 && (
            <View style={{ marginBottom: 4 }}>
              <LeftSectionHeader label={L.languages} C={C} fs={fs} />
              {languages.map((l, i) => (
                <View key={i} style={{ marginBottom: 5 }}>
                  <Text style={{ ...bodyStyle, fontFamily: "Helvetica-Bold" }}>{l.language}</Text>
                  {l.level && <Text style={{ ...mutedStyle, marginTop: 3 }}>{translateLevel(l.level, L.lang)}</Text>}
                </View>
              ))}
            </View>
          )}

          {/* Certificazioni */}
          {certifications.filter(Boolean).length > 0 && (
            <View style={{ marginBottom: 4 }}>
              <LeftSectionHeader label={L.certifications} C={C} fs={fs} />
              {certifications.filter(Boolean).map((cert, i) => (
                <View key={i} style={{ flexDirection: "row", marginBottom: 4, alignItems: "flex-start" }}>
                  <Text style={{ color: C.accent, fontSize: Math.max(6, fs.body - 2), marginRight: 4, flexShrink: 0 }}>*</Text>
                  <Text style={{ ...mutedStyle, flex: 1, lineHeight: 1.4 }}>{cert}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* ── Contenuto principale (flow normale, pagina correttamente) ── */}
        <View style={{
          marginLeft: "35%",
          backgroundColor: C.white,
          padding: "16 24 20 18",
          minHeight: 600,
        }}>

          {/* Profilo */}
          {personal.summary && (
            <View style={{ marginBottom: 14 }} wrap={false}>
              <RightSectionHeader label={L.profile} C={C} fs={fs} />
              {htmlToPdfBlocks(personal.summary, bodyStyle, C.accent, fs.body)}
            </View>
          )}

          {/* Esperienza */}
          {experience.length > 0 && (
            <View style={{ marginBottom: 14 }}>
              <RightSectionHeader label={L.experienceShort} C={C} fs={fs} />
              {experience.map((exp) => (
                <View key={exp.id} style={{ marginBottom: 12 }} wrap={false}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 2 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ ...bodyStyle, fontFamily: "Helvetica-Bold", fontSize: fs.body + 1 }}>
                        {exp.role}
                      </Text>
                      <Text style={{ fontSize: fs.body, color: C.accent, fontFamily: "Helvetica-Bold", marginTop: 1 }}>
                        {exp.company}{exp.location ? ` · ${exp.location}` : ""}
                      </Text>
                    </View>
                    <Text style={{ ...mutedStyle, marginLeft: 8 }}>
                      {formatDate(exp.startDate, L)} - {formatDate(exp.endDate, L)}
                    </Text>
                  </View>
                  {exp.description && (
                    <View style={{ marginTop: 4 }}>
                      {htmlToPdfBlocks(exp.description, bodyStyle, C.accent, fs.body)}
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Formazione */}
          {education.length > 0 && (
            <View style={{ marginBottom: 14 }}>
              <RightSectionHeader label={L.education} C={C} fs={fs} />
              {education.map((edu) => (
                <View key={edu.id} style={{ marginBottom: 10 }} wrap={false}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ ...bodyStyle, fontFamily: "Helvetica-Bold", fontSize: fs.body + 1 }}>
                        {edu.degree}{edu.field ? ` in ${edu.field}` : ""}
                      </Text>
                      <Text style={mutedStyle}>
                        {edu.institution}{edu.grade ? ` · ${edu.grade}` : ""}
                      </Text>
                    </View>
                    <Text style={{ ...mutedStyle, marginLeft: 8 }}>
                      {formatDate(edu.startDate, L)} - {formatDate(edu.endDate, L)}
                    </Text>
                  </View>
                  {edu.thesis && (
                    <Text style={{ ...mutedStyle, fontStyle: "italic", marginTop: 3 }}>
                      {L.thesis}: {edu.thesis}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Progetti */}
          {projItems.length > 0 && (
            <View style={{ marginBottom: 14 }}>
              <RightSectionHeader label={L.projects} C={C} fs={fs} />
              {projItems.map((proj, i) => (
                <View key={i} style={{ marginBottom: 6, flexDirection: "row", alignItems: "flex-start" }} wrap={false}>
                  <Text style={{ color: C.accent, fontFamily: "Helvetica-Bold", fontSize: fs.body, marginRight: 5, flexShrink: 0 }}>-</Text>
                  <View style={{ flex: 1 }}>
                    {proj.title && (
                      <Text style={{ ...bodyStyle, fontFamily: "Helvetica-Bold" }}>{proj.title}</Text>
                    )}
                    {proj.url && (
                      <Text style={{ fontSize: Math.max(6, fs.body - 2), color: C.accent }}>
                        {proj.url}
                      </Text>
                    )}
                    {proj.description && (
                      <View style={{ marginTop: 1 }}>
                        {htmlToPdfBlocks(proj.description, bodyStyle, C.accent, fs.body)}
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Note */}
          {note && (
            <View style={{ marginBottom: 14 }} wrap={false}>
              <RightSectionHeader label={L.notes} C={C} fs={fs} />
              {htmlToPdfBlocks(note, bodyStyle, C.accent, fs.body)}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}

// ─── Funzione export ──────────────────────────────────────────────────────────
export async function exportManagerPDF(data) {
  const blob = await pdf(<CVDocumentManager data={data} />).toBlob();
  const name = (data.personal.name || "cv").replace(/\s+/g, "-").toLowerCase();
  saveAs(blob, `${name}.pdf`);
}
