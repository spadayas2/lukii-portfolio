import { useEffect, useLayoutEffect, useRef } from 'react'

const COUNT = 12
/** squares per second — fast but continuous */
const SPEED = 10

/** Rolling grey highlight — continuous position for a smooth sweep */
export function SignalRow() {
  const rowRef = useRef<HTMLDivElement>(null)
  const cellsRef = useRef<(HTMLSpanElement | null)[]>([])

  useLayoutEffect(() => {
    const brand = document.getElementById('hero-brand')
    const row = rowRef.current
    if (!brand || !row) return

    const sync = () => {
      row.style.width = `${brand.getBoundingClientRect().width}px`
    }
    sync()

    const ro = new ResizeObserver(sync)
    ro.observe(brand)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const row = rowRef.current
    if (!row) return

    let frame = 0
    let pos = 0
    let last = performance.now()
    let visible = true
    let pageVisible = document.visibilityState === 'visible'

    const paint = () => {
      for (let i = 0; i < COUNT; i++) {
        const el = cellsRef.current[i]
        if (!el) continue
        const raw = Math.abs(i - pos)
        const dist = Math.min(raw, COUNT - raw)
        const opacity = Math.max(0.06, 1 - dist * 0.55)
        el.style.opacity = String(opacity)
        el.style.background = dist < 0.55 ? '#b0b0b0' : '#2a2a2a'
      }
    }

    const stop = () => {
      if (frame) {
        cancelAnimationFrame(frame)
        frame = 0
      }
    }

    const tick = (now: number) => {
      if (!visible || !pageVisible) {
        frame = 0
        return
      }
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      pos = (pos + SPEED * dt) % COUNT
      paint()
      frame = requestAnimationFrame(tick)
    }

    const start = () => {
      if (frame || !visible || !pageVisible) return
      last = performance.now()
      frame = requestAnimationFrame(tick)
    }

    const onVisibility = () => {
      pageVisible = document.visibilityState === 'visible'
      if (pageVisible) start()
      else stop()
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible) start()
        else stop()
      },
      { threshold: 0 },
    )
    io.observe(row)

    document.addEventListener('visibilitychange', onVisibility)
    start()

    return () => {
      stop()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <div className="signal-row" ref={rowRef} aria-hidden="true">
      {Array.from({ length: COUNT }, (_, i) => (
        <span
          key={i}
          className="signal-row__cell"
          ref={(el) => {
            cellsRef.current[i] = el
          }}
        />
      ))}
    </div>
  )
}
