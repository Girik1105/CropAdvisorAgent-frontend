'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

function useScrollFade() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return { ref, visible }
}

export default function Home() {
  const howItWorks = useScrollFade()
  const features = useScrollFade()
  const dataSources = useScrollFade()
  const cta = useScrollFade()

  return (
    <>
      {/* ════════════════ HERO ════════════════ */}
      <section className="h-[calc(100vh-64px)] flex flex-col items-center justify-center px-6 relative overflow-hidden">
        {/* Contour backgrounds */}
        <svg className="absolute bottom-0 right-0 w-[600px] h-[500px] pointer-events-none" viewBox="0 0 600 500" fill="none" style={{ opacity: 0.08 }}>
          <path className="contour-path" d="M420,80 C500,50 570,110 580,200 C590,290 540,370 460,400 C380,430 290,390 260,300 C230,210 300,110 420,80Z" stroke="#2D4A3E" strokeWidth="1" pathLength="1" />
          <path className="contour-path" d="M410,120 C470,100 520,140 528,210 C536,280 500,330 440,350 C380,370 320,340 300,280 C280,220 340,130 410,120Z" stroke="#2D4A3E" strokeWidth="1" pathLength="1" />
          <path className="contour-path" d="M405,160 C445,148 480,172 485,220 C490,268 465,300 425,310 C385,320 350,300 340,255 C330,210 370,165 405,160Z" stroke="#2D4A3E" strokeWidth="1" pathLength="1" />
        </svg>
        <svg className="absolute top-0 left-0 w-[500px] h-[400px] pointer-events-none" viewBox="0 0 500 400" fill="none" style={{ opacity: 0.06 }}>
          <path className="contour-path" d="M80,320 C20,280 -10,200 30,120 C70,40 160,10 240,40 C320,70 350,160 310,240 C270,320 140,360 80,320Z" stroke="#2D4A3E" strokeWidth="1" pathLength="1" />
          <path className="contour-path" d="M100,290 C50,260 30,200 60,140 C90,80 160,55 220,75 C280,95 305,170 275,230 C245,290 150,320 100,290Z" stroke="#2D4A3E" strokeWidth="1" pathLength="1" />
        </svg>

        <div className="hero-glow absolute w-[700px] h-[500px] pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(45,74,62,0.08) 0%, transparent 70%)' }} />

        {/* Content */}
        <h1 className="hero-headline font-display text-[48px] lg:text-[56px] font-bold text-text text-center leading-tight max-w-3xl relative">
          Intelligence for the{' '}
          <span className="relative">
            land
            <span className="absolute -bottom-1 left-0 w-full h-2 bg-primary/15 rounded-full -z-10" />
          </span>
          <br />that feeds us
        </h1>
        <p className="hero-subtitle text-[17px] lg:text-[18px] text-text/45 text-center max-w-xl mt-5 leading-relaxed">
          An autonomous AI agent that gathers real weather, soil, and satellite data — then tells your farmer exactly what to do and what it costs.
        </p>
        <div className="hero-ctas flex items-center gap-4 mt-8">
          <Link href="/demo" className="bg-primary hover:bg-primary/90 text-white text-[15px] font-semibold px-7 py-3 rounded-full transition-colors">
            Try the demo
          </Link>
          <Link href="/login" className="border-2 border-grid hover:border-sand text-text text-[15px] font-semibold px-7 py-3 rounded-full transition-colors">
            Sign in
          </Link>
        </div>

        {/* Tech badges */}
        <div className="hero-tech flex items-center gap-3 mt-6 flex-wrap justify-center">
          {['Gemini 2.5 Flash', 'USDA SSURGO', 'NASA POWER', 'OpenWeatherMap', 'USDA NASS'].map((tech) => (
            <span key={tech} className="text-[10px] font-mono text-text/25 bg-grid/40 px-2.5 py-1 rounded-full">
              {tech}
            </span>
          ))}
        </div>

        <div className="absolute bottom-8 flex flex-col items-center gap-2 opacity-30">
          <span className="text-[11px] text-text/60 tracking-wider">SCROLL</span>
          <svg className="w-4 h-4 text-text/40 animate-bounce" viewBox="0 0 16 16" fill="currentColor"><path d="M8 12l-4-4h8z" /></svg>
        </div>
      </section>

      {/* ════════════════ HOW IT WORKS ════════════════ */}
      <section id="how-it-works" ref={howItWorks.ref} className={`py-20 lg:py-28 px-6 ${howItWorks.visible ? 'demo-visible' : ''}`}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 demo-fade">
            <span className="text-[11px] font-mono text-accent tracking-widest uppercase">How it works</span>
            <h2 className="font-display text-[32px] lg:text-[36px] text-primary font-semibold tracking-wide mt-2">
              From field to decision in seconds
            </h2>
            <p className="text-[16px] text-text/40 mt-3 max-w-lg mx-auto">
              One message triggers a fully autonomous pipeline — no dashboards to learn, no data to enter manually.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative">
            <div className="hidden md:block absolute top-16 left-[calc(33.33%+16px)] right-[calc(33.33%+16px)] h-px bg-grid" />
            {[
              { step: '01', icon: <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>, title: 'Add Your Field', desc: 'Register with GPS coordinates, crop type, and acreage. Your phone number links the field to SMS.' },
              { step: '02', icon: <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" /></svg>, title: 'Agent Gathers Data', desc: '7 tools run autonomously — live weather, real USDA soil profiles, NASA satellite data, pest risk, market prices, and more.' },
              { step: '03', icon: <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg>, title: 'Get Actionable Advice', desc: 'A costed recommendation with urgency, implementation steps, and risk quantification. Via SMS or dashboard.' },
            ].map((item, i) => (
              <div key={item.step} className="demo-fade text-center" style={{ animationDelay: `${i * 200}ms` }}>
                <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-paper border border-grid mb-5">
                  {item.icon}
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-white text-[11px] font-bold flex items-center justify-center">{item.step}</span>
                </div>
                <h3 className="font-display text-[18px] font-semibold text-text tracking-wide mb-2">{item.title}</h3>
                <p className="text-[14px] text-text/45 leading-relaxed max-w-xs mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ FEATURES ════════════════ */}
      <section id="features" ref={features.ref} className={`py-20 lg:py-28 px-6 bg-paper ${features.visible ? 'demo-visible' : ''}`}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14 demo-fade">
            <span className="text-[11px] font-mono text-accent tracking-widest uppercase">Features</span>
            <h2 className="font-display text-[32px] lg:text-[36px] text-primary font-semibold tracking-wide mt-2">
              An agent, not a dashboard
            </h2>
            <p className="text-[16px] text-text/40 mt-3 max-w-lg mx-auto">
              CropAdvisor doesn&apos;t show you data — it makes decisions and tells you exactly what to do.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" /></svg>, iconBg: 'bg-primary/10 text-primary', title: '7-Tool Autonomous Agent', desc: 'Gemini decides which tools to call. Weather, soil, NDVI, market, pest, water, growth stage — gathered without human guidance.' },
              { icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>, iconBg: 'bg-violet-100 text-violet-600', title: 'Intent Classification', desc: 'Routes "action needed" vs "general question" to the right pipeline. No wasted API calls.' },
              { icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>, iconBg: 'bg-blue-100 text-blue-600', title: 'SMS + Dashboard', desc: 'Same engine, two channels. Farmer texts from a $20 phone or uses the web dashboard.' },
              { icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" /></svg>, iconBg: 'bg-emerald-100 text-emerald-600', title: 'Cost Estimation', desc: 'Every recommendation includes a dollar cost estimate with breakdown, plus risk quantified as yield loss.' },
              { icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>, iconBg: 'bg-amber-100 text-amber-600', title: 'Reasoning Trace', desc: 'See every tool call, every data point, every decision. Proves the agent is thinking, not pattern-matching.' },
              { icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>, iconBg: 'bg-accent/10 text-accent', title: 'Real-Time Decisions', desc: 'Live weather drives irrigation timing. NASA satellite data calculates precise water budgets daily.' },
            ].map((feat, i) => (
              <div key={feat.title} className="demo-fade bg-bg border border-grid rounded-xl p-6 hover:border-sand hover:shadow-sm transition-all" style={{ animationDelay: `${i * 100}ms` }}>
                <div className={`w-10 h-10 rounded-xl ${feat.iconBg} flex items-center justify-center mb-4`}>{feat.icon}</div>
                <h3 className="text-[15px] font-semibold text-text mb-2">{feat.title}</h3>
                <p className="text-[13px] text-text/40 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ DATA SOURCES ════════════════ */}
      <section id="data-sources" ref={dataSources.ref} className={`py-20 lg:py-28 px-6 ${dataSources.visible ? 'demo-visible' : ''}`}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14 demo-fade">
            <span className="text-[11px] font-mono text-accent tracking-widest uppercase">Data sources</span>
            <h2 className="font-display text-[32px] lg:text-[36px] text-primary font-semibold tracking-wide mt-2">
              Real data, not guesswork
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" /></svg>,
                iconBg: 'bg-blue-50',
                name: 'OpenWeatherMap',
                tag: 'LIVE',
                tagColor: 'bg-blue-100 text-blue-700',
                desc: 'Real-time temperature, humidity, wind speed, UV index, and 7-day precipitation forecast for your exact field coordinates.',
                url: 'https://openweathermap.org/api',
              },
              {
                icon: <svg className="w-6 h-6 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20.893 13.393l-1.135-1.135a2.252 2.252 0 01-.421-2.608l.058-.115a2.25 2.25 0 00-.357-2.529l-1.06-1.06a2.25 2.25 0 00-2.529-.357l-.115.058a2.252 2.252 0 01-2.608-.421L11.59 4.093a2.25 2.25 0 00-2.186-.571l-1.414.353a2.25 2.25 0 00-1.633 1.633l-.353 1.414a2.25 2.25 0 00.571 2.186l1.135 1.135a2.252 2.252 0 01.421 2.608l-.058.115a2.25 2.25 0 00.357 2.529l1.06 1.06c.635.635 1.59.836 2.529.357l.115-.058a2.252 2.252 0 012.608.421l1.135 1.135a2.25 2.25 0 002.186.571l1.414-.353a2.25 2.25 0 001.633-1.633l.353-1.414a2.25 2.25 0 00-.571-2.186z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
                iconBg: 'bg-amber-50',
                name: 'USDA SSURGO',
                tag: 'REAL',
                tagColor: 'bg-amber-100 text-amber-700',
                desc: 'Real soil profiles queried by GPS coordinates via the USDA Soil Data Access API — pH, drainage class, organic matter, water-holding capacity.',
                url: 'https://sdmdataaccess.sc.egov.usda.gov/',
              },
              {
                icon: <svg className="w-6 h-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>,
                iconBg: 'bg-green-50',
                name: 'USDA NASS',
                tag: 'GOV DATA',
                tagColor: 'bg-green-100 text-green-700',
                desc: 'National Agricultural Statistics Service — crop production data, county-level yields, acreage reports, and agricultural census data.',
                url: 'https://quickstats.nass.usda.gov/api/',
              },
              {
                icon: <svg className="w-6 h-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>,
                iconBg: 'bg-violet-50',
                name: 'NASA POWER',
                tag: 'SATELLITE',
                tagColor: 'bg-violet-100 text-violet-700',
                desc: 'Satellite-derived solar radiation, temperature, wind, and humidity for FAO Penman-Monteith ET₀ evapotranspiration water budget calculations.',
                url: 'https://power.larc.nasa.gov/',
              },
              {
                icon: <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>,
                iconBg: 'bg-emerald-50',
                name: 'USGS / Landsat',
                tag: 'SATELLITE',
                tagColor: 'bg-emerald-100 text-emerald-700',
                desc: 'NDVI vegetation health index from Landsat satellite imagery. Detects drought stress, nitrogen deficiency, and crop damage across fields.',
                url: 'https://earthexplorer.usgs.gov/',
              },
              {
                icon: <svg className="w-6 h-6 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                iconBg: 'bg-cyan-50',
                name: 'Gemini 2.5 Flash',
                tag: 'AI ENGINE',
                tagColor: 'bg-cyan-100 text-cyan-700',
                desc: 'Google\'s latest multimodal AI model powers the 3-agent pipeline — intent classification, data analysis, and costed recommendation generation.',
                url: 'https://aistudio.google.com/',
              },
            ].map((source, i) => (
              <a
                key={source.name}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="demo-fade bg-paper border border-grid rounded-xl p-5 hover:border-sand hover:shadow-sm transition-all group"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl ${source.iconBg} flex items-center justify-center flex-shrink-0`}>
                    {source.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h3 className="text-[15px] font-semibold text-text group-hover:text-primary transition-colors">{source.name}</h3>
                      <span className={`text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full ${source.tagColor}`}>{source.tag}</span>
                    </div>
                    <p className="text-[12px] text-text/40 leading-relaxed">{source.desc}</p>
                    <span className="text-[11px] text-accent font-medium mt-2 inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      View API docs
                      <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 10L10 2M10 2H4M10 2v6" /></svg>
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ CTA ════════════════ */}
      <section ref={cta.ref} className={`py-20 lg:py-28 px-6 bg-paper ${cta.visible ? 'demo-visible' : ''}`}>
        <div className="max-w-3xl mx-auto text-center demo-fade">
          <h2 className="font-display text-[32px] lg:text-[40px] text-primary font-semibold tracking-wide">
            Start monitoring your fields
          </h2>
          <p className="text-[16px] text-text/40 mt-4 max-w-md mx-auto leading-relaxed">
            Free to use. Add your first field in 30 seconds. The agent handles everything else.
          </p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <Link href="/demo" className="bg-accent hover:bg-accent/90 text-white text-[15px] font-semibold px-8 py-3.5 rounded-full transition-colors">
              Try the Demo
            </Link>
            <Link href="/signup" className="bg-primary hover:bg-primary/90 text-white text-[15px] font-semibold px-8 py-3.5 rounded-full transition-colors">
              Create Account
            </Link>
          </div>
          <p className="text-[12px] text-text/25 mt-6 font-mono">
            Built with Gemini 2.5 Flash &middot; OpenWeatherMap &middot; USDA SSURGO &middot; NASA POWER
          </p>
        </div>
      </section>
    </>
  )
}
