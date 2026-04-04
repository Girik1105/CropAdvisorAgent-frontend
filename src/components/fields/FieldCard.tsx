import { Field } from '@/lib/types'
import NDVIBar from './NDVIBar'

export default function FieldCard({ field }: { field: Field }) {
  return (
    <div className="bg-paper border border-0.5 border-grid rounded-card p-5 hover:border-sand transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-body text-sm font-semibold text-text">{field.name}</h3>
          <p className="text-xs text-sand mt-0.5">
            {field.crop_type} · {field.area_acres} acres · {field.soil_type}
          </p>
        </div>
      </div>

      {/* NDVI */}
      {field.last_ndvi !== undefined && (
        <div className="mb-3">
          <NDVIBar value={field.last_ndvi} />
        </div>
      )}

      {/* Last recommendation */}
      {field.last_recommendation && (
        <p className="text-xs text-text/60 line-clamp-2 mb-3">
          {field.last_recommendation}
        </p>
      )}

      {/* Coordinates */}
      <div className="pt-2 border-t border-grid">
        <span className="font-mono text-[10px] text-sand">
          {field.lat.toFixed(4)}°N, {Math.abs(field.lng).toFixed(4)}°W
        </span>
      </div>
    </div>
  )
}
