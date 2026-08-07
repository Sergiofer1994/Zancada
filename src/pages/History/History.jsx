import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../../config/apiClient'
import './History.css'

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

  if (!user) {
    return null
  }

  return (
    <main className="history-page" role="main" aria-label="Historial de carreras">

      <header className="history-header">
        <h1>Historial</h1>
      </header>

      <section aria-label="Listado de carreras">
        {runs.length === 0 ? (
          <p className="no-runs">Aún no has registrado ninguna carrera.</p>
        ) : (
          <ul className="history-list">
            {runs.map((run) => (
              <li key={run.id} className="history-item">
                <span className="history-date">{formatDate(run.createdAt)}</span>
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
                    <span className="history-value">{calculatePace(run.distance, run.seconds)}</span>
                    <span className="history-label">ritmo/km</span>
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