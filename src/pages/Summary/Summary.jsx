import { useLocation, useNavigate } from 'react-router-dom'
import RouteMap from '../RouteMap/RouteMap.jsx'
import './Summary.css'

function Summary() {
  const location = useLocation()
  const navigate = useNavigate()

  const data = location.state

  if (!data) {
    return (
      <main role="main" className="summary-empty">
        <p>No hay datos de carrera para mostrar.</p>
        <button type="button" onClick={() => navigate('/home')}>
          Volver al inicio
        </button>
      </main>
    )
  }

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    const paddedMinutes = String(minutes).padStart(2, '0')
    const paddedSeconds = String(seconds).padStart(2, '0')

    if (hours > 0) {
      return `${hours}:${paddedMinutes}:${paddedSeconds}`
    }
    return `${paddedMinutes}:${paddedSeconds}`
  }

  const estimateCalories = () => {
    const caloriesPerKm = 60
    return Math.round(data.distance * caloriesPerKm)
  }

  return (
    <main role="main" aria-label="Resumen de la carrera">

      <header className="summary-header">
        <span className="summary-badge">CARRERA COMPLETADA</span>
        <div className="summary-distance">{data.distance.toFixed(2)}</div>
        <span className="summary-unit">kilómetros</span>
      </header>

      <section className="summary-stats" aria-label="Estadísticas de la carrera">
        <div className="summary-stat">
          <span className="summary-value">{formatTime(data.seconds)}</span>
          <span className="summary-label">tiempo</span>
        </div>
        <div className="summary-stat">
          <span className="summary-value">{data.pace}</span>
          <span className="summary-label">ritmo/km</span>
        </div>
        <div className="summary-stat">
          <span className="summary-value">{estimateCalories()}</span>
          <span className="summary-label">kcal</span>
        </div>
      </section>

      <RouteMap positions={data.positions} />

      <button
        type="button"
        className="save-button"
        onClick={() => navigate('/home')}
      >
        Guardar carrera
      </button>

      <button
        type="button"
        className="discard-button"
        onClick={() => navigate('/home')}
      >
        Descartar
      </button>

    </main>
  )
}

export default Summary