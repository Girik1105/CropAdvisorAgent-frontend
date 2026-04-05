'use client'

import { useState, FormEvent } from 'react'
import { api } from '@/lib/api'
import { CreateFieldPayload } from '@/lib/types'

const CROP_TYPES = ['cotton', 'citrus', 'alfalfa', 'corn', 'wheat', 'soybean', 'vegetables', 'other']
const SOIL_TYPES = ['Sandy loam', 'Clay loam', 'Silty clay', 'Loam', 'Sandy clay', 'Silt loam', 'Clay', 'Sand']

export default function AddFieldModal({
  open,
  onClose,
  onFieldAdded,
}: {
  open: boolean
  onClose: () => void
  onFieldAdded: () => void
}) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [name, setName] = useState('')
  const [cropType, setCropType] = useState('')
  const [ownerPhone, setOwnerPhone] = useState('')
  const [lat, setLat] = useState('')
  const [lng, setLng] = useState('')
  const [areaAcres, setAreaAcres] = useState('')
  const [soilType, setSoilType] = useState('')

  if (!open) return null

  function reset() {
    setStep(1)
    setName('')
    setCropType('')
    setOwnerPhone('')
    setLat('')
    setLng('')
    setAreaAcres('')
    setSoilType('')
    setError('')
    setLoading(false)
  }

  function handleClose() {
    reset()
    onClose()
  }

  function canAdvance() {
    if (step === 1) return name.trim() && cropType && ownerPhone.trim()
    if (step === 2) return lat && lng && areaAcres
    if (step === 3) return soilType
    return false
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const payload: CreateFieldPayload = {
      name: name.trim(),
      crop_type: cropType,
      owner_phone: ownerPhone.trim(),
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      area_acres: parseFloat(areaAcres),
      soil_type: soilType,
    }

    try {
      await api.createField(payload)
      onFieldAdded()
      handleClose()
    } catch {
      setError('Failed to create field. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />

      {/* Modal */}
      <div className="relative bg-bg border border-grid rounded-lg shadow-xl w-full max-w-lg mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-grid">
          <div>
            <h2 className="font-display text-primary text-[18px] font-semibold tracking-wide">
              Add New Field
            </h2>
            <p className="text-[12px] text-text/40 mt-0.5">Step {step} of 3</p>
          </div>
          <button onClick={handleClose} className="text-text/30 hover:text-text/60 transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-grid">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {error && (
          <div className="mx-6 mt-4 bg-critical/10 border border-critical/20 rounded-card px-4 py-3 text-critical text-[13px]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-4">
            {/* Step 1: Name & Crop */}
            {step === 1 && (
              <>
                <StepLabel number={1} title="Field Identity" description="Name your field and select the crop type" />
                <div>
                  <label className="block text-[11px] font-semibold tracking-[0.2em] uppercase text-text/40 mb-1.5">
                    Field Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-paper border border-grid rounded-lg px-4 py-2.5 text-[14px] text-text placeholder:text-text/25 focus:outline-none focus:border-primary/40 transition-colors"
                    placeholder="e.g. North 40, Patel Cotton East"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold tracking-[0.2em] uppercase text-text/40 mb-1.5">
                    Crop Type
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {CROP_TYPES.map((crop) => (
                      <button
                        key={crop}
                        type="button"
                        onClick={() => setCropType(crop)}
                        className={`px-3 py-2 rounded-lg text-[13px] font-medium capitalize border transition-colors ${
                          cropType === crop
                            ? 'bg-primary/10 border-primary text-primary'
                            : 'bg-paper border-grid text-text/50 hover:border-sand'
                        }`}
                      >
                        {crop}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold tracking-[0.2em] uppercase text-text/40 mb-1.5">
                    Owner Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value)}
                    className="w-full bg-paper border border-grid rounded-lg px-4 py-2.5 text-[14px] text-text placeholder:text-text/25 focus:outline-none focus:border-primary/40 transition-colors font-mono"
                    placeholder="+1 (480) 555-0142"
                  />
                  <span className="text-[11px] text-text/30 mt-1 block">The phone number the agent will SMS</span>
                </div>
              </>
            )}

            {/* Step 2: Location & Area */}
            {step === 2 && (
              <>
                <StepLabel number={2} title="Location & Size" description="Enter coordinates and field area" />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold tracking-[0.2em] uppercase text-text/40 mb-1.5">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={lat}
                      onChange={(e) => setLat(e.target.value)}
                      className="w-full bg-paper border border-grid rounded-lg px-4 py-2.5 text-[14px] text-text placeholder:text-text/25 focus:outline-none focus:border-primary/40 transition-colors font-mono"
                      placeholder="33.4255"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold tracking-[0.2em] uppercase text-text/40 mb-1.5">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={lng}
                      onChange={(e) => setLng(e.target.value)}
                      className="w-full bg-paper border border-grid rounded-lg px-4 py-2.5 text-[14px] text-text placeholder:text-text/25 focus:outline-none focus:border-primary/40 transition-colors font-mono"
                      placeholder="-111.9400"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold tracking-[0.2em] uppercase text-text/40 mb-1.5">
                    Area (acres)
                  </label>
                  <input
                    type="number"
                    step="any"
                    min="0.1"
                    required
                    value={areaAcres}
                    onChange={(e) => setAreaAcres(e.target.value)}
                    className="w-full bg-paper border border-grid rounded-lg px-4 py-2.5 text-[14px] text-text placeholder:text-text/25 focus:outline-none focus:border-primary/40 transition-colors font-mono"
                    placeholder="120"
                  />
                </div>
              </>
            )}

            {/* Step 3: Soil */}
            {step === 3 && (
              <>
                <StepLabel number={3} title="Soil Type" description="Select the primary soil classification" />
                <div className="grid grid-cols-2 gap-2">
                  {SOIL_TYPES.map((soil) => (
                    <button
                      key={soil}
                      type="button"
                      onClick={() => setSoilType(soil)}
                      className={`px-4 py-3 rounded-lg text-[13px] font-medium border transition-colors text-left ${
                        soilType === soil
                          ? 'bg-primary/10 border-primary text-primary'
                          : 'bg-paper border-grid text-text/50 hover:border-sand'
                      }`}
                    >
                      {soil}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-grid">
            <button
              type="button"
              onClick={() => (step > 1 ? setStep(step - 1) : handleClose())}
              className="text-[13px] text-text/40 hover:text-text/60 font-medium transition-colors"
            >
              {step > 1 ? 'Back' : 'Cancel'}
            </button>

            {step < 3 ? (
              <button
                type="button"
                disabled={!canAdvance()}
                onClick={() => setStep(step + 1)}
                className="bg-primary hover:bg-primary/90 disabled:bg-primary/30 text-white text-[13px] font-semibold px-6 py-2.5 rounded-full transition-colors"
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                disabled={!canAdvance() || loading}
                className="bg-accent hover:bg-accent/90 disabled:bg-accent/30 text-white text-[13px] font-semibold px-6 py-2.5 rounded-full transition-colors"
              >
                {loading ? 'Creating...' : 'Create Field'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

function StepLabel({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3 mb-2">
      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-white text-[12px] font-bold flex items-center justify-center">
        {number}
      </span>
      <div>
        <p className="text-[14px] font-semibold text-text">{title}</p>
        <p className="text-[12px] text-text/40">{description}</p>
      </div>
    </div>
  )
}
