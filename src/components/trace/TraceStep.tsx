'use client'

import { TraceStep as TraceStepType } from '@/lib/types'
import { useCountUp } from '@/hooks/useCountUp'
import CollapsibleJSON from './CollapsibleJSON'

const toolConfig: Record<string, { label: string; icon: string; borderColor: string; bgClass: string; iconBg: string }> = {
  get_weather: {
    label: 'Weather Analysis',
    icon: '🌤',
    borderColor: '#3b82f6',
    bgClass: 'bg-gradient-to-br from-blue-50/80 to-sky-50/40',
    iconBg: 'bg-blue-100',
  },
  get_crop_health: {
    label: 'Crop Health Scan',
    icon: '🌱',
    borderColor: '#D4915E',
    bgClass: 'bg-gradient-to-br from-amber-50/80 to-orange-50/40',
    iconBg: 'bg-amber-100',
  },
  get_soil_profile: {
    label: 'Soil Profile',
    icon: '🪨',
    borderColor: '#888780',
    bgClass: 'bg-gradient-to-br from-stone-50/80 to-neutral-50/40',
    iconBg: 'bg-stone-100',
  },
  get_market_prices: {
    label: 'Market Prices',
    icon: '📊',
    borderColor: '#10b981',
    bgClass: 'bg-gradient-to-br from-emerald-50/80 to-green-50/40',
    iconBg: 'bg-emerald-100',
  },
  get_pest_risk: {
    label: 'Pest & Disease Risk',
    icon: '🐛',
    borderColor: '#ef4444',
    bgClass: 'bg-gradient-to-br from-red-50/80 to-rose-50/40',
    iconBg: 'bg-red-100',
  },
  get_water_usage: {
    label: 'Water Budget',
    icon: '💧',
    borderColor: '#06b6d4',
    bgClass: 'bg-gradient-to-br from-cyan-50/80 to-teal-50/40',
    iconBg: 'bg-cyan-100',
  },
  get_growth_stage: {
    label: 'Growth Stage',
    icon: '📅',
    borderColor: '#8b5cf6',
    bgClass: 'bg-gradient-to-br from-violet-50/80 to-purple-50/40',
    iconBg: 'bg-violet-100',
  },
  intent_classifier: {
    label: 'Intent Classifier',
    icon: '🧠',
    borderColor: '#6366f1',
    bgClass: 'bg-gradient-to-br from-indigo-50/80 to-blue-50/40',
    iconBg: 'bg-indigo-100',
  },
}

function MetricItem({ value, label, suffix }: { value: string | number; label: string; suffix?: string }) {
  return (
    <div className="flex flex-col">
      <div className="flex items-baseline gap-0.5">
        <span className="text-[20px] font-bold text-[#2C2C28] tabular-nums">{value}</span>
        {suffix && <span className="text-[13px] font-medium text-[#2C2C28]/60">{suffix}</span>}
      </div>
      <span className="text-[11px] text-[#2C2C28]/35 mt-0.5">{label}</span>
    </div>
  )
}

function WeatherMetrics({ output, visible }: { output: Record<string, unknown>; visible: boolean }) {
  const temp = useCountUp(Number(output.temp_f) || 0, 600, visible)
  const humidity = useCountUp(Number(output.humidity_pct) || 0, 600, visible)
  const wind = useCountUp(Number(output.wind_mph) || 0, 600, visible)

  return (
    <div className="flex items-start gap-8 mt-3">
      <MetricItem value={temp} suffix="°F" label="temperature" />
      <MetricItem value={humidity} suffix="%" label="humidity" />
      <MetricItem value={wind} suffix="mph" label="wind" />
      {String(output.conditions || '') && (
        <div className="flex flex-col">
          <span className="text-[14px] font-medium text-[#2C2C28] capitalize">{String(output.conditions)}</span>
          <span className="text-[11px] text-[#2C2C28]/35 mt-0.5">conditions</span>
        </div>
      )}
    </div>
  )
}

function CropMetrics({ output, visible }: { output: Record<string, unknown>; visible: boolean }) {
  const ndviRaw = Number(output.ndvi ?? output.ndvi_score) || 0
  const ndvi = useCountUp(ndviRaw, 600, visible)
  const fraction = useCountUp(
    Math.round((Number(output.affected_area_pct ?? output.vegetation_fraction) || 0) * 100) / 100,
    600, visible
  )

  const barColor = ndviRaw >= 0.6 ? '#22c55e' : ndviRaw >= 0.4 ? '#f59e0b' : '#ef4444'
  const stressLabel = String(output.stress_level || '—')
  const trend = String(output.vegetation_trend || output.ndvi_trend || '—')

  return (
    <div className="mt-3">
      <div className="flex items-start gap-8">
        <MetricItem value={ndvi} label="NDVI score" />
        <div className="flex flex-col">
          <span className="text-[20px] font-bold text-[#2C2C28] capitalize">{stressLabel}</span>
          <span className="text-[11px] text-[#2C2C28]/35 mt-0.5">stress level</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[20px] font-bold text-[#2C2C28] capitalize">{trend}</span>
          <span className="text-[11px] text-[#2C2C28]/35 mt-0.5">trend</span>
        </div>
        <MetricItem value={fraction} suffix="%" label="vegetation" />
      </div>
      {/* NDVI bar */}
      <div className="mt-3 relative">
        <div className="h-2 bg-[#E5E2D8] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-[800ms] ease-out"
            style={{
              width: visible ? `${ndviRaw * 100}%` : '0%',
              backgroundColor: barColor,
              transitionDelay: '200ms',
            }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[9px] text-text/25">0.0</span>
          <span className="text-[9px] text-text/25">1.0</span>
        </div>
      </div>
    </div>
  )
}

function SoilMetrics({ output, visible }: { output: Record<string, unknown>; visible: boolean }) {
  const ph = useCountUp(Number(output.ph) || 0, 600, visible)
  const organicMatter = Number(output.organic_matter_pct) || 0
  const source = String(output.data_source || '')

  return (
    <div className="mt-3">
      {source && source !== 'default' && (
        <div className="mb-2">
          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
            {source}
          </span>
        </div>
      )}
      <div className="flex items-start gap-8">
        <MetricItem value={`pH ${ph}`} label="acidity" />
        <div className="flex flex-col">
          <span className="text-[20px] font-bold text-[#2C2C28] capitalize">{String(output.soil_type || output.drainage_class || '—')}</span>
          <span className="text-[11px] text-[#2C2C28]/35 mt-0.5">soil type</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[20px] font-bold text-[#2C2C28]">{String(output.water_holding_capacity || '—')}</span>
          <span className="text-[11px] text-[#2C2C28]/35 mt-0.5">water capacity</span>
        </div>
        {organicMatter > 0 && <MetricItem value={organicMatter} suffix="%" label="organic matter" />}
      </div>
    </div>
  )
}

function MarketMetrics({ output }: { output: Record<string, unknown> }) {
  const price = Number(output.price_per_unit) || 0
  const trend = String(output.trend_30d || '—')
  const unit = String(output.unit || '')
  const source = String(output.data_source || '')
  const period = String(output.period || '')

  const trendColor = trend.includes('up') ? 'text-emerald-600' : trend.includes('down') ? 'text-red-500' : 'text-text/60'
  const trendIcon = trend.includes('up') ? '↑' : trend.includes('down') ? '↓' : '→'

  return (
    <div className="mt-3">
      {source === 'USDA NASS' && (
        <div className="mb-2 flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
            USDA NASS
          </span>
          {period && <span className="text-[10px] text-text/35 font-mono">{period}</span>}
        </div>
      )}
      <div className="flex items-start gap-8">
        <MetricItem value={`$${price}`} suffix={`/${unit}`} label="current price" />
        <div className="flex flex-col">
          <span className={`text-[20px] font-bold ${trendColor}`}>{trendIcon} {trend.replace(/_/g, ' ')}</span>
          <span className="text-[11px] text-[#2C2C28]/35 mt-0.5">30-day trend</span>
        </div>
      </div>
      {String(output.seasonal_outlook || '') && (
        <p className="text-[12px] text-text/50 mt-2 leading-relaxed">{String(output.seasonal_outlook)}</p>
      )}
    </div>
  )
}

function PestMetrics({ output }: { output: Record<string, unknown> }) {
  const riskLevel = String(output.risk_level || 'low')
  const threats = (output.primary_threats as string[]) || []
  const actions = (output.preventive_actions as string[]) || []

  const riskColor = riskLevel === 'high' ? 'text-red-600 bg-red-100' : riskLevel === 'moderate' ? 'text-amber-700 bg-amber-100' : 'text-emerald-700 bg-emerald-100'

  return (
    <div className="mt-3">
      <div className="flex items-center gap-3 mb-3">
        <span className={`text-[12px] font-bold uppercase px-2.5 py-1 rounded-full ${riskColor}`}>
          {riskLevel} risk
        </span>
      </div>
      {threats.length > 0 && (
        <div className="mb-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-text/30">Threats</span>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {threats.slice(0, 4).map((t, i) => (
              <span key={i} className="text-[11px] bg-white/70 border border-black/[0.06] rounded-full px-2.5 py-0.5 text-text/60">{t}</span>
            ))}
          </div>
        </div>
      )}
      {actions.length > 0 && (
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-text/30">Actions</span>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {actions.slice(0, 3).map((a, i) => (
              <span key={i} className="text-[11px] bg-white/70 border border-black/[0.06] rounded-full px-2.5 py-0.5 text-text/60">{a}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function WaterMetrics({ output, visible }: { output: Record<string, unknown>; visible: boolean }) {
  const dailyNeed = useCountUp(Number(output.daily_water_need_gal) || 0, 600, visible)
  const deficit = useCountUp(Number(output.current_deficit_pct) || 0, 600, visible)
  const cost = Number(output.estimated_daily_cost) || 0
  const source = String(output.data_source || '')
  const et0 = Number(output.et0_mm_per_day) || 0
  const etc = Number(output.etc_mm_per_day) || 0

  const deficitColor = Number(output.current_deficit_pct) > 50 ? 'text-red-600' : Number(output.current_deficit_pct) > 30 ? 'text-amber-600' : 'text-emerald-600'

  return (
    <div className="mt-3">
      {source === 'NASA POWER' && (
        <div className="mb-2 flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-700">
            NASA POWER
          </span>
          {et0 > 0 && (
            <span className="text-[10px] text-text/40 font-mono">
              ET₀ {et0} mm/day · ETc {etc} mm/day · Kc {String(output.crop_coefficient || '')}
            </span>
          )}
        </div>
      )}
      <div className="flex items-start gap-8">
        <MetricItem value={dailyNeed.toLocaleString()} suffix="gal/day" label="water need" />
        <div className="flex flex-col">
          <span className={`text-[20px] font-bold ${deficitColor}`}>{deficit}%</span>
          <span className="text-[11px] text-[#2C2C28]/35 mt-0.5">deficit</span>
        </div>
        <MetricItem value={`$${cost.toFixed(2)}`} label="est. daily cost" />
      </div>
      {String(output.irrigation_recommendation || '') && (
        <p className="text-[12px] text-text/50 mt-2 leading-relaxed">{String(output.irrigation_recommendation)}</p>
      )}
    </div>
  )
}

function GrowthMetrics({ output }: { output: Record<string, unknown> }) {
  const stage = String(output.growth_stage || '—')
  const tips = String(output.care_tips || '')
  const watchFor = String(output.watch_for || '')

  return (
    <div className="mt-3">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-[20px] font-bold text-[#2C2C28]">{stage}</span>
        <span className="text-[11px] bg-violet-100 text-violet-700 font-semibold px-2 py-0.5 rounded-full">
          Month {String(output.month || '')}
        </span>
      </div>
      {tips && (
        <div className="mb-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-text/30">Tips</span>
          <p className="text-[12px] text-text/60 mt-0.5">{tips}</p>
        </div>
      )}
      {watchFor && (
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-text/30">Watch for</span>
          <p className="text-[12px] text-text/60 mt-0.5">{watchFor}</p>
        </div>
      )}
    </div>
  )
}

function IntentMetrics({ output }: { output: Record<string, unknown> }) {
  const intent = String(output.intent || '—')
  return (
    <div className="mt-3">
      <span className={`text-[12px] font-bold uppercase px-2.5 py-1 rounded-full ${
        intent === 'general_question' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
      }`}>
        {intent === 'general_question' ? 'General Q&A' : 'Action Pipeline'}
      </span>
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
        className={`rounded-xl ${config.bgClass} py-5 px-6 border border-black/[0.04]`}
        style={{ borderLeft: `4px solid ${config.borderColor}` }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2.5">
            <span className={`w-7 h-7 rounded-lg ${config.iconBg} flex items-center justify-center text-[14px]`}>
              {config.icon}
            </span>
            <h4 className="text-[15px] font-semibold text-[#2C2C28]">{config.label}</h4>
          </div>
          {step.duration_ms > 0 && (
            <span className="font-mono text-[11px] text-[#2C2C28]/30 bg-white/60 px-2 py-0.5 rounded-full">
              {step.duration_ms}ms
            </span>
          )}
        </div>

        {/* Metrics by tool type */}
        {step.tool === 'get_weather' && <WeatherMetrics output={step.output} visible={visible} />}
        {step.tool === 'get_crop_health' && <CropMetrics output={step.output} visible={visible} />}
        {step.tool === 'get_soil_profile' && <SoilMetrics output={step.output} visible={visible} />}
        {step.tool === 'get_market_prices' && <MarketMetrics output={step.output} />}
        {step.tool === 'get_pest_risk' && <PestMetrics output={step.output} />}
        {step.tool === 'get_water_usage' && <WaterMetrics output={step.output} visible={visible} />}
        {step.tool === 'get_growth_stage' && <GrowthMetrics output={step.output} />}
        {step.tool === 'intent_classifier' && <IntentMetrics output={step.output} />}

        {/* Raw data toggle */}
        <div className="flex gap-4 mt-3 pt-3 border-t border-black/[0.04]">
          <CollapsibleJSON data={step.input} label="raw input" />
          <CollapsibleJSON data={step.output} label="raw output" />
        </div>
      </div>
    </div>
  )
}
