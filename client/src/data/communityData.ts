export interface LeaderboardAuthor {
  rank: number;
  author: string;
  title: string;
  genre: string;
  words: number;
  streak: number;
  badge: string;
  avatarColor: string;
  isCurrentUser?: boolean;
}

export interface SharedManuscriptChapter {
  title: string;
  wordCount: number;
  synopsis: string;
}

export interface SharedManuscriptExcerpt {
  chapterTitle: string;
  content: string[];
}

export interface SharedManuscript {
  id: string;
  title: string;
  subtitle?: string;
  author: string;
  authorRank: string;
  genre: string;
  status: 'Completed' | 'In Progress' | 'First Draft' | 'Revision' | 'Planning';
  synopsis: string;
  totalWordCount: number;
  targetWordCount: number;
  chapterCount: number;
  sceneCount: number;
  rating: number;
  spineGradient: string;
  coverImage?: string;
  chapters: SharedManuscriptChapter[];
  sampleExcerpt: SharedManuscriptExcerpt;
}

export const TOP_10_AUTHORS: LeaderboardAuthor[] = [];

export const ZOMBIE_APOCALYPSE_MANUSCRIPTS: SharedManuscript[] = [];

export const SHARED_MANUSCRIPTS: SharedManuscript[] = [];
