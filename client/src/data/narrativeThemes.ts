import type { NarrativeTheme, NarrativeThemeDefinition } from '../types';

export const NARRATIVE_THEMES: Record<NarrativeTheme, NarrativeThemeDefinition> = {
  apocalyptic: {
    id: 'apocalyptic',
    name: 'Apocalyptic & Wasteland Survival',
    badge: 'Scorched Dust & Relic Scavengers',
    tagline: 'Obsidian wastelands, radiation dosimeters, rusted missile silos, and the desperate fight for clean water.',
    description:
      'A scorched post-collapse Earth where radioactive dust storms crystallize into razor obsidian glass. The last wandering cartographers trace dormant geothermal vents before the Ash Monsoon strikes.',
    accentColor: '#d97706',
    weeklyWorld: {
      universe: 'Universe: The Cinder Wastes',
      title: 'The Obsidian Rustbelt',
      coverImage: '/images/apocalyptic-cover.jpg',
      description:
        'In a scorched post-collapse Earth where radioactive dust storms crystallize into razor obsidian glass, the last wandering cartographers trace dormant geothermal vents to locate pure subterranean aquifers before the Ash Monsoon strikes.',
      novelGenre: 'Post-Apocalyptic Survival',
      novelSynopsis:
        'A scorched post-collapse Earth where radioactive dust storms crystallize into razor obsidian glass. The last wandering cartographers trace dormant geothermal vents before the Ash Monsoon strikes.',
    },
    threeElements: {
      novelTitle: 'Echoes of the Obsidian Rustbelt',
      novelGenre: 'Post-Apocalyptic Speculative',
      novelSynopsis:
        'Featuring Jax Vance in the multi-tiered barter bazaar of the Ruined Silo of Babel, set across the dead expanse of The Salted Horizon.',
      character: {
        name: 'Jax Vance — The Geiger Walker',
        description:
          'A solitary salvage scavenger who navigates by the ticking chatter and amber glow of a brass dosimeter grafted to his wrist.',
        image: '/images/character-jax.jpg',
      },
      place: {
        name: 'The Ruined Silo of Babel',
        description:
          'A colossal decommissioned subterranean missile silo converted into a multi-tiered barter bazaar and fortress above emerald pools.',
        image: '/images/place-silo.jpg',
      },
      world: {
        name: 'The Salted Horizon',
        description:
          'A dead ocean bed where petrified shipwrecks and dried cargo vessels serve as trade outposts during the six-month toxic sun cycle.',
        image: '/images/world-salted.jpg',
      },
    },
  },
  steampunk: {
    id: 'steampunk',
    name: 'Clockwork & Victorian Steampunk',
    badge: 'Brass Gears & Celestial Sky-Islands',
    tagline: 'Celestial pendulums, mercury seas, submerged scriptoriums, and ticking heartbeats.',
    description:
      'A realm suspended over liquid mercury where celestial gears physicalize time and spectral echoes demand stolen time back.',
    accentColor: '#c2593f',
    weeklyWorld: {
      universe: 'Universe: Aethelgard Isles',
      title: 'The Clockwork Archipelago',
      coverImage: '/images/weekly-world-cover.jpg',
      description:
        'In a realm suspended over liquid mercury, celestial gears physicalize time. The Great Pendulum has begun swaying backwards—unspooling centuries of forgotten memories while spectral echoes demand stolen time back.',
      novelGenre: 'Speculative Fantasy',
      novelSynopsis:
        'A world of brass sky-islands suspended over mercury seas. The Great Celestial Pendulum has begun swaying backwards, unspooling centuries of forgotten memories.',
    },
    threeElements: {
      novelTitle: 'Echoes of the Submerged Scriptorium',
      novelGenre: 'Literary Fantasy',
      novelSynopsis:
        'Featuring Silas Thorne in the flooded cathedral of the Submerged Scriptorium, set in the shifting gravity of Solas Inverted.',
      character: {
        name: 'Silas Thorne',
        description:
          'Disgraced clocktower artisan with a pocket watch counting down his heartbeats; cannot lie without skipping a beat.',
        image: '/images/character-silas.jpg',
      },
      place: {
        name: 'The Submerged Scriptorium',
        description:
          'A cathedral library submerged in bioluminescent salt water, where scholars dive to read waterproof glass manuscripts.',
        image: '/images/place-scriptorium.jpg',
      },
      world: {
        name: 'Solas Inverted',
        description:
          'A realm where gravity reverses whenever an eclipse strikes, forcing architecture to span across both ceilings and floors.',
        image: '/images/world-solas.jpg',
      },
    },
  },
  'dark-fantasy': {
    id: 'dark-fantasy',
    name: 'Dark Fantasy & Eldritch Lore',
    badge: 'Hollow Eclipses & Bleeding Crypts',
    tagline: 'Occult scholars, weeping firmaments, forbidden grimoires, and cathedral scales.',
    description:
      'A gothic kingdom bathed in perpetual violet twilight, where memories are weighed on cathedral scales before commoners can purchase bread.',
    accentColor: '#7c3aed',
    weeklyWorld: {
      universe: 'Universe: The Ashen Veil',
      title: 'Cathedral of the Hollow Eclipse',
      coverImage: '/images/place-scriptorium.jpg',
      description:
        'A gothic kingdom bathed in perpetual violet twilight, where memories are weighed on cathedral scales before commoners can purchase bread and dead gods slumber beneath the catacombs.',
      novelGenre: 'Dark Gothic Fantasy',
      novelSynopsis:
        'In the Ashen Veil, human memories are harvested and weighed in the Cathedral of the Hollow Eclipse before the twilight bell tolls.',
    },
    threeElements: {
      novelTitle: 'Chronicles of the Broken Seal',
      novelGenre: 'Eldritch Fantasy',
      novelSynopsis:
        'Featuring Lady Veronique in the Bleeding Crypts of Morvath, beneath the weeping firmament of the Ashen Veil.',
      character: {
        name: 'Lady Veronique of the Broken Seal',
        description:
          'An occult scholar whose shadow moves three seconds ahead of her body, warning her of impending betrayals.',
        image: '/images/character-silas.jpg',
      },
      place: {
        name: 'The Bleeding Crypts of Morvath',
        description:
          'An ancient subterranean labyrinth where cathedral stones weep warm ichor whenever ancient oaths are broken.',
        image: '/images/place-scriptorium.jpg',
      },
      world: {
        name: 'The Weeping Firmament',
        description:
          'A cosmology where dead constellations fall like silver needles into the black void sea.',
        image: '/images/world-solas.jpg',
      },
    },
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk & High-Tech Noir',
    badge: 'Neon Smog & Rogue Synthetic Consciousness',
    tagline: 'Drying acid rain, neural memory cartridges, unlicensed cyber-surgeons, and corporate vertical spires.',
    description:
      'A rain-drenched megacity shrouded in holographic smog, where neural memory cartridges are the highest currency on the black market.',
    accentColor: '#0284c7',
    weeklyWorld: {
      universe: 'Universe: OmniCore 2099',
      title: 'Neon Shroud: Sector 9',
      coverImage: '/images/place-silo.jpg',
      description:
        'A rain-drenched megacity shrouded in holographic smog, where neural memory cartridges are the highest currency on the black market and memory brokers barter in stolen identities.',
      novelGenre: 'Cyberpunk Noir',
      novelSynopsis:
        'In Sector 9 beneath the acid rainfall, a memory broker must smuggle a prototype synthetic soul past corporate android enforcers.',
    },
    threeElements: {
      novelTitle: 'Static on the Neon Frequency',
      novelGenre: 'Cyberpunk Thriller',
      novelSynopsis:
        'Featuring Ren "Glitch" in the vertical shantytowns of the Neon Spire Bazaar, beneath the electrified Grid Overcast.',
      character: {
        name: 'Ren "Glitch" — Unlicensed Surgeon',
        description:
          'An underground tech-healer who speaks only in audio frequencies decoded by obsolete shortwave radios.',
        image: '/images/character-jax.jpg',
      },
      place: {
        name: 'The Neon Spire Bazaar',
        description:
          'A dizzying 200-story vertical shantytown hanging beneath the underbelly of corporate sky-platforms.',
        image: '/images/place-silo.jpg',
      },
      world: {
        name: 'The Grid Overcast',
        description:
          'An electrified stratosphere where rogue synthetic consciousnesses pulse as synthetic lightning storms.',
        image: '/images/world-salted.jpg',
      },
    },
  },
};
