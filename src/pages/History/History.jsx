import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../../config/apiClient'
import './History.css'

const SPORT_LABELS = {
  RUNNING: 'Correr',
  WALKING: 'Caminar',
  CYCLING: 'Bici',
}

function History() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [runs, setRuns] = useState([])

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

  const formatDate = (isoDate) => {
    const date = new Date(isoDate)
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatDuration = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60)
    const remainingSeconds = totalSeconds % 60
    const paddedMinutes = String(minutes).padStart(2, '0')
    const paddedSeconds = String(remainingSeconds).padStart(2, '0')
    return `${paddedMinutes}:${paddedSeconds}`
  }

  const getSportLabel = (sport) => {
    return SPORT_LABELS[sport] || 'Actividad'
  }

  const isCycling = (sport) => {
    return sport === 'CYCLING'
  }

  const calculatePace = (distance, totalSeconds) => {
    if (distance === 0) {
      return "0'00\""
    }

    const paceInSeconds = totalSeconds / distance
    const paceMinutes = Math.floor(paceInSeconds / 60)
    const paceSeconds = Math.floor(paceInSeconds % 60)
    const paddedPaceSeconds = String(paceSeconds).padStart(2, '0')

    return `${paceMinutes}'${paddedPaceSeconds}"`
  }

  const calculateSpeed = (distance, totalSeconds) => {
    if (totalSeconds === 0) {
      return '0.0'
    }

    const hours = totalSeconds / 3600
    const speed = distance / hours

    return speed.toFixed(1)
  }

  if (!user) {
    return null
  }

  return (
    <main className="history-page" role="main" aria-label="Historial de actividades">

      <header className="history-header">
        <h1>Historial</h1>
      </header>

      <section aria-label="Listado de actividades">
        {runs.length === 0 ? (
          <p className="no-runs">Aún no has registrado ninguna actividad.</p>
        ) : (
          <ul className="history-list">
            {runs.map((run) => (
              <li key={run.id} className="history-item">
                <div className="history-top">
                  <span className="history-sport">{getSportLabel(run.sport)}</span>
                  <span className="history-date">{formatDate(run.createdAt)}</span>
                </div>
                <div className="history-stats">
                  <div className="history-stat">
                    <span className="history-value">{run.distance.toFixed(2)}</span>
                    <span className="history-label">km</span>
                  </div>
                  <div className="history-stat">
                    <span className="history-value">{formatDuration(run.seconds)}</span>
                    <span className="history-label">tiempo</span>
                  </div>
                  <div className="history-stat">
                    {isCycling(run.sport) ? (
                      <>
                        <span className="history-value">{calculateSpeed(run.distance, run.seconds)}</span>
                        <span className="history-label">km/h</span>
                      </>
                    ) : (
                      <>
                        <span className="history-value">{calculatePace(run.distance, run.seconds)}</span>
                        <span className="history-label">ritmo/km</span>
                      </>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}

export default History