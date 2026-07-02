import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Routes.css'

function RoutesList() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [routes, setRoutes] = useState([])

  useEffect(() => {
    const storedUser = localStorage.getItem('user')

    if (!storedUser) {
      navigate('/')
      return
    }

    const parsedUser = JSON.parse(storedUser)
    setUser(parsedUser)
    loadRoutes(parsedUser.id)
  }, [navigate])

  const loadRoutes = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/routes/user/${userId}`)

      if (!response.ok) {
        return
      }

      const data = await response.json()
      setRoutes(data)
    } catch {
      setRoutes([])
    }
  }

  if (!user) {
    return null
  }

  return (
    <main className="routes-page" role="main" aria-label="Mis rutas">

      <header className="routes-header">
        <h1>Mis rutas</h1>
      </header>

      <button
        type="button"
        className="create-route-button"
        onClick={() => navigate('/routes/new')}
      >
        Crear nueva ruta
      </button>

      <section aria-label="Listado de rutas">
        {routes.length === 0 ? (
          <p className="no-routes">Aún no has creado ninguna ruta.</p>
        ) : (
          <ul className="routes-list">
            {routes.map((route) => (
              <li key={route.id}>
                <button
                  type="button"
                  className="route-item"
                  onClick={() => navigate(`/routes/${route.id}`)}
                >
                  <span className="route-name">{route.name}</span>
                  <span className="route-distance">{route.distanceKm.toFixed(1)} km</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}

export default RoutesList