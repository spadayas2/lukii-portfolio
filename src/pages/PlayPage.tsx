import { Link, Navigate, useParams } from 'react-router-dom'
import { games } from '../data/work'

export function PlayPage() {
  const { gameId } = useParams()
  const game = games.find((g) => g.id === gameId)

  if (!game) {
    return <Navigate to="/#games" replace />
  }

  const src = `${game.playPath}index.html`

  return (
    <div className="play-page">
      <header className="play-page__bar">
        <Link className="play-page__back" to="/#games">
          ← Armory
        </Link>
        <div className="play-page__meta">
          <span className="play-page__genre">{game.genre}</span>
          <h1 className="play-page__title">{game.title}</h1>
        </div>
        <a className="play-page__open" href={src} target="_blank" rel="noreferrer">
          Open raw
        </a>
      </header>

      <iframe
        className="play-page__frame"
        title={game.title}
        src={src}
        allow="autoplay; fullscreen; gamepad"
      />
    </div>
  )
}
