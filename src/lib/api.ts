import { AgentResponse, Field, Session, VoiceData } from './types'
import { mockFields, mockSessions, showcaseResponse, simulateDelay } from './mock-data'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
const USE_MOCK = true

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
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
    return request<AgentResponse>('/agent/message/', {
      method: 'POST',
      body: JSON.stringify(body),
    })
  },

  getTrace: async (sessionId: string): Promise<Session | null> => {
    if (USE_MOCK) {
      await simulateDelay(400)
      return mockSessions.find((s) => s.id === sessionId) || null
    }
    return request<Session>(`/agent/trace/${sessionId}/`)
  },

  getFields: async (): Promise<Field[]> => {
    if (USE_MOCK) {
      await simulateDelay(300)
      return mockFields
    }
    return request<Field[]>('/fields/')
  },

  getFieldSessions: async (fieldId: string): Promise<Session[]> => {
    if (USE_MOCK) {
      await simulateDelay(400)
      return mockSessions.filter((s) => s.field_id === fieldId)
    }
    return request<Session[]>(`/fields/${fieldId}/sessions/`)
  },

  getSessions: async (): Promise<Session[]> => {
    if (USE_MOCK) {
      await simulateDelay(400)
      return mockSessions
    }
    return request<Session[]>('/agent/sessions/')
  },

  getVoiceAudio: async (sessionId: string): Promise<VoiceData | null> => {
    if (USE_MOCK) {
      return null
    }
    return request<VoiceData>(`/voice/${sessionId}/`)
  },
}
