'use client'

import { useState, useEffect, FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signup, useAuth, isLoggedIn } from '@/lib/auth'

export default function SignupPage() {
  const router = useRouter()
  const { refresh } = useAuth()

  useEffect(() => {
    if (isLoggedIn()) router.replace('/dashboard')
  }, [router])
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)

    const result = await signup(username, email, phoneNumber, password)

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
            Create account
          </h1>
          <p className="font-editorial italic text-text/40 text-[15px] mt-1">
            Start monitoring your fields with CropAdvisor
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
            <label htmlFor="email" className="block text-[11px] font-semibold tracking-[0.2em] uppercase text-text/40 mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-paper border border-grid rounded-card px-4 py-2.5 text-[14px] text-text placeholder:text-text/25 focus:outline-none focus:border-primary/40 transition-colors"
              placeholder="farmer@example.com"
            />
            <span className="text-[11px] text-text/30 mt-1 block">Optional</span>
          </div>

          <div>
            <label htmlFor="phone" className="block text-[11px] font-semibold tracking-[0.2em] uppercase text-text/40 mb-1.5">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full bg-paper border border-grid rounded-card px-4 py-2.5 text-[14px] text-text placeholder:text-text/25 focus:outline-none focus:border-primary/40 transition-colors"
              placeholder="+1 (480) 555-0142"
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
              placeholder="Minimum 8 characters"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white text-[15px] font-semibold px-7 py-3 rounded-full transition-colors"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        {/* Footer link */}
        <p className="mt-6 text-center text-[13px] text-text/40">
          Already have an account?{' '}
          <Link href="/login" className="text-accent hover:text-accent/80 font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
