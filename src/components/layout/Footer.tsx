import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-grid bg-paper">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left: Brand + tagline */}
        <div>
          <Link href="/" className="font-display text-primary text-[16px] font-bold tracking-wider">
            FIELDAGENT
          </Link>
          <p className="font-editorial italic text-text/30 text-[13px] mt-1">
            Intelligence for the land that feeds us
          </p>
        </div>

        {/* Center: Links */}
        <div className="flex items-center gap-6">
          <Link href="/#how-it-works" className="text-[13px] text-text/40 hover:text-primary transition-colors">
            How It Works
          </Link>
          <Link href="/#features" className="text-[13px] text-text/40 hover:text-primary transition-colors">
            Features
          </Link>
          <Link href="/demo" className="text-[13px] text-text/40 hover:text-primary transition-colors">
            Demo
          </Link>
          <Link href="/login" className="text-[13px] text-text/40 hover:text-primary transition-colors">
            Sign In
          </Link>
        </div>

        {/* Right: Attribution */}
        <div className="text-right">
          <p className="font-mono text-[11px] text-text/25">
            Innovation Hacks 2.0 &middot; ASU &middot; April 2026
          </p>
          <p className="font-mono text-[11px] text-text/25 mt-0.5">
            Powered by Gemini &middot; OpenWeatherMap &middot; USDA SSURGO &middot; NASA POWER
          </p>
        </div>
      </div>
    </footer>
  )
}
