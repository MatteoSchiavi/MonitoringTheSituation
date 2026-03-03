import { useState, useEffect } from 'react';
import { fetchNews, fetchStocks, fetchWeather, fetchF1 } from '../lib/api';
import type { NewsArticle, StockData, WeatherData, F1Data } from '../types/dashboard';

export function useDashboardData(apiKeyNews?: string, apiKeyStocks?: string, followedStocks: string[] = ['SPY', 'QQQ', 'BTCUSD']) {
    const [news, setNews] = useState<NewsArticle[]>([]);
    const [stocks, setStocks] = useState<StockData[]>([]);
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [f1, setF1] = useState<F1Data | null>(null);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            const [n, s, w, f] = await Promise.all([
                fetchNews(apiKeyNews),
                fetchStocks(followedStocks, apiKeyStocks),
                fetchWeather(),
                fetchF1()
            ]);
            setNews(n);
            setStocks(s);
            setWeather({
                temp: w.temp,
                condition: 'Stable', // Condition could be mapped from WMO code
                windSpeed: w.windSpeed,
                visibility: 10 // Mock for now
            });
            setF1(f);
        } catch (err) {
            console.error('Data load error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
        const interval = setInterval(loadData, 60000); // 1 minute global sync
        return () => clearInterval(interval);
    }, [apiKeyNews, apiKeyStocks, followedStocks]);

    return { news, stocks, weather, f1, loading, refresh: loadData };
}
