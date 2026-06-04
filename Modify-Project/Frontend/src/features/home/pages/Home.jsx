import FaceExpression from '../../Expression/Components/FaceExpression'
import Player from '../components/Player'
import { useSongs } from '../hooks/useSongs'
import {
  FaBolt,
  FaHeadphones,
  FaHeart,
  FaRegClock,
  FaSignal,
  FaWaveSquare,
} from 'react-icons/fa'
import './Home.css'

const Home = () => {
  const { song, loading, handelGetSong } = useSongs()

  const moods = ['happy', 'sad', 'surprised']

  return (
    <main className="home-page">
      <section className="home-shell">
        <aside className="home-sidebar" aria-label="Music workspace">
          <div className="brand-lockup">
            <div className="brand-mark" aria-hidden="true">
              <FaWaveSquare />
            </div>
            <div>
              <p className="brand-label">MoodCast</p>
              <h1>Home</h1>
            </div>
          </div>

          <nav className="mood-stack" aria-label="Mood shortcuts">
            {moods.map((mood) => (
              <button
                key={mood}
                className={`mood-chip ${song?.mood === mood ? 'is-active' : ''}`}
                onClick={() => handelGetSong(mood)}
                disabled={loading}
                type="button"
              >
                <span>{mood}</span>
              </button>
            ))}
          </nav>

          <div className="signal-panel">
            <div className="signal-row">
              <FaSignal />
              <span>Live analysis</span>
            </div>
            <strong>{loading ? 'Syncing' : song?.mood || 'Ready'}</strong>
          </div>
        </aside>

        <section className="home-content">
          <header className="home-topbar">
            <div>
              <p className="section-kicker">Adaptive playback</p>
              <h2>Music that follows the room.</h2>
            </div>
            <div className="status-pills" aria-label="Session status">
              <span>
                <FaBolt /> Smart mix
              </span>
              <span>
                <FaRegClock /> Session
              </span>
            </div>
          </header>

          <div className="home-grid">
            <section className="camera-panel" aria-label="Expression scanner">
              <div className="panel-heading">
                <div>
                  <p className="section-kicker">Expression</p>
                  <h3>Mood scanner</h3>
                </div>
                <FaHeadphones aria-hidden="true" />
              </div>
              <FaceExpression onClick={handelGetSong} />
            </section>

            <section className="player-panel" aria-label="Now playing">
              <div className="panel-heading">
                <div>
                  <p className="section-kicker">Now playing</p>
                  <h3>Current track</h3>
                </div>
                <FaHeart aria-hidden="true" />
              </div>
              <Player />
            </section>
          </div>
        </section>
      </section>
    </main>
  )
}

export default Home
