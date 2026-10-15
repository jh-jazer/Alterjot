import React, { useState, useEffect, useRef } from 'react';
import { useWorkspaceStore } from '../../../store/useWorkspaceStore';
import { aiService } from '../../../services/aiService';
import type { AiPassageAnalysis, AiInteractionMessage } from '../../../types';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Check,
  Send,
  Flame,
  Eye,
  Scissors,
  Loader2,
  Quote,
  Zap,
  Brain,
  MessageSquare,
  HelpCircle,
  RotateCcw,
  X,
} from 'lucide-react';

export const AiTabContent: React.FC = () => {
  const activePassage = useWorkspaceStore((s) => s.activePassage);
  const setActivePassage = useWorkspaceStore((s) => s.setActivePassage);

  const [analysis, setAnalysis] = useState<AiPassageAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [queryInput, setQueryInput] = useState('');
  const [isProcessingQuery, setIsProcessingQuery] = useState(false);
  const [chatThread, setChatThread] = useState<AiInteractionMessage[]>([]);
  const [approvedToast, setApprovedToast] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Whenever active passage changes, re-run analysis and reset thread
  useEffect(() => {
    if (!activePassage?.text) {
      setAnalysis(null);
      setChatThread([]);
      return;
    }

    let isMounted = true;
    setIsAnalyzing(true);
    setChatThread([]);

    aiService
      .analyzePassage(activePassage.text)
      .then((res) => {
        if (isMounted) {
          setAnalysis(res);
          setIsAnalyzing(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsAnalyzing(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activePassage?.text]);

  const handleSendQuery = async (queryToSend?: string) => {
    const textToSubmit = (queryToSend || queryInput).trim();
    if (!activePassage?.text || !textToSubmit || isProcessingQuery) return;

    const userMsg: AiInteractionMessage = {
      id: 'user-' + Date.now(),
      role: 'user',
      content: textToSubmit,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatThread((prev) => [...prev, userMsg]);
    setQueryInput('');
    setIsProcessingQuery(true);

    try {
      const response = await aiService.respondToQuery(activePassage.text, textToSubmit);
      const aiMsg: AiInteractionMessage = {
        id: 'ai-' + Date.now(),
        role: 'assistant',
        content: response.answer,
        proposedRewrite: response.proposedRewrite,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatThread((prev) => [...prev, aiMsg]);
      setTimeout(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } catch (err) {
      console.error('Failed to process AI query:', err);
    } finally {
      setIsProcessingQuery(false);
    }
  };

  const handleApprove = (rewriteToApply: string) => {
    if (!activePassage || !rewriteToApply) return;

    // Dispatch event to ProseEditor to replace the range in TipTap
    window.dispatchEvent(
      new CustomEvent('alterjot:replace-passage', {
        detail: {
          from: activePassage.from,
          to: activePassage.to,
          newText: rewriteToApply,
        },
      })
    );

    // Celebration confetti
    try {
      confetti({
        particleCount: 28,
        spread: 55,
        origin: { y: 0.6, x: 0.2 },
        colors: ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b'],
      });
    } catch {}

    // Update active passage with the new text
    const newFrom = activePassage.from;
    const newTo = activePassage.from + rewriteToApply.length;
    setActivePassage({
      text: rewriteToApply,
      from: newFrom,
      to: newTo,
      type: activePassage.type,
    });

    setApprovedToast(true);
    setTimeout(() => setApprovedToast(false), 3000);
  };

  const originalWordCount = activePassage?.text ? activePassage.text.trim().split(/\s+/).filter(Boolean).length : 0;

  return (
    <div className="flex flex-col h-full bg-canvas select-none">
      {/* Toast Notification */}
      {approvedToast && (
        <div className="m-3 p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 font-medium animate-in fade-in slide-in-from-top duration-200 shadow-xs">
          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <span>Line successfully replaced in manuscript!</span>
        </div>
      )}

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3.5">
        {/* Empty / Unselected State */}
        {!activePassage?.text ? (
          <div className="p-5 text-center rounded-2xl border border-dashed border-canvas-border bg-canvas-card/50 space-y-2.5 my-2">
            <div className="w-9 h-9 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
              <Sparkles className="w-4 h-4 text-blue-500" />
            </div>
            <h4 className="font-serif font-semibold text-ink text-sm">Select Any Line to Inspect</h4>
            <p className="text-xs text-ink-muted leading-relaxed max-w-xs mx-auto">
              Click any line in your draft or tap the blue margin indicator to activate line-level critique, tone analysis, and instant rewriting.
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-mono text-blue-700 dark:text-blue-300">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                Line-level AI Copilot active
              </span>
            </div>
          </div>
        ) : (
          <>
            {/* Selected Line Preview Card */}
            <div className="p-3 rounded-xl bg-canvas-card border border-canvas-border shadow-xs space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-ink-muted">
                <span className="flex items-center gap-1 font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  <Quote className="w-3 h-3" />
                  Selected Passage
                </span>
                <div className="flex items-center gap-2">
                  <span>{originalWordCount} words</span>
                  <button
                    type="button"
                    onClick={() => setActivePassage(null)}
                    className="text-ink-faint hover:text-ink"
                    title="Clear selected line"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="relative pl-3 border-l-2 border-blue-500/60 dark:border-blue-400/80 italic font-serif text-xs sm:text-sm text-ink leading-relaxed max-h-28 overflow-y-auto">
                "{activePassage.text}"
              </div>
            </div>

            {/* What the AI Thinks of This Line */}
            <div className="p-3.5 rounded-xl bg-canvas-card border border-canvas-border shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-ink flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  AI Analysis & Critique
                </span>
                {isAnalyzing && (
                  <span className="flex items-center gap-1 text-[11px] font-mono text-blue-600 dark:text-blue-400">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Critiquing...
                  </span>
                )}
              </div>

              {isAnalyzing ? (
                <div className="space-y-2 py-2">
                  <div className="h-3.5 bg-canvas-hover rounded-md animate-pulse w-3/4" />
                  <div className="h-3.5 bg-canvas-hover rounded-md animate-pulse w-full" />
                  <div className="h-3.5 bg-canvas-hover rounded-md animate-pulse w-5/6" />
                </div>
              ) : analysis ? (
                <div className="space-y-2.5">
                  <div className="text-xs text-ink leading-relaxed font-sans bg-canvas-subtle/60 p-2.5 rounded-lg border border-canvas-border/70 space-y-2">
                    <p className="font-normal">{analysis.thoughts}</p>
                  </div>

                  {/* Tone & Pacing Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-800 dark:text-blue-300 border border-blue-500/20 text-[10px] font-mono">
                      Tone: {analysis.tone}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20 text-[10px] font-mono">
                      Pacing: {analysis.pacing}
                    </span>
                  </div>

                  {/* Craft Strengths and Suggestions */}
                  <div className="text-[11px] text-ink-muted space-y-1 pt-1 border-t border-canvas-border/60">
                    <p>
                      <strong className="text-ink">Strength:</strong> {analysis.strengths}
                    </p>
                    <p>
                      <strong className="text-ink">Craft Tip:</strong> {analysis.suggestions}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Q&A Thread List */}
            {chatThread.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-mono font-semibold uppercase tracking-wider text-ink px-1">
                  <span className="flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-brand-600" />
                    Line Discussion
                  </span>
                  <button
                    type="button"
                    onClick={() => setChatThread([])}
                    className="text-[10px] text-ink-faint hover:text-ink cursor-pointer flex items-center gap-1"
                    title="Clear discussion"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    Clear
                  </button>
                </div>

                {chatThread.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-xl text-xs leading-relaxed transition-all ${
                      msg.role === 'user'
                        ? 'bg-canvas-subtle border border-canvas-border text-ink ml-3'
                        : 'bg-canvas-card border border-canvas-border shadow-xs text-ink space-y-2'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-[10px] text-ink-faint mb-1">
                      <span className="font-semibold text-ink-muted">
                        {msg.role === 'user' ? 'You asked:' : 'AI Answer:'}
                      </span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <p className="whitespace-pre-wrap">{msg.content}</p>

                    {/* Proposed rewrite card */}
                    {msg.proposedRewrite && (
                      <div className="mt-2.5 pt-2 border-t border-canvas-border/60 space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                          <span className="flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            Proposed Revision
                          </span>
                          <span>
                            {msg.proposedRewrite.split(/\s+/).length} words
                          </span>
                        </div>

                        <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 font-serif text-xs text-ink leading-relaxed">
                          "{msg.proposedRewrite}"
                        </div>

                        <button
                          type="button"
                          onClick={() => handleApprove(msg.proposedRewrite!)}
                          className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-semibold transition-all shadow-xs cursor-pointer active:scale-98"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Approve & Replace in Manuscript</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={chatBottomRef} />
              </div>
            )}

            {/* Ask or Instruct Section */}
            <div className="p-3.5 rounded-xl bg-canvas-card border border-canvas-border shadow-xs space-y-2.5">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-ink flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                Ask Anything or Instruct Rewrite
              </span>

              {/* Quick Directive Chips */}
              <div className="flex flex-wrap gap-1">
                <button
                  type="button"
                  onClick={() => handleSendQuery('How might readers interpret or feel about this line?')}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-canvas-subtle hover:bg-canvas-hover border border-canvas-border text-[10px] font-mono text-ink transition-colors cursor-pointer"
                >
                  <Eye className="w-3 h-3 text-blue-500" />
                  Reader reaction?
                </button>

                <button
                  type="button"
                  onClick={() => handleSendQuery('What does this reveal about the character’s voice?')}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-canvas-subtle hover:bg-canvas-hover border border-canvas-border text-[10px] font-mono text-ink transition-colors cursor-pointer"
                >
                  <Brain className="w-3 h-3 text-purple-500" />
                  Character voice?
                </button>

                <button
                  type="button"
                  onClick={() => handleSendQuery('How can I heighten the tension and simmering dread in this line?')}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-canvas-subtle hover:bg-canvas-hover border border-canvas-border text-[10px] font-mono text-ink transition-colors cursor-pointer"
                >
                  <Flame className="w-3 h-3 text-red-500" />
                  Heighten Tension
                </button>

                <button
                  type="button"
                  onClick={() => handleSendQuery('Show, don’t tell with physical involuntary details')}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-canvas-subtle hover:bg-canvas-hover border border-canvas-border text-[10px] font-mono text-ink transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  Show, Don't Tell
                </button>

                <button
                  type="button"
                  onClick={() => handleSendQuery('Make this line tighter, punchier, and cut filler')}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-canvas-subtle hover:bg-canvas-hover border border-canvas-border text-[10px] font-mono text-ink transition-colors cursor-pointer"
                >
                  <Scissors className="w-3 h-3 text-emerald-500" />
                  Punchier
                </button>
              </div>

              {/* Custom Query Textarea */}
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  rows={2}
                  value={queryInput}
                  onChange={(e) => setQueryInput(e.target.value)}
                  onKeyDown={(e) => {
                    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                      e.preventDefault();
                      handleSendQuery();
                    }
                  }}
                  placeholder="Ask a question or instruct rewrite..."
                  className="w-full p-2 pr-9 rounded-lg bg-canvas border border-canvas-border text-xs text-ink placeholder:text-ink-faint focus:outline-none focus:border-blue-500 transition-colors resize-none shadow-xs"
                />

                <button
                  type="button"
                  onClick={() => handleSendQuery()}
                  disabled={isProcessingQuery || !queryInput.trim()}
                  className={`absolute right-2 bottom-2.5 p-1 rounded-md transition-all ${
                    queryInput.trim() && !isProcessingQuery
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer'
                      : 'bg-canvas-hover text-ink-faint cursor-not-allowed opacity-50'
                  }`}
                  title="Send (Ctrl+Enter)"
                >
                  {isProcessingQuery ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-ink-muted">
                <span>Ctrl+Enter to send</span>
                <span>Copilot v1.0</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
