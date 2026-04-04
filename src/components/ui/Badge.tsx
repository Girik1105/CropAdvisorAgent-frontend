import { ActionType } from '@/lib/types'

const actionColors: Record<ActionType, string> = {
  irrigate: 'bg-blue-50 text-blue-700 border-blue-200',
  fertilize: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  pest_alert: 'bg-red-50 text-red-700 border-red-200',
  harvest: 'bg-amber-50 text-amber-700 border-amber-200',
  no_action: 'bg-gray-50 text-gray-600 border-gray-200',
}

export function ActionBadge({ action }: { action: ActionType }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 font-mono text-xs tracking-wider uppercase border rounded-card ${actionColors[action]}`}
    >
      {action.replace('_', ' ')}
    </span>
  )
}

const toolColors: Record<string, string> = {
  get_weather: 'bg-tool-weather/10 text-tool-weather border-tool-weather/20',
  get_crop_health: 'bg-tool-crop/10 text-tool-crop border-tool-crop/20',
  get_soil_profile: 'bg-tool-soil/10 text-tool-soil border-tool-soil/20',
  decision: 'bg-tool-decision/10 text-tool-decision border-tool-decision/20',
}

export function ToolBadge({ tool }: { tool: string }) {
  const label = tool
    .replace('get_', '')
    .replace(/_/g, ' ')
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 font-mono text-[11px] tracking-wide border rounded-card ${toolColors[tool] || toolColors.decision}`}
    >
      {label}
    </span>
  )
}
