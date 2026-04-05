'use client'

import { useEffect, useState, useCallback } from 'react'
import { TraceStep as TraceStepType } from '@/lib/types'
import TraceStep from './TraceStep'

interface TraceViewerProps {
  trace: TraceStepType[]
  visible: boolean
  onComplete?: () => void
}

export default function TraceViewer({ trace, visible, onComplete }: TraceViewerProps) {
  const [visibleCount, setVisibleCount] = useState(0)

  const staggerDelay = 400

  useEffect(() => {
    if (!visible) {
      setVisibleCount(0)
      return
    }

    let i = 0
    const interval = setInterval(() => {
      i++
      setVisibleCount(i)
      if (i >= trace.length) {
        clearInterval(interval)
      }
    }, staggerDelay)

    return () => clearInterval(interval)
  }, [visible, trace.length, staggerDelay])

  const onCompleteRef = useCallback(() => {
    onComplete?.()
  }, [onComplete])

  useEffect(() => {
    if (!visible || trace.length === 0) return
    const totalTime = trace.length * staggerDelay + 600
    const timer = setTimeout(onCompleteRef, totalTime)
    return () => clearTimeout(timer)
  }, [visible, trace.length, staggerDelay, onCompleteRef])

  return (
    <div className="flex flex-col">
      {trace.map((step, i) => (
        <div key={step.step}>
          {/* Connector line */}
          {i > 0 && (
            <div className="flex justify-center py-1">
              <div
                className={`w-px h-6 transition-all duration-300 ${
                  i < visibleCount ? 'bg-[#D4D0C8]' : 'bg-transparent'
                }`}
                style={{ transitionDelay: `${i * staggerDelay - 200}ms` }}
              />
            </div>
          )}
          <TraceStep step={step} visible={i < visibleCount} />
        </div>
      ))}
    </div>
  )
}
