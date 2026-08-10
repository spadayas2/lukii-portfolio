import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getGuide } from '../data/guides'

export function GuidePage() {
  const { slug } = useParams()
  const guide = slug ? getGuide(slug) : undefined

  if (!guide) {
    return (
      <div className="not-found">
        <h1>404</h1>
        <p>This scroll was never written.</p>
        <Link className="btn btn--ghost" to="/">
          Return home
        </Link>
      </div>
    )
  }

  return (
    <article className="guide-page">
      <Link className="guide-page__back" to="/#ops">
        ← Ops Lab
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="guide-page__meta">{guide.game}</p>
        <h1>{guide.title}</h1>
        <p className="guide-page__intro">{guide.intro}</p>

        {guide.sections.map((section) => (
          <section key={section.heading} className="guide-block">
            <h2>{section.heading}</h2>
            <p>{section.body}</p>
            {section.bullets && (
              <ul>
                {section.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            )}
            {section.callout && <p className="callout">{section.callout}</p>}
          </section>
        ))}
      </motion.div>
    </article>
  )
}
