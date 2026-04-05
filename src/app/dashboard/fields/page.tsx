'use client'

import { useEffect, useState } from 'react'
import FieldCard from '@/components/fields/FieldCard'
import { api } from '@/lib/api'
import { Field } from '@/lib/types'

export default function DashboardFieldsPage() {
  const [fields, setFields] = useState<Field[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getFields().then((data) => {
      setFields(data)
      setLoading(false)
    })
  }, [])

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-6xl pt-16 lg:pt-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-primary text-[24px] font-semibold tracking-wide">
          Fields
        </h1>
        <p className="font-editorial italic text-text/40 text-[15px] mt-1">
          Satellite health monitoring and soil profiles
        </p>
      </div>

      {/* Fields grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-paper border border-0.5 border-grid rounded-lg p-5 animate-pulse">
              <div className="h-4 bg-grid rounded w-1/2 mb-3" />
              <div className="h-2 bg-grid rounded w-full mb-2" />
              <div className="h-3 bg-grid rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : fields.length === 0 ? (
        <div className="bg-paper border border-0.5 border-grid rounded-card p-10 text-center">
          <p className="text-[15px] text-text/50 mb-1">No fields registered yet</p>
          <p className="text-[13px] text-text/30">
            Send a message to the agent to create your first field
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((field) => (
            <FieldCard key={field.id} field={field} />
          ))}
        </div>
      )}
    </div>
  )
}
