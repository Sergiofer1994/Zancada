import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../../config/apiClient'
import './Home.css'

const SPORTS = [
  { id: 'RUNNING', label: 'Correr' },
  { id: 'WALKING', label: 'Caminar' },
  { id: 'CYCLING', label: 'Bici' },
]

const SPORT_LABELS = {
  RUNNING: 'Correr',
  WALKING: 'Caminar',
  CYCLING: 'Bici',
}

function Home() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [runs, setRuns] = useState([])
  const [selectedSport, setSelectedSport] = useState('RUNNING')

  useEffect(() => {
    const storedUser = localStorage.getItem('user')

    if (!storedUser) {
      navigate('/')
      return
    }

    const parsedUser = JSON.parse(storedUser)
    setUser(parsedUser)
    loadRuns(parsedUser.id)
  }, [navigate])

  const loadRuns = async (userId) => {
    try {
      const response = await apiClient(`/api/runs/user/${userId}`)

      if (!response.ok) {
        return
      }

      const data = await response.json()
      setRuns(data)
    } catch {
      setRuns([])
    }
  }

  const getInitials = (name) => {
    return name
      .trim()
      .split(' ')
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join('')
  }

  const getTotalDistance = () => {
    return runs.reduce((total, run) => total + run.distance, 0)
  }

  const getTotalSeconds = () => {
    return runs.reduce((total, run) => total + run.seconds, 0)
  }

  const getAveragePace = () => {
    const totalDistance = getTotalDistance()

    if (totalDistance === 0) {
      return "0'00\""
    }

    const paceInSeconds = getTotalSeconds() / totalDistance
    const paceMinutes = Math.floor(paceInSeconds / 60)
    const paceSeconds = Math.floor(paceInSeconds % 60)
    const paddedPaceSeconds = String(paceSeconds).padStart(2, '0')

    return `${paceMinutes}'${paddedPaceSeconds}"`
  }

  const getSportLabel = (sport) => {
    return SPORT_LABELS[sport] || 'Actividad'
  }

  const formatRunDate = (createdAt) => {
    const date = new Date(createdAt)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')

    return `${day}/${month}, ${hours}:${minutes}`
  }

  const formatRunTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    const paddedMinutes = String(minutes).padStart(2, '0')
    const paddedSeconds = String(seconds).padStart(2, '0')

    return `${paddedMinutes}:${paddedSeconds}`
  }

  if (!user) {
    return null
  }

  return (
    <main className="home-page" role="main" aria-label="Pantalla de inicio">

      <header>
        <div>
          <h1>Bienvenido/a, {user.name}</h1>
        </div>
        <div
          className="avatar"
          aria-label="Avatar del usuario"
          onClick={() => navigate('/profile')}
        >
          {user.photoUrl ? (
            <img src={user.photoUrl} alt="Foto de perfil" className="avatar-image" />
          ) : (
            getInitials(user.name)
          )}
        </div>
      </header>

      <section aria-label="Estadísticas del mes">
        <div className="stats-row">
          <div className="stat-box">
            <span className="stat-value">{getTotalDistance().toFixed(1)}</span>
            <span className="stat-label">km totales</span>
          </div>
          <div className="stat-box">
            <span className="stat-value">{getAveragePace()}</span>
            <span className="stat-label">ritmo medio</span>
          </div>
          <div className="stat-box">
            <span className="stat-value">{runs.length}</span>
            <span className="stat-label">salidas</span>
          </div>
        </div>
      </section>

      <div className="sport-selector" role="group" aria-label="Elegir deporte">
        {SPORTS.map((sport) => (
          <button
            key={sport.id}
            type="button"
            className={selectedSport === sport.id ? 'sport-button active' : 'sport-button'}
            onClick={() => setSelectedSport(sport.id)}
            aria-pressed={selectedSport === sport.id}
          >
            {sport.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="start-button"
        aria-label="Iniciar una nueva actividad"
        onClick={() => navigate('/run', { state: { sport: selectedSport } })}
      >
        Iniciar actividad
      </button>

      <section aria-label="Últimas actividades">
        <h2>Últimas actividades</h2>
        {runs.length === 0 ? (
          <p className="no-runs">Aún no has registrado ninguna actividad.</p>
        ) : (
          <ul>
            {runs.map((run) => (
              <li key={run.id}>
                <div>
                  <span className="run-date">{formatRunDate(run.createdAt)}</span>
                  <span className="run-name">{getSportLabel(run.sport)}</span>
                </div>
                <div>
                  <span className="run-km">{run.distance.toFixed(1)} km</span>
                  <span className="run-time">{formatRunTime(run.seconds)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}

export default Home