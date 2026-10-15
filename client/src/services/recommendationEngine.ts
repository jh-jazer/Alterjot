import type { Novel, Scene, CodexEntry, NarrativeTheme } from '../types';

interface ThemeKeywordProfile {
  theme: NarrativeTheme;
  genres: string[];
  keywords: string[];
}

export const MOST_POPULAR_THEME: NarrativeTheme = 'apocalyptic';

const THEME_PROFILES: ThemeKeywordProfile[] = [
  {
    theme: 'apocalyptic',
    genres: ['apocalyptic', 'post-apocalyptic', 'survival', 'dystopia', 'thriller', 'speculative fiction', 'military', 'collapse'],
    keywords: [
      'wasteland', 'bunker', 'shelter', 'ruin', 'fallout', 'scavenger', 'radiation',
      'survivor', 'ash', 'outbreak', 'collapse', 'rations', 'decay', 'quarantine',
      'perimeter', 'dust', 'desolation', 'scarcity', 'convoy', 'winter', 'geiger', 'transmission'
    ],
  },
  {
    theme: 'dark-fantasy',
    genres: ['fantasy', 'dark fantasy', 'epic fantasy', 'mythology', 'gothic', 'horror', 'paranormal', 'sword and sorcery'],
    keywords: [
      'magic', 'dragon', 'spell', 'curse', 'kingdom', 'knight', 'castle', 'shadow',
      'sword', 'witch', 'demon', 'ancient', 'elf', 'sorcerer', 'prophecy', 'beast',
      'grimoire', 'rune', 'blood', 'ritual', 'monarch', 'temple', 'relic'
    ],
  },
  {
    theme: 'cyberpunk',
    genres: ['cyberpunk', 'sci-fi', 'science fiction', 'space opera', 'dystopian', 'techno-thriller', 'futuristic', 'ai'],
    keywords: [
      'neon', 'cyber', 'tech', 'network', 'hacker', 'matrix', 'neural', 'android',
      'ai', 'implant', 'corp', 'terminal', 'virtual', 'satellite', 'data', 'protocol',
      'glitch', 'cybernetic', 'drone', 'megacity', 'quantum', 'algorithm', 'code'
    ],
  },
  {
    theme: 'steampunk',
    genres: ['steampunk', 'victorian', 'historical', 'alternate history', 'mystery', 'gaslamp', 'industrial', 'detective'],
    keywords: [
      'steam', 'gear', 'clockwork', 'brass', 'airship', 'zeppelin', 'boiler', 'victorian',
      'detective', 'inspector', 'corset', 'machinery', 'goggles', 'inventor', 'locomotive',
      'alchemy', 'copper', 'piston', 'chronometer', 'laboratory', 'workshop'
    ],
  },
];

export interface RecommendationResult {
  theme: NarrativeTheme;
  affinityScore?: number;
  badgeLabel: string;
  reason: string;
  isPopular: boolean;
}

/**
 * Intelligent recommendation algorithm:
 * - If not signed in yet: serves the #1 Most Popular spotlight universe.
 * - If signed in: analyzes manuscripts, genres, and lore to predict what they like.
 */
export function calculateRecommendedTheme(
  novels: Novel[],
  scenes: Scene[] = [],
  codexEntries: CodexEntry[] = [],
  fallbackTheme: NarrativeTheme = 'apocalyptic',
  isAuthenticated = false
): RecommendationResult {
  // If not signed in yet: Show the signature apocalyptic universe
  if (!isAuthenticated) {
    return {
      theme: MOST_POPULAR_THEME,
      badgeLabel: 'Featured Story',
      isPopular: true,
      reason: 'Trending #1 story across Alterjot',
    };
  }

  // Score accumulator for each universe theme
  const scores: Record<NarrativeTheme, number> = {
    'dark-fantasy': 0,
    cyberpunk: 0,
    steampunk: 0,
    apocalyptic: 0,
  };

  let analyzedItemsCount = 0;

  // 1. Analyze Novel genres, titles, and synopses
  novels.forEach((novel) => {
    analyzedItemsCount++;
    const genreText = (novel.genre || '').toLowerCase();
    const titleText = (novel.title || '').toLowerCase();
    const synopsisText = (novel.synopsis || '').toLowerCase();
    const combinedNovelText = `${genreText} ${titleText} ${synopsisText}`;

    THEME_PROFILES.forEach(({ theme, genres, keywords }) => {
      // Strong weight for genre matches (6 points)
      genres.forEach((g) => {
        if (genreText.includes(g)) scores[theme] += 6;
      });

      // Keywords in novel synopsis & title (2 points)
      keywords.forEach((kw) => {
        if (combinedNovelText.includes(kw)) scores[theme] += 2;
      });
    });
  });

  // 2. Analyze Codex entries (lore, characters, traits)
  codexEntries.forEach((entry) => {
    analyzedItemsCount++;
    const codexText = `${entry.name} ${entry.summary} ${entry.description} ${(entry.tags || []).join(' ')}`.toLowerCase();

    THEME_PROFILES.forEach(({ theme, keywords }) => {
      keywords.forEach((kw) => {
        if (codexText.includes(kw)) scores[theme] += 1.5;
      });
    });
  });

  // 3. Analyze Scene plain texts sample (first 500 chars of recent scenes)
  scenes.slice(-10).forEach((scene) => {
    const textSnippet = (scene.plainText || '').slice(0, 500).toLowerCase();
    if (!textSnippet) return;
    analyzedItemsCount++;

    THEME_PROFILES.forEach(({ theme, keywords }) => {
      keywords.forEach((kw) => {
        if (textSnippet.includes(kw)) scores[theme] += 1;
      });
    });
  });

  // 4. Find theme with highest algorithmic score
  const sortedThemes = (Object.keys(scores) as NarrativeTheme[]).sort(
    (a, b) => scores[b] - scores[a]
  );

  const topTheme = sortedThemes[0];
  const topScore = scores[topTheme];

  const themeDisplayNames: Record<NarrativeTheme, string> = {
    'dark-fantasy': 'Dark Fantasy & Mythic Lore',
    cyberpunk: 'Cyberpunk & Futuristic Sci-Fi',
    steampunk: 'Steampunk & Industrial Victoriana',
    apocalyptic: 'Wasteland & Survival Fiction',
  };

  // If the user has active writing data and matched keywords
  if (topScore > 2 && analyzedItemsCount > 0) {
    const affinityScore = Math.min(99, Math.max(88, Math.round(85 + (topScore / (topScore + 8)) * 14)));

    return {
      theme: topTheme,
      affinityScore,
      badgeLabel: `${affinityScore}% Match`,
      isPopular: false,
      reason: `Calibrated to your ${themeDisplayNames[topTheme]} writing style`,
    };
  }

  // 5. Signed-in author with fresh workspace: Curate based on saved preference or popular default
  const storedTheme =
    (typeof window !== 'undefined' &&
      ((localStorage.getItem('endfiles_preferred_theme') ||
        localStorage.getItem('alterjot_preferred_theme')) as NarrativeTheme)) ||
    fallbackTheme;
  const initialTheme = storedTheme || MOST_POPULAR_THEME;

  return {
    theme: initialTheme,
    affinityScore: 94,
    badgeLabel: '94% Match',
    isPopular: false,
    reason: 'Curated for your Scribe profile based on creative resonance',
  };
}
