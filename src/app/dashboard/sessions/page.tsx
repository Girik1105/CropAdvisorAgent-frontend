'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ActionBadge } from '@/components/ui/Badge'
import UrgencyBadge from '@/components/recommendation/UrgencyBadge'
import { api } from '@/lib/api'
import { Session } from '@/lib/types'

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getSessions().then((data) => {
      setSessions(data)
      setLoading(false)
    })
  }, [])

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-4xl pt-16 lg:pt-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-primary text-[24px] font-semibold tracking-wide">
          Sessions
        </h1>
        <p className="font-editorial italic text-text/40 text-[15px] mt-1">
          Recent agent interactions and reasoning traces
        </p>
      </div>

      {/* Sessions list */}
      <div className="space-y-3">
        {loading ? (
          <>
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-paper border border-0.5 border-grid rounded-lg p-5 animate-pulse">
                <div className="h-4 bg-grid rounded w-1/3 mb-3" />
                <div className="h-3 bg-grid rounded w-2/3" />
              </div>
            ))}
          </>
        ) : sessions.length === 0 ? (
          <div className="bg-paper border border-0.5 border-grid rounded-card p-10 text-center">
            <p className="text-[15px] text-text/50">No sessions yet</p>
            <p className="text-[13px] text-text/30 mt-0.5">
              Send a message to the agent from the demo page to create one
            </p>
          </div>
        ) : (
          sessions.map((session) => (
            <Link
              key={session.id}
              href={`/dashboard/${session.id}`}
              className="block bg-paper border border-0.5 border-grid rounded-lg p-5 hover:border-sand transition-colors group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-[15px] font-semibold text-text group-hover:text-primary transition-colors">
                      {session.field_name}
                    </h3>
                    {session.recommendations[0] && (
                      <ActionBadge action={session.recommendations[0].action_type} />
                    )}
                  </div>
                  <p className="text-[14px] text-text/50 truncate mb-1.5">
                    &ldquo;{session.message}&rdquo;
                  </p>
                  <p className="text-[13px] text-text/40 line-clamp-1">
                    {session.response}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className="font-mono text-[12px] text-text/40">
                    {new Date(session.created_at).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </span>
                  {session.recommendations[0] && (
                    <UrgencyBadge urgency={session.recommendations[0].urgency} />
                  )}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
