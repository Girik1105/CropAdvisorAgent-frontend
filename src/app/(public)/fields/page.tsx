'use client'

import Link from 'next/link'
import FieldCard from '@/components/fields/FieldCard'
import { mockFields } from '@/lib/mock-data'

export default function DemoFieldsPage() {
  const fields = mockFields

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-block bg-accent/10 text-accent text-[11px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full mb-3">
          Demo Data
        </div>
        <h1 className="font-display text-primary text-[24px] font-semibold tracking-wide">
          Registered Fields
        </h1>
        <p className="font-editorial italic text-text/40 text-[15px] mt-1">
          Example fields with satellite health and soil profiles
        </p>
      </div>

      {/* Fields grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field) => (
          <FieldCard key={field.id} field={field} />
        ))}
      </div>

      {/* CTA */}
      <div className="mt-8 text-center">
        <p className="text-[13px] text-text/40 mb-3">Sign in to view your own fields</p>
        <Link
          href="/login"
          className="inline-block bg-primary hover:bg-primary/90 text-white text-[14px] font-semibold px-6 py-2.5 rounded-full transition-colors"
        >
          Sign in
        </Link>
      </div>
    </div>
  )
}
