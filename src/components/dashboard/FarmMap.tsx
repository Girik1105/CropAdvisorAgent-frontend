'use client'

import { useEffect, useRef } from 'react'
import { Field, WeatherSnapshot, CropHealthRecord, SoilProfile } from '@/lib/types'

export interface FieldData {
  field: Field
  weather: WeatherSnapshot | null
  cropHealth: CropHealthRecord | null
  soil: SoilProfile | null
}

interface FarmMapProps {
  fieldData: FieldData[]
  selectedFieldId: string | null
  onSelectField: (id: string | null) => void
}

function ndviColor(ndvi: number): string {
  if (ndvi >= 0.6) return '#22c55e'
  if (ndvi >= 0.45) return '#84cc16'
  if (ndvi >= 0.35) return '#eab308'
  if (ndvi >= 0.25) return '#f97316'
  return '#ef4444'
}

function ndviLabel(ndvi: number): string {
  if (ndvi >= 0.6) return 'Healthy'
  if (ndvi >= 0.4) return 'Moderate'
  return 'Stressed'
}

function weatherIcon(conditions: string): string {
  const c = conditions.toLowerCase()
  if (c.includes('rain') || c.includes('drizzle')) return '🌧'
  if (c.includes('storm') || c.includes('thunder')) return '⛈'
  if (c.includes('cloud') || c.includes('overcast')) return '⛅'
  if (c.includes('snow')) return '🌨'
  return '☀️'
}

// Store refs to callbacks so the effect can use latest values
export default function FarmMap({ fieldData, selectedFieldId, onSelectField }: FarmMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.LayerGroup | null>(null)
  // Keep latest props in refs so the single effect can access them
  const fieldDataRef = useRef(fieldData)
  const selectedRef = useRef(selectedFieldId)
  const onSelectRef = useRef(onSelectField)
  fieldDataRef.current = fieldData
  selectedRef.current = selectedFieldId
  onSelectRef.current = onSelectField

  // Single effect: init map + add markers, re-run when data/selection changes
  useEffect(() => {
    if (!mapRef.current) return
    let cancelled = false

    import('leaflet').then((L) => {
      if (cancelled || !mapRef.current) return

      const data = fieldDataRef.current
      const selected = selectedRef.current

      // Init map if not yet created
      if (!mapInstanceRef.current) {
        // Clear stale Leaflet state
        const container = mapRef.current as unknown as Record<string, unknown>
        if (container._leaflet_id) delete container._leaflet_id

        const center = data.length > 0
          ? {
              lat: data.reduce((s, d) => s + d.field.lat, 0) / data.length,
              lng: data.reduce((s, d) => s + d.field.lng, 0) / data.length,
            }
          : { lat: 32.88, lng: -111.75 }

        const map = L.map(mapRef.current!, {
          center: [center.lat, center.lng],
          zoom: 12,
          zoomControl: false,
          attributionControl: false,
        })

        L.tileLayer(
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          { maxZoom: 18 }
        ).addTo(map)

        L.control.zoom({ position: 'topright' }).addTo(map)
        L.control.attribution({ position: 'bottomright', prefix: false })
          .addAttribution('Esri Satellite')
          .addTo(map)

        mapInstanceRef.current = map
        markersRef.current = L.layerGroup().addTo(map)
      }

      // Update markers
      const map = mapInstanceRef.current!
      const markers = markersRef.current!
      markers.clearLayers()

      data.forEach((d) => {
        const { field, weather, cropHealth } = d
        const ndvi = cropHealth?.ndvi_score ?? field.last_ndvi ?? 0.5
        const color = ndviColor(ndvi)
        const isSelected = selected === field.id
        const stress = cropHealth?.stress_level

        // Circle for field area
        const radius = Math.max(Math.sqrt(field.area_acres) * 15, 80)
        const circle = L.circle([field.lat, field.lng], {
          radius,
          color: isSelected ? '#C4704B' : color,
          weight: isSelected ? 3 : 2,
          fillColor: color,
          fillOpacity: isSelected ? 0.4 : 0.25,
          className: stress === 'severe' || stress === 'high' ? 'field-pulse' : '',
        })

        circle.bindPopup(buildPopup(field, weather, cropHealth, ndvi, color), {
          className: 'farm-popup',
          maxWidth: 280,
          closeButton: false,
        })

        // Label marker
        const label = L.divIcon({
          className: 'field-label-marker',
          html: `
            <div style="display:flex;flex-direction:column;align-items:center;gap:4px;transform:translateX(-50%);pointer-events:none;">
              <div style="background:white;border:2px solid ${isSelected ? '#C4704B' : color};border-radius:12px;padding:4px 10px;font-size:12px;font-weight:700;color:#2C2C28;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.15);pointer-events:auto;cursor:pointer;">
                ${weather ? weatherIcon(weather.conditions) : ''} ${field.name}
              </div>
              <div style="display:flex;gap:6px;align-items:center;">
                <span style="background:${color};color:white;font-size:10px;font-weight:700;padding:2px 6px;border-radius:8px;box-shadow:0 1px 4px rgba(0,0,0,0.2);">${ndvi.toFixed(2)} ${ndviLabel(ndvi)}</span>
                ${weather ? `<span style="background:white;font-size:10px;font-weight:600;padding:2px 6px;border-radius:8px;box-shadow:0 1px 4px rgba(0,0,0,0.1);color:#2C2C28;">${Math.round(weather.temp_f)}°F</span>` : ''}
              </div>
            </div>
          `,
          iconSize: [0, 0],
          iconAnchor: [0, 40],
        })

        const labelMarker = L.marker([field.lat, field.lng], { icon: label })

        circle.on('click', () => onSelectRef.current(isSelected ? null : field.id))
        labelMarker.on('click', () => {
          onSelectRef.current(isSelected ? null : field.id)
          circle.openPopup()
        })

        markers.addLayer(circle)
        markers.addLayer(labelMarker)
      })

      // Fit bounds
      if (data.length > 1) {
        const bounds = L.latLngBounds(data.map((d) => [d.field.lat, d.field.lng] as L.LatLngTuple))
        map.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 })
      } else if (data.length === 1) {
        map.setView([data[0].field.lat, data[0].field.lng], 13)
      }
    })

    return () => {
      cancelled = true
    }
  }, [fieldData, selectedFieldId])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mapInstanceRef.current?.remove()
      mapInstanceRef.current = null
      markersRef.current = null
    }
  }, [])

  return (
    <div className="relative rounded-xl overflow-hidden border border-0.5 border-grid">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" />
      <style>{`
        .farm-popup .leaflet-popup-content-wrapper { border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); padding: 0; }
        .farm-popup .leaflet-popup-content { margin: 0; font-family: inherit; }
        .farm-popup .leaflet-popup-tip { box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .field-label-marker { background: transparent !important; border: none !important; }
        @keyframes field-pulse-anim { 0%, 100% { opacity: 0.25; } 50% { opacity: 0.5; } }
        .field-pulse { animation: field-pulse-anim 2s ease-in-out infinite; }
      `}</style>
      <div ref={mapRef} style={{ height: 'clamp(350px, 45vw, 520px)', width: '100%' }} />
      {fieldData.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-bg/80 backdrop-blur-sm">
          <div className="text-center">
            <p className="text-[15px] font-medium text-text/50">No fields to display</p>
            <p className="text-[12px] text-text/30 mt-1">Add a field to see it on the map</p>
          </div>
        </div>
      )}
    </div>
  )
}

function buildPopup(
  field: Field,
  weather: WeatherSnapshot | null,
  cropHealth: CropHealthRecord | null,
  ndvi: number,
  color: string
): string {
  let html = `
    <div style="padding:16px;">
      <div style="font-size:15px;font-weight:700;color:#2C2C28;margin-bottom:2px;">${field.name}</div>
      <div style="font-size:11px;color:#2C2C28aa;margin-bottom:12px;">${field.crop_type} · ${field.area_acres} acres · ${field.soil_type}</div>
      <div style="margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
          <span style="font-size:11px;color:#2C2C28aa;">Vegetation Health</span>
          <span style="font-size:12px;font-weight:700;color:${color};">${ndvi.toFixed(2)} ${ndviLabel(ndvi)}</span>
        </div>
        <div style="height:6px;background:#E5E2D8;border-radius:3px;overflow:hidden;">
          <div style="height:100%;width:${ndvi * 100}%;background:${color};border-radius:3px;"></div>
        </div>
      </div>`

  if (weather) {
    html += `
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;padding:10px;background:#F5F3EC;border-radius:8px;margin-bottom:8px;">
        <div style="text-align:center;"><div style="font-size:16px;font-weight:700;color:#2C2C28;">${Math.round(weather.temp_f)}°F</div><div style="font-size:10px;color:#2C2C28aa;">temp</div></div>
        <div style="text-align:center;"><div style="font-size:16px;font-weight:700;color:#2C2C28;">${weather.humidity_pct}%</div><div style="font-size:10px;color:#2C2C28aa;">humidity</div></div>
        <div style="text-align:center;"><div style="font-size:16px;font-weight:700;color:#2C2C28;">${weather.wind_mph}mph</div><div style="font-size:10px;color:#2C2C28aa;">wind</div></div>
      </div>`
  }

  if (cropHealth?.stress_level) {
    const sc = cropHealth.stress_level === 'low' ? '#22c55e' : cropHealth.stress_level === 'moderate' ? '#eab308' : '#ef4444'
    html += `
      <div style="display:flex;gap:6px;align-items:center;">
        <span style="font-size:11px;color:#2C2C28aa;">Stress:</span>
        <span style="background:${sc}22;color:${sc};font-size:11px;font-weight:600;padding:2px 8px;border-radius:6px;text-transform:capitalize;">${cropHealth.stress_level}</span>
        <span style="font-size:11px;color:#2C2C28aa;">Trend:</span>
        <span style="font-size:11px;font-weight:600;color:#2C2C28;text-transform:capitalize;">${cropHealth.vegetation_trend}</span>
      </div>`
  }

  html += `</div>`
  return html
}
