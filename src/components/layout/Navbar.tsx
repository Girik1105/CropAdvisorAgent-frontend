'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/#demo', label: 'Demo', matchPath: '/' },
  { href: '/dashboard', label: 'Sessions', matchPath: '/dashboard' },
  { href: '/fields', label: 'Fields', matchPath: '/fields' },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 w-full z-50 h-16 bg-bg/80 backdrop-blur-sm border-b border-grid">
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center">
        {/* Logo */}
        <Link href="/" className="font-display text-primary text-[20px] font-bold tracking-wider">
          CROPADVISOR
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-8 ml-12">
          {navItems.map((item) => {
            const isActive = pathname === item.matchPath
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative py-1 group"
              >
                <span
                  className={`text-[14px] transition-colors ${
                    isActive ? 'text-primary font-medium' : 'text-text/45 group-hover:text-text/70'
                  }`}
                >
                  {item.label}
                </span>
                {/* Animated underline */}
                <span
                  className={`absolute -bottom-0.5 left-0 h-[2px] bg-primary rounded-full transition-all duration-300 ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            )
          })}
        </div>

        {/* Call Agent button */}
        <div className="ml-auto">
          <a
            href="tel:+16812911561"
            className="bg-accent hover:bg-accent/90 text-white text-[13px] font-semibold px-5 py-2.5 rounded-full transition-colors inline-flex items-center gap-2"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
              <path d="M3.65 1.55a1.5 1.5 0 0 1 2.12 0l1.06 1.06a1.5 1.5 0 0 1 0 2.12L5.77 5.79a8.3 8.3 0 0 0 4.44 4.44l1.06-1.06a1.5 1.5 0 0 1 2.12 0l1.06 1.06a1.5 1.5 0 0 1 0 2.12l-.7.71a2.5 2.5 0 0 1-2.65.65A13.2 13.2 0 0 1 3.23 5.84a2.5 2.5 0 0 1 .65-2.65z" />
            </svg>
            Call Agent (681) 291-1561
          </a>
        </div>
      </div>
    </nav>
  )
}
