import axios from 'axios';
import { apiCache } from './cache';

const CONFIG = {
    NEWS_API_BASE: 'https://newsapi.org/v2',
    STOCK_API_BASE: 'https://www.alphavantage.co/query',
    WEATHER_API_BASE: 'https://api.open-meteo.com/v1/forecast',
    MARINE_API_BASE: 'https://marine-api.open-meteo.com/v1/marine',
    F1_API_BASE: 'https://api.openf1.org/v1',
    OPENSKY_API_BASE: 'https://opensky-network.org/api',
    FIRMS_API_BASE: 'https://firms.modaps.eosdis.nasa.gov/api/area/csv'
};

// Generic Fetcher with Cache
export const fetchWithCache = async <T>(key: string, url: string, params: any, ttl: number = 300000): Promise<T> => {
    return apiCache.fetch(key, async () => {
        const response = await axios.get(url, { params });
        return response.data;
    }, ttl);
};

// News API
export const fetchNews = async (apiKey?: string) => {
    if (!apiKey || apiKey.includes('YOUR_NEWSAPI_KEY') || apiKey === 'YOUR_API_KEY') {
        throw new Error('API Key Required for NewsAPI');
    }

    const data: any = await fetchWithCache('news-tech', `${CONFIG.NEWS_API_BASE}/top-headlines`, {
        country: 'us',
        category: 'technology',
        pageSize: 8,
        apiKey
    });
    return data.articles || [];
};

// Stocks API
export const fetchStocks = async (symbols: string[] = ['SPY', 'QQQ', 'BTCUSD', 'TSLA', 'AAPL', 'NVDA'], apiKey?: string) => {
    if (!apiKey || apiKey.includes('YOUR') || apiKey.includes('UNSET')) {
        throw new Error('API Key Required for AlphaVantage');
    }

    const results = await Promise.all(symbols.map(async (symbol) => {
        // Handle FTSE MIB (needs specific mapping if not standard)
        const activeSymbol = symbol === 'FTSE:MIB' ? 'FTSEMIB.MI' : symbol;

        const data: any = await fetchWithCache(`stock-${activeSymbol}`, CONFIG.STOCK_API_BASE, {
            function: 'GLOBAL_QUOTE',
            symbol: activeSymbol,
            apikey: apiKey
        }, 60000); // 1 minute cache for stocks

        const quote = data['Global Quote'];
        if (!quote) return null;
        return {
            symbol: quote['01. symbol'],
            price: parseFloat(quote['05. price']).toFixed(2),
            change: parseFloat(quote['09. change']).toFixed(2),
            percent: quote['10. change percent'],
            volume: quote['06. volume']
        };
    }));

    return results.filter(s => s !== null);
};

// Weather API (Piacenza by default)
export const fetchWeather = async (lat: number = 45.0526, lon: number = 9.693) => {
    const data: any = await fetchWithCache(`weather-${lat}-${lon}`, CONFIG.WEATHER_API_BASE, {
        latitude: lat,
        longitude: lon,
        current: ['temperature_2m', 'relative_humidity_2m', 'apparent_temperature', 'is_day', 'precipitation', 'rain', 'showers', 'snowfall', 'snow_depth', 'weather_code', 'cloud_cover', 'pressure_msl', 'surface_pressure', 'wind_speed_10m', 'wind_direction_10m', 'wind_gusts_10m'],
        hourly: 'temperature_2m',
        daily: ['weather_code', 'temperature_2m_max', 'temperature_2m_min', 'precipitation_sum', 'rain_sum', 'showers_sum', 'snowfall_sum', 'precipitation_hours', 'precipitation_probability_max'],
        timezone: 'auto'
    }, 1800000); // 30 min cache

    return {
        temp: data.current.temperature_2m,
        windSpeed: data.current.wind_speed_10m,
        humidity: data.current.relative_humidity_2m,
        snowDepth: data.current.snow_depth || 0,
        condition: data.current.weather_code.toString() // Simplified for now
    };
};

// Surf API
export const fetchSurf = async (lat: number, lon: number) => {
    const data: any = await fetchWithCache(`surf-${lat}-${lon}`, CONFIG.MARINE_API_BASE, {
        latitude: lat,
        longitude: lon,
        hourly: 'wave_height,wave_direction,wave_period'
    }, 3600000); // 1 hour cache for surf

    return data.hourly;
};

// F1 API (OpenF1)
export const fetchF1 = async (sessionType: string = 'Race', year: number = 2026) => {
    // Session Info
    const sessionData: any = await fetchWithCache('f1-sessions', `${CONFIG.F1_API_BASE}/sessions`, {
        session_type: sessionType,
        year: year
    }, 3600000);

    // If no active session, we fetch championship standings
    // This is a simplified mock of what the standings integration would look like
    // since OpenF1 primarily focus on live telemetry.
    const lastSession = sessionData.length > 0 ? sessionData[sessionData.length - 1] : null;

    return {
        session: lastSession,
        nextGp: {
            name: 'Saudi Arabian Grand Prix',
            date: '2026-03-20T18:00:00Z',
            circuit: 'Jeddah Corniche Circuit',
            location: 'Jeddah, Saudi Arabia'
        },
        standings: [] // Removed mock data, actual API requires complex driver queries
    };
};

// OpenSky Network (Flights)
export const fetchFlights = async (lamin?: number, lomin?: number, lamax?: number, lomax?: number) => {
    const data: any = await fetchWithCache(`flights-${lamin}-${lomin}`, `${CONFIG.OPENSKY_API_BASE}/states/all`, {
        lamin, lomin, lamax, lomax
    }, 30000); // 30s cache for flights

    if (!data.states) return [];

    // OpenSky returns an array of arrays. We map it to objects and slice to prevent browser crash.
    // [0]icao24, [1]callsign, [2]origin_country, ... [5]longitude, [6]latitude, ... [9]velocity
    return data.states.slice(0, 400).map((state: any[]) => ({
        icao: state[0],
        callsign: state[1] ? state[1].trim() : 'UNKNOWN',
        lon: state[5],
        lat: state[6],
        velocity: state[9],
        track: state[10],
        altitude: state[13] || state[7] // geo_altitude or baro_altitude
    })).filter((f: any) => f.lat && f.lon); // Ensure coordinates exist
};

// NASA FIRMS (Thermal Heat)
export const fetchThermalEvents = async (apiKey?: string, area: string = 'world') => {
    if (!apiKey || apiKey === 'MOCK_KEY') {
        throw new Error('API Key Required for FIRMS');
    }
    const url = `${CONFIG.FIRMS_API_BASE}/${apiKey}/VIIRS_SNPP_NRT/${area}/1`;
    const data = await fetchWithCache(`firms-${area}`, url, {}, 3600000); // 1h cache
    return data;
};
