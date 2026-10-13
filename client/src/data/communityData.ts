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

export const ZOMBIE_APOCALYPSE_MANUSCRIPTS: SharedManuscript[] = [
  {
    id: 'zombie-1',
    title: 'Dead Winter Protocol',
    subtitle: 'Zero Hour in the Frozen Metro',
    author: 'J. D. Larsen',
    authorRank: 'Grand Master',
    genre: 'Zombie Apocalypse',
    status: 'Completed',
    totalWordCount: 86400,
    targetWordCount: 90000,
    chapterCount: 22,
    sceneCount: 68,
    rating: 4.98,
    spineGradient: 'from-[#1e293b] via-[#475569] to-[#991b1b]',
    coverImage: '/images/zombie-dead-winter.jpg',
    synopsis:
      'In a blizzard-blanketed Chicago where temperatures drop to -40°F, survivors discovered too late that the infected do not freeze to death. They enter cryptobiosis beneath snowdrifts—waking in blind predatory frenzy at the slightest footstep vibration on the ice.',
    chapters: [
      {
        title: 'Chapter 1: The Forty Below Silence',
        wordCount: 4120,
        synopsis: 'Sniper Isaac Kane patrols the iced expressway overpass as the thermograph registers heat signatures beneath the frozen drifts.',
      },
      {
        title: 'Chapter 2: Shivering Steel',
        wordCount: 3950,
        synopsis: 'A heating boiler failure in the Loop bunker forces an expedition into the dark, frozen subway tunnels.',
      },
      {
        title: 'Chapter 3: The Thawing Dead',
        wordCount: 4210,
        synopsis: 'Steam pipes ruptured by pressure bursts awaken thousands of slumbering runners encased in glacial ice.',
      },
      {
        title: 'Chapter 4: Whiteout Extraction',
        wordCount: 4300,
        synopsis: 'With zero visibility and failing night vision batteries, the convoy fights backward through howling snowfall.',
      },
    ],
    sampleExcerpt: {
      chapterTitle: 'Chapter 1: The Forty Below Silence',
      content: [
        'At negative forty degrees, sound travels like shattered porcelain. A boot crunch on packed snow rings out for three city blocks, crisp and incriminating.',
        'Isaac Kane pulled the thermal wool scarf tighter across his gas mask seal. His breath crystallized into instant rime across the polycarbonate visor. Below his perch on the elevated expressway, Michigan Avenue was a frozen cemetery of snow-mounded sedans and jackknifed city buses.',
        'Then the thermographic sensor on his collar began clicking—a slow, erratic pulse like a dying grandfather clock.',
        'Isaac peered down through the Leopold scope. Six feet beneath the unbroken drift in front of the art institute, a red bloom flared on the screen. Then another. And another. The snowdrift was not empty; it was breathing.',
      ],
    },
  },
  {
    id: 'zombie-2',
    title: 'Patient Zero: Red Zone',
    subtitle: 'One Breach. Zero Survivors.',
    author: 'Elias Thorne',
    authorRank: 'Master Lorekeeper',
    genre: 'Zombie Apocalypse',
    status: 'Completed',
    totalWordCount: 94100,
    targetWordCount: 100000,
    chapterCount: 24,
    sceneCount: 76,
    rating: 4.96,
    spineGradient: 'from-[#450a0a] via-[#7f1d1d] to-[#18181b]',
    coverImage: '/images/zombie-patient-zero.jpg',
    synopsis:
      'When Level 4 subterranean containment fractures 800 feet beneath the Nevada desert, chief toxicologist Dr. Mara Lin and tactical contractor Jax Vance have exactly forty-seven minutes to escape to surface elevators before automated thermobaric purge sterilizers detonate the compound.',
    chapters: [
      {
        title: 'Chapter 1: Code Scarlet in Sub-Level 6',
        wordCount: 4250,
        synopsis: 'Airflow alarms scream as the reinforced borosilicate glass of Cryo-Vat 9 fissures under internal pressure.',
      },
      {
        title: 'Chapter 2: The Red Emergency Strobes',
        wordCount: 4100,
        synopsis: 'Mara races through flickering decontamination airlocks while hyper-adrenalized infected shatter bulletproof partitions.',
      },
      {
        title: 'Chapter 3: The Freight Shaft Gambit',
        wordCount: 3980,
        synopsis: 'With stairwells compromised, survivors attempt to climb the grease-slick counterweight cables of the central lift.',
      },
    ],
    sampleExcerpt: {
      chapterTitle: 'Chapter 1: Code Scarlet in Sub-Level 6',
      content: [
        'The siren did not wail; it pulsed in a subsonic, guttural thrum that vibrated the fillings in Mara’s teeth. Code Scarlet. Total biological compromise.',
        'Across the reinforced observation deck, Cryo-Vat 9 looked like an amber lantern filled with boiling tar. The subject suspended inside was no longer human; its musculature had striated into corded black sinew, its jaw distended past anatomical limits.',
        '“Mara, step away from the observation pane,” Vance’s voice crackled through the intercom, steady and cold as gunmetal.',
        'Before she could take a step, the four-inch borosilicate glass cracked with the sound of a rifle report. A web of white fractures blossomed across the surface—and two bloodshot, pupilless eyes locked onto hers through the spiderwebbed frost.',
      ],
    },
  },
  {
    id: 'zombie-3',
    title: 'The Last Haven',
    subtitle: 'A Post-Apocalyptic Zombie Thriller',
    author: 'Sarah J. Reed',
    authorRank: 'Grand Master',
    genre: 'Zombie Apocalypse',
    status: 'Completed',
    totalWordCount: 78500,
    targetWordCount: 85000,
    chapterCount: 19,
    sceneCount: 62,
    rating: 4.94,
    spineGradient: 'from-[#7c2d12] via-[#ea580c] to-[#1c1917]',
    coverImage: '/images/zombie-last-haven.jpg',
    synopsis:
      'Suspended two hundred feet above a churning gorge, the Haven was forged from welded shipping containers and suspension bridge cables. It held against the dead for four long years—until a summer drought turns the rushing river below into dry silt, allowing millions of undead to march straight across the canyon floor.',
    chapters: [
      {
        title: 'Chapter 1: Guard Tower Three',
        wordCount: 4050,
        synopsis: 'Captain Sarah Reed spots dust plumes rising thirty miles eastward along the dry riverbed.',
      },
      {
        title: 'Chapter 2: The Shrinking Moat',
        wordCount: 3900,
        synopsis: 'The last rapids vanish into cracked clay, removing the natural barrier that protected the bridge piers.',
      },
      {
        title: 'Chapter 3: The Bridge Siege',
        wordCount: 4180,
        synopsis: 'Infected climb the concrete pylon scaffolding in human ladders as the outer perimeter gates buckle.',
      },
    ],
    sampleExcerpt: {
      chapterTitle: 'Chapter 1: Guard Tower Three',
      content: [
        'For four years, the river was our salvation. It roared through the gorge like a brown freight train, grinding any infected that stumbled into the rapids into driftwood and foam.',
        'Today, Sarah lowered her binoculars with trembling hands. The roar was gone.',
        'Where eighty feet of mountain snowmelt had carved the canyon for centuries, there was only cracked gray silt and stagnant pools of green scum. And along the eastern horizon, kicking up an ochre dust cloud that stained the twilight sky, came the horde.',
        'Not hundreds. Not thousands. A carpet of swaying, rotting flesh extending as far as the glass could reach, marching directly toward our bridge foundations.',
      ],
    },
  },
  {
    id: 'zombie-4',
    title: 'Ashes of the Fallen',
    subtitle: 'The Overgrown Quarantine Chronicles',
    author: 'E. S. Cross',
    authorRank: 'Master Lorekeeper',
    genre: 'Zombie Apocalypse',
    status: 'Completed',
    totalWordCount: 102300,
    targetWordCount: 110000,
    chapterCount: 26,
    sceneCount: 82,
    rating: 4.97,
    spineGradient: 'from-[#14532d] via-[#166534] to-[#18181b]',
    coverImage: '/images/zombie-ashes-fallen.jpg',
    synopsis:
      'A decade after the biohazard collapse, Manhattan is a vertical rain forest of vines, collapsed avenues, and rooftop farms. But deep in the moss-choked concrete canyons, a fungal spore mutation has created "The Whisperers"—undead that coordinate attacks in silent, predatory packs.',
    chapters: [
      {
        title: 'Chapter 1: Canopy Runners',
        wordCount: 4320,
        synopsis: 'Ziplining between high-rise garden communities, scavenger Kael notices the lower streets have fallen unnervingly quiet.',
      },
      {
        title: 'Chapter 2: The Spore Bloom',
        wordCount: 4150,
        synopsis: 'Exploration of a flooded subway station reveals iridescent fungal fruiting bodies rooted into nerve tissue.',
      },
      {
        title: 'Chapter 3: The Fifth Avenue Ambush',
        wordCount: 4280,
        synopsis: 'Coordinated hunter packs cut the suspension guide ropes, trapping a foraging crew on ground level.',
      },
    ],
    sampleExcerpt: {
      chapterTitle: 'Chapter 1: Canopy Runners',
      content: [
        'You never touch the asphalt in New York. That is rule number one, carved into every steel beam of the Highline Colony.',
        'Eighty feet above 42nd Street, ivy as thick as an athlete’s thigh braided the Empire State Building to the Chrysler Tower. Up here, sunlight was sweet, rainwater tasted of zinc, and rooftop tomatoes grew fat and red. Down there was perpetual twilight, green mold, and the smell of wet earth and ancient decay.',
        'Kael clipped his harness carabiner onto the guide cable. He glanced down into the gloom of the canyon below.',
        'Usually, you heard them: teeth clicking, feet dragging through dead leaves. Today, there was no sound except the rustle of ferns. Then, sixty feet beneath his boots, a dozen heads tilted back in unison. Yellow eyes flared in the dark. They weren’t wandering; they were looking directly at him.',
      ],
    },
  },
  {
    id: 'zombie-5',
    title: 'Horde Horizon',
    subtitle: 'The Great Plains Migration',
    author: 'Marcus Vance',
    authorRank: 'Seasoned Novelist',
    genre: 'Zombie Apocalypse',
    status: 'In Progress',
    totalWordCount: 67200,
    targetWordCount: 80000,
    chapterCount: 18,
    sceneCount: 52,
    rating: 4.89,
    spineGradient: 'from-[#78350f] via-[#b45309] to-[#1c1917]',
    coverImage: '/images/apocalyptic-cover.jpg',
    synopsis:
      'A mega-horde five miles wide sweeps across the Nebraska plains like an unstoppable locust swarm. An armored locomotive carrying three hundred refugees must outrun the migration across a crumbling rail line where every switch and trestle bridge is on the verge of collapse.',
    chapters: [
      {
        title: 'Chapter 1: Smoke on the Prairie',
        wordCount: 3950,
        synopsis: 'Train engineer Cole watches the western horizon darken with dust and decomposing masses.',
      },
      {
        title: 'Chapter 2: The Clogged Trestle',
        wordCount: 3820,
        synopsis: 'Derailment looms as thousands of bodies wedge into the wooden bridge timbers over the Platte River.',
      },
      {
        title: 'Chapter 3: Full Steam Into the Swarm',
        wordCount: 4100,
        synopsis: 'With the cowcatcher groaning under impact, Cole dumps the last bags of bituminous coal into the furnace.',
      },
    ],
    sampleExcerpt: {
      chapterTitle: 'Chapter 1: Smoke on the Prairie',
      content: [
        'The horizon wasn’t smoke; it was motion. A rolling, churning sea of black and gray that stretched from north to south until the curvature of the earth swallowed it.',
        '“How many?” Cole shouted over the rhythmic clatter of the Baldwin 4-8-4 steam locomotive.',
        'His fireman didn’t lower the brass spyglass. “More than the state of Nebraska had living citizens before the war, Cole. Two million. Maybe three. And they’re moving at a steady six miles an hour, straight toward the junction.”',
      ],
    },
  },
  {
    id: 'zombie-6',
    title: 'Winter Over Blackwood: Resurgence',
    subtitle: 'The Frostbite Horde',
    author: 'S. K. Thorne',
    authorRank: 'Journeyman Author',
    genre: 'Zombie Apocalypse',
    status: 'Completed',
    totalWordCount: 64500,
    targetWordCount: 75000,
    chapterCount: 16,
    sceneCount: 48,
    rating: 4.90,
    spineGradient: 'from-[#0369a1] via-[#0284c7] to-[#0f172a]',
    coverImage: '/images/cover-winter-blackwood.jpg',
    synopsis:
      'The mountain village of Blackwood survived the initial wave by retreating into the sub-zero high alpine passes where flesh froze solid. But when an unprecedented spring thaw arrives early, the hundreds of thousands frozen in the glacial valley begin to thaw and open their dead eyes.',
    chapters: [
      {
        title: 'Chapter 1: The Melt Begins',
        wordCount: 4100,
        synopsis: 'Icicles dripping from the ramparts signal the end of winter and the awakening of the valley.',
      },
      {
        title: 'Chapter 2: Sounds in the Slush',
        wordCount: 3900,
        synopsis: 'Black ice fractures as limbs trapped inside the glacier start breaking free.',
      },
      {
        title: 'Chapter 3: The Avalanche Defense',
        wordCount: 4200,
        synopsis: 'Defenders detonate dynamite on the upper ridge to bury the surging thaw horde in a mountain of snow.',
      },
    ],
    sampleExcerpt: {
      chapterTitle: 'Chapter 1: The Melt Begins',
      content: [
        'For seven months, the cold was our fortress wall. At negative twenty, an infected man is just an ice sculpture, brittle as sugar glass.',
        'Then the wind turned south on the ides of March. It carried the warm, humid scent of blooming pine and damp earth.',
        'Tomas stood on the palisade, watching water stream down the blue face of the Blackwood glacier. From deep inside the clear ice, twenty feet down, a gray hand twitched. Then a pair of pale lips parted, exhaling a plume of frozen mist into the morning thaw.',
      ],
    },
  },
];

export const SHARED_MANUSCRIPTS: SharedManuscript[] = [
  ...ZOMBIE_APOCALYPSE_MANUSCRIPTS,
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
    coverImage: '/images/weekly-world-cover.jpg',
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
    coverImage: '/images/apocalyptic-cover.jpg',
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
    coverImage: '/images/cover-waltz-charcoal.jpg',
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
    coverImage: '/images/cover-solstice-gate.jpg',
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
    coverImage: '/images/cover-glass-alchemist.jpg',
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
    coverImage: '/images/cover-winter-blackwood.jpg',
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
