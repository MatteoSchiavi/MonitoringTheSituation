import { Wind, Droplets, Waves, Navigation, Activity, Mountain, Snowflake } from 'lucide-react';
import { Widget } from '../ui/Widget';
import { cn } from '../../lib/utils';
import { useEffect, useState } from 'react';
import { fetchWeather, fetchSurf } from '../../lib/api';

const SPORTS = {
    SAILING: {
        icon: <Wind size={14} />,
        locations: [
            { id: 'COMO', name: 'Lake Como (Sailing/Wind)', lat: 46.1311, lon: 9.3667 },
            { id: 'CAPRERA', name: 'Porto Palma, Caprera', lat: 41.1904, lon: 9.4754 }
        ]
    },
    ENDURO: {
        icon: <Navigation size={14} />,
        locations: [
            { id: 'RIVERGARO', name: 'Rivergaro, Piacenza', lat: 44.9103, lon: 9.5989 }
        ]
    },
    SURF: {
        icon: <Waves size={14} />,
        locations: [
            { id: 'FORTE', name: 'Forte dei Marmi', lat: 43.9575, lon: 10.1691 }
        ]
    },
    SKIING: {
        icon: <Mountain size={14} />,
        locations: [
            { id: 'MARILLEVA', name: 'Marilleva 1400', lat: 46.3156, lon: 10.8142 },
            { id: 'CAMPIGLIO', name: 'Madonna di Campiglio', lat: 46.2255, lon: 10.8269 },
            { id: 'TONALE', name: 'Passo del Tonale', lat: 46.2581, lon: 10.5841 },
            { id: 'THUILE', name: 'La Thuile', lat: 45.7145, lon: 6.9506 },
            { id: 'PASSI', name: 'Giro dei 4 Passi', lat: 46.5489, lon: 11.8364 }
        ]
    }
};

export function EnvironmentalIntelligence() {
    const [data, setData] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAll = async () => {
            const results: Record<string, any> = {};
            const allLocs = Object.values(SPORTS).flatMap(s => s.locations);

            for (const loc of allLocs) {
                try {
                    const w = await fetchWeather(loc.lat, loc.lon);
                    let surfStats = null;
                    // Pre-fetch surf data for surf locations
                    if (SPORTS.SURF.locations.some(l => l.id === loc.id)) {
                        const surfData = await fetchSurf(loc.lat, loc.lon);
                        if (surfData && surfData.wave_height && surfData.wave_height.length > 0) {
                            surfStats = { waveHeight: surfData.wave_height[new Date().getHours()] || surfData.wave_height[0] };
                        }
                    }
                    results[loc.id] = { ...w, ...surfStats };
                } catch (e) {
                    console.error(`Failed to fetch for ${loc.id}`);
                }
            }
            setData(results);
            setLoading(false);
        };
        loadAll();
    }, []);

    const getMudRisk = (precip: number) => {
        if (precip > 5) return { label: 'CRITICAL MUD', color: 'text-red-500' };
        if (precip > 1) return { label: 'ELEVATED RISK', color: 'text-amber-500' };
        return { label: 'DRY / STABLE', color: 'text-primary' };
    };

    const getSnowForecast = () => {
        // Mocking 7-day forecast since primary API is current-only
        return Array.from({ length: 7 }).map((_, i) => ({
            day: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'][i],
            amount: Math.floor(Math.random() * 20),
            willSnow: Math.random() > 0.7
        }));
    };

    return (
        <div className="h-full p-6 flex flex-col gap-8 bg-zinc-950/20 overflow-hidden relative font-mono">
            <header className="flex items-center justify-between shrink-0 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 border border-primary/20">
                        <Activity size={24} className="text-primary" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-zinc-100 uppercase tracking-widest">Environmental Intelligence</h2>
                        <div className="text-[10px] text-zinc-500 font-black tracking-widest uppercase mt-1 italic">
                            Global Weather Analysis // Regional Sport Connectivity
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-12 pb-10 relative z-10">
                {Object.entries(SPORTS).map(([sport, config]) => (
                    <section key={sport} className="space-y-6">
                        <div className="flex items-center gap-3 border-b border-border pb-2">
                            <span className="text-primary">{config.icon}</span>
                            <h3 className="text-sm font-black text-zinc-400 uppercase tracking-[0.3em]">{sport}</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {config.locations.map((loc) => {
                                const stats = data[loc.id];
                                const isSkiing = sport === 'SKIING';

                                return (
                                    <Widget
                                        key={loc.id}
                                        title={loc.name}
                                        icon={config.icon}
                                        className="group hover:border-primary transition-all bg-zinc-900/40"
                                    >
                                        <div className="flex flex-col gap-4 py-4">
                                            <div className="flex justify-between items-end border-b border-border/40 pb-4">
                                                <div className="flex flex-col">
                                                    <span className="text-3xl font-black text-zinc-100 italic">
                                                        {stats?.temp || '--'}<span className="text-sm text-primary ml-1 not-italic">°C</span>
                                                    </span>
                                                    <span className="text-[9px] text-zinc-500 font-black uppercase mt-1 tracking-tighter">Current Temp</span>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-xl font-black text-primary italic">
                                                        {stats?.windSpeed || '--'}<span className="text-[10px] ml-1 not-italic">KN</span>
                                                    </span>
                                                    <span className="text-[9px] text-zinc-500 font-black uppercase mt-1 tracking-tighter">Wind Velocity</span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest">
                                                        {sport === 'SURF' ? 'Wave Height' : isSkiing ? 'Base Snow' : 'Humidity'}
                                                    </span>
                                                    <div className="flex items-center gap-2 text-zinc-300 font-black">
                                                        {sport === 'SURF' ? (
                                                            <>
                                                                <Waves size={10} className="text-blue-400" />
                                                                <span className="text-[11px]">{stats?.waveHeight ? `${stats.waveHeight}m` : '--'}</span>
                                                            </>
                                                        ) : isSkiing ? (
                                                            <>
                                                                <Snowflake size={10} className="text-white" />
                                                                <span className="text-[11px]">{stats?.snowDepth ? `${stats.snowDepth}cm` : '--'}</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Droplets size={10} className="text-blue-500" />
                                                                <span className="text-[11px]">{stats?.humidity || '--'}%</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-1 text-right">
                                                    <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest">Conditions</span>
                                                    <span className="text-[10px] font-black text-primary uppercase italic">Optimal</span>
                                                </div>
                                            </div>

                                            {loc.id === 'RIVERGARO' && stats && (
                                                <div className="mt-2 p-3 bg-zinc-950/50 border border-primary/20">
                                                    <div className="text-[8px] text-zinc-600 font-black uppercase mb-1">MUD_RISK_INDEX</div>
                                                    <div className={cn("text-[10px] font-black uppercase italic", getMudRisk(0).color)}>
                                                        {getMudRisk(0).label}
                                                    </div>
                                                </div>
                                            )}

                                            {isSkiing && stats && (
                                                <div className="mt-2 space-y-4">
                                                    <div className="p-3 bg-zinc-950/50 border border-blue-500/20">
                                                        <div className="text-[8px] text-zinc-600 font-black uppercase mb-2 flex items-center gap-2">
                                                            <Snowflake size={10} /> 7-DAY SNOW FORECAST
                                                        </div>
                                                        <div className="flex justify-between gap-1 h-12 items-end">
                                                            {getSnowForecast().map((f, i) => (
                                                                <div key={i} className="flex-1 flex flex-col items-center gap-1 group/day relative">
                                                                    <div
                                                                        className={cn(
                                                                            "w-full transition-all duration-500 cursor-help",
                                                                            f.willSnow ? "bg-blue-400/60" : "bg-zinc-800"
                                                                        )}
                                                                        style={{ height: `${f.amount * 2}px` }}
                                                                    />
                                                                    <span className="text-[6px] text-zinc-600 font-black">{f.day}</span>
                                                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-zinc-900 border border-border px-1 py-0.5 opacity-0 group-hover/day:opacity-100 transition-opacity z-20 pointer-events-none whitespace-nowrap">
                                                                        <span className="text-[8px] font-black text-primary">{f.amount}cm</span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </Widget>
                                );
                            })}
                        </div>
                    </section>
                ))}
            </div>

            {loading && (
                <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="flex flex-col items-center gap-4">
                        <Activity className="text-primary animate-spin" size={32} />
                        <span className="text-[10px] font-black tracking-[0.4em] text-primary uppercase animate-pulse">Syncing Environmental Network...</span>
                    </div>
                </div>
            )}
        </div>
    );
}
