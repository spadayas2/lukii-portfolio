import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import type { GameItem } from '../data/work'

type GamesGridProps = {
  games: GameItem[]
}

export function GamesGrid({ games }: GamesGridProps) {
  const reduce = useReducedMotion()

  return (
    <div className="skills-grid">
      {games.map((game, i) => (
        <motion.div
          key={game.id}
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ delay: i * 0.04, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link to={`/play/${game.id}`} className="skill-card">
            <div
              className="skill-card__art"
              style={{ ['--skill-accent' as string]: game.accent }}
              data-game={game.id}
            >
              <span className="skill-card__index">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="skill-card__mark">{game.title.slice(0, 1)}</span>
            </div>
            <div className="skill-card__meta">
              <span className="skill-card__type">Skill · {game.genre}</span>
              <h3 className="skill-card__title">{game.title}</h3>
              <p className="skill-card__blurb">{game.blurb}</p>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
