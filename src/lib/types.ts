export type ActionType = 'irrigate' | 'fertilize' | 'pest_alert' | 'harvest' | 'no_action'
export type Urgency = 'immediate' | 'within_24h' | 'within_3d' | 'monitor'
export type ToolName = 'get_weather' | 'get_crop_health' | 'get_soil_profile' | 'get_market_prices' | 'get_pest_risk' | 'get_water_usage' | 'get_growth_stage' | 'intent_classifier'

// What the trace viewer expects for each tool call step
export interface TraceStep {
  step: number
  tool: ToolName
  input: Record<string, unknown>
  output: Record<string, unknown>
  duration_ms: number
}

export interface Recommendation {
  id?: string
  action_type: ActionType
  urgency: Urgency
  description: string
  estimated_cost: string | number
  cost_breakdown?: string
  risk_if_delayed: string
  timing_rationale?: string
  implementation_steps?: string[]
  created_at?: string
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
  owner_phone?: string
  last_ndvi?: number
  last_recommendation?: string
}

// What the backend returns from /fields/<id>/sessions/
export interface SessionSummary {
  id: string
  phone_number: string
  field: string
  field_name: string
  crop_type: string
  channel: 'sms' | 'dashboard' | 'chat'
  status: 'pending' | 'processing' | 'completed' | 'failed'
  message: string | null
  recommendation_action: ActionType | null
  recommendation_urgency: Urgency | null
  tool_count: number
  created_at: string
  updated_at: string
}

// What the backend returns from /agent/trace/<id>/
export interface BackendTrace {
  session: SessionSummary
  messages: BackendMessage[]
  recommendations: Recommendation[]
}

export interface BackendMessage {
  id: string
  role: string
  content: string
  tool_name: string | null
  tool_input: Record<string, unknown> | null
  tool_output: Record<string, unknown> | null
  duration_ms: number | null
  created_at: string
}

// Merged session used by the frontend (built from trace data)
export interface Session {
  id: string
  field_id: string
  field_name: string
  phone_number: string
  channel: string
  message: string
  response: string
  recommendations: Recommendation[]
  trace: TraceStep[]
  created_at: string
  updated_at: string
  total_duration_ms: number
}

export interface CreateFieldPayload {
  name: string
  crop_type: string
  lat: number
  lng: number
  area_acres: number
  soil_type: string
  owner_phone: string
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

export interface WeatherSnapshot {
  id: string
  field: string
  temp_f: number
  temp_c: number
  humidity_pct: number
  wind_mph: number
  conditions: string
  uv_index: number | null
  precipitation_forecast: { date: string; precip_in: number; prob_pct: number }[]
  created_at: string
}

export interface CropHealthRecord {
  id: string
  field: string
  ndvi_score: number
  stress_level: string
  vegetation_trend: string
  vegetation_fraction: number
  last_satellite_date: string | null
  created_at: string
}

export interface SoilProfile {
  id: string
  field: string
  soil_type: string
  ph: number
  organic_matter_pct: number
  drainage_class: string
  water_holding_capacity: string
  available_water_in_per_ft: number
  updated_at: string
}
