export interface ProjectCreativeMetrics {
  booksCount: number;
  coversCount: number;
  artworksCount: number;
  webtoonEpisodesCount: number;
  animatedWorksCount: number;
}

export interface CreativeCall {
  discipline: 'writing' | 'cover' | 'art' | 'webtoon' | 'animation';
  title: string;
  description: string;
  urgency?: 'hot' | 'needed' | 'in-progress';
}

export type CreativeDiscipline = 'writing' | 'cover' | 'art' | 'webtoon' | 'animation';

export interface ApprovedCollaborator {
  penName: string;
  role: 'Writer' | 'Cover Designer' | 'Concept Artist' | 'Webtoonist' | 'Animator';
  approvedAt: string;
}

export interface ContributorRequest {
  id: string;
  applicantPenName: string;
  discipline: CreativeDiscipline;
  pitchTitle: string;
  pitchNotes: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'declined';
}

export type ProjectAccessMode = 'approval_required' | 'invite_only' | 'creator_only';

export interface CollaborativeProject {
  id: string;
  name: string;
  universe: string;
  creatorPenName: string; // The sole decision maker
  accessMode: ProjectAccessMode;
  approvedCollaborators: ApprovedCollaborator[];
  pendingRequests: ContributorRequest[];
  tagline: string;
  genre: string;
  bannerImage: string;
  accentColor: string;
  canonRules: string[];
  metrics: ProjectCreativeMetrics;
  creativeCalls: CreativeCall[];
  starterPrompt: {
    hookTitle: string;
    synopsis: string;
    openingParagraph: string;
  };
}

export const COLLABORATIVE_PROJECTS: CollaborativeProject[] = [];
