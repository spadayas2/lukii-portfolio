import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

type SectionProps = {
  id: string
  label: string
  title: string
  lead: string
  children: ReactNode
  className?: string
}

export function Section({ id, label, title, lead, children, className = '' }: SectionProps) {
  const reduce = useReducedMotion()

  return (
    <section id={id} className={`section section--split ${className}`.trim()}>
      <div className="section__inner">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="section__label">{label}</span>
          <h2 className="section__title">{title}</h2>
          <p className="section__lead">{lead}</p>
        </motion.div>
        {children}
      </div>
    </section>
  )
}
