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
  // 1. APOCALYPTIC WORLD CHALLENGE
  {
    id: 'apocalyptic-world',
    themeKey: 'apocalyptic',
    type: 'world',
    typeLabel: 'World Challenge',
    badge: 'HOTTEST SURVIVAL CHALLENGE',
    badgeEmoji: '🔥',
    universe: 'Universe: The Cinder Wastes',
    title: 'The Obsidian Rustbelt',
    tagline: 'Survive razor obsidian glass dust storms and find subterranean aquifers before the Ash Monsoon strikes.',
    genre: 'Post-Apocalyptic Survival',
    synopsis:
      'A scorched post-collapse Earth where radioactive dust storms crystallize into razor obsidian glass. The last wandering cartographers trace dormant geothermal vents before the Ash Monsoon strikes.',
    coverImage: '/images/apocalyptic-cover.jpg',
    accentColor: '#d97706',
    difficulty: 'Survivalist (High)',
    estimatedTime: '20–45 Mins',
    participantsCount: 1482,
    wordGoal: '1,500 – 3,500 words',
    survivalConstraints: [
      'Radiation levels spike at twilight; all surface travel must pause when dosimeters exceed 250 mSv.',
      'Water is the only valid barter currency; clean aquifers are guarded by subterranean silo sentries.',
      'Electromagnetic storms render compasses and digital navigation useless; navigate strictly by geothermal heat plumes.',
    ],
    incitingSparks: [
      'Your Geiger dosimeter clicks frantically inside a fallout shelter that was supposed to be completely sealed.',
      'A scavenger convoy arrives at the crater rim carrying a water canister sealed with a pre-collapse military seal.',
      'The sky turns razor-amber three hours before schedule—the Ash Monsoon has arrived ahead of time.',
    ],
    starterHook:
      'The needle of the brass dosimeter tapped against glass, three rhythmic clicks every breath. Jax did not need to check the horizon to know the ash storm had shifted direction—the taste of ionized copper had already coated his tongue.',
  },

  // 2. APOCALYPTIC THREE ELEMENTS CHALLENGE
  {
    id: 'apocalyptic-triad',
    themeKey: 'apocalyptic',
    type: 'triad',
    typeLabel: 'Three Elements Triad',
    badge: 'POPULAR TRIAD',
    badgeEmoji: '⚡',
    universe: 'Universe: The Cinder Wastes',
    title: 'Echoes of the Obsidian Rustbelt',
    tagline: 'Weave Jax Vance, the Ruined Silo of Babel, and the Salted Horizon into a harrowing collapse narrative.',
    genre: 'Post-Apocalyptic Speculative',
    synopsis:
      'Featuring Jax Vance in the multi-tiered barter bazaar of the Ruined Silo of Babel, set across the dead expanse of The Salted Horizon.',
    coverImage: '/images/place-silo.jpg',
    accentColor: '#f59e0b',
    difficulty: 'Intermediate',
    estimatedTime: '25–50 Mins',
    participantsCount: 2139,
    wordGoal: '2,000 – 4,000 words',
    survivalConstraints: [
      'Jax Vance must rely on his wrist-mounted dosimeter during a high-stakes negotiation.',
      'The transaction or encounter must take place within the precarious metal catwalks of the Babel Silo.',
      'The looming threat of the six-month toxic sun cycle across the Salted Horizon must drive the plot clock.',
    ],
    incitingSparks: [
      'A trader in the Silo offers an uncorrupted pre-collapse hydro-filter, but demands safe transit across the Salted Horizon.',
      'Jax’s dosimeter detects a radiation surge coming not from the ruins, but from the person sitting across his barter table.',
      'The structural cables supporting the Silo’s fourth tier begin to snap under the weight of incoming scavenger convoys.',
    ],
    starterHook:
      'Four hundred feet above the stagnant emerald pool at the bottom of the missile silo, Jax Vance tightened the leather strap of his brass dosimeter. Below him, three hundred scavengers bartered rusted brass fittings for half-liters of boiled condensate.',
    threeElements: {
      character: {
        name: 'Jax Vance — The Geiger Walker',
        role: 'Protagonist / Relic Scavenger',
        description:
          'A solitary salvage scavenger who navigates by the ticking chatter and amber glow of a brass dosimeter grafted to his wrist.',
        image: '/images/character-jax.jpg',
        quirk: 'Cannot sleep without the steady rhythmic ticking of a geiger counter running beside his head.',
      },
      place: {
        name: 'The Ruined Silo of Babel',
        role: 'Setting / Subterranean Haven',
        description:
          'A colossal decommissioned subterranean missile silo converted into a multi-tiered barter bazaar and fortress above emerald pools.',
        image: '/images/place-silo.jpg',
        hazard: 'Tiers are linked by rusted gantry chains; one misstep sends a scavenger plunging into toxic missile runoff.',
      },
      world: {
        name: 'The Salted Horizon',
        role: 'World Phenomenon / Expanse',
        description:
          'A dead ocean bed where petrified shipwrecks and dried cargo vessels serve as trade outposts during the six-month toxic sun cycle.',
        image: '/images/world-salted.jpg',
        rule: 'Air pressure drops sharply at dusk, releasing crystallized salt fumes that corrode unprotected respirators in minutes.',
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
