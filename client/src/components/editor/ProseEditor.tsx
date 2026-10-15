import React, { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CharacterCount from '@tiptap/extension-character-count';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';

import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import { useAutosave } from '../../hooks/useAutosave';
import { EditorToolbar } from './EditorToolbar';
import { WordCounter } from './WordCounter';
import { StatusDot } from '../common/StatusDot';
import { Minimize2, Edit3, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { AiLedExtension } from './extensions/AiLedExtension';
import { LineCommentsDrawer } from './LineCommentsDrawer';

export const ProseEditor: React.FC = () => {
  const activeScene = useWorkspaceStore((s) => s.activeScene);
  const typography = useWorkspaceStore((s) => s.typography);
  const setTypography = useWorkspaceStore((s) => s.setTypography);
  const isZenMode = useWorkspaceStore((s) => s.panelState.isZenMode);
  const toggleZenMode = useWorkspaceStore((s) => s.toggleZenMode);
  const updateActiveSceneLocally = useWorkspaceStore((s) => s.updateActiveSceneLocally);
  const activeChapterId = useWorkspaceStore((s) => s.activeChapterId);
  const chapters = useWorkspaceStore((s) => s.chapters);
  const activeChapter = chapters.find((c) => c._id === activeChapterId);
  const selectChapter = useWorkspaceStore((s) => s.selectChapter);
  const updateChapterTitle = useWorkspaceStore((s) => s.updateChapterTitle);
  const updateSceneTitle = useWorkspaceStore((s) => s.updateSceneTitle);
  const saveStatus = useWorkspaceStore((s) => s.saveStatus);
  const activePassage = useWorkspaceStore((s) => s.activePassage);
  const isReaderMode = useWorkspaceStore((s) => s.isReaderMode);
  const setIsReaderMode = useWorkspaceStore((s) => s.setIsReaderMode);
  const activeReaderName = useWorkspaceStore((s) => s.activeReaderName);
  const activeCommentLine = useWorkspaceStore((s) => s.activeCommentLine);
  const lineComments = useWorkspaceStore((s) => s.lineComments);

  const [wordCount, setWordCount] = useState(activeScene?.wordCount || 0);
  const [characterCount, setCharacterCount] = useState(activeScene?.characterCount || 0);
  const [chapterTitle, setChapterTitle] = useState(activeChapter?.title || activeScene?.title || '');
  const [readingProgress, setReadingProgress] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Chapter navigation indexing
  const currentChapterIndex = chapters.findIndex((c) => c._id === activeChapterId);
  const prevChapter = currentChapterIndex > 0 ? chapters[currentChapterIndex - 1] : null;
  const nextChapter =
    currentChapterIndex >= 0 && currentChapterIndex < chapters.length - 1
      ? chapters[currentChapterIndex + 1]
      : null;

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const maxScroll = scrollHeight - clientHeight;
    if (maxScroll <= 5) {
      setReadingProgress(100);
    } else {
      const pct = Math.min(100, Math.max(0, Math.round((scrollTop / maxScroll) * 100)));
      setReadingProgress(pct);
    }
  };

  // Reset scroll and progress when navigating to another chapter
  useEffect(() => {
    setReadingProgress(0);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [activeChapterId]);

  useEffect(() => {
    if (activeScene) {
      setWordCount(activeScene.wordCount || 0);
      setCharacterCount(activeScene.characterCount || 0);
    }
    const currentTitle = activeChapter?.title || activeScene?.title || '';
    setChapterTitle(currentTitle);
  }, [activeScene?._id, activeChapter?._id, activeChapter?.title, activeScene?.title]);

  const handleTitleChange = (val: string) => {
    setChapterTitle(val);
    if (activeChapter) {
      updateChapterTitle(activeChapter._id, val);
    }
    if (activeScene) {
      updateSceneTitle(activeScene._id, val);
    }
  };

  const editor = useEditor({
    editable: !isReaderMode,
    autofocus: isReaderMode ? false : 'end',
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        horizontalRule: {
          HTMLAttributes: {
            class: 'scene-break',
          },
        },
      }),
      CharacterCount,
      Placeholder.configure({
        placeholder: 'Record transmission log: Document what remains...',
        emptyNodeClass: 'is-editor-empty',
      }),
      Typography,
      AiLedExtension,
    ],
    content: activeScene?.contentJson || {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [],
        },
      ],
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-stone dark:prose-invert max-w-none focus:outline-none min-h-[calc(100vh-320px)] px-4 py-4 sm:px-8 sm:py-6 md:px-16 md:py-8 select-text',
      },
    },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      const text = editor.getText();
      const words = editor.storage.characterCount.words();
      const chars = editor.storage.characterCount.characters();

      setWordCount(words);
      setCharacterCount(chars);

      // Tier 1: Instant local save to browser localStorage on every keystroke
      updateActiveSceneLocally(json, text, words, chars);
    },
  });

  const lastActiveSceneId = useRef<string | null>(null);
  useEffect(() => {
    if (!editor || !activeScene) return;

    if (lastActiveSceneId.current !== activeScene._id) {
      lastActiveSceneId.current = activeScene._id;
      if (activeScene.contentJson) {
        editor.commands.setContent(activeScene.contentJson);
      } else if (activeScene.plainText) {
        editor.commands.setContent(activeScene.plainText);
      }
    }
  }, [editor, activeScene?._id]);

  // Sync TipTap editable state with reader mode
  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      editor.setEditable(!isReaderMode);
      try {
        editor.view.dispatch(editor.state.tr.setMeta('forceUpdateAiLeds', true));
      } catch {}
    }
  }, [editor, isReaderMode]);

  // Keep LEDs synchronized with active passage and active comment line
  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      try {
        editor.view.dispatch(editor.state.tr.setMeta('forceUpdateAiLeds', true));
      } catch {}
    }
  }, [editor, activePassage, activeCommentLine, lineComments.length]);

  // Global event listener for reader comments and reader mode updates
  useEffect(() => {
    const handleRefreshLeds = () => {
      if (editor && !editor.isDestroyed) {
        try {
          editor.view.dispatch(editor.state.tr.setMeta('forceUpdateAiLeds', true));
        } catch {}
      }
    };
    window.addEventListener('alterjot:comments-updated', handleRefreshLeds);
    window.addEventListener('alterjot:reader-mode-changed', handleRefreshLeds);
    return () => {
      window.removeEventListener('alterjot:comments-updated', handleRefreshLeds);
      window.removeEventListener('alterjot:reader-mode-changed', handleRefreshLeds);
    };
  }, [editor]);

  // Handle AI approved passage replacement in TipTap
  useEffect(() => {
    const handleReplacePassage = (e: Event) => {
      const customEvent = e as CustomEvent<{ from: number; to: number; newText: string }>;
      if (!editor || !customEvent.detail) return;
      const { from, to, newText } = customEvent.detail;

      const docSize = editor.state.doc.content.size;
      const safeFrom = Math.max(0, Math.min(from, docSize));
      const safeTo = Math.max(safeFrom, Math.min(to, docSize));

      editor
        .chain()
        .focus()
        .setTextSelection({ from: safeFrom, to: safeTo })
        .insertContent(newText)
        .run();
    };

    window.addEventListener('alterjot:replace-passage', handleReplacePassage);
    return () => {
      window.removeEventListener('alterjot:replace-passage', handleReplacePassage);
    };
  }, [editor]);

  // Handle Global Search & Replace events in TipTap
  useEffect(() => {
    if (!editor || editor.isDestroyed) return;

    // 1. Full active scene content replacement (from Search & Replace All / In Scene)
    const handleReplaceSceneContent = (e: Event) => {
      const customEvent = e as CustomEvent<{
        newContentJson: any;
        newPlainText: string;
        wordCount: number;
        characterCount: number;
      }>;
      if (!customEvent.detail) return;
      const { newContentJson, wordCount: newWords, characterCount: newChars } = customEvent.detail;
      editor.commands.setContent(newContentJson, { emitUpdate: false });
      setWordCount(newWords);
      setCharacterCount(newChars);
    };

    // 2. Scroll to match in editor and select text
    const handleScrollToMatch = (e: Event) => {
      const customEvent = e as CustomEvent<{ searchTerm: string; occurrence: number }>;
      if (!customEvent.detail?.searchTerm) return;
      const { searchTerm, occurrence } = customEvent.detail;

      const doc = editor.state.doc;
      let currentOcc = 0;
      let targetFrom = -1;
      let targetTo = -1;

      const escaped = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escaped, 'gi');

      doc.descendants((node, pos) => {
        if (node.isText && node.text) {
          regex.lastIndex = 0;
          let m: RegExpExecArray | null;
          while ((m = regex.exec(node.text)) !== null) {
            if (currentOcc === occurrence) {
              targetFrom = pos + m.index;
              targetTo = targetFrom + m[0].length;
              return false;
            }
            currentOcc++;
          }
        }
        return true;
      });

      if (targetFrom !== -1 && targetTo !== -1) {
        editor.chain().focus().setTextSelection({ from: targetFrom, to: targetTo }).run();
        try {
          const dom = editor.view.domAtPos(targetFrom);
          const el = dom.node instanceof HTMLElement ? dom.node : dom.node.parentElement;
          el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } catch {}
      }
    };

    // 3. Replace single occurrence in active editor
    const handleReplaceSingle = (e: Event) => {
      const customEvent = e as CustomEvent<{
        searchTerm: string;
        replaceWith: string;
        occurrence: number;
      }>;
      if (!customEvent.detail) return;
      const { searchTerm, replaceWith, occurrence } = customEvent.detail;

      const doc = editor.state.doc;
      let currentOcc = 0;
      let targetFrom = -1;
      let targetTo = -1;

      const escaped = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escaped, 'gi');

      doc.descendants((node, pos) => {
        if (node.isText && node.text) {
          regex.lastIndex = 0;
          let m: RegExpExecArray | null;
          while ((m = regex.exec(node.text)) !== null) {
            if (currentOcc === occurrence) {
              targetFrom = pos + m.index;
              targetTo = targetFrom + m[0].length;
              return false;
            }
            currentOcc++;
          }
        }
        return true;
      });

      if (targetFrom !== -1 && targetTo !== -1) {
        editor
          .chain()
          .focus()
          .setTextSelection({ from: targetFrom, to: targetTo })
          .insertContent(replaceWith)
          .run();
      }
    };

    window.addEventListener('alterjot:replace-active-scene-content', handleReplaceSceneContent);
    window.addEventListener('alterjot:scroll-to-match', handleScrollToMatch);
    window.addEventListener('alterjot:replace-single-occurrence', handleReplaceSingle);

    return () => {
      window.removeEventListener('alterjot:replace-active-scene-content', handleReplaceSceneContent);
      window.removeEventListener('alterjot:scroll-to-match', handleScrollToMatch);
      window.removeEventListener('alterjot:replace-single-occurrence', handleReplaceSingle);
    };
  }, [editor]);

  // Two-Tier autosave hook
  useAutosave(
    activeScene?._id || null,
    activeScene
      ? {
          contentJson: activeScene.contentJson,
          plainText: activeScene.plainText,
          wordCount: activeScene.wordCount || 0,
          characterCount: activeScene.characterCount || 0,
          metadata: activeScene.metadata,
          status: activeScene.status,
        }
      : null
  );

  if (!activeScene) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-ink-muted">
        <Edit3 className="w-12 h-12 text-ink-faint mb-4 stroke-1 animate-pulse" />
        <h3 className="text-lg font-serif font-medium text-ink mb-1">No Scene Selected</h3>
        <p className="text-sm text-ink-muted max-w-sm">
          Select a scene from the book tree on the left, or create a new chapter to begin drafting.
        </p>
      </div>
    );
  }

  const fontClass =
    typography.fontFamily === 'serif'
      ? 'font-prose-serif'
      : typography.fontFamily === 'typewriter'
      ? 'font-prose-typewriter'
      : typography.fontFamily === 'mono'
      ? 'font-prose-mono'
      : 'font-prose-sans';

  const lineClass =
    typography.lineHeight === 'compact'
      ? 'line-height-compact'
      : typography.lineHeight === 'relaxed'
      ? 'line-height-relaxed'
      : 'line-height-normal';

  return (
    <div
      style={
        {
          '--prose-font-size': typography.fontSize ? `${typography.fontSize}px` : undefined,
        } as React.CSSProperties
      }
      className={`flex-1 flex flex-col h-full overflow-hidden bg-canvas ${fontClass} ${lineClass}`}
    >
      {/* Reader Mode Bar with Quick Typography Controls */}
      {!isZenMode && isReaderMode && (
        <div className="w-full bg-amber-500/10 border-b border-amber-500/25 px-3 sm:px-6 py-1.5 sm:py-2 flex items-center justify-between gap-3 text-xs font-sans text-ink flex-shrink-0 animate-fadeIn">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-6 h-6 rounded-lg bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex items-center gap-2 flex-wrap">
              <span className="font-bold text-amber-700 dark:text-amber-300">
                Reading Mode (View Only)
              </span>

              {/* Chapter Reading Progress Indicator */}
              <div
                className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-[10px] sm:text-[11px] font-mono text-amber-800 dark:text-amber-200"
                title="Reading progress through this chapter"
              >
                <span>{readingProgress}% read</span>
                <div className="w-10 h-1.5 rounded-full bg-amber-200/50 dark:bg-amber-950 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-150"
                    style={{ width: `${readingProgress}%` }}
                  />
                </div>
              </div>

              <span className="text-ink-muted hidden lg:inline">
                • Click any <span className="text-orange-600 dark:text-orange-400 font-bold">orange dot</span> along the lines to write comments.
              </span>
            </div>
          </div>

          {/* Reader Typography Controls Toolbar */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-canvas-card/80 border border-canvas-border text-ink shadow-2xs">
              {/* Font Family selector */}
              <button
                type="button"
                onClick={() => setTypography({ fontFamily: 'serif' })}
                className={`px-2 py-0.5 rounded text-[11px] font-serif transition-colors cursor-pointer ${
                  typography.fontFamily === 'serif'
                    ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold'
                    : 'text-ink-muted hover:text-ink'
                }`}
                title="Serif font"
              >
                Serif
              </button>
              <button
                type="button"
                onClick={() => setTypography({ fontFamily: 'sans' })}
                className={`px-2 py-0.5 rounded text-[11px] font-sans transition-colors cursor-pointer ${
                  typography.fontFamily === 'sans'
                    ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold'
                    : 'text-ink-muted hover:text-ink'
                }`}
                title="Sans-serif font"
              >
                Sans
              </button>
              <button
                type="button"
                onClick={() => setTypography({ fontFamily: 'typewriter' })}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                  typography.fontFamily === 'typewriter'
                    ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold'
                    : 'text-ink-muted hover:text-ink'
                }`}
                title="Typewriter / Monospace font"
              >
                Mono
              </button>

              <div className="w-px h-3 bg-canvas-border mx-0.5" />

              {/* Font size A- / A+ */}
              <button
                type="button"
                onClick={() => {
                  const curr = typography.fontSize || 18;
                  if (curr > 13) setTypography({ fontSize: curr - 1 });
                }}
                className="w-5 h-5 rounded hover:bg-canvas-hover flex items-center justify-center text-[10px] font-mono font-bold text-ink cursor-pointer"
                title="Decrease font size"
              >
                A-
              </button>
              <span className="text-[10px] font-mono text-ink-muted min-w-[20px] text-center">
                {typography.fontSize || 18}
              </span>
              <button
                type="button"
                onClick={() => {
                  const curr = typography.fontSize || 18;
                  if (curr < 28) setTypography({ fontSize: curr + 1 });
                }}
                className="w-5 h-5 rounded hover:bg-canvas-hover flex items-center justify-center text-[11px] font-mono font-bold text-ink cursor-pointer"
                title="Increase font size"
              >
                A+
              </button>
            </div>

            <span className="text-[11px] font-mono text-ink-faint hidden md:inline">
              @{activeReaderName || 'Reader'}
            </span>
            <button
              type="button"
              onClick={() => setIsReaderMode(false)}
              className="px-2.5 py-1 rounded-lg bg-canvas-card hover:bg-canvas-hover border border-canvas-border text-[11px] font-mono text-ink transition-colors cursor-pointer shadow-2xs"
            >
              Switch to Author
            </button>
          </div>
        </div>
      )}

      {/* Sticky Reading Progress Top Bar */}
      {isReaderMode && (
        <div className="w-full h-0.5 bg-amber-500/15 overflow-hidden flex-shrink-0">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-150 ease-out"
            style={{ width: `${readingProgress}%` }}
          />
        </div>
      )}

      {/* Author Toolbar */}
      {!isZenMode && !isReaderMode && <EditorToolbar editor={editor} />}

      {isZenMode && (
        <div className="absolute top-4 right-6 z-30 flex items-center gap-3 opacity-40 hover:opacity-100 transition-opacity">
          <WordCounter wordCount={wordCount} characterCount={characterCount} />
          <button
            type="button"
            onClick={toggleZenMode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-canvas-card border border-canvas-border text-ink hover:text-brand-700 text-xs font-mono shadow-md transition-all"
            title="Exit Zen Focus Mode (Esc or Ctrl+\)"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span>Exit Zen</span>
          </button>
        </div>
      )}

      {/* Scrollable Prose Paper Canvas */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 sm:py-6 md:py-10 flex justify-center bg-canvas"
      >
        <div
          className={`w-full transition-all duration-300 ${
            isZenMode
              ? 'max-w-3xl my-3 sm:my-6 bg-canvas-card/90 rounded-md sm:rounded-lg border border-canvas-border/80 shadow-parchment-lg p-2 sm:p-4 md:p-6'
              : 'max-w-4xl bg-canvas-card rounded-md sm:rounded-lg border border-canvas-border shadow-parchment'
          }`}
        >
          {/* Chapter Title Header */}
          <div className="px-4 pt-5 pb-2.5 sm:px-8 sm:pt-8 md:px-16 md:pt-10 border-b border-canvas-border/30">
            <input
              type="text"
              value={chapterTitle}
              readOnly={isReaderMode}
              onChange={(e) => handleTitleChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === 'ArrowDown') {
                  e.preventDefault();
                  editor?.commands.focus('start');
                }
              }}
              placeholder="Untitled Chapter"
              className={`w-full text-xl sm:text-2xl md:text-3xl font-serif font-bold text-ink placeholder:text-ink-faint/30 bg-transparent border-none outline-none focus:outline-none transition-colors ${
                isReaderMode ? 'cursor-default select-none' : ''
              }`}
              title={isReaderMode ? 'Chapter Title' : 'Chapter title (optional — edit anytime)'}
            />
          </div>

          {/* ProseMirror Canvas Container */}
          <EditorContent editor={editor} />

          {/* Turn the Page Chapter Navigation */}
          {chapters.length > 1 && (
            <div className="px-4 py-6 sm:px-8 md:px-16 border-t border-canvas-border/40 mt-8 flex items-center justify-between gap-4">
              {prevChapter ? (
                <button
                  type="button"
                  onClick={() => selectChapter(prevChapter._id)}
                  className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-canvas-card hover:bg-canvas-hover border border-canvas-border text-ink hover:text-brand-700 dark:hover:text-amber-400 text-xs sm:text-sm font-sans transition-all group shadow-2xs cursor-pointer"
                  title={`Previous Chapter: ${prevChapter.title || 'Untitled Chapter'}`}
                >
                  <ChevronLeft className="w-4 h-4 text-ink-muted group-hover:text-brand-700 dark:group-hover:text-amber-400 transition-transform group-hover:-translate-x-0.5" />
                  <div className="text-left">
                    <div className="text-[10px] font-mono text-ink-faint uppercase tracking-wider">Previous</div>
                    <div className="font-serif font-semibold truncate max-w-[120px] sm:max-w-[180px] md:max-w-[220px]">
                      {prevChapter.title || 'Untitled Chapter'}
                    </div>
                  </div>
                </button>
              ) : (
                <div />
              )}

              {nextChapter ? (
                <button
                  type="button"
                  onClick={() => selectChapter(nextChapter._id)}
                  className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-sans transition-all group shadow-sm ml-auto cursor-pointer"
                  title={`Next Chapter: ${nextChapter.title || 'Untitled Chapter'}`}
                >
                  <div className="text-right">
                    <div className="text-[10px] font-mono text-white/75 uppercase tracking-wider">Next</div>
                    <div className="font-serif font-semibold truncate max-w-[120px] sm:max-w-[180px] md:max-w-[220px]">
                      {nextChapter.title || 'Untitled Chapter'}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/90 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
                </button>
              ) : (
                <div className="text-xs text-ink-faint font-serif italic py-2 ml-auto">
                  End of book
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {!isZenMode && (
        <div className="px-3 sm:px-6 py-1.5 sm:py-2 border-t border-canvas-border bg-canvas/90 backdrop-blur-md flex items-center justify-between text-xs text-ink-muted font-mono gap-2">
          <div className="text-[11px] text-ink-faint">
            {isReaderMode ? (
              <span className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                Reader Review Mode
              </span>
            ) : (
              <span>Author Workspace</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {saveStatus === 'error' && (
              <StatusDot status="error" />
            )}
            <WordCounter wordCount={wordCount} characterCount={characterCount} />
          </div>
        </div>
      )}

      {/* Line Comments Drawer */}
      <LineCommentsDrawer />
    </div>
  );
};
