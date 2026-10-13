import React from 'react';
import { User, Calendar, Target, ChevronDown, ChevronUp } from 'lucide-react';
import type { Scene, SceneStatus, SceneMetadata } from '../../types';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
interface SceneNotesDeckProps {
  scene: Scene;
  onChange: (metadata: Partial<SceneMetadata>, status?: SceneStatus) => void;
}

export const SceneNotesDeck: React.FC<SceneNotesDeckProps> = ({ scene, onChange }) => {
  const isNotesDeckOpen = useWorkspaceStore((s) => s.panelState.isNotesDeckOpen);
  const toggleNotesDeck = useWorkspaceStore((s) => s.toggleNotesDeck);
  const activeChapterId = useWorkspaceStore((s) => s.activeChapterId);
  const chapters = useWorkspaceStore((s) => s.chapters);
  const activeChapter = chapters.find((c) => c._id === activeChapterId);
  const updateChapterTitle = useWorkspaceStore((s) => s.updateChapterTitle);
  const updateSceneTitle = useWorkspaceStore((s) => s.updateSceneTitle);

  const handleTitleChange = (val: string) => {
    if (activeChapter) {
      updateChapterTitle(activeChapter._id, val);
    }
    updateSceneTitle(scene._id, val);
  };

  const currentTitle = activeChapter?.title || scene.title;

  return (
    <div className="border-b border-canvas-border bg-canvas-subtle/80 transition-colors">
      <div className="flex items-center justify-between px-3 sm:px-6 py-2 text-xs text-ink-muted">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={toggleNotesDeck}
            className="flex items-center gap-1.5 font-medium text-ink hover:text-brand-700 dark:hover:text-amber-400 transition-colors"
          >
            {isNotesDeckOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            <span className="uppercase tracking-wider font-mono text-[11px] font-semibold">Chapter Deck & Notes</span>
          </button>

          <div className="hidden sm:flex items-center gap-1.5 pl-3 border-l border-canvas-border text-ink">
            <span className="text-[10px] font-mono text-ink-faint uppercase font-semibold">Chapter:</span>
            <input
              type="text"
              value={currentTitle}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Untitled Chapter"
              className="px-1.5 py-0.5 rounded bg-transparent hover:bg-canvas-card focus:bg-canvas-card border border-transparent focus:border-brand-500 font-serif text-xs text-ink focus:outline-none transition-colors max-w-[140px] md:max-w-[200px]"
              title="Chapter title (optional — edit anytime)"
            />
          </div>

          {scene.metadata?.povCharacter && (
            <span className="text-ink-muted flex items-center gap-1 text-[11px]">
              <User className="w-3 h-3 text-[#2e4785] dark:text-indigo-400" />
              <span>POV: <strong className="text-ink font-serif font-normal">{scene.metadata.povCharacter}</strong></span>
            </span>
          )}

          {scene.metadata?.inUniverseDate && (
            <span className="text-ink-muted flex items-center gap-1 text-[11px] hidden lg:inline-flex">
              <Calendar className="w-3 h-3 text-amber-700 dark:text-amber-400" />
              <span>{scene.metadata.inUniverseDate}</span>
            </span>
          )}
        </div>
      </div>

      {isNotesDeckOpen && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-3 px-3 sm:px-6 py-3 bg-canvas-card/60 border-t border-canvas-border text-xs">
          <div className="space-y-1">
            <label className="flex items-center gap-1.5 text-ink-muted font-mono text-[11px] font-medium">
              <User className="w-3 h-3 text-[#2e4785] dark:text-indigo-400" />
              <span>POV CHARACTER</span>
            </label>
            <input
              type="text"
              value={scene.metadata?.povCharacter || ''}
              onChange={(e) => onChange({ povCharacter: e.target.value })}
              placeholder="POV character name"
              className="w-full px-2.5 py-1.5 rounded-lg bg-canvas-card border border-canvas-border text-ink placeholder-ink-faint focus:outline-none focus:border-brand-600 text-xs font-sans shadow-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center gap-1.5 text-ink-muted font-mono text-[11px] font-medium">
              <Calendar className="w-3 h-3 text-amber-700 dark:text-amber-400" />
              <span>IN-UNIVERSE TIMELINE / DATE</span>
            </label>
            <input
              type="text"
              value={scene.metadata?.inUniverseDate || ''}
              onChange={(e) => onChange({ inUniverseDate: e.target.value })}
              placeholder="Timeline or date"
              className="w-full px-2.5 py-1.5 rounded-lg bg-canvas-card border border-canvas-border text-ink placeholder-ink-faint focus:outline-none focus:border-brand-600 text-xs font-sans shadow-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center gap-1.5 text-ink-muted font-mono text-[11px] font-medium">
              <Target className="w-3 h-3 text-[#245b32] dark:text-emerald-400" />
              <span>CHAPTER OBJECTIVE / FOCUS</span>
            </label>
            <input
              type="text"
              value={scene.metadata?.objective || ''}
              onChange={(e) => onChange({ objective: e.target.value })}
              placeholder="Chapter objective or conflict"
              className="w-full px-2.5 py-1.5 rounded-lg bg-canvas-card border border-canvas-border text-ink placeholder-ink-faint focus:outline-none focus:border-brand-600 text-xs font-sans shadow-xs"
            />
          </div>
        </div>
      )}
    </div>
  );
};
