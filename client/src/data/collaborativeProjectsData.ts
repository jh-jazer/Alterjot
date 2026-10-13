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

export const COLLABORATIVE_PROJECTS: CollaborativeProject[] = [
  {
    id: 'cinder-wastes',
    name: 'The Cinder Wastes: Ashfall Protocols',
    universe: 'Universe: The Cinder Wastes',
    creatorPenName: 'Jax Vance',
    accessMode: 'approval_required',
    approvedCollaborators: [
      { penName: 'Gabriel O\'Reilly', role: 'Writer', approvedAt: '2 days ago' },
      { penName: 'C. W. Holloway', role: 'Cover Designer', approvedAt: '1 week ago' },
      { penName: 'Matthew Caine', role: 'Concept Artist', approvedAt: '2 weeks ago' },
    ],
    pendingRequests: [
      {
        id: 'req-1',
        applicantPenName: 'Dante Mercer',
        discipline: 'writing',
        pitchTitle: 'The Barter Silo Mutiny',
        pitchNotes: 'Want to write a 4-chapter arc about a water filter mechanic who intercepts a military signal.',
        submittedAt: 'Today',
        status: 'pending',
      },
      {
        id: 'req-2',
        applicantPenName: 'Anya Sterling',
        discipline: 'cover',
        pitchTitle: 'Obsidian Dust Dust-Jacket Typography',
        pitchNotes: 'Custom hand-drawn distressed copper lettering for upcoming anthology volumes.',
        submittedAt: 'Yesterday',
        status: 'pending',
      },
    ],
    tagline: 'A scorched post-collapse Earth where radioactive dust storms crystallize into razor obsidian glass. Nomadic cartographers navigate subterranean silos before the Ash Monsoon strikes.',
    genre: 'Post-Apocalyptic Survival',
    bannerImage: '/images/world_challenge_banner.jpg',
    accentColor: '#d97706',
    canonRules: [
      'Twilight Radiation: Surface travel halts immediately when dosimeter spikes above 250 mSv.',
      'Liquid Currency: Clean decontaminated water is the universal barter currency.',
      'The Ash Monsoon: Cyclical storms melt synthetic materials and crystalize airborne silicon.',
    ],
    metrics: {
      booksCount: 14,
      coversCount: 9,
      artworksCount: 28,
      webtoonEpisodesCount: 4,
      animatedWorksCount: 2,
    },
    creativeCalls: [
      {
        discipline: 'writing',
        title: 'The Babel Silo Scribe Records',
        description: 'Seeking chapters exploring the lower barter decks and the water rationing uprising.',
        urgency: 'hot',
      },
      {
        discipline: 'cover',
        title: 'Volume II Dust Jacket Design',
        description: 'Need typography and weathered leather aesthetic for "The Salted Horizon".',
        urgency: 'needed',
      },
      {
        discipline: 'webtoon',
        title: 'Vertical Scroll Episode 3 Storyboard',
        description: 'Adapting the dust storm ambush scene into high-tension visual panels.',
        urgency: 'in-progress',
      },
      {
        discipline: 'animation',
        title: '15-Second Atmospheric Motion Teaser',
        description: 'Looping dosimeter clicks with glowing amber particle dust.',
        urgency: 'needed',
      },
    ],
    starterPrompt: {
      hookTitle: 'Echoes from the Subterranean Silo',
      synopsis: 'Deep beneath the scorched basalt plateaus, an unlogged radio transmission breaches the concrete seal of Silo 9.',
      openingParagraph: 'The brass needle of the dosimeter clicked in steady, hypnotic increments. Jax tightened his canvas respirator and stared into the elevator shaft where steam hissed through fractured pressure valves. The transmission was coming from below the waterline—where no living scout should have been breathing.',
    },
  },
  {
    id: 'aetheria-sky-citadel',
    name: 'Aetheria: The Clockwork Realm',
    universe: 'Universe: Aetheria Above the Smog',
    creatorPenName: 'Helena Vance',
    accessMode: 'approval_required',
    approvedCollaborators: [
      { penName: 'Julian Thorne', role: 'Writer', approvedAt: '3 days ago' },
      { penName: 'Beatrice K. Rowe', role: 'Concept Artist', approvedAt: '5 days ago' },
    ],
    pendingRequests: [
      {
        id: 'req-3',
        applicantPenName: 'Mira Lawson',
        discipline: 'webtoon',
        pitchTitle: 'The Copper Aviator Prologue',
        pitchNotes: 'Vertical webtoon storyboard adapting the Zeppelin docking collision.',
        submittedAt: 'Today',
        status: 'pending',
      },
    ],
    tagline: 'A floating archipelago of brass spires, steam locomotives, and high-altitude alchemists who harvest condensed blue aether crystals suspended above toxic cloudbanks.',
    genre: 'Steampunk Fantasy',
    bannerImage: '/images/place-scriptorium.jpg',
    accentColor: '#b45309',
    canonRules: [
      'The Smog Floor: Falling below 3,000 feet requires copper pneumatic respirators.',
      'Clockwork Guild Charter: Automatons may not contain more than three cognitive calculation gears.',
      'Aether Volatility: Blue aether crystals detonate when exposed to rapid barometric shifts.',
    ],
    metrics: {
      booksCount: 19,
      coversCount: 12,
      artworksCount: 34,
      webtoonEpisodesCount: 5,
      animatedWorksCount: 3,
    },
    creativeCalls: [
      {
        discipline: 'writing',
        title: 'Chronicles of the Zephyr Fleet',
        description: 'Novels detailing skyship privateers and contraband aether smuggling routes.',
        urgency: 'hot',
      },
      {
        discipline: 'art',
        title: 'Grand Clockwork Astrolabe Blueprints',
        description: 'Need detailed mechanical illustration of the High Observatory gears.',
        urgency: 'needed',
      },
      {
        discipline: 'webtoon',
        title: 'The Alchemist\'s Escape (Episode 1)',
        description: 'Dynamic rooftop chase sequences across copper gargoyles and steam vents.',
        urgency: 'in-progress',
      },
    ],
    starterPrompt: {
      hookTitle: 'Vapors of the High Observatory',
      synopsis: 'An unsanctioned celestial alignment causes the central clockwork tower to grind into reverse gear.',
      openingParagraph: 'A single brass gear the size of a carriage slipped from its copper housing, sending an ear-splitting shriek down the spiral arches of the Grand Astrolabe. In the observation dome, Master Corvus adjusted his bifocal loupes. The stars were not drifting—they were falling toward the smog.',
    },
  },
  {
    id: 'neo-kyoto-2189',
    name: 'Neo-Kyoto: The Neon Underlayer',
    universe: 'Universe: Neo-Kyoto 2189',
    creatorPenName: 'Ren Kurogane',
    accessMode: 'approval_required',
    approvedCollaborators: [
      { penName: 'S. K. Thorne', role: 'Writer', approvedAt: '1 week ago' },
    ],
    pendingRequests: [],
    tagline: 'A multi-tiered cyberpunk megalopolis where acid rain never halts, memory brokers trade synthetic recollections, and rogue android collectives carve out sovereignty in the deep maintenance tunnels.',
    genre: 'Cyberpunk Synth-Noir',
    bannerImage: '/images/place-silo.jpg',
    accentColor: '#0284c7',
    canonRules: [
      'Wetware Safeguards: Neural interfaces must incorporate physical biological circuit breakers.',
      'The Grid Blackout: Levels 40 and below lose civic power daily between 02:00 and 05:00.',
      'Memory Seizure: Cloned recollections exceeding 128TB are subject to immediate Megacorp confiscation.',
    ],
    metrics: {
      booksCount: 22,
      coversCount: 15,
      artworksCount: 42,
      webtoonEpisodesCount: 6,
      animatedWorksCount: 4,
    },
    creativeCalls: [
      {
        discipline: 'writing',
        title: 'Ghost Protocols of Sub-Level 80',
        description: 'Noir detective novellas investigating synthetic memory leaks in the neon rain.',
        urgency: 'hot',
      },
      {
        discipline: 'cover',
        title: 'Holographic Variant Cover for "Zero Sum"',
        description: 'Glitch aesthetic with neon cyan and magenta typography.',
        urgency: 'needed',
      },
      {
        discipline: 'animation',
        title: 'Cybernetic Alleyway Combat Loop',
        description: 'Seeking 2D/3D animators for 8-second high-energy rain and katana reflection cut.',
        urgency: 'hot',
      },
    ],
    starterPrompt: {
      hookTitle: 'Rain on the Optical Sensor',
      synopsis: 'A courier carrying a cryogenic neural drive finds their own childhood memories recorded inside.',
      openingParagraph: 'The synthetic rain hissed as it struck Ren\'s chrome collarbone. Under the flicker of a flickering noodle-cart hologram, he plugged the encrypted thumb drive into his palm port. The memory that loaded was not a military schematic—it was his mother singing to him thirty years before he was assembled.',
    },
  },
  {
    id: 'obsidian-veil',
    name: 'The Obsidian Veil: Sunless Kingdoms',
    universe: 'Universe: The Sunless Kingdoms',
    creatorPenName: 'Sister Vesper',
    accessMode: 'approval_required',
    approvedCollaborators: [],
    pendingRequests: [],
    tagline: 'An empire wrapped in permanent twilight three centuries after the solar eclipse solidified. Scribes, relic knights, and candle-keepers defend consecrated bell towers from mist horrors.',
    genre: 'Dark Gothic Fantasy',
    bannerImage: '/images/world-solas.jpg',
    accentColor: '#9333ea',
    canonRules: [
      'The Sacred Wax: Natural fire cannot burn without consecrated soul-wax candles.',
      'The Mist Covenant: Leaving the acoustic range of the cathedral bells exposes travelers to the Hollowed.',
      'Scribe Parchment: Official imperial chronicles must be inscribed with ink harvested from the Black Gulf.',
    ],
    metrics: {
      booksCount: 16,
      coversCount: 10,
      artworksCount: 31,
      webtoonEpisodesCount: 3,
      animatedWorksCount: 2,
    },
    creativeCalls: [
      {
        discipline: 'writing',
        title: 'Tales of the Bell Scribes',
        description: 'Dark fantasy chapters exploring monastic order defending the frontier watchtowers.',
        urgency: 'hot',
      },
      {
        discipline: 'art',
        title: 'The Hollowed Monarch Bestiary Entry',
        description: 'Charcoal and sepia concept art of the antlered frost entities.',
        urgency: 'needed',
      },
      {
        discipline: 'webtoon',
        title: 'Cathedral of Bone (Episode 1)',
        description: 'Atmospheric vertical scroll featuring silent candle-bearers.',
        urgency: 'in-progress',
      },
    ],
    starterPrompt: {
      hookTitle: 'The Last Soul-Wax Candle',
      synopsis: 'When the watchtower bell cracks under winter frost, a novice scribe must rekindle the altar flame before the mist settles.',
      openingParagraph: 'The bronze bell atop St. Jude’s Spire did not chime at midnight; it groaned, a jagged fissure spreading across its inscription like lightning. Sister Vesper looked at the melting taper of soul-wax in her trembling fingers. Outside the stained glass, the mist had already begun to take human shapes.',
    },
  },
];
