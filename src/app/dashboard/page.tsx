'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import { Field, SessionSummary, WeatherSnapshot, CropHealthRecord, SoilProfile } from '@/lib/types'
import NDVIBar from '@/components/fields/NDVIBar'
import AddFieldModal from '@/components/dashboard/AddFieldModal'
import FarmMap from '@/components/dashboard/FarmMap'

interface FieldData {
  field: Field
  weather: WeatherSnapshot | null
  cropHealth: CropHealthRecord | null
  soil: SoilProfile | null
}

export default function DashboardPage() {
  const [fieldData, setFieldData] = useState<FieldData[]>([])
  const [sessions, setSessions] = useState<SessionSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddField, setShowAddField] = useState(false)
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    const fields = await api.getFields()

    const [fieldDetails, allSessions] = await Promise.all([
      Promise.all(
        fields.map(async (field) => {
          const [weatherList, healthList, soil] = await Promise.all([
            api.getFieldWeather(field.id),
            api.getFieldCropHealth(field.id),
            api.getFieldSoil(field.id),
          ])
          return {
            field,
            weather: weatherList[0] || null,
            cropHealth: healthList[0] || null,
            soil,
          }
        })
      ),
      Promise.all(fields.map((f) => api.getFieldSessions(f.id))).then((r) => r.flat()),
    ])

    setSessions(allSessions)
    setFieldData(fieldDetails)
    setLoading(false)
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Count fields with stressed NDVI as alerts
  const urgentCount = fieldData.filter(
    (d) => d.cropHealth && d.cropHealth.ndvi_score < 0.4
  ).length

  const selectedData = selectedFieldId
    ? fieldData.find((d) => d.field.id === selectedFieldId)
    : null

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 w-full pt-16 lg:pt-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display text-primary text-[24px] font-semibold tracking-wide">
            Overview
          </h1>
          <p className="font-editorial italic text-text/40 text-[15px] mt-1">
            Environmental data across your registered fields
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
        onFieldAdded={loadData}
      />

      {/* Metrics row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <MetricCard
          label="Fields"
          value={loading ? '...' : `${fieldData.length}`}
          sub="registered"
        />
        <MetricCard
          label="Sessions"
          value={loading ? '...' : `${sessions.length}`}
          sub="total interactions"
        />
        <MetricCard
          label="Alerts"
          value={loading ? '...' : `${urgentCount}`}
          sub="need attention"
          highlight={urgentCount > 0}
        />
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="bg-paper border border-0.5 border-grid rounded-lg animate-pulse" style={{ height: 360 }} />
          <FieldSkeleton />
        </div>
      ) : fieldData.length === 0 ? (
        <div className="bg-paper border border-0.5 border-grid rounded-lg p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-primary" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 14V6l6-4 6 4v8H2z" />
              <path d="M6 14V9h4v5" />
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
          {/* Farm Map */}
          <div className="mb-6">
            <FarmMap
              fieldData={fieldData}
              selectedFieldId={selectedFieldId}
              onSelectField={setSelectedFieldId}
            />
          </div>

          {/* Selected field detail or all fields */}
          <div className="space-y-6">
            {selectedData ? (
              <FieldPanel
                field={selectedData.field}
                weather={selectedData.weather}
                cropHealth={selectedData.cropHealth}
                soil={selectedData.soil}
              />
            ) : (
              fieldData.map(({ field, weather, cropHealth, soil }) => (
                <FieldPanel
                  key={field.id}
                  field={field}
                  weather={weather}
                  cropHealth={cropHealth}
                  soil={soil}
                />
              ))
            )}
          </div>
        </>
      )}
    </div>
  )
}

// ─── Metric card ───

function MetricCard({ label, value, sub, highlight }: { label: string; value: string; sub: string; highlight?: boolean }) {
  return (
    <div className="bg-paper border border-0.5 border-grid rounded-lg p-5">
      <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-text/40">
        {label}
      </span>
      <p className={`text-[28px] font-display font-semibold leading-none mt-2 ${highlight ? 'text-critical' : 'text-text'}`}>
        {value}
      </p>
      <p className="text-[12px] text-text/30 mt-1">{sub}</p>
    </div>
  )
}

// ─── Field panel ───

function FieldPanel({
  field,
  weather,
  cropHealth,
  soil,
}: {
  field: Field
  weather: WeatherSnapshot | null
  cropHealth: CropHealthRecord | null
  soil: SoilProfile | null
}) {
  return (
    <div className="bg-paper border border-0.5 border-grid rounded-lg overflow-hidden">
      {/* Field header */}
      <div className="px-5 pt-5 pb-4 border-b border-grid">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-[16px] font-semibold text-text">{field.name}</h2>
            <p className="text-[12px] text-sand mt-0.5">
              {field.crop_type} · {field.area_acres} acres · {field.soil_type}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/dashboard/sessions?field=${field.id}`}
              className="text-[12px] text-accent hover:text-accent/80 font-medium transition-colors"
            >
              View sessions →
            </Link>
            <span className="font-mono text-[10px] text-sand">
              {field.lat.toFixed(4)}°N, {Math.abs(field.lng).toFixed(4)}°W
            </span>
          </div>
        </div>
      </div>

      {/* Data grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-grid">
        {/* Weather */}
        <div className="p-5">
          <SectionLabel label="Weather" />
          {weather ? (
            <div className="space-y-3 mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-[28px] font-display font-semibold text-text leading-none">
                  {Math.round(weather.temp_f)}°F
                </span>
                <span className="text-[13px] text-text/40">
                  {Math.round(weather.temp_c)}°C
                </span>
              </div>
              <p className="text-[13px] text-text/60 capitalize">{weather.conditions}</p>
              <div className="grid grid-cols-2 gap-2">
                <DataChip label="Humidity" value={`${Math.round(weather.humidity_pct)}%`} />
                <DataChip label="Wind" value={`${Math.round(weather.wind_mph)} mph`} />
                {weather.uv_index != null && (
                  <DataChip label="UV Index" value={`${weather.uv_index}`} />
                )}
              </div>
              {weather.precipitation_forecast.length > 0 && (
                <div className="mt-2">
                  <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-text/30">
                    Precipitation Forecast
                  </span>
                  <div className="flex gap-2 mt-1.5">
                    {weather.precipitation_forecast.slice(0, 3).map((day) => (
                      <div
                        key={day.date}
                        className="flex-1 bg-bg rounded-card px-2 py-1.5 text-center"
                      >
                        <p className="font-mono text-[10px] text-sand">
                          {new Date(day.date + 'T00:00:00').toLocaleDateString('en-US', {
                            weekday: 'short',
                          })}
                        </p>
                        <p className="font-mono text-[12px] text-text/70 font-medium">
                          {day.precip_in}&quot;
                        </p>
                        <p className="font-mono text-[10px] text-text/30">{day.prob_pct}%</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <Timestamp date={weather.created_at} />
            </div>
          ) : (
            <EmptyState text="No weather data yet" />
          )}
        </div>

        {/* Crop Health */}
        <div className="p-5">
          <SectionLabel label="Crop Health" />
          {cropHealth ? (
            <div className="space-y-3 mt-3">
              <NDVIBar value={cropHealth.ndvi_score} />
              <div className="grid grid-cols-2 gap-2">
                <DataChip label="Stress" value={cropHealth.stress_level} />
                <DataChip label="Trend" value={cropHealth.vegetation_trend} />
                <DataChip
                  label="Vegetation"
                  value={`${Math.round(cropHealth.vegetation_fraction * 100)}%`}
                />
              </div>
              {cropHealth.last_satellite_date && (
                <p className="text-[10px] text-text/25 font-mono">
                  Satellite:{' '}
                  {new Date(cropHealth.last_satellite_date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              )}
              <Timestamp date={cropHealth.created_at} />
            </div>
          ) : (
            <EmptyState text="No crop health data yet" />
          )}
        </div>

        {/* Soil */}
        <div className="p-5">
          <SectionLabel label="Soil Profile" />
          {soil ? (
            <div className="space-y-3 mt-3">
              <p className="text-[13px] font-medium text-text">{soil.soil_type}</p>
              <div className="grid grid-cols-2 gap-2">
                <DataChip label="pH" value={soil.ph.toFixed(1)} />
                <DataChip label="Organic Matter" value={`${soil.organic_matter_pct}%`} />
                <DataChip label="Drainage" value={soil.drainage_class} />
                <DataChip label="Water Capacity" value={soil.water_holding_capacity} />
                <DataChip
                  label="Avail. Water"
                  value={`${soil.available_water_in_per_ft} in/ft`}
                />
              </div>
              <Timestamp date={soil.updated_at} />
            </div>
          ) : (
            <EmptyState text="No soil profile yet" />
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Shared small components ───

function SectionLabel({ label }: { label: string }) {
  return (
    <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-text/40">
      {label}
    </span>
  )
}

function DataChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-bg rounded-card px-2.5 py-1.5">
      <p className="text-[10px] text-text/30 uppercase tracking-wider leading-none mb-0.5">
        {label}
      </p>
      <p className="font-mono text-[12px] text-text/70 font-medium capitalize leading-tight">
        {value}
      </p>
    </div>
  )
}

function Timestamp({ date }: { date: string }) {
  return (
    <p className="text-[10px] text-text/25 font-mono">
      Updated{' '}
      {new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })}
    </p>
  )
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="mt-3 bg-bg rounded-card px-4 py-6 text-center">
      <p className="text-[13px] text-text/30">{text}</p>
      <p className="text-[11px] text-text/20 mt-0.5">Run the agent to populate</p>
    </div>
  )
}

function FieldSkeleton() {
  return (
    <div className="bg-paper border border-0.5 border-grid rounded-lg p-5 animate-pulse">
      <div className="h-5 bg-grid rounded w-1/4 mb-2" />
      <div className="h-3 bg-grid rounded w-1/3 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-3">
            <div className="h-3 bg-grid rounded w-1/2" />
            <div className="h-8 bg-grid rounded w-2/3" />
            <div className="h-3 bg-grid rounded w-full" />
            <div className="h-3 bg-grid rounded w-3/4" />
          </div>
        ))}
      </div>
    </div>
  )
}
