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

        {/* Footer link */}
        <p className="mt-6 text-center text-[13px] text-text/40">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-accent hover:text-accent/80 font-medium transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
