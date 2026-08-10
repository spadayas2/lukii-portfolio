import { useEffect, useRef, useState } from 'react'

type SpyEye = {
  id: number
  x: number
  y: number
  size: number
}

const MAX_EYES = 2
const MIN_SIZE = 28
const MAX_SIZE = 64

function rand(min: number, max: number) {
  return min + Math.random() * (max - min)
}

/**
 * Lightweight ambient eyes — CSS circles, shared pointer + one rAF while active.
 * Appear staggered, track cursor, blink shut and vanish.
 */
export function WatchingEyes() {
  const [eyes, setEyes] = useState<SpyEye[]>([])
  const eyesRef = useRef(eyes)
  const mouse = useRef({ x: -9999, y: -9999 })
  const pupilNodes = useRef(new Map<number, HTMLSpanElement>())
  const lidNodes = useRef(new Map<number, HTMLSpanElement>())
  const eyeNodes = useRef(new Map<number, HTMLDivElement>())
  const nextId = useRef(0)
  const rafRef = useRef(0)

  eyesRef.current = eyes

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fine = window.matchMedia('(pointer: fine)').matches
    if (reduce || !fine) return

    let alive = true
    const timers = new Set<number>()
    let pageVisible = document.visibilityState === 'visible'

    const later = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => {
        timers.delete(id)
        fn()
      }, ms)
      timers.add(id)
      return id
    }

    const stopRaf = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = 0
      }
    }

    const tick = () => {
      if (!alive || eyesRef.current.length === 0) {
        rafRef.current = 0
        return
      }
      const { x: mx, y: my } = mouse.current
      for (const eye of eyesRef.current) {
        const pupil = pupilNodes.current.get(eye.id)
        if (!pupil) continue
        const dx = mx - eye.x
        const dy = my - eye.y
        const max = eye.size * 0.18
        const dist = Math.hypot(dx, dy) || 1
        const scale = Math.min(max, dist) / dist
        const px = dx * scale
        const py = dy * scale * 0.85 + eye.size * 0.06
        pupil.style.transform = `translate(${px}px, ${py}px)`
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    const ensureRaf = () => {
      if (!rafRef.current) rafRef.current = requestAnimationFrame(tick)
    }

    const removeEye = (id: number) => {
      setEyes((prev) => {
        const next = prev.filter((e) => e.id !== id)
        if (next.length === 0) stopRaf()
        return next
      })
      pupilNodes.current.delete(id)
      lidNodes.current.delete(id)
      eyeNodes.current.delete(id)
    }

    const blinkAway = (id: number) => {
      const lid = lidNodes.current.get(id)
      const wrap = eyeNodes.current.get(id)
      if (lid) lid.dataset.state = 'shut'
      if (wrap) wrap.dataset.state = 'leaving'
      later(() => removeEye(id), 280)
    }

    const spawn = () => {
      if (!alive || !pageVisible) return
      if (eyesRef.current.length >= MAX_EYES) return

      const id = ++nextId.current
      const size = rand(MIN_SIZE, MAX_SIZE)
      const margin = size * 0.6
      const eye: SpyEye = {
        id,
        x: rand(margin, window.innerWidth - margin),
        y: rand(margin + 56, window.innerHeight - margin),
        size,
      }

      setEyes((prev) => [...prev, eye])
      ensureRaf()

      // hold shut briefly, then blink open to rest
      later(() => {
        const lid = lidNodes.current.get(id)
        const wrap = eyeNodes.current.get(id)
        if (wrap) wrap.dataset.state = 'watching'
        if (lid) lid.dataset.state = 'rest'
      }, 120)

      later(() => {
        if (alive) blinkAway(id)
      }, rand(1800, 4200))
    }

    const scheduleSpawn = () => {
      if (!alive) return
      later(() => {
        if (!pageVisible) {
          scheduleSpawn()
          return
        }
        const slots = MAX_EYES - eyesRef.current.length
        if (slots > 0) {
          // random burst of 1..remaining slots
          const count = 1 + Math.floor(Math.random() * slots)
          for (let i = 0; i < count; i++) {
            later(() => {
              if (alive && pageVisible) spawn()
            }, i === 0 ? 0 : rand(160, 480))
          }
        }
        scheduleSpawn()
      }, rand(1400, 3200))
    }

    const onMove = (e: PointerEvent) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
    }

    const onVisibility = () => {
      pageVisible = document.visibilityState === 'visible'
      if (!pageVisible) {
        setEyes([])
        stopRaf()
        pupilNodes.current.clear()
        lidNodes.current.clear()
        eyeNodes.current.clear()
      }
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)
    scheduleSpawn()
    later(spawn, rand(600, 1200))

    return () => {
      alive = false
      for (const id of timers) window.clearTimeout(id)
      timers.clear()
      stopRaf()
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  if (eyes.length === 0) return null

  return (
    <div className="watching-eyes" aria-hidden="true">
      {eyes.map((eye) => (
        <div
          key={eye.id}
          className="spy-eye"
          data-state="entering"
          style={{
            left: eye.x,
            top: eye.y,
            width: eye.size,
            height: eye.size,
          }}
          ref={(el) => {
            if (el) eyeNodes.current.set(eye.id, el)
            else eyeNodes.current.delete(eye.id)
          }}
        >
          <span className="spy-eye__globe">
            <span
              className="spy-eye__pupil"
              ref={(el) => {
                if (el) pupilNodes.current.set(eye.id, el)
                else pupilNodes.current.delete(eye.id)
              }}
            />
          </span>
          <span
            className="spy-eye__lid"
            data-state="shut"
            ref={(el) => {
              if (el) lidNodes.current.set(eye.id, el)
              else lidNodes.current.delete(eye.id)
            }}
          />
        </div>
      ))}
    </div>
  )
}
