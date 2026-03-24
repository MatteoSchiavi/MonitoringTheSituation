import { useState, useEffect, useCallback, useRef } from 'react';
import { Widget } from '../ui/Widget';
import {
    Home, Thermometer, Lightbulb, Shield, Lock,
    Wifi, WifiOff, Power, Sun, Moon, Activity, RefreshCw,
    ToggleLeft, ToggleRight
} from 'lucide-react';

interface HAEntity {
    entity_id: string;
    state: string;
    attributes: Record<string, any>;
    last_changed: string;
}

export default function HomeTab() {
    const [haUrl] = useState(() => localStorage.getItem('ha_url') || import.meta.env.VITE_HA_URL || '');
    const [haToken] = useState(() => localStorage.getItem('ha_token') || import.meta.env.VITE_HA_TOKEN || '');
    const [connected, setConnected] = useState(false);
    const [entities, setEntities] = useState<HAEntity[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const wsRef = useRef<WebSocket | null>(null);

    const isConfigured = haUrl && haToken && haToken !== 'YOUR_HA_LONG_LIVED_TOKEN';

    // Fetch all entities via REST
    const fetchEntities = useCallback(async () => {
        if (!isConfigured) return;
        setLoading(true);
        try {
            const res = await fetch(`${haUrl}/api/states`, {
                headers: { Authorization: `Bearer ${haToken}`, 'Content-Type': 'application/json' }
            });
            if (!res.ok) throw new Error(`HA returned ${res.status}`);
            const data = await res.json();
            setEntities(data);
            setConnected(true);
            setError(null);
        } catch (e: any) {
            setError(e.message || 'Connection failed');
            setConnected(false);
        } finally {
            setLoading(false);
        }
    }, [haUrl, haToken, isConfigured]);

    // Connect WebSocket for real-time updates
    useEffect(() => {
        if (!isConfigured) return;
        fetchEntities();

        const wsUrl = haUrl.replace('http', 'ws') + '/api/websocket';
        try {
            const ws = new WebSocket(wsUrl);
            wsRef.current = ws;

            ws.onopen = () => {
                // Auth
                ws.send(JSON.stringify({ type: 'auth', access_token: haToken }));
            };

            ws.onmessage = (event) => {
                const msg = JSON.parse(event.data);
                if (msg.type === 'auth_ok') {
                    setConnected(true);
                    // Subscribe to state changes
                    ws.send(JSON.stringify({ id: 1, type: 'subscribe_events', event_type: 'state_changed' }));
                }
                if (msg.type === 'event' && msg.event?.data?.new_state) {
                    const newState = msg.event.data.new_state;
                    setEntities(prev => prev.map(e =>
                        e.entity_id === newState.entity_id ? newState : e
                    ));
                }
                if (msg.type === 'auth_invalid') {
                    setError('Invalid Home Assistant token');
                    setConnected(false);
                }
            };

            ws.onerror = () => setError('WebSocket connection error');
            ws.onclose = () => setConnected(false);
        } catch (e) {
            setError('Failed to connect WebSocket');
        }

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, [haUrl, haToken, isConfigured, fetchEntities]);

    // Toggle a switch/light
    const toggleEntity = async (entityId: string) => {
        if (!isConfigured) return;
        try {
            const domain = entityId.split('.')[0];
            await fetch(`${haUrl}/api/services/${domain}/toggle`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${haToken}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ entity_id: entityId })
            });
        } catch {
            // Will be updated via WebSocket
        }
    };

    // Set climate temperature
    const setClimateTemp = async (entityId: string, temp: number) => {
        if (!isConfigured) return;
        try {
            await fetch(`${haUrl}/api/services/climate/set_temperature`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${haToken}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ entity_id: entityId, temperature: temp })
            });
        } catch { /* WebSocket will update */ }
    };

    // Group entities by domain
    const lights = entities.filter(e => e.entity_id.startsWith('light.'));
    const switches = entities.filter(e => e.entity_id.startsWith('switch.'));
    const climate = entities.filter(e => e.entity_id.startsWith('climate.'));
    const sensors = entities.filter(e => e.entity_id.startsWith('sensor.') && !e.entity_id.includes('battery'));
    const security = entities.filter(e =>
        e.entity_id.startsWith('alarm_control_panel.') ||
        e.entity_id.startsWith('lock.') ||
        e.entity_id.startsWith('binary_sensor.') && e.attributes.device_class === 'door'
    );

    if (!isConfigured) {
        return (
            <div className="p-4 max-w-[1800px] mx-auto tab-content">
                <Widget title="Home Assistant" icon={<Home size={14} />} status="warning">
                    <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                        <Home size={40} className="text-zinc-600" />
                        <h3 className="text-lg font-semibold text-zinc-300">Connect Home Assistant</h3>
                        <p className="text-sm text-zinc-500 max-w-md">
                            To control your home, configure your Home Assistant URL and Long-Lived Access Token in Settings.
                        </p>
                        <div className="text-xs text-zinc-600 bg-zinc-800/50 px-4 py-2 rounded-md">
                            Settings → API Keys → Home Assistant URL & Token
                        </div>
                    </div>
                </Widget>
            </div>
        );
    }

    return (
        <div className="p-4 space-y-4 max-w-[1800px] mx-auto tab-content">
            {/* Connection Status */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium ${connected ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                }`}>
                {connected ? <Wifi size={14} /> : <WifiOff size={14} />}
                {connected ? `Connected to ${haUrl}` : error || 'Disconnected'}
                <button
                    onClick={fetchEntities}
                    className="ml-auto p-2 hover:bg-zinc-800 rounded transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                    <RefreshCw size={12} />
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Lights */}
                <Widget title="Lights" icon={<Lightbulb size={14} />} loading={loading} status={connected ? 'online' : 'offline'}>
                    <div className="space-y-2">
                        {lights.length === 0 && <p className="text-xs text-zinc-600">No lights found</p>}
                        {lights.map(light => (
                            <button
                                key={light.entity_id}
                                onClick={() => toggleEntity(light.entity_id)}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors min-h-[44px] ${light.state === 'on'
                                    ? 'bg-amber-500/10 border border-amber-500/20'
                                    : 'bg-zinc-800/50 border border-zinc-800'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    {light.state === 'on' ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-zinc-600" />}
                                    <span className="text-sm text-zinc-300">{light.attributes.friendly_name || light.entity_id}</span>
                                </div>
                                <div className={`text-xs font-medium ${light.state === 'on' ? 'text-amber-400' : 'text-zinc-600'}`}>
                                    {light.state.toUpperCase()}
                                </div>
                            </button>
                        ))}
                    </div>
                </Widget>

                {/* Climate */}
                <Widget title="Climate" icon={<Thermometer size={14} />} loading={loading} status={connected ? 'online' : 'offline'}>
                    <div className="space-y-3">
                        {climate.length === 0 && <p className="text-xs text-zinc-600">No climate entities found</p>}
                        {climate.map(c => (
                            <div key={c.entity_id} className="bg-zinc-800/40 border border-zinc-800 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-medium text-zinc-300">{c.attributes.friendly_name || c.entity_id}</span>
                                    <span className={`text-xs font-medium px-2 py-1 rounded ${c.state === 'heat' ? 'bg-red-500/20 text-red-400' :
                                        c.state === 'cool' ? 'bg-blue-500/20 text-blue-400' :
                                            'bg-zinc-700 text-zinc-400'
                                        }`}>
                                        {c.state}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div>
                                        <span className="text-2xl font-bold text-zinc-200">{c.attributes.current_temperature || '—'}°</span>
                                        <span className="text-xs text-zinc-500 ml-1">current</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setClimateTemp(c.entity_id, (c.attributes.temperature || 20) - 0.5)}
                                            className="w-8 h-8 flex items-center justify-center bg-zinc-700 rounded text-zinc-300 hover:bg-zinc-600 min-h-[44px] min-w-[44px]"
                                        >−</button>
                                        <span className="text-lg font-semibold text-zinc-200 w-12 text-center">
                                            {c.attributes.temperature || '—'}°
                                        </span>
                                        <button
                                            onClick={() => setClimateTemp(c.entity_id, (c.attributes.temperature || 20) + 0.5)}
                                            className="w-8 h-8 flex items-center justify-center bg-zinc-700 rounded text-zinc-300 hover:bg-zinc-600 min-h-[44px] min-w-[44px]"
                                        >+</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Widget>

                {/* Switches */}
                <Widget title="Switches" icon={<Power size={14} />} loading={loading} status={connected ? 'online' : 'offline'}>
                    <div className="space-y-2">
                        {switches.length === 0 && <p className="text-xs text-zinc-600">No switches found</p>}
                        {switches.map(sw => (
                            <button
                                key={sw.entity_id}
                                onClick={() => toggleEntity(sw.entity_id)}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors min-h-[44px] ${sw.state === 'on'
                                    ? 'bg-emerald-500/10 border border-emerald-500/20'
                                    : 'bg-zinc-800/50 border border-zinc-800'
                                    }`}
                            >
                                <span className="text-sm text-zinc-300">{sw.attributes.friendly_name || sw.entity_id}</span>
                                {sw.state === 'on'
                                    ? <ToggleRight size={20} className="text-emerald-400" />
                                    : <ToggleLeft size={20} className="text-zinc-600" />
                                }
                            </button>
                        ))}
                    </div>
                </Widget>

                {/* Sensors */}
                <Widget title="Sensors" icon={<Activity size={14} />} loading={loading} status={connected ? 'online' : 'offline'}>
                    <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
                        {sensors.slice(0, 20).map(sensor => (
                            <div key={sensor.entity_id} className="bg-zinc-800/30 border border-zinc-800/50 rounded-md p-3">
                                <div className="text-[10px] text-zinc-500 truncate">{sensor.attributes.friendly_name || sensor.entity_id}</div>
                                <div className="text-sm font-semibold text-zinc-200 mt-1">
                                    {sensor.state} {sensor.attributes.unit_of_measurement || ''}
                                </div>
                            </div>
                        ))}
                    </div>
                </Widget>
            </div>

            {/* Security */}
            {security.length > 0 && (
                <Widget title="Security" icon={<Shield size={14} />} status={connected ? 'online' : 'offline'}>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {security.map(s => (
                            <div key={s.entity_id} className={`p-3 rounded-lg border ${s.state === 'on' || s.state === 'open' || s.state === 'unlocked'
                                ? 'bg-amber-500/10 border-amber-500/20'
                                : 'bg-zinc-800/30 border-zinc-800'
                                }`}>
                                <div className="flex items-center gap-2">
                                    {s.entity_id.startsWith('lock.') ? <Lock size={14} /> : <Shield size={14} />}
                                    <span className="text-xs text-zinc-300 truncate">{s.attributes.friendly_name || s.entity_id}</span>
                                </div>
                                <div className={`text-[10px] mt-1 font-medium ${s.state === 'on' || s.state === 'open' || s.state === 'unlocked'
                                    ? 'text-amber-400' : 'text-emerald-400'
                                    }`}>
                                    {s.state}
                                </div>
                            </div>
                        ))}
                    </div>
                </Widget>
            )}
        </div>
    );
}
