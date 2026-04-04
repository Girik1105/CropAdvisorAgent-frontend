export default function DurationBadge({ ms }: { ms: number }) {
  const display = ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${ms}ms`
  return (
    <span className="font-mono text-[11px] text-sand tabular-nums">
      {display}
    </span>
  )
}
