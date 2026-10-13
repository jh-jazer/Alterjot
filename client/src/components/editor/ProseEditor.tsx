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
import { SceneNotesDeck } from './SceneNotesDeck';
import { StatusDot } from '../common/StatusDot';
import { Minimize2, Edit3 } from 'lucide-react';
import type { SceneStatus, SceneMetadata } from '../../types';

export const ProseEditor: React.FC = () => {
  const activeScene = useWorkspaceStore((s) => s.activeScene);
  const typography = useWorkspaceStore((s) => s.typography);
  const isZenMode = useWorkspaceStore((s) => s.panelState.isZenMode);
  const toggleZenMode = useWorkspaceStore((s) => s.toggleZenMode);
  const updateActiveSceneLocally = useWorkspaceStore((s) => s.updateActiveSceneLocally);
  const updateSceneMetadataLocally = useWorkspaceStore((s) => s.updateSceneMetadataLocally);
  const activeChapterId = useWorkspaceStore((s) => s.activeChapterId);
  const chapters = useWorkspaceStore((s) => s.chapters);
  const activeChapter = chapters.find((c) => c._id === activeChapterId);
  const updateChapterTitle = useWorkspaceStore((s) => s.updateChapterTitle);
  const updateSceneTitle = useWorkspaceStore((s) => s.updateSceneTitle);
  const saveStatus = useWorkspaceStore((s) => s.saveStatus);
  const lastSavedAt = useWorkspaceStore((s) => s.lastSavedAt);

  const [wordCount, setWordCount] = useState(activeScene?.wordCount || 0);
  const [characterCount, setCharacterCount] = useState(activeScene?.characterCount || 0);
  const [chapterTitle, setChapterTitle] = useState(activeChapter?.title || activeScene?.title || '');
  const [isEditingBottomTitle, setIsEditingBottomTitle] = useState(false);

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
    autofocus: 'end',
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

  const handleMetadataChange = (metadata: Partial<SceneMetadata>, status?: SceneStatus) => {
    if (!activeScene) return;
    updateSceneMetadataLocally({
      ...metadata,
    });
    if (status) {
      useWorkspaceStore.setState((state) => ({
        activeScene: state.activeScene ? { ...state.activeScene, status } : null,
        scenes: state.scenes.map((s) => (s._id === activeScene._id ? { ...s, status } : s)),
      }));
    }
  };

  if (!activeScene) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-ink-muted">
        <Edit3 className="w-12 h-12 text-ink-faint mb-4 stroke-1 animate-pulse" />
        <h3 className="text-lg font-serif font-medium text-ink mb-1">No Scene Selected</h3>
        <p className="text-sm text-ink-muted max-w-sm">
          Select a scene from the manuscript tree on the left, or create a new chapter to begin drafting.
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
    <div className={`flex-1 flex flex-col h-full overflow-hidden bg-canvas ${fontClass} ${lineClass}`}>
      {!isZenMode && (
        <>
          <EditorToolbar editor={editor} />
          <SceneNotesDeck scene={activeScene} onChange={handleMetadataChange} />
        </>
      )}

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
      <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 sm:py-6 md:py-10 flex justify-center bg-canvas">
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
              onChange={(e) => handleTitleChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === 'ArrowDown') {
                  e.preventDefault();
                  editor?.commands.focus('start');
                }
              }}
              placeholder="Untitled Chapter"
              className="w-full text-xl sm:text-2xl md:text-3xl font-serif font-bold text-ink placeholder:text-ink-faint/30 bg-transparent border-none outline-none focus:outline-none transition-colors"
              title="Chapter title (optional — edit anytime)"
            />
          </div>

          {/* ProseMirror Canvas Container */}
          <EditorContent editor={editor} />
        </div>
      </div>

      {!isZenMode && (
        <div className="px-3 sm:px-6 py-1.5 sm:py-2 border-t border-canvas-border bg-canvas/90 backdrop-blur-md flex items-center justify-between text-xs text-ink-muted font-mono gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {isEditingBottomTitle ? (
              <input
                type="text"
                autoFocus
                value={chapterTitle}
                onChange={(e) => handleTitleChange(e.target.value)}
                onBlur={() => setIsEditingBottomTitle(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === 'Escape') setIsEditingBottomTitle(false);
                }}
                className="px-1.5 py-0.5 rounded bg-canvas-card border border-brand-500 font-serif text-ink text-xs focus:outline-none shadow-xs max-w-[120px] sm:max-w-none"
              />
            ) : (
              <button
                type="button"
                onClick={() => setIsEditingBottomTitle(true)}
                className="font-serif text-ink hover:text-brand-700 dark:hover:text-amber-400 transition-colors flex items-center gap-1 group/btntitle min-w-0"
                title="Click to rename chapter"
              >
                <span className="truncate max-w-[110px] sm:max-w-[200px] md:max-w-none">
                  {chapterTitle || 'Untitled Chapter'}
                </span>
                <Edit3 className="w-2.5 h-2.5 text-ink-faint opacity-40 group-hover/btntitle:opacity-100 transition-opacity flex-shrink-0" />
              </button>
            )}
            <span className="hidden sm:inline text-ink-faint">•</span>
            <span className="hidden sm:inline text-ink-muted capitalize">{typography.fontFamily}</span>
            <span className="hidden sm:inline text-ink-faint">•</span>
            <span className="hidden sm:inline text-ink-muted">{typography.lineHeight} spacing</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <StatusDot status={saveStatus} lastSavedAt={lastSavedAt} />
            <WordCounter wordCount={wordCount} characterCount={characterCount} />
          </div>
        </div>
      )}
    </div>
  );
};
