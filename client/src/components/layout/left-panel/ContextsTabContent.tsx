import React, { useState } from 'react';
import { useWorkspaceStore } from '../../../store/useWorkspaceStore';
import { CodexCard } from '../../codex/CodexCard';
import { CodexModal } from '../../codex/CodexModal';
import type { CodexCategory, CodexEntry } from '../../../types';
import { api } from '../../../services/api';
import { Plus, Search, BookMarked, X } from 'lucide-react';

export const ContextsTabContent: React.FC = () => {
  const codexEntries = useWorkspaceStore((s) => s.codexEntries);
  const activeNovelId = useWorkspaceStore((s) => s.activeNovelId);
  const refreshCodex = useWorkspaceStore((s) => s.refreshCodex);

  const [activeTab, setActiveTab] = useState<'All' | CodexCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<CodexEntry | null>(null);

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
    <div className="flex flex-col h-full bg-canvas select-none">
      {/* Header action bar */}
      <div className="p-3 border-b border-canvas-border bg-canvas-subtle/50 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <BookMarked className="w-4 h-4 text-brand-700 dark:text-amber-400" />
          <span className="font-serif font-bold text-ink text-xs tracking-wide">Survival Codex & Lore</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-canvas-card border border-canvas-border text-ink-muted">
            {codexEntries.length}
          </span>
        </div>
        <button
          type="button"
          onClick={handleNewEntry}
          className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-brand-600 hover:bg-brand-700 text-white text-[11px] font-mono font-medium transition-colors shadow-xs cursor-pointer active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Card</span>
        </button>
      </div>

      {/* Search and Category Filters */}
      <div className="p-2.5 border-b border-canvas-border bg-canvas">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-ink-faint absolute left-2.5 top-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search survivors, outposts, rules..."
            className="w-full pl-8 pr-2.5 py-1 rounded-lg bg-canvas-card border border-canvas-border text-xs text-ink placeholder-ink-faint focus:outline-none focus:border-brand-600 shadow-xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1.5 text-ink-faint hover:text-ink"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Categories scrollable rail */}
        <div className="flex items-center gap-1 mt-2 overflow-x-auto pb-1 scrollbar-none text-[10px] font-mono">
          {(['All', 'Characters', 'Locations', 'Factions', 'Hazards', 'Scavenge', 'Timeline'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-2 py-0.5 rounded-md whitespace-nowrap border transition-colors shadow-xs cursor-pointer ${
                activeTab === tab
                  ? 'bg-brand-600 border-brand-700 text-white font-medium dark:bg-amber-500 dark:border-amber-600 dark:text-neutral-950'
                  : 'bg-canvas-card border-canvas-border text-ink-muted hover:text-ink hover:bg-canvas-hover'
              }`}
            >
              {tab === 'Characters'
                ? 'Survivors'
                : tab === 'Locations'
                ? 'Outposts'
                : tab === 'Timeline'
                ? 'Incidents'
                : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Entries List */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5 bg-canvas">
        {filteredEntries.length === 0 ? (
          <div className="text-center py-10 px-4 text-ink-muted">
            <BookMarked className="w-7 h-7 text-ink-faint mx-auto mb-2 opacity-40" />
            <p className="text-xs">No lore cards found matching criteria.</p>
            <button
              type="button"
              onClick={handleNewEntry}
              className="mt-2 text-xs text-brand-700 dark:text-amber-400 hover:underline font-serif cursor-pointer"
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
    </div>
  );
};
