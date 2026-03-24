import { useQuery } from '@tanstack/react-query';
import { fetchWeather, fetchMarineWeather } from '../lib/api';

const LAT = parseFloat(import.meta.env.VITE_LAT || '45.0526');
const LON = parseFloat(import.meta.env.VITE_LON || '9.693');

export function useWeatherData(lat = LAT, lon = LON) {
    return useQuery({
        queryKey: ['weather', lat, lon],
        queryFn: () => fetchWeather(lat, lon),
        staleTime: 30 * 60 * 1000, // 30 min
        refetchInterval: 30 * 60 * 1000,
    });
}

export function useMarineWeather(lat = LAT, lon = LON) {
    return useQuery({
        queryKey: ['marine-weather', lat, lon],
        queryFn: () => fetchMarineWeather(lat, lon),
        staleTime: 60 * 60 * 1000, // 1 hour
    });
}

// WMO Weather Code to description
export function weatherCodeToText(code: number): string {
    const codes: Record<number, string> = {
        0: 'Clear Sky', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
        45: 'Fog', 48: 'Rime Fog',
        51: 'Light Drizzle', 53: 'Moderate Drizzle', 55: 'Dense Drizzle',
        61: 'Slight Rain', 63: 'Moderate Rain', 65: 'Heavy Rain',
        71: 'Slight Snow', 73: 'Moderate Snow', 75: 'Heavy Snow',
        77: 'Snow Grains',
        80: 'Slight Showers', 81: 'Moderate Showers', 82: 'Violent Showers',
        85: 'Slight Snow Showers', 86: 'Heavy Snow Showers',
        95: 'Thunderstorm', 96: 'Thunderstorm w/ Slight Hail', 99: 'Thunderstorm w/ Heavy Hail'
    };
    return codes[code] || 'Unknown';
}

// Compass direction from degrees
export function windDirToCompass(degrees: number): string {
    const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N'];
    return dirs[Math.round(((degrees % 360) / 45))];
}
