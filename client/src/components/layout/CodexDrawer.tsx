import React, { useState } from 'react';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import { CodexCard } from '../codex/CodexCard';
import { CodexModal } from '../codex/CodexModal';
import type { CodexCategory, CodexEntry } from '../../types';
import { api } from '../../services/api';
import { X, Plus, Search, BookMarked } from 'lucide-react';

export const CodexDrawer: React.FC = () => {
  const isCodexOpen = useWorkspaceStore((s) => s.panelState.isCodexOpen);
  const toggleCodex = useWorkspaceStore((s) => s.toggleCodex);
  const codexEntries = useWorkspaceStore((s) => s.codexEntries);
  const activeNovelId = useWorkspaceStore((s) => s.activeNovelId);
  const refreshCodex = useWorkspaceStore((s) => s.refreshCodex);

  const [activeTab, setActiveTab] = useState<'All' | CodexCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<CodexEntry | null>(null);

  if (!isCodexOpen) return null;

  const filteredEntries = codexEntries.filter((entry) => {
    const matchesTab = activeTab === 'All' || entry.category === activeTab;
    const matchesSearch =
      searchQuery === '' ||
      entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const handleSaveEntry = async (data: Partial<CodexEntry>) => {
    if (!activeNovelId) return;

    if (editingEntry) {
      await api.updateCodex(editingEntry._id, data);
    } else {
      await api.createCodex({
        ...data,
        novelId: activeNovelId,
      });
    }
    await refreshCodex();
    setEditingEntry(null);
  };

  const handleDeleteEntry = async (id: string) => {
    if (confirm('Delete this world codex entry?')) {
      await api.deleteCodex(id);
      await refreshCodex();
    }
  };

  const handleEditEntry = (entry: CodexEntry) => {
    setEditingEntry(entry);
    setIsModalOpen(true);
  };

  const handleNewEntry = () => {
    setEditingEntry(null);
    setIsModalOpen(true);
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30 md:hidden animate-fadeIn"
        onClick={toggleCodex}
        title="Close World Codex"
      />

      <aside className="fixed md:relative inset-y-0 right-0 z-40 w-5/6 max-w-sm md:max-w-none md:w-96 border-l border-canvas-border bg-canvas flex flex-col h-full shadow-2xl md:shadow-parchment-lg select-none animate-in slide-in-from-right duration-200">
      <div className="p-4 border-b border-canvas-border flex items-center justify-between bg-canvas-subtle/50">
        <div className="flex items-center gap-2">
          <BookMarked className="w-4 h-4 text-brand-700" />
          <h3 className="font-serif font-bold text-ink text-sm tracking-wide">Survival Codex & Lore</h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleNewEntry}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-brand-600 hover:bg-brand-700 text-white text-xs font-mono font-medium transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Card</span>
          </button>
          <button
            type="button"
            onClick={toggleCodex}
            className="p-1.5 rounded-md hover:bg-canvas-hover text-ink-muted hover:text-ink transition-colors"
            title="Close Lore Drawer (Ctrl+Shift+C)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-3 border-b border-canvas-border bg-canvas">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-ink-faint absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search survivors, outposts, hazards, scavenge..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-canvas-card border border-canvas-border text-xs text-ink placeholder-ink-faint focus:outline-none focus:border-brand-600 shadow-xs"
          />
        </div>

        <div className="flex items-center gap-1 mt-2.5 overflow-x-auto pb-1 scrollbar-none text-[11px] font-mono">
          {(['All', 'Characters', 'Locations', 'Factions', 'Hazards', 'Scavenge', 'Timeline'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-2 py-0.5 rounded-md whitespace-nowrap border transition-colors shadow-xs ${
                activeTab === tab
                  ? 'bg-brand-600 border-brand-700 text-white font-medium'
                  : 'bg-canvas-card border-canvas-border text-ink-muted hover:text-ink hover:bg-canvas-hover'
              }`}
            >
              {tab === 'Characters'
                ? 'Survivors'
                : tab === 'Locations'
                ? 'Outposts / Ruins'
                : tab === 'Timeline'
                ? 'Incidents'
                : tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-canvas">
        {filteredEntries.length === 0 ? (
          <div className="text-center py-12 px-4 text-ink-muted">
            <BookMarked className="w-8 h-8 text-ink-faint mx-auto mb-2 opacity-50" />
            <p className="text-xs">No lore cards found matching criteria.</p>
            <button
              type="button"
              onClick={handleNewEntry}
              className="mt-3 text-xs text-brand-700 hover:underline font-serif"
            >
              + Add a new lore card
            </button>
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <CodexCard
              key={entry._id}
              entry={entry}
              onEdit={handleEditEntry}
              onDelete={handleDeleteEntry}
            />
          ))
        )}
      </div>

      <CodexModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEntry}
        initialData={editingEntry}
        defaultCategory={activeTab !== 'All' ? activeTab : 'Characters'}
      />
    </aside>
  </>
  );
};
