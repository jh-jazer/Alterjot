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

export const TOP_10_AUTHORS: LeaderboardAuthor[] = [
  {
    rank: 1,
    author: 'Helena Vance',
    title: 'The Clockwork Citadel',
    genre: 'Steampunk',
    words: 94250,
    streak: 42,
    badge: 'Grand Master',
    avatarColor: 'from-amber-600 to-amber-800 text-amber-100',
  },
  {
    rank: 2,
    author: 'C. W. Holloway',
    title: 'Echoes of the Void',
    genre: 'Cosmic Horror',
    words: 78410,
    streak: 28,
    badge: 'Master Lorekeeper',
    avatarColor: 'from-indigo-600 to-purple-900 text-indigo-100',
  },
  {
    rank: 3,
    author: 'Anya Sterling',
    title: 'A Waltz in Charcoal',
    genre: 'Gothic Fantasy',
    words: 64900,
    streak: 19,
    badge: 'Master Lorekeeper',
    avatarColor: 'from-rose-600 to-stone-800 text-rose-100',
  },
  {
    rank: 4,
    author: 'Julian Thorne',
    title: 'The Solstice Gate',
    genre: 'High Fantasy',
    words: 52180,
    streak: 23,
    badge: 'Seasoned Novelist',
    avatarColor: 'from-emerald-600 to-teal-800 text-emerald-100',
  },
  {
    rank: 5,
    author: 'Dante Mercer',
    title: 'The Glass Alchemist',
    genre: 'Cyberpunk',
    words: 43400,
    streak: 14,
    badge: 'Seasoned Novelist',
    avatarColor: 'from-cyan-600 to-blue-800 text-cyan-100',
  },
  {
    rank: 6,
    author: 'Beatrice K. Rowe',
    title: 'Song of the Iron Leviathan',
    genre: 'Weird West',
    words: 36800,
    streak: 16,
    badge: 'Seasoned Novelist',
    avatarColor: 'from-amber-700 to-yellow-900 text-amber-100',
  },
  {
    rank: 7,
    author: 'Matthew Caine',
    title: 'Dust on the Nebula',
    genre: 'Space Opera',
    words: 28150,
    streak: 12,
    badge: 'Seasoned Novelist',
    avatarColor: 'from-violet-600 to-fuchsia-900 text-violet-100',
  },
  {
    rank: 8,
    author: 'S. K. Thorne',
    title: 'Winter Over Blackwood',
    genre: 'Dark Fantasy',
    words: 19450,
    streak: 11,
    badge: 'Journeyman Author',
    avatarColor: 'from-slate-600 to-slate-800 text-slate-100',
  },
  {
    rank: 9,
    author: 'Mira Lawson',
    title: 'Letters from the Lighthouse',
    genre: 'Mystery',
    words: 14200,
    streak: 9,
    badge: 'Journeyman Author',
    avatarColor: 'from-teal-600 to-emerald-800 text-teal-100',
  },
  {
    rank: 10,
    author: "Gabriel O'Reilly",
    title: 'The Cartographer of Ashes',
    genre: 'Post-Apocalyptic',
    words: 10850,
    streak: 8,
    badge: 'Journeyman Author',
    avatarColor: 'from-orange-600 to-stone-800 text-orange-100',
  },
];

export const SHARED_MANUSCRIPTS: SharedManuscript[] = [
  {
    id: 'shared-1',
    title: 'The Clockwork Citadel',
    subtitle: 'Chronicles of the Celestial Pendulum',
    author: 'Helena Vance',
    authorRank: 'Grand Master',
    genre: 'Steampunk',
    status: 'Completed',
    totalWordCount: 94250,
    targetWordCount: 100000,
    chapterCount: 24,
    sceneCount: 72,
    rating: 4.95,
    spineGradient: 'from-[#b45309] via-[#c2593f] to-[#92400e]',
    synopsis:
      'In a floating Victorian metropolis suspended over boiling mercury, a disgraced chronologist discovers the Great Celestial Pendulum has begun swaying backwards, unwinding lost centuries and releasing spectral memories that demand their stolen time back.',
    chapters: [
      {
        title: 'Chapter 1: The Pendulum Stutters',
        wordCount: 4210,
        synopsis: 'Master Horologist Silas Drake detects an imperceptible three-second lag in the High Spire escapement.',
      },
      {
        title: 'Chapter 2: The Mercury Depths',
        wordCount: 3950,
        synopsis: 'A descent into the lower boiler flues reveals copper tubing clogged with petrified silver memories.',
      },
      {
        title: 'Chapter 3: The Brass Conspiracy',
        wordCount: 4120,
        synopsis: 'An unscheduled congregation of the Arch-Chancellors suggests the backwards sway was intentionally triggered.',
      },
      {
        title: 'Chapter 4: Echoes Across the Glass',
        wordCount: 3880,
        synopsis: 'Reflections in polished brass dials begin answering questions before they are spoken aloud.',
      },
    ],
    sampleExcerpt: {
      chapterTitle: 'Chapter 1: The Pendulum Stutters',
      content: [
        'The bells of Aethelgard never lied. For three hundred years, their brass tongues had carved the sky into orderly twelve-second increments, punctual as heartbeats, ruthless as winter frost.',
        'Silas Drake adjusted the loupe strapped across his left eye, his thumbs steady against the escapement wheel. Liquid mercury churned three leagues below the cathedral grid, whispering against the copper pilings that kept twelve square miles of cobblestone and wrought iron from plunging into the abyss.',
        'Then the pendulum hesitated.',
        'It was scarcely the width of an eyelash—less than a quarter turn of a hairspring. But Silas felt it through the soles of his boots. The world caught its breath. In that fractured instant between one tick and its delayed tock, the reflection in the polished brass casing did not mimic his furrowed brow. It smiled at him, turned its head, and reached backward into the dark.',
      ],
    },
  },
  {
    id: 'shared-2',
    title: 'Echoes of the Void',
    subtitle: 'The Hollow Ridge Transmission',
    author: 'C. W. Holloway',
    authorRank: 'Master Lorekeeper',
    genre: 'Cosmic Horror',
    status: 'First Draft',
    totalWordCount: 78410,
    targetWordCount: 85000,
    chapterCount: 19,
    sceneCount: 54,
    rating: 4.88,
    spineGradient: 'from-[#1e1b4b] via-[#312e81] to-[#1e3a8a]',
    synopsis:
      'Deep beneath the subglacial ice sheet of Ellsworth Land, an acoustic research station picks up harmonic frequencies pulsing from bedrock that predates terrestrial multicellular life. The recordings possess a linguistic cadence that begins altering the crew’s sleeping thoughts.',
    chapters: [
      {
        title: 'Chapter 1: Frequency Zero',
        wordCount: 4300,
        synopsis: 'The primary hydrophone records forty-seven cycles per second from three miles beneath solid granite.',
      },
      {
        title: 'Chapter 2: Core Sample 9',
        wordCount: 4120,
        synopsis: 'Drilling extraction reveals a cylinder of black volcanic glass displaying hexagonal geometric fractals.',
      },
      {
        title: 'Chapter 3: Subglacial Whispers',
        wordCount: 3890,
        synopsis: 'Technician Miller awakens at 03:00 to discover his notebook filled with phonetic transcriptions he cannot read.',
      },
    ],
    sampleExcerpt: {
      chapterTitle: 'Chapter 1: Frequency Zero',
      content: [
        'The silence of Antarctica is not an absence of noise; it is an immense pressure waiting for a puncture. When the blizzard quieted at midnight, the station settled on its hydraulic stilts with a groaning sigh like a sleeping mammal.',
        'Dr. Julian Reid sat before the analog spectrograph, sipping black coffee that had gone lukewarm an hour ago. The green stylus was supposed to draw a flat line across the smoked paper. It had drawn that flat line for five months.',
        'Tonight, it was writing poetry in mathematics.',
        'The frequency sat at exactly forty-seven Hertz—too low for the human ear, yet vibrating the enamel of Reid’s molars with a crystalline resonance. It rose in rhythmic triplets, decayed, and surged again in an immutable cadence. It sounded less like tectonic grinding and more like a slumbering titan taking a measured, suffocating breath.',
      ],
    },
  },
  {
    id: 'shared-3',
    title: 'A Waltz in Charcoal',
    subtitle: 'The Gilded Quarantine of Oakhaven',
    author: 'Anya Sterling',
    authorRank: 'Master Lorekeeper',
    genre: 'Gothic Fantasy',
    status: 'Revision',
    totalWordCount: 64900,
    targetWordCount: 75000,
    chapterCount: 16,
    sceneCount: 48,
    rating: 4.92,
    spineGradient: 'from-[#831843] via-[#9f1239] to-[#4c0519]',
    synopsis:
      'In a plague-quarantined baroque capital surrounded by obsidian seawalls, a portraitist discovers that figures drawn with ash harvested from the Grand Crematorium step out of canvas frames at sunset—bearing the stolen memories of the living.',
    chapters: [
      {
        title: 'Chapter 1: The Portrait of Lady Vane',
        wordCount: 3900,
        synopsis: 'Eleanor applies the final charcoal smudge to a widow who has forgotten the color of her husband’s eyes.',
      },
      {
        title: 'Chapter 2: Ash and Turpentine',
        wordCount: 4200,
        synopsis: 'The black powder delivered from the Mortuary Guild contains iridescent flakes that warm to the touch.',
      },
      {
        title: 'Chapter 3: The Midnight Salon',
        wordCount: 4100,
        synopsis: 'Canvases stored in the attic begin conversing in hushed, aristocratic murmurs after the lamps are extinguished.',
      },
    ],
    sampleExcerpt: {
      chapterTitle: 'Chapter 1: The Portrait of Lady Vane',
      content: [
        'Charcoal is forgiving until it touches velvet paper. A thumb can soften an aggressive line or cast a cheekbone into tender shadow, but once the grain drinks the carbon, it holds the blackness like a confession.',
        'Lady Vane sat beside the tall arched window of the studio, her gown of stiff mourning silk swallowing the gray afternoon light. Outside, the fog of Oakhaven carried the bitter scent of vinegar lanterns and burning rosemary—the standard fumigation of the quarantined lower parish.',
        '“Do not paint my eyes as they are today, child,” Lady Vane whispered, her fingers twisting a jet rosary. “Paint them as they were on the summer solstice of seventy-four, before the fever took the harbor.”',
        'Eleanor lifted her drawing stick. She did not tell the matriarch that the charcoal stick had been forged from the burnt cedar coffins of St. Jude’s cemetery. When the black tip scraped against the paper, it did not produce dust; it smelled of lavender soap and summer rain, and beneath her fingertips, the linen grain felt warm as human skin.',
      ],
    },
  },
  {
    id: 'shared-4',
    title: 'The Solstice Gate',
    subtitle: 'The Broken Leyline Chronicles',
    author: 'Julian Thorne',
    authorRank: 'Seasoned Novelist',
    genre: 'High Fantasy',
    status: 'In Progress',
    totalWordCount: 52180,
    targetWordCount: 80000,
    chapterCount: 14,
    sceneCount: 39,
    rating: 4.85,
    spineGradient: 'from-[#065f46] via-[#047857] to-[#064e3b]',
    synopsis:
      'Every five hundred years, the twin suns of Kyros eclipse and the leyline boundary between mortal realms fractures. A mute cartographer must chart the shifting topography before the invading Empire of the Iron Dawn weaponizes the open rift.',
    chapters: [
      {
        title: 'Chapter 1: The Dual Horizon',
        wordCount: 3800,
        synopsis: 'Maelen notes the solar parallax diverging by seventeen minutes against ancient astrolabes.',
      },
      {
        title: 'Chapter 2: Ink and Vellum',
        wordCount: 3950,
        synopsis: 'Maps drawn at dawn re-orient themselves as mountain passes fold inward like pleated cloth.',
      },
      {
        title: 'Chapter 3: The Iron Vanguard',
        wordCount: 4100,
        synopsis: 'Scouts from the eastern fortress cross a ravine that was fifty leagues wide the night before.',
      },
    ],
    sampleExcerpt: {
      chapterTitle: 'Chapter 1: The Dual Horizon',
      content: [
        'To map a land that refuses to remain still is an act of stubborn madness, but Maelen had spent twelve years doing little else. The parchment pinned across his brass surveying board was already stained with sweat and pulverized lapis lazuli.',
        'Above the crags of Mount Sunder, the gold sun Solas and its pale violet sister Aurelia had narrowed to a finger-width apart. Where their light intersected on the valley floor, shadows split into two distinct directions, one amber, one amethyst.',
        'He peered through his theodolite. The river below was running in two opposing currents simultaneously: clear mountain snowmelt flowing southward, while a shimmering ribbon of iridescent violet brine surged upstream toward the glacial peaks. The Solstice Gate had not merely cracked; the world was beginning to sew itself to another.',
      ],
    },
  },
  {
    id: 'shared-5',
    title: 'The Glass Alchemist',
    subtitle: 'A Neon Noir Dossier',
    author: 'Dante Mercer',
    authorRank: 'Seasoned Novelist',
    genre: 'Cyberpunk',
    status: 'In Progress',
    totalWordCount: 43400,
    targetWordCount: 60000,
    chapterCount: 12,
    sceneCount: 35,
    rating: 4.82,
    spineGradient: 'from-[#0891b2] via-[#0284c7] to-[#1e40af]',
    synopsis:
      'In the multi-tier megacity of Neo-Kowloon, a rogue synthetic chemist brews black-market sensory ampoules called Vitreous. When an elite corporate client dies clutching an ampoule containing memories of a non-existent nuclear disaster, the hunt begins.',
    chapters: [
      {
        title: 'Chapter 1: Neon Precipitation',
        wordCount: 3700,
        synopsis: 'Kael cleans condenser coils in the shadow of holographic billboard spires advertising synthetic lungs.',
      },
      {
        title: 'Chapter 2: The Amber Vial',
        wordCount: 3820,
        synopsis: 'A courier arrives with a fractured memory core that induces seizures and phantom ozone scents.',
      },
      {
        title: 'Chapter 3: The Arasaka Protocol',
        wordCount: 3600,
        synopsis: 'Cybernetic enforcers sweep through the canal wet market searching for unmonitored chromatography rigs.',
      },
    ],
    sampleExcerpt: {
      chapterTitle: 'Chapter 1: Neon Precipitation',
      content: [
        'The rain over Level 14 tasted like battery acid and burnt silicon. It dripped through the rusting catwalk gratings, pooling in psychedelic swirls of pink motor oil and discarded stim-tabs.',
        'Kael pressed the glass pipette between gloved fingertips, counting the drops into the centrifuge. Three droplets of cortical fluid, one drop of liquid cesium. Inside the vacuum tube, the solution turned from cloudy gray to luminous cerulean.',
        '“You sell dreams to gutter scavengers, Kael,” whispered the shadow leaning against his reinforced security shutter. “So tell me why an executive from the sixty-fourth floor of the Zaibatsu Spire had your private frequency burned into his neural cortex?”',
      ],
    },
  },
  {
    id: 'shared-6',
    title: 'Winter Over Blackwood',
    subtitle: 'Tale of the Frostbound Valley',
    author: 'S. K. Thorne',
    authorRank: 'Journeyman Author',
    genre: 'Dark Fantasy',
    status: 'Completed',
    totalWordCount: 38450,
    targetWordCount: 40000,
    chapterCount: 10,
    sceneCount: 28,
    rating: 4.79,
    spineGradient: 'from-[#334155] via-[#475569] to-[#1e293b]',
    synopsis:
      'When an unnatural blizzard seals off the mountain village of Blackwood in the middle of harvest season, the hearth fires begin burning with cold blue flames. The elders realize the spirits walking the frozen forest are not ancestors—they are the things that hunted them.',
    chapters: [
      {
        title: 'Chapter 1: The Blue Hearth',
        wordCount: 3900,
        synopsis: 'Wood in the village tavern turns to crystalline ice while flames fail to cast heat.',
      },
      {
        title: 'Chapter 2: The Mountain Barrier',
        wordCount: 3800,
        synopsis: 'A scouting party finds the northern pass blocked by fifty-foot walls of razor ice containing trapped figures.',
      },
      {
        title: 'Chapter 3: Tracks in the Blizzard',
        wordCount: 3750,
        synopsis: 'Footprints outside the timber palisade appear from nowhere and lead straight into solid stone.',
      },
    ],
    sampleExcerpt: {
      chapterTitle: 'Chapter 1: The Blue Hearth',
      content: [
        'No harvest had ever ended in frostbite before the Feast of St. Jude. The pumpkins in the cellar had split open overnight, their pulp crystallized into orange shards as sharp as broken pottery.',
        'Tomas threw another dry birch log onto the tavern hearth. The bark crackled, but the wood did not smoke. Instead, a pale, sapphire luminescence crawled across the moss, casting ghastly shadows against the timber beams above. Tomas reached his palm toward the embers.',
        'It was not warm. It was colder than river ice in January.',
        'Across the room, old Martha dropped her wool knitting into her lap. Her gaze was fixed on the heavy oak door. Beyond the shutters, the wind was not merely screaming through the pine boughs—it was singing a lullaby in a tongue that had died before the valley was cleared.',
      ],
    },
  },
];
