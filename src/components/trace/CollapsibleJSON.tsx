'use client'

import { useState } from 'react'

function renderValue(value: unknown, depth: number = 0): React.ReactNode {
  if (value === null) return <span className="text-text/40">null</span>
  if (typeof value === 'boolean') return <span className="text-[#3b82f6]">{String(value)}</span>
  if (typeof value === 'number') return <span className="text-primary font-medium">{value}</span>
  if (typeof value === 'string') return <span className="text-accent">&quot;{value}&quot;</span>

  if (Array.isArray(value)) {
    return (
      <span>
        {'['}
        {value.map((item, i) => (
          <span key={i}>
            {i > 0 && ', '}
            {renderValue(item, depth + 1)}
          </span>
        ))}
        {']'}
      </span>
    )
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
    return (
      <div className={depth > 0 ? 'pl-4' : ''}>
        {entries.map(([key, val], i) => (
          <div key={key} className="leading-relaxed">
            <span className="text-text/50">{key}</span>
            <span className="text-grid mx-1">:</span>
            {renderValue(val, depth + 1)}
            {i < entries.length - 1 && <span className="text-grid">,</span>}
          </div>
        ))}
      </div>
    )
  }

  return String(value)
}

interface CollapsibleJSONProps {
  data: Record<string, unknown>
  label: string
  defaultOpen?: boolean
}

export default function CollapsibleJSON({ data, label, defaultOpen = false }: CollapsibleJSONProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="mt-1">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-[11px] font-mono text-text/40 hover:text-text/60 transition-colors"
      >
        <svg
          className={`w-2.5 h-2.5 transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
          viewBox="0 0 12 12"
          fill="currentColor"
        >
          <path d="M4 2l4 4-4 4z" />
        </svg>
        {label}
      </button>
      {open && (
        <div className="mt-1 p-2.5 bg-white/60 border border-grid rounded font-mono text-[11px] leading-relaxed overflow-x-auto max-h-32 overflow-y-auto">
          {renderValue(data)}
        </div>
      )}
    </div>
  )
}
