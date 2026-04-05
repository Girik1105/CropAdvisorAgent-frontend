'use client'

import { useState } from 'react'
import { Field, WeatherSnapshot, CropHealthRecord, SoilProfile } from '@/lib/types'
import { api } from '@/lib/api'
import NDVIBar from './NDVIBar'

type Tab = 'weather' | 'crop' | 'soil'

interface FieldCardProps {
  field: Field
  onDelete?: (fieldId: string) => void
}

export default function FieldCard({ field, onDelete }: FieldCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('weather')
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null)
  const [cropHealth, setCropHealth] = useState<CropHealthRecord | null>(null)
  const [soil, setSoil] = useState<SoilProfile | null>(null)
  const [loadingTab, setLoadingTab] = useState<Tab | null>(null)
  const [loaded, setLoaded] = useState<Set<Tab>>(new Set())

  async function loadTab(tab: Tab) {
    if (loaded.has(tab)) return
    setLoadingTab(tab)
    try {
      if (tab === 'weather') {
        const data = await api.getFieldWeather(field.id)
        setWeather(data.length > 0 ? data[0] : null)
      } else if (tab === 'crop') {
        const data = await api.getFieldCropHealth(field.id)
        setCropHealth(data.length > 0 ? data[0] : null)
      } else if (tab === 'soil') {
        const data = await api.getFieldSoil(field.id)
        setSoil(data)
      }
      setLoaded((prev) => new Set(prev).add(tab))
    } catch { /* empty */ }
    setLoadingTab(null)
  }

  async function refreshTab(tab: Tab) {
    setLoaded((prev) => {
      const next = new Set(prev)
      next.delete(tab)
      return next
    })
    await loadTab(tab)
  }

  function handleExpand() {
    const next = !expanded
    setExpanded(next)
    if (next) loadTab(activeTab)
  }

  function handleTabChange(tab: Tab) {
    setActiveTab(tab)
    loadTab(tab)
  }

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'weather', label: 'Weather', icon: '🌤' },
    { key: 'crop', label: 'Crop Health', icon: '🌱' },
    { key: 'soil', label: 'Soil', icon: '🪨' },
  ]

  return (
    <div className={`bg-paper border border-0.5 rounded-xl transition-all duration-300 ${
      expanded ? 'border-sand shadow-sm' : 'border-grid hover:border-sand'
    }`}>
      {/* Header — always visible, clickable */}
      <button
        onClick={handleExpand}
        className="w-full text-left p-5 flex items-center justify-between gap-3"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-1">
            <h3 className="text-[15px] font-semibold text-text">{field.name}</h3>
            <span className="text-[11px] font-medium text-text/30 bg-bg px-2 py-0.5 rounded-full capitalize">
              {field.crop_type}
            </span>
          </div>
          <p className="text-[12px] text-text/40">
            {field.area_acres} acres &middot; {field.soil_type} &middot;{' '}
            <span className="font-mono">{field.lat.toFixed(3)}°, {field.lng.toFixed(3)}°</span>
          </p>
        </div>

        {field.last_ndvi !== undefined && !expanded && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[13px] font-bold text-text tabular-nums">{field.last_ndvi}</span>
            <span className="text-[10px] text-text/30">NDVI</span>
          </div>
        )}

        <svg
          className={`w-4 h-4 text-text/30 transition-transform duration-300 flex-shrink-0 ${expanded ? 'rotate-180' : ''}`}
          viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <path d="M4 6l4 4 4-4" />
        </svg>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-grid">
          {/* Tabs */}
          <div className="flex items-center gap-1 mt-4 mb-4 bg-bg rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`flex-1 flex items-center justify-center gap-1.5 text-[12px] font-medium py-2 rounded-md transition-all ${
                  activeTab === tab.key
                    ? 'bg-paper text-text shadow-sm'
                    : 'text-text/40 hover:text-text/60'
                }`}
              >
                <span className="text-[13px]">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="min-h-[140px]">
            {loadingTab === activeTab ? (
              <div className="flex items-center justify-center py-10">
                <div className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {activeTab === 'weather' && <WeatherTab data={weather} onRefresh={() => refreshTab('weather')} />}
                {activeTab === 'crop' && <CropHealthTab data={cropHealth} ndvi={field.last_ndvi} onRefresh={() => refreshTab('crop')} />}
                {activeTab === 'soil' && <SoilTab data={soil} />}
              </>
            )}
          </div>

          {/* Delete */}
          {onDelete && (
            <div className="mt-4 pt-3 border-t border-grid flex justify-end">
              <button
                onClick={() => onDelete(field.id)}
                className="text-[11px] text-text/30 hover:text-critical transition-colors"
              >
                Delete field
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ── Tab Components ── */

function DataRow({ label, value, mono }: { label: string; value: string | number | null | undefined; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-[12px] text-text/40">{label}</span>
      <span className={`text-[13px] font-medium text-text ${mono ? 'font-mono' : ''}`}>
        {value ?? '—'}
      </span>
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-8">
      <p className="text-[13px] text-text/40">{message}</p>
      <p className="text-[11px] text-text/25 mt-1">Run the agent on this field to populate</p>
    </div>
  )
}

function RefreshButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 text-[11px] font-medium text-accent hover:text-accent/80 transition-colors"
    >
      <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M2 8a6 6 0 0 1 10.2-4.3M14 8a6 6 0 0 1-10.2 4.3" />
        <path d="M12 2v4h-4M4 14v-4h4" />
      </svg>
      Refresh
    </button>
  )
}

function WeatherTab({ data, onRefresh }: { data: WeatherSnapshot | null; onRefresh: () => void }) {
  if (!data) return <EmptyState message="No weather data yet" />

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] text-text/25">
          Updated {new Date(data.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
        </span>
        <RefreshButton onClick={onRefresh} />
      </div>

      {/* Main metrics */}
      <div className="flex items-baseline gap-6 mb-4">
        <div>
          <span className="text-[28px] font-bold text-text tabular-nums">{Math.round(data.temp_f)}°</span>
          <span className="text-[12px] text-text/30 ml-0.5">F</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[16px] font-semibold text-text capitalize">{data.conditions}</span>
          <span className="text-[11px] text-text/30">conditions</span>
        </div>
      </div>

      <div className="space-y-0.5 mb-4">
        <DataRow label="Humidity" value={`${data.humidity_pct}%`} />
        <DataRow label="Wind" value={`${data.wind_mph} mph`} />
        {data.uv_index !== null && <DataRow label="UV Index" value={data.uv_index} />}
      </div>

      {/* Precipitation forecast */}
      {data.precipitation_forecast.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold text-text/30 uppercase tracking-wider mb-2">Precipitation Forecast</p>
          <div className="grid grid-cols-3 gap-2">
            {data.precipitation_forecast.slice(0, 3).map((day) => (
              <div key={day.date} className="bg-bg rounded-lg px-3 py-2 text-center">
                <p className="text-[10px] text-text/30 font-mono">
                  {new Date(day.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' })}
                </p>
                <p className="text-[14px] font-bold text-text mt-0.5">{day.precip_in}&quot;</p>
                <p className="text-[10px] text-text/30">{day.prob_pct}% chance</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function CropHealthTab({ data, ndvi, onRefresh }: { data: CropHealthRecord | null; ndvi?: number; onRefresh: () => void }) {
  const score = data?.ndvi_score ?? ndvi

  if (!data && score === undefined) return <EmptyState message="No crop health data yet" />

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        {data?.created_at && (
          <span className="text-[11px] text-text/25">
            Updated {new Date(data.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
          </span>
        )}
        <RefreshButton onClick={onRefresh} />
      </div>

      {score !== undefined && (
        <div className="mb-4">
          <NDVIBar value={score} />
        </div>
      )}

      {data && (
        <div className="space-y-0.5">
          <DataRow label="Stress Level" value={data.stress_level} />
          <DataRow label="Vegetation Trend" value={data.vegetation_trend} />
          <DataRow label="Vegetation Fraction" value={`${(data.vegetation_fraction * 100).toFixed(0)}%`} />
          {data.last_satellite_date && (
            <DataRow
              label="Last Satellite"
              value={new Date(data.last_satellite_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            />
          )}
        </div>
      )}
    </div>
  )
}

function SoilTab({ data }: { data: SoilProfile | null }) {
  if (!data) return <EmptyState message="No soil profile yet" />

  return (
    <div>
      <div className="mb-3">
        <span className="text-[11px] text-text/25">
          Updated {new Date(data.updated_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
        </span>
      </div>

      <div className="flex items-baseline gap-4 mb-4">
        <div>
          <span className="text-[20px] font-bold text-text">pH {data.ph}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[15px] font-semibold text-text">{data.soil_type}</span>
          <span className="text-[11px] text-text/30">classification</span>
        </div>
      </div>

      <div className="space-y-0.5">
        <DataRow label="Organic Matter" value={`${data.organic_matter_pct}%`} />
        <DataRow label="Drainage" value={data.drainage_class} />
        <DataRow label="Water Capacity" value={data.water_holding_capacity} />
        <DataRow label="Available Water" value={`${data.available_water_in_per_ft} in/ft`} />
      </div>
    </div>
  )
}
