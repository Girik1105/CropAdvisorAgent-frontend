# CropAdvisor Agent — Frontend

Reasoning trace dashboard and management interface for the CropAdvisor autonomous farming agent. Built with Next.js 14 for Innovation Hacks 2.0 (Google Track: "Build With AI — The Agentic Frontier").

**Backend:** [CropAdvisorAgent-backend](https://github.com/Girik1105/CropAdvisorAgent-backend)

This isn't a generic data dashboard — it's a window into an AI agent's decision-making. Every health report shows exactly which tools the agent called, what data it gathered, how it reasoned, and why it recommended a specific action with a cost estimate.

## Features

### Home (Fields Management)
- Interactive **satellite map** (Leaflet + Esri imagery) with NDVI-colored field markers
- Field cards with live weather, crop health (NDVI bar), and soil profile data
- Add/delete fields with a 3-step creation wizard (crop type, GPS coordinates, soil type)
- Quick links to latest health report and full session history per field

### Health Reports
- **Full diagnostic scans** — select a field, run a health check, agent calls 7 real data tools
- Animated loading experience showing progress through each scan step (weather, NDVI, soil, market, pest, water, growth stage)
- Session cards with message preview, recommendation badge, urgency indicator, and tool count
- Filter by field, grouped display with completion stats

### Session Detail (Reasoning Trace)
- **Agent reasoning trace** — vertical timeline showing every tool call the agent made
- Per-tool visualization: weather metrics, NDVI bar, soil composition, market prices, pest risk assessment, water budget, growth stage
- Data source badges (USDA SSURGO, NASA POWER, USDA NASS, OpenWeatherMap)
- Collapsible raw JSON for each tool's input/output
- Full agent response and structured recommendation card (action type, urgency, cost, risk, implementation steps)

### Ask Agent (Chat)
- Lightweight Q&A interface — single Gemini call using existing field data, no full tool pipeline
- Chat history (last 10 messages per field)
- Markdown rendering for agent responses
- Suggested question chips for quick interaction

### Authentication
- JWT-based auth (login, signup with phone number)
- Demo account with pre-populated data for judges to explore
- Protected dashboard routes with automatic redirect

## Quick Start

```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Set environment variables
cp .env.local.example .env.local
# Edit .env.local with your backend URL

# 3. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

For production (Netlify), set this to your deployed backend URL.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Map | Leaflet + Esri Satellite imagery |
| Markdown | react-markdown + remark-gfm |
| Auth | JWT (access + refresh tokens in localStorage) |
| Deployment | Netlify (@netlify/plugin-nextjs) |

## Project Structure

```
src/
├── app/
│   ├── (public)/              # Landing page, login, signup (Navbar + Footer layout)
│   │   ├── page.tsx           # Landing — hero, features, how it works
│   │   ├── login/page.tsx     # Sign in with demo credentials
│   │   ├── signup/page.tsx    # Registration with phone number
│   │   ├── demo/page.tsx      # Static demo page
│   │   ├── sessions/page.tsx  # Public mock sessions
│   │   └── fields/page.tsx    # Public mock fields
│   └── dashboard/             # Protected dashboard (Sidebar layout)
│       ├── fields/page.tsx    # Home — map, field cards, environmental data
│       ├── sessions/page.tsx  # Health Reports — run scans, view history
│       ├── [sessionId]/page.tsx # Session detail — reasoning trace
│       └── ask/page.tsx       # Ask Agent — lightweight chat
├── components/
│   ├── dashboard/
│   │   ├── FarmMap.tsx        # Leaflet satellite map with NDVI markers
│   │   ├── SendMessageForm.tsx # Health check form with animated loading
│   │   └── AddFieldModal.tsx  # 3-step field creation wizard
│   ├── trace/
│   │   ├── TraceViewer.tsx    # Reasoning trace timeline
│   │   └── TraceStep.tsx      # Per-tool visualization (7 tool types)
│   ├── recommendation/
│   │   └── RecommendationCard.tsx # Action + urgency + cost card
│   ├── fields/
│   │   ├── FieldCard.tsx      # Expandable field card with tabs
│   │   └── NDVIBar.tsx        # Color-coded NDVI health bar
│   ├── layout/
│   │   ├── Navbar.tsx         # Public page navbar
│   │   └── Footer.tsx         # Public page footer
│   └── AuthProvider.tsx       # Auth context provider
├── lib/
│   ├── api.ts                 # API client (all backend calls)
│   ├── auth.ts                # JWT auth helpers (login, signup, refresh)
│   └── types.ts               # TypeScript types for all data models
└── hooks/
    └── useRequireAuth.ts      # Auth guard hook for dashboard
```

## Design System

"Topographic Intelligence" — inspired by USGS survey maps and agricultural field journals.

- **Background:** Warm off-white (#FAFAF5), not dark mode
- **Primary:** Forest green (#2D4A3E)
- **Accent:** Terra cotta (#C4704B)
- **Typography:** National Park (headings), Outfit (body), IBM Plex Mono (data)
- **NDVI colors:** Peak green → Healthy → Moderate amber → Stress → Severe red
- **Urgency:** Immediate (red), Within 24h (orange), Within 3 days (yellow), Monitor (green)
- **Action badges:** Irrigate (blue), Fertilize (emerald), Pest Alert (red), Harvest (amber)

## APIs Consumed (via Backend)

| Data Source | API | Type |
|------------|-----|------|
| Weather | OpenWeatherMap | Live |
| Soil Profile | USDA SSURGO | Real (by GPS) |
| Water Budget | NASA POWER + FAO Penman-Monteith | Satellite |
| Market Prices | USDA NASS QuickStats | Real |
| Crop Health | USGS/Landsat NDVI | Pre-fetched |
| Pest Risk | Rule engine + live weather | Computed |
| Growth Stage | Crop calendar | Static |

## Deployment (Netlify)

The project includes `netlify.toml` pre-configured for Next.js deployment.

1. Push to GitHub
2. Connect repo in Netlify
3. Set environment variable: `NEXT_PUBLIC_API_URL` = your backend URL
4. Deploy

## Demo Account

- **Username:** `demo_farmer`
- **Password:** `demo1234!`

Pre-populated with 3 Arizona fields (cotton, citrus, alfalfa), live weather data, USDA soil profiles, and completed health reports.
