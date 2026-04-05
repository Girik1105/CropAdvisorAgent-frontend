'use client'

import { useState, useEffect, FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { login, useAuth, isLoggedIn } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const { refresh } = useAuth()

  useEffect(() => {
    if (isLoggedIn()) router.replace('/dashboard')
  }, [router])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(username, password)

    if (result.ok) {
      refresh()
      router.push('/dashboard')
    } else {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="font-display text-primary text-[24px] font-semibold tracking-wide">
            Welcome back
          </h1>
          <p className="font-editorial italic text-text/40 text-[15px] mt-1">
            Sign in to your CropAdvisor account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-critical/10 border border-critical/20 rounded-card px-4 py-3 text-critical text-[13px]">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="username" className="block text-[11px] font-semibold tracking-[0.2em] uppercase text-text/40 mb-1.5">
              Username
            </label>
            <input
              id="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-paper border border-grid rounded-card px-4 py-2.5 text-[14px] text-text placeholder:text-text/25 focus:outline-none focus:border-primary/40 transition-colors"
              placeholder="farmer1"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-[11px] font-semibold tracking-[0.2em] uppercase text-text/40 mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-paper border border-grid rounded-card px-4 py-2.5 text-[14px] text-text placeholder:text-text/25 focus:outline-none focus:border-primary/40 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white text-[15px] font-semibold px-7 py-3 rounded-full transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        {/* Demo credentials */}
        <div className="mt-6 border border-dashed border-primary/20 rounded-xl px-5 py-4 bg-primary/[0.02]">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-[13px] font-semibold text-text">See CropAdvisor in action</p>
              <p className="text-[12px] text-text/45 leading-relaxed mt-0.5">
                This demo account has pre-populated fields, live weather data, USDA soil profiles, and completed health reports so you can explore the full agent experience.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setUsername('demo_farmer')
              setPassword('demo1234!')
            }}
            className="w-full bg-primary/[0.06] hover:bg-primary/10 border border-primary/15 rounded-lg px-4 py-2.5 transition-colors group flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="text-[12px] font-semibold text-text">demo_farmer</span>
            </div>
            <span className="text-[11px] text-accent font-semibold group-hover:translate-x-0.5 transition-transform">
              Fill &rarr;
            </span>
          </button>
        </div>

        {/* Footer link */}
        <p className="mt-5 text-center text-[13px] text-text/40">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-accent hover:text-accent/80 font-medium transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
