import { useMemo, useState } from 'react';
import { Responsive, useContainerWidth } from 'react-grid-layout';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { AINewsBrief } from '../overview/AINewsBrief';
import { MarketQuickLook } from '../overview/MarketQuickLook';
import { CalendarAgenda } from '../overview/CalendarAgenda';
import { LogisticsTracker } from '../overview/LogisticsTracker';
import { HomeControl } from '../overview/HomeControl';
import { SportsViability } from '../overview/SportsViability';

import { useTopHeadlines, useGeminiSummary } from '../../hooks/useNewsQueries';
import { useMultipleStocks } from '../../hooks/useStockQueries';
import { useWeatherData } from '../../hooks/useWeatherQueries';

const WORLD_MARKETS = ['SPY', 'QQQ', 'VGK', 'EWJ', 'BTCUSD', 'GLD'];

const initialLayouts: { [key: string]: any[] } = {
    lg: [
        { i: 'news-brief', x: 0, y: 0, w: 12, h: 4 },
        { i: 'markets', x: 0, y: 4, w: 8, h: 5 },
        { i: 'viability', x: 8, y: 4, w: 4, h: 5 },
        { i: 'agenda', x: 0, y: 9, w: 4, h: 7 },
        { i: 'logistics', x: 4, y: 9, w: 4, h: 4 },
        { i: 'home', x: 8, y: 9, w: 4, h: 7 },
    ],
    md: [
        { i: 'news-brief', x: 0, y: 0, w: 10, h: 4 },
        { i: 'markets', x: 0, y: 4, w: 10, h: 5 },
        { i: 'viability', x: 0, y: 9, w: 5, h: 5 },
        { i: 'agenda', x: 5, y: 9, w: 5, h: 7 },
        { i: 'logistics', x: 0, y: 14, w: 10, h: 4 },
        { i: 'home', x: 0, y: 18, w: 10, h: 7 },
    ]
};

export default function OverviewTab() {
    const headlines = useTopHeadlines();
    const stocks = useMultipleStocks(WORLD_MARKETS);
    const weather = useWeatherData();
    const [layouts, setLayouts] = useState(initialLayouts);
    const { width, containerRef, mounted } = useContainerWidth();

    const newsText = useMemo(() => {
        try {
            if (!headlines.data || !Array.isArray(headlines.data) || headlines.data.length === 0) return '';
            return headlines.data.slice(0, 15)
                .filter((a: any) => a && a.title)
                .map((a: any) => `${a.title}: ${a.description || ''}`)
                .join('\n');
        } catch (e) {
            console.error('Error processing news for summary:', e);
            return '';
        }
    }, [headlines.data]);

    const aiSummary = useGeminiSummary(
        newsText,
        'Create 3 short bullet points summarizing global events.',
        newsText.length > 0
    );

    const viability = useMemo(() => {
        const current = weather.data?.current;
        if (!current) return { status: 'CAUTION' as const, metrics: { wind: '—', aqi: 24, temp: '—' } };

        const wind = current.wind_speed_10m;
        const temp = current.temperature_2m;

        let status: 'OPTIMAL' | 'NOT OPTIMAL' | 'CAUTION' = 'OPTIMAL';
        if (wind > 35 || temp > 35 || temp < 0) status = 'NOT OPTIMAL';
        else if (wind > 20 || temp > 30 || temp < 8) status = 'CAUTION';

        return {
            status,
            metrics: {
                wind: `${Math.round(wind)}km/h`,
                aqi: 24,
                temp: `${Math.round(temp)}°C`
            }
        };
    }, [weather.data]);

    return (
        <div className="p-4 bg-zinc-950/20 min-h-screen scrollbar-hide">
            <div ref={containerRef} className="h-full min-h-[800px]">
                {mounted && (
                    <Responsive
                        className="layout min-h-full"
                        layouts={layouts}
                        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                        rowHeight={40}
                        draggableHandle=".widget-header"
                        margin={[16, 16]}
                        onLayoutChange={(_: any, all: any) => setLayouts(all)}
                        width={width}
                    >
                        <div key="news-brief">
                            <AINewsBrief data={aiSummary.data} isLoading={aiSummary.isLoading} />
                        </div>
                        <div key="markets">
                            <MarketQuickLook data={(stocks.data || []) as any} isLoading={stocks.isLoading} />
                        </div>
                        <div key="viability">
                            <SportsViability status={viability.status} metrics={viability.metrics} isLoading={weather.isLoading} />
                        </div>
                        <div key="agenda">
                            <CalendarAgenda events={[] as any} />
                        </div>
                        <div key="logistics">
                            <LogisticsTracker shipments={[] as any} />
                        </div>
                        <div key="home">
                            <HomeControl devices={[] as any} />
                        </div>
                    </Responsive>
                )}
            </div>
        </div>
    );
}
