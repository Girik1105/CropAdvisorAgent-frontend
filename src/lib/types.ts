export type ActionType = 'irrigate' | 'fertilize' | 'pest_alert' | 'harvest' | 'no_action'
export type Urgency = 'immediate' | 'within_24h' | 'within_3d' | 'monitor'
export type ToolName = 'get_weather' | 'get_crop_health' | 'get_soil_profile'

export interface TraceStep {
  step: number
  tool: ToolName
  input: Record<string, unknown>
  output: Record<string, unknown>
  duration_ms: number
}

export interface Recommendation {
  action_type: ActionType
  urgency: Urgency
  description: string
  estimated_cost: string
  risk_if_delayed: string
}

export interface AgentResponse {
  session_id: string
  response: string
  recommendations: Recommendation[]
  trace: TraceStep[]
}

export interface Field {
  id: string
  name: string
  crop_type: string
  lat: number
  lng: number
  area_acres: number
  soil_type: string
  last_ndvi?: number
  last_recommendation?: string
}

export interface Session {
  id: string
  field_id: string
  field_name: string
  phone_number: string
  message: string
  message_count: number
  recommendation_count: number
  recommendations: Recommendation[]
  trace: TraceStep[]
  response: string
  created_at: string
  total_duration_ms: number
}

export interface VoiceData {
  audio_url: string
  duration_seconds: number
  generated_at: string
}

export interface Message {
  id: string
  role: 'user' | 'agent'
  content: string
}
