import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../../config/apiClient'
import './Stats.css'

const FILTERS = [
  { id: 'ALL', label: 'Todos' },
  { id: 'RUNNING', label: 'Correr' },
  { id: 'WALKING', label: 'Caminar' },
  { id: 'CYCLING', label: 'Bici' },
]

function Stats() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [runs, setRuns] = useState([])
  const [selectedFilter, setSelectedFilter] = useState('ALL')
  const [trainingPlan, setTrainingPlan] = useState('')
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false)
  const [planError, setPlanError] = useState('')

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

  const generateTrainingPlan = async () => {
    setIsGeneratingPlan(true)
    setPlanError('')
    setTrainingPlan('')

    try {
      const response = await apiClient(`/api/ai/training-plan/${user.id}?sport=${selectedFilter}`)

      if (!response.ok) {
        setPlanError('No se pudo generar el plan. Intentalo de nuevo mas tarde.')
        return
      }

      const data = await response.json()
      setTrainingPlan(data.plan)
    } catch {
      setPlanError('No se pudo conectar con el servidor.')
    } finally {
      setIsGeneratingPlan(false)
    }
  }

  const getFilteredRuns = () => {
    if (selectedFilter === 'ALL') {
      return runs
    }
    return runs.filter((run) => run.sport === selectedFilter)
  }

  const isCyclingFilter = () => {
    return selectedFilter === 'CYCLING'
  }

  const getTotalDistance = (activities) => {
    return activities.reduce((total, run) => total + run.distance, 0)
  }

  const getTotalSeconds = (activities) => {
    return activities.reduce((total, run) => total + run.seconds, 0)
  }

  const getAverageDistance = (activities) => {
    if (activities.length === 0) {
      return 0
    }
    return getTotalDistance(activities) / activities.length
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

  const formatSpeed = (distance, totalSeconds) => {
    if (totalSeconds === 0) {
      return '0.0'
    }

    const hours = totalSeconds / 3600
    return (distance / hours).toFixed(1)
  }

  const getAverageMetric = (activities) => {
    const totalDistance = getTotalDistance(activities)
    const totalSeconds = getTotalSeconds(activities)

    if (isCyclingFilter()) {
      return `${formatSpeed(totalDistance, totalSeconds)} km/h`
    }
    return formatPace(totalDistance, totalSeconds)
  }

  const getBestMetric = (activities) => {
    const withDistance = activities.filter((run) => run.distance > 0)

    if (withDistance.length === 0) {
      return isCyclingFilter() ? '0.0 km/h' : "0'00\""
    }

    if (isCyclingFilter()) {
      const fastest = withDistance.reduce((best, run) => {
        const currentSpeed = run.distance / run.seconds
        const bestSpeed = best.distance / best.seconds
        return currentSpeed > bestSpeed ? run : best
      })
      return `${formatSpeed(fastest.distance, fastest.seconds)} km/h`
    }

    const bestRun = withDistance.reduce((best, run) => {
      const currentPace = run.seconds / run.distance
      const bestPace = best.seconds / best.distance
      return currentPace < bestPace ? run : best
    })
    return `${formatPace(bestRun.distance, bestRun.seconds)} /km`
  }

  const getLongest = (activities) => {
    if (activities.length === 0) {
      return 0
    }
    return Math.max(...activities.map((run) => run.distance))
  }

  const getPlanButtonLabel = () => {
    const labels = {
      ALL: 'Generar plan multideporte',
      RUNNING: 'Generar plan de carrera',
      WALKING: 'Generar plan de caminata',
      CYCLING: 'Generar plan de ciclismo',
    }
    return labels[selectedFilter] || 'Generar plan de entrenamiento'
  }

  if (!user) {
    return null
  }

  const filteredRuns = getFilteredRuns()
  const averageMetricLabel = isCyclingFilter() ? 'velocidad media' : 'ritmo medio'
  const bestMetricLabel = isCyclingFilter() ? 'Mejor velocidad' : 'Mejor ritmo'

  return (
    <main className="stats-page" role="main" aria-label="Estadísticas">

      <header className="stats-header">
        <h1>Estadísticas</h1>
      </header>

      <div className="stats-filters" role="group" aria-label="Filtrar por deporte">
        {FILTERS.map((filter) => (
          <button
            key={filter.id}
            type="button"
            className={selectedFilter === filter.id ? 'stats-filter active' : 'stats-filter'}
            onClick={() => setSelectedFilter(filter.id)}
            aria-pressed={selectedFilter === filter.id}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {filteredRuns.length === 0 ? (
        <p className="no-stats">No hay actividades de este tipo.</p>
      ) : (
        <>
          <section className="stats-grid" aria-label="Resumen general">
            <div className="stats-card">
              <span className="stats-value">{getTotalDistance(filteredRuns).toFixed(1)}</span>
              <span className="stats-label">km totales</span>
            </div>
            <div className="stats-card">
              <span className="stats-value">{filteredRuns.length}</span>
              <span className="stats-label">salidas</span>
            </div>
            <div className="stats-card">
              <span className="stats-value">{formatDuration(getTotalSeconds(filteredRuns))}</span>
              <span className="stats-label">tiempo total</span>
            </div>
            <div className="stats-card">
              <span className="stats-value">{getAverageMetric(filteredRuns)}</span>
              <span className="stats-label">{averageMetricLabel}</span>
            </div>
            <div className="stats-card">
              <span className="stats-value">{getAverageDistance(filteredRuns).toFixed(1)}</span>
              <span className="stats-label">km de media</span>
            </div>
          </section>

          <section className="stats-records" aria-label="Récords">
            <h2 className="stats-records-title">Récords</h2>
            <div className="stats-record">
              <span className="stats-record-label">Actividad más larga</span>
              <span className="stats-record-value">{getLongest(filteredRuns).toFixed(2)} km</span>
            </div>
            <div className="stats-record">
              <span className="stats-record-label">{bestMetricLabel}</span>
              <span className="stats-record-value">{getBestMetric(filteredRuns)}</span>
            </div>
          </section>

          <section className="training-plan" aria-label="Plan de entrenamiento">
            <button
              type="button"
              className="training-plan-button"
              onClick={generateTrainingPlan}
              disabled={isGeneratingPlan}
            >
              {isGeneratingPlan ? 'Generando plan...' : getPlanButtonLabel()}
            </button>

            {planError && <p className="training-plan-error" role="alert">{planError}</p>}

            {trainingPlan && (
              <article className="training-plan-result">{trainingPlan}</article>
            )}
          </section>
        </>
      )}
    </main>
  )
}

export default Stats