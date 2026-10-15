import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import type { CreativeDiscipline } from '../../data/collaborativeProjectsData';
import {
  X,
  Globe,
  BookOpen,
  Palette,
  Image as ImageIcon,
  Tv,
  Film,
  ArrowRight,
  ShieldAlert,
  Feather,
  CheckCircle2,
  Lock,
  Crown,
  UserCheck,
  Send,
  Trash2,
  Check,
  Clock,
  Users,
} from 'lucide-react';

export const WriteForProjectModal: React.FC = () => {
  const navigate = useNavigate();
  const isOpen = useWorkspaceStore((s) => s.isWriteForProjectModalOpen);
  const setIsOpen = useWorkspaceStore((s) => s.setIsWriteForProjectModalOpen);
  const penName = useWorkspaceStore((s) => s.penName);
  const collaborativeProjects = useWorkspaceStore((s) => s.collaborativeProjects);
  const writeForProject = useWorkspaceStore((s) => s.writeForProject);
  const submitContributionPitch = useWorkspaceStore((s) => s.submitContributionPitch);
  const approveContributorRequest = useWorkspaceStore((s) => s.approveContributorRequest);
  const declineContributorRequest = useWorkspaceStore((s) => s.declineContributorRequest);
  const removeCollaborator = useWorkspaceStore((s) => s.removeCollaborator);
  const claimProjectAsCreator = useWorkspaceStore((s) => s.claimProjectAsCreator);

  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    collaborativeProjects[0]?.id || ''
  );
  const [activeTab, setActiveTab] = useState<'overview' | 'creator-decisions' | 'request-access'>('overview');
  const [customTitle, setCustomTitle] = useState('');
  const [isStarting, setIsStarting] = useState(false);

  // Contribution pitch form state
  const [pitchDiscipline, setPitchDiscipline] = useState<CreativeDiscipline>('writing');
  const [pitchTitle, setPitchTitle] = useState('');
  const [pitchNotes, setPitchNotes] = useState('');
  const [pitchSuccess, setPitchSuccess] = useState(false);

  if (!isOpen) return null;

  const selectedProject =
    collaborativeProjects.find((p) => p.id === selectedProjectId) ||
    collaborativeProjects[0];

  if (!selectedProject) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
        onClick={() => setIsOpen(false)}
      >
        <div
          className="w-full max-w-lg rounded-2xl bg-canvas-card border border-canvas-border shadow-2xl p-6 sm:p-8 text-center text-ink space-y-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto shadow-xs">
            <Globe className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-serif font-bold text-ink">
            No Collaborative Projects Yet
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted font-sans leading-relaxed">
            Collaborative story universes and shared anthologies will appear here once created or shared by community authors.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-serif font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const userPenNameLower = (penName || '').trim().toLowerCase();
  const creatorPenNameLower = (selectedProject.creatorPenName || '').trim().toLowerCase();
  const isCreator = userPenNameLower === creatorPenNameLower;

  const isApprovedWriter = (selectedProject.approvedCollaborators || []).some(
    (c) => c.penName.trim().toLowerCase() === userPenNameLower && c.role === 'Writer'
  );

  const hasPendingPitch = (selectedProject.pendingRequests || []).some(
    (r) => r.applicantPenName.trim().toLowerCase() === userPenNameLower && r.status === 'pending'
  );

  const canWrite = isCreator || isApprovedWriter;

  const handleStartWriting = async () => {
    if (!canWrite) return;
    setIsStarting(true);
    const success = await writeForProject(selectedProject, customTitle.trim() || undefined);
    if (success) {
      const nid = useWorkspaceStore.getState().activeNovelId;
      if (nid) {
        navigate(`/works/${nid}`);
      }
    }
    setIsStarting(false);
  };

  const handlePitchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pitchTitle.trim()) return;

    submitContributionPitch(selectedProject.id, {
      discipline: pitchDiscipline,
      pitchTitle: pitchTitle.trim(),
      pitchNotes: pitchNotes.trim() || 'No additional notes provided.',
    });

    setPitchTitle('');
    setPitchNotes('');
    setPitchSuccess(true);
    setTimeout(() => setPitchSuccess(false), 4000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="w-full max-w-5xl max-h-[92vh] flex flex-col rounded-2xl bg-canvas-card border border-canvas-border shadow-2xl overflow-hidden text-ink"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-5 sm:px-8 py-5 border-b border-canvas-border bg-gradient-to-r from-canvas-surface via-canvas-card to-canvas-surface flex items-start justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold bg-brand-500/15 text-brand-700 dark:text-brand-300 border border-brand-500/20">
                <Globe className="w-3 h-3 text-brand-600" />
                Collaborative Universe Hub
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                <Lock className="w-3 h-3" />
                Creator-Governed Universes
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-extrabold text-ink tracking-tight">
              One Project • One Shared World
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted font-sans max-w-2xl leading-relaxed">
              Every universe has a dedicated Creator who solely decides who can add novels, design book covers, paint concept art, storyboard webtoons, or animate scenes.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-xl text-ink-muted hover:text-ink hover:bg-canvas-hover border border-transparent hover:border-canvas-border transition-all cursor-pointer flex-shrink-0"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Two columns on desktop */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 min-h-0 divide-y lg:divide-y-0 lg:divide-x divide-canvas-border">
          
          {/* Left Column: Project Selector (5 cols) */}
          <div className="lg:col-span-5 p-4 sm:p-5 space-y-3 overflow-y-auto bg-canvas/40">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-ink-faint font-semibold">
                Select Universe
              </span>
              <span className="text-[11px] font-mono text-brand-600 font-medium">
                {collaborativeProjects.length} Worlds
              </span>
            </div>

            <div className="space-y-2.5">
              {collaborativeProjects.map((project) => {
                const isSelected = selectedProject.id === project.id;
                const isProjCreator = project.creatorPenName.toLowerCase() === userPenNameLower;
                const hasPending = (project.pendingRequests || []).length;

                return (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => {
                      setSelectedProjectId(project.id);
                      setActiveTab('overview');
                      setCustomTitle('');
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer relative overflow-hidden group ${
                      isSelected
                        ? 'bg-canvas-card border-brand-500 shadow-md ring-2 ring-brand-500/20'
                        : 'bg-canvas-card/70 hover:bg-canvas-card border-canvas-border hover:border-brand-500/40 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-16 rounded-lg overflow-hidden border border-canvas-border flex-shrink-0 relative shadow-inner">
                        <img
                          src={project.bannerImage}
                          alt={project.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-brand-600/20 backdrop-blur-[1px] flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-white drop-shadow" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-mono uppercase font-semibold text-brand-700 dark:text-brand-300">
                            {project.genre}
                          </span>
                          {isProjCreator ? (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-semibold flex items-center gap-1">
                              <Crown className="w-2.5 h-2.5" />
                              Creator
                            </span>
                          ) : (
                            <span className="text-[9px] font-mono text-ink-faint truncate">
                              @{project.creatorPenName}
                            </span>
                          )}
                        </div>

                        <h4 className="font-serif font-bold text-sm text-ink truncate group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors">
                          {project.name}
                        </h4>

                        <div className="flex items-center gap-2 pt-1 text-[10px] font-mono text-ink-faint">
                          <span>✍️ {project.metrics.booksCount}</span>
                          <span>•</span>
                          <span>🎨 {project.metrics.coversCount}</span>
                          <span>•</span>
                          <span>🖼️ {project.metrics.artworksCount}</span>
                          <span>•</span>
                          <span>📱 {project.metrics.webtoonEpisodesCount}</span>
                          {isProjCreator && hasPending > 0 && (
                            <span className="ml-auto px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold">
                              {hasPending} new
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick Testing helper to switch role */}
            <div className="pt-2 px-1 text-center">
              <button
                type="button"
                onClick={() => claimProjectAsCreator(selectedProject.id)}
                className="text-[11px] font-mono text-brand-600 hover:text-brand-700 dark:text-brand-400 underline cursor-pointer"
                title="Make current user the creator of this universe to test decision-making"
              >
                {isCreator
                  ? `✓ You are the creator of ${selectedProject.name.split(':')[0]}`
                  : `Claim Creator Sovereignty for "${selectedProject.name.split(':')[0]}" (Test)`}
              </button>
            </div>
          </div>

          {/* Right Column: World Deep-Dive & Action (7 cols) */}
          <div className="lg:col-span-7 p-5 sm:p-6 space-y-5 overflow-y-auto">
            {/* World Banner & Premise */}
            <div className="relative rounded-xl overflow-hidden border border-canvas-border shadow-md">
              <div className="h-28 sm:h-36 w-full relative">
                <img
                  src={selectedProject.bannerImage}
                  alt={selectedProject.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 text-white space-y-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-semibold">
                      {selectedProject.universe}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center gap-1 font-semibold">
                      <Crown className="w-3 h-3 text-amber-300" />
                      Creator: @{selectedProject.creatorPenName}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-lg sm:text-xl drop-shadow-sm">
                    {selectedProject.name}
                  </h3>
                </div>
              </div>

              {/* Navigation Tabs within Project */}
              <div className="px-4 py-2 bg-canvas-surface border-t border-canvas-border flex items-center gap-2 overflow-x-auto text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'overview'
                      ? 'bg-canvas-card text-ink font-bold shadow-xs'
                      : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5 text-brand-600" />
                  <span>Overview & Lore</span>
                </button>

                {isCreator ? (
                  <button
                    type="button"
                    onClick={() => setActiveTab('creator-decisions')}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 relative ${
                      activeTab === 'creator-decisions'
                        ? 'bg-amber-500/20 text-amber-800 dark:text-amber-200 font-bold shadow-xs'
                        : 'text-amber-700 dark:text-amber-400 hover:text-amber-800'
                    }`}
                  >
                    <Crown className="w-3.5 h-3.5 text-amber-600" />
                    <span>Creator Decision Center</span>
                    {(selectedProject.pendingRequests || []).length > 0 && (
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setActiveTab('request-access')}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'request-access'
                        ? 'bg-canvas-card text-ink font-bold shadow-xs'
                        : 'text-ink-muted hover:text-ink'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5 text-brand-600" />
                    <span>Submit Pitch to Creator</span>
                  </button>
                )}
              </div>
            </div>

            {/* TAB 1: OVERVIEW & LORE */}
            {activeTab === 'overview' && (
              <div className="space-y-4">
                {/* Creator Decision Authority Notice */}
                <div className={`p-3.5 rounded-xl border flex items-start gap-3 text-xs ${
                  isCreator
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200'
                    : canWrite
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
                    : 'bg-canvas-surface border-canvas-border text-ink'
                }`}>
                  <div className="p-1.5 rounded-lg bg-canvas-card shadow-xs flex-shrink-0 mt-0.5">
                    {isCreator ? (
                      <Crown className="w-4 h-4 text-amber-600" />
                    ) : canWrite ? (
                      <UserCheck className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Lock className="w-4 h-4 text-amber-600" />
                    )}
                  </div>

                  <div className="space-y-0.5 min-w-0">
                    <div className="font-mono font-bold uppercase tracking-wider text-[11px]">
                      {isCreator
                        ? 'Sole Creator Authority Active'
                        : canWrite
                        ? 'Approved Collaborator Status'
                        : 'Creator Approval Required'}
                    </div>
                    <p className="leading-relaxed text-[11px] text-ink-muted">
                      {isCreator
                        ? 'You are the creator of this project. You hold sole decision authority over who can add books, covers, concept art, webtoons, and animations.'
                        : canWrite
                        ? `You have been approved by @${selectedProject.creatorPenName} as an official Writer for this project.`
                        : `Only @${selectedProject.creatorPenName} can approve new contributors to this project. Submit a pitch below to request writer access.`}
                    </p>
                  </div>
                </div>

                {/* Tagline & Canon Rules */}
                <div className="p-4 rounded-xl bg-canvas-card border border-canvas-border space-y-3">
                  <p className="text-xs sm:text-sm text-ink font-sans leading-relaxed">
                    {selectedProject.tagline}
                  </p>

                  {/* 5-Discipline Collaboration Bar */}
                  <div className="pt-2 border-t border-canvas-border">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-ink-faint font-semibold mb-2">
                      Creative Contributions Across this Universe
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
                      <div className="p-2 rounded-lg bg-canvas-surface border border-canvas-border">
                        <div className="flex items-center justify-center gap-1 text-xs text-brand-600 font-bold">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>{selectedProject.metrics.booksCount}</span>
                        </div>
                        <div className="text-[10px] font-mono text-ink-faint mt-0.5">Novels</div>
                      </div>

                      <div className="p-2 rounded-lg bg-canvas-surface border border-canvas-border">
                        <div className="flex items-center justify-center gap-1 text-xs text-amber-600 font-bold">
                          <Palette className="w-3.5 h-3.5" />
                          <span>{selectedProject.metrics.coversCount}</span>
                        </div>
                        <div className="text-[10px] font-mono text-ink-faint mt-0.5">Covers</div>
                      </div>

                      <div className="p-2 rounded-lg bg-canvas-surface border border-canvas-border">
                        <div className="flex items-center justify-center gap-1 text-xs text-emerald-600 font-bold">
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>{selectedProject.metrics.artworksCount}</span>
                        </div>
                        <div className="text-[10px] font-mono text-ink-faint mt-0.5">Concept Art</div>
                      </div>

                      <div className="p-2 rounded-lg bg-canvas-surface border border-canvas-border">
                        <div className="flex items-center justify-center gap-1 text-xs text-indigo-600 font-bold">
                          <Tv className="w-3.5 h-3.5" />
                          <span>{selectedProject.metrics.webtoonEpisodesCount}</span>
                        </div>
                        <div className="text-[10px] font-mono text-ink-faint mt-0.5">Webtoons</div>
                      </div>

                      <div className="p-2 rounded-lg bg-canvas-surface border border-canvas-border">
                        <div className="flex items-center justify-center gap-1 text-xs text-rose-600 font-bold">
                          <Film className="w-3.5 h-3.5" />
                          <span>{selectedProject.metrics.animatedWorksCount}</span>
                        </div>
                        <div className="text-[10px] font-mono text-ink-faint mt-0.5">Animation</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Canon Rules to Respect */}
                <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-mono text-xs font-semibold uppercase tracking-wider">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Canon Rules & Constraints Enforced by Creator</span>
                  </div>
                  <ul className="space-y-1 text-xs text-ink-muted">
                    {selectedProject.canonRules.map((rule, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Approved Team Roster preview */}
                <div className="p-3.5 rounded-xl bg-canvas-surface border border-canvas-border space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-semibold text-ink flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-brand-600" />
                      Approved Contributor Team ({(selectedProject.approvedCollaborators || []).length})
                    </span>
                    <span className="text-[10px] text-ink-faint">Decided by @{selectedProject.creatorPenName}</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-800 dark:text-amber-200 text-[11px] font-mono font-semibold flex items-center gap-1">
                      <Crown className="w-3 h-3 text-amber-600" />
                      @{selectedProject.creatorPenName} (Architect)
                    </span>
                    {(selectedProject.approvedCollaborators || []).map((c, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-canvas-card border border-canvas-border text-[11px] font-mono text-ink flex items-center gap-1">
                        <span>@{c.penName}</span>
                        <span className="text-[9px] text-brand-700 dark:text-brand-300 font-semibold">({c.role})</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* ACTION: Write or Request Access */}
                {canWrite ? (
                  <div className="pt-2 border-t border-canvas-border space-y-3">
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-faint font-semibold mb-1.5">
                        Your Book Title (Optional)
                      </label>
                      <input
                        type="text"
                        value={customTitle}
                        onChange={(e) => setCustomTitle(e.target.value)}
                        placeholder={`e.g. ${selectedProject.name}: Chronicles`}
                        className="w-full px-3.5 py-2 rounded-xl bg-canvas-card border border-canvas-border text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all font-sans"
                      />
                    </div>

                    <button
                      type="button"
                      disabled={isStarting}
                      onClick={handleStartWriting}
                      className="w-full py-3 px-6 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-serif font-bold text-sm shadow-md shadow-brand-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 group disabled:opacity-60"
                    >
                      <Feather className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                      <span>{isStarting ? 'Initializing Book...' : `Write for ${selectedProject.name.split(':')[0]}`}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-canvas-border space-y-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('request-access')}
                      className="w-full py-3 px-6 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-serif font-bold text-sm shadow-md shadow-amber-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>{hasPendingPitch ? 'View Your Pending Pitch' : `Pitch to Creator (@${selectedProject.creatorPenName}) to Join Project`}</span>
                    </button>
                    <p className="text-[11px] text-ink-faint text-center font-sans">
                      The creator will review your pitch and approve your contributor badge before you can add to this project.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: CREATOR DECISION CENTER (Exclusive to Project Creator) */}
            {activeTab === 'creator-decisions' && isCreator && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                  <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-mono text-xs font-bold uppercase tracking-wider">
                    <Crown className="w-4 h-4" />
                    <span>Creator Governance Panel</span>
                  </div>
                  <p className="text-xs text-ink-muted">
                    As the World Architect, you have sole decision-making authority over all incoming contribution requests. Approve high-quality pitches or decline requests.
                  </p>
                </div>

                {/* Pending Requests */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h5 className="font-mono text-xs uppercase tracking-wider font-semibold text-ink flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Pending Contributor Pitches ({(selectedProject.pendingRequests || []).length})</span>
                    </h5>
                  </div>

                  {(selectedProject.pendingRequests || []).length === 0 ? (
                    <div className="p-6 rounded-xl bg-canvas-card border border-canvas-border text-center text-xs text-ink-muted font-sans">
                      No pending requests. All creative submissions have been reviewed.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedProject.pendingRequests.map((req) => (
                        <div
                          key={req.id}
                          className="p-3.5 rounded-xl bg-canvas-card border border-canvas-border shadow-xs space-y-2.5"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-0.5 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-serif font-bold text-sm text-ink">{req.pitchTitle}</span>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand-500/15 text-brand-700 dark:text-brand-300 uppercase font-semibold">
                                  {req.discipline}
                                </span>
                              </div>
                              <div className="text-[11px] font-mono text-ink-faint">
                                Submitted by <span className="text-brand-600 font-semibold">@{req.applicantPenName}</span> • {req.submittedAt}
                              </div>
                            </div>

                            {/* Creator Decision Actions */}
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              <button
                                type="button"
                                onClick={() => approveContributorRequest(selectedProject.id, req.id)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-semibold flex items-center gap-1 shadow-xs cursor-pointer transition-transform hover:scale-105"
                                title="Approve contributor and grant access"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Approve</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => declineContributorRequest(selectedProject.id, req.id)}
                                className="px-2.5 py-1.5 rounded-lg bg-canvas-surface hover:bg-rose-500/20 text-ink-muted hover:text-rose-600 border border-canvas-border text-xs font-mono cursor-pointer transition-colors"
                                title="Decline request"
                              >
                                <span>Decline</span>
                              </button>
                            </div>
                          </div>

                          <p className="text-xs text-ink-muted font-sans leading-relaxed bg-canvas-surface/60 p-2.5 rounded-lg border border-canvas-border/60">
                            "{req.pitchNotes}"
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Approved Collaborators Roster */}
                <div className="space-y-2 pt-2 border-t border-canvas-border">
                  <h5 className="font-mono text-xs uppercase tracking-wider font-semibold text-ink flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-brand-600" />
                    <span>Approved Creative Roster ({(selectedProject.approvedCollaborators || []).length})</span>
                  </h5>

                  {(selectedProject.approvedCollaborators || []).length === 0 ? (
                    <div className="p-4 rounded-xl bg-canvas-card border border-canvas-border text-xs text-ink-muted text-center font-sans">
                      No collaborators approved yet. You are currently the sole creator.
                    </div>
                  ) : (
                    <div className="divide-y divide-canvas-border rounded-xl bg-canvas-card border border-canvas-border overflow-hidden">
                      {selectedProject.approvedCollaborators.map((c, idx) => (
                        <div key={idx} className="p-2.5 sm:p-3 flex items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="font-mono font-semibold text-ink">@{c.penName}</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-700 dark:text-brand-300 font-semibold">
                              {c.role}
                            </span>
                            <span className="text-[10px] text-ink-faint hidden sm:inline">• Added {c.approvedAt}</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeCollaborator(selectedProject.id, c.penName)}
                            className="p-1.5 rounded-md text-ink-faint hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title={`Revoke @${c.penName}'s access to project`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: SUBMIT PITCH TO CREATOR */}
            {activeTab === 'request-access' && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-brand-500/10 border border-brand-500/20 space-y-1">
                  <div className="flex items-center gap-2 text-brand-800 dark:text-brand-300 font-mono text-xs font-bold uppercase tracking-wider">
                    <Send className="w-4 h-4" />
                    <span>Submit Creative Pitch to @{selectedProject.creatorPenName}</span>
                  </div>
                  <p className="text-xs text-ink-muted">
                    Explain what you want to add to this universe (a novel chapter, a book cover, concept artwork, a webtoon, or an animation). The creator will review and grant permission.
                  </p>
                </div>

                {pitchSuccess && (
                  <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-mono flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Pitch successfully sent to @{selectedProject.creatorPenName} for decision review!</span>
                  </div>
                )}

                <form onSubmit={handlePitchSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-faint font-semibold mb-1">
                      Creative Discipline You Want to Add
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono">
                      {[
                        { id: 'writing', label: '✍️ Novel', desc: 'Book / Chapter' },
                        { id: 'cover', label: '🎨 Cover', desc: 'Dust Jacket' },
                        { id: 'art', label: '🖼️ Art', desc: 'Concept Lore' },
                        { id: 'webtoon', label: '📱 Webtoon', desc: 'Scroll Panels' },
                        { id: 'animation', label: '🎬 Motion', desc: 'Teaser Video' },
                      ].map((track) => (
                        <button
                          key={track.id}
                          type="button"
                          onClick={() => setPitchDiscipline(track.id as CreativeDiscipline)}
                          className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${
                            pitchDiscipline === track.id
                              ? 'bg-brand-500/15 border-brand-500 text-brand-800 dark:text-brand-200 font-bold shadow-xs'
                              : 'bg-canvas-card border-canvas-border text-ink-muted hover:text-ink'
                          }`}
                        >
                          <div className="font-semibold">{track.label}</div>
                          <div className="text-[10px] text-ink-faint mt-0.5">{track.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-faint font-semibold mb-1">
                      Proposed Contribution Title
                    </label>
                    <input
                      type="text"
                      required
                      value={pitchTitle}
                      onChange={(e) => setPitchTitle(e.target.value)}
                      placeholder="e.g. The Smuggler of Silo 104 / Variant Neon Cover"
                      className="w-full px-3.5 py-2 rounded-xl bg-canvas-card border border-canvas-border text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-faint font-semibold mb-1">
                      Pitch Concept & How it Respects World Canon
                    </label>
                    <textarea
                      rows={3}
                      value={pitchNotes}
                      onChange={(e) => setPitchNotes(e.target.value)}
                      placeholder="Describe characters, setting, or visual style that fits the creator's universe..."
                      className="w-full px-3.5 py-2 rounded-xl bg-canvas-card border border-canvas-border text-xs text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all font-sans resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-6 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-serif font-bold text-sm shadow-md shadow-brand-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Pitch to Creator for Decision</span>
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
