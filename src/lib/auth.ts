'use client'

import { createContext, useContext } from 'react'
import { API_URL } from './env'

// --- Token helpers ---

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('access_token')
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('refresh_token')
}

export function setTokens(access: string, refresh: string) {
  localStorage.setItem('access_token', access)
  localStorage.setItem('refresh_token', refresh)
}

export function setUsername(username: string) {
  localStorage.setItem('username', username)
}

export function getUsername(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('username')
}

export function clearTokens() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('username')
}

export function isLoggedIn(): boolean {
  return !!getAccessToken()
}


// --- Token refresh ---

let refreshPromise: Promise<boolean> | null = null

export async function refreshAccessToken(): Promise<boolean> {
  // Deduplicate concurrent refresh calls
  if (refreshPromise) return refreshPromise

  refreshPromise = (async () => {
    const refresh = getRefreshToken()
    if (!refresh) return false

    try {
      const res = await fetch(`${API_URL}/auth/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }),
      })

      if (res.ok) {
        const data = await res.json()
        localStorage.setItem('access_token', data.access)
        return true
      }
      // Refresh token expired — force logout
      clearTokens()
      return false
    } catch {
      return false
    } finally {
      refreshPromise = null
    }
  })()

  return refreshPromise
}

// --- API calls ---

export async function login(usernameInput: string, password: string): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const res = await fetch(`${API_URL}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: usernameInput, password }),
    })

    if (res.ok) {
      const data = await res.json()
      setTokens(data.access, data.refresh)
      setUsername(data.username || usernameInput)
      return { ok: true }
    }

    const body = await res.json().catch(() => null)
    const error = body?.detail || body?.error || 'Invalid credentials'
    return { ok: false, error }
  } catch {
    return { ok: false, error: 'Network error — is the backend running?' }
  }
}

export async function signup(
  username: string,
  email: string,
  phoneNumber: string,
  password: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const res = await fetch(`${API_URL}/auth/signup/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, phone_number: phoneNumber, password }),
    })

    if (res.ok || res.status === 201) {
      const data = await res.json()
      setTokens(data.access, data.refresh)
      setUsername(data.username || username)
      return { ok: true }
    }

    const body = await res.json().catch(() => null)
    // DRF validation errors come as { field: [messages] }
    if (body) {
      const firstError = Object.values(body).flat()[0]
      if (typeof firstError === 'string') return { ok: false, error: firstError }
    }
    return { ok: false, error: 'Signup failed' }
  } catch {
    return { ok: false, error: 'Network error — is the backend running?' }
  }
}

// --- Auth context ---

export interface AuthState {
  loggedIn: boolean
  logout: () => void
  refresh: () => void
}

export const AuthContext = createContext<AuthState>({
  loggedIn: false,
  logout: () => {},
  refresh: () => {},
})

export function useAuth() {
  return useContext(AuthContext)
}
