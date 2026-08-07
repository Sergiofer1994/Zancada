import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../../config/apiClient'
import './Stats.css'

function Stats() {
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

  const getTotalDistance = () => {
    return runs.reduce((total, run) => total + run.distance, 0)
  }

  const getTotalSeconds = () => {
    return runs.reduce((total, run) => total + run.seconds, 0)
  }

  const getAverageDistance = () => {
    if (runs.length === 0) {
      return 0
    }
    return getTotalDistance() / runs.length
  }

  const formatDuration = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const paddedMinutes = String(minutes).padStart(2, '0')

    if (hours > 0) {
      return `${hours}h ${paddedMinutes}m`
    }
    return `${minutes}m`
  }

  const formatPace = (distance, totalSeconds) => {
    if (distance === 0) {
      return "0'00\""
    }

    const paceInSeconds = totalSeconds / distance
    const paceMinutes = Math.floor(paceInSeconds / 60)
    const paceSeconds = Math.floor(paceInSeconds % 60)
    const paddedPaceSeconds = String(paceSeconds).padStart(2, '0')

    return `${paceMinutes}'${paddedPaceSeconds}"`
  }

  const getAveragePace = () => {
    return formatPace(getTotalDistance(), getTotalSeconds())
  }

  const getLongestRun = () => {
    if (runs.length === 0) {
      return 0
    }
    return Math.max(...runs.map((run) => run.distance))
  }

  const getBestPace = () => {
    const runsWithDistance = runs.filter((run) => run.distance > 0)

    if (runsWithDistance.length === 0) {
      return "0'00\""
    }

    const bestRun = runsWithDistance.reduce((best, run) => {
      const currentPace = run.seconds / run.distance
      const bestPace = best.seconds / best.distance
      return currentPace < bestPace ? run : best
    })

    return formatPace(bestRun.distance, bestRun.seconds)
  }

  if (!user) {
    return null
  }

  return (
    <main className="stats-page" role="main" aria-label="Estadísticas">

      <header className="stats-header">
        <h1>Estadísticas</h1>
      </header>

      {runs.length === 0 ? (
        <p className="no-stats">Aún no has registrado ninguna carrera.</p>
      ) : (
        <>
          <section className="stats-grid" aria-label="Resumen general">
            <div className="stats-card">
              <span className="stats-value">{getTotalDistance().toFixed(1)}</span>
              <span className="stats-label">km totales</span>
            </div>
            <div className="stats-card">
              <span className="stats-value">{runs.length}</span>
              <span className="stats-label">salidas</span>
            </div>
            <div className="stats-card">
              <span className="stats-value">{formatDuration(getTotalSeconds())}</span>
              <span className="stats-label">tiempo total</span>
            </div>
            <div className="stats-card">
              <span className="stats-value">{getAveragePace()}</span>
              <span className="stats-label">ritmo medio</span>
            </div>
            <div className="stats-card">
              <span className="stats-value">{getAverageDistance().toFixed(1)}</span>
              <span className="stats-label">km de media</span>
            </div>
          </section>

          <section className="stats-records" aria-label="Récords">
            <h2 className="stats-records-title">Récords</h2>
            <div className="stats-record">
              <span className="stats-record-label">Carrera más larga</span>
              <span className="stats-record-value">{getLongestRun().toFixed(2)} km</span>
            </div>
            <div className="stats-record">
              <span className="stats-record-label">Mejor ritmo</span>
              <span className="stats-record-value">{getBestPace()} /km</span>
            </div>
          </section>
        </>
      )}
    </main>
  )
}

export default Stats