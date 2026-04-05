'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth, getUsername } from '@/lib/auth'
import useRequireAuth from '@/hooks/useRequireAuth'

const sidebarItems = [
  {
    href: '/dashboard/fields',
    label: 'Home',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M2 14V6l6-4 6 4v8H2z" />
        <path d="M6 14V9h4v5" />
      </svg>
    ),
    exact: false,
  },
  {
    href: '/dashboard/sessions',
    label: 'Health Reports',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" />
        <path d="M6 5h4M6 8h4M6 11h2" />
      </svg>
    ),
    exact: false,
  },
  {
    href: '/dashboard/ask',
    label: 'Ask Agent',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M2 3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H5l-3 3V3z" />
      </svg>
    ),
    exact: false,
  },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const ready = useRequireAuth()
  const pathname = usePathname()
  const { logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const username = getUsername() || 'User'

  if (!ready) return null

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-primary text-white p-2 rounded-lg shadow-lg"
      >
        <svg className="w-5 h-5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          {sidebarOpen ? <path d="M4 4l8 8M12 4l-8 8" /> : <path d="M2 4h12M2 8h12M2 12h12" />}
        </svg>
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — fixed full height, internally scrollable nav */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-56 bg-primary flex flex-col flex-shrink-0 h-screen
        transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/10 flex-shrink-0">
          <Link href="/" className="font-display text-white text-[16px] font-bold tracking-wider">
            FIELDAGENT
          </Link>
          <p className="text-white/40 text-[11px] mt-0.5">Agent Dashboard</p>
        </div>

        {/* Nav — scrollable if many items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href) || (item.href === '/dashboard/fields' && pathname === '/dashboard')
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${
                  isActive
                    ? 'bg-white/15 text-white'
                    : 'text-white/50 hover:bg-white/8 hover:text-white/80'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom — pinned, never scrolls */}
        <div className="px-3 py-4 border-t border-white/10 space-y-1 flex-shrink-0">
          {/* Profile */}
          <div className="flex items-center gap-3 px-3 py-2.5">
            <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white/70" viewBox="0 0 16 16" fill="currentColor">
                <circle cx="8" cy="5" r="3" />
                <path d="M2 14c0-3.3 2.7-5 6-5s6 1.7 6 5" />
              </svg>
            </div>
            <span className="text-[12px] text-white/50 truncate">{username}</span>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-white/50 hover:bg-white/8 hover:text-white/80 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3M11 11l3-3-3-3M14 8H6" />
            </svg>
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content — scrolls independently */}
      <main className="flex-1 bg-bg overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
