import { AgentResponse, BackendTrace, BackendMessage, CreateFieldPayload, Field, Session, SessionSummary, TraceStep, VoiceData, WeatherSnapshot, CropHealthRecord, SoilProfile } from './types'
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

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    const msg = body
      ? Object.entries(body).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join('; ')
      : `API error: ${res.status}`
    throw new Error(msg)
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

// Transform backend messages into TraceStep[] for the trace viewer
function messagesToTraceSteps(messages: BackendMessage[]): TraceStep[] {
  return messages
    .filter((m) => m.tool_name && m.tool_input && m.tool_output)
    .map((m, i) => ({
      step: i + 1,
      tool: m.tool_name as TraceStep['tool'],
      input: m.tool_input || {},
      output: m.tool_output || {},
      duration_ms: m.duration_ms || 0,
    }))
}

// Transform backend trace response into a frontend Session
function traceToSession(trace: BackendTrace): Session {
  const messages = trace.messages || []
  const userMsg = messages.find((m) => m.role === 'user')
  const agentMsgs = messages.filter((m) => m.role === 'agent' || m.role === 'final_response')
  const lastAgentMsg = agentMsgs.length > 0 ? agentMsgs[agentMsgs.length - 1] : null

  return {
    id: trace.session.id,
    field_id: trace.session.field,
    field_name: trace.session.field_name,
    phone_number: trace.session.phone_number,
    channel: trace.session.channel,
    message: userMsg?.content || '',
    response: lastAgentMsg?.content || '',
    recommendations: trace.recommendations || [],
    trace: messagesToTraceSteps(messages),
    created_at: trace.session.created_at,
    updated_at: trace.session.updated_at,
    total_duration_ms: 0,
  }
}

export const api = {
  /** Kick off a health check — returns immediately with session_id. Poll with getHealthCheckStatus. */
  startHealthCheck: async (body: {
    message: string
    field_id?: string
  }): Promise<{ session_id: string; status: string }> => {
    return request<{ session_id: string; status: string }>('/agent/message/', {
      method: 'POST',
      body: JSON.stringify(body),
    })
  },

  /** Poll health check status. Returns status + result when completed. */
  getHealthCheckStatus: async (sessionId: string): Promise<{
    session_id: string
    status: 'processing' | 'completed' | 'failed'
    result?: { session_id: string; response: string; recommendation: Record<string, unknown>; total_duration_ms: number }
    error?: string
  }> => {
    return request(`/agent/status/${sessionId}/`)
  },

  getTrace: async (sessionId: string): Promise<Session | null> => {
    if (USE_MOCK) {
      await simulateDelay(400)
      return mockSessions.find((s) => s.id === sessionId) || null
    }
    try {
      const raw = await request<BackendTrace>(`/agent/trace/${sessionId}/`)
      return traceToSession(raw)
    } catch {
      return null
    }
  },

  getTraceSteps: async (sessionId: string): Promise<TraceStep[]> => {
    if (USE_MOCK) {
      await simulateDelay(400)
      const session = mockSessions.find((s) => s.id === sessionId)
      return session?.trace || []
    }
    try {
      const raw = await request<BackendTrace>(`/agent/trace/${sessionId}/`)
      return messagesToTraceSteps(raw.messages || [])
    } catch {
      return []
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

  createField: async (data: CreateFieldPayload): Promise<Field> => {
    return request<Field>('/fields/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  deleteField: async (fieldId: string): Promise<void> => {
    await request<void>(`/fields/${fieldId}/`, { method: 'DELETE' })
  },

  getFieldSessions: async (fieldId: string): Promise<SessionSummary[]> => {
    if (USE_MOCK) {
      await simulateDelay(400)
      return mockSessions.filter((s) => s.field_id === fieldId).map(s => ({
        id: s.id,
        phone_number: s.phone_number,
        field: s.field_id,
        field_name: s.field_name,
        crop_type: '',
        channel: s.channel as 'sms' | 'dashboard',
        status: 'completed' as const,
        message: null,
        recommendation_action: null,
        recommendation_urgency: null,
        tool_count: 0,
        created_at: s.created_at,
        updated_at: s.created_at,
      }))
    }
    try {
      return await request<SessionSummary[]>(`/fields/${fieldId}/sessions/`)
    } catch {
      return []
    }
  },

  // Fetch full session data (with trace) for a session summary
  enrichSession: async (summary: SessionSummary): Promise<Session | null> => {
    try {
      const raw = await request<BackendTrace>(`/agent/trace/${summary.id}/`)
      return traceToSession(raw)
    } catch {
      // Return a minimal session if trace fetch fails
      return {
        id: summary.id,
        field_id: summary.field,
        field_name: summary.field_name,
        phone_number: summary.phone_number,
        channel: summary.channel,
        message: '',
        response: '',
        recommendations: [],
        trace: [],
        created_at: summary.created_at,
        updated_at: summary.updated_at,
        total_duration_ms: 0,
      }
    }
  },

  chatWithAgent: async (body: {
    message: string
    field_id?: string
  }): Promise<{ session_id: string; response: string }> => {
    return request<{ session_id: string; response: string }>('/agent/chat/', {
      method: 'POST',
      body: JSON.stringify(body),
    })
  },

  getChatHistory: async (fieldId: string): Promise<{ id: string; role: string; content: string; created_at: string }[]> => {
    try {
      const res = await request<{ messages: { id: string; role: string; content: string; created_at: string }[] }>(`/agent/chat/?field_id=${fieldId}`)
      return res.messages
    } catch {
      return []
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
