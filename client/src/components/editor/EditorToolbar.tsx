import React from 'react';
import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Minus,
} from 'lucide-react';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';

interface EditorToolbarProps {
  editor: Editor | null;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({ editor }) => {
  const typography = useWorkspaceStore((s) => s.typography);
  const setTypography = useWorkspaceStore((s) => s.setTypography);

  if (!editor) return null;

  const insertDialogueDash = () => {
    editor.chain().focus().insertContent('— ').run();
  };

  const insertSceneBreak = () => {
    editor.chain().focus().setHorizontalRule().run();
  };

  return (
    <div className="flex items-center justify-between gap-3 px-2.5 sm:px-4 py-1.5 sm:py-2 border-b border-canvas-border bg-canvas/80 backdrop-blur-md text-ink-muted transition-colors overflow-x-auto scrollbar-none">
      {/* Formatting tools */}
      <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-1.5 rounded hover:bg-canvas-hover hover:text-ink transition-colors ${
            editor.isActive('heading', { level: 1 }) ? 'bg-canvas-surface text-brand-700 font-bold shadow-xs' : ''
          }`}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded hover:bg-canvas-hover hover:text-ink transition-colors ${
            editor.isActive('heading', { level: 2 }) ? 'bg-canvas-surface text-brand-700 font-bold shadow-xs' : ''
          }`}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-1.5 rounded hover:bg-canvas-hover hover:text-ink transition-colors ${
            editor.isActive('heading', { level: 3 }) ? 'bg-canvas-surface text-brand-700 font-bold shadow-xs' : ''
          }`}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <div className="w-px h-4 bg-canvas-border mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded hover:bg-canvas-hover hover:text-ink transition-colors ${
            editor.isActive('bold') ? 'bg-canvas-surface text-brand-700 font-bold shadow-xs' : ''
          }`}
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded hover:bg-canvas-hover hover:text-ink transition-colors ${
            editor.isActive('italic') ? 'bg-canvas-surface text-brand-700 font-bold shadow-xs' : ''
          }`}
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded hover:bg-canvas-hover hover:text-ink transition-colors ${
            editor.isActive('blockquote') ? 'bg-canvas-surface text-brand-700 font-bold shadow-xs' : ''
          }`}
          title="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </button>

        <div className="w-px h-4 bg-canvas-border mx-1" />

        <button
          type="button"
          onClick={insertDialogueDash}
          className="px-2 py-1 text-xs font-mono rounded bg-canvas-card hover:bg-canvas-hover hover:text-brand-700 transition-colors flex items-center gap-1 border border-canvas-border shadow-xs"
          title="Insert Dialogue Em-Dash (—)"
        >
          <span className="font-bold text-brand-700 font-serif">—</span>
          <span className="hidden sm:inline">Dialogue</span>
        </button>

        <button
          type="button"
          onClick={insertSceneBreak}
          className="px-2 py-1 text-xs font-mono rounded bg-canvas-card hover:bg-canvas-hover hover:text-brand-700 transition-colors flex items-center gap-1 border border-canvas-border shadow-xs"
          title="Insert Scene Break (---)"
        >
          <Minus className="w-3.5 h-3.5 text-brand-700" />
          <span className="hidden sm:inline">Break (⁂)</span>
        </button>
      </div>

      {/* Typography settings */}
      <div className="flex items-center gap-2 text-xs font-mono flex-shrink-0">
        {/* Font Family selector with Typewriter support */}
        <div className="flex items-center rounded-lg bg-canvas-card border border-canvas-border p-0.5 shadow-xs">
          <button
            type="button"
            onClick={() => setTypography({ fontFamily: 'serif' })}
            className={`px-2 py-1 rounded transition-colors ${
              typography.fontFamily === 'serif' ? 'bg-brand-600 text-white font-serif font-medium' : 'text-ink-muted hover:text-ink'
            }`}
            title="Literary Serif (Newsreader / Garamond)"
          >
            Serif
          </button>
          <button
            type="button"
            onClick={() => setTypography({ fontFamily: 'typewriter' })}
            className={`px-2 py-1 rounded transition-colors ${
              typography.fontFamily === 'typewriter' ? 'bg-brand-600 text-white font-mono font-medium' : 'text-ink-muted hover:text-ink'
            }`}
            title="Vintage Typewriter (Courier Prime)"
          >
            Typewriter
          </button>
          <button
            type="button"
            onClick={() => setTypography({ fontFamily: 'sans' })}
            className={`px-2 py-1 rounded transition-colors ${
              typography.fontFamily === 'sans' ? 'bg-brand-600 text-white font-sans font-medium' : 'text-ink-muted hover:text-ink'
            }`}
            title="Modern Sans (Inter)"
          >
            Sans
          </button>
          <button
            type="button"
            onClick={() => setTypography({ fontFamily: 'mono' })}
            className={`px-2 py-1 rounded transition-colors ${
              typography.fontFamily === 'mono' ? 'bg-brand-600 text-white font-mono font-medium' : 'text-ink-muted hover:text-ink'
            }`}
            title="Terminal Mono"
          >
            Mono
          </button>
        </div>

        {/* Line Height selector */}
        <div className="flex items-center rounded-lg bg-canvas-card border border-canvas-border p-0.5 shadow-xs">
          <button
            type="button"
            onClick={() => setTypography({ lineHeight: 'compact' })}
            className={`px-2 py-1 rounded transition-colors ${
              typography.lineHeight === 'compact' ? 'bg-brand-600 text-white font-medium' : 'text-ink-muted hover:text-ink'
            }`}
            title="Compact Line Spacing"
          >
            1.5x
          </button>
          <button
            type="button"
            onClick={() => setTypography({ lineHeight: 'normal' })}
            className={`px-2 py-1 rounded transition-colors ${
              typography.lineHeight === 'normal' ? 'bg-brand-600 text-white font-medium' : 'text-ink-muted hover:text-ink'
            }`}
            title="Normal Line Spacing"
          >
            1.8x
          </button>
          <button
            type="button"
            onClick={() => setTypography({ lineHeight: 'relaxed' })}
            className={`px-2 py-1 rounded transition-colors ${
              typography.lineHeight === 'relaxed' ? 'bg-brand-600 text-white font-medium' : 'text-ink-muted hover:text-ink'
            }`}
            title="Relaxed Reading Spacing"
          >
            2.0x
          </button>
        </div>
      </div>
    </div>
  );
};
