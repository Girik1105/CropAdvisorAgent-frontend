import { AgentResponse, Field, Session, TraceStep, Recommendation } from './types'

// --- Fields ---
export const mockFields: Field[] = [
  {
    id: 'patel-cotton-east',
    name: 'Patel Cotton East',
    crop_type: 'cotton',
    lat: 33.4255,
    lng: -111.9400,
    area_acres: 120,
    soil_type: 'Sandy loam',
    last_ndvi: 0.42,
    last_recommendation: 'Irrigate within 24h — moderate drought stress detected',
  },
  {
    id: 'mesa-citrus',
    name: 'Mesa Citrus Grove',
    crop_type: 'citrus',
    lat: 33.4152,
    lng: -111.8315,
    area_acres: 45,
    soil_type: 'Clay loam',
    last_ndvi: 0.71,
    last_recommendation: 'Monitor — healthy canopy, no action needed',
  },
  {
    id: 'chandler-alfalfa',
    name: 'Chandler Alfalfa',
    crop_type: 'alfalfa',
    lat: 33.3062,
    lng: -111.8413,
    area_acres: 200,
    soil_type: 'Silty clay',
    last_ndvi: 0.28,
    last_recommendation: 'Fertilize immediately — nitrogen deficiency detected',
  },
]

// --- Showcase trace ---
export const showcaseTrace: TraceStep[] = [
  {
    step: 1,
    tool: 'get_weather',
    input: { lat: 33.4255, lng: -111.94, field_id: 'patel-cotton-east' },
    output: {
      temp_f: 105,
      humidity_pct: 12,
      wind_mph: 8,
      precipitation_7d_in: 0,
      forecast: 'Clear skies, no rain expected for 10 days',
      uv_index: 11,
      heat_advisory: true,
    },
    duration_ms: 340,
  },
  {
    step: 2,
    tool: 'get_crop_health',
    input: { field_id: 'patel-cotton-east', satellite: 'sentinel-2' },
    output: {
      ndvi: 0.42,
      ndvi_trend: 'declining',
      stress_level: 'moderate',
      canopy_temp_f: 112,
      leaf_water_content: 'low',
      comparison_30d: -0.15,
      affected_area_pct: 68,
    },
    duration_ms: 890,
  },
  {
    step: 3,
    tool: 'get_soil_profile',
    input: { field_id: 'patel-cotton-east', depth_inches: 12 },
    output: {
      soil_type: 'Sandy loam',
      moisture_pct: 14,
      ph: 7.8,
      nitrogen_ppm: 22,
      phosphorus_ppm: 18,
      potassium_ppm: 145,
      water_holding_capacity: 'low',
      organic_matter_pct: 1.2,
    },
    duration_ms: 210,
  },
]

export const showcaseRecommendations: Recommendation[] = [
  {
    action_type: 'irrigate',
    urgency: 'immediate',
    description:
      'Your cotton is showing early drought stress. NDVI has dropped 0.15 in 30 days with 68% of the field affected. No rain in forecast. Begin center pivot irrigation within 6 hours to prevent yield loss.',
    estimated_cost: '$180',
    risk_if_delayed: 'Yield loss of 12-15% if not irrigated within 48 hours. Boll development will be compromised.',
  },
]

// --- Full showcase response ---
export const showcaseResponse: AgentResponse = {
  session_id: 'sess-001',
  response:
    "Your cotton is showing early drought stress — I'd recommend irrigating within the next 6 hours. The satellite data shows your NDVI has dropped to 0.42, and with 105\u00B0F temps and zero rain in the forecast, your field needs water. Estimated cost is about $180 for the full 120 acres via center pivot.",
  recommendations: showcaseRecommendations,
  trace: showcaseTrace,
}

// --- Sessions ---
export const mockSessions: Session[] = [
  {
    id: 'sess-001',
    field_id: 'patel-cotton-east',
    field_name: 'Patel Cotton East',
    phone_number: '+1 (480) 555-0142',
    channel: 'sms',
    message: "How's my cotton field looking?",
    recommendations: showcaseRecommendations,
    trace: showcaseTrace,
    response: showcaseResponse.response,
    created_at: '2026-04-04T09:23:00Z',
    updated_at: '2026-04-04T09:23:01Z',
    total_duration_ms: 1440,
  },
  {
    id: 'sess-002',
    field_id: 'mesa-citrus',
    field_name: 'Mesa Citrus Grove',
    phone_number: '+1 (480) 555-0198',
    channel: 'dashboard',
    message: 'Check on my citrus trees please',
    recommendations: [
      {
        action_type: 'no_action',
        urgency: 'monitor',
        description:
          'Citrus grove is in good health. NDVI at 0.71 is within normal range. Continue current irrigation schedule.',
        estimated_cost: '$0',
        risk_if_delayed: 'No immediate risk. Re-check in 5 days.',
      },
    ],
    trace: [
      {
        step: 1,
        tool: 'get_weather',
        input: { lat: 33.4152, lng: -111.8315, field_id: 'mesa-citrus' },
        output: { temp_f: 102, humidity_pct: 18, precipitation_7d_in: 0.1, forecast: 'Partly cloudy' },
        duration_ms: 280,
      },
      {
        step: 2,
        tool: 'get_crop_health',
        input: { field_id: 'mesa-citrus', satellite: 'sentinel-2' },
        output: { ndvi: 0.71, ndvi_trend: 'stable', stress_level: 'none', canopy_temp_f: 98 },
        duration_ms: 720,
      },
      {
        step: 3,
        tool: 'get_soil_profile',
        input: { field_id: 'mesa-citrus', depth_inches: 18 },
        output: { soil_type: 'Clay loam', moisture_pct: 28, ph: 6.9, nitrogen_ppm: 35 },
        duration_ms: 190,
      },
    ],
    response:
      'Your citrus grove looks great! NDVI is at 0.71, which is healthy. No action needed right now — just keep your current irrigation going.',
    created_at: '2026-04-04T08:15:00Z',
    updated_at: '2026-04-04T08:15:01Z',
    total_duration_ms: 1190,
  },
  {
    id: 'sess-003',
    field_id: 'chandler-alfalfa',
    field_name: 'Chandler Alfalfa',
    phone_number: '+1 (480) 555-0267',
    channel: 'sms',
    message: 'My alfalfa looks yellow, what should I do?',
    recommendations: [
      {
        action_type: 'fertilize',
        urgency: 'within_24h',
        description:
          'Nitrogen deficiency detected across 80% of the field. Apply 40 lbs/acre urea immediately. NDVI at 0.28 indicates severe stress.',
        estimated_cost: '$320',
        risk_if_delayed: 'Further yield decline of 20-25% per cutting cycle if untreated.',
      },
    ],
    trace: [
      {
        step: 1,
        tool: 'get_weather',
        input: { lat: 33.3062, lng: -111.8413, field_id: 'chandler-alfalfa' },
        output: { temp_f: 100, humidity_pct: 15, precipitation_7d_in: 0, forecast: 'Hot and dry' },
        duration_ms: 310,
      },
      {
        step: 2,
        tool: 'get_crop_health',
        input: { field_id: 'chandler-alfalfa', satellite: 'sentinel-2' },
        output: { ndvi: 0.28, ndvi_trend: 'declining', stress_level: 'severe', affected_area_pct: 80 },
        duration_ms: 850,
      },
      {
        step: 3,
        tool: 'get_soil_profile',
        input: { field_id: 'chandler-alfalfa', depth_inches: 12 },
        output: { soil_type: 'Silty clay', moisture_pct: 22, ph: 7.2, nitrogen_ppm: 8, phosphorus_ppm: 12 },
        duration_ms: 240,
      },
    ],
    response:
      "Your alfalfa is showing nitrogen deficiency — that's what's causing the yellowing. I'd recommend applying 40 lbs/acre of urea as soon as possible. The estimated cost is about $320 for your 200 acres.",
    created_at: '2026-04-03T16:45:00Z',
    updated_at: '2026-04-03T16:45:01Z',
    total_duration_ms: 1400,
  },
]

// --- Helper to simulate API delay ---
export function simulateDelay(ms: number = 1500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
