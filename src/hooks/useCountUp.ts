'use client'

import { useEffect, useRef, useState } from 'react'

export function useCountUp(target: number, duration: number = 600, trigger: boolean): number {
  const [value, setValue] = useState(0)
  const rafRef = useRef<number>(0)
  const startTimeRef = useRef<number>(0)

  // Detect decimal places from target
  const decimals = (() => {
    const str = String(target)
    const dot = str.indexOf('.')
    return dot === -1 ? 0 : str.length - dot - 1
  })()

  useEffect(() => {
    if (!trigger) {
      setValue(0)
      return
    }

    startTimeRef.current = performance.now()

    const animate = (now: number) => {
      const elapsed = now - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = eased * target

      setValue(Number(current.toFixed(decimals)))

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      }
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [trigger, target, duration, decimals])

  return value
}
