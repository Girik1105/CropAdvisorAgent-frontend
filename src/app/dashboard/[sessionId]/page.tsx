'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import TraceViewer from '@/components/trace/TraceViewer'
import RecommendationCard from '@/components/recommendation/RecommendationCard'
import { api } from '@/lib/api'
import { Session } from '@/lib/types'

export default function SessionDetailPage() {
  const params = useParams()
  const sessionId = params.sessionId as string
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getTrace(sessionId).then((data) => {
      setSession(data)
      setLoading(false)
    })
  }, [sessionId])

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 w-full pt-16 lg:pt-8 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-4 bg-grid rounded w-32" />
          <div className="h-8 bg-grid rounded w-48" />
          <div className="h-4 bg-grid rounded w-64" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            <div className="lg:col-span-2 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-paper border border-0.5 border-grid rounded-xl" />
              ))}
            </div>
            <div className="h-80 bg-paper border border-0.5 border-grid rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 w-full pt-16 lg:pt-8 text-center">
        <div className="max-w-md mx-auto mt-20">
          <div className="text-[48px] mb-4">🌾</div>
          <p className="text-text/60 text-[16px] font-medium">Session not found</p>
          <p className="text-text/30 text-[13px] mt-1 mb-6">This session may have been deleted or doesn&apos;t exist.</p>
          <Link href="/dashboard/sessions" className="text-accent text-[14px] font-medium hover:underline">
            &larr; Back to sessions
          </Link>
        </div>
      </div>
    )
  }

  // Only show the latest recommendation
  const latestRec = session.recommendations.length > 0
    ? session.recommendations[session.recommendations.length - 1]
    : null

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 w-full pt-16 lg:pt-8 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 mb-6">
        <Link href="/dashboard/sessions" className="text-[12px] text-text/40 hover:text-accent transition-colors">
          Sessions
        </Link>
        <svg className="w-3 h-3 text-text/20" viewBox="0 0 12 12" fill="currentColor"><path d="M4 2l4 4-4 4z" /></svg>
        <span className="text-[12px] text-text/70 font-medium">{session.field_name}</span>
      </nav>

      {/* Header Card */}
      <div className="bg-paper border border-0.5 border-grid rounded-xl p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-primary text-[26px] font-semibold tracking-wide">
              {session.field_name}
            </h1>
            <span className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full ${
              session.channel === 'sms'
                ? 'bg-blue-50 text-blue-600 border border-blue-200'
                : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
            }`}>
              {session.channel}
            </span>
          </div>
          <div className="flex items-center gap-4 text-[12px] text-text/40">
            <span>
              {new Date(session.created_at).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric',
              })}
              {' at '}
              {new Date(session.created_at).toLocaleTimeString('en-US', {
                hour: 'numeric', minute: '2-digit', hour12: true,
              })}
            </span>
            {session.phone_number && (
              <span className="font-mono">{session.phone_number}</span>
            )}
          </div>
        </div>

        {session.message && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="flex-1 bg-bg rounded-lg rounded-tl-sm px-4 py-3">
              <p className="text-[14px] text-text leading-relaxed">{session.message}</p>
            </div>
          </div>
        )}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trace — left 2/3 */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <h2 className="text-[13px] font-semibold tracking-[0.15em] uppercase text-text/50">
              Agent Reasoning Trace
            </h2>
          </div>

          {session.trace.length > 0 ? (
            <TraceViewer trace={session.trace} visible={true} />
          ) : (
            <div className="bg-paper border border-0.5 border-grid rounded-xl p-10 text-center">
              <div className="text-[32px] mb-3">🔍</div>
              <p className="text-[14px] text-text/50 font-medium">No tool calls recorded</p>
              <p className="text-[12px] text-text/30 mt-1">The agent processed this request without calling external tools.</p>
            </div>
          )}
        </div>

        {/* Sidebar — right 1/3 */}
        <div className="space-y-6">
          {/* Recommendation */}
          {latestRec && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-[13px] font-semibold tracking-[0.15em] uppercase text-accent">
                  Recommendation
                </h2>
              </div>
              <RecommendationCard recommendation={latestRec} visible={true} />
            </div>
          )}

          {/* Agent Response */}
          {session.response && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <h2 className="text-[13px] font-semibold tracking-[0.15em] uppercase text-primary">
                  Agent Response
                </h2>
              </div>
              <div className="p-5 bg-paper border border-0.5 border-grid rounded-xl">
                <p className="text-[14px] text-text leading-[1.7]">{session.response}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
