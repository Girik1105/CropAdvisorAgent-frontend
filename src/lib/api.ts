import { AgentResponse, Field, Session, TraceStep, VoiceData } from './types'
import { mockFields, mockSessions, showcaseResponse, simulateDelay } from './mock-data'
import { API_URL } from './env'

const USE_MOCK = false

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
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
}
