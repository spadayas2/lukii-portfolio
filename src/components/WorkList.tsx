import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { WorkItem } from '../data/work'

type WorkListProps = {
  items: WorkItem[]
}

export function WorkList({ items }: WorkListProps) {
  const reduce = useReducedMotion()

  return (
    <div className="work-list">
      {items.map((item, i) => {
        const inner = (
          <>
            <span className="work-item__tag">{item.tag}</span>
            <div>
              <h3 className="work-item__title">{item.title}</h3>
              <p className="work-item__desc">{item.description}</p>
            </div>
            <span className="work-item__meta">{item.meta}</span>
          </>
        )

        return (
          <motion.article
            key={item.id}
            className="work-item"
            initial={reduce ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: i * 0.06, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            {item.href ? (
              item.href.startsWith('/') ? (
                <Link className="work-item__link" to={item.href}>
                  {inner}
                </Link>
              ) : (
                <a className="work-item__link" href={item.href} target="_blank" rel="noreferrer">
                  {inner}
                </a>
              )
            ) : (
              inner
            )}
          </motion.article>
        )
      })}
    </div>
  )
}
