import React from 'react';
import { Hash } from 'lucide-react';

interface WordCounterProps {
  wordCount: number;
  characterCount: number;
}

export const WordCounter: React.FC<WordCounterProps> = ({ wordCount, characterCount }) => {
  return (
    <div className="flex items-center gap-3 text-xs font-mono text-ink-muted py-1.5 px-3 rounded-lg bg-canvas-card/80 border border-canvas-border shadow-xs backdrop-blur-sm select-none">
      <div className="flex items-center gap-1.5" title="Scene word count">
        <Hash className="w-3.5 h-3.5 text-brand-600" />
        <span className="font-semibold text-ink">{wordCount.toLocaleString()}</span>
        <span className="text-ink-faint text-[11px]">words</span>
      </div>

      <div className="w-px h-3 bg-canvas-border" />

      <div className="flex items-center gap-1.5" title="Character count">
        <span className="text-ink-faint">chars:</span>
        <span className="text-ink">{characterCount.toLocaleString()}</span>
      </div>
    </div>
  );
};
