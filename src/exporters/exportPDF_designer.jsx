import {
  Document,
  Page,
  Text,
  View,
  Image,
  Link,
  pdf,
} from "@react-pdf/renderer";
import { makeHref, shortenWebsite, shortenLinkedIn } from "../utils/urlUtils.js";
import { saveAs } from "file-saver";
import { getCVLocale, translateLevel } from "../utils/cvLocales.js";
import { useTranslation } from "react-i18next";

// ─── Palette (matching CreativeDesigner HTML) ─────────────────────────────────
const PALETTES = {
  "noir-gold": {
    bg:          "#0D0D0D",
    accent:      "#C8B89A",
    textPrimary: "#F5F0E8",
    textMuted:   "#888888",
    tagBg:       "#2A2A2A",
    tagBorder:   "#C8B89A",
    tagText:     "#C8B89A",
    sidebarBg:   "#1A1A1A",
    contentBg:   "#ffffff",
    contentText: "#1a1a1a",
    contentMuted:"#555555",
  },
  "indigo-electric": {
    bg:          "#F7F6FF",
    accent:      "#5B4FE8",
    textPrimary: "#1A1060",
    textMuted:   "#555555",
    tagBg:       "#EEEDFE",
    tagBorder:   "#5B4FE8",
    tagText:     "#3D35B0",
    sidebarBg:   "#EEEDFE",
    contentBg:   "#ffffff",
    contentText: "#1A1060",
    contentMuted:"#555555",
  },
  "forest-stone": {
    bg:          "#F0EDE8",
    accent:      "#2D6A4F",
    textPrimary: "#1B4332",
    textMuted:   "#4A4A4A",
    tagBg:       "#D8F3DC",
    tagBorder:   "#2D6A4F",
    tagText:     "#1B4332",
    sidebarBg:   "#E8F5E9",
    contentBg:   "#FAFAF8",
    contentText: "#1B4332",
    contentMuted:"#4A4A4A",
  },
};

const FS_DEFAULT = { name: 28, role: 11, sectionHeader: 9, body: 10 };

function resolvePalette(designerPalette, customPalettes) {
  const base = PALETTES[designerPalette] || PALETTES["noir-gold"];
  const cp   = customPalettes || {};
  return {
    ...base,
    ...(cp.accent    ? { accent:    cp.accent    } : {}),
    ...(cp.sidebarBg ? { sidebarBg: cp.sidebarBg } : {}),
    ...(cp.bg        ? { bg:        cp.bg        } : {}),
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

// ─── Section header (contenuto principale) ───────────────────────────────────
function ContentSectionHeader({ label, p, fs }) {
  return (
    <View style={{ marginBottom: 8, marginTop: 4 }}>
      <Text style={{
        fontSize: fs.sectionHeader,
        fontFamily: "Helvetica-Bold",
        color: p.accent,
        textTransform: "uppercase",
        letterSpacing: 2,
        marginBottom: 3,
      }}>
        {label}
      </Text>
      <View style={{ height: 2, width: 28, backgroundColor: p.accent, borderRadius: 1 }} />
    </View>
  );
}

// ─── Section header (sidebar) ─────────────────────────────────────────────────
function SidebarSectionHeader({ label, p, fs }) {
  return (
    <View style={{ marginBottom: 8 }}>
      <Text style={{
        fontSize: Math.max(6, fs.sectionHeader - 1),
        fontFamily: "Helvetica-Bold",
        color: p.accent,
        textTransform: "uppercase",
        letterSpacing: 1.5,
      }}>
        {label}
      </Text>
    </View>
  );
}

// ─── Documento PDF ────────────────────────────────────────────────────────────
function CVDocumentDesigner({ data }) {
  const p  = resolvePalette(data.designerPalette, data.customPalettes?.designer);
  const fs = resolveFS(data.customFontSizes?.designer);
  const L  = getCVLocale(data.targetLanguage || "IT");
  const { t } = useTranslation();

  const {
    personal, skills, experience, education,
    certifications, languages, projects, note,
  } = data;

  const sbSize     = Math.max(7, fs.body - 1.5);
  const sidebarText = { fontSize: sbSize, color: p.textMuted, fontFamily: "Helvetica", lineHeight: 1.4 };
  const contentText = { fontSize: fs.body, color: p.contentText, fontFamily: "Helvetica", lineHeight: 1.55 };
  const contentMuted = { fontSize: Math.max(7, fs.body - 1.5), color: p.contentMuted, fontFamily: "Helvetica" };

  const norm = (item) => {
    if (typeof item === "string") return { title: item, description: "", url: "" };
    if (item.text !== undefined) return { title: item.text, description: "", url: item.url || "" };
    return item;
  };
  const projItems = projects.map(norm).filter((item) => item.title || item.description);

  const PAGE_PT = 20;

  return (
    <Document title={personal.name || "CV"} author={personal.name} subject="Curriculum Vitae">
      {/*
        Page bg = contentBg.
        Fixed View copre colonna sinistra con sidebarBg su tutte le pagine.
        Body row = flex row: sidebar (34%) + main (flex: 1), yoga gestisce le altezze.
      */}
      <Page size="A4" style={{ fontFamily: "Helvetica", backgroundColor: p.contentBg, paddingTop: PAGE_PT, paddingBottom: 20 }}>

        {/* ── Sfondo colonna sinistra — fixed: tutte le pagine ── */}
        <View fixed style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "34%",
          height: 2000,
          backgroundColor: p.sidebarBg,
        }} />

        {/* ── Header full-width ── */}
        <View style={{ backgroundColor: p.bg, padding: "28 32 20 32", borderBottom: `3 solid ${p.accent}`, marginTop: -PAGE_PT }}>
          <Text style={{ fontFamily: "Helvetica-Bold", fontSize: fs.name, color: p.textPrimary, marginBottom: 6, letterSpacing: -0.5 }}>
            {personal.name}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <View style={{ width: 28, height: 2, backgroundColor: p.accent }} />
            <Text style={{ fontSize: fs.role, color: p.accent, fontFamily: "Helvetica-Bold", letterSpacing: 1.2, textTransform: "uppercase" }}>
              {personal.title}
            </Text>
          </View>
        </View>

        {/* ── Body row: sidebar + main ── */}
        <View style={{ flexDirection: "row" }}>

        {/* ── Sidebar sinistra ── */}
        <View style={{ width: "34%", padding: "20 14 20 16" }}>

            {/* Foto */}
            <View style={{ alignItems: "center", marginBottom: 16 }}>
              {personal.photo ? (
                <View style={{ width: 72, height: 72, borderRadius: 36, overflow: "hidden" }}>
                  <Image
                    src={personal.photo}
                    style={{
                      width: 72,
                      height: 72,
                      objectFit: "cover",
                      objectPosition: `${personal.photoPosition?.x ?? 50}% ${personal.photoPosition?.y ?? 50}%`,
                    }}
                  />
                </View>
              ) : (
                <View style={{ width: 60, height: 60, borderRadius: 30, border: `2 dashed ${p.accent}`, alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ color: p.accent, fontSize: 20, fontFamily: "Helvetica-Bold" }}>?</Text>
                </View>
              )}
            </View>

            {/* Contatti */}
            <View style={{ marginBottom: 20 }}>
              <SidebarSectionHeader label={L.contacts} p={p} fs={fs} />
              {personal.email && (
                <Text style={{ ...sidebarText, marginBottom: 7 }}>
                  <Text style={{ color: p.accent }}>{t("editor.personal.email")}: </Text>
                  {personal.email}
                </Text>
              )}
              {personal.phone && (
                <Text style={{ ...sidebarText, marginBottom: 7 }}>
                  <Text style={{ color: p.accent }}>{t("editor.personal.phone")}: </Text>
                  {personal.phone}
                </Text>
              )}
              {personal.location && (
                <Text style={{ ...sidebarText, marginBottom: 7 }}>
                  <Text style={{ color: p.accent }}>{t("editor.personal.location")}: </Text>
                  {personal.location}
                </Text>
              )}
              {personal.website && (
                <Link src={makeHref(personal.website)} style={{ ...sidebarText, marginBottom: 7, textDecoration: "none", color: p.accent, fontFamily: "Helvetica-Bold" }}>
                  {shortenWebsite(personal.website)}
                </Link>
              )}
              {personal.linkedin && (
                <Link src={makeHref(personal.linkedin)} style={{ ...sidebarText, marginBottom: 7, textDecoration: "none", color: p.accent, fontFamily: "Helvetica-Bold" }}>
                  {shortenLinkedIn(personal.linkedin)}
                </Link>
              )}
            </View>

            {/* Competenze */}
            {skills.length > 0 && (
              <View style={{ marginBottom: 20 }}>
                <SidebarSectionHeader label={L.skillsShort} p={p} fs={fs} />
                {skills.map((cat, i) => (
                  <View key={i} style={{ marginBottom: i < skills.length - 1 ? 9 : 0 }}>
                    <Text style={{ fontSize: Math.max(6, sbSize - 1.5), color: p.textMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 5 }}>
                      {cat.category}
                    </Text>
                    <View style={{ flexDirection: "row", flexWrap: "wrap", paddingBottom: 4 }}>
                      {cat.tags.map((tag, ti) => (
                        <View key={ti} style={{ backgroundColor: p.tagBg, borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2, marginRight: 3, marginBottom: 3, border: `1 solid ${p.tagBorder}` }}>
                          <Text style={{ fontSize: Math.max(6, sbSize - 1), color: p.tagText }}>
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
              <View style={{ marginBottom: 20 }}>
                <SidebarSectionHeader label={L.languages} p={p} fs={fs} />
                {languages.map((l, i) => (
                  <View key={i} style={{ marginBottom: i < languages.length - 1 ? 12 : 0 }}>
                    <Text style={{ fontSize: sbSize, fontFamily: "Helvetica-Bold", color: p.textPrimary }}>
                      {l.language}
                    </Text>
                    {l.level && (
                      <Text style={{ fontSize: Math.max(6, sbSize - 1), color: p.textMuted, marginTop: 2 }}>
                        {translateLevel(l.level, L.lang)}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* Certificazioni */}
            {certifications.filter(Boolean).length > 0 && (
              <View>
                <SidebarSectionHeader label={L.certifications} p={p} fs={fs} />
                {certifications.filter(Boolean).map((cert, i) => (
                  <View key={i} style={{ flexDirection: "row", gap: 6, marginBottom: 10, alignItems: "flex-start" }}>
                    <Text style={{ color: p.accent, fontSize: Math.max(6, sbSize - 1), flexShrink: 0, marginTop: 1 }}>*</Text>
                    <Text style={{ ...sidebarText, flex: 1 }}>{cert}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

        {/* ── Contenuto principale ── */}
        <View style={{ flex: 1, padding: "20 24 20 20" }}>

            {/* Profilo */}
            {personal.summary && (
              <View style={{ marginBottom: 16 }} wrap={false}>
                <ContentSectionHeader label={L.profile} p={p} fs={fs} />
                {htmlToPdfBlocks(personal.summary, contentText, p.accent, fs.body)}
              </View>
            )}

            {/* Esperienza */}
            {experience.length > 0 && (
              <View style={{ marginBottom: 16 }}>
                <ContentSectionHeader label={L.experienceShort} p={p} fs={fs} />
                {experience.map((exp) => (
                  <View key={exp.id} style={{ marginBottom: 12 }} wrap={false}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 2 }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ ...contentText, fontFamily: "Helvetica-Bold", fontSize: fs.body + 1 }}>
                          {exp.role}
                        </Text>
                        <Text style={{ fontSize: fs.body, color: p.accent, fontFamily: "Helvetica-Bold", marginTop: 1 }}>
                          {exp.company}{exp.location ? ` · ${exp.location}` : ""}
                        </Text>
                      </View>
                      <Text style={{ ...contentMuted, marginLeft: 8 }}>
                        {formatDate(exp.startDate, L)} - {formatDate(exp.endDate, L)}
                      </Text>
                    </View>
                    {exp.description && (
                      <View style={{ marginTop: 4 }}>
                        {htmlToPdfBlocks(exp.description, contentText, p.accent, fs.body)}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* Formazione */}
            {education.length > 0 && (
              <View style={{ marginBottom: 16 }}>
                <ContentSectionHeader label={L.education} p={p} fs={fs} />
                {education.map((edu) => (
                  <View key={edu.id} style={{ marginBottom: 10 }} wrap={false}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ ...contentText, fontFamily: "Helvetica-Bold", fontSize: fs.body + 1 }}>
                          {edu.degree}{edu.field ? ` in ${edu.field}` : ""}
                        </Text>
                        <Text style={contentMuted}>
                          {edu.institution}{edu.grade ? ` · ${edu.grade}` : ""}
                        </Text>
                      </View>
                      <Text style={{ ...contentMuted, marginLeft: 8 }}>
                        {formatDate(edu.startDate, L)} - {formatDate(edu.endDate, L)}
                      </Text>
                    </View>
                    {edu.thesis && (
                      <Text style={{ ...contentMuted, fontStyle: "italic", marginTop: 3 }}>
                        {L.thesis}: {edu.thesis}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* Progetti */}
            {projItems.length > 0 && (
              <View style={{ marginBottom: 16 }}>
                <ContentSectionHeader label={L.projects} p={p} fs={fs} />
                {projItems.map((proj, i) => (
                  <View key={i} style={{ marginBottom: 7, flexDirection: "row", alignItems: "flex-start" }} wrap={false}>
                    <Text style={{ color: p.accent, fontFamily: "Helvetica-Bold", fontSize: fs.body, marginRight: 6, flexShrink: 0 }}>-</Text>
                    <View style={{ flex: 1 }}>
                      {proj.title && (
                        <Text style={{ ...contentText, fontFamily: "Helvetica-Bold" }}>{proj.title}</Text>
                      )}
                      {proj.url && (
                        <Text style={{ fontSize: Math.max(6, fs.body - 2), color: p.accent }}>
                          {proj.url}
                        </Text>
                      )}
                      {proj.description && (
                        <View style={{ marginTop: 2 }}>
                          {htmlToPdfBlocks(proj.description, contentText, p.accent, fs.body)}
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
                <ContentSectionHeader label={L.notes} p={p} fs={fs} />
                {htmlToPdfBlocks(note, contentText, p.accent, fs.body)}
              </View>
            )}
          </View>
        </View>{/* fine body row */}
      </Page>
    </Document>
  );
}

// ─── Funzione export ──────────────────────────────────────────────────────────
export async function exportDesignerPDF(data) {
  const blob = await pdf(<CVDocumentDesigner data={data} />).toBlob();
  const name = (data.personal.name || "cv").replace(/\s+/g, "-").toLowerCase();
  saveAs(blob, `${name}.pdf`);
}
