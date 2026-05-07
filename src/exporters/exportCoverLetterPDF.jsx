import { Document, Page, Text, View, StyleSheet, Image, pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';

// ─── Colori dal template ──────────────────────────────────────────────────────
const DESIGNER_PALETTE_COLORS = {
  "noir-gold":       { bg: "#0D0D0D", accent: "#C8B89A" },
  "indigo-electric": { bg: "#1a1a2e", accent: "#7c3aed" },
  "forest-stone":    { bg: "#1c2b1c", accent: "#8fa87c" },
};

function resolveColors(template, designerPalette, customColors = {}) {
  if (template === "tech") {
    return {
      bg:     customColors.bg     || "#0f2644",
      accent: customColors.accent || "#4ec9b0",
    };
  }
  if (template === "manager") {
    return {
      bg:     customColors.bg     || "#1e3a5f",
      accent: customColors.accent || "#c8a951",
    };
  }
  if (template === "designer") {
    const p = DESIGNER_PALETTE_COLORS[designerPalette] || DESIGNER_PALETTE_COLORS["noir-gold"];
    return {
      bg:     customColors.bg     || p.bg,
      accent: customColors.accent || p.accent,
    };
  }
  return { bg: "#0f2644", accent: "#4ec9b0" };
}

function formatDate(isoDate) {
  if (!isoDate) return new Date().toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" });
  try {
    return new Date(isoDate + "T00:00:00").toLocaleDateString("it-IT", {
      day: "numeric", month: "long", year: "numeric",
    });
  } catch {
    return isoDate;
  }
}

// ─── Documento react-pdf ──────────────────────────────────────────────────────
function CoverLetterPDFDoc({ data, colors }) {
  const { personal = {}, coverLetter: cl = {} } = data;

  const s = StyleSheet.create({
    page: {
      fontFamily: "Helvetica",
      fontSize: 11,
      color: "#1e293b",
      backgroundColor: "#ffffff",
    },
    header: {
      backgroundColor: colors.bg,
      padding: "22 36 18 36",
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
    },
    photo: {
      width: 52, height: 52,
      borderRadius: 26,
      objectFit: "cover",
    },
    headerInfo: { flex: 1 },
    name: {
      fontFamily: "Helvetica-Bold",
      fontSize: 18,
      color: "#ffffff",
      marginBottom: 3,
    },
    role: {
      fontSize: 10,
      color: colors.accent,
      marginBottom: 5,
    },
    contacts: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },
    contactItem: {
      fontSize: 9,
      color: "rgba(255,255,255,0.65)",
    },
    accentBar: {
      height: 3,
      backgroundColor: colors.accent,
    },
    body: {
      padding: "28 40 36",
    },
    dateRow: {
      fontSize: 10,
      color: "#64748b",
      textAlign: "right",
      marginBottom: 18,
    },
    recipient: {
      fontSize: 11,
      color: "#334155",
      lineHeight: 1.55,
      marginBottom: 20,
    },
    recipientName: {
      fontFamily: "Helvetica-Bold",
      fontSize: 11,
      color: "#334155",
    },
    salutation: {
      fontFamily: "Helvetica-Bold",
      fontSize: 11,
      color: "#1e293b",
      marginBottom: 14,
    },
    paragraph: {
      fontSize: 11,
      lineHeight: 1.7,
      color: "#1e293b",
      marginBottom: 12,
    },
    closing: {
      marginTop: 24,
      fontSize: 11,
      color: "#1e293b",
      lineHeight: 1.7,
    },
    signature: {
      fontFamily: "Helvetica-Bold",
      fontSize: 13,
      color: colors.bg,
      marginTop: 18,
    },
  });

  const paragraphs = (cl.letterBody || "")
    .split(/\n{2,}/)
    .map((p) => p.replace(/\n/g, " ").trim())
    .filter(Boolean);

  const salutation = cl.hiringManager
    ? `Gentile ${cl.hiringManager},`
    : `Gentile Team ${cl.company || "Hiring"},`;

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          {personal.photo && (
            <Image src={personal.photo} style={s.photo} />
          )}
          <View style={s.headerInfo}>
            <Text style={s.name}>{personal.name || "Nome Cognome"}</Text>
            {(personal.role || personal.title) && (
              <Text style={s.role}>{personal.role || personal.title}</Text>
            )}
            <View style={s.contacts}>
              {personal.email    && <Text style={s.contactItem}>{personal.email}</Text>}
              {personal.phone    && <Text style={s.contactItem}>{personal.phone}</Text>}
              {personal.location && <Text style={s.contactItem}>{personal.location}</Text>}
              {personal.linkedin && <Text style={s.contactItem}>{personal.linkedin}</Text>}
            </View>
          </View>
        </View>

        {/* Accent bar */}
        <View style={s.accentBar} />

        {/* Body */}
        <View style={s.body}>
          {/* Data */}
          <Text style={s.dateRow}>{formatDate(cl.date)}</Text>

          {/* Destinatario */}
          {(cl.company || cl.hiringManager) && (
            <View style={{ marginBottom: 16 }}>
              {cl.hiringManager && <Text style={s.recipientName}>{cl.hiringManager}</Text>}
              {cl.company       && <Text style={s.recipient}>{cl.company}</Text>}
              {cl.role          && <Text style={{ ...s.recipient, fontSize: 10, color: "#64748b" }}>Rif.: {cl.role}</Text>}
            </View>
          )}

          {/* Saluto */}
          <Text style={s.salutation}>{salutation}</Text>

          {/* Paragrafi */}
          {paragraphs.map((para, i) => (
            <Text key={i} style={s.paragraph}>{para}</Text>
          ))}

          {/* Chiusura */}
          {paragraphs.length > 0 && (
            <View style={s.closing}>
              <Text>{cl.closingLine || "Cordiali saluti"},</Text>
              <Text style={s.signature}>{personal.name || ""}</Text>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}

// ─── Export pubblico ──────────────────────────────────────────────────────────
export async function exportCoverLetterPDF(data) {
  const { template, designerPalette, customPalettes } = data;
  const customColors = (customPalettes && customPalettes[template]) || {};
  const colors = resolveColors(template, designerPalette, customColors);

  const blob = await pdf(<CoverLetterPDFDoc data={data} colors={colors} />).toBlob();
  const name = (data.personal?.name || "cover-letter")
    .replace(/\s+/g, "-")
    .toLowerCase();
  saveAs(blob, `cover-letter-${name}.pdf`);
}
