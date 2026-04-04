interface NDVIBarProps {
  value: number
  showLabel?: boolean
}

const segments = [
  { min: 0.0, max: 0.2, color: 'bg-ndvi-severe', label: 'Severe' },
  { min: 0.2, max: 0.4, color: 'bg-ndvi-high', label: 'Stress' },
  { min: 0.4, max: 0.6, color: 'bg-ndvi-moderate', label: 'Moderate' },
  { min: 0.6, max: 0.8, color: 'bg-ndvi-healthy', label: 'Healthy' },
  { min: 0.8, max: 1.0, color: 'bg-ndvi-peak', label: 'Peak' },
]

export default function NDVIBar({ value, showLabel = true }: NDVIBarProps) {
  const clampedValue = Math.max(0, Math.min(1, value))
  const markerPosition = clampedValue * 100

  return (
    <div>
      <div className="relative">
        {/* Bar segments */}
        <div className="flex h-2 rounded-full overflow-hidden gap-[1px]">
          {segments.map((seg) => (
            <div key={seg.label} className={`flex-1 ${seg.color}`} />
          ))}
        </div>

        {/* Marker */}
        <div
          className="absolute top-[-3px] w-0 h-0"
          style={{ left: `${markerPosition}%` }}
        >
          <div className="relative -left-[4px]">
            <div className="w-2 h-2 bg-text rotate-45 transform" />
          </div>
        </div>
      </div>

      {/* Value label */}
      {showLabel && (
        <div className="flex items-center justify-between mt-1.5">
          <span className="font-mono text-[10px] text-sand">
            NDVI {clampedValue.toFixed(2)}
          </span>
          <span className="font-mono text-[10px] text-sand">
            {segments.find((s) => clampedValue >= s.min && clampedValue < s.max)?.label ||
              segments[segments.length - 1].label}
          </span>
        </div>
      )}
    </div>
  )
}
