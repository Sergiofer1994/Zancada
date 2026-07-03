import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { MapContainer, TileLayer, Polyline, CircleMarker } from 'react-leaflet'
import './RouteViewer.css'

function RouteViewer() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [route, setRoute] = useState(null)
  const [points, setPoints] = useState([])
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const loadRoute = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/routes/${id}`)

        if (!response.ok) {
          setNotFound(true)
          return
        }

        const data = await response.json()
        setRoute(data)
        setPoints(JSON.parse(data.path))
      } catch {
        setNotFound(true)
      }
    }

    loadRoute()
  }, [id])

  if (notFound) {
    return (
      <main className="viewer-page" role="main">
        <p className="viewer-message">No se encontró la ruta.</p>
        <button type="button" className="viewer-back" onClick={() => navigate('/routes')}>
          Volver a mis rutas
        </button>
      </main>
    )
  }

  if (!route) {
    return null
  }

  const routeLine = points.map((point) => [point.latitude, point.longitude])
  const mapCenter = routeLine.length > 0 ? routeLine[0] : [42.8782, -8.5448]

  return (
    <main className="viewer-page" role="main" aria-label="Detalle de la ruta">

      <header className="viewer-header">
        <h1>{route.name}</h1>
        <span className="viewer-distance">{route.distanceKm.toFixed(2)} km</span>
      </header>

      <div className="viewer-map-wrapper">
        <MapContainer
          center={mapCenter}
          zoom={15}
          scrollWheelZoom={true}
          className="viewer-map"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {routeLine.length > 0 && (
            <Polyline
              positions={routeLine}
              pathOptions={{ color: '#A78BFA', weight: 5 }}
            />
          )}
          {routeLine.length > 0 && (
            <CircleMarker
              center={routeLine[0]}
              radius={7}
              pathOptions={{
                color: '#ffffff',
                fillColor: '#4ADE80',
                fillOpacity: 1,
                weight: 2
              }}
            />
          )}
          {routeLine.length > 1 && (
            <CircleMarker
              center={routeLine[routeLine.length - 1]}
              radius={7}
              pathOptions={{
                color: '#ffffff',
                fillColor: '#F87171',
                fillOpacity: 1,
                weight: 2
              }}
            />
          )}
        </MapContainer>
      </div>

      <button
        type="button"
        className="viewer-back"
        onClick={() => navigate('/routes')}
      >
        Volver a mis rutas
      </button>

    </main>
  )
}

export default RouteViewer