'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import SendMessageForm from '@/components/dashboard/SendMessageForm'
import { api } from '@/lib/api'
import { Field, SessionSummary, ActionType, Urgency } from '@/lib/types'

const ACTION_CONFIG: Record<ActionType, { label: string; color: string; icon: string }> = {
  irrigate:   { label: 'Irrigate',   color: 'bg-blue-50 text-blue-700 border-blue-200',       icon: '💧' },
  fertilize:  { label: 'Fertilize',  color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: '🌱' },
  pest_alert: { label: 'Pest Alert', color: 'bg-red-50 text-red-700 border-red-200',          icon: '🐛' },
  harvest:    { label: 'Harvest',    color: 'bg-amber-50 text-amber-700 border-amber-200',    icon: '🌾' },
  no_action:  { label: 'No Action',  color: 'bg-gray-50 text-gray-600 border-gray-200',       icon: '✓' },
}

const URGENCY_CONFIG: Record<Urgency, { label: string; dot: string }> = {
  immediate:  { label: 'Immediate',   dot: 'bg-red-500' },
  within_24h: { label: 'Within 24h',  dot: 'bg-orange-400' },
  within_3d:  { label: 'Within 3 days', dot: 'bg-yellow-400' },
  monitor:    { label: 'Monitor',     dot: 'bg-green-400' },
}

const CHANNEL_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  sms: {
    label: 'SMS',
    color: 'bg-blue-50 text-blue-600',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  dashboard: {
    label: 'Dashboard',
    color: 'bg-primary/10 text-primary',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
      </svg>
    ),
  },
  chat: {
    label: 'Chat',
    color: 'bg-violet-50 text-violet-600',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
      </svg>
    ),
  },
}

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

  useEffect(() => {
    if (preselectedField) setFilterFieldId(preselectedField)
  }, [preselectedField])

  const filtered = useMemo(() => {
    if (!filterFieldId) return sessions
    return sessions.filter((s) => s.field === filterFieldId)
  }, [sessions, filterFieldId])

  // Group sessions by field
  const grouped = useMemo(() => {
    const map = new Map<string, { fieldName: string; cropType: string; sessions: SessionSummary[] }>()
    for (const s of filtered) {
      const existing = map.get(s.field)
      if (existing) {
        existing.sessions.push(s)
      } else {
        map.set(s.field, { fieldName: s.field_name, cropType: s.crop_type || '', sessions: [s] })
      }
    }
    return Array.from(map.values())
  }, [filtered])

  const totalCompleted = filtered.filter((s) => s.status === 'completed').length
  const totalProcessing = filtered.filter((s) => s.status === 'processing').length

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 w-full pt-16 lg:pt-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-primary text-[24px] font-semibold tracking-wide">
            Health Reports
          </h1>
          <p className="font-editorial italic text-text/40 text-[15px] mt-1">
            Full diagnostic scans of your fields
          </p>
        </div>

        {/* Stats + Filter */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {!loading && (
            <div className="hidden sm:flex items-center gap-3 mr-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-[12px] text-text/50 font-mono">{totalCompleted} completed</span>
              </div>
              {totalProcessing > 0 && (
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-[12px] text-text/50 font-mono">{totalProcessing} running</span>
                </div>
              )}
            </div>
          )}
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

      {/* Sessions */}
      <div className="space-y-8">
        {loading ? (
          [1, 2].map((i) => (
            <div key={i} className="space-y-3">
              <div className="h-4 bg-grid rounded w-1/4 animate-pulse" />
              {[1, 2].map((j) => (
                <div key={j} className="bg-paper border border-0.5 border-grid rounded-xl p-5 animate-pulse">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-5 w-16 bg-grid rounded-full" />
                    <div className="h-4 bg-grid rounded w-1/3" />
                  </div>
                  <div className="h-3 bg-grid rounded w-2/3" />
                </div>
              ))}
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div className="bg-paper border border-0.5 border-grid rounded-xl p-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-primary/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-[15px] font-semibold text-text mb-1">No health reports yet</p>
            <p className="text-[13px] text-text/40">
              Select a field above and run a health check to get started
            </p>
          </div>
        ) : (
          grouped.map((group) => (
            <div key={group.fieldName}>
              {/* Field group header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <h2 className="text-[14px] font-semibold text-text">{group.fieldName}</h2>
                </div>
                {group.cropType && (
                  <span className="text-[11px] text-text/30 bg-bg px-2 py-0.5 rounded-full">
                    {group.cropType}
                  </span>
                )}
                <span className="text-[11px] text-text/30 font-mono">
                  {group.sessions.length} report{group.sessions.length !== 1 ? 's' : ''}
                </span>
                <div className="flex-1 h-px bg-grid" />
              </div>

              {/* Session cards */}
              <div className="space-y-2">
                {group.sessions.map((session) => (
                  <SessionCard key={session.id} session={session} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function SessionCard({ session }: { session: SessionSummary }) {
  const channel = CHANNEL_CONFIG[session.channel] || CHANNEL_CONFIG.dashboard
  const action = session.recommendation_action ? ACTION_CONFIG[session.recommendation_action] : null
  const urgency = session.recommendation_urgency ? URGENCY_CONFIG[session.recommendation_urgency] : null
  const isProcessing = session.status === 'processing'
  const isFailed = session.status === 'failed'

  return (
    <Link
      href={`/dashboard/${session.id}`}
      className={`block bg-paper border border-0.5 rounded-xl overflow-hidden transition-all group hover:shadow-sm ${
        isProcessing ? 'border-accent/30' : isFailed ? 'border-red-200' : 'border-grid hover:border-sand'
      }`}
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          {/* Left content */}
          <div className="flex-1 min-w-0">
            {/* Top row: channel + status badges */}
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full ${channel.color}`}>
                {channel.icon}
                {channel.label}
              </span>

              {isProcessing && (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full bg-accent/10 text-accent">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  Processing
                </span>
              )}

              {isFailed && (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full bg-red-50 text-red-600">
                  Failed
                </span>
              )}

              {session.phone_number && (
                <span className="text-[11px] text-text/30 font-mono">
                  {session.phone_number}
                </span>
              )}
            </div>

            {/* Message preview */}
            {session.message && (
              <p className="text-[13px] text-text/70 leading-relaxed mb-2.5 line-clamp-2">
                {session.message}
              </p>
            )}

            {/* Bottom row: recommendation + tool count */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {action && (
                <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md border ${action.color}`}>
                  <span>{action.icon}</span>
                  {action.label}
                </span>
              )}

              {urgency && (
                <span className="inline-flex items-center gap-1.5 text-[10px] text-text/40">
                  <span className={`w-1.5 h-1.5 rounded-full ${urgency.dot}`} />
                  {urgency.label}
                </span>
              )}

              {session.tool_count > 0 && (
                <span className="text-[10px] text-text/30 font-mono">
                  {session.tool_count} tool{session.tool_count !== 1 ? 's' : ''} called
                </span>
              )}
            </div>
          </div>

          {/* Right: timestamp + arrow */}
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <div className="text-right">
              <p className="font-mono text-[12px] text-text/50">
                {new Date(session.created_at).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })}
              </p>
              <p className="text-[11px] text-text/30">
                {new Date(session.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>
            <svg className="w-4 h-4 text-text/15 group-hover:text-accent transition-colors" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 4l4 4-4 4" />
            </svg>
          </div>
        </div>
      </div>

      {/* Processing progress bar */}
      {isProcessing && (
        <div className="h-0.5 bg-grid">
          <div
            className="h-full rounded-r-full"
            style={{
              width: '60%',
              background: 'linear-gradient(90deg, #2D4A3E, #C4704B)',
              animation: 'shimmer 2s linear infinite',
            }}
          />
        </div>
      )}
    </Link>
  )
}
