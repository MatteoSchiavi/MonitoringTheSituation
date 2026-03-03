# ULTIMATE PROMPT FOR AI CODING ASSISTANT

Copy and paste this entire prompt to another AI (like Claude, GPT-4, or Cursor) to build the complete production system:

---

## PROJECT BRIEF

Build a high-performance, real-time tactical dashboard called "COMMAND CENTER" for permanent display on touchscreens and mobile devices. This is a personal intelligence hub that aggregates world news, stock markets, Formula 1 racing data, weather, home automation, and AI-powered insights.

## DESIGN PHILOSOPHY

**Theme**: Industrial/Tactical/Military Command Center
- Dark theme with high contrast (zinc-950 background, emerald-500 accents)
- Monospace fonts (JetBrains Mono, Consolas)
- Sharp corners, no rounded edges
- Border-based separation
- Minimal shadows
- Status indicators and live data pulsing
- Wide letter-spacing for headers
- Data-dense but organized

**User Experience**:
- At-a-glance intelligence (no scrolling needed for overview)
- Auto-refreshing widgets (configurable intervals)
- One-tap access to detailed views
- Responsive: works on 1080p+ displays and mobile
- Offline-capable (PWA)
- Fast load times (<3s initial, <1s navigation)

## TECHNICAL STACK

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite or Next.js 14+
- **Styling**: Tailwind CSS
- **State**: React Query + Context API
- **Routing**: React Router or Next.js App Router
- **Charts**: Recharts
- **Animations**: Framer Motion (subtle, purposeful)
- **Icons**: Lucide React

### Backend (Optional API Gateway)
- **Runtime**: Node.js 18+ with Express OR Next.js API routes
- **Database**: PostgreSQL for user prefs
- **Cache**: Redis for API responses
- **Jobs**: Bull Queue for scheduled fetches

### Infrastructure
- **Primary**: Docker containers
- **Touch Display**: Raspberry Pi 4 with Chromium kiosk mode
- **Cloud**: Vercel/Netlify for mobile access
- **PWA**: Service Worker + manifest.json

## CORE FEATURES & WIDGETS

### 1. Overview Dashboard (Default View)
**Layout**: Grid with multiple widgets visible simultaneously

**Widgets**:
- **Market Ticker**: Real-time stock prices (3-5 key stocks), % change, color-coded
- **News Feed**: 5-10 latest headlines, scrolling or paginated, source + timestamp
- **Weather**: Current conditions + 24hr forecast, location-based
- **F1 Status**: Live race data when active, next race countdown when not
- **Home Control**: Key metrics from Home Assistant (temp, devices, security)
- **Time/Date**: Prominent display with timezone

### 2. Markets View (Detailed)
- Stock watchlist (customizable symbols)
- Real-time price updates (WebSocket if available)
- Candlestick charts (intraday)
- Market news filtered by symbols
- Indices: S&P 500, NASDAQ, DOW
- Crypto tickers (BTC, ETH)
- Commodities: Gold, Oil

### 3. Intel Feed (News Detail)
- Multi-category tabs: Tech, Business, Sports, General
- Keyword filtering
- Source filtering (select trusted sources)
- Article preview/summary
- Full-screen article reader
- "Read later" queue

### 4. F1 Live Dashboard (When Race Active)
- **Live Timing**: Driver positions, gaps, lap times
- **Telemetry**: Speed, gear, DRS status for top 3
- **Mini Map**: Circuit outline with car positions
- **Pit Stops**: Stop count, tire compounds
- **Race Control**: Live messages, flags
- **Weather**: Track temp, air temp, chance of rain
- **Driver Radio**: Recent team communications (if available)

### 5. Home Assistant Integration
- **Climate**: Temperature, humidity, HVAC controls
- **Lights**: Status and controls for key rooms
- **Security**: Alarm status, door/window sensors, cameras
- **Energy**: Power usage, solar production (if applicable)
- **Scenes**: Quick actions (Movie Mode, Away Mode, etc.)
- **Devices**: Status grid of all connected devices

### 6. AI Assistant (Claude)
- **Context-Aware**: Has access to all current dashboard data
- **Use Cases**:
  - "Summarize today's market movement"
  - "What's happening with Tesla stock?"
  - "Any important news I should know about?"
  - "When's the next F1 race?"
  - "Set my home to away mode"
- **Interface**: Chat sidebar or modal
- **History**: Persist conversation
- **Quick Actions**: Button shortcuts for common queries

### 7. Interest-Based Widgets (Personalization)
Based on user interests, show:

**Surfing**:
- Spot-specific wave forecast (height, period, direction)
- Wind conditions
- Tide times
- Surf quality rating
- Webcam links

**Skiing**:
- Resort snow depth
- 24hr/48hr snowfall
- Temperature
- Grooming reports
- Lift status

**Motors** (Cars/Motorcycles):
- Auto news feed
- New model releases
- Recall alerts
- Gas prices
- Upcoming auto shows

**Add more based on user-defined interests**

### 8. Settings & Preferences
- **Widget Selection**: Drag-and-drop to enable/disable/reorder
- **Refresh Intervals**: Per-widget configuration
- **Locations**: Home, work, surf spot, ski resort
- **Interests**: Toggle categories
- **API Keys**: Secure input for user's own keys
- **Theme**: Dark (default), OLED black, custom colors
- **Display**: Fullscreen mode, always-on, brightness

## API INTEGRATION REQUIREMENTS

### News
**Primary**: NewsAPI.org
- Endpoint: `/v2/top-headlines`
- Params: `country`, `category`, `pageSize`
- Free tier: 100 req/day (dev only)

**Backup**: NewsData.io or TheNewsAPI.com

**Implementation**:
- Fetch every 5-10 minutes
- Cache responses
- Handle rate limits gracefully
- Show "demo mode" if API unavailable

### Stocks
**Primary**: Alpha Vantage
- Global Quote: `/query?function=GLOBAL_QUOTE&symbol=IBM`
- Intraday: `/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min`
- Free tier: 25 req/day, 5 calls/min

**Backup**: Finnhub or Financial Modeling Prep

**Implementation**:
- Batch requests for multiple symbols
- Cache for 1 minute
- WebSocket upgrade if available
- Color-code gains/losses

### Formula 1
**Use**: OpenF1 (https://api.openf1.org/v1)
- Free, unlimited, well-documented

**Key Endpoints**:
- `/sessions` - Get latest/upcoming races
- `/position` - Live driver positions
- `/car_data` - Telemetry (speed, gear, DRS, etc.)
- `/laps` - Lap times, sectors
- `/pit` - Pit stop data
- `/team_radio` - Radio messages
- `/weather` - Track conditions

**Implementation**:
- Poll every 5 seconds during race
- Show "next race" countdown when not racing
- Historical data for testing

### Weather
**Use**: Open-Meteo (https://api.open-meteo.com/v1/forecast)
- Free, unlimited, no API key needed
- Global coverage

**Params**:
- `latitude`, `longitude`
- `current=temperature_2m,wind_speed_10m,weather_code`
- `hourly=temperature_2m,precipitation_probability`

**Implementation**:
- Update every 30 minutes
- Use device location or user-configured

### Marine Weather (Surfing)
**Use**: Open-Meteo Marine API (https://marine-api.open-meteo.com/v1/marine)
- Free, unlimited

**Params**:
- `latitude`, `longitude`
- `hourly=wave_height,wave_direction,wave_period`

**Implementation**:
- Calculate surf quality score
- Show optimal surf windows

### Home Assistant
**Use**: REST API (http://YOUR_IP:8123/api)
- Requires long-lived access token
- WebSocket API for real-time updates

**Endpoints**:
- `/states` - Get all entity states
- `/services/{domain}/{service}` - Call service (turn on light, etc.)

**Implementation**:
- User provides Home Assistant URL + token
- WebSocket for live updates
- Fallback to polling if WebSocket fails
- Group entities by room/type

### AI Assistant
**Use**: Anthropic Claude API (https://api.anthropic.com/v1/messages)
- Model: `claude-sonnet-4-5-20250929`

**Implementation**:
- Build context from current dashboard state
- Example context: "Market summary: AAPL $175 (+2.3%), TSLA $245 (-0.5%). Top news: [headlines]. User asks: What should I know?"
- Stream responses for better UX
- Persist conversation history (local storage)

## CRITICAL IMPLEMENTATION DETAILS

### Rate Limiting & Caching
```typescript
class APICache {
  private cache: Map<string, { data: any, timestamp: number, ttl: number }>;
  
  async fetch(key: string, fetcher: () => Promise<any>, ttl: number) {
    const cached = this.cache.get(key);
    const now = Date.now();
    
    if (cached && (now - cached.timestamp) < cached.ttl) {
      return cached.data;
    }
    
    const data = await fetcher();
    this.cache.set(key, { data, timestamp: now, ttl });
    return data;
  }
}
```

### Error Handling
- Network failures: Show last cached data + error banner
- API rate limits: Automatic backoff, show "rate limited" message
- Invalid API keys: Clear setup instructions
- Missing data: Graceful degradation (hide widget or show placeholder)

### Performance
- Lazy load non-visible widgets
- Virtual scrolling for long lists
- Debounce user inputs
- Optimize re-renders (React.memo, useMemo)
- Image optimization (WebP, lazy loading)

### Security
- Never expose API keys in client code
- If using backend, proxy all API requests
- Sanitize user inputs
- HTTPS only in production
- CORS configuration
- Rate limit backend endpoints

### Progressive Web App
```json
// manifest.json
{
  "name": "Command Center",
  "short_name": "Command",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#09090b",
  "theme_color": "#10b981",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

### Service Worker (for offline)
```typescript
// Cache critical assets
const CACHE_NAME = 'command-center-v1';
const urlsToCache = ['/', '/index.html', '/bundle.js', '/styles.css'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
```

## FILE STRUCTURE

```
command-center/
├── public/
│   ├── manifest.json
│   ├── icons/
│   └── service-worker.js
├── src/
│   ├── components/
│   │   ├── widgets/
│   │   │   ├── NewsWidget.tsx
│   │   │   ├── StockWidget.tsx
│   │   │   ├── F1Widget.tsx
│   │   │   ├── WeatherWidget.tsx
│   │   │   ├── HomeWidget.tsx
│   │   │   └── AIAssistant.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── StatusBar.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       └── Chart.tsx
│   ├── hooks/
│   │   ├── useNews.ts
│   │   ├── useStocks.ts
│   │   ├── useF1.ts
│   │   ├── useWeather.ts
│   │   └── useHomeAssistant.ts
│   ├── lib/
│   │   ├── api/
│   │   │   ├── news.ts
│   │   │   ├── stocks.ts
│   │   │   ├── f1.ts
│   │   │   ├── weather.ts
│   │   │   └── homeassistant.ts
│   │   ├── cache.ts
│   │   ├── rateLimiter.ts
│   │   └── utils.ts
│   ├── types/
│   │   ├── news.ts
│   │   ├── stocks.ts
│   │   └── f1.ts
│   ├── App.tsx
│   └── main.tsx
├── .env.example
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

## DEPLOYMENT INSTRUCTIONS

### Raspberry Pi (Touch Display)
1. Install Raspberry Pi OS Lite
2. Install Node.js 18+
3. Clone repo and run `npm install && npm run build`
4. Setup systemd service for auto-start
5. Configure Chromium in kiosk mode
6. Point to `http://localhost:3000`

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Cloud (Vercel/Netlify)
- Push to GitHub
- Connect repository
- Set environment variables
- Auto-deploy on push

## TESTING REQUIREMENTS

- Unit tests for API functions
- Integration tests for widgets
- E2E tests for critical flows
- Responsive design testing (mobile, tablet, desktop)
- Performance testing (Lighthouse score >90)
- Accessibility (WCAG AA)

## DOCUMENTATION TO INCLUDE

1. **README.md**: Setup instructions, features, screenshots
2. **API_KEYS.md**: How to obtain each API key
3. **DEPLOYMENT.md**: Step-by-step deployment guides
4. **CUSTOMIZATION.md**: How to add new widgets, modify theme
5. **TROUBLESHOOTING.md**: Common issues and solutions

## DELIVERABLES

1. Complete React application (production-ready)
2. Docker deployment configuration
3. Raspberry Pi setup script
4. Comprehensive documentation
5. Demo video or screenshots
6. Environment variable template (.env.example)

## CONSTRAINTS & REQUIREMENTS

- **Performance**: <3s initial load, <1s navigation
- **Reliability**: Handle API failures gracefully
- **Security**: No exposed secrets
- **Scalability**: Support 100+ widgets without performance degradation
- **Maintainability**: Clean code, TypeScript types, comments
- **Accessibility**: Keyboard navigation, screen reader support

## BONUS FEATURES (If Time Permits)

- Voice commands (Web Speech API)
- Multi-user support with authentication
- Shared family dashboard
- Widget marketplace (import/export)
- Webhook integrations (IFTTT, Zapier)
- Notification system (browser push)
- Data export (CSV, JSON)
- Themes: Light mode, custom color schemes
- Localization (i18n)

## SUCCESS CRITERIA

✅ All widgets functional with real data
✅ Responsive on mobile and desktop
✅ Sub-3-second load time
✅ Smooth animations (60fps)
✅ No console errors
✅ Proper error handling
✅ Documentation complete
✅ Deploy successfully to at least one platform

---

## FINAL NOTES

This is a **personal command center** - prioritize features the user will actually use daily. The goal is at-a-glance intelligence, not information overload. Keep the design bold and masculine (industrial theme), but ensure usability.

Start with core features (news, stocks, weather) and progressively add complexity. Test on real hardware (Raspberry Pi + touchscreen) as early as possible.

Good luck! Build something epic. 🚀
