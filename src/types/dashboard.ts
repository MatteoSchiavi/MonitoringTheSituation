export interface NewsArticle {
    title: string;
    source: {
        name: string;
    };
    publishedAt: string;
    description?: string;
    url?: string;
}

export interface StockData {
    symbol: string;
    price: string;
    change: string;
    percent: string;
    volume?: string;
}

export interface WeatherData {
    temp: number;
    condition: string;
    windSpeed: number;
    visibility: number;
}

export interface F1Data {
    session?: {
        session_name: string;
        circuit_short_name: string;
        location?: string;
    };
    standings?: Array<{
        pos: number;
        driver: string;
        team: string;
        pts: number;
    }>;
    nextGp?: {
        name: string;
        date: string;
        circuit: string;
        location: string;
    };
}
