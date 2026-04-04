import { Urgency } from '@/lib/types'

const urgencyConfig: Record<Urgency, { color: string; label: string }> = {
  immediate: { color: 'bg-red-500', label: 'Immediate' },
  within_24h: { color: 'bg-orange-400', label: 'Within 24h' },
  within_3d: { color: 'bg-yellow-400', label: 'Within 3 days' },
  monitor: { color: 'bg-healthy', label: 'Monitor' },
}

export default function UrgencyBadge({ urgency }: { urgency: Urgency }) {
  const config = urgencyConfig[urgency]
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-2 h-2 rounded-full ${config.color}`} />
      <span className="font-mono text-[11px] text-sand tracking-wider">
        {config.label}
      </span>
    </div>
  )
}
