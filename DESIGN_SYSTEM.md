# Topographic Intelligence — Design System

## Design philosophy
CropAdvisor's visual language is drawn from USGS topographic surveys, agricultural field journals, and scientific cartography. It carries the authority of a government survey map and the warmth of Arizona clay.

## Fonts (Google Fonts)
- **Display/headings:** National Park (or fallback: Outfit Bold) — evokes USGS cartographic lettering
- **Body:** Outfit — clean, warm, contemporary. Feels like field notes.
- **Data/mono:** IBM Plex Mono — weather station readouts, API data, tool calls
- **Editorial accent:** Instrument Serif Italic — taglines, pull quotes

## Color palette
| Token | Hex | Usage |
|-------|-----|-------|
| bg | #FAFAF5 | Background — aged paper white |
| primary | #2D4A3E | Forest green — primary, nav, headings |
| accent | #C4704B | Terra cotta — accents, highlights, Arizona soil |
| healthy | #5B7C6B | Sage — healthy NDVI, positive states |
| stress | #D4915E | Warm amber — moderate stress, warnings |
| critical | #B85C3E | Burnt sienna — severe stress, critical |
| text | #2C2C28 | Charcoal — body text |
| grid | #E5E2D8 | Warm gray — grid lines, borders, structure |
| paper | #F5F3EC | Surface cards, elevated elements |
| sand | #D9D3C4 | Muted labels, secondary text |

## NDVI color mapping
- 0.8–1.0: #3B6D11 (deep green) — peak health
- 0.6–0.8: #5B7C6B (sage) — healthy
- 0.4–0.6: #D4915E (warm amber) — moderate stress
- 0.2–0.4: #C4704B (terra cotta) — high stress
- 0.0–0.2: #B85C3E (burnt sienna) — severe

## Design principles
1. Space is terrain, not empty pixels
2. Color encodes vegetation health, not decoration
3. Text is sparse — if a visual can say it, remove the word
4. A subtle grid underlies everything (survey coordinates)
5. Motion is a needle settling, not a bounce
6. Two worlds, one screen: human experience + machine intelligence

## Layout: split survey
- Left (narrow, dark): phone mockup showing SMS conversation — the farmer's world
- Right (wide, warm paper): agent pipeline — what the agent sensed, computed, decided
- Asymmetric — human side is intimate, instrument side is open
- Subtle grid lines visible underneath everything

## Component styling
- Cards: #F5F3EC background, 0.5px #E5E2D8 border, 4px radius
- Tool call badges: colored left border (blue=weather, amber=crop, gray=soil, green=decision)
- Data readouts: IBM Plex Mono, sage green color
- Recommendation card: light green background, forest green border
- Audio player: terra cotta accent, minimal waveform bars
- No drop shadows, no gradients except the NDVI health bar
- Contour line decorative pattern in background (SVG, very subtle)

## What this is NOT
- Not a dark-mode dev dashboard
- Not purple/blue AI gradient aesthetic
- Not cards-in-a-grid generic layout
- Not Inter/Roboto/system font safe choices
