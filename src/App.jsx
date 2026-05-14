import { useState, useRef, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Desktop } from "@phosphor-icons/react";
import { Sidebar } from "./components/ui/Sidebar";
import { Toolbar } from "./components/ui/Toolbar";
import { EditorPanel } from "./components/editor/EditorPanel";
import { CVPreview } from "./components/preview/CVPreview";
import { CoverLetterPreview } from "./components/preview/CoverLetterPreview";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";
import { useCVStore } from "./store/useCVStore";
import { translateCV } from "./services/translateCV";

function Toast({ message, type, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3500);
    return () => clearTimeout(t);
  }, [message, onDismiss]);

  const bg =
    type === "error" ? "#ef4444" : type === "success" ? "#22c55e" : "#3b82f6";

  return (
    <div
      onClick={onDismiss}
      style={{
        position: "fixed",
        bottom: "24px",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: bg,
        color: "#fff",
        padding: "10px 20px",
        borderRadius: "8px",
        fontSize: "13px",
        fontWeight: 500,
        boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
        cursor: "pointer",
        zIndex: 9999,
        pointerEvents: "auto",
        animation: "fadeSlideUp 0.25s ease",
        whiteSpace: "nowrap",
      }}
    >
      {message}
    </div>
  );
}

function MobileWarning() {
  const { t } = useTranslation();
  const [dismissed, setDismissed] = useState(false);
  const [narrow, setNarrow] = useState(
    typeof window !== "undefined" && window.innerWidth < 1024,
  );

  useEffect(() => {
    const check = () => setNarrow(window.innerWidth < 1024);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!narrow || dismissed) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(10,15,28,0.96)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 99999,
        padding: "24px",
      }}
    >
      <div
        style={{
          backgroundColor: "#1e293b",
          borderRadius: "18px",
          padding: "36px 28px",
          maxWidth: "340px",
          width: "100%",
          textAlign: "center",
          border: "1px solid #334155",
          boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
        }}
      >
        <div
          style={{
            marginBottom: "16px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Desktop size={52} weight="duotone" color="#94a3b8" />
        </div>
        <h2
          style={{
            color: "#f1f5f9",
            fontSize: "17px",
            fontWeight: 700,
            marginBottom: "12px",
            lineHeight: 1.3,
          }}
        >
          {t("mobileWarning.title")}
        </h2>
        <p
          style={{
            color: "#94a3b8",
            fontSize: "13px",
            lineHeight: 1.65,
            marginBottom: "28px",
          }}
        >
          {t("mobileWarning.body")}
        </p>
        <button
          onClick={() => setDismissed(true)}
          style={{
            padding: "11px 28px",
            borderRadius: "8px",
            backgroundColor: "#3b82f6",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: 600,
            width: "100%",
          }}
        >
          {t("mobileWarning.dismiss")}
        </button>
      </div>
    </div>
  );
}

function SidebarDivider({ collapsed, onToggle }) {
  return (
    <div
      style={{
        width: "20px",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#f1f5f9",
        borderLeft: "1px solid #e2e8f0",
        borderRight: "1px solid #e2e8f0",
      }}
    >
      <button
        onClick={onToggle}
        title={collapsed ? "Espandi sidebar" : "Comprimi sidebar"}
        style={{
          marginTop: "12px",
          width: "20px",
          height: "36px",
          borderRadius: "0 6px 6px 0",
          backgroundColor: "#1e293b",
          border: "none",
          color: "#94a3b8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          fontSize: "12px",
          fontWeight: "bold",
          boxShadow: "2px 0 6px rgba(0,0,0,0.15)",
          transition: "background-color 0.15s, color 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#3b82f6";
          e.currentTarget.style.color = "#fff";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#1e293b";
          e.currentTarget.style.color = "#94a3b8";
        }}
      >
        {collapsed ? ">" : "<"}
      </button>
      <div
        style={{
          flex: 1,
          width: "1px",
          backgroundColor: "#e2e8f0",
          marginTop: "8px",
          marginBottom: "16px",
        }}
      />
    </div>
  );
}

function EditorResizeHandle({ onDrag }) {
  const dragging = useRef(false);
  const startX = useRef(0);
  const [active, setActive] = useState(false);
  const [hover, setHover] = useState(false);

  const handleMouseDown = useCallback(
    (e) => {
      e.preventDefault();
      dragging.current = true;
      startX.current = e.clientX;
      setActive(true);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      const onMove = (e) => {
        if (!dragging.current) return;
        const d = e.clientX - startX.current;
        startX.current = e.clientX;
        onDrag(d);
      };
      const onUp = () => {
        dragging.current = false;
        setActive(false);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [onDrag],
  );

  const hi = active || hover;
  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title="Trascina per ridimensionare"
      style={{
        width: "10px",
        flexShrink: 0,
        cursor: "col-resize",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: hi ? "#dbeafe" : "#f8fafc",
        borderLeft: `1px solid ${hi ? "#93c5fd" : "#e2e8f0"}`,
        borderRight: `1px solid ${hi ? "#93c5fd" : "#e2e8f0"}`,
        transition: "background-color 0.15s, border-color 0.15s",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "3px",
          pointerEvents: "none",
        }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              width: "3px",
              height: "3px",
              borderRadius: "50%",
              backgroundColor: hi ? "#3b82f6" : "#cbd5e1",
              transition: "background-color 0.15s",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function useExportHandlers(setExporting, showToast) {
  const store = useCVStore();
  const importInputRef = useRef(null);

  const getStoreData = () => {
    const {
      deepLApiKey,
      setTemplate,
      setDesignerPalette,
      setPersonal,
      setSkills,
      addSkillCategory,
      removeSkillCategory,
      updateSkillCategory,
      addSkillTag,
      removeSkillTag,
      updateSkillTag,
      setExperience,
      addExperience,
      removeExperience,
      updateExperience,
      setEducation,
      addEducation,
      removeEducation,
      updateEducation,
      setCertifications,
      addCertification,
      removeCertification,
      updateCertification,
      setLanguages,
      addLanguage,
      removeLanguage,
      updateLanguage,
      setProjects,
      addProject,
      removeProject,
      updateProject,
      setTargetLanguage,
      setDeepLApiKey,
      resetCV,
      importCV,
      setCustomPaletteColor,
      resetCustomPalette,
      updateCoverLetter,
      updateCoverLetterHighlight,
      resetCoverLetter,
      ...data
    } = store;
    return data;
  };

  const handleExportPDF = async () => {
    setExporting("pdf");
    try {
      const { exportPDF } = await import("./exporters/exportPDF");
      await exportPDF(getStoreData());
      showToast("PDF esportato!", "success");
    } catch (e) {
      console.error(e);
      showToast("Errore generazione PDF", "error");
    } finally {
      setExporting(null);
    }
  };

  const handleExportDOCX = async () => {
    setExporting("docx");
    try {
      const { exportDOCX } = await import("./exporters/exportDOCX");
      await exportDOCX(getStoreData());
      showToast("DOCX esportato!", "success");
    } catch (e) {
      console.error(e);
      showToast("Errore generazione DOCX", "error");
    } finally {
      setExporting(null);
    }
  };

  const handleExportCoverLetterPDF = async () => {
    setExporting("cl-pdf");
    try {
      const { exportCoverLetterPDF } = await import("./exporters/exportCoverLetterPDF");
      await exportCoverLetterPDF(getStoreData());
      showToast("Cover Letter PDF esportata!", "success");
    } catch (e) {
      console.error(e);
      showToast("Errore generazione PDF", "error");
    } finally {
      setExporting(null);
    }
  };

  const handleExportCoverLetterDOCX = async () => {
    setExporting("cl-docx");
    try {
      const { exportCoverLetterDOCX } = await import("./exporters/exportCoverLetterDOCX");
      await exportCoverLetterDOCX(getStoreData());
      showToast("Cover Letter DOCX esportata!", "success");
    } catch (e) {
      console.error(e);
      showToast("Errore generazione DOCX", "error");
    } finally {
      setExporting(null);
    }
  };

  const handleExportJSON = () => {
    const data = getStoreData();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cv-${(store.personal.name || "export").replace(/\s+/g, "-").toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("JSON esportato!", "success");
  };

  const handleImportJSON = () => importInputRef.current?.click();

  const handleFileImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!data.personal || !data.skills || !data.experience)
          throw new Error();
        store.importCV(data);
        showToast("CV importato!", "success");
      } catch {
        showToast("File JSON non valido", "error");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return {
    importInputRef,
    getStoreData,
    handleExportPDF,
    handleExportDOCX,
    handleExportJSON,
    handleImportJSON,
    handleFileImport,
    handleExportCoverLetterPDF,
    handleExportCoverLetterDOCX,
  };
}

const SIDEBAR_WIDTH = 230;
const EDITOR_MIN = 240;
const EDITOR_MAX = 600;

export default function App() {
  const [activeSection, setActiveSection] = useState("personal");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [editorWidth, setEditorWidth] = useState(300);
  const [exporting, setExporting] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "info") => {
    setToast({ message, type });
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  const store = useCVStore();

  const {
    importInputRef,
    getStoreData,
    handleExportPDF,
    handleExportDOCX,
    handleExportJSON,
    handleImportJSON,
    handleFileImport,
    handleExportCoverLetterPDF,
    handleExportCoverLetterDOCX,
  } = useExportHandlers(setExporting, showToast);

  const handleEditorDrag = useCallback((delta) => {
    setEditorWidth((w) =>
      Math.min(EDITOR_MAX, Math.max(EDITOR_MIN, w + delta)),
    );
  }, []);

  const handleTranslate = useCallback(
    async (targetLang, apiKey) => {
      const data = getStoreData();
      const translated = await translateCV(data, targetLang, apiKey);
      store.importCV(translated);
      showToast("CV tradotto!", "success");
    },
    [getStoreData, store, showToast],
  );

  return (
    <>
      <MobileWarning />
      <style>{`@keyframes fadeSlideUp { from { opacity:0; transform:translateX(-50%) translateY(10px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }`}</style>

      <div
        style={{
          display: "flex",
          height: "100vh",
          width: "100vw",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: sidebarCollapsed ? 0 : SIDEBAR_WIDTH,
            flexShrink: 0,
            overflow: "hidden",
            transition: "width 0.2s ease",
          }}
        >
          <div style={{ width: SIDEBAR_WIDTH, height: "100%" }}>
            <Sidebar
              activeSection={activeSection}
              onSectionChange={setActiveSection}
              onTranslate={handleTranslate}
            />
          </div>
        </div>

        <SidebarDivider
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((v) => !v)}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            overflow: "hidden",
          }}
        >
          <Toolbar
            activeSection={activeSection}
            onExportPDF={handleExportPDF}
            onExportDOCX={handleExportDOCX}
            onExportJSON={handleExportJSON}
            onImportJSON={handleImportJSON}
            onExportCoverLetterPDF={handleExportCoverLetterPDF}
            onExportCoverLetterDOCX={handleExportCoverLetterDOCX}
            exporting={exporting}
          />
          <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
            <div
              style={{ width: editorWidth, flexShrink: 0, overflow: "hidden" }}
            >
              <EditorPanel activeSection={activeSection} />
            </div>
            <EditorResizeHandle onDrag={handleEditorDrag} />
            {activeSection === "coverLetter" ? (
              <ErrorBoundary key="cl">
                <CoverLetterPreview />
              </ErrorBoundary>
            ) : (
              <ErrorBoundary key="cv">
                <CVPreview />
              </ErrorBoundary>
            )}
          </div>
        </div>

        <input
          ref={importInputRef}
          type="file"
          accept=".json"
          style={{ display: "none" }}
          onChange={handleFileImport}
        />
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={dismissToast}
        />
      )}
    </>
  );
}
