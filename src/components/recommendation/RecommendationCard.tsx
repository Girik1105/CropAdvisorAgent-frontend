'use client'

import { Recommendation } from '@/lib/types'
import { useCountUp } from '@/hooks/useCountUp'

const actionPillColors: Record<string, string> = {
  irrigate: 'bg-[#3b82f6]',
  fertilize: 'bg-emerald-600',
  pest_alert: 'bg-red-600',
  harvest: 'bg-amber-500',
  no_action: 'bg-gray-400',
}

const urgencyPillColors: Record<string, string> = {
  immediate: 'bg-[#ea580c]',
  within_24h: 'bg-amber-500',
  within_3d: 'bg-yellow-500',
  monitor: 'bg-[#5B7C6B]',
}

const urgencyLabels: Record<string, string> = {
  immediate: 'IMMEDIATE',
  within_24h: 'WITHIN 24H',
  within_3d: 'WITHIN 3 DAYS',
  monitor: 'MONITOR',
}

interface RecommendationCardProps {
  recommendation: Recommendation
  visible: boolean
}

export default function RecommendationCard({ recommendation, visible }: RecommendationCardProps) {
  // Parse cost number
  const costRaw = typeof recommendation.estimated_cost === 'number'
    ? recommendation.estimated_cost
    : Number(String(recommendation.estimated_cost).replace(/[^0-9]/g, '')) || 0
  const costValue = useCountUp(costRaw, 600, visible)

  // Parse risk percentage
  const riskMatch = recommendation.risk_if_delayed.match(/(\d+)[-–]?(\d+)?%/)
  const riskLow = riskMatch ? Number(riskMatch[1]) : null
  const riskHigh = riskMatch && riskMatch[2] ? Number(riskMatch[2]) : null
  const riskLowVal = useCountUp(riskLow || 0, 600, visible)
  const riskHighVal = useCountUp(riskHigh || 0, 600, visible)

  return (
    <div className={`recommendation-enter ${visible ? 'visible' : ''}`}>
      <div className="border-[1.5px] border-[#2D4A3E] bg-[#F0FDF4] rounded-lg p-5">
        {/* Pills */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`${actionPillColors[recommendation.action_type]} text-white px-3 py-1 rounded-full text-[12px] font-bold tracking-wide`}>
            {recommendation.action_type.replace('_', ' ').toUpperCase()}
          </span>
          <span className={`${urgencyPillColors[recommendation.urgency]} text-white px-3 py-1 rounded-full text-[12px] font-bold`}>
            {urgencyLabels[recommendation.urgency]}
          </span>
        </div>

        {/* Description */}
        <p className="text-[14px] text-[#2C2C28] leading-[1.6] mb-4">
          {recommendation.description}
        </p>

        {/* Stats */}
        <div className="flex items-start gap-10 pt-4 border-t border-[#2D4A3E]/10">
          <div>
            <p className="text-[28px] font-bold text-[#2D4A3E] leading-none">${costValue}</p>
            <p className="text-[12px] text-[#2C2C28]/45 mt-1">estimated cost</p>
          </div>
          {riskLow !== null && (
            <div>
              <p className="text-[28px] font-bold text-[#B85C3E] leading-none">
                {riskHigh !== null ? `${riskLowVal}-${riskHighVal}%` : `${riskLowVal}%`}
              </p>
              <p className="text-[12px] text-[#2C2C28]/45 mt-1">yield risk if delayed</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
