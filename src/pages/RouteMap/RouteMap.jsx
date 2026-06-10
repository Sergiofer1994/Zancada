import { MapContainer, TileLayer, Polyline, CircleMarker } from 'react-leaflet'
import './RouteMap.css'

function RouteMap({ positions }) {
  if (positions.length === 0) {
    return (
      <div className="map-placeholder">
        <p>Esperando señal GPS...</p>
      </div>
    )
  }

  const routePoints = positions.map((point) => [
    point.latitude,
    point.longitude,
  ])

  const currentPosition = routePoints[routePoints.length - 1]

  return (
    <div className="map-wrapper" aria-label="Mapa con tu ruta en tiempo real">
      <MapContainer
        center={currentPosition}
        zoom={16}
        scrollWheelZoom={false}
        className="route-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline
          positions={routePoints}
          pathOptions={{ color: '#1D9E75', weight: 5 }}
        />
        <CircleMarker
          center={currentPosition}
          radius={8}
          pathOptions={{
            color: '#ffffff',
            fillColor: '#1D9E75',
            fillOpacity: 1,
            weight: 3,
          }}
        />
      </MapContainer>
    </div>
  )
}

export default RouteMap