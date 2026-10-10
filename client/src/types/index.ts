export type SceneStatus = 'Draft' | 'In Review' | 'Final';
export type ChapterStatus = 'Draft' | 'In Review' | 'Final';
export type NovelStatus = 'Planning' | 'In Progress' | 'First Draft' | 'Revision' | 'Completed';
export type CodexCategory = 'Characters' | 'Locations' | 'Factions' | 'Timeline';
export type SaveStatus = 'idle' | 'saving' | 'saved' | 'cached-offline' | 'error';

export interface Novel {
  _id: string;
  title: string;
  subtitle?: string;
  author: string;
  genre: string;
  synopsis: string;
  targetWordCount: number;
  totalWordCount: number;
  status: NovelStatus;
  chapterCount?: number;
  sceneCount?: number;
  theme?: {
    fontFamily: 'serif' | 'sans' | 'mono';
    lineHeight: 'compact' | 'normal' | 'relaxed';
  };
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
}
