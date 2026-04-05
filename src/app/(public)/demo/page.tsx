'use client'

import { useState } from 'react'
import Link from 'next/link'
import PhoneMockup from '@/components/chat/PhoneMockup'
import TraceViewer from '@/components/trace/TraceViewer'
import RecommendationCard from '@/components/recommendation/RecommendationCard'
import FieldCard from '@/components/fields/FieldCard'
import NDVIBar from '@/components/fields/NDVIBar'
import { AgentResponse, Session } from '@/lib/types'
import { mockFields, mockSessions, showcaseTrace, showcaseRecommendations } from '@/lib/mock-data'
import { api } from '@/lib/api'

type DemoTab = 'phone' | 'dashboard' | 'sessions' | 'fields'

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState<DemoTab>('phone')
  const [response, setResponse] = useState<AgentResponse | null>(null)
  const [traceComplete, setTraceComplete] = useState(false)
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)

  const handleResponse = async (res: AgentResponse) => {
    setTraceComplete(false)
    setResponse(res)
    if (res.trace.length === 0 && res.session_id) {
      const trace = await api.getTraceSteps(res.session_id)
      if (trace.length > 0) {
        setResponse((prev) => (prev ? { ...prev, trace } : prev))
      }
    }
  }

  const totalDuration = response
    ? response.trace.reduce((sum, s) => sum + s.duration_ms, 0)
    : 0

  const tabs: { key: DemoTab; label: string; icon: JSX.Element }[] = [
    { key: 'phone', label: 'SMS Agent', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg> },
    { key: 'dashboard', label: 'Dashboard', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg> },
    { key: 'sessions', label: 'Sessions', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg> },
    { key: 'fields', label: 'Fields', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg> },
  ]

  return (
    <div className="min-h-[calc(100vh-64px)] px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-[32px] lg:text-[40px] text-primary font-semibold tracking-wide">
            Interactive Demo
          </h1>
          <p className="text-[15px] text-text/40 mt-2 max-w-lg mx-auto">
            Explore CropAdvisor like a real user — send messages, view traces, browse fields and sessions.
          </p>
        </div>

        {/* Tab bar */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setSelectedSession(null) }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-paper border border-grid text-text/50 hover:text-text/70 hover:border-sand'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Phone tab ── */}
        {activeTab === 'phone' && (
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start max-w-6xl mx-auto">
            <div className="lg:w-[380px] flex-shrink-0 flex flex-col items-center">
              <PhoneMockup onResponse={handleResponse} useMock />
              <div className="mt-6 text-center">
                <p className="text-[12px] text-text/30">Or call directly</p>
                <p className="text-[16px] font-bold text-accent mt-0.5">(681) 291-1561</p>
                <p className="text-[11px] text-text/20 mt-1">Powered by ElevenLabs</p>
              </div>
            </div>

            <div className="flex-1 max-w-2xl">
              {response ? (
                <>
                  <div className="flex items-baseline justify-between mb-5">
                    <div>
                      <span className="text-[11px] font-mono text-accent tracking-wider">— LIVE TRACE</span>
                      <h3 className="font-display text-[22px] font-semibold text-text tracking-wide mt-0.5">What the agent did</h3>
                    </div>
                    <span className="font-mono text-[12px] text-text/30 bg-grid/50 px-2.5 py-1 rounded">TOTAL {(totalDuration / 1000).toFixed(1)}s</span>
                  </div>
                  <TraceViewer trace={response.trace} visible={true} onComplete={() => setTraceComplete(true)} />
                  {response.recommendations[0] && (
                    <div className="mt-4">
                      <RecommendationCard recommendation={response.recommendations[0]} visible={traceComplete} />
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-64 lg:h-96">
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2.5 bg-grid/30 px-6 py-3.5 rounded-xl">
                      <div className="w-2.5 h-2.5 rounded-full bg-sand animate-pulse" />
                      <span className="text-[15px] text-text/35">Send a message to see the agent think...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Dashboard tab ── */}
        {activeTab === 'dashboard' && (
          <div className="max-w-6xl mx-auto">
            {/* Metric cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: 'FIELDS', value: '3', sub: 'registered' },
                { label: 'SESSIONS', value: '3', sub: 'total interactions' },
                { label: 'ALERTS', value: '2', sub: 'need attention' },
              ].map((m) => (
                <div key={m.label} className="bg-paper border border-grid rounded-xl p-5">
                  <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-text/30">{m.label}</p>
                  <p className="text-[28px] font-bold text-text mt-1">{m.value}</p>
                  <p className="text-[12px] text-text/30">{m.sub}</p>
                </div>
              ))}
            </div>

            {/* Field panels */}
            <div className="space-y-4">
              {mockFields.map((field) => (
                <div key={field.id} className="bg-paper border border-grid rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-[16px] font-semibold text-text">{field.name}</h3>
                      <p className="text-[12px] text-text/40 mt-0.5">{field.crop_type} &middot; {field.area_acres} acres &middot; {field.soil_type}</p>
                    </div>
                    {field.last_ndvi !== undefined && (
                      <span className={`text-[11px] font-bold uppercase px-2.5 py-1 rounded-full ${
                        field.last_ndvi >= 0.6 ? 'bg-emerald-100 text-emerald-700' :
                        field.last_ndvi >= 0.4 ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        NDVI {field.last_ndvi}
                      </span>
                    )}
                  </div>

                  {field.last_ndvi !== undefined && (
                    <div className="mb-4">
                      <NDVIBar value={field.last_ndvi} />
                    </div>
                  )}

                  {field.last_recommendation && (
                    <p className="text-[13px] text-text/50 leading-relaxed">{field.last_recommendation}</p>
                  )}

                  <div className="mt-3 pt-3 border-t border-grid">
                    <span className="font-mono text-[10px] text-text/25">{field.lat.toFixed(4)}°N, {Math.abs(field.lng).toFixed(4)}°W</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Sessions tab ── */}
        {activeTab === 'sessions' && !selectedSession && (
          <div className="max-w-4xl mx-auto space-y-3">
            {mockSessions.map((session) => (
              <button
                key={session.id}
                onClick={() => setSelectedSession(session)}
                className="w-full text-left bg-paper border border-grid rounded-xl p-5 hover:border-sand transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-[15px] font-semibold text-text">{session.field_name}</h3>
                      {session.recommendations[0] && (
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          session.recommendations[0].action_type === 'irrigate' ? 'bg-blue-100 text-blue-700' :
                          session.recommendations[0].action_type === 'fertilize' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {session.recommendations[0].action_type.replace('_', ' ')}
                        </span>
                      )}
                      <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                        session.channel === 'sms' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {session.channel}
                      </span>
                    </div>
                    <p className="text-[14px] text-text/50 truncate mb-1">&ldquo;{session.message}&rdquo;</p>
                    <p className="text-[13px] text-text/35 line-clamp-1">{session.response}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="font-mono text-[12px] text-text/40">
                      {new Date(session.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                    </span>
                    <svg className="w-4 h-4 text-text/20" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 4l4 4-4 4" /></svg>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* ── Session detail ── */}
        {activeTab === 'sessions' && selectedSession && (
          <div className="max-w-6xl mx-auto">
            <button onClick={() => setSelectedSession(null)} className="text-[13px] text-text/40 hover:text-accent transition-colors mb-6 flex items-center gap-1">
              <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 2L4 6l4 4" /></svg>
              Back to sessions
            </button>

            {/* Header */}
            <div className="bg-paper border border-grid rounded-xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <h2 className="font-display text-[24px] font-semibold text-primary">{selectedSession.field_name}</h2>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  selectedSession.channel === 'sms' ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                }`}>{selectedSession.channel}</span>
              </div>
              <p className="text-[13px] text-text/40 mb-3">
                {new Date(selectedSession.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                {' at '}
                {new Date(selectedSession.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
              </p>
              <div className="bg-bg rounded-lg rounded-tl-sm px-4 py-3">
                <p className="text-[14px] text-text">{selectedSession.message}</p>
              </div>
            </div>

            {/* Response + Recommendation */}
            {selectedSession.response && (
              <div className="bg-paper border border-grid rounded-xl p-5 mb-6">
                <h3 className="text-[13px] font-semibold tracking-[0.15em] uppercase text-primary mb-3">Agent Response</h3>
                <p className="text-[14px] text-text leading-[1.7]">{selectedSession.response}</p>
              </div>
            )}

            {selectedSession.recommendations[0] && (
              <div className="mb-6">
                <h3 className="text-[13px] font-semibold tracking-[0.15em] uppercase text-accent mb-3">Recommendation</h3>
                <RecommendationCard recommendation={selectedSession.recommendations[0]} visible={true} />
              </div>
            )}

            {/* Trace */}
            {selectedSession.trace.length > 0 && (
              <div>
                <h3 className="text-[13px] font-semibold tracking-[0.15em] uppercase text-text/50 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  Agent Reasoning Trace
                </h3>
                <TraceViewer trace={selectedSession.trace} visible={true} />
              </div>
            )}
          </div>
        )}

        {/* ── Fields tab ── */}
        {activeTab === 'fields' && (
          <div className="max-w-4xl mx-auto space-y-3">
            {mockFields.map((field) => (
              <FieldCard key={field.id} field={field} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
