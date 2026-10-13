import React, { useState, useRef, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Quote,
  Minus,
  ChevronDown,
  Check,
  Type,
} from 'lucide-react';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';

interface EditorToolbarProps {
  editor: Editor | null;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({ editor }) => {
  const typography = useWorkspaceStore((s) => s.typography);
  const setTypography = useWorkspaceStore((s) => s.setTypography);

  const [isHeadingMenuOpen, setIsHeadingMenuOpen] = useState(false);
  const [isFontMenuOpen, setIsFontMenuOpen] = useState(false);
  const headingMenuRef = useRef<HTMLDivElement>(null);
  const fontMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headingMenuRef.current && !headingMenuRef.current.contains(e.target as Node)) {
        setIsHeadingMenuOpen(false);
      }
      if (fontMenuRef.current && !fontMenuRef.current.contains(e.target as Node)) {
        setIsFontMenuOpen(false);
      }
    };
    if (isHeadingMenuOpen || isFontMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isHeadingMenuOpen, isFontMenuOpen]);

  if (!editor) return null;

  const insertDialogueDash = () => {
    editor.chain().focus().insertContent('— ').run();
  };

  const insertSceneBreak = () => {
    editor.chain().focus().setHorizontalRule().run();
  };

  // Determine active style label (p1, h1, h2, h3)
  const currentHeadingLabel = editor.isActive('heading', { level: 1 })
    ? 'h1'
    : editor.isActive('heading', { level: 2 })
    ? 'h2'
    : editor.isActive('heading', { level: 3 })
    ? 'h3'
    : 'p1';

  // Determine active font label
  const currentFontLabel =
    typography.fontFamily === 'serif'
      ? 'Serif (Times)'
      : typography.fontFamily === 'typewriter'
      ? 'Typewriter'
      : typography.fontFamily === 'sans'
      ? 'Sans (Inter)'
      : 'Mono';

  return (
    <div className="flex items-center justify-between gap-3 px-2.5 sm:px-4 py-1.5 sm:py-2 border-b border-canvas-border bg-canvas/80 backdrop-blur-md text-ink-muted transition-colors select-none overflow-x-auto scrollbar-none">
      {/* Left Formatting Tools */}
      <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
        {/* Headings & Text Style Dropdown (p1, h1, h2, h3) */}
        <div className="relative" ref={headingMenuRef}>
          <button
            type="button"
            onClick={() => {
              setIsHeadingMenuOpen(!isHeadingMenuOpen);
              setIsFontMenuOpen(false);
            }}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-canvas-card hover:bg-canvas-hover border border-canvas-border text-ink text-xs font-mono font-medium shadow-2xs transition-colors cursor-pointer group"
            title="Text Style (p1, h1, h2, h3)"
          >
            <span className="font-mono font-bold text-xs text-brand-700 dark:text-amber-400">{currentHeadingLabel}</span>
            <ChevronDown
              className={`w-3 h-3 text-ink-faint group-hover:text-ink transition-transform ${
                isHeadingMenuOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {isHeadingMenuOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-24 bg-canvas-card border border-canvas-border rounded-xl shadow-xl p-1 z-50 animate-in fade-in zoom-in-95 duration-150">
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().setParagraph().run();
                  setIsHeadingMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors text-left cursor-pointer ${
                  !editor.isActive('heading')
                    ? 'bg-brand-500/15 text-brand-900 dark:text-amber-200 font-bold'
                    : 'hover:bg-canvas-hover text-ink'
                }`}
              >
                <span>p1</span>
                {!editor.isActive('heading') && (
                  <Check className="w-3 h-3 text-brand-600 dark:text-amber-400" />
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().toggleHeading({ level: 1 }).run();
                  setIsHeadingMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors text-left cursor-pointer ${
                  editor.isActive('heading', { level: 1 })
                    ? 'bg-brand-500/15 text-brand-900 dark:text-amber-200 font-bold'
                    : 'hover:bg-canvas-hover text-ink'
                }`}
              >
                <span className="font-bold">h1</span>
                {editor.isActive('heading', { level: 1 }) && (
                  <Check className="w-3 h-3 text-brand-600 dark:text-amber-400" />
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().toggleHeading({ level: 2 }).run();
                  setIsHeadingMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors text-left cursor-pointer ${
                  editor.isActive('heading', { level: 2 })
                    ? 'bg-brand-500/15 text-brand-900 dark:text-amber-200 font-bold'
                    : 'hover:bg-canvas-hover text-ink'
                }`}
              >
                <span className="font-semibold">h2</span>
                {editor.isActive('heading', { level: 2 }) && (
                  <Check className="w-3 h-3 text-brand-600 dark:text-amber-400" />
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().toggleHeading({ level: 3 }).run();
                  setIsHeadingMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors text-left cursor-pointer ${
                  editor.isActive('heading', { level: 3 })
                    ? 'bg-brand-500/15 text-brand-900 dark:text-amber-200 font-bold'
                    : 'hover:bg-canvas-hover text-ink'
                }`}
              >
                <span>h3</span>
                {editor.isActive('heading', { level: 3 }) && (
                  <Check className="w-3 h-3 text-brand-600 dark:text-amber-400" />
                )}
              </button>
            </div>
          )}
        </div>

        <div className="w-px h-4 bg-canvas-border mx-0.5" />

        {/* Inline Formatting: Bold, Italic, Blockquote */}
        <div className="flex items-center gap-0.5 bg-canvas-card/60 p-0.5 rounded-lg border border-canvas-border">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1.5 rounded hover:bg-canvas-hover hover:text-ink transition-colors cursor-pointer ${
              editor.isActive('bold') ? 'bg-canvas-surface text-brand-700 font-bold shadow-xs' : ''
            }`}
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1.5 rounded hover:bg-canvas-hover hover:text-ink transition-colors cursor-pointer ${
              editor.isActive('italic') ? 'bg-canvas-surface text-brand-700 font-bold shadow-xs' : ''
            }`}
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-1.5 rounded hover:bg-canvas-hover hover:text-ink transition-colors cursor-pointer ${
              editor.isActive('blockquote') ? 'bg-canvas-surface text-brand-700 font-bold shadow-xs' : ''
            }`}
            title="Blockquote"
          >
            <Quote className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="w-px h-4 bg-canvas-border mx-0.5" />

        {/* Narrative Inserts: Em-Dash, Section Break */}
        <button
          type="button"
          onClick={insertDialogueDash}
          className="px-2 py-1 text-xs font-mono rounded bg-canvas-card hover:bg-canvas-hover hover:text-brand-700 transition-colors flex items-center gap-1 border border-canvas-border shadow-xs cursor-pointer"
          title="Insert Dialogue Em-Dash (—)"
        >
          <span className="font-bold text-brand-700 font-serif">—</span>
          <span className="hidden sm:inline">Dialogue</span>
        </button>

        <button
          type="button"
          onClick={insertSceneBreak}
          className="px-2 py-1 text-xs font-mono rounded bg-canvas-card hover:bg-canvas-hover hover:text-brand-700 dark:hover:text-amber-400 transition-colors flex items-center gap-1 border border-canvas-border shadow-xs cursor-pointer"
          title="Insert Section Break (---)"
        >
          <Minus className="w-3.5 h-3.5 text-brand-700 dark:text-amber-400" />
          <span className="hidden sm:inline">Break</span>
        </button>
      </div>

      {/* Right Typography Settings: Font Dropdown & Line Height Toggle */}
      <div className="flex items-center gap-2 text-xs font-mono flex-shrink-0">
        {/* Font Family Dropdown */}
        <div className="relative" ref={fontMenuRef}>
          <button
            type="button"
            onClick={() => {
              setIsFontMenuOpen(!isFontMenuOpen);
              setIsHeadingMenuOpen(false);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-canvas-card hover:bg-canvas-hover border border-canvas-border text-ink text-xs font-mono font-medium shadow-2xs transition-colors cursor-pointer group"
            title="Change Typeface / Font Family"
          >
            <Type className="w-3.5 h-3.5 text-brand-600 dark:text-amber-400" />
            <span className="font-semibold text-xs text-ink">{currentFontLabel}</span>
            <ChevronDown
              className={`w-3 h-3 text-ink-faint group-hover:text-ink transition-transform ${
                isFontMenuOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {isFontMenuOpen && (
            <div className="absolute top-full right-0 mt-1.5 w-48 bg-canvas-card border border-canvas-border rounded-xl shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="text-[10px] font-mono font-semibold text-ink-muted uppercase tracking-wider px-2 py-1">
                Typeface
              </div>

              {/* Serif (Newsreader / Times) */}
              <button
                type="button"
                onClick={() => {
                  setTypography({ fontFamily: 'serif' });
                  setIsFontMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors text-left cursor-pointer ${
                  typography.fontFamily === 'serif'
                    ? 'bg-brand-500/15 text-brand-900 dark:text-amber-200 font-semibold'
                    : 'hover:bg-canvas-hover text-ink'
                }`}
              >
                <div>
                  <span className="font-serif font-medium text-sm block">Serif (Times)</span>
                  <span className="text-[10px] text-ink-muted font-sans">Classic literary serif</span>
                </div>
                {typography.fontFamily === 'serif' && (
                  <Check className="w-3.5 h-3.5 text-brand-600 dark:text-amber-400" />
                )}
              </button>

              {/* Typewriter (Courier Prime) */}
              <button
                type="button"
                onClick={() => {
                  setTypography({ fontFamily: 'typewriter' });
                  setIsFontMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors text-left cursor-pointer ${
                  typography.fontFamily === 'typewriter'
                    ? 'bg-brand-500/15 text-brand-900 dark:text-amber-200 font-semibold'
                    : 'hover:bg-canvas-hover text-ink'
                }`}
              >
                <div>
                  <span className="font-mono font-medium text-xs block">Typewriter</span>
                  <span className="text-[10px] text-ink-muted font-sans">Courier vintage keys</span>
                </div>
                {typography.fontFamily === 'typewriter' && (
                  <Check className="w-3.5 h-3.5 text-brand-600 dark:text-amber-400" />
                )}
              </button>

              {/* Modern Sans (Inter) */}
              <button
                type="button"
                onClick={() => {
                  setTypography({ fontFamily: 'sans' });
                  setIsFontMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors text-left cursor-pointer ${
                  typography.fontFamily === 'sans'
                    ? 'bg-brand-500/15 text-brand-900 dark:text-amber-200 font-semibold'
                    : 'hover:bg-canvas-hover text-ink'
                }`}
              >
                <div>
                  <span className="font-sans font-medium text-xs block">Sans (Inter)</span>
                  <span className="text-[10px] text-ink-muted font-sans">Clean modern sans-serif</span>
                </div>
                {typography.fontFamily === 'sans' && (
                  <Check className="w-3.5 h-3.5 text-brand-600 dark:text-amber-400" />
                )}
              </button>

              {/* Terminal Mono (JetBrains Mono) */}
              <button
                type="button"
                onClick={() => {
                  setTypography({ fontFamily: 'mono' });
                  setIsFontMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors text-left cursor-pointer ${
                  typography.fontFamily === 'mono'
                    ? 'bg-brand-500/15 text-brand-900 dark:text-amber-200 font-semibold'
                    : 'hover:bg-canvas-hover text-ink'
                }`}
              >
                <div>
                  <span className="font-mono font-medium text-xs block">Monospace</span>
                  <span className="text-[10px] text-ink-muted font-sans">Drafting terminal</span>
                </div>
                {typography.fontFamily === 'mono' && (
                  <Check className="w-3.5 h-3.5 text-brand-600 dark:text-amber-400" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Line Height Selector */}
        <div className="flex items-center rounded-lg bg-canvas-card border border-canvas-border p-0.5 shadow-xs">
          <button
            type="button"
            onClick={() => setTypography({ lineHeight: 'compact' })}
            className={`px-2 py-1 rounded transition-colors cursor-pointer ${
              typography.lineHeight === 'compact'
                ? 'bg-brand-600 text-white font-medium shadow-xs'
                : 'text-ink-muted hover:text-ink'
            }`}
            title="Compact Line Spacing (1.5x)"
          >
            1.5x
          </button>
          <button
            type="button"
            onClick={() => setTypography({ lineHeight: 'normal' })}
            className={`px-2 py-1 rounded transition-colors cursor-pointer ${
              typography.lineHeight === 'normal'
                ? 'bg-brand-600 text-white font-medium shadow-xs'
                : 'text-ink-muted hover:text-ink'
            }`}
            title="Normal Line Spacing (1.8x)"
          >
            1.8x
          </button>
          <button
            type="button"
            onClick={() => setTypography({ lineHeight: 'relaxed' })}
            className={`px-2 py-1 rounded transition-colors cursor-pointer ${
              typography.lineHeight === 'relaxed'
                ? 'bg-brand-600 text-white font-medium shadow-xs'
                : 'text-ink-muted hover:text-ink'
            }`}
            title="Relaxed Line Spacing (2.0x)"
          >
            2.0x
          </button>
        </div>
      </div>
    </div>
  );
};
