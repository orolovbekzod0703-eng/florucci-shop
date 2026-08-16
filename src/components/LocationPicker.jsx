import { useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import 'leaflet/dist/leaflet.css'

const icon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

const TASHKENT = { lat: 41.311081, lng: 69.240562 }

function ClickHandler({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect({ lat: e.latlng.lat, lng: e.latlng.lng })
    },
  })
  return null
}

export default function LocationPicker({ value, onChange }) {
  const [position, setPosition] = useState(value || null)

  function handleSelect(pos) {
    setPosition(pos)
    onChange(pos)
  }

  function useMyLocation() {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(p => {
      handleSelect({ lat: p.coords.latitude, lng: p.coords.longitude })
    })
  }

  return (
    <div>
      <div style={{ borderRadius: 14, overflow: 'hidden', border: '1.5px solid var(--line)', height: 220 }}>
        <MapContainer
          center={position || TASHKENT}
          zoom={position ? 15 : 11}
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onSelect={handleSelect} />
          {position && (
            <Marker
              position={position}
              icon={icon}
              draggable
              eventHandlers={{
                dragend: e => handleSelect(e.target.getLatLng()),
              }}
            />
          )}
        </MapContainer>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
        <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
          {position ? "Joy belgilandi — sudrab to'g'rilashingiz mumkin" : 'Xaritada bosib joyingizni belgilang'}
        </span>
        <button type="button" className="btn-ghost" onClick={useMyLocation} style={{ fontSize: 12 }}>
          📍 Joriy joyim
        </button>
      </div>
    </div>
  )
}
