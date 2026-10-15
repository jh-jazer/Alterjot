import React, { useState, useEffect } from 'react';
import type { CodexEntry, CodexCategory } from '../../types';
import { X, Save, User, MapPin, Shield, Clock, AlertTriangle, Package } from 'lucide-react';

interface CodexModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entryData: Partial<CodexEntry>) => Promise<void>;
  initialData?: CodexEntry | null;
  defaultCategory?: CodexCategory;
}

export const CodexModal: React.FC<CodexModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  defaultCategory = 'Characters',
}) => {
  const [category, setCategory] = useState<CodexCategory>(defaultCategory);
  const [name, setName] = useState('');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [tagsStr, setTagsStr] = useState('');
  const [timelineDate, setTimelineDate] = useState('');

  // Character Profile traits
  const [appearance, setAppearance] = useState('');
  const [voice, setVoice] = useState('');
  const [quirks, setQuirks] = useState('');
  const [background, setBackground] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setCategory(initialData.category);
      setName(initialData.name);
      setSummary(initialData.summary || '');
      setDescription(initialData.description || '');
      setTagsStr(initialData.tags ? initialData.tags.join(', ') : '');
      setTimelineDate(initialData.timelineDate || '');
      setAppearance(initialData.traits?.appearance || '');
      setVoice(initialData.traits?.voice || '');
      setQuirks(initialData.traits?.quirks || '');
      setBackground(initialData.traits?.background || '');
    } else {
      setCategory(defaultCategory);
      setName('');
      setSummary('');
      setDescription('');
      setTagsStr('');
      setTimelineDate('');
      setAppearance('');
      setVoice('');
      setQuirks('');
      setBackground('');
    }
  }, [initialData, defaultCategory, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || 'Untitled Entity';

    setIsSubmitting(true);
    const tags = tagsStr
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    await onSave({
      category,
      name: finalName,
      summary: summary.trim(),
      description: description.trim(),
      tags,
      timelineDate: timelineDate.trim(),
      traits: {
        appearance: appearance.trim(),
        voice: voice.trim(),
        quirks: quirks.trim(),
        background: background.trim(),
      },
    });

    setIsSubmitting(false);
    onClose();
  };

  const categories: CodexCategory[] = ['Characters', 'Locations', 'Factions', 'Hazards', 'Scavenge', 'Timeline'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-xl bg-canvas-card border border-canvas-border shadow-parchment-lg p-4 sm:p-6 text-ink">
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-canvas-border">
          <h3 className="text-base sm:text-lg font-serif font-bold text-ink flex items-center gap-2">
            <span>{initialData ? 'Edit Survival Codex Entry' : 'New Survival Codex Entry'}</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-canvas-hover text-ink-muted hover:text-ink transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-3 sm:mt-4">
          <div>
            <label className="block text-xs font-mono text-ink-muted mb-1.5 uppercase font-medium">Category</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`py-2 px-2.5 rounded-lg text-xs font-medium text-center border transition-all flex flex-col items-center gap-1 shadow-xs ${
                    category === cat
                      ? 'bg-brand-50 border-brand-500 text-brand-800 font-semibold'
                      : 'bg-canvas-surface border-canvas-border text-ink-muted hover:border-brand-300'
                  }`}
                >
                  {cat === 'Characters' && <User className="w-4 h-4 text-[#2e4785] dark:text-indigo-400" />}
                  {cat === 'Locations' && <MapPin className="w-4 h-4 text-[#225744] dark:text-teal-400" />}
                  {cat === 'Factions' && <Shield className="w-4 h-4 text-[#913d1e] dark:text-amber-400" />}
                  {cat === 'Hazards' && <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />}
                  {cat === 'Scavenge' && <Package className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                  {cat === 'Timeline' && <Clock className="w-4 h-4 text-[#86294d] dark:text-rose-400" />}
                  <span>
                    {cat === 'Characters'
                      ? 'Survivors'
                      : cat === 'Locations'
                      ? 'Outposts / Ruins'
                      : cat === 'Timeline'
                      ? 'Incidents'
                      : cat}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-ink-muted mb-1 uppercase font-medium">Name / Title (Optional)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Entry name or title (optional)"
              className="w-full px-3 py-2 rounded-lg bg-canvas-card border border-canvas-border text-ink placeholder-ink-faint focus:outline-none focus:border-brand-600 text-sm shadow-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-ink-muted mb-1 uppercase font-medium">Brief Hook / Summary</label>
            <input
              type="text"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Brief reference hook or summary"
              className="w-full px-3 py-2 rounded-lg bg-canvas-card border border-canvas-border text-ink placeholder-ink-faint focus:outline-none focus:border-brand-600 text-sm shadow-xs"
            />
          </div>

          {category === 'Timeline' && (
            <div>
              <label className="block text-xs font-mono text-ink-muted mb-1 uppercase font-medium">Timeline Date / Epoch</label>
              <input
                type="text"
                value={timelineDate}
                onChange={(e) => setTimelineDate(e.target.value)}
                placeholder="Timeline date or epoch"
                className="w-full px-3 py-2 rounded-lg bg-canvas-card border border-canvas-border text-ink placeholder-ink-faint focus:outline-none focus:border-brand-600 text-sm shadow-xs"
              />
            </div>
          )}

          {category === 'Characters' && (
            <div className="p-3.5 rounded-xl bg-canvas-surface/60 border border-canvas-border space-y-3">
              <span className="text-xs font-sans font-semibold text-brand-800 dark:text-brand-300 block uppercase tracking-wider">
                Character Profile Details
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-ink-muted mb-1">Physical Appearance</label>
                  <textarea
                    rows={2}
                    value={appearance}
                    onChange={(e) => setAppearance(e.target.value)}
                    placeholder="Physical appearance..."
                    className="w-full px-2.5 py-1.5 rounded-lg bg-canvas-card border border-canvas-border text-ink placeholder-ink-faint focus:outline-none focus:border-brand-600 text-xs shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-ink-muted mb-1">Voice Quirks & Cadence</label>
                  <textarea
                    rows={2}
                    value={voice}
                    onChange={(e) => setVoice(e.target.value)}
                    placeholder="Voice and speech quirks..."
                    className="w-full px-2.5 py-1.5 rounded-lg bg-canvas-card border border-canvas-border text-ink placeholder-ink-faint focus:outline-none focus:border-brand-600 text-xs shadow-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-ink-muted mb-1">Subconscious Habits & Quirks</label>
                  <textarea
                    rows={2}
                    value={quirks}
                    onChange={(e) => setQuirks(e.target.value)}
                    placeholder="Habits, gestures, mannerisms..."
                    className="w-full px-2.5 py-1.5 rounded-lg bg-canvas-card border border-canvas-border text-ink placeholder-ink-faint focus:outline-none focus:border-brand-600 text-xs shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-ink-muted mb-1">Background Lore</label>
                  <textarea
                    rows={2}
                    value={background}
                    onChange={(e) => setBackground(e.target.value)}
                    placeholder="Background history, allegiance..."
                    className="w-full px-2.5 py-1.5 rounded-lg bg-canvas-card border border-canvas-border text-ink placeholder-ink-faint focus:outline-none focus:border-brand-600 text-xs shadow-xs"
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-mono text-ink-muted mb-1 uppercase font-medium">Tags (comma-separated)</label>
            <input
              type="text"
              value={tagsStr}
              onChange={(e) => setTagsStr(e.target.value)}
              placeholder="Tags (comma-separated)"
              className="w-full px-3 py-2 rounded-lg bg-canvas-card border border-canvas-border text-ink placeholder-ink-faint focus:outline-none focus:border-brand-600 text-sm shadow-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 sm:pt-4 border-t border-canvas-border">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 sm:px-4 py-2 rounded-lg text-sm text-ink-muted hover:text-ink hover:bg-canvas-hover transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 sm:px-5 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm transition-all shadow-sm shadow-brand-600/30 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : 'Save Lore Card'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
