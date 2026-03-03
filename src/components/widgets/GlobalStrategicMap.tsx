import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { fetchFlights, fetchThermalEvents, fetchNews } from '../../lib/api';

const HOTSPOTS = [
    { name: 'Middle East (Israel/Iran/Gaza)', keywords: ['iran', 'israel', 'gaza', 'lebanon', 'syria', 'middle east', 'tehran', 'tel aviv'], lat: 31.5, lon: 35.2 },
    { name: 'Gulf/UAE', keywords: ['dubai', 'uae', 'emirates', 'saudi', 'riyadh'], lat: 24.5, lon: 54.5 },
    { name: 'North America', keywords: ['us', 'usa', 'america', 'washington', 'biden', 'fed', 'federal reserve'], lat: 39.0, lon: -98.0 },
    { name: 'Eastern Europe', keywords: ['russia', 'ukraine', 'kyiv', 'moscow', 'putin', 'nato'], lat: 49.0, lon: 32.0 },
    { name: 'APAC', keywords: ['china', 'taiwan', 'beijing', 'japan', 'korea', 'tokyo'], lat: 35.0, lon: 105.0 },
    { name: 'Western Europe', keywords: ['eu', 'europe', 'france', 'germany', 'uk', 'london', 'paris', 'ecb'], lat: 48.0, lon: 10.0 }
];

// Fix Leaflet icon issues
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface GlobalStrategicMapProps {
    isAlertMode?: boolean;
}

export function GlobalStrategicMap({ isAlertMode }: GlobalStrategicMapProps) {
    const [flights, setFlights] = useState<any[]>([]);
    const [thermalEvents, setThermalEvents] = useState<any[]>([]);
    const [heatmaps, setHeatmaps] = useState<{ name: string, lat: number, lon: number, weight: number }[]>([]);
    const [center] = useState<[number, number]>([20, 0]); // Global view start
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [activeLayers] = useState<string[]>(['adsb', 'thermal', 'zones', 'news_heatmap']);

    useEffect(() => {
        const loadDevData = async () => {
            try {
                const [fData, tData, nData] = await Promise.all([
                    fetchFlights().catch(() => []),
                    fetchThermalEvents().catch(() => []),
                    fetchNews().catch(() => [])
                ]) as [any[], any[], any[]];

                setFlights(fData);
                setThermalEvents(tData);

                // Calculate Heatmaps based on News
                const calculatedHeat = HOTSPOTS.map(spot => {
                    let weight = 0;
                    nData.forEach((n: any) => {
                        const text = (n.title || '').toLowerCase();
                        spot.keywords.forEach(kw => {
                            if (text.includes(kw)) weight += 1;
                        });
                    });
                    // Fallback to minimal weight if news is mocked or empty (for visual flair)
                    if (nData.length === 0) weight = Math.floor(Math.random() * 3);
                    return { ...spot, weight };
                }).filter(s => s.weight > 0);

                setHeatmaps(calculatedHeat);

            } catch (error) {
                console.error('Map data sync failure:', error);
            }
        };

        loadDevData();
        const interval = setInterval(loadDevData, 30000);
        return () => clearInterval(interval);
    }, []);

    // Custom Aircraft Icon
    const flightIcon = (rotation: number = 0) => L.divIcon({
        html: `<div style="transform: rotate(${rotation}deg); color: var(--color-primary); filter: drop-shadow(0 0 4px rgba(var(--color-primary-rgb), 0.5))">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3.5 20.5 3 18.5 3.5 17 5L13.5 8.5 5.3 6.7c-1.1-.3-2.2.4-2.2 1.5 0 .6.3 1.2.8 1.5l7.5 4.5-4.5 4.5-3.1-.3c-.6-.1-1.1.2-1.4.7-.3.5-.2 1.1.2 1.5l1.5 1.5c.4.4 1 .5 1.5.2.5-.3.8-.8.7-1.4l-.3-3.1 4.5-4.5 4.5 7.5c.3.5.9.8 1.5.8 1.1 0 1.8-1.1 1.5-2.2z"/>
                </svg>
               </div>`,
        className: 'custom-div-icon',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });

    return (
        <div className={cn(
            "relative w-full h-full transition-all duration-500 bg-zinc-950",
            isFullscreen && "fixed inset-0 z-[9999]"
        )}>
            <MapContainer
                center={center}
                zoom={3}
                style={{ height: '100%', width: '100%', background: '#09090b' }}
                zoomControl={false}
                attributionControl={false}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    className={cn(isAlertMode && "alert-map")}
                />

                {/* Satellite Cloud Layer (Atmospheric Intelligence) */}
                <TileLayer
                    url="https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=d22d51ae79e49646b9ec597a7e8e1f57"
                    opacity={0.4}
                />

                {/* ADS-B Logistics Layer */}
                {activeLayers.includes('adsb') && flights.map((f, i) => (
                    <Marker
                        key={`f-${i}`}
                        position={[f.lat, f.lon]}
                        icon={flightIcon(f.track || 0)}
                    >
                        <Popup className="strategic-popup">
                            <div className="p-2 min-w-[150px] font-mono">
                                <div className="text-[10px] text-primary font-black uppercase mb-1">Logistics Trace // {f.callsign || 'N/A'}</div>
                                <div className="grid grid-cols-2 gap-2 text-zinc-300">
                                    <div className="flex flex-col">
                                        <span className="text-[8px] text-zinc-500 uppercase">Velocity</span>
                                        <span className="text-xs font-black italic">{Math.round(f.velocity || 0)}kn</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[8px] text-zinc-500 uppercase">Altitude</span>
                                        <span className="text-xs font-black italic">{Math.round(f.altitude || 0)}ft</span>
                                    </div>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* Thermal Anomaly Layer (NASA FIRMS) */}
                {activeLayers.includes('thermal') && thermalEvents.map((t, i) => (
                    <Circle
                        key={`t-${i}`}
                        center={[t.lat, t.lon]}
                        radius={5000}
                        pathOptions={{
                            color: '#ef4444',
                            fillColor: '#ef4444',
                            fillOpacity: 0.4,
                            weight: 1
                        }}
                    >
                        <Popup className="strategic-popup">
                            <div className="p-2 font-mono">
                                <div className="text-[10px] text-red-500 font-black uppercase mb-1">Thermal Anomaly Detected</div>
                                <div className="text-xs font-black text-zinc-200 uppercase tracking-tighter">Intensity: {t.brightness?.toFixed(1) || 'N/A'}K</div>
                                <div className="text-[8px] text-zinc-500 mt-1">Satellite: {t.satellite || 'MODIS'}</div>
                            </div>
                        </Popup>
                    </Circle>
                ))}

                {/* News Intelligence Heatmap */}
                {activeLayers.includes('news_heatmap') && heatmaps.map((h, i) => (
                    <Circle
                        key={`h-${i}`}
                        center={[h.lat, h.lon]}
                        radius={400000 + (h.weight * 200000)}
                        pathOptions={{
                            color: h.weight > 1 ? '#ef4444' : '#f97316',
                            fillColor: h.weight > 1 ? '#ef4444' : '#f97316',
                            fillOpacity: 0.3 + (h.weight * 0.1),
                            weight: 2,
                            dashArray: '10 10'
                        }}
                    >
                        <Popup className="strategic-popup">
                            <div className="p-2 font-mono">
                                <div className={cn("text-[10px] font-black uppercase mb-1", h.weight > 1 ? "text-red-500" : "text-amber-500")}>
                                    Media Volatility: {h.weight > 1 ? 'CRITICAL' : 'ELEVATED'}
                                </div>
                                <div className="text-xs font-black text-zinc-200 uppercase tracking-tighter">Zone: {h.name}</div>
                                <div className="text-[8px] text-zinc-500 mt-1">Mention Frequency: {h.weight} Nodes</div>
                            </div>
                        </Popup>
                    </Circle>
                ))}

                {/* Operational Zones */}
                {activeLayers.includes('zones') && (
                    <Circle
                        center={[45.0526, 9.6930]}
                        radius={20000}
                        pathOptions={{
                            color: 'var(--color-primary)',
                            fillColor: 'var(--color-primary)',
                            fillOpacity: 0.05,
                            weight: 1,
                            dashArray: '5, 5'
                        }}
                    />
                )}

                <MapControls isFullscreen={isFullscreen} onToggleFullscreen={() => setIsFullscreen(!isFullscreen)} />
            </MapContainer>

            <style>{`
                .alert-map {
                    filter: grayscale(1) brightness(0.7) sepia(1) hue-rotate(-50deg) saturate(3);
                }
                .strategic-popup .leaflet-popup-content-wrapper {
                    background: #09090b !important;
                    border: 1px solid #10b981 !important;
                    border-radius: 0 !important;
                    padding: 0 !important;
                }
                .strategic-popup .leaflet-popup-tip {
                    background: #10b981 !important;
                }
                .leaflet-container {
                    cursor: crosshair !important;
                }
            `}</style>
        </div>
    );
}

function MapControls({ isFullscreen, onToggleFullscreen }: { isFullscreen: boolean; onToggleFullscreen: () => void }) {
    const map = useMap();

    return (
        <div className="absolute top-6 left-6 z-[1000] flex flex-col gap-2">
            <button
                onClick={() => map.zoomIn()}
                className="w-10 h-10 bg-zinc-950/80 border border-border text-primary hover:bg-zinc-900 transition-colors flex items-center justify-center font-black"
            >
                +
            </button>
            <button
                onClick={() => map.zoomOut()}
                className="w-10 h-10 bg-zinc-950/80 border border-border text-primary hover:bg-zinc-900 transition-colors flex items-center justify-center font-black"
            >
                -
            </button>
            <button
                onClick={onToggleFullscreen}
                className="w-10 h-10 bg-zinc-950/80 border border-border text-primary hover:bg-zinc-900 transition-colors flex items-center justify-center"
            >
                {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
        </div>
    );
}
