import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Run.css'

function Run() {
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(true)
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
        <span className="live-badge">TIEMPO DE CARRERA </span>
        <div className="time-display" aria-label="Tiempo transcurrido">
          {formatTime(seconds)}
        </div>
      </header>

      <button
        type="button"
        className="pause-button"
        onClick={() => setIsRunning(!isRunning)}
        aria-label={isRunning ? 'Pausar carrera' : 'Reanudar carrera'}
      >
        {isRunning ? 'Pausar' : 'Reanudar'}
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