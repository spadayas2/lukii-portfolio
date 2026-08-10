import { motion } from 'framer-motion'
import heroArt from '../assets/hero.png'
import { SignalRow } from './SignalRow'

const ease = [0.16, 1, 0.3, 1] as const

export function Hero() {
  return (
    <section className="hero hero--class" aria-label="Introduction">
      <div className="hero__panel">
        <motion.div
          className="hero__art-wrap"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.15 }}
        >
          <img className="hero__art" src={heroArt} alt="" />
        </motion.div>

        <motion.div
          className="hero__dossier"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.22 }}
        >
          <h1 className="hero__brand" id="hero-brand">
            Lukii<span className="mark">.</span>
          </h1>
          <SignalRow />
          <p className="hero__blurb">
            Creative systems, playable builds, and content ops — precision in the dark.
          </p>

          <dl className="hero__stats">
            <div>
              <dt>Focus</dt>
              <dd>Games · Craft · Ops</dd>
            </div>
            <div>
              <dt>Style</dt>
              <dd>Dark · Sharp · Clean</dd>
            </div>
          </dl>

          <div className="hero__cta">
            <a className="btn btn--primary" href="#games">
              View skills
            </a>
            <a className="btn btn--ghost" href="#contact">
              Contact
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
