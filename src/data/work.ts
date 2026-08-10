export type WorkItem = {
  id: string
  tag: string
  title: string
  description: string
  meta: string
  href?: string
}

export type GameItem = {
  id: string
  title: string
  blurb: string
  stack: string
  genre: string
  accent: string
  /** Playable build path under /games/... */
  playPath: string
}

export const games: GameItem[] = [
  {
    id: 'heatwave',
    title: 'HEATWAVE',
    blurb:
      'Pixel-art DJ deck builder in a Miami Heat cyberpunk night. Match the crowd’s groove, raise Hype, own the Finale.',
    stack: 'Vite · Canvas · Web Audio',
    genre: 'DJ deckbuilder',
    accent: '#ff4d6d',
    playPath: '/games/heatwave/',
  },
  {
    id: 'ascend-deck',
    title: 'Ascend Deck',
    blurb:
      'Slay the Spire–inspired roguelike deckbuilder. Climb the forge, draft cards, defeat the Ember Sovereign.',
    stack: 'React · TypeScript',
    genre: 'Deckbuilder',
    accent: '#c45c2a',
    playPath: '/games/ascend-deck/',
  },
  {
    id: 'expedition-combat',
    title: 'Expedition Combat',
    blurb:
      'Reactive turn-based combat with dodge, parry, QTEs, and cinematic camera — Clair Obscur energy.',
    stack: 'Phaser',
    genre: 'Turn-based',
    accent: '#6b8cff',
    playPath: '/games/expedition-combat/',
  },
  {
    id: 'fractal-pulse',
    title: 'Fractal Pulse',
    blurb:
      'Death Star trench run through a fractal corridor. Walls pulse with the beat; steer the tunnel.',
    stack: 'WebGL · Web Audio',
    genre: 'Rhythm flyer',
    accent: '#3dd6c6',
    playPath: '/games/fractal-pulse/',
  },
  {
    id: 'stellar-sync',
    title: 'Stellar Sync',
    blurb:
      'Connect stars into constellations on the beat. Celestial rhythm charting across a galaxy.',
    stack: 'React · Canvas · Audio',
    genre: 'Rhythm',
    accent: '#d4a017',
    playPath: '/games/stellar-sync/',
  },
  {
    id: 'wildwood-survivors',
    title: 'Wildwood Survivors',
    blurb:
      'Vampire Survivors–style alpine twin-stick. Music intensity spawns rabbits, birds, and bears.',
    stack: 'Canvas · Web Audio',
    genre: 'Survival',
    accent: '#5a8f4d',
    playPath: '/games/wildwood-survivors/',
  },
  {
    id: 'tower-defense',
    title: 'Castle Guard',
    blurb:
      'Place archers and cannons on the path. Stop goblin waves before they reach the castle.',
    stack: 'Browser TD',
    genre: 'Tower defense',
    accent: '#b33b3b',
    playPath: '/games/tower-defense/',
  },
  {
    id: 'maple-meadow',
    title: 'Maple Meadow',
    blurb:
      'MapleStory-inspired side-scroller. Jump, slash cute monsters, cast Meadow Wave across the hills.',
    stack: 'Vite · Platformer',
    genre: 'Platformer',
    accent: '#7ec850',
    playPath: '/games/maple-meadow/',
  },
]

export const craftWork: WorkItem[] = [
  {
    id: 'ink-identity',
    tag: 'Visual',
    title: 'Ink & steel identity studies',
    description:
      'Moodboards, mark explorations, and motion rules for dark, precise brand systems.',
    meta: 'Craft',
  },
  {
    id: 'ui-stealth',
    tag: 'UI',
    title: 'Painterly interface language',
    description:
      'Uneven frames, guild-hall chrome, and micro-interactions that feel hand-brushed.',
    meta: 'Systems',
  },
]

export const opsWork: WorkItem[] = [
  {
    id: 'ember-sovereign',
    tag: 'Guide',
    title: 'Ember Sovereign — first clear guide',
    description:
      'Sample player-facing guide written like a Gaming Content Ops deliverable: clear, scannable, actionable.',
    meta: 'Ops Lab',
    href: '/ops/ember-sovereign',
  },
  {
    id: 'patch-notes',
    tag: 'Patch notes',
    title: 'Season of Ash — notes format',
    description:
      'Hierarchy and tone for communicating balance changes players actually understand.',
    meta: 'Coming soon',
  },
]
