import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { playKatanaSlash } from '../audio/katanaSlash'

type SliceIntroProps = {
  onComplete: () => void
}

/**
 * Full-black title gate: "Lukii." then scroll triggers a diagonal sword cut,
 * flash, and the screen splits apart to reveal the site.
 */
export function SliceIntro({ onComplete }: SliceIntroProps) {
  const reduce = useReducedMotion()
  const [phase, setPhase] = useState<'idle' | 'slash' | 'split' | 'done'>('idle')
  const locking = useRef(true)
  const started = useRef(false)

  useEffect(() => {
    if (reduce) {
      onComplete()
      return
    }

    document.body.style.overflow = 'hidden'

    const begin = () => {
      if (started.current) return
      started.current = true
      locking.current = false
      try {
        playKatanaSlash()
      } catch {
        /* autoplay / AudioContext edge cases */
      }
      setPhase('slash')
      window.setTimeout(() => setPhase('split'), 280)
      window.setTimeout(() => {
        setPhase('done')
        document.body.style.overflow = ''
        onComplete()
      }, 1100)
    }

    const onWheel = (e: WheelEvent) => {
      if (started.current) return
      if (e.deltaY > 8) {
        e.preventDefault()
        begin()
      }
    }

    const onKey = (e: KeyboardEvent) => {
      if (started.current) return
      if (e.key === 'ArrowDown' || e.key === ' ' || e.key === 'Enter' || e.key === 'PageDown') {
        e.preventDefault()
        begin()
      }
    }

    const onTouch = (e: TouchEvent) => {
      if (started.current) return
      e.preventDefault()
      begin()
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKey)
    window.addEventListener('touchstart', onTouch, { passive: false })

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('touchstart', onTouch)
    }
  }, [onComplete, reduce])

  if (phase === 'done' || reduce) return null

  const splitting = phase === 'split' || phase === 'slash'

  return (
    <AnimatePresence>
      <motion.div
        className="slice-intro"
        aria-hidden="true"
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Upper shard */}
        <motion.div
          className="slice-intro__shard slice-intro__shard--a"
          animate={
            phase === 'split'
              ? { x: '-18vw', y: '-22vh', rotate: -8, opacity: 0 }
              : { x: 0, y: 0, rotate: 0, opacity: 1 }
          }
          transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="slice-intro__face">
            <p className="slice-intro__name">
              Lukii<span>.</span>
            </p>
          </div>
        </motion.div>

        {/* Lower shard */}
        <motion.div
          className="slice-intro__shard slice-intro__shard--b"
          animate={
            phase === 'split'
              ? { x: '18vw', y: '24vh', rotate: 7, opacity: 0 }
              : { x: 0, y: 0, rotate: 0, opacity: 1 }
          }
          transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="slice-intro__face">
            <p className="slice-intro__name">
              Lukii<span>.</span>
            </p>
          </div>
        </motion.div>

        {/* Sword slash line */}
        <motion.div
          className="slice-intro__blade"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={
            splitting
              ? { scaleX: 1, opacity: [0, 1, 1, 0] }
              : { scaleX: 0, opacity: 0 }
          }
          transition={{ duration: 0.35, times: [0, 0.15, 0.7, 1], ease: 'easeOut' }}
        />

        {/* Tiny flash */}
        <motion.div
          className="slice-intro__flash"
          initial={{ opacity: 0 }}
          animate={phase === 'slash' || phase === 'split' ? { opacity: [0, 0.85, 0] } : { opacity: 0 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
        />

        {phase === 'idle' && (
          <p className="slice-intro__hint">Scroll to enter</p>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
