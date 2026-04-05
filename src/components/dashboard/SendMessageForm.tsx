'use client'

import { useState, useEffect, useRef, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { Field } from '@/lib/types'

const SCAN_STEPS = [
  { icon: '🌤', label: 'Checking weather conditions...',        delay: 2000 },
  { icon: '🌱', label: 'Scanning crop health (NDVI)...',        delay: 2500 },
  { icon: '🪨', label: 'Analyzing soil profile (USDA)...',      delay: 2500 },
  { icon: '📊', label: 'Fetching market prices...',             delay: 1500 },
  { icon: '🐛', label: 'Assessing pest risk...',                delay: 1500 },
  { icon: '💧', label: 'Calculating water budget (NASA)...',    delay: 2500 },
  { icon: '📅', label: 'Checking growth stage...',              delay: 1000 },
  { icon: '🧠', label: 'AI analyzing all data...',              delay: 4000 },
  { icon: '📋', label: 'Generating recommendation...',          delay: 3000 },
]

export default function SendMessageForm({ onMessageSent }: { onMessageSent?: () => void }) {
  const router = useRouter()
  const [fields, setFields] = useState<Field[]>([])
  const [message, setMessage] = useState('')
  const [fieldId, setFieldId] = useState('')
  const [error, setError] = useState('')

  // Loading state
  const [scanning, setScanning] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const pollingRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    api.getFields().then((data) => {
      setFields(data)
      if (data.length > 0) setFieldId(data[0].id)
    })
  }, [])

  // Animate through steps while scanning
  useEffect(() => {
    if (!scanning) return
    if (currentStep >= SCAN_STEPS.length - 1) return

    const timer = setTimeout(() => {
      setCurrentStep((s) => Math.min(s + 1, SCAN_STEPS.length - 1))
    }, SCAN_STEPS[currentStep].delay)

    return () => clearTimeout(timer)
  }, [scanning, currentStep])

  // Poll for status when sessionId is set
  useEffect(() => {
    if (!sessionId || !scanning) return

    const poll = async () => {
      try {
        const res = await api.getHealthCheckStatus(sessionId)
        if (res.status === 'completed') {
          cleanup()
          onMessageSent?.()
          router.push(`/dashboard/${sessionId}`)
        } else if (res.status === 'failed') {
          cleanup()
          setError(res.error || 'Health check failed.')
        }
        // else still processing — keep polling
      } catch {
        // Network error — keep polling
      }
    }

    pollingRef.current = setInterval(poll, 2000)
    return () => { if (pollingRef.current) clearInterval(pollingRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, scanning])

  function cleanup() {
    setScanning(false)
    setSessionId(null)
    setCurrentStep(0)
    if (pollingRef.current) clearInterval(pollingRef.current)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!fieldId) { setError('Please select a field first.'); return }
    setError('')
    setScanning(true)
    setCurrentStep(0)

    try {
      const res = await api.startHealthCheck({
        message: message || 'Run a full health check on my field',
        field_id: fieldId,
      })
      setSessionId(res.session_id)
      setMessage('')
    } catch {
      setError('Failed to start health check.')
      setScanning(false)
    }
  }

  const progressPct = scanning ? Math.min(((currentStep + 1) / SCAN_STEPS.length) * 100, 95) : 0
  const selectedField = fields.find((f) => f.id === fieldId)

  if (scanning) {
    return (
      <div className="bg-paper border border-0.5 border-grid rounded-xl overflow-hidden mb-6">
        {/* Progress bar */}
        <div className="h-1.5 bg-grid">
          <div
            className="h-full rounded-r-full transition-all duration-1000 ease-out"
            style={{
              width: `${progressPct}%`,
              background: 'linear-gradient(90deg, #2D4A3E, #C4704B, #2D4A3E)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 2s linear infinite',
            }}
          />
        </div>

        <div className="p-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-primary animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-[16px] font-semibold text-text">
                Running Health Check
              </h3>
              <p className="text-[12px] text-text/40 mt-0.5">
                {selectedField?.name || 'Field'} — scanning 7 data sources
              </p>
            </div>
            <div className="text-right">
              <span className="font-mono text-[20px] font-bold text-primary">{Math.round(progressPct)}%</span>
            </div>
          </div>

          {/* Steps grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-2">
            {SCAN_STEPS.map((step, i) => {
              const isDone = i < currentStep
              const isCurrent = i === currentStep
              return (
                <div
                  key={i}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-500 ${
                    isCurrent ? 'bg-primary/5 scale-[1.02]' : isDone ? '' : ''
                  }`}
                >
                  <span className="w-5 text-center text-[14px] flex-shrink-0">
                    {isDone ? (
                      <svg className="w-4 h-4 text-primary mx-auto" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 1 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0z" />
                      </svg>
                    ) : (
                      <span className={isCurrent ? '' : 'opacity-30'}>{step.icon}</span>
                    )}
                  </span>
                  <span className={`text-[12px] transition-colors duration-300 ${
                    isCurrent ? 'text-text font-medium' : isDone ? 'text-text/40' : 'text-text/20'
                  }`}>
                    {step.label}
                  </span>
                  {isCurrent && (
                    <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse ml-auto flex-shrink-0" />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
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
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 bg-bg border border-grid rounded-lg px-3 py-2.5 text-[13px] text-text placeholder:text-text/25 focus:outline-none focus:border-primary/40 transition-colors"
          placeholder="Ask a question about your field, or leave blank for a full health report..."
        />

        <button
          type="submit"
          disabled={!fieldId}
          className="bg-accent hover:bg-accent/90 disabled:bg-accent/30 text-white text-[13px] font-semibold px-5 py-2.5 rounded-full transition-colors flex-shrink-0 inline-flex items-center gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" />
            <path d="M6 5h4M6 8h4M6 11h2" />
          </svg>
          Run Health Check
        </button>
      </form>
    </div>
  )
}
