'use client'

import { useState, useEffect, useCallback, ReactNode } from 'react'
import { AuthContext, isLoggedIn, clearTokens } from '@/lib/auth'

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    setLoggedIn(isLoggedIn())
  }, [])

  const logout = useCallback(() => {
    clearTokens()
    setLoggedIn(false)
    window.location.href = '/login'
  }, [])

  const refresh = useCallback(() => {
    setLoggedIn(isLoggedIn())
  }, [])

  return (
    <AuthContext.Provider value={{ loggedIn, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}
