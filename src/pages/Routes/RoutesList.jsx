import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../../config/apiClient'
import './Routes.css'

const NEARBY_RADIUS_KM = 25

const VIEW_ALL = 'all'
const VIEW_MINE_NEARBY = 'mineNearby'
const VIEW_DISCOVER = 'discover'

function RoutesList() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [routes, setRoutes] = useState([])
  const [nearbyRoutes, setNearbyRoutes] = useState([])
  const [activeView, setActiveView] = useState(VIEW_ALL)
  const [locationError, setLocationError] = useState('')

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
      const response = await apiClient(`/api/routes/user/${userId}`)

      if (!response.ok) {
        return
      }

      const data = await response.json()
      setRoutes(data)
    } catch {
      setRoutes([])
    }
  }

  const getCurrentPosition = () =>
    new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject)
    })

  const loadNearbyRoutes = async (endpoint, view) => {
    setLocationError('')

    try {
      const position = await getCurrentPosition()
      const { latitude, longitude } = position.coords
      const separator = endpoint.includes('?') ? '&' : '?'
      const response = await apiClient(
        `${endpoint}${separator}latitude=${latitude}&longitude=${longitude}&radiusKm=${NEARBY_RADIUS_KM}`
      )

      if (!response.ok) {
        return
      }

      const data = await response.json()
      setNearbyRoutes(data)
      setActiveView(view)
    } catch {
      setLocationError('No se pudo obtener tu ubicación.')
    }
  }

  const showAllRoutes = () => {
    setActiveView(VIEW_ALL)
    setLocationError('')
  }

  const showMineNearby = () => {
    loadNearbyRoutes(`/api/routes/nearby/user/${user.id}`, VIEW_MINE_NEARBY)
  }

  const showDiscover = () => {
    loadNearbyRoutes(`/api/routes/nearby?userId=${user.id}`, VIEW_DISCOVER)
  }

  if (!user) {
    return null
  }

  const isNearbyView = activeView !== VIEW_ALL
  const visibleRoutes = isNearbyView ? nearbyRoutes : routes

  const emptyMessage =
    activeView === VIEW_ALL
      ? 'Aún no has creado ninguna ruta.'
      : activeView === VIEW_MINE_NEARBY
        ? 'No tienes rutas cerca de ti.'
        : 'No hay rutas de otros usuarios cerca de ti.'

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

      <div className="routes-filters" role="group" aria-label="Filtros de rutas">
        <button
          type="button"
          className={activeView === VIEW_ALL ? 'filter-button active' : 'filter-button'}
          onClick={showAllRoutes}
          aria-pressed={activeView === VIEW_ALL}
        >
          Todas
        </button>

        <button
          type="button"
          className={activeView === VIEW_MINE_NEARBY ? 'filter-button active' : 'filter-button'}
          onClick={showMineNearby}
          aria-pressed={activeView === VIEW_MINE_NEARBY}
        >
          Mis rutas cerca
        </button>

        <button
          type="button"
          className={activeView === VIEW_DISCOVER ? 'filter-button active' : 'filter-button'}
          onClick={showDiscover}
          aria-pressed={activeView === VIEW_DISCOVER}
        >
          Rutas cerca de mí
        </button>
      </div>

      {locationError && <p className="location-error" role="alert">{locationError}</p>}

      <section aria-label="Listado de rutas">
        {visibleRoutes.length === 0 ? (
          <p className="no-routes">{emptyMessage}</p>
        ) : (
          <ul className="routes-list">
            {visibleRoutes.map((route) => (
              <li key={route.id}>
                <button
                  type="button"
                  className="route-item"
                  onClick={() => navigate(`/routes/${route.id}`)}
                >
                  <span className="route-name">{route.name}</span>
                  <span className="route-distance">
                    {isNearbyView
                      ? `a ${route.distanceFromUserKm.toFixed(1)} km de ti`
                      : `${route.distanceKm.toFixed(1)} km`}
                  </span>
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