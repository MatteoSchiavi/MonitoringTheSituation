import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Supercluster from 'supercluster';

// @ts-ignore
import Terminator from 'leaflet-terminator';

interface IntelMapProps {
    activeLayers: string[];
    disasters: any[];
    earthquakes: any[];
    flights: any[];
    wildfires: any[];
    newsHotspots?: any[];
}

function DayNightOverlay() {
    const map = useMap();
    const terminatorRef = useRef<any>(null);

    useEffect(() => {
        let isMounted = true;

        const initTerminator = () => {
            if (!isMounted || !map) return;

            try {
                // Ensure map has valid bounds before initializing terminator
                const center = map.getCenter();
                if (!center || isNaN(center.lat) || isNaN(center.lng)) {
                    setTimeout(initTerminator, 500);
                    return;
                }

                if (!terminatorRef.current && typeof Terminator === 'function') {
                    terminatorRef.current = Terminator({
                        fillColor: '#000',
                        fillOpacity: 0.3,
                        resolution: 2
                    });
                    terminatorRef.current.addTo(map);
                }
            } catch (e) {
                console.error('Terminator initialization failed:', e);
            }
        };

        // Delay initialization slightly to ensure Leaflet has initialized the map container
        const timeout = setTimeout(initTerminator, 100);

        const interval = setInterval(() => {
            if (terminatorRef.current && typeof Terminator === 'function' && map) {
                try {
                    const newTerminator = Terminator({
                        fillColor: '#000',
                        fillOpacity: 0.3,
                        resolution: 2
                    });
                    map.removeLayer(terminatorRef.current);
                    terminatorRef.current = newTerminator;
                    newTerminator.addTo(map);
                } catch (e) {
                    console.error('Terminator update failed:', e);
                }
            }
        }, 60000);

        return () => {
            isMounted = false;
            clearTimeout(timeout);
            clearInterval(interval);
            if (terminatorRef.current && map) {
                try {
                    map.removeLayer(terminatorRef.current);
                } catch (e) {
                    // Ignore errors during cleanup
                }
            }
        };
    }, [map]);

    return null;
}

// ─── Custom Icons ───
const createCustomIcon = (color: string, size: number = 12) => {
    return L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color:${color}; width:${size}px; height:${size}px; border-radius:50%; border:2px solid white; box-shadow: 0 0 5px ${color};"></div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2]
    });
};

const createPlaneIcon = (color: string, rotation = 0) => {
    return L.divIcon({
        className: 'plane-icon',
        html: `<div style="transform: rotate(${rotation}deg); color: ${color}; filter: drop-shadow(0 0 2px rgba(0,0,0,0.5));">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
            </svg>
        </div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });
};

const getEarthquakeIcon = (mag: number) => {
    const size = Math.max(12, Math.min(30, (mag || 0) * 4));
    const color = mag > 6 ? '#ef4444' : mag > 4 ? '#f97316' : '#facc15';
    return L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color:${color}; width:${size}px; height:${size}px; border-radius:50%; border:2px solid white; box-shadow: 0 0 10px ${color};"></div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2]
    });
};

const ICONS = {
    disaster: createCustomIcon('#ef4444'),
    wildfire: createCustomIcon('#f97316'), // Orange for fire
    news: createCustomIcon('#a855f7'), // Purple for news
};

function ClusterLayer({ data, activeLayers }: { data: any[], activeLayers: string[] }) {
    const map = useMap();
    const [bounds, setBounds] = useState<any>(null);
    const [zoom, setZoom] = useState<number>(map.getZoom());

    // Initialize supercluster
    const supercluster = useMemo(() => {
        const index = new Supercluster({
            radius: 40,
            maxZoom: 16,
            // Track dominant layer type in clusters
            map: (props) => ({ [props.layer]: 1 }),
            reduce: (acc: any, props: any) => {
                Object.keys(props).forEach(key => {
                    acc[key] = (acc[key] || 0) + props[key];
                });
            }
        });
        // Filter based on active layers - EXCLUDE FLIGHTS from clustering
        const geoJsonData = data.filter(d => activeLayers.includes(d.layer) && d.layer !== 'flights').map(d => ({
            type: 'Feature',
            properties: { cluster: false, ...d },
            geometry: { type: 'Point', coordinates: [d.lon, d.lat] }
        }));
        // @ts-ignore
        index.load(geoJsonData);
        return index;
    }, [data, activeLayers]);

    const updateView = useCallback(() => {
        const b = map.getBounds();
        setBounds([
            b.getWest(),
            b.getSouth(),
            b.getEast(),
            b.getNorth()
        ]);
        setZoom(map.getZoom());
    }, [map]);

    useEffect(() => {
        updateView();
        map.on('moveend', updateView);
        return () => {
            map.off('moveend', updateView);
        };
    }, [map, updateView]);

    const clusters = useMemo(() => {
        if (!bounds) return [];
        return supercluster.getClusters(bounds, zoom);
    }, [supercluster, bounds, zoom]);

    return (
        <>
            {clusters.map((cluster: any, i: number) => {
                const [lon, lat] = cluster.geometry.coordinates;
                const { cluster: isCluster, point_count: pointCount, layer, name, magnitude, temp } = cluster.properties;

                if (isCluster) {
                    const size = Math.min(60, 20 + (pointCount / 50) * 20);
                    // Determine dominant layer color for cluster from reduced properties
                    const counts = cluster.properties;
                    let dominantLayer = 'default';
                    let maxCount = 0;
                    ['conflicts', 'earthquakes', 'wildfires', 'news-hotspots'].forEach(l => {
                        if (counts[l] > maxCount) {
                            maxCount = counts[l];
                            dominantLayer = l;
                        }
                    });

                    let color = 'rgba(16, 185, 129, 0.8)'; // default emerald
                    if (dominantLayer === 'conflicts') color = 'rgba(239, 68, 68, 0.8)';
                    if (dominantLayer === 'earthquakes') color = 'rgba(249, 115, 22, 0.8)';
                    if (dominantLayer === 'wildfires') color = 'rgba(250, 204, 21, 0.8)';
                    if (dominantLayer === 'news-hotspots') color = 'rgba(168, 85, 247, 0.8)';

                    const clusterIcon = L.divIcon({
                        className: 'custom-cluster-icon',
                        html: `<div style="background-color:${color}; width:${size}px; height:${size}px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; font-weight:bold; font-size:10px; border:2px solid rgba(255,255,255,0.2);">${pointCount}</div>`,
                        iconSize: [size, size],
                        iconAnchor: [size / 2, size / 2]
                    });

                    return (
                        <Marker
                            key={`cluster-${cluster.id}`}
                            position={[lat, lon]}
                            icon={clusterIcon}
                            eventHandlers={{
                                click: () => {
                                    const expansionZoom = Math.min(supercluster.getClusterExpansionZoom(cluster.id), 16);
                                    map.setView([lat, lon], expansionZoom, { animate: true });
                                }
                            }}
                        />
                    );
                }

                // Single Marker
                let icon = ICONS.disaster;
                if (layer === 'earthquakes') return (
                    <Marker key={`earthquake-${i}`} position={[lat, lon]} icon={getEarthquakeIcon(magnitude)}>
                        <Popup className="intel-popup">
                            <div className="text-xs space-y-1">
                                <strong className="text-orange-400">SEISMIC EVENT</strong>
                                <div className="text-sm font-bold text-zinc-100">{name}</div>
                                <div className="flex justify-between items-center text-zinc-400">
                                    <span>MAGNITUDE</span>
                                    <span className="font-mono text-zinc-100">{magnitude || 'N/A'}</span>
                                </div>
                                <div className="text-[10px] text-zinc-500 uppercase tracking-tighter">USGS PRECISION DATA</div>
                            </div>
                        </Popup>
                    </Marker>
                );

                if (layer === 'wildfires') return (
                    <Marker key={`wildfire-${i}`} position={[lat, lon]} icon={ICONS.wildfire}>
                        <Popup className="intel-popup">
                            <div className="text-xs space-y-1">
                                <strong className="text-orange-500">THERMAL ANOMALY</strong>
                                <div className="text-sm font-bold text-zinc-100">Active Fire Detected</div>
                                <div className="text-zinc-400">NASA FIRMS Satellite Intel</div>
                                {temp && <div className="text-zinc-500">Brightness Temp: {temp}K</div>}
                                <div className="text-[10px] text-zinc-600 font-mono">CONFIDENCE: {cluster.properties.confidence || 'N/A'}</div>
                            </div>
                        </Popup>
                    </Marker>
                );

                if (layer === 'news-hotspots') {
                    const intensity = cluster.properties.intensity || 1;
                    const size = Math.max(12, Math.min(24, 12 + (intensity * 2)));
                    return (
                        <Marker key={`news-${i}`} position={[lat, lon]} icon={createCustomIcon('#a855f7', size)}>
                            <Popup className="intel-popup">
                                <div className="text-xs space-y-1">
                                    <strong className="text-purple-400">NEWS HOTSPOT</strong>
                                    <div className="text-sm font-bold text-zinc-100">{name}</div>
                                    <div className="text-zinc-400">Mention Intensity: {intensity} articles</div>
                                    <div className="text-[10px] text-zinc-500 italic">Trending in global news cycle</div>
                                </div>
                            </Popup>
                        </Marker>
                    );
                }

                if (layer === 'conflicts') {
                    return (
                        <Marker key={`marker-${i}`} position={[lat, lon]} icon={ICONS.disaster}>
                            <Popup className="intel-popup">
                                <div className="text-xs space-y-1">
                                    <strong className="text-red-400 uppercase tracking-widest">Global Crisis Alert</strong>
                                    <div className="font-bold text-sm text-zinc-100">{name}</div>
                                    <p className="text-zinc-400 italic line-clamp-3">{cluster.properties.description || cluster.properties.type || 'Ongoing situation'}</p>
                                    <div className="text-[10px] text-zinc-600 uppercase border-t border-zinc-800 pt-1 mt-1">Source: ReliefWeb Intel</div>
                                </div>
                            </Popup>
                        </Marker>
                    );
                }

                return (
                    <Marker key={`marker-${i}`} position={[lat, lon]} icon={icon}>
                        <Popup className="intel-popup">
                            <div className="text-xs">
                                <strong>{name || layer.toUpperCase()}</strong>
                                <br />
                                <span className="text-zinc-400 capitalize">{layer}</span>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </>
    );
}

export default function IntelMap({ activeLayers, disasters, earthquakes, flights, wildfires, newsHotspots }: IntelMapProps) {
    // Combine dataset into unified array with robust validation
    const mapData = useMemo(() => {
        const combined: any[] = [];
        const isValid = (lat: any, lon: any) =>
            typeof lat === 'number' && typeof lon === 'number' && !isNaN(lat) && !isNaN(lon);

        if (disasters) {
            combined.push(...disasters
                .filter(d => isValid(d.lat, d.lon))
                .map(d => ({ ...d, layer: 'conflicts' })));
        }

        if (earthquakes) {
            combined.push(...earthquakes.filter(e => {
                const coords = e.geometry?.coordinates;
                return coords && isValid(coords[1], coords[0]);
            }).map(e => {
                const coords = e.geometry.coordinates;
                return {
                    lat: coords[1],
                    lon: coords[0],
                    magnitude: e.properties?.mag || 0,
                    name: e.properties?.place || 'Earthquake',
                    layer: 'earthquakes'
                };
            }));
        }

        if (flights) {
            combined.push(...flights
                .slice(0, 500)
                .filter(f => isValid(f.lat, f.lon))
                .map(f => ({ ...f, name: f.callsign, layer: 'flights' })));
        }

        if (wildfires) {
            combined.push(...wildfires
                .slice(0, 500)
                .filter(w => isValid(w.lat, w.lon))
                .map(w => ({ ...w, name: 'Wildfire', layer: 'wildfires' })));
        }

        if (newsHotspots) {
            combined.push(...newsHotspots
                .filter(n => isValid(n.lat, n.lon))
                .map(n => ({ ...n, layer: 'news-hotspots' })));
        }

        return combined;
    }, [disasters, earthquakes, flights, wildfires, newsHotspots]);

    return (
        <div className="h-full w-full relative">
            <MapContainer
                center={[20, 0]}
                zoom={3}
                className="h-full w-full rounded-b-xl"
                style={{ background: '#09090b', zIndex: 1 }}
                zoomControl={true}
                attributionControl={false}
                minZoom={2}
                maxZoom={16}
                worldCopyJump={true}
            >
                {/* Clean dark basemap without labels for high contrast */}
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
                    maxZoom={18}
                />

                {/* Real-time sun/moon terminator overlay */}
                <DayNightOverlay />

                {/* Conflict Highlight Circles (Background) */}
                {activeLayers.includes('conflicts') && disasters?.filter(d => d.lat && d.lon).map((d, i) => (
                    <CircleMarker
                        key={`conflict-zone-${i}`}
                        center={[d.lat, d.lon]}
                        radius={20}
                        pathOptions={{
                            fillColor: '#ef4444',
                            fillOpacity: 0.15,
                            color: '#ef4444',
                            weight: 1,
                            dashArray: '5, 5'
                        }}
                    />
                ))}

                {/* Individual Flights (Non-Clustered) */}
                {activeLayers.includes('flights') && flights?.slice(0, 500).map((f, i) => (
                    <Marker
                        key={`plane-${i}`}
                        position={[f.lat, f.lon]}
                        icon={createPlaneIcon(f.isMilitary ? '#ef4444' : '#3b82f6', f.track || 0)}
                    >
                        <Popup className="intel-popup">
                            <div className="text-[10px] space-y-1">
                                <div className="flex items-center justify-between gap-4">
                                    <strong className={f.isMilitary ? 'text-red-400' : 'text-blue-400'}>
                                        {f.isMilitary ? 'MILITARY OPERATIONAL' : 'CIVILIAN FLIGHT'}
                                    </strong>
                                    <span className="font-mono text-zinc-500 uppercase">{f.icao}</span>
                                </div>
                                <div className="text-sm font-bold text-zinc-200">CALLSIGN: {f.callsign}</div>
                                <div className="grid grid-cols-2 gap-2 text-zinc-400">
                                    <div>ALT: {Math.round(f.altitude)}m</div>
                                    <div>SPD: {Math.round(f.velocity * 3.6)}km/h</div>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* High performance cluster layer via Supercluster (Now excluding flights) */}
                <ClusterLayer data={mapData} activeLayers={activeLayers} />
            </MapContainer>
        </div>
    );
}
