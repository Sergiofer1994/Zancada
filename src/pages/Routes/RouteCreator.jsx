import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Polyline, CircleMarker, useMapEvents } from 'react-leaflet'
import apiBaseUrl from '../../config/apiConfig'
import './RouteCreator.css'

function ClickCapture({ onAddPoint }) {
  useMapEvents({
    click(event) {
      onAddPoint({
        latitude: event.latlng.lat,
        longitude: event.latlng.lng
      })
    }
  })

  return null
}

function RouteCreator() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [points, setPoints] = useState([])
  const [name, setName] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  const defaultCenter = [42.8782, -8.5448]

  useEffect(() => {
    const storedUser = localStorage.getItem('user')

    if (!storedUser) {
      navigate('/')
      return
    }

    setUser(JSON.parse(storedUser))
  }, [navigate])

  const addPoint = (point) => {
    setPoints((prev) => [...prev, point])
  }

  const undoLastPoint = () => {
    setPoints((prev) => prev.slice(0, -1))
  }

  const toRadians = (degrees) => {
    return degrees * (Math.PI / 180)
  }

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

  const getTotalDistance = () => {
    let total = 0

    for (let i = 1; i < points.length; i++) {
      total += calculateDistance(points[i - 1], points[i])
    }

    return total
  }

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Ponle un nombre a la ruta')
      return
    }

    if (points.length < 2) {
      setError('Marca al menos dos puntos en el mapa')
      return
    }

    setIsSaving(true)
    setError('')

    try {
      const response = await fetch(`${apiBaseUrl}/api/routes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          name: name.trim(),
          distanceKm: getTotalDistance(),
          path: JSON.stringify(points)
        })
      })

      if (!response.ok) {
        setError('No se pudo guardar la ruta')
        setIsSaving(false)
        return
      }

      navigate('/routes')
    } catch {
      setError('No se pudo conectar con el servidor')
      setIsSaving(false)
    }
  }

  if (!user) {
    return null
  }

  const routeLine = points.map((point) => [point.latitude, point.longitude])

  return (
    <main className="creator-page" role="main" aria-label="Crear nueva ruta">

      <header className="creator-header">
        <h1>Nueva ruta</h1>
        <span className="creator-distance">{getTotalDistance().toFixed(2)} km</span>
      </header>

      <div className="creator-map-wrapper">
        <MapContainer
          center={defaultCenter}
          zoom={15}
          scrollWheelZoom={true}
          className="creator-map"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickCapture onAddPoint={addPoint} />
          {points.length > 0 && (
            <Polyline
              positions={routeLine}
              pathOptions={{ color: '#A78BFA', weight: 5 }}
            />
          )}
          {points.map((point, index) => (
            <CircleMarker
              key={index}
              center={[point.latitude, point.longitude]}
              radius={6}
              pathOptions={{
                color: '#ffffff',
                fillColor: '#A78BFA',
                fillOpacity: 1,
                weight: 2
              }}
            />
          ))}
        </MapContainer>
      </div>

      <p className="creator-hint">Toca el mapa para ir marcando el recorrido</p>

      <input
        type="text"
        className="creator-name"
        placeholder="Nombre de la ruta"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {error && (
        <p className="creator-error" role="alert">{error}</p>
      )}

      <div className="creator-actions">
        <button
          type="button"
          className="undo-button"
          onClick={undoLastPoint}
          disabled={points.length === 0}
        >
          Deshacer punto
        </button>
        <button
          type="button"
          className="save-route-button"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? 'Guardando...' : 'Guardar ruta'}
        </button>
      </div>

      <button
        type="button"
        className="cancel-button"
        onClick={() => navigate('/routes')}
      >
        Cancelar
      </button>

    </main>
  )
}

export default RouteCreator