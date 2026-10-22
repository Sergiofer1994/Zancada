import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../../config/apiClient'
import RoutesMap from './RoutesMap'
import './Routes.css'

const NEARBY_RADIUS_KM = 100

const VIEW_ALL = 'all'
const VIEW_BETWEEN_USERS = 'betweenUsers'
const VIEW_BY_LOCATION = 'byLocation'
const VIEW_SAVED = 'saved'

function RoutesList() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [routes, setRoutes] = useState([])
  const [nearbyRoutes, setNearbyRoutes] = useState([])
  const [savedRoutes, setSavedRoutes] = useState([])
  const [savedRouteIds, setSavedRouteIds] = useState([])
  const [activeView, setActiveView] = useState(VIEW_ALL)
  const [locationError, setLocationError] = useState('')
  const [userPosition, setUserPosition] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')

    if (!storedUser) {
      navigate('/')
      return
    }

    const parsedUser = JSON.parse(storedUser)
    setUser(parsedUser)
    loadRoutes(parsedUser.id)
    loadSavedRouteIds(parsedUser.id)
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

  const loadSavedRouteIds = async (userId) => {
    try {
      const response = await apiClient(`/api/saved-routes/user/${userId}/ids`)

      if (!response.ok) {
        return
      }

      const data = await response.json()
      setSavedRouteIds(data)
    } catch {
      setSavedRouteIds([])
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
      setUserPosition({ latitude, longitude })
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
    setUserPosition(null)
  }

  const showBetweenUsers = () => {
    loadNearbyRoutes(`/api/routes/nearby?userId=${user.id}`, VIEW_BETWEEN_USERS)
  }

  const showByLocation = () => {
    loadNearbyRoutes(`/api/routes/nearby/all?userId=${user.id}`, VIEW_BY_LOCATION)
  }

  const showSaved = async () => {
    setLocationError('')
    setUserPosition(null)

    try {
      const response = await apiClient(`/api/saved-routes/user/${user.id}`)

      if (!response.ok) {
        return
      }

      const data = await response.json()
      setSavedRoutes(data)
      setActiveView(VIEW_SAVED)
    } catch {
      setSavedRoutes([])
    }
  }

  const isSaved = (routeId) => savedRouteIds.includes(routeId)

  const toggleSave = async (routeId) => {
    const alreadySaved = isSaved(routeId)
    const method = alreadySaved ? 'DELETE' : 'POST'

    try {
      const response = await apiClient(`/api/saved-routes/${user.id}/${routeId}`, { method })

      if (!response.ok) {
        return
      }

      setSavedRouteIds((current) =>
        alreadySaved ? current.filter((id) => id !== routeId) : [...current, routeId]
      )

      if (alreadySaved && activeView === VIEW_SAVED) {
        setSavedRoutes((current) => current.filter((route) => route.id !== routeId))
      }
    } catch {
      return
    }
  }

  if (!user) {
    return null
  }

  const isNearbyView = activeView === VIEW_BETWEEN_USERS || activeView === VIEW_BY_LOCATION
  const showSaveButton = activeView !== VIEW_ALL

  const visibleRoutes =
    activeView === VIEW_ALL
      ? routes
      : activeView === VIEW_SAVED
        ? savedRoutes
        : nearbyRoutes

  const emptyMessage =
    activeView === VIEW_ALL
      ? 'Aún no has creado ninguna ruta.'
      : activeView === VIEW_BETWEEN_USERS
        ? 'No hay rutas de otros usuarios cerca de ti.'
        : activeView === VIEW_BY_LOCATION
          ? 'No hay rutas cerca de tu ubicación.'
          : 'Aún no has guardado ninguna ruta.'

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
          className={activeView === VIEW_BETWEEN_USERS ? 'filter-button active' : 'filter-button'}
          onClick={showBetweenUsers}
          aria-pressed={activeView === VIEW_BETWEEN_USERS}
        >
          Rutas entre usuarios
        </button>

        <button
          type="button"
          className={activeView === VIEW_BY_LOCATION ? 'filter-button active' : 'filter-button'}
          onClick={showByLocation}
          aria-pressed={activeView === VIEW_BY_LOCATION}
        >
          Rutas según ubicación
        </button>

        <button
          type="button"
          className={activeView === VIEW_SAVED ? 'filter-button active' : 'filter-button'}
          onClick={showSaved}
          aria-pressed={activeView === VIEW_SAVED}
        >
          Rutas favoritas
        </button>
      </div>

      {locationError && <p className="location-error" role="alert">{locationError}</p>}

      {activeView === VIEW_BY_LOCATION && userPosition && (
        <RoutesMap
          userPosition={userPosition}
          routes={visibleRoutes}
          onSelectRoute={(routeId) => navigate(`/routes/${routeId}`)}
          onRefresh={showByLocation}
        />
      )}

      <section aria-label="Listado de rutas">
        {visibleRoutes.length === 0 ? (
          <p className="no-routes">{emptyMessage}</p>
        ) : (
          <ul className="routes-list">
            {visibleRoutes.map((route) => (
              <li key={route.id} className="route-row">
                <button
                  type="button"
                  className="route-item"
                  onClick={() => navigate(`/routes/${route.id}`)}
                >
                  <span className="route-name">{route.name}</span>
                  <span className="route-author">por {route.creatorName}</span>
                  <span className="route-distance">
                    {isNearbyView
                      ? `a ${route.distanceFromUserKm.toFixed(1)} km de ti`
                      : `${route.distanceKm.toFixed(1)} km`}
                  </span>
                </button>

                {showSaveButton && (
                  <button
                    type="button"
                    className={isSaved(route.id) ? 'route-save saved' : 'route-save'}
                    onClick={() => toggleSave(route.id)}
                    aria-pressed={isSaved(route.id)}
                    aria-label={isSaved(route.id) ? 'Quitar de guardadas' : 'Guardar ruta'}
                    title={isSaved(route.id) ? 'Quitar de guardadas' : 'Guardar ruta'}
                  >
                    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                      <path d="M6 2a2 2 0 0 0-2 2v18l8-5 8 5V4a2 2 0 0 0-2-2H6z" />
                    </svg>
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}

export default RoutesList