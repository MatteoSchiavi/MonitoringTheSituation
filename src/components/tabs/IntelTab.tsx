import { useState, useMemo, lazy, Suspense } from 'react';
import { Widget } from '../ui/Widget';
import { useDisasters, useEarthquakes, usePizzaIndex, useFlights, useWildfires, useNewsHotspots } from '../../hooks/useIntelQueries';
import { useTopHeadlines } from '../../hooks/useNewsQueries';
import { Globe, Activity, AlertTriangle, BarChart, Flame, Pizza, TrendingUp, Zap, Cloud } from 'lucide-react';

// Lazy load the map component (code-splitting for Leaflet)
const IntelMap = lazy(() => import('../widgets/IntelMap'));

export default function IntelTab() {
    const [activeSubTab, setActiveSubTab] = useState<'overview' | 'map'>('map');
    const [activeLayersIds, setActiveLayersIds] = useState<string[]>(['conflicts', 'earthquakes', 'flights', 'wildfires', 'news-hotspots']);
    const disasters = useDisasters();
    const earthquakes = useEarthquakes();
    const pizzaIndex = usePizzaIndex();
    const headlines = useTopHeadlines();
    const flights = useFlights();
    const wildfires = useWildfires();
    const newsHotspots = useNewsHotspots();

    // News Volatility Index: based on volume and frequency of breaking news
    const volatilityIndex = useMemo(() => {
        try {
            if (!headlines.data || !Array.isArray(headlines.data) || headlines.data.length === 0) {
                return { score: 0, label: 'Unknown', color: 'text-zinc-500' };
            }
            const count = headlines.data.length;
            const now = Date.now();
            const recentCount = headlines.data.filter((a: any) => {
                if (!a || !a.publishedAt) return false;
                const age = now - new Date(a.publishedAt).getTime();
                return age < 2 * 60 * 60 * 1000; // last 2 hours
            }).length;

            const score = Math.min(100, Math.round((recentCount / Math.max(count, 1)) * 100 + count * 3));
            if (score > 75) return { score, label: 'Very High', color: 'text-red-400' };
            if (score > 50) return { score, label: 'Elevated', color: 'text-amber-400' };
            if (score > 25) return { score, label: 'Normal', color: 'text-emerald-400' };
            return { score, label: 'Low', color: 'text-blue-400' };
        } catch (e) {
            console.error('Error calculating volatility index:', e);
            return { score: 0, label: 'Error', color: 'text-zinc-500' };
        }
    }, [headlines.data]);

    const layerGroups = [
        {
            name: 'Kinetic',
            layers: [
                { id: 'flights', label: 'Aviation', icon: Globe },
                { id: 'conflicts', label: 'Conflict Pulse', icon: AlertTriangle },
                { id: 'wildfires', label: 'Thermal Anomalies', icon: Flame },
            ]
        },
        {
            name: 'Intelligence',
            layers: [
                { id: 'news-hotspots', label: 'News Hotspots', icon: TrendingUp },
            ]
        },
        {
            name: 'Environmental',
            layers: [
                { id: 'earthquakes', label: 'Seismic activity', icon: Activity },
                { id: 'radiation', label: 'Radiation network', icon: Zap },
                { id: 'weather', label: 'Meteorological', icon: Cloud },
            ]
        }
    ];

    const activeLayer = useMemo(() => {
        return activeLayersIds;
    }, [activeLayersIds]);

    const toggleLayer = (id: string) => {
        setActiveLayersIds(prev =>
            prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
        );
    };

    return (
        <div className="p-4 space-y-4 max-w-[1800px] mx-auto tab-content">
            {/* Sub-tab Navigation */}
            <div className="flex gap-2 border-b border-zinc-800 pb-2">
                <button
                    onClick={() => setActiveSubTab('overview')}
                    className={`px-4 py-2 text-sm font-bold transition-colors ${activeSubTab === 'overview'
                        ? 'text-zinc-100 border-b-2 border-emerald-500'
                        : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                >
                    Overview
                </button>
                <button
                    onClick={() => setActiveSubTab('map')}
                    className={`px-4 py-2 text-sm font-bold transition-colors ${activeSubTab === 'map'
                        ? 'text-zinc-100 border-b-2 border-emerald-500'
                        : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                >
                    Global Map View
                </button>
            </div>

            {activeSubTab === 'overview' ? (
                <>
                    {/* Top Row: Indicators */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* News Volatility Index */}
                        <Widget title="News Volatility" icon={<BarChart size={14} />}>
                            <div className="flex items-center gap-4">
                                <div className="relative w-16 h-16">
                                    <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                                        <circle cx="18" cy="18" r="14" fill="none" stroke="#27272a" strokeWidth="3" />
                                        <circle
                                            cx="18" cy="18" r="14" fill="none"
                                            stroke={volatilityIndex.score > 75 ? '#f87171' : volatilityIndex.score > 50 ? '#fbbf24' : '#34d399'}
                                            strokeWidth="3"
                                            strokeDasharray={`${volatilityIndex.score * 0.88} 88`}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-sm font-bold text-zinc-200">{volatilityIndex.score}</span>
                                    </div>
                                </div>
                                <div>
                                    <p className={`text-sm font-semibold ${volatilityIndex.color}`}>{volatilityIndex.label}</p>
                                    <p className="text-[10px] text-zinc-600">News cycle intensity</p>
                                    <p className="text-[9px] text-zinc-500 mt-1">Based on breaking news volume/freq relative to baseline.</p>
                                </div>
                            </div>
                        </Widget>

                        {/* Pizza Index */}
                        <Widget
                            title="Pizza Index"
                            icon={<Pizza size={14} />}
                            status={pizzaIndex.isLoading ? 'loading' : pizzaIndex.isError ? 'warning' : 'online'}
                            loading={pizzaIndex.isLoading}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                                    <Pizza size={20} className="text-amber-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-zinc-300">
                                        {pizzaIndex.isError ? 'Unavailable' : 'Monitoring'}
                                    </p>
                                    <p className="text-[10px] text-zinc-500">Pentagon area delivery activity</p>
                                </div>
                            </div>
                        </Widget>

                        {/* Active Conflicts */}
                        <Widget
                            title="Active Crises"
                            icon={<AlertTriangle size={14} />}
                            loading={disasters.isLoading}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                                    <Flame size={20} className="text-red-400" />
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-zinc-200">{disasters.data?.length || 0}</p>
                                    <p className="text-[10px] text-zinc-500">Ongoing worldwide</p>
                                </div>
                            </div>
                        </Widget>

                    </div>

                    {/* Prediction Markets Placeholder */}
                    <Widget title="Prediction Markets" icon={<TrendingUp size={14} />} status="warning">
                        <div className="flex flex-col items-center justify-center py-6 gap-3 text-center">
                            <TrendingUp size={24} className="text-zinc-600" />
                            <p className="text-sm text-zinc-400">Top prediction market picks</p>
                            <p className="text-xs text-zinc-600">
                                Polymarket and Metaculus integration showing what everyone is thinking about the current world situation.
                            </p>
                        </div>
                    </Widget>
                </>
            ) : (
                <>
                    {/* Layer Controls Categorized */}
                    <div className="space-y-3 bg-zinc-900/80 p-4 rounded-xl border border-zinc-800 backdrop-blur-md">
                        {layerGroups.map(group => (
                            <div key={group.name} className="space-y-2">
                                <div className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">
                                    {group.name} DATA
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {group.layers.map(layer => {
                                        const Icon = layer.icon;
                                        const active = activeLayersIds.includes(layer.id);
                                        return (
                                            <button
                                                key={layer.id}
                                                onClick={() => toggleLayer(layer.id)}
                                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-bold transition-all border ${active
                                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.05)]'
                                                    : 'bg-zinc-950/50 text-zinc-500 border-zinc-800 hover:text-zinc-300 hover:border-zinc-700'
                                                    }`}
                                            >
                                                <Icon size={12} className={active ? 'text-emerald-400' : 'text-zinc-600'} />
                                                {layer.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Full Map Container */}
                    <div className="relative h-[calc(100vh-220px)] min-h-[500px] border-2 border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
                        <Suspense fallback={
                            <div className="flex items-center justify-center h-full bg-zinc-900">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-10 h-10 border-4 border-zinc-800 border-t-emerald-500 rounded-full animate-spin" />
                                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Loading Geographic Data...</p>
                                </div>
                            </div>
                        }>
                            <IntelMap
                                activeLayers={activeLayer}
                                disasters={disasters.data || []}
                                earthquakes={earthquakes.data || []}
                                flights={flights.data || []}
                                wildfires={wildfires.data || []}
                                newsHotspots={newsHotspots.data || []}
                            />
                        </Suspense>
                    </div>
                </>
            )}
        </div>
    );
}
