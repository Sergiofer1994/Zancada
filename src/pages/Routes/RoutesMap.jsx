import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from 'react-leaflet'

const DEFAULT_CENTER = [42.8782, -8.5448]

function MapRecenter({ center }) {
  const map = useMap()
  map.setView(center, map.getZoom())
  return null
}

function getStartPoint(route) {
  const points = JSON.parse(route.path)

  if (points.length === 0) {
    return null
  }

  return [points[0].latitude, points[0].longitude]
}

function RoutesMap({ userPosition, routes, onSelectRoute, onRefresh }) {
  const center = userPosition
    ? [userPosition.latitude, userPosition.longitude]
    : DEFAULT_CENTER

  return (
    <div className="routes-map-wrapper" aria-label="Mapa de rutas cercanas">
      <button
        type="button"
        className="refresh-location-button"
        onClick={onRefresh}
      >
        Actualizar
      </button>

      <MapContainer center={center} zoom={13} scrollWheelZoom={true} className="routes-map">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapRecenter center={center} />

        {userPosition && (
          <CircleMarker
            center={[userPosition.latitude, userPosition.longitude]}
            radius={8}
            pathOptions={{
              color: '#ffffff',
              fillColor: '#60A5FA',
              fillOpacity: 1,
              weight: 3
            }}
          >
            <Tooltip>Tu posición</Tooltip>
          </CircleMarker>
        )}

        {routes.map((route) => {
          const startPoint = getStartPoint(route)

          if (!startPoint) {
            return null
          }

          return (
            <CircleMarker
              key={route.id}
              center={startPoint}
              radius={9}
              pathOptions={{
                color: '#ffffff',
                fillColor: '#A78BFA',
                fillOpacity: 1,
                weight: 2
              }}
              eventHandlers={{ click: () => onSelectRoute(route.id) }}
            >
              <Tooltip>{route.name}</Tooltip>
            </CircleMarker>
          )
        })}
      </MapContainer>
    </div>
  )
}

export default RoutesMap