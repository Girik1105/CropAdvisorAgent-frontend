'use client'

import { useState, useEffect, useRef } from 'react'
import PhoneMockup from '@/components/chat/PhoneMockup'
import TraceViewer from '@/components/trace/TraceViewer'
import RecommendationCard from '@/components/recommendation/RecommendationCard'
import { AgentResponse } from '@/lib/types'

export default function Home() {
  const [response, setResponse] = useState<AgentResponse | null>(null)
  const [traceComplete, setTraceComplete] = useState(false)
  const [demoVisible, setDemoVisible] = useState(false)
  const demoRef = useRef<HTMLDivElement>(null)

  // Intersection Observer for demo section fade-in
  useEffect(() => {
    const el = demoRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDemoVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const handleResponse = (res: AgentResponse) => {
    setTraceComplete(false)
    setResponse(res)
  }

  const totalDuration = response
    ? response.trace.reduce((sum, s) => sum + s.duration_ms, 0)
    : 0

  return (
    <>
      {/* ════════════════ HERO ════════════════ */}
      <section className="h-[calc(100vh-64px)] flex flex-col items-center justify-center px-6 relative overflow-hidden">
        {/* Decorative topo contours — bottom right */}
        <svg
          className="absolute bottom-0 right-0 w-[600px] h-[500px] pointer-events-none"
          viewBox="0 0 600 500"
          fill="none"
          style={{ opacity: 0.08 }}
          pathLength="1"
        >
          <path className="contour-path" d="M420,80 C500,50 570,110 580,200 C590,290 540,370 460,400 C380,430 290,390 260,300 C230,210 300,110 420,80Z" stroke="#2D4A3E" strokeWidth="1" pathLength="1" />
          <path className="contour-path" d="M410,120 C470,100 520,140 528,210 C536,280 500,330 440,350 C380,370 320,340 300,280 C280,220 340,130 410,120Z" stroke="#2D4A3E" strokeWidth="1" pathLength="1" />
          <path className="contour-path" d="M405,160 C445,148 480,172 485,220 C490,268 465,300 425,310 C385,320 350,300 340,255 C330,210 370,165 405,160Z" stroke="#2D4A3E" strokeWidth="1" pathLength="1" />
          <path className="contour-path" d="M408,195 C430,188 450,205 453,230 C456,255 443,272 425,278 C407,284 390,272 385,248 C380,224 392,198 408,195Z" stroke="#2D4A3E" strokeWidth="1" pathLength="1" />
        </svg>

        {/* Decorative topo contours — top left */}
        <svg
          className="absolute top-0 left-0 w-[500px] h-[400px] pointer-events-none"
          viewBox="0 0 500 400"
          fill="none"
          style={{ opacity: 0.06 }}
        >
          <path className="contour-path" d="M80,320 C20,280 -10,200 30,120 C70,40 160,10 240,40 C320,70 350,160 310,240 C270,320 140,360 80,320Z" stroke="#2D4A3E" strokeWidth="1" pathLength="1" />
          <path className="contour-path" d="M100,290 C50,260 30,200 60,140 C90,80 160,55 220,75 C280,95 305,170 275,230 C245,290 150,320 100,290Z" stroke="#2D4A3E" strokeWidth="1" pathLength="1" />
          <path className="contour-path" d="M120,260 C85,240 70,195 90,155 C110,115 160,95 200,110 C240,125 255,175 240,210 C225,245 155,275 120,260Z" stroke="#2D4A3E" strokeWidth="1" pathLength="1" />
        </svg>

        {/* Soft radial glow behind headline */}
        <div
          className="hero-glow absolute w-[600px] h-[400px] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(45,74,62,0.06) 0%, transparent 70%)',
          }}
        />

        {/* Content */}
        <h1 className="hero-headline font-display text-[48px] lg:text-[56px] font-bold text-text text-center leading-tight max-w-3xl relative">
          Intelligence for the land<br />that feeds us
        </h1>

        <p className="hero-subtitle text-[17px] lg:text-[18px] text-text/45 text-center max-w-xl mt-5 leading-relaxed">
          An autonomous AI agent that checks weather, crop health, and soil — then tells your farmer exactly what to do and what it costs.
        </p>

        <div className="hero-ctas flex items-center gap-4 mt-8">
          <button
            onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-primary hover:bg-primary/90 text-white text-[15px] font-semibold px-7 py-3 rounded-full transition-colors"
          >
            Try the demo
          </button>
          <a
            href="tel:+16025550100"
            className="border-2 border-accent text-accent hover:bg-accent/5 text-[15px] font-semibold px-7 py-3 rounded-full transition-colors"
          >
            Call the agent
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 flex flex-col items-center gap-2 opacity-30">
          <span className="text-[11px] text-text/60 tracking-wider">SCROLL</span>
          <svg className="w-4 h-4 text-text/40 animate-bounce" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 12l-4-4h8z" />
          </svg>
        </div>
      </section>

      {/* ════════════════ DEMO ════════════════ */}
      <section
        id="demo"
        ref={demoRef}
        className={`py-16 lg:py-24 px-6 ${demoVisible ? 'demo-visible' : ''}`}
      >
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-14 demo-fade">
            <h2 className="font-display text-[28px] text-primary font-semibold tracking-wide">
              See the agent work
            </h2>
            <div className="w-16 h-[2px] bg-accent mx-auto mt-3" />
          </div>

          {/* Split: phone + trace */}
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
            {/* Left: Phone */}
            <div className="lg:w-[380px] flex-shrink-0 flex flex-col items-center demo-fade">
              <PhoneMockup onResponse={handleResponse} />

              <div className="mt-6 text-center">
                <p className="text-[12px] text-text/30">Or call the agent directly</p>
                <p className="text-[16px] font-bold text-accent mt-0.5">(602) 555-0100</p>
                <p className="text-[11px] text-text/20 mt-1">Powered by ElevenLabs</p>
              </div>
            </div>

            {/* Right: Trace */}
            <div className="flex-1 max-w-2xl demo-fade demo-fade-delay">
              {response ? (
                <>
                  {/* Header */}
                  <div className="flex items-baseline justify-between mb-5">
                    <div>
                      <span className="text-[11px] font-mono text-accent tracking-wider">— LIVE TRACE</span>
                      <h3 className="font-display text-[22px] font-semibold text-text tracking-wide mt-0.5">
                        What the agent did
                      </h3>
                    </div>
                    <span className="font-mono text-[12px] text-text/30 bg-grid/50 px-2.5 py-1 rounded">
                      TOTAL {(totalDuration / 1000).toFixed(1)}s
                    </span>
                  </div>

                  {/* Trace */}
                  <TraceViewer
                    trace={response.trace}
                    visible={true}
                    onComplete={() => setTraceComplete(true)}
                  />

                  {/* Recommendation */}
                  {response.recommendations[0] && (
                    <div className="mt-4">
                      <RecommendationCard
                        recommendation={response.recommendations[0]}
                        visible={traceComplete}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-64 lg:h-96">
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2.5 bg-grid/30 px-6 py-3.5 rounded-xl">
                      <div className="w-2.5 h-2.5 rounded-full bg-sand animate-pulse" />
                      <span className="text-[15px] text-text/35">
                        Send a message to see the agent think...
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
