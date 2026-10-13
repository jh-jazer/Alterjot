import type { NarrativeTheme } from '../types';

export interface ChallengeItem {
  id: string;
  themeKey: NarrativeTheme;
  type: 'world' | 'triad';
  typeLabel: string;
  badge: string;
  badgeEmoji: string;
  universe: string;
  title: string;
  tagline: string;
  genre: string;
  synopsis: string;
  coverImage: string;
  accentColor: string;
  difficulty: string;
  estimatedTime: string;
  participantsCount: number;
  wordGoal: string;
  survivalConstraints: string[];
  incitingSparks: string[];
  starterHook: string;
  // Specific to three elements challenges
  threeElements?: {
    character: {
      name: string;
      role: string;
      description: string;
      image: string;
      quirk: string;
    };
    place: {
      name: string;
      role?: string;
      region?: string;
      description: string;
      image: string;
      hazard: string;
    };
    world: {
      name: string;
      role?: string;
      anomaly?: string;
      description: string;
      image: string;
      rule: string;
    };
  };
}

export const ALL_CHALLENGES: ChallengeItem[] = [
  // 1. APOCALYPTIC / VAMPIRE WORLD CHALLENGE
  {
    id: 'apocalyptic-world',
    themeKey: 'apocalyptic',
    type: 'world',
    typeLabel: 'World Challenge',
    badge: 'LEGENDARY SURVIVAL CHALLENGE',
    badgeEmoji: '🩸',
    universe: 'Universe: The Midnight Siege',
    title: 'Phantom of Their Nightmares',
    tagline: 'By night, the streets belong to the infected—survive the siege in your fortified house as humanity’s last phantom.',
    genre: 'Post-Apocalyptic Vampire Horror',
    synopsis:
      'By night, the streets belong entirely to the infected—pale, predatory vampires who swarm out of the dark to besiege his fortified house, clawing at the barricades while he waits out the siege inside with whiskey, blaring music, and fresh wooden stakes. It is an inversion of nature where humanity is extinct, the monsters are the dominant society, and the last surviving man has become the phantom of their nightmares.',
    coverImage: '/images/vampire-siege.jpg',
    accentColor: '#e11d48',
    difficulty: 'Survivalist (High)',
    estimatedTime: '20–45 Mins',
    participantsCount: 1640,
    wordGoal: '1,500 – 3,500 words',
    survivalConstraints: [
      'Daylight is your only foraging window; once twilight falls, the streets belong entirely to the infected.',
      'Timber barricades and iron grates groan under the swarm; reinforce points of structural failure before midnight.',
      'Keep the generator running and phonograph blaring—silence invites coordinated swarms and psychological collapse.',
    ],
    incitingSparks: [
      'A familiar voice calls your name from outside the shuttered window—an infected neighbor who still remembers your past life.',
      'The generator engine sputters and stalls at 2:00 AM, plunging the fortified house into pitch blackness as claws scratch against the roof.',
      'During dawn patrol, you find fresh stakes pulled from dead infected, arranged in an ominous warning pattern on your front lawn.',
    ],
    starterHook:
      'The sun died behind the skyline, and the scratching began. Outside, pale hands clawed at the reinforced oak shutters, their shrieks cutting through the jazz blaring from his phonograph. He poured three fingers of whiskey into a cracked tumbler, picked up a fresh ash-wood stake, and waited. To them, he was not a survivor. He was the bogeyman who walked under the burning sun.',
  },

  // 2. APOCALYPTIC THREE ELEMENTS CHALLENGE
  {
    id: 'apocalyptic-triad',
    themeKey: 'apocalyptic',
    type: 'triad',
    typeLabel: 'Three Elements Triad',
    badge: 'POPULAR TRIAD',
    badgeEmoji: '⚡',
    universe: 'Universe: Metropolitan Outbreak',
    title: 'The 43rd Floor Delivery',
    tagline: 'Day 1 of the zombie apocalypse: an unaware delivery guy ascends in a glass elevator to floor 43.',
    genre: 'Zombie Apocalypse / Suspense Thriller',
    synopsis:
      'Day 1 of the zombie apocalypse. An Asian delivery guy in uniform, holding a food bag and his phone, inside a rising elevator, passing the 30th floor on its way to the 43rd floor.',
    coverImage: '/images/elevator-delivery.jpg',
    accentColor: '#f59e0b',
    difficulty: 'Intermediate',
    estimatedTime: '20–45 Mins',
    participantsCount: 2139,
    wordGoal: '1,500 – 3,500 words',
    survivalConstraints: [
      'The protagonist must remain completely unaware of the apocalypse until the elevator passes floor 35.',
      'The mundane details of the delivery (customer note, tip rating, food temperature) must contrast sharply with the escalating carnage.',
      'The climax must occur as the elevator reaches the 43rd floor and the doors slide open.',
    ],
    incitingSparks: [
      'A flood of emergency alert notifications pings on his phone simultaneously, but the elevator signal drops before the video loads.',
      'At floor 36, the glass elevator shudders as someone impacts against the exterior shaft glass from above.',
      'The elevator chime rings for the 43rd floor, the indicator lights turn crimson, and bloody handprints smear across the opposite wall as doors open.',
    ],
    starterHook:
      'Ding. The digital LED display above the polished chrome doors ticked from 30 to 31. Jun shifted the insulated thermal bag to his left hand, adjusting his cap while his right thumb scrolled through five-star reviews on his courier app. Outside the glass elevator walls, black smoke columns were already rising above the downtown skyline, but through his noise-cancelling earbuds, the lo-fi beats kept playing. Floor 43 was only twelve stories away.',
    threeElements: {
      character: {
        name: 'The Delivery Courier',
        role: 'Character / Unaware Courier',
        description:
          'An Asian delivery guy in uniform, holding a food bag and his phone.',
        image: '/images/elevator-delivery.jpg',
        quirk: 'Obsessed with maintaining his 5-star courier rating and delivering the hot food on time.',
      },
      place: {
        name: 'Inside the Rising Elevator',
        role: 'Location / Ascending Container',
        description:
          'Inside a rising elevator, passing the 30th floor on its way to the 43rd floor.',
        image: '/images/elevator-delivery.jpg',
        hazard: 'Suspended in mid-air on high-tension cables; when power cuts, the elevator becomes an inescapable trap.',
      },
      world: {
        name: 'Day 1: Outbreak',
        role: 'Time / Zero Hour Outbreak',
        description:
          'Day 1 of the zombie apocalypse.',
        image: '/images/elevator-delivery.jpg',
        rule: 'Emergency cell broadcasts and building power grids are in their final minutes before complete citywide failure.',
      },
    },
  },

  // 3. STEAMPUNK WORLD CHALLENGE
  {
    id: 'steampunk-world',
    themeKey: 'steampunk',
    type: 'world',
    typeLabel: 'World Challenge',
    badge: 'CLOCKWORK ODYSSEY',
    badgeEmoji: '⚙️',
    universe: 'Universe: Aethelgard Isles',
    title: 'The Clockwork Archipelago',
    tagline: 'The Great Celestial Pendulum has begun swaying backwards—unspooling centuries of forgotten memories.',
    genre: 'Speculative Victorian Steampunk',
    synopsis:
      'In a realm suspended over liquid mercury, celestial gears physicalize time. The Great Pendulum has begun swaying backwards—unspooling centuries of forgotten memories while spectral echoes demand stolen time back.',
    coverImage: '/images/weekly-world-cover.jpg',
    accentColor: '#c2593f',
    difficulty: 'Advanced',
    estimatedTime: '30–60 Mins',
    participantsCount: 984,
    wordGoal: '2,000 – 4,500 words',
    survivalConstraints: [
      'Every minute the pendulum swings counter-clockwise, a resident forgets one formative life memory.',
      'Vessels travelling over the mercury seas must keep their escapement valves pressurized or sink under mercury vapor.',
      'Spectral echoes take physical form during midnight alignment, claiming brass keepsakes as collateral.',
    ],
    incitingSparks: [
      'The sky-clock of Aethelgard skips thirteen seconds, causing every pocket watch in the city to run in reverse.',
      'A diving bell emerges from the mercury sea carrying a manuscript written in ink that changes color with the reader’s pulse.',
      'A rogue clocktower artisan installs an escapement wheel that freezes gravity within a five-block radius.',
    ],
    starterHook:
      'The chime should have rung on the hour. Instead, the brass hammer struck backwards against the dampening pin, a hollow thud that reverberated across the suspension bridges of Aethelgard. In the town square below, three elders looked at their grandchildren and asked who they were.',
  },

  // 4. STEAMPUNK THREE ELEMENTS CHALLENGE
  {
    id: 'steampunk-triad',
    themeKey: 'steampunk',
    type: 'triad',
    typeLabel: 'Three Elements Triad',
    badge: 'SPECTRAL CLOCKWORK',
    badgeEmoji: '🕰️',
    universe: 'Universe: Aethelgard Isles',
    title: 'Echoes of the Submerged Scriptorium',
    tagline: 'Combine disgraced artisan Silas Thorne, the Submerged Scriptorium, and inverted gravity into a masterwork.',
    genre: 'Literary Clockwork Fantasy',
    synopsis:
      'Featuring Silas Thorne in the flooded cathedral of the Submerged Scriptorium, set in the shifting gravity of Solas Inverted.',
    coverImage: '/images/place-scriptorium.jpg',
    accentColor: '#ea580c',
    difficulty: 'Intermediate',
    estimatedTime: '20–40 Mins',
    participantsCount: 1102,
    wordGoal: '1,800 – 3,500 words',
    survivalConstraints: [
      'Silas Thorne cannot speak a falsehood without his synchronized pocket watch skipping a heart-wrenching beat.',
      'Reading in the Scriptorium requires diving in brass helmets with limited air reservoirs.',
      'Gravity inversions occur without warning whenever the lunar eclipse reaches totality.',
    ],
    incitingSparks: [
      'Silas discovers a glass folio submerged in the deepest vault containing the blueprinted clockwork schematic of his own ribcage.',
      'The eclipse strikes while scholars are underwater; the water begins pouring toward the cathedral ceiling.',
      'A rival artisan accuses Silas of stealing the master spring of the Scriptorium’s bell tower.',
    ],
    starterHook:
      'Silas Thorne pressed his thumb against the bevel of his gold pocket watch. Inside his chest, his heart matched the rapid flutter of the tourbillon. "I did not open the forbidden vault," he whispered to the magistrate. The watch gave a sharp, agonizing click—and his heart skipped.',
    threeElements: {
      character: {
        name: 'Silas Thorne',
        role: 'Protagonist / Disgraced Artisan',
        description:
          'Disgraced clocktower artisan with a pocket watch counting down his heartbeats; cannot lie without skipping a beat.',
        image: '/images/character-silas.jpg',
        quirk: 'Compulsively winds clockwork gears with his left thumb whenever under severe duress.',
      },
      place: {
        name: 'The Submerged Scriptorium',
        role: 'Setting / Cathedral Vault',
        description:
          'A cathedral library submerged in bioluminescent salt water, where scholars dive to read waterproof glass manuscripts.',
        image: '/images/place-scriptorium.jpg',
        hazard: 'Subsurface currents periodically sweep loose glass folios into spinning turbine water pumps.',
      },
      world: {
        name: 'Solas Inverted',
        role: 'World Anomaly / Shifting Gravity',
        description:
          'A realm where gravity reverses whenever an eclipse strikes, forcing architecture to span across both ceilings and floors.',
        image: '/images/world-solas.jpg',
        rule: 'Heavy furniture and ink wells must be bolted down to bronze moorings at all times.',
      },
    },
  },

  // 5. DARK FANTASY WORLD CHALLENGE
  {
    id: 'dark-fantasy-world',
    themeKey: 'dark-fantasy',
    type: 'world',
    typeLabel: 'World Challenge',
    badge: 'ELDRITCH TWILIGHT',
    badgeEmoji: '🌑',
    universe: 'Universe: The Ashen Veil',
    title: 'Cathedral of the Hollow Eclipse',
    tagline: 'Memories are weighed on cathedral scales before commoners can purchase bread; dead gods slumber below.',
    genre: 'Dark Gothic Fantasy',
    synopsis:
      'A gothic kingdom bathed in perpetual violet twilight, where memories are weighed on cathedral scales before commoners can purchase bread and dead gods slumber beneath the catacombs.',
    coverImage: '/images/place-scriptorium.jpg',
    accentColor: '#7c3aed',
    difficulty: 'Master (Grimdark)',
    estimatedTime: '25–50 Mins',
    participantsCount: 1675,
    wordGoal: '2,000 – 4,000 words',
    survivalConstraints: [
      'To pass through city gates or purchase supplies, characters must surrender a cherished memory onto the brass balance.',
      'Violet twilight drains physical endurance; torches must be lit with sanctified tallow.',
      'Speaking the true names of the slumbering entities induces temporary sensory blindness.',
    ],
    incitingSparks: [
      'A mother brings a memory of her lost child to the Cathedral scales, but the pan tilts upward—the memory has been forged.',
      'The bells in the Hollow Eclipse Cathedral chime thirteen times, and statues in the crypt begin weeping black oil.',
      'An inquisitor discovers an illegal contraband market dealing in stolen memories stored in blown-glass vials.',
    ],
    starterHook:
      'The scale pan groaned beneath the silver vial. "That memory is only worth two loaves," the veiled prelate intoned, his face hidden behind obsidian velvet. "Surrender your mother’s wedding song, or your children go hungry tonight."',
  },

  // 6. DARK FANTASY THREE ELEMENTS CHALLENGE
  {
    id: 'dark-fantasy-triad',
    themeKey: 'dark-fantasy',
    type: 'triad',
    typeLabel: 'Three Elements Triad',
    badge: 'OCCULT CONSPIRACY',
    badgeEmoji: '🩸',
    universe: 'Universe: The Ashen Veil',
    title: 'Chronicles of the Broken Seal',
    tagline: 'Lady Veronique, the Bleeding Crypts of Morvath, and the Weeping Firmament collide in an occult trial.',
    genre: 'Eldritch Fantasy',
    synopsis:
      'Featuring Lady Veronique in the Bleeding Crypts of Morvath, beneath the weeping firmament of the Ashen Veil.',
    coverImage: '/images/place-scriptorium.jpg',
    accentColor: '#9333ea',
    difficulty: 'Intermediate',
    estimatedTime: '20–40 Mins',
    participantsCount: 890,
    wordGoal: '1,500 – 3,000 words',
    survivalConstraints: [
      'Lady Veronique’s shadow always moves three seconds ahead, giving her premonitions of danger at great mental cost.',
      'The crypt stones leak warm ichor whenever a vow is broken within five leagues.',
      'Dead constellations raining from the sky burn through armor and stone like molten silver.',
    ],
    incitingSparks: [
      'Lady Veronique’s shadow raises a dagger toward a trusted ally three seconds before the ally even draws their blade.',
      'The weeping ichor in the Morvath crypts suddenly flows in reverse, bubbling upward into the cathedral altar.',
      'A falling star crashes through the cathedral spire, embedding a silver needle that whispers in dead languages.',
    ],
    starterHook:
      'Her shadow drew a blade three paces before Veronique reached the doorway. She paused, boot hovering over the cold flagstone, watching the silhouette on the stone wall raise its hand to strike. Three seconds later, an arrow cleaved through the archway right where her neck would have been.',
    threeElements: {
      character: {
        name: 'Lady Veronique of the Broken Seal',
        role: 'Protagonist / Occult Scholar',
        description:
          'An occult scholar whose shadow moves three seconds ahead of her body, warning her of impending betrayals.',
        image: '/images/character-silas.jpg',
        quirk: 'Keeps her eyes lowered to study shadows rather than looking directly at people’s faces.',
      },
      place: {
        name: 'The Bleeding Crypts of Morvath',
        role: 'Setting / Underground Catacombs',
        description:
          'An ancient subterranean labyrinth where cathedral stones weep warm ichor whenever ancient oaths are broken.',
        image: '/images/place-scriptorium.jpg',
        hazard: 'The ichor fumes cause vivid hallucinations of ancestors’ final deaths.',
      },
      world: {
        name: 'The Weeping Firmament',
        role: 'World Anomaly / Night Sky',
        description:
          'A cosmology where dead constellations fall like silver needles into the black void sea.',
        image: '/images/world-solas.jpg',
        rule: 'Looking directly at falling star needles causes retinal crystallization.',
      },
    },
  },

  // 7. CYBERPUNK WORLD CHALLENGE
  {
    id: 'cyberpunk-world',
    themeKey: 'cyberpunk',
    type: 'world',
    typeLabel: 'World Challenge',
    badge: 'HIGH-TECH DYSTOPIA',
    badgeEmoji: '⚡',
    universe: 'Universe: OmniCore 2099',
    title: 'Neon Shroud: Sector 9',
    tagline: 'Smuggle a prototype synthetic soul past corporate android enforcers beneath endless acid rain.',
    genre: 'Cyberpunk Noir',
    synopsis:
      'A rain-drenched megacity shrouded in holographic smog, where neural memory cartridges are the highest currency on the black market and memory brokers barter in stolen identities.',
    coverImage: '/images/place-silo.jpg',
    accentColor: '#0284c7',
    difficulty: 'Survivalist (High)',
    estimatedTime: '20–45 Mins',
    participantsCount: 1320,
    wordGoal: '1,500 – 3,500 words',
    survivalConstraints: [
      'Acid rain strips skin and chrome within twenty minutes of unprotected exposure.',
      'Corporate surveillance satellites run orbital facial recognition every ninety seconds.',
      'Neural cartridges overheat and permanently wipe data if not kept below sub-zero temperatures.',
    ],
    incitingSparks: [
      'A courier delivers a cryogenic briefcase containing a neural cartridge stamped with your own childhood memories.',
      'The megacity power grid drops offline across forty vertical levels, trapping android enforcers in the dark.',
      'An unlicensed street medic detects an active military kill-switch implanted behind your retinal display.',
    ],
    starterHook:
      'Acid rain sizzled against the brim of his reinforced coat, leaving tiny pockmarks that glowed toxic yellow before fading. In his breast pocket, the cooling gel of the neural cartridge was warming up fast. Six minutes until the data inside turned to molten slag.',
  },

  // 8. CYBERPUNK THREE ELEMENTS CHALLENGE
  {
    id: 'cyberpunk-triad',
    themeKey: 'cyberpunk',
    type: 'triad',
    typeLabel: 'Three Elements Triad',
    badge: 'SYNTHETIC WIRE',
    badgeEmoji: '🤖',
    universe: 'Universe: OmniCore 2099',
    title: 'Static on the Neon Frequency',
    tagline: 'Unlicensed surgeon Ren "Glitch", the Neon Spire Bazaar, and the electrified Grid Overcast in a deadly sprint.',
    genre: 'Cyberpunk Thriller',
    synopsis:
      'Featuring Ren "Glitch" in the vertical shantytowns of the Neon Spire Bazaar, beneath the electrified Grid Overcast.',
    coverImage: '/images/world-salted.jpg',
    accentColor: '#06b6d4',
    difficulty: 'Intermediate',
    estimatedTime: '25–45 Mins',
    participantsCount: 1045,
    wordGoal: '1,800 – 3,800 words',
    survivalConstraints: [
      'Ren speaks only through decoded audio bursts transmitted over shortwave radio bands.',
      'The Neon Spire Bazaar hangs 200 stories in the air; power outages cause anti-grav stalls.',
      'Synthetic lightning strikes from the Grid Overcast re-wire neural implants indiscriminately.',
    ],
    incitingSparks: [
      'A wounded operative arrives on Ren’s surgical table carrying an experimental chip that broadcasts everyone’s secrets within a 50-meter radius.',
      'A synthetic lightning storm shorts out the stabilizer cables of the Bazaar’s lower 50 floors.',
      'Corporate drones descend on the surgery suite demanding the return of a classified bio-processor.',
    ],
    starterHook:
      'Static hissed through the speaker taped to Ren’s collarbone. *Two-dash-four-zero-kilo-hertz,* the radio crackled in clipped military cadence before his real voice caught up. "Hold the clamps," he told the scavenger on the rusted table. "If the lightning hits that antenna outside, we both wake up fried."',
    threeElements: {
      character: {
        name: 'Ren "Glitch" — Unlicensed Surgeon',
        role: 'Protagonist / Tech-Healer',
        description:
          'An underground tech-healer who speaks only in audio frequencies decoded by obsolete shortwave radios.',
        image: '/images/character-jax.jpg',
        quirk: 'Constantly taps radio dials to find clean frequencies free of corporate surveillance chatter.',
      },
      place: {
        name: 'The Neon Spire Bazaar',
        role: 'Setting / Vertical Shantytown',
        description:
          'A dizzying 200-story vertical shantytown hanging beneath the underbelly of corporate sky-platforms.',
        image: '/images/place-silo.jpg',
        hazard: 'Platform walkways have no guardrails; a loose bolt can drop you into the smog-choked abyss.',
      },
      world: {
        name: 'The Grid Overcast',
        role: 'World Phenomenon / Electrified Sky',
        description:
          'An electrified stratosphere where rogue synthetic consciousnesses pulse as synthetic lightning storms.',
        image: '/images/world-salted.jpg',
        rule: 'Every metallic object on exterior terraces must be grounded with thick copper cabling.',
      },
    },
  },
];

export function getChallengeById(id: string): ChallengeItem | undefined {
  return ALL_CHALLENGES.find((c) => c.id === id);
}

export function getChallengesByTheme(themeKey: NarrativeTheme): ChallengeItem[] {
  return ALL_CHALLENGES.filter((c) => c.themeKey === themeKey);
}
