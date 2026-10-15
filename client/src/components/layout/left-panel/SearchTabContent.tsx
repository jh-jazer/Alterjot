import React, { useState, useMemo } from 'react';
import { useWorkspaceStore } from '../../../store/useWorkspaceStore';
import {
  Search,
  Replace,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  BookOpen,
  FileText,
  X,
  Sparkles,
  CaseSensitive,
  WholeWord,
  RefreshCw,
} from 'lucide-react';

interface MatchItem {
  id: string;
  chapterId: string;
  chapterTitle: string;
  sceneId: string;
  sceneTitle: string;
  matchIndex: number;
  before: string;
  matchText: string;
  after: string;
}

export const SearchTabContent: React.FC = () => {
  const chapters = useWorkspaceStore((s) => s.chapters);
  const scenes = useWorkspaceStore((s) => s.scenes);
  const activeChapterId = useWorkspaceStore((s) => s.activeChapterId);
  const activeSceneId = useWorkspaceStore((s) => s.activeSceneId);
  const selectChapter = useWorkspaceStore((s) => s.selectChapter);
  const selectScene = useWorkspaceStore((s) => s.selectScene);
  const replaceTextThroughoutStory = useWorkspaceStore((s) => s.replaceTextThroughoutStory);

  const [searchQuery, setSearchQuery] = useState('');
  const [replaceQuery, setReplaceQuery] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [collapsedChapters, setCollapsedChapters] = useState<Record<string, boolean>>({});
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Build safe search regex
  const searchRegex = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const escaped = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = wholeWord ? `\\b${escaped}\\b` : escaped;
    const flags = caseSensitive ? 'g' : 'gi';
    try {
      return new RegExp(pattern, flags);
    } catch {
      return null;
    }
  }, [searchQuery, caseSensitive, wholeWord]);

  // Find all matches across the story
  const matchesByChapter = useMemo(() => {
    if (!searchRegex) return [];

    const grouped: {
      chapterId: string;
      chapterTitle: string;
      scenes: {
        sceneId: string;
        sceneTitle: string;
        matches: MatchItem[];
      }[];
      totalMatches: number;
    }[] = [];

    // Sort chapters by order
    const sortedChapters = [...chapters].sort((a, b) => a.order - b.order);

    for (const chapter of sortedChapters) {
      const chapterScenes = scenes
        .filter((s) => s.chapterId === chapter._id)
        .sort((a, b) => a.order - b.order);

      const sceneGroups: {
        sceneId: string;
        sceneTitle: string;
        matches: MatchItem[];
      }[] = [];

      let chapterMatchCount = 0;

      for (const scene of chapterScenes) {
        const text = scene.plainText || '';
        const sceneMatches: MatchItem[] = [];

        // Reset regex state
        searchRegex.lastIndex = 0;
        let m: RegExpExecArray | null;
        let matchIndex = 0;

        while ((m = searchRegex.exec(text)) !== null) {
          const start = m.index;
          const end = start + m[0].length;
          const snippetStart = Math.max(0, start - 35);
          const snippetEnd = Math.min(text.length, end + 35);

          const before = (snippetStart > 0 ? '…' : '') + text.slice(snippetStart, start);
          const matchText = text.slice(start, end);
          const after = text.slice(end, snippetEnd) + (snippetEnd < text.length ? '…' : '');

          sceneMatches.push({
            id: `${scene._id}-${start}-${matchIndex}`,
            chapterId: chapter._id,
            chapterTitle: chapter.title,
            sceneId: scene._id,
            sceneTitle: scene.title,
            matchIndex,
            before,
            matchText,
            after,
          });

          matchIndex++;
          // Avoid infinite loop if zero-width match
          if (m[0].length === 0) searchRegex.lastIndex++;
        }

        if (sceneMatches.length > 0) {
          chapterMatchCount += sceneMatches.length;
          sceneGroups.push({
            sceneId: scene._id,
            sceneTitle: scene.title,
            matches: sceneMatches,
          });
        }
      }

      if (sceneGroups.length > 0) {
        grouped.push({
          chapterId: chapter._id,
          chapterTitle: chapter.title,
          scenes: sceneGroups,
          totalMatches: chapterMatchCount,
        });
      }
    }

    return grouped;
  }, [chapters, scenes, searchRegex]);

  const totalMatchesCount = useMemo(() => {
    return matchesByChapter.reduce((acc, c) => acc + c.totalMatches, 0);
  }, [matchesByChapter]);

  const totalScenesCount = useMemo(() => {
    return matchesByChapter.reduce((acc, c) => acc + c.scenes.length, 0);
  }, [matchesByChapter]);

  const toggleChapterCollapse = (chapterId: string) => {
    setCollapsedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  const handleNavigateToMatch = (match: MatchItem) => {
    if (activeChapterId !== match.chapterId) {
      selectChapter(match.chapterId);
    }
    if (activeSceneId !== match.sceneId) {
      selectScene(match.sceneId);
    }

    // Scroll editor to exact match
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('alterjot:scroll-to-match', {
          detail: {
            searchTerm: searchQuery,
            occurrence: match.matchIndex,
          },
        })
      );
    }
  };

  const handleReplaceAllInStory = () => {
    if (!searchQuery) return;
    const result = replaceTextThroughoutStory(searchQuery, replaceQuery, {
      caseSensitive,
      wholeWord,
    });

    setNotification({
      type: 'success',
      message: `Replaced ${result.totalReplacements} ${
        result.totalReplacements === 1 ? 'occurrence' : 'occurrences'
      } across ${result.affectedScenes} ${
        result.affectedScenes === 1 ? 'scene' : 'scenes'
      }.`,
    });

    setTimeout(() => setNotification(null), 4500);
  };

  const handleReplaceInCurrentScene = () => {
    if (!searchQuery || !activeSceneId) return;
    const result = replaceTextThroughoutStory(searchQuery, replaceQuery, {
      caseSensitive,
      wholeWord,
      sceneId: activeSceneId,
    });

    setNotification({
      type: 'success',
      message: `Replaced ${result.totalReplacements} ${
        result.totalReplacements === 1 ? 'occurrence' : 'occurrences'
      } in active scene.`,
    });

    setTimeout(() => setNotification(null), 4000);
  };

  const handleReplaceSingleMatch = (match: MatchItem, e: React.MouseEvent) => {
    e.stopPropagation();
    handleNavigateToMatch(match);

    // Replace this specific match in the active scene
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('alterjot:replace-single-occurrence', {
          detail: {
            searchTerm: searchQuery,
            replaceWith: replaceQuery,
            occurrence: match.matchIndex,
          },
        })
      );
    }

    setNotification({
      type: 'info',
      message: `Replaced match in "${match.sceneTitle}".`,
    });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="flex flex-col h-full bg-canvas text-ink select-none overflow-hidden">
      {/* 1. Header Toolbar */}
      <div className="p-3 border-b border-canvas-border flex-shrink-0 bg-canvas/80 backdrop-blur-xs">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <Search className="w-4 h-4 text-brand-600 dark:text-amber-400 flex-shrink-0" />
            <h3 className="font-serif font-bold text-xs sm:text-sm text-ink truncate">
              Search & Replace
            </h3>
          </div>

          {searchQuery && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-700 dark:text-amber-300 font-semibold border border-brand-500/20">
              {totalMatchesCount} {totalMatchesCount === 1 ? 'match' : 'matches'}
            </span>
          )}
        </div>

        {/* Search Input Box */}
        <div className="relative mb-2">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-ink-muted">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search manuscript..."
            className="w-full pl-8 pr-16 py-1.5 text-xs font-mono rounded-lg bg-canvas-card border border-canvas-border text-ink placeholder:text-ink-faint focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition-all shadow-xs"
          />

          {/* Quick Filter Toggles (Case Sensitive & Whole Word) */}
          <div className="absolute inset-y-0 right-1 flex items-center gap-0.5">
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-1 rounded text-ink-muted hover:text-ink hover:bg-canvas-hover transition-colors"
                title="Clear search"
              >
                <X className="w-3 h-3" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setCaseSensitive(!caseSensitive)}
              className={`p-1 rounded transition-colors text-xs font-mono font-bold cursor-pointer ${
                caseSensitive
                  ? 'bg-brand-500/20 text-brand-700 dark:text-amber-300 border border-brand-500/30'
                  : 'text-ink-muted hover:text-ink hover:bg-canvas-hover'
              }`}
              title="Match Case (Case Sensitive)"
            >
              <CaseSensitive className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setWholeWord(!wholeWord)}
              className={`p-1 rounded transition-colors text-xs font-mono cursor-pointer ${
                wholeWord
                  ? 'bg-brand-500/20 text-brand-700 dark:text-amber-300 border border-brand-500/30'
                  : 'text-ink-muted hover:text-ink hover:bg-canvas-hover'
              }`}
              title="Match Whole Word"
            >
              <WholeWord className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Replace Input Box */}
        <div className="relative mb-2.5">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-ink-muted">
            <Replace className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={replaceQuery}
            onChange={(e) => setReplaceQuery(e.target.value)}
            placeholder="Replace with..."
            className="w-full pl-8 pr-7 py-1.5 text-xs font-mono rounded-lg bg-canvas-card border border-canvas-border text-ink placeholder:text-ink-faint focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition-all shadow-xs"
          />
          {replaceQuery && (
            <button
              type="button"
              onClick={() => setReplaceQuery('')}
              className="absolute inset-y-0 right-1 my-auto h-6 w-6 rounded flex items-center justify-center text-ink-muted hover:text-ink hover:bg-canvas-hover transition-colors"
              title="Clear replacement"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Action Replacement Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleReplaceAllInStory}
            disabled={!searchQuery || totalMatchesCount === 0}
            className={`flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all shadow-xs cursor-pointer ${
              !searchQuery || totalMatchesCount === 0
                ? 'opacity-40 cursor-not-allowed bg-canvas-subtle text-ink-muted border border-canvas-border'
                : 'bg-brand-600 hover:bg-brand-700 text-white dark:bg-amber-500 dark:hover:bg-amber-600 dark:text-zinc-950 hover:shadow active:scale-98'
            }`}
            title="Replace all occurrences across entire manuscript"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Replace All in Story</span>
          </button>

          <button
            type="button"
            onClick={handleReplaceInCurrentScene}
            disabled={!searchQuery || !activeSceneId}
            className="px-2.5 py-1.5 rounded-lg text-xs font-mono border border-canvas-border bg-canvas-card hover:bg-canvas-hover text-ink-muted hover:text-ink transition-colors cursor-pointer"
            title="Replace matches only in currently open scene"
          >
            In Scene
          </button>
        </div>

        {/* Notification Toast */}
        {notification && (
          <div className="mt-2 p-2 rounded-lg bg-brand-500/15 border border-brand-500/30 text-ink text-xs font-mono flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-150">
            <Check className="w-3.5 h-3.5 text-brand-600 dark:text-amber-400 flex-shrink-0" />
            <span className="truncate">{notification.message}</span>
          </div>
        )}
      </div>

      {/* 2. Search Results List / Empty State */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-3">
        {/* Empty State: Prompt to search */}
        {!searchQuery.trim() && (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-ink-muted space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-canvas-card border border-canvas-border flex items-center justify-center text-ink-faint shadow-xs">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-xs sm:text-sm text-ink mb-1">
                Manuscript Global Search
              </h4>
              <p className="text-xs text-ink-muted font-sans max-w-[220px] leading-relaxed">
                Find character names, lore, dialogue, or terms and replace them across all chapters.
              </p>
            </div>
            <div className="text-[10px] font-mono text-ink-faint border border-canvas-border/80 px-2.5 py-1 rounded-md bg-canvas-subtle">
              Press <span className="font-bold text-ink">Ctrl+Shift+F</span> anytime
            </div>
          </div>
        )}

        {/* No Matches Found */}
        {searchQuery.trim() && matchesByChapter.length === 0 && (
          <div className="h-48 flex flex-col items-center justify-center text-center p-6 text-ink-muted space-y-2">
            <p className="text-xs font-mono text-ink-faint">
              No results found for <span className="text-ink font-semibold">"{searchQuery}"</span>
            </p>
            <p className="text-[11px] text-ink-muted">
              Check spelling or toggle Case Sensitive (<CaseSensitive className="w-3 h-3 inline" />) / Whole Word (<WholeWord className="w-3 h-3 inline" />).
            </p>
          </div>
        )}

        {/* Results Grouped by Chapter & Scene */}
        {matchesByChapter.map((chap) => {
          const isCollapsed = Boolean(collapsedChapters[chap.chapterId]);

          return (
            <div
              key={chap.chapterId}
              className="rounded-xl border border-canvas-border bg-canvas-card/60 overflow-hidden shadow-2xs"
            >
              {/* Chapter Header */}
              <button
                type="button"
                onClick={() => toggleChapterCollapse(chap.chapterId)}
                className="w-full flex items-center justify-between px-3 py-2 bg-canvas-subtle/80 hover:bg-canvas-hover transition-colors text-left cursor-pointer group"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  {isCollapsed ? (
                    <ChevronRight className="w-3.5 h-3.5 text-ink-muted group-hover:text-ink transition-transform" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-ink-muted group-hover:text-ink transition-transform" />
                  )}
                  <BookOpen className="w-3.5 h-3.5 text-brand-600 dark:text-amber-400 flex-shrink-0" />
                  <span className="font-serif font-bold text-xs text-ink truncate">
                    {chap.chapterTitle || 'Untitled Chapter'}
                  </span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-canvas-card text-ink-muted border border-canvas-border font-semibold flex-shrink-0">
                  {chap.totalMatches}
                </span>
              </button>

              {/* Chapter Scenes & Matches */}
              {!isCollapsed && (
                <div className="divide-y divide-canvas-border/50">
                  {chap.scenes.map((sc) => (
                    <div key={sc.sceneId} className="p-2 space-y-1.5 bg-canvas/40">
                      {/* Scene Title Header */}
                      <div className="flex items-center gap-1.5 px-1 text-[11px] font-mono font-medium text-ink-muted">
                        <FileText className="w-3 h-3 text-ink-faint flex-shrink-0" />
                        <span className="truncate">{sc.sceneTitle || 'Untitled Scene'}</span>
                        <span className="text-[9px] text-ink-faint">({sc.matches.length})</span>
                      </div>

                      {/* Match Snippet Rows */}
                      <div className="space-y-1 pl-1">
                        {sc.matches.map((m) => (
                          <div
                            key={m.id}
                            onClick={() => handleNavigateToMatch(m)}
                            className="group relative p-2 rounded-lg bg-canvas-card hover:bg-canvas-hover border border-canvas-border/60 hover:border-brand-500/40 transition-all cursor-pointer text-xs font-mono text-left"
                            title="Click to jump to match in editor"
                          >
                            <p className="text-[11px] leading-relaxed text-ink-muted break-words">
                              <span>{m.before}</span>
                              <span className="bg-amber-400/25 dark:bg-amber-400/30 text-amber-900 dark:text-amber-200 font-bold px-1 py-0.5 rounded border border-amber-500/30 shadow-2xs">
                                {m.matchText}
                              </span>
                              <span>{m.after}</span>
                            </p>

                            {/* Inline Replace Preview (if replace text is present) */}
                            {replaceQuery && (
                              <div className="mt-1 flex items-center justify-between pt-1 border-t border-canvas-border/50 text-[10px] text-ink-muted">
                                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                                  <ArrowRight className="w-2.5 h-2.5" />
                                  <span className="font-semibold truncate max-w-[140px]">
                                    {replaceQuery}
                                  </span>
                                </div>

                                <button
                                  type="button"
                                  onClick={(e) => handleReplaceSingleMatch(m, e)}
                                  className="opacity-0 group-hover:opacity-100 px-1.5 py-0.5 rounded bg-brand-500/15 hover:bg-brand-500/25 text-brand-700 dark:text-amber-300 text-[9px] font-mono font-bold transition-all"
                                  title="Replace just this occurrence"
                                >
                                  Replace
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 3. Footer Summary */}
      {searchQuery.trim() && (
        <div className="p-2.5 border-t border-canvas-border bg-canvas-subtle/80 text-[10px] font-mono text-ink-muted flex items-center justify-between">
          <span>
            {totalMatchesCount} matches in {totalScenesCount} scenes
          </span>
          <button
            type="button"
            onClick={() => {
              // Trigger a state reload or re-evaluate
              setSearchQuery((q) => q.slice());
            }}
            className="flex items-center gap-1 hover:text-ink transition-colors cursor-pointer"
            title="Refresh results"
          >
            <RefreshCw className="w-2.5 h-2.5" />
            <span>Refresh</span>
          </button>
        </div>
      )}
    </div>
  );
};
