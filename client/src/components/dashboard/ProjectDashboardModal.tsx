import React, { useState } from 'react';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import { api } from '../../services/api';
import {
  X,
  Target,
  Layers,
  TrendingUp,
  Clock,
  Edit,
  Database,
} from 'lucide-react';

export const ProjectDashboardModal: React.FC = () => {
  const isDashboardOpen = useWorkspaceStore((s) => s.isDashboardOpen);
  const setIsDashboardOpen = useWorkspaceStore((s) => s.setIsDashboardOpen);
  const activeNovel = useWorkspaceStore((s) => s.novels.find((n) => n._id === s.activeNovelId));
  const chapters = useWorkspaceStore((s) => s.chapters);
  const scenes = useWorkspaceStore((s) => s.scenes);
  const isAtlas = useWorkspaceStore((s) => s.isAtlas);
  const refreshNovel = useWorkspaceStore((s) => s.refreshNovel);

  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [goalWords, setGoalWords] = useState(activeNovel?.targetWordCount || 80000);

  if (!isDashboardOpen || !activeNovel) return null;

  const totalWords = activeNovel.totalWordCount || 0;
  const targetWords = activeNovel.targetWordCount || 80000;
  const progressPercent = Math.min(100, Math.round((totalWords / targetWords) * 100));

  const draftScenes = scenes.filter((s) => s.status === 'Draft').length;
  const inReviewScenes = scenes.filter((s) => s.status === 'In Review').length;
  const finalScenes = scenes.filter((s) => s.status === 'Final').length;

  const handleUpdateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeNovel) return;
    await api.updateNovel(activeNovel._id, { targetWordCount: Number(goalWords) });
    await refreshNovel();
    setIsEditingGoal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-canvas-card border border-canvas-border shadow-parchment-lg p-6 text-ink">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-canvas-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-brand-50 text-brand-700 border border-brand-200 dark:bg-brand-600/20 dark:text-brand-400 dark:border-brand-500/30">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-serif font-bold text-ink">{activeNovel.title}</h3>
              <p className="text-xs text-ink-muted font-mono">
                Project Metrics & Manuscript Velocity Overview
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsDashboardOpen(false)}
            className="p-1 rounded-lg hover:bg-canvas-hover text-ink-muted hover:text-ink"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Word Count Goal Banner */}
        <div className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-[#fcf7ee] via-canvas-card to-[#f4ecd8] dark:from-brand-950/40 dark:via-canvas-surface dark:to-canvas-card border border-brand-200 dark:border-brand-500/20 relative overflow-hidden shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-brand-800 dark:text-brand-300 font-semibold flex items-center gap-1.5">
                <Target className="w-4 h-4 text-brand-700" />
                Manuscript Target Word Count
              </span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-4xl font-extrabold text-ink tracking-tight font-serif">
                  {totalWords.toLocaleString()}
                </span>
                <span className="text-xl text-ink-muted font-mono">
                  / {targetWords.toLocaleString()} words
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-3xl font-extrabold text-brand-700 dark:text-brand-400 font-mono">
                {progressPercent}%
              </span>
              <span className="block text-xs text-ink-muted mt-0.5 font-sans">Completion Rate</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-canvas-surface rounded-full h-3.5 mt-5 overflow-hidden p-0.5 border border-canvas-border">
            <div
              className="bg-gradient-to-r from-amber-600 via-[#c2593f] to-amber-500 h-full rounded-full transition-all duration-700 shadow-xs"
              style={{ width: `${Math.max(2, progressPercent)}%` }}
            />
          </div>

          {/* Quick Target Words Editor */}
          <div className="mt-4 flex items-center justify-between text-xs text-ink-muted">
            <span>
              {Math.max(0, targetWords - totalWords).toLocaleString()} words remaining to goal
            </span>
            {isEditingGoal ? (
              <form onSubmit={handleUpdateGoal} className="flex items-center gap-2">
                <input
                  type="number"
                  value={goalWords}
                  onChange={(e) => setGoalWords(Number(e.target.value))}
                  className="w-24 px-2 py-0.5 rounded bg-canvas-card border border-canvas-border text-xs text-ink shadow-xs"
                />
                <button
                  type="submit"
                  className="px-2 py-0.5 rounded bg-brand-600 hover:bg-brand-700 text-white font-mono text-[11px]"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingGoal(false)}
                  className="text-ink-muted hover:text-ink"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditingGoal(true)}
                className="flex items-center gap-1 text-ink-muted hover:text-brand-700 font-mono text-[11px]"
              >
                <Edit className="w-3 h-3" />
                <span>Adjust Target Goal</span>
              </button>
            )}
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-canvas-surface border border-canvas-border shadow-xs">
            <div className="flex items-center gap-2 text-ink-muted mb-1">
              <Layers className="w-4 h-4 text-[#2e4785] dark:text-indigo-400" />
              <span className="text-xs font-mono uppercase font-medium">Structure</span>
            </div>
            <div className="text-2xl font-serif font-bold text-ink mt-1">{chapters.length} Chapters</div>
            <div className="text-xs text-ink-muted mt-0.5">{scenes.length} Scenes across manuscript</div>
          </div>

          <div className="p-4 rounded-xl bg-canvas-surface border border-canvas-border shadow-xs">
            <div className="flex items-center gap-2 text-ink-muted mb-1">
              <Clock className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              <span className="text-xs font-mono uppercase font-medium">Est. Reading Time</span>
            </div>
            <div className="text-2xl font-serif font-bold text-ink mt-1">
              {Math.max(1, Math.ceil(totalWords / 200))} mins
            </div>
            <div className="text-xs text-ink-muted mt-0.5">Based on 200 words / minute standard</div>
          </div>

          <div className="p-4 rounded-xl bg-canvas-surface border border-canvas-border shadow-xs">
            <div className="flex items-center gap-2 text-ink-muted mb-1">
              <Database className="w-4 h-4 text-[#245b32] dark:text-emerald-400" />
              <span className="text-xs font-mono uppercase font-medium">Database Tier</span>
            </div>
            <div className="text-2xl font-serif font-bold text-ink mt-1">
              {isAtlas ? 'MongoDB Atlas' : 'Local Hybrid'}
            </div>
            <div className="text-xs text-ink-muted mt-0.5">
              {isAtlas ? 'Cloud synced' : 'Local memory + offline storage'}
            </div>
          </div>
        </div>

        {/* Scene Status Pipeline in Retro Colors */}
        <div className="mt-6 p-4 rounded-xl bg-canvas-surface border border-canvas-border shadow-xs">
          <h4 className="text-xs font-mono uppercase text-ink-muted mb-3 tracking-wider font-semibold">
            Scene Revision Pipeline
          </h4>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-lg bg-[#faeed1] border border-[#e3c788] dark:bg-amber-950/20 dark:border-amber-900/30">
              <span className="text-xs font-mono text-[#7c4a03] dark:text-amber-300 block font-semibold">DRAFT</span>
              <span className="text-xl font-bold font-serif text-[#7c4a03] dark:text-amber-200 mt-1 block">{draftScenes}</span>
              <span className="text-[11px] text-[#925f16] dark:text-amber-400/60">Scenes in progress</span>
            </div>

            <div className="p-3 rounded-lg bg-[#dcf0f2] border border-[#9ec8ce] dark:bg-sky-950/20 dark:border-sky-900/30">
              <span className="text-xs font-mono text-[#1b5966] dark:text-sky-300 block font-semibold">IN REVIEW</span>
              <span className="text-xl font-bold font-serif text-[#1b5966] dark:text-sky-200 mt-1 block">{inReviewScenes}</span>
              <span className="text-[11px] text-[#2c7180] dark:text-sky-400/60">Scenes being revised</span>
            </div>

            <div className="p-3 rounded-lg bg-[#dff0e4] border border-[#a0cea9] dark:bg-emerald-950/20 dark:border-emerald-900/30">
              <span className="text-xs font-mono text-[#245b32] dark:text-emerald-300 block font-semibold">FINAL</span>
              <span className="text-xl font-bold font-serif text-[#245b32] dark:text-emerald-200 mt-1 block">{finalScenes}</span>
              <span className="text-[11px] text-[#337243] dark:text-emerald-400/60">Polished scenes</span>
            </div>
          </div>
        </div>

        {/* Chapter Word Distribution */}
        <div className="mt-6">
          <h4 className="text-xs font-mono uppercase text-ink-muted mb-2 tracking-wider font-semibold">
            Chapter Word Breakdown
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {chapters.map((ch) => {
              const chScenes = scenes.filter((s) => s.chapterId === ch._id);
              const chWords = chScenes.reduce((acc, s) => acc + (s.wordCount || 0), 0);
              const chPercent = totalWords > 0 ? Math.round((chWords / totalWords) * 100) : 0;

              return (
                <div
                  key={ch._id}
                  className="p-2.5 rounded-lg bg-canvas-card border border-canvas-border flex items-center justify-between text-xs shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-medium text-ink">{ch.title}</span>
                    <span className="text-ink-faint font-mono text-[11px]">
                      ({chScenes.length} scenes)
                    </span>
                  </div>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-ink font-semibold">{chWords.toLocaleString()} words</span>
                    <span className="text-brand-700 dark:text-brand-400 text-[11px] w-10 text-right">{chPercent}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
