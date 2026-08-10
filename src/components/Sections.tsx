import { motion, useReducedMotion } from 'framer-motion'
import { Section } from './Section'
import { GamesGrid } from './GamesGrid'
import { games } from '../data/work'
/* craftWork / opsWork kept in ../data/work — sealed until the dojo opens */

type SealProps = {
  stamp: string
  title: string
  note: string
}

function SealNotice({ stamp, title, note }: SealProps) {
  const reduce = useReducedMotion()

  return (
    <motion.aside
      className="seal-notice"
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      aria-label="Under construction"
    >
      <div className="seal-notice__stamp">{stamp}</div>
      <div className="seal-notice__body">
        <p className="seal-notice__status">Mission sealed</p>
        <h3 className="seal-notice__title">{title}</h3>
        <p className="seal-notice__note">{note}</p>
      </div>
    </motion.aside>
  )
}

export function GamesSection() {
  return (
    <Section
      id="games"
      label="01 — Skills"
      title="Loadout"
      lead="Playable builds as class skills — select one to enter."
    >
      <GamesGrid games={games} />
    </Section>
  )
}

export function CraftSection() {
  return (
    <Section
      id="craft"
      label="02 — Craft"
      title="Technique"
      lead="Visual language and interface systems behind the work."
    >
      <SealNotice
        stamp="封印"
        title="Scrolls still forging in the shadows"
        note="The craft dojo is under renovation. Technique samples return after nightfall — when the ink dries."
      />
    </Section>
  )
}

export function OpsSection() {
  return (
    <Section
      id="ops"
      label="03 — Ops"
      title="Field reports"
      lead="Content ops samples — guides and notes written for players."
    >
      <SealNotice
        stamp="極秘"
        title="Clan clearance pending"
        note="Field reports are classified until the briefing is complete. Scouts are gathering intel — stand by."
      />
    </Section>
  )
}

export function ContactSection() {
  return (
    <Section
      id="contact"
      label="04 — Contact"
      title="Signal"
      lead="Open for creative, content ops, and hybrid builder roles."
      className="contact"
    >
      <div className="contact__links">
        <a className="btn btn--ghost" href="mailto:hello@lukii.dev">
          Email
        </a>
        <a className="btn btn--ghost" href="https://github.com/" target="_blank" rel="noreferrer">
          GitHub
        </a>
        <a
          className="btn btn--ghost"
          href="https://www.linkedin.com/"
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn
        </a>
      </div>
    </Section>
  )
}
