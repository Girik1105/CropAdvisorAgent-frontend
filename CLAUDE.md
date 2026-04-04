# CropAdvisor Agent — Frontend

## Context
Hackathon project for Innovation Hacks 2.0 (ASU, April 3–5 2026). Google Track: "Build With AI — The Agentic Frontier." Team of 3. This is the frontend repo (separate from the Django backend repo).

CropAdvisor is a Gemini-powered autonomous AI agent that farmers text via SMS. It checks weather, satellite crop health (NDVI), and soil data, then responds with a specific action + cost estimate. This frontend is the **reasoning trace dashboard** — it shows judges the agent's internal decision-making.

## Stack
- Next.js 14 (App Router)
- Tailwind CSS
- No state management library — React hooks only
- No auth — hackathon demo, no user accounts
- No localStorage/sessionStorage

## Backend API
Django REST Framework running at `http://localhost:8000/api/v1/`. Env var: `NEXT_PUBLIC_API_URL`.

The backend may not be running yet during frontend development. Build with mock data first, wire real API later. All API calls should go through a single `lib/api.ts` client — never call fetch directly in components.

### POST `/agent/message/`
Send a message to the agent, get back a recommendation + full reasoning trace.

Request: `{ phone_number: string, message: string, field_id?: string }`

Response: `{ session_id, response (natural language recommendation), recommendations[] (action_type, urgency, description, estimated_cost, risk_if_delayed), trace[] (step, tool, input, output, duration_ms) }`

action_type enum: `irrigate | fertilize | pest_alert | harvest | no_action`
urgency enum: `immediate | within_24h | within_3d | monitor`
tool names in trace: `get_weather`, `get_crop_health`, `get_soil_profile`

### GET `/agent/trace/{session_id}/`
Full reasoning trace for a session. Returns session metadata, field info, all messages (role: user/agent/tool_call/tool_result), recommendations, and total_duration_ms.

### GET `/fields/`
List registered fields. Each field has: id, name, crop_type, lat, lng, area_acres, soil_type.

### GET `/fields/{field_id}/sessions/`
List sessions for a field. Each: id, phone_number, message_count, recommendation_count, created_at.

### GET `/voice/{session_id}/`
ElevenLabs audio for a session. Returns: audio_url (mp3), duration_seconds, generated_at.

## Pages

`/` — Landing page with an interactive chat demo. User types a message, sees the agent response. This is what judges see first.

`/dashboard` — List of recent agent sessions. Each row shows field name, timestamp, recommendation summary. Click to drill into trace.

`/dashboard/[sessionId]` — The key page. Shows the agent's full reasoning trace as a vertical timeline: step 1 tool call → data returned → step 2 tool call → data returned → final recommendation. Include an audio player if voice is available.

`/fields` — Field overview. List fields with last NDVI reading color-coded, last recommendation, area.

## Key components

**TraceViewer** — Vertical timeline of agent reasoning steps. Each step shows: tool name, input params, output data (collapsible JSON), and duration. Color-code steps by tool type. This is the most important component — it proves to judges this is an agent, not a chatbot.

**RecommendationCard** — Displays action_type badge, urgency indicator (red/orange/yellow/green), cost estimate, and risk_if_delayed.

**ChatDemo** — Interactive chat for the landing page. Text input → POST to agent → show response with typing animation.

**AudioPlayer** — HTML5 audio player for ElevenLabs voice recommendations.

## Design
- Dark theme — navy/purple gradient background (matches hackathon branding)
- Technical/mission-control feel for the dashboard
- NDVI color mapping: ≥0.6 green, 0.4–0.6 amber, <0.4 red
- Monospace font for JSON data and tool I/O
- Urgency colors: immediate=red, within_24h=orange, within_3d=yellow, monitor=green
- Action badges: irrigate=blue, fertilize=emerald, pest_alert=red, harvest=amber

## Constraints
- Speed over polish — this is a 48-hour hackathon
- Keep bundle small — no heavy charting libraries, use CSS/SVG
- No external fonts beyond Tailwind defaults
- The backend WILL have CORS enabled for localhost:3000

## ElevenLabs integration (voice agent — not just TTS)
CropAdvisor has TWO interfaces to the same agent brain:
1. **SMS** via Twilio — farmer texts, gets text response
2. **Phone call** via ElevenLabs Conversational AI — farmer CALLS a number, talks to the agent live

The ElevenLabs voice agent has the same three tools (get_weather, get_crop_health, get_soil_profile) and calls the same Django backend endpoints. It's a parallel interface, not a post-processing step.

### What the dashboard shows during a live call
- Call status (ringing / in progress / ended)
- Audio waveform / who is speaking
- Real-time tool calls appearing as the agent processes voice input
- Live transcript
- Final recommendation card

This is the demo's best moment: a judge calls the number, the dashboard lights up.

### Voice persona
Warm, conversational farming advisor. Not robotic. Says things like "looks like your cotton is under some stress" not "NDVI reading 0.42 indicates moderate vegetation stress."


## Design system
See DESIGN_SYSTEM.md in this directory for the complete visual language. The philosophy is called "Topographic Intelligence" — inspired by USGS survey maps and agricultural field journals, not generic AI dashboards.

Key points:
- Warm background (#FAFAF5), not dark mode
- National Park font for headings, Outfit for body, IBM Plex Mono for data
- Forest green (#2D4A3E) primary, terra cotta (#C4704B) accent
- Subtle grid pattern underneath everything (like survey coordinates)
- Split survey layout: narrow dark phone mockup left, wide warm pipeline right
- NDVI colors map to actual vegetation health progression (green → amber → red)
- No shadows, no purple gradients, no generic card grids
