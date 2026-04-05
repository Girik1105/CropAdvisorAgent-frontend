'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import SendMessageForm from '@/components/dashboard/SendMessageForm'
import { api } from '@/lib/api'
import { Field, SessionSummary } from '@/lib/types'

export default function SessionsPage() {
  const searchParams = useSearchParams()
  const preselectedField = searchParams.get('field')

  const [fields, setFields] = useState<Field[]>([])
  const [sessions, setSessions] = useState<SessionSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [filterFieldId, setFilterFieldId] = useState<string>(preselectedField || '')

  const fetchSessions = async () => {
    setLoading(true)
    try {
      const allFields = await api.getFields()
      setFields(allFields)
      const allSessions = await Promise.all(
        allFields.map((f) => api.getFieldSessions(f.id))
      )
      const merged = allSessions
        .flat()
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      setSessions(merged)
    } catch {
      setSessions([])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchSessions()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Update filter when URL param changes
  useEffect(() => {
    if (preselectedField) setFilterFieldId(preselectedField)
  }, [preselectedField])

  const filtered = useMemo(() => {
    if (!filterFieldId) return sessions
    return sessions.filter((s) => s.field === filterFieldId)
  }, [sessions, filterFieldId])

  // Group sessions by field for display
  const grouped = useMemo(() => {
    const map = new Map<string, { fieldName: string; sessions: SessionSummary[] }>()
    for (const s of filtered) {
      const existing = map.get(s.field)
      if (existing) {
        existing.sessions.push(s)
      } else {
        map.set(s.field, { fieldName: s.field_name, sessions: [s] })
      }
    }
    return Array.from(map.values())
  }, [filtered])

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 w-full pt-16 lg:pt-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display text-primary text-[24px] font-semibold tracking-wide">
            Sessions
          </h1>
          <p className="font-editorial italic text-text/40 text-[15px] mt-1">
            Agent interactions grouped by field
          </p>
        </div>

        {/* Field filter */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-text/30">
            Filter
          </span>
          <select
            value={filterFieldId}
            onChange={(e) => setFilterFieldId(e.target.value)}
            className="bg-paper border border-grid rounded-lg px-3 py-2 text-[13px] text-text focus:outline-none focus:border-primary/40 transition-colors"
          >
            <option value="">All fields</option>
            {fields.map((f) => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Send message */}
      <SendMessageForm onMessageSent={fetchSessions} />

      {/* Sessions grouped by field */}
      <div className="space-y-6">
        {loading ? (
          [1, 2].map((i) => (
            <div key={i} className="space-y-3">
              <div className="h-4 bg-grid rounded w-1/4 animate-pulse" />
              {[1, 2].map((j) => (
                <div key={j} className="bg-paper border border-0.5 border-grid rounded-lg p-5 animate-pulse">
                  <div className="h-4 bg-grid rounded w-1/3 mb-3" />
                  <div className="h-3 bg-grid rounded w-2/3" />
                </div>
              ))}
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div className="bg-paper border border-0.5 border-grid rounded-card p-10 text-center">
            <p className="text-[15px] text-text/50">No sessions yet</p>
            <p className="text-[13px] text-text/30 mt-0.5">
              Select a field and send a message to the agent above
            </p>
          </div>
        ) : (
          grouped.map((group) => (
            <div key={group.fieldName}>
              {/* Field group header */}
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-[14px] font-semibold text-text">{group.fieldName}</h2>
                <span className="text-[11px] text-text/30 font-mono">
                  {group.sessions.length} session{group.sessions.length !== 1 ? 's' : ''}
                </span>
                <div className="flex-1 h-px bg-grid" />
              </div>

              {/* Sessions for this field */}
              <div className="space-y-2">
                {group.sessions.map((session) => (
                  <Link
                    key={session.id}
                    href={`/dashboard/${session.id}`}
                    className="block bg-paper border border-0.5 border-grid rounded-lg p-4 hover:border-sand transition-colors group"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full flex-shrink-0 ${
                          session.channel === 'sms'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {session.channel}
                        </span>
                        {session.phone_number && (
                          <span className="text-[12px] text-text/40 font-mono truncate">
                            {session.phone_number}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="font-mono text-[12px] text-text/40">
                          {new Date(session.created_at).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                          })}
                        </span>
                        <span className="text-[11px] text-text/30">
                          {new Date(session.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                        <svg className="w-4 h-4 text-text/20 group-hover:text-accent transition-colors" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M6 4l4 4-4 4" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
