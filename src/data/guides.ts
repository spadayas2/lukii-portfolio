export type GuideSection = {
  heading: string
  body: string
  bullets?: string[]
  callout?: string
}

export type Guide = {
  slug: string
  game: string
  title: string
  intro: string
  sections: GuideSection[]
}

export const guides: Guide[] = [
  {
    slug: 'ember-sovereign',
    game: 'Ascend Deck · Sample Ops',
    title: 'Ember Sovereign — first clear guide',
    intro:
      'A sample player guide written to show how I’d structure Gaming Content Operations work: scannable, specific, and respectful of player time.',
    sections: [
      {
        heading: 'What you’re fighting',
        body: 'The Ember Sovereign is a two-phase forge boss. Phase one punishes greedy multi-card turns. Phase two rewards setups that leave block and a kill window.',
        bullets: [
          'Phase 1: 180 HP · applies Heat stacks that convert into burn damage on your turn',
          'Phase 2: at 50% HP · gains Ember Armor (block that regenerates unless broken in one turn)',
        ],
      },
      {
        heading: 'Recommended loadout',
        body: 'Prioritize consistent block and one reliable finisher. You do not need maximum damage — you need a clean break window.',
        bullets: [
          '2–3 reliable Block cards (preferably that also draw or exhaust clutter)',
          'At least one “break” tool: vulnerable, armor shred, or a single big strike',
          'Avoid pure glass decks unless you already clear Act 2 without healing',
        ],
        callout:
          'Content note: Frame this as “recommended for first clears,” not “the only meta.” Players trust guides that leave room for their build.',
      },
      {
        heading: 'Turn plan (Phase 1)',
        body: 'Survive Heat, don’t race it.',
        bullets: [
          'Turns 1–2: establish block and thin your hand — do not spend everything on damage',
          'If Heat ≥ 3: prioritize block over chip damage',
          'Save your strongest attack for the turn after you stabilize',
        ],
      },
      {
        heading: 'Turn plan (Phase 2)',
        body: 'Ember Armor resets if you fail to break it. Treat break turns as scheduled events.',
        bullets: [
          'Build to a break turn: vulnerable / shred → big hit',
          'If you cannot break armor this turn, play for survival and redraw',
          'After a successful break, dump damage immediately — the window is short',
        ],
        callout:
          'Common mistake: spending the break turn on setup cards. Setup belongs on the turn before.',
      },
      {
        heading: 'Quick troubleshooting',
        body: 'If players bounce, give them a short diagnosis path.',
        bullets: [
          'Dying to burn → you are ignoring Heat thresholds; add block density',
          'Stalling in Phase 2 → you lack a dedicated break card; draft one earlier',
          'Running out of cards → exhaust / thin earlier in the run, not at the boss',
        ],
      },
    ],
  },
]

export function getGuide(slug: string) {
  return guides.find((g) => g.slug === slug)
}
