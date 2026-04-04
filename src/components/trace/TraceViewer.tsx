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

  const staggerDelay = 300 // ms between steps
  const totalStaggerTime = trace.length * staggerDelay + 400 // last step animation duration

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

  // Fire onComplete after all steps + their animation finish
  const onCompleteRef = useCallback(() => {
    onComplete?.()
  }, [onComplete])

  useEffect(() => {
    if (!visible || trace.length === 0) return
    const timer = setTimeout(onCompleteRef, totalStaggerTime)
    return () => clearTimeout(timer)
  }, [visible, trace.length, totalStaggerTime, onCompleteRef])

  return (
    <div className="flex flex-col">
      {trace.map((step, i) => (
        <div key={step.step}>
          {/* Connector line */}
          {i > 0 && (
            <div className="flex justify-center">
              <div
                className={`w-px bg-[#E5E2D8] connector-line ${i < visibleCount ? 'visible' : ''}`}
                style={{ transitionDelay: `${i * staggerDelay - 100}ms` }}
              />
            </div>
          )}
          <TraceStep step={step} visible={i < visibleCount} />
        </div>
      ))}
    </div>
  )
}
