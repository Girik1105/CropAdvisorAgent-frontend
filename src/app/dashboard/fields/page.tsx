'use client'

import { useEffect, useState, useCallback } from 'react'
import FieldCard from '@/components/fields/FieldCard'
import AddFieldModal from '@/components/dashboard/AddFieldModal'
import { api } from '@/lib/api'
import { Field } from '@/lib/types'

export default function DashboardFieldsPage() {
  const [fields, setFields] = useState<Field[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddField, setShowAddField] = useState(false)

  const loadFields = useCallback(() => {
    setLoading(true)
    api.getFields().then((data) => {
      setFields(data)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    loadFields()
  }, [loadFields])

  async function handleDelete(fieldId: string) {
    try {
      await api.deleteField(fieldId)
      setFields((prev) => prev.filter((f) => f.id !== fieldId))
    } catch {
      // silently fail — field may still show until refresh
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 w-full pt-16 lg:pt-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display text-primary text-[24px] font-semibold tracking-wide">
            Fields
          </h1>
          <p className="font-editorial italic text-text/40 text-[15px] mt-1">
            Manage your fields and view environmental data
          </p>
        </div>
        <button
          onClick={() => setShowAddField(true)}
          className="bg-primary hover:bg-primary/90 text-white text-[13px] font-semibold px-5 py-2.5 rounded-full transition-colors flex items-center gap-2 flex-shrink-0"
        >
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 3v10M3 8h10" />
          </svg>
          Add Field
        </button>
      </div>

      <AddFieldModal
        open={showAddField}
        onClose={() => setShowAddField(false)}
        onFieldAdded={loadFields}
      />

      {/* Fields list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-paper border border-0.5 border-grid rounded-xl p-5 animate-pulse">
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-4 bg-grid rounded w-40 mb-2" />
                  <div className="h-3 bg-grid rounded w-64" />
                </div>
                <div className="h-4 w-4 bg-grid rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : fields.length === 0 ? (
        <div className="bg-paper border border-0.5 border-grid rounded-xl p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-primary" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 14V6l6-4 6 4v8H2z" />
              <path d="M6 14V9h4v5" />
            </svg>
          </div>
          <p className="text-[16px] font-semibold text-text mb-1">No fields registered yet</p>
          <p className="text-[13px] text-text/40 mb-5">
            Add your first field to start monitoring weather, crop health, and soil data
          </p>
          <button
            onClick={() => setShowAddField(true)}
            className="bg-primary hover:bg-primary/90 text-white text-[13px] font-semibold px-6 py-2.5 rounded-full transition-colors inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 3v10M3 8h10" />
            </svg>
            Add Your First Field
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {fields.map((field) => (
            <FieldCard key={field.id} field={field} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
