import React, { useState, useEffect, useRef } from 'react';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import {
  User,
  Bell,
  Settings,
  ChevronRight,
  ArrowLeft,
  LogOut,
  Check,
  Feather,
  FileText,
  BookOpen,
  Flame,
  Trophy,
  Clock,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  CheckCheck,
  Sparkles,
  Zap,
} from 'lucide-react';

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  align?: 'right' | 'left';
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'challenge' | 'streak' | 'milestone' | 'shelf';
}

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'World Challenge Active',
    message: 'Scorched Dust universe is live! Submit your narrative entry in the Playground.',
    time: '15m ago',
    read: false,
    type: 'challenge',
  },
  {
    id: 'notif-2',
    title: '3-Day Writing Streak',
    message: "You're writing consistently! Keep your fire alive with today's sprint.",
    time: '2h ago',
    read: false,
    type: 'streak',
  },
  {
    id: 'notif-3',
    title: 'Manuscript Milestone',
    message: 'Great progress on your active scenes! Keep up the creative momentum.',
    time: '1d ago',
    read: true,
    type: 'milestone',
  },
  {
    id: 'notif-4',
    title: 'Reader Reaction on Shelf',
    message: 'Another author explored your shared manuscript on the public shelf.',
    time: '2d ago',
    read: true,
    type: 'shelf',
  },
];

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  isOpen,
  onClose,
  align = 'right',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Store bindings
  const penName = useWorkspaceStore((s) => s.penName);
  const setPenName = useWorkspaceStore((s) => s.setPenName);
  const currentUser = useWorkspaceStore((s) => s.currentUser);
  const logout = useWorkspaceStore((s) => s.logout);
  const novels = useWorkspaceStore((s) => s.novels);
  const scenes = useWorkspaceStore((s) => s.scenes);
  const theme = useWorkspaceStore((s) => s.theme);
  const toggleTheme = useWorkspaceStore((s) => s.toggleTheme);
  const typography = useWorkspaceStore((s) => s.typography);
  const setTypography = useWorkspaceStore((s) => s.setTypography);

  // View state: 'menu' (root list of Profile, Notifications, Settings) or specific section
  const [activeView, setActiveView] = useState<'menu' | 'profile' | 'notifications' | 'settings'>('menu');

  // Pen name form state
  const [tempPenName, setTempPenName] = useState(penName);
  const [penNameSavedToast, setPenNameSavedToast] = useState(false);

  // Notifications state
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem('alterjot_notifications_data');
      return saved ? JSON.parse(saved) : DEFAULT_NOTIFICATIONS;
    } catch {
      return DEFAULT_NOTIFICATIONS;
    }
  });

  // Settings state persisted in localStorage
  const [dailyGoal, setDailyGoal] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('alterjot_daily_word_goal')) || 500;
    } catch {
      return 500;
    }
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem('alterjot_sound_effects') !== 'false';
    } catch {
      return true;
    }
  });

  const [autoSaveFreq, setAutoSaveFreq] = useState<'instant' | '30s' | '60s'>(() => {
    try {
      return (localStorage.getItem('alterjot_autosave_freq') as any) || '30s';
    } catch {
      return '30s';
    }
  });

  // Notification preferences
  const [notifSprintAlarm, setNotifSprintAlarm] = useState(true);
  const [notifDailyReminder, setNotifDailyReminder] = useState(true);

  // Synchronize pen name on open or change
  useEffect(() => {
    setTempPenName(penName);
  }, [penName, isOpen]);

  // Reset to menu view when freshly opened
  useEffect(() => {
    if (isOpen) {
      setActiveView('menu');
      setPenNameSavedToast(false);
    }
  }, [isOpen]);

  // Click outside and escape handling
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Save notifications to localStorage
  const saveNotifications = (items: NotificationItem[]) => {
    setNotifications(items);
    try {
      localStorage.setItem('alterjot_notifications_data', JSON.stringify(items));
    } catch {}
  };

  const markAllNotificationsAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    saveNotifications(updated);
  };

  const toggleNotificationRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: !n.read } : n));
    saveNotifications(updated);
  };

  // Currencies calculation
  const currencyWords = novels.reduce((acc, n) => acc + (n.totalWordCount || 0), 0);
  const sentenceMatches = scenes.reduce((acc, s) => {
    const text = s.plainText || '';
    const match = text.match(/[^.!?]+[.!?]+(\s|$)/g);
    return acc + (match ? match.length : 0);
  }, 0);
  const currencySentences = Math.max(sentenceMatches, Math.floor(currencyWords / 15));
  const currencyChapters = novels.reduce((acc, n) => acc + (n.chapterCount || 1), 0);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleSavePenName = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const finalPenName = tempPenName.trim() || 'Ernest Quill';
    setPenName(finalPenName);
    setPenNameSavedToast(true);
    setTimeout(() => {
      setPenNameSavedToast(false);
    }, 2500);
  };

  const handleSaveDailyGoal = (goal: number) => {
    setDailyGoal(goal);
    try {
      localStorage.setItem('alterjot_daily_word_goal', String(goal));
    } catch {}
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    try {
      localStorage.setItem('alterjot_sound_effects', String(next));
    } catch {}
  };

  const handleSetAutoSave = (freq: 'instant' | '30s' | '60s') => {
    setAutoSaveFreq(freq);
    try {
      localStorage.setItem('alterjot_autosave_freq', freq);
    } catch {}
  };

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className={`absolute ${
        align === 'right' ? 'right-0' : 'left-0'
      } mt-2 w-84 sm:w-[350px] max-w-[calc(100vw-24px)] rounded-2xl bg-canvas-card border border-canvas-border shadow-parchment-lg z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-ink select-none`}
    >
      {/* 1. ROOT MENU VIEW: User sees Profile, Notifications, Settings */}
      {activeView === 'menu' && (
        <div className="p-3.5 space-y-3">
          {/* Author Header Card */}
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-canvas-surface border border-canvas-border">
            <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-800 dark:bg-brand-600/30 dark:text-brand-300 flex items-center justify-center font-serif text-sm font-bold shadow-xs overflow-hidden flex-shrink-0">
              {currentUser?.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt={penName} className="w-full h-full object-cover" />
              ) : (
                <User className="w-5 h-5" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-serif font-bold text-ink truncate">{penName}</span>
                <span className="inline-flex items-center px-1.5 py-0.2 rounded-md bg-brand-500/10 text-brand-700 dark:text-brand-300 text-[9px] font-mono font-semibold">
                  Scribe
                </span>
              </div>
              <div className="text-[11px] font-mono text-ink-muted truncate">
                {currentUser?.email || 'Author Account'}
              </div>
            </div>
          </div>

          {/* Three Core Menu Items: Profile, Notifications, Settings */}
          <div className="space-y-1 pt-1">
            {/* 1. Profile Option */}
            <button
              type="button"
              onClick={() => setActiveView('profile')}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-canvas-hover border border-transparent hover:border-canvas-border transition-all group text-left cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-600/20 dark:text-brand-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <User className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-serif font-semibold text-ink group-hover:text-brand-700 dark:group-hover:text-brand-400 transition-colors">
                    Profile
                  </div>
                  <div className="text-[10px] text-ink-muted truncate">
                    Pen name, author ID & Atelier vault
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-ink-muted group-hover:text-ink group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </button>

            {/* 2. Notifications Option */}
            <button
              type="button"
              onClick={() => setActiveView('notifications')}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-canvas-hover border border-transparent hover:border-canvas-border transition-all group text-left cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform relative">
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-serif font-semibold text-ink group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                    Notifications
                  </div>
                  <div className="text-[10px] text-ink-muted truncate">
                    Challenges, writing streaks & alerts
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 font-mono font-bold text-[10px]">
                    {unreadCount} new
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-ink-muted group-hover:text-ink group-hover:translate-x-0.5 transition-all" />
              </div>
            </button>

            {/* 3. Settings Option */}
            <button
              type="button"
              onClick={() => setActiveView('settings')}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-canvas-hover border border-transparent hover:border-canvas-border transition-all group text-left cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Settings className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-serif font-semibold text-ink group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">
                    Settings
                  </div>
                  <div className="text-[10px] text-ink-muted truncate">
                    Writing goals, typography, theme & sound
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-ink-muted group-hover:text-ink group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </button>
          </div>

          {/* Sign Out Button */}
          <div className="pt-2 border-t border-canvas-border flex items-center justify-between">
            <span className="text-[10px] font-mono text-ink-muted">Logged in as Scribe</span>
            <button
              type="button"
              onClick={() => {
                onClose();
                logout();
              }}
              className="flex items-center gap-1.5 text-xs font-mono text-rose-600 dark:text-rose-400 hover:text-rose-700 py-1 px-2.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. SUB-VIEW HEADER WITH BACK BUTTON & SECTION TABS */}
      {activeView !== 'menu' && (
        <div className="border-b border-canvas-border bg-canvas-surface/70 px-3 py-2.5 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setActiveView('menu')}
            className="flex items-center gap-1 text-xs font-mono text-ink-muted hover:text-ink py-1 px-1.5 rounded-lg hover:bg-canvas-hover transition-colors cursor-pointer"
            title="Return to Menu"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Menu</span>
          </button>

          {/* Quick Segmented Tabs between Profile, Notifications, Settings */}
          <div className="flex items-center bg-canvas-card p-0.5 rounded-lg border border-canvas-border text-[10px] font-mono">
            <button
              type="button"
              onClick={() => setActiveView('profile')}
              className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                activeView === 'profile'
                  ? 'bg-brand-600 text-white font-bold shadow-xs'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              Profile
            </button>
            <button
              type="button"
              onClick={() => setActiveView('notifications')}
              className={`px-2 py-1 rounded-md transition-all cursor-pointer relative ${
                activeView === 'notifications'
                  ? 'bg-brand-600 text-white font-bold shadow-xs'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              Alerts
              {unreadCount > 0 && (
                <span className="inline-block w-1.5 h-1.5 bg-amber-400 rounded-full ml-1" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveView('settings')}
              className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                activeView === 'settings'
                  ? 'bg-brand-600 text-white font-bold shadow-xs'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              Settings
            </button>
          </div>
        </div>
      )}

      {/* 3. PROFILE SUB-VIEW (CHANGING PEN NAME IS UNDER PROFILE) */}
      {activeView === 'profile' && (
        <div className="p-3.5 space-y-3.5 max-h-[75vh] overflow-y-auto">
          {/* Identity Header */}
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-canvas-surface border border-canvas-border">
            <div className="w-11 h-11 rounded-full bg-brand-100 text-brand-800 dark:bg-brand-600/30 dark:text-brand-300 flex items-center justify-center font-serif text-sm font-bold shadow-xs overflow-hidden flex-shrink-0">
              {currentUser?.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt={penName} className="w-full h-full object-cover" />
              ) : (
                <User className="w-5 h-5" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-serif font-bold text-ink truncate">{penName}</div>
              <div className="text-[10px] font-mono text-ink-muted truncate">
                {currentUser?.email || 'Registered Author'}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[9px] font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Active Scribe
                </span>
              </div>
            </div>
          </div>

          {/* CHANGING PEN NAME IS LOCATED UNDER PROFILE */}
          <div className="p-3 rounded-xl bg-canvas-surface border border-canvas-border space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-mono uppercase tracking-wider text-ink-faint font-semibold flex items-center gap-1">
                <Feather className="w-3 h-3 text-brand-600" />
                <span>Change Pen Name</span>
              </label>
              {penNameSavedToast && (
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-in fade-in">
                  <Check className="w-3 h-3" /> Saved!
                </span>
              )}
            </div>

            <form onSubmit={handleSavePenName} className="flex items-center gap-1.5">
              <input
                type="text"
                value={tempPenName}
                onChange={(e) => setTempPenName(e.target.value)}
                className="flex-1 px-2.5 py-1.5 text-xs font-serif rounded-lg bg-canvas-card border border-canvas-border focus:border-brand-500 focus:outline-none text-ink shadow-xs"
                placeholder="Enter pen name"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-mono font-medium transition-all hover:scale-102 active:scale-98 cursor-pointer flex-shrink-0"
              >
                Save
              </button>
            </form>
            <p className="text-[10px] text-ink-muted font-sans leading-tight">
              Your pen name is visible on published manuscripts, leaderboard rankings, and the community shelf.
            </p>
          </div>

          {/* Atelier Vault Currencies */}
          <div className="p-3 rounded-xl bg-canvas-surface border border-canvas-border space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-ink-faint font-semibold">
              <span>Atelier Vault</span>
              <span className="text-brand-600 font-bold">Currencies</span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 text-center">
              {/* Words */}
              <div
                className="p-2 rounded-lg bg-canvas-card border border-canvas-border flex flex-col items-center justify-center shadow-xs"
                title="Common Currency: 1 per word written"
              >
                <div className="w-5 h-5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-1">
                  <Feather className="w-3 h-3" />
                </div>
                <span className="text-xs font-mono font-bold text-ink truncate w-full">
                  {currencyWords.toLocaleString()}
                </span>
                <span className="text-[9px] font-mono text-ink-muted uppercase tracking-tight mt-0.5">
                  Words
                </span>
              </div>

              {/* Sentences */}
              <div
                className="p-2 rounded-lg bg-canvas-card border border-canvas-border flex flex-col items-center justify-center shadow-xs"
                title="Sentence Currency: 1 per sentence written"
              >
                <div className="w-5 h-5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-1">
                  <FileText className="w-3 h-3" />
                </div>
                <span className="text-xs font-mono font-bold text-ink truncate w-full">
                  {currencySentences.toLocaleString()}
                </span>
                <span className="text-[9px] font-mono text-ink-muted uppercase tracking-tight mt-0.5">
                  Sentences
                </span>
              </div>

              {/* Chapters */}
              <div
                className="p-2 rounded-lg bg-canvas-card border border-canvas-border flex flex-col items-center justify-center shadow-xs"
                title="Chapter Currency: 1 per chapter drafted"
              >
                <div className="w-5 h-5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-1">
                  <BookOpen className="w-3 h-3" />
                </div>
                <span className="text-xs font-mono font-bold text-ink truncate w-full">
                  {currencyChapters.toLocaleString()}
                </span>
                <span className="text-[9px] font-mono text-ink-muted uppercase tracking-tight mt-0.5">
                  Chapters
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. NOTIFICATIONS SUB-VIEW */}
      {activeView === 'notifications' && (
        <div className="p-3.5 space-y-3 max-h-[75vh] overflow-y-auto">
          {/* Header Action */}
          <div className="flex items-center justify-between pb-1 border-b border-canvas-border">
            <span className="text-[11px] font-mono font-bold text-ink flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-amber-600" />
              <span>Activity & Alerts</span>
            </span>
            {unreadCount > 0 ? (
              <button
                type="button"
                onClick={markAllNotificationsAsRead}
                className="text-[10px] font-mono text-brand-600 hover:text-brand-700 dark:text-brand-400 font-medium flex items-center gap-1 hover:underline cursor-pointer"
              >
                <CheckCheck className="w-3 h-3" />
                <span>Mark all read</span>
              </button>
            ) : (
              <span className="text-[10px] font-mono text-ink-faint">All caught up</span>
            )}
          </div>

          {/* Notifications Feed */}
          <div className="space-y-1.5">
            {notifications.map((item) => {
              const iconMap = {
                challenge: <Trophy className="w-3.5 h-3.5 text-amber-600" />,
                streak: <Flame className="w-3.5 h-3.5 text-orange-600" />,
                milestone: <Zap className="w-3.5 h-3.5 text-indigo-600" />,
                shelf: <BookOpen className="w-3.5 h-3.5 text-emerald-600" />,
              };

              return (
                <div
                  key={item.id}
                  onClick={() => toggleNotificationRead(item.id)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                    item.read
                      ? 'bg-canvas-card/60 border-canvas-border/80 opacity-75 hover:opacity-100'
                      : 'bg-canvas-surface border-brand-500/30 shadow-xs'
                  }`}
                >
                  <div className="p-1.5 rounded-lg bg-canvas-card border border-canvas-border flex-shrink-0 mt-0.5">
                    {iconMap[item.type] || <Sparkles className="w-3.5 h-3.5 text-brand-600" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h5 className="text-xs font-serif font-bold text-ink truncate">{item.title}</h5>
                      <span className="text-[9px] font-mono text-ink-muted flex-shrink-0">{item.time}</span>
                    </div>
                    <p className="text-[11px] text-ink-muted font-sans mt-0.5 leading-relaxed">
                      {item.message}
                    </p>
                  </div>
                  {!item.read && (
                    <span className="w-2 h-2 rounded-full bg-brand-600 flex-shrink-0 mt-1" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Notification Preferences */}
          <div className="p-3 rounded-xl bg-canvas-surface border border-canvas-border space-y-2 pt-2.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-ink-faint font-semibold block">
              Preferences
            </span>
            <div className="space-y-1.5">
              <label className="flex items-center justify-between text-xs font-serif text-ink cursor-pointer">
                <span>Playground sprint countdown alarms</span>
                <input
                  type="checkbox"
                  checked={notifSprintAlarm}
                  onChange={(e) => setNotifSprintAlarm(e.target.checked)}
                  className="rounded border-canvas-border text-brand-600 focus:ring-brand-500/20"
                />
              </label>
              <label className="flex items-center justify-between text-xs font-serif text-ink cursor-pointer">
                <span>Daily writing streak reminder</span>
                <input
                  type="checkbox"
                  checked={notifDailyReminder}
                  onChange={(e) => setNotifDailyReminder(e.target.checked)}
                  className="rounded border-canvas-border text-brand-600 focus:ring-brand-500/20"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* 5. SETTINGS SUB-VIEW */}
      {activeView === 'settings' && (
        <div className="p-3.5 space-y-3.5 max-h-[75vh] overflow-y-auto">
          {/* Writing Goals */}
          <div className="p-3 rounded-xl bg-canvas-surface border border-canvas-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-ink-faint font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3 text-indigo-600" />
                <span>Daily Word Goal</span>
              </span>
              <span className="text-xs font-mono font-bold text-brand-700 dark:text-brand-300">
                {dailyGoal.toLocaleString()} words
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1 pt-1">
              {[300, 500, 1000, 2000].map((goal) => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => handleSaveDailyGoal(goal)}
                  className={`py-1 px-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                    dailyGoal === goal
                      ? 'bg-brand-600 text-white font-bold shadow-xs'
                      : 'bg-canvas-card border border-canvas-border text-ink-muted hover:text-ink'
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>

          {/* Auto-Save & Sound Preferences */}
          <div className="p-3 rounded-xl bg-canvas-surface border border-canvas-border space-y-2.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-ink-faint font-semibold block">
              Workspace Behaviors
            </span>

            {/* Sound Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <VolumeX className="w-4 h-4 text-ink-muted" />
                )}
                <div>
                  <div className="text-xs font-serif font-medium text-ink">Typewriter & Sprint Audio</div>
                  <div className="text-[10px] text-ink-muted">Play acoustic audio feedback</div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleToggleSound}
                className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                  soundEnabled ? 'bg-brand-600' : 'bg-neutral-300 dark:bg-neutral-700'
                }`}
              >
                <span
                  className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.75 transition-transform ${
                    soundEnabled ? 'left-4.5' : 'left-0.75'
                  }`}
                />
              </button>
            </div>

            {/* Auto-Save Frequency */}
            <div className="flex items-center justify-between pt-1 border-t border-canvas-border">
              <span className="text-xs font-serif text-ink">Auto-Save Frequency</span>
              <div className="flex items-center gap-1 text-[10px] font-mono">
                {(['instant', '30s', '60s'] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => handleSetAutoSave(f)}
                    className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                      autoSaveFreq === f
                        ? 'bg-brand-600 text-white font-bold'
                        : 'bg-canvas-card border border-canvas-border text-ink-muted hover:text-ink'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Typography Preference */}
          <div className="p-3 rounded-xl bg-canvas-surface border border-canvas-border space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-ink-faint font-semibold block">
              Default Editor Font
            </span>
            <div className="grid grid-cols-4 gap-1 text-[10px] font-mono">
              {(['serif', 'sans', 'typewriter', 'mono'] as const).map((font) => (
                <button
                  key={font}
                  type="button"
                  onClick={() => setTypography({ fontFamily: font })}
                  className={`py-1 px-1 rounded-lg capitalize transition-all cursor-pointer ${
                    typography.fontFamily === font
                      ? 'bg-brand-600 text-white font-bold shadow-xs'
                      : 'bg-canvas-card border border-canvas-border text-ink-muted hover:text-ink'
                  }`}
                >
                  {font}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Switcher */}
          <div className="p-3 rounded-xl bg-canvas-surface border border-canvas-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              {theme === 'light' ? (
                <Sun className="w-4 h-4 text-amber-600" />
              ) : (
                <Moon className="w-4 h-4 text-brand-300" />
              )}
              <div>
                <div className="text-xs font-serif font-medium text-ink">Narrative Theme</div>
                <div className="text-[10px] text-ink-muted font-mono">
                  {theme === 'light' ? 'Retro Light Mode' : 'Nocturne Dark Mode'}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => toggleTheme(e)}
              className="px-2.5 py-1 rounded-lg bg-canvas-card border border-canvas-border text-xs font-mono text-ink hover:border-brand-500 transition-all cursor-pointer shadow-xs"
            >
              Toggle
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
