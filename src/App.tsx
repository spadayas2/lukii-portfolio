import { useCallback, useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Atmosphere } from './components/Atmosphere'
import { WatchingEyes } from './components/WatchingEyes'
import { Nav } from './components/Nav'
import { SliceIntro } from './components/SliceIntro'
import { HomePage } from './pages/HomePage'
import { GuidePage } from './pages/GuidePage'
import { PlayPage } from './pages/PlayPage'

function ScrollToHash() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const id = location.hash
      requestAnimationFrame(() => {
        document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })
      })
      return
    }
    if (location.pathname === '/') {
      window.scrollTo({ top: 0 })
    }
  }, [location.pathname, location.hash])

  return null
}

export default function App() {
  const location = useLocation()
  const isPlay = location.pathname.startsWith('/play/')
  const [introDone, setIntroDone] = useState(() => {
    if (typeof window === 'undefined') return false
    return sessionStorage.getItem('lukii-intro') === '1' || location.pathname !== '/'
  })

  const completeIntro = useCallback(() => {
    sessionStorage.setItem('lukii-intro', '1')
    setIntroDone(true)
  }, [])

  if (isPlay) {
    return (
      <Routes>
        <Route path="/play/:gameId" element={<PlayPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    )
  }

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      {!introDone && location.pathname === '/' && (
        <SliceIntro onComplete={completeIntro} />
      )}
      <Atmosphere />
      {introDone && <WatchingEyes />}
      <div className={`app-shell${introDone ? ' app-shell--ready' : ' app-shell--gated'}`}>
        <Nav />
        <ScrollToHash />
        <main id="main">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <Routes location={location}>
                <Route path="/" element={<HomePage />} />
                <Route path="/ops/:slug" element={<GuidePage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>
        <footer className="footer">
          <span>Lukii</span>
          <span>{new Date().getFullYear()}</span>
        </footer>
      </div>
    </>
  )
}
