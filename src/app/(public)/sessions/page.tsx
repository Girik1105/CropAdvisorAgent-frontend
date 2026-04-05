'use client'

import Link from 'next/link'
import { ActionBadge } from '@/components/ui/Badge'
import UrgencyBadge from '@/components/recommendation/UrgencyBadge'
import { mockSessions } from '@/lib/mock-data'

export default function DemoSessionsPage() {
  const sessions = mockSessions

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-block bg-accent/10 text-accent text-[11px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full mb-3">
          Demo Data
        </div>
        <h1 className="font-display text-primary text-[24px] font-semibold tracking-wide">
          Agent Sessions
        </h1>
        <p className="font-editorial italic text-text/40 text-[15px] mt-1">
          Example agent interactions and reasoning traces
        </p>
      </div>

      {/* Sessions list */}
      <div className="space-y-3">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="block bg-paper border border-0.5 border-grid rounded-lg p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-[15px] font-semibold text-text">
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
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-8 text-center">
        <p className="text-[13px] text-text/40 mb-3">Sign in to view your own sessions</p>
        <Link
          href="/login"
          className="inline-block bg-primary hover:bg-primary/90 text-white text-[14px] font-semibold px-6 py-2.5 rounded-full transition-colors"
        >
          Sign in
        </Link>
      </div>
    </div>
  )
}
