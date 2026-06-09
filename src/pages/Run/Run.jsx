import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Run.css'

function Run() {
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(true)
  const [positions, setPositions] = useState([])
  const [gpsError, setGpsError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (!isRunning) {
      return
    }

    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning])

  useEffect(() => {
    if (!navigator.geolocation) {
      setGpsError('Tu navegador no soporta geolocalización')
      return
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newPoint = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }
        setPositions((prev) => [...prev, newPoint])
        setGpsError('')
      },
      () => {
        setGpsError('No se pudo acceder a tu ubicación')
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
      }
    )

    return () => navigator.geolocation.clearWatch(watchId)
  }, [])

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60)
    const remainingSeconds = totalSeconds % 60
    const paddedMinutes = String(minutes).padStart(2, '0')
    const paddedSeconds = String(remainingSeconds).padStart(2, '0')
    return `${paddedMinutes}:${paddedSeconds}`
  }

  return (
    <main className="run-page" role="main" aria-label="Carrera en curso">

      <header className="run-header">
        <span className="live-badge">TIEMPO DE CARRERA</span>
        <div className="time-display" aria-label="Tiempo transcurrido">
          {formatTime(seconds)}
        </div>
      </header>

      <section className="gps-info" aria-label="Información de GPS">
        {gpsError ? (
          <p className="gps-error" role="alert">{gpsError}</p>
        ) : (
          <p className="gps-points">
            Puntos GPS registrados: {positions.length}
          </p>
        )}
      </section>

      <button
        type="button"
        className="pause-button"
        onClick={() => setIsRunning(!isRunning)}
        aria-label={isRunning ? 'Pausar carrera' : 'Reanudar carrera'}
      >
        {isRunning ? 'Pausar' : 'Reanudar carrera'}
      </button>

      <button
        type="button"
        className="stop-button"
        aria-label="Finalizar carrera"
        onClick={() => {
          setIsRunning(false)
          navigate('/home')
        }}
      >
        Finalizar carrera
      </button>

    </main>
  )
}

export default Run
