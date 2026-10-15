export type SceneStatus = 'Draft' | 'In Review' | 'Final';
export type ChapterStatus = 'Draft' | 'In Review' | 'Final';
export type NovelStatus = 'Planning' | 'In Progress' | 'First Draft' | 'Revision' | 'Completed';
export type CodexCategory = 'Characters' | 'Locations' | 'Factions' | 'Timeline' | 'Hazards' | 'Scavenge';
export type SaveStatus = 'idle' | 'saving' | 'saved' | 'cached-offline' | 'error';
export type TimelineEra = 'Pre-Collapse' | 'The Fall' | 'Post-Apocalypse' | 'Deep Wasteland';
export type ThreatLevel = 'Low' | 'Elevated' | 'Extreme' | 'Catastrophic';

export interface Novel {
  _id: string;
  title: string;
  subtitle?: string;
  author: string;
  genre: string;
  synopsis: string;
  targetWordCount: number;
  totalWordCount: number;
  coverImage?: string;
  status: NovelStatus;
  chapterCount?: number;
  sceneCount?: number;
  theme?: {
    fontFamily: 'serif' | 'sans' | 'mono';
    lineHeight: 'compact' | 'normal' | 'relaxed';
  };
  invitedReaders?: InvitedReader[];
  isPublished?: boolean;
  publishedAt?: string;
  views?: number;
  rating?: number;
  ratingCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Chapter {
  _id: string;
  novelId: string;
  title: string;
  order: number;
  status: ChapterStatus;
  synopsis?: string;
  totalWordCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface SceneMetadata {
  povCharacter: string;
  inUniverseDate: string;
  objective: string;
  notes: string;
  timelineEra?: TimelineEra;
  threatLevel?: ThreatLevel;
}

export interface Scene {
  _id: string;
  novelId: string;
  chapterId: string;
  title: string;
  order: number;
  contentJson: any;
  plainText: string;
  wordCount: number;
  characterCount?: number;
  status: SceneStatus;
  metadata: SceneMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface CharacterTraits {
  appearance?: string;
  voice?: string;
  quirks?: string;
  background?: string;
  significance?: string;
}

export interface CodexEntry {
  _id: string;
  novelId: string;
  category: CodexCategory;
  name: string;
  summary: string;
  description: string;
  tags: string[];
  traits: CharacterTraits;
  timelineDate?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export type NarrativeTheme = 'apocalyptic' | 'steampunk' | 'dark-fantasy' | 'cyberpunk';

export interface WeeklyWorldThemeData {
  universe: string;
  title: string;
  coverImage: string;
  description: string;
  novelGenre: string;
  novelSynopsis: string;
}

export interface ThreeElementsThemeData {
  novelTitle: string;
  novelGenre: string;
  novelSynopsis: string;
  character: {
    name: string;
    description: string;
    image: string;
  };
  place: {
    name: string;
    description: string;
    image: string;
  };
  world: {
    name: string;
    description: string;
    image: string;
  };
}

export interface NarrativeThemeDefinition {
  id: NarrativeTheme;
  name: string;
  badge: string;
  tagline: string;
  description: string;
  accentColor: string;
  weeklyWorld: WeeklyWorldThemeData;
  threeElements: ThreeElementsThemeData;
}

export interface OnboardingAnswers {
  penName: string;
  preferredTheme: NarrativeTheme;
  writingGoal: string;
  ambiance: string;
}

export interface AuthUser {
  id: string;
  penName: string;
  email?: string;
  avatarUrl?: string;
  googleId?: string;
}

export interface ActivePassage {
  text: string;
  from: number;
  to: number;
  type: 'paragraph' | 'sentence' | 'selection';
  paragraphText?: string;
  paragraphFrom?: number;
  paragraphTo?: number;
}

export interface AiPassageAnalysis {
  tone: string;
  thoughts: string;
  conveys: string;
  pacing: string;
  strengths: string;
  suggestions: string;
}

export interface AiInteractionMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  proposedRewrite?: string;
  timestamp: string;
}

export interface InvitedReader {
  username: string;
  email?: string;
  avatarUrl?: string;
  invitedAt: string;
  status: 'invited' | 'accepted';
  role?: 'reader' | 'beta-reader' | 'editor';
}

export interface LineComment {
  id: string;
  novelId: string;
  chapterId: string;
  lineFrom: number;
  lineTo: number;
  lineText: string;
  authorPenName: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
}

