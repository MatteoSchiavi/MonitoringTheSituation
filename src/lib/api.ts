import axios from 'axios';

// ─── News ───
export async function fetchTopHeadlines(sources: string = 'cnn,bbc-news,reuters,associated-press,the-wall-street-journal', pageSize: number = 15) {
    try {
        const { data } = await axios.get('/api/news/top-headlines', {
            params: { sources, pageSize }
        });
        return data.articles || [];
    } catch (error) {
        console.error('Error fetching top headlines:', error);
        return [];
    }
}

export async function fetchNewsByCategory(category: string, pageSize: number = 10) {
    try {
        const { data } = await axios.get('/api/news/top-headlines', {
            params: { category, language: 'en', pageSize }
        });
        return data.articles || [];
    } catch (error) {
        console.error(`Error fetching news for category ${category}:`, error);
        return [];
    }
}

export async function fetchNewsByQuery(query: string, pageSize: number = 10) {
    const { data } = await axios.get('/api/news/everything', {
        params: { q: query, sortBy: 'publishedAt', language: 'en', pageSize }
    });
    return data.articles || [];
}

// ─── Stocks (Finnhub) ───
export async function fetchStockQuote(symbol: string) {
    try {
        const finnhubSymbol = symbol === 'FTSE:MIB' ? 'FTSEMIB.MI' : symbol === 'BTCUSD' ? 'BINANCE:BTCUSDT' : symbol;
        const { data } = await axios.get('/api/stocks/quote', {
            params: { symbol: finnhubSymbol }
        });
        if (!data || data.c === undefined || data.c === 0) {
            console.warn(`Empty stock data for ${symbol}:`, data);
            return null;
        }
        return {
            symbol,
            price: parseFloat(data.c).toFixed(2),
            change: (data.d > 0 ? '+' : '') + parseFloat(data.d).toFixed(2),
            percent: (data.dp > 0 ? '+' : '') + parseFloat(data.dp).toFixed(2) + '%',
            high: parseFloat(data.h).toFixed(2),
            low: parseFloat(data.l).toFixed(2),
            open: parseFloat(data.o).toFixed(2),
            prevClose: parseFloat(data.pc).toFixed(2),
        };
    } catch (error) {
        console.error(`Error fetching stock quote for ${symbol}:`, error);
        return null;
    }
}

export async function fetchMultipleStocks(symbols: string[]) {
    const results = await Promise.all(symbols.map(s => fetchStockQuote(s)));
    return results.filter(Boolean);
}

export async function fetchEconomicCalendar() {
    const { data } = await axios.get('/api/stocks/calendar/economic');
    return data;
}

// ─── Weather (Open-Meteo — no key needed) ───
export async function fetchWeather(lat = 45.0526, lon = 9.693) {
    const { data } = await axios.get('https://api.open-meteo.com/v1/forecast', {
        params: {
            latitude: lat,
            longitude: lon,
            current: ['temperature_2m', 'relative_humidity_2m', 'apparent_temperature', 'is_day', 'precipitation', 'weather_code', 'cloud_cover', 'pressure_msl', 'wind_speed_10m', 'wind_direction_10m', 'wind_gusts_10m'],
            hourly: ['temperature_2m', 'precipitation_probability', 'wind_speed_10m', 'snow_depth', 'snowfall'],
            daily: ['weather_code', 'temperature_2m_max', 'temperature_2m_min', 'precipitation_sum', 'sunrise', 'sunset', 'uv_index_max', 'wind_speed_10m_max', 'snowfall_sum'],
            forecast_days: 7,
            past_days: 7,
            timezone: 'auto'
        }
    });
    return data;
}

export async function fetchMarineWeather(lat = 45.0, lon = 9.7) {
    const { data } = await axios.get('https://marine-api.open-meteo.com/v1/marine', {
        params: {
            latitude: lat,
            longitude: lon,
            hourly: ['wave_height', 'wave_direction', 'wave_period', 'sea_surface_temperature']
        }
    });
    return data.hourly;
}

// ─── F1 (OpenF1 — no key needed) ───
const F1_BASE = 'https://api.openf1.org/v1';

export async function fetchF1Sessions(year: number = new Date().getFullYear()) {
    const { data } = await axios.get(`${F1_BASE}/sessions`, { params: { year } });
    return data || [];
}

export async function fetchF1LatestSession() {
    const { data } = await axios.get(`${F1_BASE}/sessions`, { params: { session_key: 'latest' } });
    return data?.[0] || null;
}

export async function fetchF1Positions(sessionKey: number) {
    const { data } = await axios.get(`${F1_BASE}/position`, { params: { session_key: sessionKey } });
    return data || [];
}

export async function fetchF1Drivers(sessionKey: number) {
    const { data } = await axios.get(`${F1_BASE}/drivers`, { params: { session_key: sessionKey } });
    return data || [];
}

export async function fetchF1Location(sessionKey: number, dateAfter?: string) {
    const params: Record<string, string | number> = { session_key: sessionKey };
    if (dateAfter) params['date>'] = dateAfter; // OpenF1 supports specific filter syntax
    const { data } = await axios.get(`${F1_BASE}/location`, { params });
    return data || [];
}

export async function fetchF1TrackContour(sessionKey: number, driverNumber: number = 1) {
    // Specifically fetch early points to make a complete lap shape 
    const { data } = await axios.get(`${F1_BASE}/location`, {
        params: {
            session_key: sessionKey,
            driver_number: driverNumber
        }
    });
    // Return a downsampled version of the track for SVG drawing (e.g. every 10th point, first 5000 points to keep size tiny)
    if (!data || data.length === 0) return [];
    return data.slice(0, 8000).filter((_: any, i: number) => i % 5 === 0);
}

export async function fetchF1LapData(sessionKey: number) {
    const { data } = await axios.get(`${F1_BASE}/laps`, { params: { session_key: sessionKey } });
    return data || [];
}

export async function fetchF1RaceControl(sessionKey: number) {
    const { data } = await axios.get(`${F1_BASE}/race_control`, { params: { session_key: sessionKey } });
    return data || [];
}

export async function fetchF1Weather(sessionKey: number) {
    const { data } = await axios.get(`${F1_BASE}/weather`, { params: { session_key: sessionKey } });
    return data || [];
}

export async function fetchF1PitStops(sessionKey: number) {
    const { data } = await axios.get(`${F1_BASE}/pit`, { params: { session_key: sessionKey } });
    return data || [];
}

export async function fetchF1Intervals(sessionKey: number) {
    const { data } = await axios.get(`${F1_BASE}/intervals`, { params: { session_key: sessionKey } });
    return data || [];
}

// ─── OpenSky (Flights — no key needed) ───
export async function fetchFlights(bounds?: { lamin: number; lomin: number; lamax: number; lomax: number }) {
    const { data } = await axios.get('https://opensky-network.org/api/states/all', {
        params: bounds || {}
    });
    if (!data?.states) return [];
    return data.states.slice(0, 400).map((s: any[]) => {
        const callsign = s[1]?.trim() || 'N/A';
        // Common military callsigns
        const isMilitary = /^(RCH|REACH|SPAR|DUKE|CNV|IAM|BAF|RRR|N|ASY|HVK|RA|LIFE|JETS|BOLT|VADER|GHOST|WAR|DRAGO|EVAC|FORTE|HAWK|HORNET|KING|KNIGHT|MAGIC|METAL|NACHO|OMNI|PATRIOT|PYTHON|RAVEN|REVENANT|SABRE|SHADOW|STING|TALON|THUNDER|VIPER|WOLF)/i.test(callsign);

        return {
            icao: s[0],
            callsign,
            lon: s[5],
            lat: s[6],
            velocity: s[9],
            track: s[10],
            altitude: s[13] || s[7],
            isMilitary
        };
    }).filter((f: any) => f.lat && f.lon);
}

// ─── Earthquakes (USGS — free) ───
export async function fetchEarthquakes() {
    const { data } = await axios.get('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson');
    return data.features || [];
}

// ─── ReliefWeb (Disasters — free) ───
export async function fetchDisasters() {
    const { data } = await axios.get('https://api.reliefweb.int/v1/disasters', {
        params: {
            appname: 'worldmonitor',
            preset: 'latest',
            limit: 100,
            profile: 'full'
        }
    });
    return (data.data || []).map((d: any) => {
        const fields = d.fields || {};
        const country = fields.primary_country || {};
        const loc = country.location || {};
        return {
            name: fields.name,
            type: fields.primary_type?.name,
            description: fields.description,
            country: country.name,
            lat: loc.lat,
            lon: loc.lon,
            date: fields.date?.created,
            layer: 'conflicts'
        };
    }).filter((d: any) => d.lat !== undefined && d.lon !== undefined);
}

// ─── NASA FIRMS (Thermal/Wildfires — proxy returns CSV) ───
export async function fetchWildfires() {
    try {
        // Updated path to work with the new proxy rewrite: /api/firms/[SOURCE]/[AREA]/[DAY]
        const { data } = await axios.get('/api/firms/VIIRS_SNPP_NRT/world/1', {
            responseType: 'text'
        });
        if (typeof data !== 'string' || !data.includes('\n')) return [];

        const lines = data.trim().split('\n');
        const headers = lines[0].split(',');
        return lines.slice(1).map(line => {
            const values = line.split(',');
            const entry: any = {};
            headers.forEach((h, i) => {
                const head = h.toLowerCase().trim();
                entry[head] = values[i];
            });
            return {
                lat: parseFloat(entry.latitude),
                lon: parseFloat(entry.longitude),
                bright: parseFloat(entry.bright_ti4) || parseFloat(entry.bright_t31) || parseFloat(entry.brightness),
                confidence: entry.confidence,
                date: entry.acq_date,
                time: entry.acq_time,
                layer: 'wildfires'
            };
        }).filter(f => !isNaN(f.lat) && !isNaN(f.lon));
    } catch (e) {
        console.error('Error fetching wildfires:', e);
        return [];
    }
}

// ─── Pizza Index (Pentagon pizza activity monitor) ───
export async function fetchPizzaIndex() {
    try {
        const { data } = await axios.get('/api/pizzint/');
        // This hits the web scaper/monitor, if it returns 200 we consider it online
        return data;
    } catch (e) {
        console.warn('Pizza Index unavailable:', e);
        throw e;
    }
}

// ─── Gemini AI (through proxy) ───
export async function callGemini(prompt: string, history: { role: string; content: string }[] = []) {
    try {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
        if (!apiKey || apiKey === 'MISSING_KEY') {
            console.error('Gemini API Key is missing or invalid.');
            return 'AI service unavailable: Missing API Key.';
        }
        // For dev, we'll call the Gemini API directly since the proxy needs the key in the URL
        const { GoogleGenerativeAI } = await import('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: 'gemini-3-flash-preview',
            systemInstruction: 'You are the data analyzer for my monitoring dashboard. Your output is displayed in small widgets, so you must be extremely concise. RULES:- Never use conversational filler (e.g., "Here is the summary," "Based on the data," or "As an AI..."). Start immediately with the information.- Keep responses extremely brief. Use short bullet points or a maximum of 2-3 sentences. No long paragraphs.- If asked to extract data (like tracking numbers), return ONLY the requested structured data format.- Tone must be direct, factual, and professional. No catchphrases, no roleplay.'
        });
        const chat = model.startChat({
            history: history.map(h => ({
                role: h.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: h.content }],
            }))
        });
        const result = await chat.sendMessage(prompt);
        return result.response.text();
    } catch (error) {
        console.error('Error calling Gemini:', error);
        return 'AI assistant error: ' + (error instanceof Error ? error.message : String(error));
    }
}

export async function summarizeWithGemini(content: string, instruction: string = 'Summarize this concisely') {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey || 'MISSING_KEY');
    const model = genAI.getGenerativeModel({
        model: 'gemini-3-flash-preview'
    });
    // Ensure instruction emphasizes NO filler
    const systemPrompt = `Analyze the following news text. Provide a 3-point analytical briefing. No filler, no conversational text. Start immediately.`;
    const result = await model.generateContent(`${systemPrompt}\n\n${instruction}:\n\n${content}`);
    return result.response.text();
}

// ─── Bluesky / Social (public feed) ───
export async function fetchBlueskyFeed(query: string = 'world news') {
    try {
        const { data } = await axios.get('https://public.api.bsky.app/xrpc/app.bsky.feed.searchPosts', {
            params: { q: query, limit: 20, sort: 'latest' }
        });
        return (data.posts || []).map((post: any) => ({
            id: post.uri,
            author: post.author?.handle || 'unknown',
            displayName: post.author?.displayName || post.author?.handle || 'Unknown',
            avatar: post.author?.avatar,
            content: post.record?.text || '',
            timestamp: post.record?.createdAt || post.indexedAt,
            platform: 'Bluesky',
            likes: post.likeCount || 0,
            reposts: post.repostCount || 0,
        }));
    } catch {
        return [];
    }
}

// ─── News Hotspots (Geo-mapping news) ───
const COUNTRY_COORDS: Record<string, [number, number]> = {
    'USA': [37.0902, -95.7129], 'United States': [37.0902, -95.7129], 'China': [35.8617, 104.1954],
    'Russia': [61.524, 105.3188], 'Ukraine': [48.3794, 31.1656], 'Israel': [31.0461, 34.8516],
    'Gaza': [31.3547, 34.3088], 'Iran': [32.4279, 53.688], 'Taiwan': [23.6978, 120.9605],
    'UK': [55.3781, -3.436], 'Germany': [51.1657, 10.4515], 'France': [46.2276, 2.2137],
    'Italy': [41.8719, 12.5674], 'Japan': [36.2048, 138.2529], 'India': [20.5937, 78.9629],
    'Brazil': [-14.235, -51.9253], 'N. Korea': [40.3399, 127.5101], 'North Korea': [40.3399, 127.5101],
    'S. Korea': [35.9078, 127.7669], 'South Korea': [35.9078, 127.7669], 'Sudan': [12.8628, 30.2176],
    'Yemen': [15.5527, 48.5164], 'Lebanon': [33.8547, 35.8623], 'Syria': [34.8021, 38.9968],
    'Turkey': [38.9637, 35.2433], 'Poland': [51.9194, 19.1451], 'Egypt': [26.8206, 30.8025],
    'Iraq': [33.2232, 43.6793], 'Pakistan': [30.3753, 69.3451], 'Afghanistan': [33.9391, 67.71],
    'Israel-Gaza': [31.3547, 34.3088], 'Palestine': [31.3547, 34.3088], 'Middle East': [29.2985, 42.551], 'North Atlantic': [50.0, -30.0],
    'Mediterranean': [35.0, 18.0], 'South China Sea': [12.0, 113.0], 'Red Sea': [20.0, 38.0],
    'Australia': [-25.2744, 133.7751], 'Canada': [56.1304, -106.3468], 'Mexico': [23.6345, -102.5528],
    'Haiti': [18.9712, -72.2852], 'Venezuela': [6.4238, -66.5897], 'Libya': [26.3351, 17.2283],
    'Mali': [17.5707, -3.9962], 'Niger': [17.6078, 8.0817], 'Kenya': [-0.0236, 37.9062],
    'Ethiopia': [9.145, 40.4897], 'Philippines': [12.8797, 121.774], 'Vietnam': [14.0583, 108.2772],
    'Europe': [48.0, 15.0], 'EU': [48.0, 15.0], 'NATO': [50.0, 10.0],
};

export async function fetchNewsHotspots() {
    try {
        const { data } = await axios.get('/api/news/top-headlines', {
            params: { category: 'general', language: 'en', pageSize: 100 }
        });
        const headlines = data.articles || [];
        const hotspots: any[] = [];
        const countryCounts: Record<string, number> = {};

        headlines.forEach((art: any) => {
            const text = `${art.title} ${art.description || ''}`;
            Object.keys(COUNTRY_COORDS).forEach(country => {
                const regex = new RegExp(`\\b${country}\\b`, 'i');
                if (regex.test(text)) {
                    countryCounts[country] = (countryCounts[country] || 0) + 1;
                }
            });
        });

        Object.entries(countryCounts).forEach(([country, count]) => {
            const coords = COUNTRY_COORDS[country];
            hotspots.push({
                id: `news-${country}`,
                name: `${country} Headlines`,
                lat: coords[0],
                lon: coords[1],
                intensity: count,
                layer: 'news-hotspots'
            });
        });

        return hotspots;
    } catch (e) {
        console.error('Error fetching news hotspots:', e);
        return [];
    }
}
