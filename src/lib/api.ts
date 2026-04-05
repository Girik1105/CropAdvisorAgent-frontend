import { AgentResponse, Field, Session, TraceStep, VoiceData, WeatherSnapshot, CropHealthRecord, SoilProfile } from './types'
import { mockFields, mockSessions, showcaseResponse, simulateDelay } from './mock-data'
import { API_URL } from './env'
import { getAccessToken, refreshAccessToken, clearTokens } from './auth'

const USE_MOCK = false

async function request<T>(path: string, options?: RequestInit, retry = true): Promise<T> {
  const token = getAccessToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { ...headers, ...(options?.headers as Record<string, string>) },
  })

  if (res.status === 401 && retry) {
    const refreshed = await refreshAccessToken()
    if (refreshed) return request<T>(path, options, false)
    clearTokens()
    if (typeof window !== 'undefined') window.location.href = '/login'
    throw new Error('Session expired')
  }

  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export const api = {
  sendMessage: async (body: {
    phone_number: string
    message: string
    field_id?: string
  }): Promise<AgentResponse> => {
    if (USE_MOCK) {
      await simulateDelay(1800)
      return { ...showcaseResponse, session_id: `sess-${Date.now()}` }
    }
    try {
      const raw = await request<{
        session_id: string
        response: string
        recommendation: {
          action_type: string
          urgency: string
          description: string
          estimated_cost: string
          risk_if_delayed: string
        }
        total_duration_ms: number
      }>('/agent/run/', {
        method: 'POST',
        body: JSON.stringify(body),
      })
      return {
        session_id: raw.session_id,
        response: raw.response,
        recommendations: raw.recommendation
          ? [raw.recommendation as AgentResponse['recommendations'][0]]
          : [],
        trace: [], // trace fetched separately via getTraceSteps
      }
    } catch {
      await simulateDelay(1800)
      return { ...showcaseResponse, session_id: `sess-${Date.now()}` }
    }
  },

  getTraceSteps: async (sessionId: string): Promise<TraceStep[]> => {
    if (USE_MOCK) {
      await simulateDelay(400)
      const session = mockSessions.find((s) => s.id === sessionId)
      return session?.trace || []
    }
    try {
      return await request<TraceStep[]>(`/agent/trace/${sessionId}/`)
    } catch {
      return []
    }
  },

  getTrace: async (sessionId: string): Promise<Session | null> => {
    if (USE_MOCK) {
      await simulateDelay(400)
      return mockSessions.find((s) => s.id === sessionId) || null
    }
    try {
      return await request<Session>(`/agent/trace/${sessionId}/`)
    } catch {
      await simulateDelay(400)
      return mockSessions.find((s) => s.id === sessionId) || null
    }
  },

  getFields: async (): Promise<Field[]> => {
    if (USE_MOCK) {
      await simulateDelay(300)
      return mockFields
    }
    try {
      return await request<Field[]>('/fields/')
    } catch {
      await simulateDelay(300)
      return mockFields
    }
  },

  getFieldSessions: async (fieldId: string): Promise<Session[]> => {
    if (USE_MOCK) {
      await simulateDelay(400)
      return mockSessions.filter((s) => s.field_id === fieldId)
    }
    try {
      return await request<Session[]>(`/fields/${fieldId}/sessions/`)
    } catch {
      await simulateDelay(400)
      return mockSessions.filter((s) => s.field_id === fieldId)
    }
  },

  getSessions: async (): Promise<Session[]> => {
    if (USE_MOCK) {
      await simulateDelay(400)
      return mockSessions
    }
    try {
      return await request<Session[]>('/agent/sessions/')
    } catch {
      await simulateDelay(400)
      return mockSessions
    }
  },

  getVoiceAudio: async (sessionId: string): Promise<VoiceData | null> => {
    if (USE_MOCK) {
      return null
    }
    try {
      return await request<VoiceData>(`/voice/${sessionId}/`)
    } catch {
      return null
    }
  },

  getFieldWeather: async (fieldId: string): Promise<WeatherSnapshot[]> => {
    try {
      return await request<WeatherSnapshot[]>(`/fields/${fieldId}/weather/`)
    } catch {
      return []
    }
  },

  getFieldCropHealth: async (fieldId: string): Promise<CropHealthRecord[]> => {
    try {
      return await request<CropHealthRecord[]>(`/fields/${fieldId}/crop-health/`)
    } catch {
      return []
    }
  },

  getFieldSoil: async (fieldId: string): Promise<SoilProfile | null> => {
    try {
      return await request<SoilProfile>(`/fields/${fieldId}/soil/`)
    } catch {
      return null
    }
  },
}
