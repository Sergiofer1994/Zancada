import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../NavBar/NavBar.jsx'
import './Home.css'

function Home() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')

    if (!storedUser) {
      navigate('/')
      return
    }

    setUser(JSON.parse(storedUser))
  }, [navigate])

  const getInitials = (name) => {
    return name
      .trim()
      .split(' ')
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join('')
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
        <div className="avatar" aria-label="Avatar del usuario">
          {getInitials(user.name)}
        </div>
      </header>

      <section aria-label="Estadísticas del mes">
        <div className="stats-row">
          <div className="stat-box">
            <span className="stat-value">42.1</span>
            <span className="stat-label">km este mes</span>
          </div>
          <div className="stat-box">
            <span className="stat-value">5:12</span>
            <span className="stat-label">ritmo medio</span>
          </div>
          <div className="stat-box">
            <span className="stat-value">6</span>
            <span className="stat-label">salidas</span>
          </div>
        </div>
      </section>

      <button
        type="button"
        className="start-button"
        aria-label="Iniciar una nueva carrera"
        onClick={() => navigate('/run')}
      >
        Iniciar carrera
      </button>

      <section aria-label="Últimas carreras">
        <h2>Últimas carreras</h2>
        <ul>
          <li>
            <div>
              <span className="run-date">Hoy, 07:30</span>
              <span className="run-name">Ruta del parque</span>
            </div>
            <div>
              <span className="run-km">8.4 km</span>
              <span className="run-time">44:12</span>
            </div>
          </li>
          <li>
            <div>
              <span className="run-date">Mar, 06:50</span>
              <span className="run-name">Salida matutina</span>
            </div>
            <div>
              <span className="run-km">5.2 km</span>
              <span className="run-time">27:40</span>
            </div>
          </li>
        </ul>
      </section>

      <NavBar />
    </main>
  )
}

export default Home