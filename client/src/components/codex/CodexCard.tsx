import React, { useState } from 'react';
import type { CodexEntry } from '../../types';
import { Badge } from '../common/Badge';
import { User, MapPin, Shield, Clock, ChevronDown, ChevronUp, Edit2, Trash2, AlertTriangle, Package } from 'lucide-react';

interface CodexCardProps {
  entry: CodexEntry;
  onEdit: (entry: CodexEntry) => void;
  onDelete: (id: string) => void;
}

export const CodexCard: React.FC<CodexCardProps> = ({ entry, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getCategoryIcon = () => {
    switch (entry.category) {
      case 'Characters':
        return <User className="w-3.5 h-3.5 text-[#2e4785] dark:text-indigo-400" />;
      case 'Locations':
        return <MapPin className="w-3.5 h-3.5 text-[#225744] dark:text-teal-400" />;
      case 'Factions':
        return <Shield className="w-3.5 h-3.5 text-[#913d1e] dark:text-amber-400" />;
      case 'Timeline':
        return <Clock className="w-3.5 h-3.5 text-[#86294d] dark:text-rose-400" />;
      case 'Hazards':
        return <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />;
      case 'Scavenge':
        return <Package className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />;
    }
  };

  const hasDossierTraits =
    entry.traits &&
    (entry.traits.appearance ||
      entry.traits.voice ||
      entry.traits.quirks ||
      entry.traits.background ||
      entry.traits.significance);

  return (
    <div className="rounded-xl border border-canvas-border bg-canvas-card hover:border-brand-300 transition-all p-3.5 text-ink shadow-xs group">
      {/* Top Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-canvas-surface border border-canvas-border shadow-xs">
              {getCategoryIcon()}
            </span>
            <h4 className="font-serif font-bold text-sm text-ink group-hover:text-brand-700 transition-colors">
              {entry.name}
            </h4>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge status={entry.category} size="sm" />
            {entry.timelineDate && (
              <span className="text-[10px] font-mono text-[#86294d] bg-[#f8e2ec] dark:text-rose-300 dark:bg-rose-950/40 px-1.5 py-0.5 rounded border border-[#dfa9c0] dark:border-rose-900/30">
                {entry.timelineDate}
              </span>
            )}
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => onEdit(entry)}
            className="p-1 rounded hover:bg-canvas-hover text-ink-muted hover:text-brand-700 transition-colors"
            title="Edit lore entry"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(entry._id)}
            className="p-1 rounded hover:bg-canvas-hover text-ink-muted hover:text-rose-600 transition-colors"
            title="Delete entry"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Summary */}
      {entry.summary && (
        <p className="text-xs text-ink-muted mt-2 line-clamp-2 leading-relaxed font-sans">
          {entry.summary}
        </p>
      )}

      {/* Tags */}
      {entry.tags && entry.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2.5">
          {entry.tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] font-mono text-ink-muted bg-canvas-surface px-1.5 py-0.5 rounded border border-canvas-border"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Character Dossier accordion */}
      {hasDossierTraits && (
        <div className="mt-3 pt-2.5 border-t border-canvas-border">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between text-[11px] font-mono text-ink-muted hover:text-brand-700 transition-colors"
          >
            <span className="uppercase tracking-wider font-semibold">
              {entry.category === 'Characters' ? 'Dossier Traits & Quirks' : 'Lore Details'}
            </span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {isExpanded && (
            <div className="mt-2.5 space-y-2 text-xs text-ink bg-canvas-surface/70 p-2.5 rounded-lg border border-canvas-border">
              {entry.traits.appearance && (
                <div>
                  <span className="font-mono text-[10px] uppercase text-[#2e4785] dark:text-indigo-400 block font-semibold">
                    Physical Appearance:
                  </span>
                  <p className="text-ink mt-0.5 leading-relaxed font-sans">{entry.traits.appearance}</p>
                </div>
              )}
              {entry.traits.voice && (
                <div>
                  <span className="font-mono text-[10px] uppercase text-[#913d1e] dark:text-amber-400 block font-semibold">
                    Voice Quirks & Cadence:
                  </span>
                  <p className="text-ink mt-0.5 leading-relaxed font-sans">{entry.traits.voice}</p>
                </div>
              )}
              {entry.traits.quirks && (
                <div>
                  <span className="font-mono text-[10px] uppercase text-[#245b32] dark:text-emerald-400 block font-semibold">
                    Habits & Quirks:
                  </span>
                  <p className="text-ink mt-0.5 leading-relaxed font-sans">{entry.traits.quirks}</p>
                </div>
              )}
              {entry.traits.background && (
                <div>
                  <span className="font-mono text-[10px] uppercase text-[#1b5966] dark:text-sky-400 block font-semibold">
                    Background Lore:
                  </span>
                  <p className="text-ink mt-0.5 leading-relaxed font-sans">{entry.traits.background}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
