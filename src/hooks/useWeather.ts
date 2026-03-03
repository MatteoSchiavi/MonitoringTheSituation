// src/hooks/useWeather.ts
import { useState, useEffect } from 'react';
import { apiCache } from '../lib/cache';

// Piacenza, Italy coordinates
const LAT = 45.05;
const LON = 9.69;
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

export interface WeatherData {
  temperature: number;
  windSpeed: number;
  weatherCode: number;
  isDay: boolean;
}

export function useWeather() {
  const [data, setData] = useState<WeatherData | null>(null);
  const [status, setStatus] = useState<'loading' | 'online' | 'offline'>('loading');

  useEffect(() => {
    let mounted = true;

    async function fetchWeather() {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,is_day,weather_code,wind_speed_10m`;
        
        const responseData = await apiCache.fetch('weather', async () => {
          const res = await fetch(url);
          if (!res.ok) throw new Error('Weather API offline');
          return res.json();
        }, CACHE_TTL);

        if (mounted) {
          setData({
            temperature: responseData.current.temperature_2m,
            windSpeed: responseData.current.wind_speed_10m,
            weatherCode: responseData.current.weather_code,
            isDay: responseData.current.is_day === 1,
          });
          setStatus('online');
        }
      } catch (error) {
        if (mounted) setStatus('offline');
      }
    }

    fetchWeather();
    // Refresh every 15 minutes
    const interval = setInterval(fetchWeather, CACHE_TTL);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return { data, status };
}