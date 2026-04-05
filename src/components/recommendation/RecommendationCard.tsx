'use client'

import { Recommendation } from '@/lib/types'
import { useCountUp } from '@/hooks/useCountUp'

const actionConfig: Record<string, { bg: string; icon: string }> = {
  irrigate: { bg: 'bg-blue-600', icon: '💧' },
  fertilize: { bg: 'bg-emerald-600', icon: '🧪' },
  pest_alert: { bg: 'bg-red-600', icon: '🐛' },
  harvest: { bg: 'bg-amber-500', icon: '🌾' },
  no_action: { bg: 'bg-gray-400', icon: '✓' },
}

const urgencyConfig: Record<string, { bg: string; label: string }> = {
  immediate: { bg: 'bg-red-500', label: 'IMMEDIATE' },
  within_24h: { bg: 'bg-amber-500', label: 'WITHIN 24H' },
  within_3d: { bg: 'bg-yellow-500', label: 'WITHIN 3 DAYS' },
  monitor: { bg: 'bg-[#5B7C6B]', label: 'MONITOR' },
}

interface RecommendationCardProps {
  recommendation: Recommendation
  visible: boolean
}

export default function RecommendationCard({ recommendation, visible }: RecommendationCardProps) {
  const costRaw = typeof recommendation.estimated_cost === 'number'
    ? recommendation.estimated_cost
    : Number(String(recommendation.estimated_cost).replace(/[^0-9.]/g, '')) || 0
  const costValue = useCountUp(costRaw, 600, visible)

  const riskMatch = recommendation.risk_if_delayed.match(/(\d+)[-–]?(\d+)?%/)
  const riskLow = riskMatch ? Number(riskMatch[1]) : null
  const riskHigh = riskMatch && riskMatch[2] ? Number(riskMatch[2]) : null
  const riskLowVal = useCountUp(riskLow || 0, 600, visible)
  const riskHighVal = useCountUp(riskHigh || 0, 600, visible)

  const action = actionConfig[recommendation.action_type] || actionConfig.no_action
  const urgency = urgencyConfig[recommendation.urgency] || urgencyConfig.monitor

  return (
    <div className={`recommendation-enter ${visible ? 'visible' : ''}`}>
      <div className="border border-[#2D4A3E]/20 bg-gradient-to-br from-[#F0FDF4] to-[#ECFDF5] rounded-xl p-5 shadow-sm">
        {/* Pills */}
        <div className="flex items-center gap-2 mb-4">
          <span className={`${action.bg} text-white px-3 py-1 rounded-full text-[11px] font-bold tracking-wider flex items-center gap-1.5`}>
            <span>{action.icon}</span>
            {recommendation.action_type.replace('_', ' ').toUpperCase()}
          </span>
          <span className={`${urgency.bg} text-white px-3 py-1 rounded-full text-[11px] font-bold tracking-wide`}>
            {urgency.label}
          </span>
        </div>

        {/* Description */}
        <p className="text-[13px] text-[#2C2C28]/80 leading-[1.7] mb-5">
          {recommendation.description}
        </p>

        {/* Stats */}
        <div className="flex items-start gap-8 pt-4 border-t border-[#2D4A3E]/10">
          <div>
            <p className="text-[26px] font-bold text-[#2D4A3E] leading-none tabular-nums">${costValue}</p>
            <p className="text-[11px] text-[#2C2C28]/40 mt-1.5">estimated cost</p>
          </div>
          {riskLow !== null && (
            <div>
              <p className="text-[26px] font-bold text-[#B85C3E] leading-none tabular-nums">
                {riskHigh !== null ? `${riskLowVal}–${riskHighVal}%` : `${riskLowVal}%`}
              </p>
              <p className="text-[11px] text-[#2C2C28]/40 mt-1.5">yield risk if delayed</p>
            </div>
          )}
        </div>

        {/* Extra details */}
        {(recommendation.cost_breakdown || recommendation.timing_rationale) && (
          <div className="mt-4 pt-3 border-t border-[#2D4A3E]/10 space-y-2">
            {recommendation.cost_breakdown && (
              <p className="text-[11px] text-[#2C2C28]/50">
                <span className="font-semibold text-[#2C2C28]/60">Cost:</span> {recommendation.cost_breakdown}
              </p>
            )}
            {recommendation.timing_rationale && (
              <p className="text-[11px] text-[#2C2C28]/50">
                <span className="font-semibold text-[#2C2C28]/60">Timing:</span> {recommendation.timing_rationale}
              </p>
            )}
          </div>
        )}

        {/* Implementation steps */}
        {recommendation.implementation_steps && recommendation.implementation_steps.length > 0 && (
          <div className="mt-4 pt-3 border-t border-[#2D4A3E]/10">
            <p className="text-[11px] font-semibold text-[#2C2C28]/60 mb-2">Steps:</p>
            <ol className="space-y-1.5">
              {recommendation.implementation_steps.map((step, i) => (
                <li key={i} className="flex items-start gap-2 text-[12px] text-[#2C2C28]/60">
                  <span className="w-4 h-4 rounded-full bg-[#2D4A3E]/10 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-[#2D4A3E]/50 mt-0.5">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  )
}
