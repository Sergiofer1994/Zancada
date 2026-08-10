import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import RouteMap from '../RouteMap/RouteMap.jsx'
import './Run.css'

const ACCURACY_THRESHOLD_METERS = 50
const MIN_SEGMENT_KM = 0.01

function Run() {
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(true)
  const [positions, setPositions] = useState([])
  const [distance, setDistance] = useState(0)
  const [gpsStatus, setGpsStatus] = useState('searching')
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
      setGpsStatus('error')
      setGpsError('Tu navegador no soporta geolocalización')
      return
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        if (position.coords.accuracy > ACCURACY_THRESHOLD_METERS) {
          setGpsStatus('searching')
          return
        }

        const newPoint = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }

        setPositions((prev) => {
          if (prev.length === 0) {
            return [newPoint]
          }

          const lastPoint = prev[prev.length - 1]
          const distanceFromLast = calculateDistance(lastPoint, newPoint)

          if (distanceFromLast < MIN_SEGMENT_KM) {
            return prev
          }

          return [...prev, newPoint]
        })
        setGpsStatus('active')
        setGpsError('')
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setGpsStatus('error')
          setGpsError('Permiso de ubicación denegado. Actívalo en los ajustes para registrar tu carrera.')
          return
        }

        setGpsStatus('error')
        setGpsError('No se pudo obtener tu ubicación. Asegúrate de estar al aire libre.')
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 15000,
      }
    )

    return () => navigator.geolocation.clearWatch(watchId)
  }, [])

  useEffect(() => {
    if (positions.length < 2) {
      return
    }

    const lastPoint = positions[positions.length - 1]
    const previousPoint = positions[positions.length - 2]
    const segmentDistance = calculateDistance(previousPoint, lastPoint)

    setDistance((prev) => prev + segmentDistance)
  }, [positions])

  const calculateDistance = (pointA, pointB) => {
    const earthRadius = 6371
    const latDifference = toRadians(pointB.latitude - pointA.latitude)
    const lonDifference = toRadians(pointB.longitude - pointA.longitude)

    const a =
      Math.sin(latDifference / 2) * Math.sin(latDifference / 2) +
      Math.cos(toRadians(pointA.latitude)) *
        Math.cos(toRadians(pointB.latitude)) *
        Math.sin(lonDifference / 2) *
        Math.sin(lonDifference / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return earthRadius * c
  }

  const toRadians = (degrees) => {
    return degrees * (Math.PI / 180)
  }

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60)
    const remainingSeconds = totalSeconds % 60
    const paddedMinutes = String(minutes).padStart(2, '0')
    const paddedSeconds = String(remainingSeconds).padStart(2, '0')
    return `${paddedMinutes}:${paddedSeconds}`
  }

  const calculatePace = () => {
    if (distance === 0) {
      return "0'00\""
    }

    const paceInSeconds = seconds / distance
    const paceMinutes = Math.floor(paceInSeconds / 60)
    const paceSeconds = Math.floor(paceInSeconds % 60)
    const paddedPaceSeconds = String(paceSeconds).padStart(2, '0')

    return `${paceMinutes}'${paddedPaceSeconds}"`
  }

  return (
    <main role="main" aria-label="Carrera en curso">

      <header className="run-header">
        <span className="live-badge">DISTANCIA RECORRIDA</span>
        <div className="distance-display" aria-label="Distancia recorrida">
          {distance.toFixed(2)}
        </div>
        <span className="distance-label">kilómetros</span>
      </header>

      <section className="live-stats" aria-label="Estadísticas en directo">
        <div className="live-stat">
          <span className="live-value">{calculatePace()}</span>
          <span className="live-label">ritmo/km</span>
        </div>
        <div className="live-stat">
          <span className="live-value">{formatTime(seconds)}</span>
          <span className="live-label">tiempo</span>
        </div>
        <div className="live-stat">
          <span className="live-value">{positions.length}</span>
          <span className="live-label">puntos GPS</span>
        </div>
      </section>

      <RouteMap positions={positions} />

      {gpsStatus === 'searching' && !gpsError && (
        <p className="gps-status" role="status">Buscando señal GPS…</p>
      )}

      {gpsError && (
        <p className="gps-error" role="alert">{gpsError}</p>
      )}

      <button
        type="button"
        className="pause-button"
        onClick={() => setIsRunning(!isRunning)}
        aria-label={isRunning ? 'Pausar carrera' : 'Reanudar carrera'}
      >
        {isRunning ? 'Pausar carrera' : 'Reanudar carrera'}
      </button>

      <button
        type="button"
        className="stop-button"
        aria-label="Finalizar carrera"
        onClick={() => {
          setIsRunning(false)
          navigate('/summary', {
            state: {
              distance: distance,
              seconds: seconds,
              pace: calculatePace(),
              positions: positions,
            },
          })
        }}
      >
        Finalizar carrera
      </button>

    </main>
  )
}

export default Run