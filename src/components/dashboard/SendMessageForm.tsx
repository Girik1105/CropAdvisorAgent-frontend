'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { Field } from '@/lib/types'

export default function SendMessageForm({ onMessageSent }: { onMessageSent?: () => void }) {
  const router = useRouter()
  const [fields, setFields] = useState<Field[]>([])
  const [message, setMessage] = useState('')
  const [fieldId, setFieldId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.getFields().then((data) => {
      setFields(data)
      if (data.length > 0) setFieldId(data[0].id)
    })
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!fieldId) {
      setError('Please select a field first.')
      return
    }
    setError('')
    setLoading(true)

    try {
      const res = await api.sendMessage({
        message,
        field_id: fieldId,
      })
      setMessage('')
      onMessageSent?.()
      router.push(`/dashboard/${res.session_id}`)
    } catch {
      setError('Failed to send message. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="bg-paper border border-0.5 border-grid rounded-lg p-4 mb-6">
      {error && (
        <div className="bg-critical/10 border border-critical/20 rounded-card px-4 py-2.5 text-critical text-[13px] mb-3">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <select
          value={fieldId}
          onChange={(e) => setFieldId(e.target.value)}
          className="bg-bg border border-grid rounded-lg px-3 py-2.5 text-[13px] text-text focus:outline-none focus:border-primary/40 transition-colors flex-shrink-0"
        >
          <option value="" disabled>Select field</option>
          {fields.map((f) => (
            <option key={f.id} value={f.id}>{f.name}</option>
          ))}
        </select>

        <input
          type="text"
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 bg-bg border border-grid rounded-lg px-3 py-2.5 text-[13px] text-text placeholder:text-text/25 focus:outline-none focus:border-primary/40 transition-colors"
          placeholder="Ask about your field..."
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading || !fieldId}
          className="bg-accent hover:bg-accent/90 disabled:bg-accent/30 text-white text-[13px] font-semibold px-5 py-2.5 rounded-full transition-colors flex-shrink-0"
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  )
}
