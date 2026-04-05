'use client'

import { TraceStep as TraceStepType } from '@/lib/types'
import { useCountUp } from '@/hooks/useCountUp'
import CollapsibleJSON from './CollapsibleJSON'

const toolConfig: Record<string, { label: string; borderColor: string; bgClass: string }> = {
  get_weather: {
    label: 'Weather Analysis',
    borderColor: '#3b82f6',
    bgClass: 'bg-[#3b82f6]/[0.06]',
  },
  get_crop_health: {
    label: 'Crop Health Scan',
    borderColor: '#D4915E',
    bgClass: 'bg-[#D4915E]/[0.06]',
  },
  get_soil_profile: {
    label: 'Soil Profile',
    borderColor: '#888780',
    bgClass: 'bg-[#888780]/[0.06]',
  },
}

function WeatherMetrics({ output, visible }: { output: Record<string, unknown>; visible: boolean }) {
  const temp = useCountUp(Number(output.temp_f) || 0, 600, visible)
  const humidity = useCountUp(Number(output.humidity_pct) || 0, 600, visible)
  const rawPrecip = output.precipitation_7d_in ?? output.precipitation_forecast
  const rain = useCountUp(typeof rawPrecip === 'number' ? rawPrecip : 0, 600, visible)

  return (
    <div className="flex items-baseline gap-6 mt-2">
      <div className="flex items-baseline gap-1">
        <span className="text-[22px] font-bold text-[#2C2C28]">{temp}°F</span>
        <span className="text-[12px] text-[#2C2C28]/40">temperature</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-[22px] font-bold text-[#2C2C28]">{humidity}%</span>
        <span className="text-[12px] text-[#2C2C28]/40">humidity</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-[22px] font-bold text-[#2C2C28]">{rain}in</span>
        <span className="text-[12px] text-[#2C2C28]/40">rain (7d)</span>
      </div>
    </div>
  )
}

function CropMetrics({ output, visible }: { output: Record<string, unknown>; visible: boolean }) {
  const ndviRaw = Number(output.ndvi ?? output.ndvi_score) || 0
  const ndvi = useCountUp(ndviRaw, 600, visible)
  const affected = useCountUp(Number(output.affected_area_pct ?? output.vegetation_fraction) || 0, 600, visible)
  const ndviPct = ndviRaw * 100

  // NDVI color: green ≥0.6, amber 0.4–0.6, red <0.4
  const ndviFull = ndviRaw
  const barColor = ndviFull >= 0.6 ? '#5B7C6B' : ndviFull >= 0.4 ? '#D4915E' : '#B85C3E'

  return (
    <div className="mt-2">
      <div className="flex items-baseline gap-6">
        <div className="flex items-baseline gap-1">
          <span className="text-[22px] font-bold text-[#2C2C28]">{ndvi}</span>
          <span className="text-[12px] text-[#2C2C28]/40">NDVI</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-[22px] font-bold text-[#2C2C28]">{String(output.stress_level || '—')}</span>
          <span className="text-[12px] text-[#2C2C28]/40">stress</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-[22px] font-bold text-[#2C2C28]">{affected}%</span>
          <span className="text-[12px] text-[#2C2C28]/40">affected</span>
        </div>
      </div>
      {/* NDVI mini bar */}
      <div className="mt-2 relative">
        <div className="h-[6px] bg-[#E5E2D8] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full ndvi-fill"
            style={{
              width: visible ? `${ndviPct}%` : '0%',
              backgroundColor: barColor,
              transitionDelay: '200ms',
            }}
          />
        </div>
        {/* Marker dot */}
        <div
          className="absolute top-[-3px] w-3 h-3 rounded-full border-2 border-white shadow-sm ndvi-fill"
          style={{
            left: visible ? `${ndviPct}%` : '0%',
            backgroundColor: barColor,
            transform: 'translateX(-50%)',
            transition: 'left 800ms ease-out',
            transitionDelay: '200ms',
          }}
        />
      </div>
    </div>
  )
}

function SoilMetrics({ output, visible }: { output: Record<string, unknown>; visible: boolean }) {
  const moisture = useCountUp(Number(output.moisture_pct ?? output.available_water_in_per_ft) || 0, 600, visible)
  const ph = useCountUp(Number(output.ph) || 0, 600, visible)
  const nitrogen = useCountUp(Number(output.nitrogen_ppm) || 0, 600, visible)

  return (
    <div className="flex items-baseline gap-6 mt-2">
      <div className="flex items-baseline gap-1">
        <span className="text-[22px] font-bold text-[#2C2C28]">{moisture}%</span>
        <span className="text-[12px] text-[#2C2C28]/40">moisture</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-[22px] font-bold text-[#2C2C28]">pH {ph}</span>
        <span className="text-[12px] text-[#2C2C28]/40">acidity</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-[22px] font-bold text-[#2C2C28]">{nitrogen}ppm</span>
        <span className="text-[12px] text-[#2C2C28]/40">nitrogen</span>
      </div>
    </div>
  )
}

interface TraceStepProps {
  step: TraceStepType
  visible: boolean
}

export default function TraceStep({ step, visible }: TraceStepProps) {
  const config = toolConfig[step.tool] || toolConfig.get_weather

  return (
    <div className={`trace-step-enter ${visible ? 'visible' : ''}`}>
      <div
        className={`rounded-lg ${config.bgClass} py-4 px-5`}
        style={{ borderLeft: `4px solid ${config.borderColor}` }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h4 className="text-[15px] font-semibold text-[#2C2C28]">{config.label}</h4>
          <span className="font-mono text-[11px] text-[#2C2C28]/35">{step.duration_ms}ms</span>
        </div>

        {/* Metrics by tool type */}
        {step.tool === 'get_weather' && <WeatherMetrics output={step.output} visible={visible} />}
        {step.tool === 'get_crop_health' && <CropMetrics output={step.output} visible={visible} />}
        {step.tool === 'get_soil_profile' && <SoilMetrics output={step.output} visible={visible} />}

        {/* Raw data toggle */}
        <div className="flex gap-3 mt-2">
          <CollapsibleJSON data={step.input} label="raw input" />
          <CollapsibleJSON data={step.output} label="raw output" />
        </div>
      </div>
    </div>
  )
}
