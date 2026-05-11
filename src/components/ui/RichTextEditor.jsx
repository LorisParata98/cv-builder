import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import {
  TextB,
  TextItalic,
  TextUnderline,
  ListBullets,
  ListNumbers,
} from "@phosphor-icons/react";

// ─── Toolbar button ───────────────────────────────────────────────────────────
function ToolBtn({ onClick, isActive, title, children }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      className={`p-1.5 rounded transition-colors ${
        isActive
          ? "bg-blue-100 text-blue-700"
          : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
      }`}
    >
      {children}
    </button>
  );
}

// ─── Toolbar ─────────────────────────────────────────────────────────────────
function Toolbar({ editor }) {
  if (!editor) return null;
  return (
    <div className="flex items-center gap-0.5 px-2 py-1 border-b border-gray-200 bg-gray-50 flex-wrap">
      <ToolBtn
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
        title="Grassetto (Ctrl+B)"
      >
        <TextB size={13} weight="bold" />
      </ToolBtn>
      <ToolBtn
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
        title="Corsivo (Ctrl+I)"
      >
        <TextItalic size={13} />
      </ToolBtn>
      <ToolBtn
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive("underline")}
        title="Sottolineato (Ctrl+U)"
      >
        <TextUnderline size={13} />
      </ToolBtn>
      <div className="w-px h-3.5 bg-gray-300 mx-1 flex-shrink-0" />
      <ToolBtn
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive("bulletList")}
        title="Lista puntata"
      >
        <ListBullets size={13} />
      </ToolBtn>
      <ToolBtn
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive("orderedList")}
        title="Lista numerata"
      >
        <ListNumbers size={13} />
      </ToolBtn>
    </div>
  );
}

// ─── RichTextEditor ───────────────────────────────────────────────────────────
// value:    HTML string (es. "<p>Testo <strong>grassetto</strong></p>")
// onChange: (html: string) => void  — chiama con "" se il contenuto è vuoto
export function RichTextEditor({ value, onChange, placeholder, minHeight = 80 }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder: placeholder || "",
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.isEmpty ? "" : editor.getHTML());
    },
  });

  // Sincronizza se il contenuto cambia dall'esterno (es. traduzione DeepL)
  useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    const current = editor.isEmpty ? "" : editor.getHTML();
    if (value !== current) {
      editor.commands.setContent(value || "", false);
    }
  }, [value, editor]);

  return (
    <div className="border border-gray-300 rounded overflow-hidden focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 bg-white">
      <Toolbar editor={editor} />
      <EditorContent
        editor={editor}
        className="rtf-editor-wrapper"
        style={{ minHeight }}
      />
    </div>
  );
}
