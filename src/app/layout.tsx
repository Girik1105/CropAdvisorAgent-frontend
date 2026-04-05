import type { Metadata } from 'next'
import { Outfit, IBM_Plex_Mono, Instrument_Serif } from 'next/font/google'
import AuthProvider from '@/components/AuthProvider'
import './globals.css'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: 'italic',
  variable: '--font-instrument-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'CropAdvisor — Intelligence for the Land',
  description:
    'AI-powered agricultural agent that checks weather, satellite crop health, and soil data to deliver actionable farming recommendations via SMS.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${ibmPlexMono.variable} ${instrumentSerif.variable} font-body antialiased min-h-screen`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
