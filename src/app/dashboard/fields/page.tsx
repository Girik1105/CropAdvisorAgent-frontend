'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import AddFieldModal from '@/components/dashboard/AddFieldModal'
import FarmMap, { FieldData } from '@/components/dashboard/FarmMap'
import NDVIBar from '@/components/fields/NDVIBar'
import { api } from '@/lib/api'
import { Field, WeatherSnapshot, CropHealthRecord, SoilProfile, SessionSummary } from '@/lib/types'

interface EnrichedField {
  field: Field
  weather: WeatherSnapshot | null
  cropHealth: CropHealthRecord | null
  soil: SoilProfile | null
  lastSession: SessionSummary | null
  sessionCount: number
}

export default function DashboardFieldsPage() {
  const [enrichedFields, setEnrichedFields] = useState<EnrichedField[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddField, setShowAddField] = useState(false)
  const [expandedFieldId, setExpandedFieldId] = useState<string | null>(null)
  const [selectedMapField, setSelectedMapField] = useState<string | null>(null)

  const loadFields = useCallback(async () => {
    setLoading(true)
    try {
      const fields = await api.getFields()
      const enriched = await Promise.all(
        fields.map(async (field) => {
          const [weatherList, healthList, soil, sessions] = await Promise.all([
            api.getFieldWeather(field.id),
            api.getFieldCropHealth(field.id),
            api.getFieldSoil(field.id),
            api.getFieldSessions(field.id),
          ])
          const sortedSessions = sessions.sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )
          return {
            field,
            weather: weatherList[0] || null,
            cropHealth: healthList[0] || null,
            soil,
            lastSession: sortedSessions[0] || null,
            sessionCount: sortedSessions.length,
          }
        })
      )
      setEnrichedFields(enriched)
    } catch {
      setEnrichedFields([])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    loadFields()
  }, [loadFields])

  async function handleDelete(fieldId: string) {
    try {
      await api.deleteField(fieldId)
      setEnrichedFields((prev) => prev.filter((e) => e.field.id !== fieldId))
      if (expandedFieldId === fieldId) setExpandedFieldId(null)
    } catch { /* silently fail */ }
  }

  // Prepare map data
  const mapFieldData: FieldData[] = enrichedFields.map((e) => ({
    field: e.field,
    weather: e.weather,
    cropHealth: e.cropHealth,
    soil: e.soil,
  }))

  const totalAcres = enrichedFields.reduce((sum, e) => sum + e.field.area_acres, 0)
  const avgNdvi = enrichedFields.length > 0
    ? enrichedFields.reduce((sum, e) => sum + (e.cropHealth?.ndvi_score ?? e.field.last_ndvi ?? 0), 0) / enrichedFields.length
    : 0

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 w-full pt-16 lg:pt-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display text-primary text-[24px] font-semibold tracking-wide">
            My Fields
          </h1>
          <p className="font-editorial italic text-text/40 text-[15px] mt-1">
            Manage your fields and view environmental data
          </p>
        </div>
        <button
          onClick={() => setShowAddField(true)}
          className="bg-primary hover:bg-primary/90 text-white text-[13px] font-semibold px-5 py-2.5 rounded-full transition-colors flex items-center gap-2 flex-shrink-0"
        >
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 3v10M3 8h10" />
          </svg>
          Add Field
        </button>
      </div>

      <AddFieldModal
        open={showAddField}
        onClose={() => setShowAddField(false)}
        onFieldAdded={loadFields}
      />

      {loading ? (
        <div className="space-y-6">
          <div className="bg-paper border border-0.5 border-grid rounded-xl animate-pulse" style={{ height: 360 }} />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-paper border border-0.5 border-grid rounded-xl p-5 animate-pulse h-20" />
            ))}
          </div>
          {[1, 2].map((i) => (
            <div key={i} className="bg-paper border border-0.5 border-grid rounded-xl p-6 animate-pulse h-48" />
          ))}
        </div>
      ) : enrichedFields.length === 0 ? (
        <div className="bg-paper border border-0.5 border-grid rounded-xl p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-primary/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-[16px] font-semibold text-text mb-1">No fields registered yet</p>
          <p className="text-[13px] text-text/40 mb-5">
            Add your first field to start monitoring weather, crop health, and soil data
          </p>
          <button
            onClick={() => setShowAddField(true)}
            className="bg-primary hover:bg-primary/90 text-white text-[13px] font-semibold px-6 py-2.5 rounded-full transition-colors inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 3v10M3 8h10" />
            </svg>
            Add Your First Field
          </button>
        </div>
      ) : (
        <>
          {/* Map */}
          <div className="mb-6">
            <FarmMap
              fieldData={mapFieldData}
              selectedFieldId={selectedMapField}
              onSelectField={setSelectedMapField}
            />
          </div>

          {/* Summary metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <MetricCard label="Fields" value={`${enrichedFields.length}`} />
            <MetricCard label="Total Area" value={`${totalAcres} ac`} />
            <MetricCard label="Avg NDVI" value={avgNdvi.toFixed(2)} highlight={avgNdvi < 0.4} />
            <MetricCard
              label="Sessions"
              value={`${enrichedFields.reduce((s, e) => s + e.sessionCount, 0)}`}
            />
          </div>

          {/* Field cards */}
          <div className="space-y-4">
            {enrichedFields.map((enriched) => (
              <FieldDetailCard
                key={enriched.field.id}
                data={enriched}
                expanded={expandedFieldId === enriched.field.id}
                onToggle={() =>
                  setExpandedFieldId(expandedFieldId === enriched.field.id ? null : enriched.field.id)
                }
                onDelete={() => handleDelete(enriched.field.id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function MetricCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="bg-paper border border-0.5 border-grid rounded-xl px-4 py-3">
      <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-text/35">{label}</span>
      <p className={`text-[22px] font-display font-semibold leading-none mt-1 ${highlight ? 'text-critical' : 'text-text'}`}>
        {value}
      </p>
    </div>
  )
}

function FieldDetailCard({
  data,
  expanded,
  onToggle,
  onDelete,
}: {
  data: EnrichedField
  expanded: boolean
  onToggle: () => void
  onDelete: () => void
}) {
  const { field, weather, cropHealth, soil, lastSession, sessionCount } = data
  const ndvi = cropHealth?.ndvi_score ?? field.last_ndvi ?? 0

  return (
    <div className={`bg-paper border border-0.5 rounded-xl transition-all ${expanded ? 'border-sand shadow-sm' : 'border-grid'}`}>
      {/* Header — clickable */}
      <button onClick={onToggle} className="w-full text-left p-5 flex items-center gap-4">
        {/* Crop icon */}
        <div className="w-11 h-11 rounded-xl bg-primary/8 flex items-center justify-center flex-shrink-0">
          <span className="text-[20px]">{cropIcon(field.crop_type)}</span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-[15px] font-semibold text-text truncate">{field.name}</h3>
            <span className="text-[10px] font-semibold text-text/30 bg-bg px-2 py-0.5 rounded-full capitalize flex-shrink-0">
              {field.crop_type}
            </span>
          </div>
          <p className="text-[12px] text-text/40">
            {field.area_acres} acres &middot; {field.soil_type} &middot;{' '}
            <span className="font-mono">{field.lat.toFixed(3)}°, {field.lng.toFixed(3)}°</span>
          </p>
        </div>

        {/* Quick stats */}
        <div className="hidden sm:flex items-center gap-4 flex-shrink-0">
          {weather && (
            <div className="text-center">
              <p className="text-[16px] font-bold text-text tabular-nums">{Math.round(weather.temp_f)}°F</p>
              <p className="text-[10px] text-text/30 capitalize">{weather.conditions}</p>
            </div>
          )}
          {ndvi > 0 && (
            <div className="text-center">
              <p className={`text-[16px] font-bold tabular-nums ${ndvi >= 0.6 ? 'text-green-600' : ndvi >= 0.4 ? 'text-amber-500' : 'text-red-500'}`}>
                {ndvi.toFixed(2)}
              </p>
              <p className="text-[10px] text-text/30">NDVI</p>
            </div>
          )}
          <div className="text-center">
            <p className="text-[16px] font-bold text-text tabular-nums">{sessionCount}</p>
            <p className="text-[10px] text-text/30">reports</p>
          </div>
        </div>

        <svg
          className={`w-4 h-4 text-text/30 transition-transform duration-300 flex-shrink-0 ${expanded ? 'rotate-180' : ''}`}
          viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <path d="M4 6l4 4 4-4" />
        </svg>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-grid">
          {/* Data grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-grid">
            {/* Weather */}
            <div className="p-5">
              <SectionLabel label="Weather" icon="🌤" />
              {weather ? (
                <div className="mt-3 space-y-3">
                  <div className="flex items-baseline gap-3">
                    <span className="text-[28px] font-display font-semibold text-text leading-none">
                      {Math.round(weather.temp_f)}°F
                    </span>
                    <span className="text-[13px] text-text/40 capitalize">{weather.conditions}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <DataChip label="Humidity" value={`${Math.round(weather.humidity_pct)}%`} />
                    <DataChip label="Wind" value={`${Math.round(weather.wind_mph)} mph`} />
                    {weather.uv_index != null && <DataChip label="UV Index" value={`${weather.uv_index}`} />}
                  </div>
                  {weather.precipitation_forecast.length > 0 && (
                    <div>
                      <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-text/30">
                        3-Day Forecast
                      </span>
                      <div className="flex gap-2 mt-1.5">
                        {weather.precipitation_forecast.slice(0, 3).map((day) => (
                          <div key={day.date} className="flex-1 bg-bg rounded-lg px-2 py-1.5 text-center">
                            <p className="font-mono text-[10px] text-text/35">
                              {new Date(day.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' })}
                            </p>
                            <p className="font-mono text-[12px] text-text/70 font-medium">{day.precip_in}&quot;</p>
                            <p className="font-mono text-[10px] text-text/30">{day.prob_pct}%</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <Timestamp date={weather.created_at} />
                </div>
              ) : (
                <EmptyData text="No weather data" />
              )}
            </div>

            {/* Crop Health */}
            <div className="p-5">
              <SectionLabel label="Crop Health" icon="🌱" />
              {cropHealth ? (
                <div className="mt-3 space-y-3">
                  <NDVIBar value={cropHealth.ndvi_score} />
                  <div className="grid grid-cols-2 gap-2">
                    <DataChip label="Stress" value={cropHealth.stress_level} />
                    <DataChip label="Trend" value={cropHealth.vegetation_trend} />
                    <DataChip label="Vegetation" value={`${Math.round(cropHealth.vegetation_fraction * 100)}%`} />
                  </div>
                  {cropHealth.last_satellite_date && (
                    <p className="text-[10px] text-text/25 font-mono">
                      Satellite: {new Date(cropHealth.last_satellite_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  )}
                  <Timestamp date={cropHealth.created_at} />
                </div>
              ) : (
                <EmptyData text="No crop health data" />
              )}
            </div>

            {/* Soil */}
            <div className="p-5">
              <SectionLabel label="Soil Profile" icon="🪨" />
              {soil ? (
                <div className="mt-3 space-y-3">
                  <div className="flex items-baseline gap-3">
                    <span className="text-[20px] font-display font-semibold text-text">pH {soil.ph.toFixed(1)}</span>
                    <span className="text-[13px] text-text/40">{soil.soil_type}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <DataChip label="Organic Matter" value={`${soil.organic_matter_pct}%`} />
                    <DataChip label="Drainage" value={soil.drainage_class} />
                    <DataChip label="Water Capacity" value={soil.water_holding_capacity} />
                    <DataChip label="Avail. Water" value={`${soil.available_water_in_per_ft} in/ft`} />
                  </div>
                  <Timestamp date={soil.updated_at} />
                </div>
              ) : (
                <EmptyData text="No soil profile" />
              )}
            </div>
          </div>

          {/* Footer: last session link + actions */}
          <div className="px-5 py-3 border-t border-grid flex items-center justify-between">
            <div className="flex items-center gap-4">
              {lastSession ? (
                <Link
                  href={`/dashboard/${lastSession.id}`}
                  className="inline-flex items-center gap-2 text-[12px] font-medium text-accent hover:text-accent/80 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Last report — {new Date(lastSession.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                </Link>
              ) : (
                <span className="text-[12px] text-text/25">No reports yet</span>
              )}

              <Link
                href={`/dashboard/sessions?field=${field.id}`}
                className="text-[12px] text-text/40 hover:text-accent transition-colors"
              >
                View all reports →
              </Link>
            </div>

            <button
              onClick={onDelete}
              className="text-[11px] text-text/25 hover:text-critical transition-colors"
            >
              Delete field
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function cropIcon(cropType: string): string {
  const c = cropType.toLowerCase()
  if (c.includes('cotton')) return '🌿'
  if (c.includes('citrus') || c.includes('orange') || c.includes('lemon')) return '🍊'
  if (c.includes('alfalfa')) return '🌾'
  if (c.includes('corn')) return '🌽'
  if (c.includes('wheat')) return '🌾'
  if (c.includes('soy')) return '🫘'
  if (c.includes('vegetable')) return '🥬'
  return '🌱'
}

function SectionLabel({ label, icon }: { label: string; icon: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[13px]">{icon}</span>
      <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-text/40">{label}</span>
    </div>
  )
}

function DataChip({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-bg rounded-lg px-2.5 py-1.5">
      <p className="text-[9px] text-text/30 uppercase tracking-wider leading-none mb-0.5">{label}</p>
      <p className="font-mono text-[12px] text-text/70 font-medium capitalize leading-tight">{value}</p>
    </div>
  )
}

function Timestamp({ date }: { date: string }) {
  return (
    <p className="text-[10px] text-text/25 font-mono">
      Updated {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
    </p>
  )
}

function EmptyData({ text }: { text: string }) {
  return (
    <div className="mt-3 bg-bg rounded-lg px-4 py-6 text-center">
      <p className="text-[13px] text-text/30">{text}</p>
      <p className="text-[11px] text-text/20 mt-0.5">Run a health check to populate</p>
    </div>
  )
}
