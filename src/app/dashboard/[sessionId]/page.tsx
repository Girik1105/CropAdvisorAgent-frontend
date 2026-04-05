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
      <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-5xl pt-16 lg:pt-8">
        <div className="animate-pulse space-y-6">
          <div className="h-6 bg-grid rounded w-1/4" />
          <div className="h-4 bg-grid rounded w-1/2" />
          <div className="h-64 bg-paper border border-0.5 border-grid rounded-lg" />
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-5xl pt-16 lg:pt-8 text-center">
        <p className="text-text/50 text-[15px]">Session not found</p>
        <Link href="/dashboard/sessions" className="text-accent text-[14px] mt-2 inline-block hover:underline">
          Back to sessions
        </Link>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-5xl pt-16 lg:pt-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <Link href="/dashboard/sessions" className="text-[12px] text-text/40 hover:text-text transition-colors">
          Sessions
        </Link>
        <span className="text-grid">/</span>
        <span className="text-[12px] text-text">{session.field_name}</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-1">
          <h1 className="font-display text-primary text-[24px] font-semibold tracking-wide">
            {session.field_name}
          </h1>
          <span className="font-mono text-[12px] text-text/40">{session.total_duration_ms}ms</span>
        </div>
        <p className="text-[13px] text-text/40">
          {new Date(session.created_at).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
          })}{' '}
          at{' '}
          {new Date(session.created_at).toLocaleTimeString('en-US', {
            hour: 'numeric', minute: '2-digit', hour12: true,
          })}
          {' '}&middot;{' '}{session.phone_number}
        </p>

        <div className="mt-3 p-3 bg-paper border border-0.5 border-grid rounded-lg">
          <p className="text-[14px] text-text">&ldquo;{session.message}&rdquo;</p>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <TraceViewer trace={session.trace} visible={true} />
        </div>

        <div className="lg:w-80 space-y-5">
          {session.recommendations.map((rec, i) => (
            <div key={i}>
              <p className="text-accent text-[11px] font-semibold tracking-[0.2em] uppercase mb-2">
                RECOMMENDATION
              </p>
              <RecommendationCard recommendation={rec} visible={true} />
            </div>
          ))}

          <div>
            <p className="text-primary text-[11px] font-semibold tracking-[0.2em] uppercase mb-2">
              AGENT RESPONSE
            </p>
            <div className="p-4 bg-paper border border-0.5 border-grid rounded-lg">
              <p className="text-[14px] text-text leading-relaxed">{session.response}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
