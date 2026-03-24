import React, { useState, useMemo, useEffect } from 'react';
import type { ReactNode } from 'react';
import { Widget } from '../ui/Widget';
import { useWeatherData, useMarineWeather, weatherCodeToText, windDirToCompass } from '../../hooks/useWeatherQueries';
import { useF1LatestSession, useF1Positions, useF1Drivers, useF1RaceControl, isSessionActive, useF1Weather, useF1PitStops, useF1Intervals, useF1TrackContour, useF1LiveLocations } from '../../hooks/useF1Queries';
import {
    Wind, Sun, Waves, Flag,
    Clock, Trophy, Navigation, Mountain, Snowflake,
    Cloud, CloudRain, CloudLightning, CloudFog, CloudSun, Thermometer, Activity,
    Droplets
} from 'lucide-react';
import { ErrorBoundary } from 'react-error-boundary';
import { cn } from '../../lib/utils';

// Helper: Map WMO codes to Lucide icons
function getWeatherIcon(code: number, size = 16, className = "") {
    if (code === 0) return <Sun size={size} className={cn("text-amber-400", className)} />;
    if (code <= 3) return <CloudSun size={size} className={cn("text-zinc-400", className)} />;
    if (code <= 48) return <CloudFog size={size} className={cn("text-zinc-500", className)} />;
    if (code <= 67) return <CloudRain size={size} className={cn("text-blue-400", className)} />;
    if (code <= 77) return <Snowflake size={size} className={cn("text-indigo-200", className)} />;
    if (code <= 82) return <CloudRain size={size} className={cn("text-blue-500", className)} />;
    if (code <= 86) return <Snowflake size={size} className={cn("text-indigo-400", className)} />;
    if (code >= 95) return <CloudLightning size={size} className={cn("text-purple-400", className)} />;
    return <Cloud size={size} className={cn("text-zinc-400", className)} />;
}

// Multi-location Sport Configuration
const SPORTS_CONFIG = {
    SAILING: {
        icon: Wind,
        color: 'text-blue-400',
        locations: [
            { id: 'COMO', name: 'Lake Como', lat: 46.1311, lon: 9.3667 },
            { id: 'CAPRERA', name: 'Porto Palma, Caprera', lat: 41.1904, lon: 9.4754 }
        ]
    },
    ENDURO: {
        icon: Navigation,
        color: 'text-amber-500',
        locations: [
            { id: 'RIVERGARO', name: 'Rivergaro, Piacenza', lat: 44.9103, lon: 9.5989 }
        ]
    },
    SURF: {
        icon: Waves,
        color: 'text-cyan-400',
        locations: [
            { id: 'FORTE', name: 'Forte dei Marmi', lat: 43.9575, lon: 10.1691 }
        ]
    },
    SKIING: {
        icon: Mountain,
        color: 'text-indigo-400',
        locations: [
            { id: 'MARILLEVA', name: 'Marilleva 1400', lat: 46.3156, lon: 10.8142 },
            { id: 'CAMPIGLIO', name: 'M. di Campiglio', lat: 46.2255, lon: 10.8269 },
            { id: 'TONALE', name: 'Passo del Tonale', lat: 46.2581, lon: 10.5841 },
            { id: 'THUILE', name: 'La Thuile', lat: 45.7145, lon: 6.9506 },
            { id: 'PASSI', name: 'Giro dei 4 Passi', lat: 46.5489, lon: 11.8364 }
        ]
    }
};

export default function SportsF1Tab() {
    const [activeSubTab, setActiveSubTab] = useState<'sports' | 'f1' | 'map'>('sports');

    return (
        <div className="p-4 space-y-4 max-w-[1800px] mx-auto tab-content">
            {/* Sub-tab selector */}
            <div className="flex justify-center mb-6">
                <div className="inline-flex bg-zinc-900 border border-zinc-800 p-1 rounded-xl shadow-2xl">
                    <button
                        onClick={() => setActiveSubTab('sports')}
                        className={`px-8 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg transition-all ${activeSubTab === 'sports'
                            ? 'bg-emerald-500/10 text-emerald-400 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]'
                            : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                    >
                        Athletics
                    </button>
                    <button
                        onClick={() => setActiveSubTab('f1')}
                        className={`px-8 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg transition-all ${activeSubTab === 'f1'
                            ? 'bg-red-500/10 text-red-500 shadow-[inset_0_0_20px_rgba(239,68,68,0.05)]'
                            : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                    >
                        F1 Paddock
                    </button>
                </div>
            </div>

            <ErrorBoundary fallback={<div className="p-4 text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 rounded-md">Error loading Sports Dashboard.</div>}>
                {activeSubTab === 'sports' && <SportsSubTab />}
            </ErrorBoundary>
            <ErrorBoundary fallback={<div className="p-4 text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 rounded-md">Error loading F1 Live Dashboard.</div>}>
                {activeSubTab === 'f1' && <F1SubTab />}
            </ErrorBoundary>
        </div>
    );
}

function F1TrackMap({ sessionKey, isLive, driverMap }: { sessionKey: number, isLive: boolean, driverMap: Record<number, any> }) {
    const trackContour = useF1TrackContour(sessionKey);
    const liveLocations = useF1LiveLocations(sessionKey, isLive);

    const [bbox, setBbox] = useState({ minX: 0, maxX: 100, minY: 0, maxY: 100 });

    // Compute bbox
    useEffect(() => {
        if (!trackContour.data || trackContour.data.length === 0) return;
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        trackContour.data.forEach((pt: any) => {
            if (pt.x === 0 && pt.y === 0) return; // Filter zero points which occur before drivers go out
            if (pt.x < minX) minX = pt.x;
            if (pt.x > maxX) maxX = pt.x;
            if (pt.y < minY) minY = pt.y;
            if (pt.y > maxY) maxY = pt.y;
        });
        if (minX !== Infinity) {
            setBbox({ minX, maxX, minY, maxY });
        }
    }, [trackContour.data]);

    const width = bbox.maxX - bbox.minX;
    const height = bbox.maxY - bbox.minY;

    // Add 10% padding
    const paddingX = width * 0.1;
    const paddingY = height * 0.1;

    // Latest Driver locations
    const driverLocs = useMemo(() => {
        if (!liveLocations.data || liveLocations.data.length === 0) return {};
        const map: Record<number, any> = {};
        liveLocations.data.forEach((pt: any) => {
            if (pt.x === 0 && pt.y === 0) return; // Ignore invalid points
            const currentD = pt.date ? new Date(pt.date) : new Date(0);
            const prevD = map[pt.driver_number]?.date ? new Date(map[pt.driver_number].date) : new Date(0);
            if (!map[pt.driver_number] || currentD.getTime() > prevD.getTime()) {
                map[pt.driver_number] = pt;
            }
        });
        return map;
    }, [liveLocations.data]);

    if (!trackContour.data || width <= 0 || width === Infinity) {
        return (
            <div className="h-[320px] w-full bg-zinc-900/50 rounded-lg border border-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-500 uppercase tracking-widest relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                No Track Layout Available
            </div>
        );
    }

    const strokeMap = Math.max(width, height) * 0.025;
    const strokeLine = Math.max(width, height) * 0.008;

    return (
        <div className="h-[320px] w-full relative bg-zinc-950 rounded-lg overflow-hidden flex items-center justify-center p-2 border border-zinc-800/50 shadow-inner">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none" />
            <svg viewBox={`${bbox.minX - paddingX} ${-bbox.maxY - paddingY} ${width + paddingX * 2} ${height + paddingY * 2}`} className="w-full h-full max-h-full drop-shadow-2xl opacity-90 transition-all">
                <g transform="scale(1, -1)">
                    {/* Track Line */}
                    <polyline
                        points={trackContour.data.filter((p: any) => p.x !== 0 && p.y !== 0).map((p: any) => `${p.x},${p.y}`).join(' ')}
                        fill="none"
                        stroke="#18181b"
                        strokeWidth={strokeMap}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <polyline
                        points={trackContour.data.filter((p: any) => p.x !== 0 && p.y !== 0).map((p: any) => `${p.x},${p.y}`).join(' ')}
                        fill="none"
                        stroke="#71717a"
                        strokeWidth={strokeLine}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray={strokeLine * 2}
                        className="opacity-50"
                    />

                    {/* Driver Dots */}
                    {Object.values(driverLocs).map((loc: any) => {
                        const driver = driverMap[loc.driver_number];
                        if (!driver) return null;
                        const color = driver.team_colour ? `#${driver.team_colour}` : "#fff";
                        return (
                            <g key={loc.driver_number} transform={`translate(${loc.x}, ${loc.y})`} className="transition-transform duration-[3000ms] ease-linear">
                                <circle r={strokeMap * 1.5} fill={color} className="animate-ping opacity-20" />
                                <circle r={strokeMap * 0.7} fill={color} stroke="#000" strokeWidth={strokeMap * 0.15} />
                                <text transform="scale(1, -1)" y={strokeMap * -1.2} fill="#fff" fontSize={strokeMap * 1.5} textAnchor="middle" fontWeight="900"
                                    className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-tighter" style={{ fontFamily: 'monospace' }}>
                                    {driver.name_acronym}
                                </text>
                            </g>
                        );
                    })}
                </g>
            </svg>
            {isLive && (
                <div className="absolute top-3 left-3 flex items-center gap-2 bg-zinc-900/80 backdrop-blur-md px-2 py-1 rounded-md border border-zinc-800">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[10px] font-black text-zinc-100 tracking-widest uppercase">Live Sector Map</span>
                </div>
            )}
        </div>
    );
}

function SportsSubTab() {
    return (
        <div className="space-y-8 pb-10">
            {Object.entries(SPORTS_CONFIG).map(([sport, config]) => {
                const SportIcon = config.icon;
                return (
                    <section key={sport} className="space-y-4">
                        <div className="flex items-center gap-3 border-b border-zinc-800 pb-2">
                            <SportIcon size={16} className={config.color} />
                            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">{sport}</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                            {config.locations.map((loc) => (
                                <SportWeatherCard
                                    key={loc.id}
                                    location={loc}
                                    sport={sport}
                                    icon={<SportIcon size={14} className={config.color} />}
                                />
                            ))}
                        </div>
                    </section>
                );
            })}
        </div>
    );
}

interface SportWeatherCardProps {
    location: { id: string, name: string, lat: number, lon: number };
    sport: string;
    icon: ReactNode;
}

function SportWeatherCard({ location, sport, icon }: SportWeatherCardProps) {
    const weather = useWeatherData(location.lat, location.lon);
    const marine = useMarineWeather(location.lat, location.lon);

    // Process Data
    const current = weather.data?.current;
    const hourly = weather.data?.hourly;
    const daily = weather.data?.daily;

    // Helper: Min/Max between 8am-7pm
    const daytimeTempRange = useMemo(() => {
        try {
            if (!hourly || !Array.isArray(hourly.temperature_2m) || !Array.isArray(hourly.time)) return null;

            // Open-Meteo with past_days: 7 means today starts at index 168 (7 * 24)
            const dayStartIdx = 168;
            // Ensure we don't exceed the array length
            if (hourly.temperature_2m.length < dayStartIdx + 24) return null;

            const eightAmIdx = dayStartIdx + 8;
            const sevenPmIdx = dayStartIdx + 19;

            const temps = hourly.temperature_2m.slice(eightAmIdx, sevenPmIdx + 1);
            const dayTemps = temps.filter((t: any) => typeof t === 'number' && !isNaN(t));
            if (dayTemps.length === 0) return null;

            const min = Math.min(...dayTemps);
            const max = Math.max(...dayTemps);
            if (!isFinite(min) || !isFinite(max)) return null;

            return {
                min: min.toFixed(1),
                max: max.toFixed(1)
            };
        } catch (e) {
            console.warn('Error calculating daytime temp:', e);
            return null;
        }
    }, [hourly]);

    // Enduro logic
    const enduroMetrics = useMemo(() => {
        try {
            if (sport !== 'ENDURO' || !daily || !hourly) return null;

            const precipHistory = Array.isArray(daily.precipitation_sum) ? daily.precipitation_sum : [];
            // Past_days: 7 was set in api.ts. Index 0-6 are historical, index 7 is today
            const historicalPrecip = precipHistory.slice(0, 7);
            if (historicalPrecip.length === 0) return { condition: "NO DATA", color: "text-zinc-500", daysSinceRain: "?" };

            const totalRecentRain = historicalPrecip.slice(-3).reduce((a: number, b: number) => a + (b || 0), 0);
            const totalWeekRain = historicalPrecip.reduce((a: number, b: number) => a + (b || 0), 0);

            let condition = "DRY";
            let color = "text-emerald-500";

            if (totalRecentRain > 10) {
                condition = "MUDDY";
                color = "text-red-500";
            } else if (totalRecentRain > 2 || totalWeekRain > 15) {
                condition = "STICKY / SLICK";
                color = "text-amber-500";
            } else {
                condition = "DUSTY / DRY";
                color = "text-emerald-400";
            }

            const lastRainIdx = [...historicalPrecip].reverse().findIndex(p => p > 0.1);
            const daysSinceRain = lastRainIdx === -1 ? "> 7" : lastRainIdx;

            return { condition, color, daysSinceRain };
        } catch (e) {
            return { condition: "ERROR", color: "text-red-500", daysSinceRain: "?" };
        }
    }, [daily, hourly, sport]);

    // Skiing logic
    const skiingMetrics = useMemo(() => {
        try {
            if (sport !== 'SKIING' || !hourly || !daily) return null;

            const temps = Array.isArray(hourly.temperature_2m) ? hourly.temperature_2m : [];
            if (temps.length === 0) return null;

            const last24hTemps = temps.slice(0, 24);
            const valid24h = last24hTemps.filter((t: any) => typeof t === 'number');
            if (valid24h.length === 0) return { condition: "DATA ERROR", nightAvg: "N/A", snowForecast: 0, depth: "N/A" };

            const max24h = Math.max(...valid24h);
            const min24h = Math.min(...valid24h);

            let condition = "Mixed";
            if (max24h > 2 && min24h < 0) condition = "Icy / Hard Packed";
            else if (max24h < 0) condition = "Soft / Powder";
            else condition = "Slushy / Heavy";

            const nightTemps = (temps.slice(0, 7) || []).filter((t: any) => typeof t === 'number');
            const nightAvg = nightTemps.length > 0
                ? (nightTemps.reduce((a: number, b: number) => a + b, 0) / nightTemps.length).toFixed(1)
                : "N/A";

            const snowForecast = (Array.isArray(daily.snowfall_sum) ? daily.snowfall_sum.slice(7) : []).reduce((a: number, b: number) => a + (b || 0), 0) || 0;
            const hour = new Date().getHours();
            const depth = Array.isArray(hourly.snow_depth) ? (hourly.snow_depth[hour] || 0) : 0;

            return { condition, nightAvg, snowForecast, depth: depth > 0 ? `${Math.round(depth * 100)}cm` : "Data unavailable" };
        } catch (e) {
            return { condition: "ERROR", nightAvg: "N/A", snowForecast: 0, depth: "N/A" };
        }
    }, [daily, hourly, sport]);

    // Sailing Metrics (Wave height + Water Temp)
    const sailingMetrics = useMemo(() => {
        if (sport !== 'SAILING' || !marine.data) return null;
        const wave = marine.data.wave_height?.[0];
        const waterTemp = marine.data.sea_surface_temperature?.[0];
        return {
            wave: typeof wave === 'number' ? `${wave.toFixed(1)}m` : "Data unavailable",
            water: typeof waterTemp === 'number' ? `${waterTemp.toFixed(1)}°C` : "Data unavailable"
        };
    }, [marine.data, sport]);

    return (
        <Widget
            title={location.name}
            icon={icon}
            loading={weather.isLoading}
            status={weather.isError ? 'offline' : 'online'}
            className="hover:border-zinc-700 transition-all hover:shadow-[0_0_30px_rgba(0,0,0,0.3)] group"
        >
            {current && (
                <div className="space-y-4">
                    {/* Header: Icon + Min/Max */}
                    <div className="flex justify-between items-start border-b border-zinc-800/50 pb-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-zinc-900 rounded-lg border border-zinc-800 group-hover:border-zinc-700 transition-colors">
                                {getWeatherIcon(current.weather_code, 24)}
                            </div>
                            <div>
                                <div className="text-2xl font-black text-zinc-100 italic tracking-tighter">
                                    {Math.round(current.temperature_2m)}°<span className="text-xs text-zinc-500 not-italic ml-0.5">C</span>
                                </div>
                                <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest -mt-1">
                                    {weatherCodeToText(current.weather_code)}
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] font-black text-zinc-300 tracking-widest">
                                {daytimeTempRange ? `${daytimeTempRange.min}° / ${daytimeTempRange.max}°` : "N/A"}
                            </div>
                            <div className="text-[8px] text-zinc-600 font-bold uppercase tracking-tighter">DAYTIME RANGE</div>
                        </div>
                    </div>

                    {/* Specific Data based on Priority */}
                    <div className="space-y-3">
                        {sport === 'SAILING' && sailingMetrics && (
                            <div className="grid grid-cols-2 gap-y-3">
                                <DataField label="Wind Speed" value={`${Math.round(current.wind_speed_10m || 0)} km/h`} icon={<Wind size={10} />} />
                                <DataField label="Direction" value={windDirToCompass(current.wind_direction_10m || 0)} icon={<Navigation size={10} className="rotate-[-45deg]" />} />
                                <DataField label="Wave Height" value={sailingMetrics.wave} icon={<Waves size={10} />} />
                                <DataField label="Water Temp" value={sailingMetrics.water} icon={<Thermometer size={10} />} />
                            </div>
                        )}

                        {sport === 'ENDURO' && enduroMetrics && (
                            <div className="space-y-3">
                                <div className="p-2.5 bg-zinc-900/50 border border-zinc-800 rounded-md">
                                    <div className="text-[8px] text-zinc-600 font-bold uppercase mb-1 tracking-widest">Ground Condition Estimate</div>
                                    <div className={cn("text-xs font-black uppercase italic", enduroMetrics.color)}>
                                        {enduroMetrics.condition}
                                    </div>
                                </div>
                                <DataField label="Days Since Last Rain" value={enduroMetrics.daysSinceRain} icon={<CloudRain size={10} />} />
                            </div>
                        )}

                        {sport === 'SKIING' && skiingMetrics && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-y-3">
                                    <DataField label="Snow Condition" value={skiingMetrics.condition} icon={<Activity size={10} />} />
                                    <DataField label="Snow Layer" value={skiingMetrics.depth} icon={<Snowflake size={10} />} />
                                    <DataField label="Avg Night Temp" value={skiingMetrics.nightAvg !== "N/A" ? `${skiingMetrics.nightAvg}°C` : "N/A"} icon={<Clock size={10} />} />
                                </div>
                                <div className="p-2 bg-indigo-500/5 rounded border border-indigo-500/10">
                                    <div className="text-[8px] text-indigo-400 font-bold uppercase mb-1 tracking-widest">Next Week Snowfall</div>
                                    <div className="text-xs font-black text-indigo-300">
                                        {skiingMetrics.snowForecast > 0 ? `${Math.round(skiingMetrics.snowForecast)}cm expected` : "No snow forecast"}
                                    </div>
                                </div>
                            </div>
                        )}

                        {sport === 'SURF' && (
                            <div className="grid grid-cols-2 gap-y-3">
                                <DataField label="Wave Height" value={typeof marine.data?.wave_height?.[0] === 'number' ? `${marine.data.wave_height[0].toFixed(1)}m` : "Data unavailable"} icon={<Waves size={10} />} />
                                <DataField label="Wave Period" value={typeof marine.data?.wave_period?.[0] === 'number' ? `${marine.data.wave_period[0].toFixed(1)}s` : "Data unavailable"} icon={<Clock size={10} />} />
                                <DataField label="Wind Speed" value={`${Math.round(current.wind_speed_10m || 0)} km/h`} icon={<Wind size={10} />} />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </Widget>
    );
}

function DataField({ label, value, icon }: { label: string, value: string | number, icon?: ReactNode }) {
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest flex items-center gap-1">
                {icon} {label}
            </span>
            <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-tight">{value}</span>
        </div>
    );
}

function F1SubTab() {
    const latestSession = useF1LatestSession();
    const session = latestSession.data;
    const isLive = useMemo(() => isSessionActive(session), [session]);
    const sessionKey = session?.session_key;

    const positions = useF1Positions(sessionKey, isLive);
    const drivers = useF1Drivers(sessionKey);
    const raceControl = useF1RaceControl(sessionKey, isLive);
    const weather = useF1Weather(sessionKey, isLive);
    const pitStops = useF1PitStops(sessionKey, isLive);
    const intervals = useF1Intervals(sessionKey, isLive);

    // Build driver lookup
    const driverMap = useMemo(() => {
        if (!drivers.data) return {};
        const map: Record<number, any> = {};
        drivers.data.forEach((d: any) => { map[d.driver_number] = d; });
        return map;
    }, [drivers.data]);

    // Latest Weather
    const latestWeather = useMemo(() => {
        if (!weather.data || weather.data.length === 0) return null;
        return weather.data[weather.data.length - 1];
    }, [weather.data]);

    // Pit Stops processing (last pit stop per driver)
    const driverPitStops = useMemo(() => {
        if (!pitStops.data || pitStops.data.length === 0) return {};
        const map: Record<number, number> = {};
        pitStops.data.forEach((p: any) => {
            map[p.driver_number] = (map[p.driver_number] || 0) + 1;
        });
        return map;
    }, [pitStops.data]);

    // Intervals map (latest gap per driver)
    const driverIntervals = useMemo(() => {
        if (!intervals.data || intervals.data.length === 0) return {};
        const map: Record<number, any> = {};
        intervals.data.forEach((i: any) => {
            const currentDate = i.date ? new Date(i.date) : new Date(0);
            const prevDate = map[i.driver_number]?.date ? new Date(map[i.driver_number].date) : new Date(0);
            if (!map[i.driver_number] || currentDate.getTime() > prevDate.getTime()) {
                map[i.driver_number] = i;
            }
        });
        return map;
    }, [intervals.data]);

    // Get latest positions per driver
    const latestPositions = useMemo(() => {
        try {
            if (!positions.data || !Array.isArray(positions.data) || positions.data.length === 0) return [];
            const map: Record<number, any> = {};
            positions.data.forEach((p: any) => {
                if (!p || typeof p.driver_number !== 'number') return;
                const currentDate = p.date ? new Date(p.date) : new Date(0);
                const prevDate = map[p.driver_number]?.date ? new Date(map[p.driver_number].date) : new Date(0);
                if (!map[p.driver_number] || (currentDate.getTime() > prevDate.getTime())) {
                    map[p.driver_number] = p;
                }
            });
            return Object.values(map).sort((a: any, b: any) => (a.position || 99) - (b.position || 99));
        } catch (e) {
            console.error('Error processing F1 positions:', e);
            return [];
        }
    }, [positions.data]);

    // Latest flag status
    const flagStatus = useMemo(() => {
        if (!raceControl.data || !Array.isArray(raceControl.data) || raceControl.data.length === 0) return 'UNKNOWN';
        const latest = raceControl.data[raceControl.data.length - 1];
        if (!latest) return 'UNKNOWN';
        const raw = latest.flag || latest.message || 'GREEN';
        return String(raw).toUpperCase();
    }, [raceControl.data]);

    // Next race info
    const nextRace = useMemo(() => {
        const date = session?.date_start ? new Date(session.date_start) : null;
        const isValidDate = date && !isNaN(date.getTime());
        return {
            name: session?.session_name || 'Upcoming GP',
            circuit: session?.circuit_short_name || 'TBD',
            location: session?.location || 'TBD',
            date: isValidDate ? date : null,
        };
    }, [session]);

    // Countdown Logic
    const [timeLeft, setTimeLeft] = useState<string>('');

    useEffect(() => {
        if (!nextRace.date || isNaN(nextRace.date.getTime())) {
            setTimeLeft('TBD');
            return;
        }

        const tick = () => {
            if (!nextRace.date) return;
            const now = new Date().getTime();
            const start = nextRace.date.getTime();
            const diff = start - now;

            if (diff < 0) {
                setTimeLeft('SESSION LIVE');
                return;
            }

            const d = Math.floor(diff / (1000 * 60 * 60 * 24));
            const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft(`${d}D ${h}H ${m}M ${s}S`);
        };

        const timer = setInterval(tick, 1000);
        tick();
        return () => clearInterval(timer);
    }, [nextRace.date]);

    if (isLive) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                        <span className="text-sm font-bold text-zinc-100 uppercase tracking-wider">
                            {session?.session_name} — {session?.circuit_short_name} Live
                        </span>
                    </div>
                    <div className={`px-4 py-1.5 rounded text-[10px] font-black tracking-widest ${flagStatus.includes('RED') ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]' :
                        flagStatus.includes('YELLOW') ? 'bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.4)]' :
                            'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                        }`}>
                        {flagStatus}
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                    <div className="xl:col-span-2 space-y-4">
                        <F1TrackMap sessionKey={sessionKey!} isLive={isLive} driverMap={driverMap} />

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            {latestWeather && (
                                <>
                                    <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg flex flex-col items-center justify-center">
                                        <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-1">
                                            <Thermometer size={12} className="text-amber-500" /> Air Temp
                                        </div>
                                        <div className="text-xl font-black text-zinc-100 italic">{latestWeather.air_temperature}°C</div>
                                    </div>
                                    <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg flex flex-col items-center justify-center">
                                        <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-1">
                                            <Activity size={12} className="text-rose-500" /> Track Temp
                                        </div>
                                        <div className="text-xl font-black text-zinc-100 italic">{latestWeather.track_temperature}°C</div>
                                    </div>
                                    <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg flex flex-col items-center justify-center">
                                        <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-1">
                                            <Wind size={12} className="text-teal-400" /> Wind
                                        </div>
                                        <div className="text-xl font-black text-zinc-100 italic">{latestWeather.wind_speed} m/s</div>
                                    </div>
                                    <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg flex flex-col items-center justify-center">
                                        <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-1">
                                            <Droplets size={12} className="text-blue-400" /> Weather
                                        </div>
                                        <div className="text-xl font-black text-zinc-100 italic">{latestWeather.rainfall ? 'WET' : 'DRY'}</div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <Widget
                        title="Live Timing Tower"
                        icon={<Trophy size={14} />}
                        status="live"
                        loading={positions.isLoading}
                        className="xl:col-span-1 h-full"
                    >
                        <div className="overflow-x-auto h-[440px] scrollbar-hide">
                            <table className="w-full text-sm">
                                <thead className="sticky top-0 bg-zinc-950/90 backdrop-blur-md z-10 border-b border-zinc-800 shadow-sm">
                                    <tr className="text-[9px] text-zinc-500 uppercase tracking-widest font-black">
                                        <th className="text-left py-2 px-1 w-6">P</th>
                                        <th className="text-left py-2">Driver</th>
                                        <th className="text-center py-2">Pit</th>
                                        <th className="text-right py-2 px-2">Interval</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {latestPositions.slice(0, 20).map((pos: any, idx: number) => {
                                        const driver = driverMap[pos.driver_number];
                                        const pitCount = driverPitStops[pos.driver_number] || 0;
                                        const intervalInfo = driverIntervals[pos.driver_number];

                                        return (
                                            <tr key={pos.driver_number} className="border-b border-zinc-800/30 hover:bg-zinc-800/30 transition-colors">
                                                <td className="py-2.5 px-1 text-zinc-400 font-bold italic text-xs">{pos.position}</td>
                                                <td className="py-2.5">
                                                    <div className="flex flex-col">
                                                        <div className="flex items-center gap-1.5">
                                                            <div className="w-1 h-3 rounded-full" style={{ backgroundColor: driver?.team_colour ? `#${driver.team_colour}` : '#3f3f46' }} />
                                                            <span className="font-bold text-zinc-200 uppercase tracking-tighter italic text-xs">
                                                                {driver?.name_acronym || pos.driver_number}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-2.5 text-center px-1">
                                                    <span className="text-[10px] text-zinc-500 font-bold">{pitCount > 0 ? pitCount : '—'}</span>
                                                </td>
                                                <td className="py-2.5 text-right px-2">
                                                    <span className="text-[11px] font-black tracking-widest text-[var(--interval-color,#d4d4d8)]" style={{ "--interval-color": idx === 0 ? "#a855f7" : "#d4d4d8" } as any}>
                                                        {idx === 0 ? 'LEADER' : intervalInfo?.gap_to_leader ? `+${intervalInfo.gap_to_leader.toFixed(3)}` : '—'}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </Widget>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <Widget title="Grand Prix Preview" icon={<Flag size={14} />}>
                <div className="flex flex-col sm:flex-row items-center gap-8 py-10 px-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-3xl bg-zinc-900 border-2 border-zinc-800 flex items-center justify-center shadow-2xl overflow-hidden group">
                            <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <Flag size={36} className="text-red-500 relative z-10" />
                        </div>
                        {isLive && <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-4 border-zinc-950 animate-pulse" />}
                    </div>

                    <div className="text-center sm:text-left flex-1 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-4">
                            <h3 className="text-3xl font-black text-zinc-100 uppercase tracking-tighter italic leading-none">{nextRace.name}</h3>
                            <span className="text-xs font-bold text-red-500 uppercase tracking-[0.3em] pb-1">{nextRace.location}</span>
                        </div>

                        <div className="flex flex-wrap justify-center sm:justify-start gap-6 pt-2">
                            <div className="space-y-1">
                                <div className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">Configuration</div>
                                <div className="text-xs font-bold text-zinc-400 flex items-center gap-2">
                                    <Navigation size={12} className="text-zinc-700" />
                                    {nextRace.circuit}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">Session Start</div>
                                <div className="text-xs font-bold text-zinc-400 flex items-center gap-2">
                                    <Clock size={12} className="text-zinc-700" />
                                    {nextRace.date?.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} @ {nextRace.date?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center sm:items-end gap-2">
                        <div className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em]">Countdown</div>
                        <div className="text-3xl font-black text-zinc-100 font-mono tracking-tighter tabular-nums text-red-500">
                            {timeLeft || '---'}
                        </div>
                    </div>
                </div>
            </Widget>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <div className="xl:col-span-2 flex flex-col gap-4">
                    <F1TrackMap sessionKey={sessionKey!} isLive={false} driverMap={driverMap} />

                    <Widget title="Track Area Conditions" icon={<Sun size={14} />} loading={weather.isLoading}>
                        <div className="flex flex-col gap-4 py-2">
                            {latestWeather ? (
                                <>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                                        <div className="p-3 bg-zinc-900/30 border border-zinc-800/50 rounded-lg flex flex-col items-center">
                                            <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-1">
                                                <Thermometer size={10} /> Air Temp
                                            </div>
                                            <div className="text-lg font-black text-amber-500/80 italic">{latestWeather.air_temperature}°C</div>
                                        </div>
                                        <div className="p-3 bg-zinc-900/30 border border-zinc-800/50 rounded-lg flex flex-col items-center">
                                            <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-1">
                                                <Activity size={10} /> Track Temp
                                            </div>
                                            <div className="text-lg font-black text-rose-500/80 italic">{latestWeather.track_temperature}°C</div>
                                        </div>
                                        <div className="p-3 bg-zinc-900/30 border border-zinc-800/50 rounded-lg flex flex-col items-center">
                                            <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-1">
                                                <Droplets size={10} /> Humidity
                                            </div>
                                            <div className="text-lg font-black text-blue-400/80 italic">{latestWeather.humidity}%</div>
                                        </div>
                                        <div className="p-3 bg-zinc-900/30 border border-zinc-800/50 rounded-lg flex flex-col items-center">
                                            <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-1">
                                                <Wind size={10} /> Wind
                                            </div>
                                            <div className="text-lg font-black text-teal-400/80 italic">{latestWeather.wind_speed} m/s</div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-xs text-center text-zinc-500 italic py-8">No weather telemetry available</div>
                            )}
                        </div>
                    </Widget>
                </div>

                <Widget title="Session Standings" icon={<Trophy size={14} />} className="xl:col-span-1" loading={positions.isLoading}>
                    <div className="overflow-x-auto h-[440px] scrollbar-hide">
                        <table className="w-full text-sm">
                            <thead className="sticky top-0 bg-zinc-950/90 backdrop-blur-md z-10 border-b border-zinc-800 shadow-sm">
                                <tr className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">
                                    <th className="text-left py-2 px-2 w-8">P</th>
                                    <th className="text-left py-2">Driver</th>
                                    <th className="text-center py-2">Pits</th>
                                    <th className="text-right py-2 px-2">Gap</th>
                                </tr>
                            </thead>
                            <tbody>
                                {latestPositions.length > 0 ? latestPositions.slice(0, 20).map((pos: any, idx: number) => {
                                    const driver = driverMap[pos.driver_number];
                                    const pitCount = driverPitStops[pos.driver_number] || 0;
                                    const intervalInfo = driverIntervals[pos.driver_number];
                                    return (
                                        <tr key={pos.driver_number} className="border-b border-zinc-800/30 last:border-0 hover:bg-zinc-800/20 transition-colors">
                                            <td className="py-2.5 px-2 w-8 font-black italic text-zinc-500">{pos.position || idx + 1}</td>
                                            <td className="py-2.5 flex items-center gap-2">
                                                <div className="w-1 h-3 rounded-full" style={{ backgroundColor: driver?.team_colour ? `#${driver.team_colour}` : '#3f3f46' }} />
                                                <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest leading-none">{driver?.name_acronym || driver?.full_name || `Driver ${pos.driver_number}`}</span>
                                            </td>
                                            <td className="py-2.5 text-center">
                                                <span className="text-[10px] text-zinc-500 font-bold">{pitCount > 0 ? pitCount : '—'}</span>
                                            </td>
                                            <td className="py-2.5 px-2 text-right">
                                                <span className="text-[10px] font-black tracking-widest text-zinc-300">
                                                    {(pos.position === 1 || idx === 0) ? 'LEADER' : intervalInfo?.gap_to_leader ? `+${intervalInfo.gap_to_leader.toFixed(3)}s` : '—'}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan={4} className="py-8 text-zinc-500 italic text-xs text-center">No session data available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Widget>
            </div>
        </div>
    );
}


