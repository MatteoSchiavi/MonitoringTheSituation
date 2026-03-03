import { Shield, Thermometer, Droplets, Lightbulb, Lock, Wifi, Server, ExternalLink, Info, Activity } from 'lucide-react';
import { Widget } from '../ui/Widget';
import { cn } from '../../lib/utils';
import { useState } from 'react';

export function Habitat() {
    const [isConnected, setIsConnected] = useState(false);

    return (
        <div className="h-full p-6 flex flex-col gap-6 bg-zinc-950/20 overflow-hidden relative">
            <header className="flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 border border-primary/20">
                        <Shield size={24} className="text-primary" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-zinc-100 uppercase tracking-widest">Habitat Automation Core</h2>
                        <div className="text-[10px] text-zinc-500 font-black tracking-widest uppercase mt-1">
                            Home Assistant Integration // Energy & Environment
                        </div>
                    </div>
                </div>
                <div className={cn(
                    "px-4 py-2 border flex items-center gap-3 transition-all",
                    isConnected ? "bg-primary/20 border-primary text-primary" : "bg-red-500/10 border-red-500/40 text-red-500"
                )}>
                    <Wifi size={16} className={isConnected ? "" : "animate-pulse"} />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                        {isConnected ? 'NODE_SYNC_ACTIVE' : 'NODE_OFFLINE'}
                    </span>
                </div>
            </header>

            <div className="grid grid-cols-12 gap-6 flex-1 overflow-hidden">
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
                    {/* Status Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Widget title="Sync Status" icon={<Wifi size={14} />}>
                            <div className="flex flex-col items-center py-4 gap-4">
                                <Server size={40} className={isConnected ? "text-primary" : "text-zinc-700"} />
                                <div className="text-[10px] font-black uppercase text-zinc-500">
                                    {isConnected ? 'Link: ACTIVE' : 'Link: PENDING'}
                                </div>
                            </div>
                        </Widget>
                        <Widget title="Interior Temp" icon={<Thermometer size={14} />}>
                            <div className="flex flex-col items-center py-4">
                                <div className="text-4xl font-black text-zinc-100">22.5<span className="text-sm text-primary ml-1">°C</span></div>
                                <span className="text-[10px] text-zinc-500 font-black uppercase mt-2 tracking-widest">HVAC // MODE_AUTO</span>
                            </div>
                        </Widget>
                        <Widget title="Humidity" icon={<Droplets size={14} />}>
                            <div className="flex flex-col items-center py-4">
                                <div className="text-4xl font-black text-zinc-100">45<span className="text-sm text-blue-500 ml-1">%</span></div>
                                <span className="text-[10px] text-zinc-500 font-black uppercase mt-2 tracking-widest">DEHUMIDIFIER // STANDBY</span>
                            </div>
                        </Widget>
                    </div>

                    {/* Home Assistant Integration Guide */}
                    {!isConnected && (
                        <div className="p-6 bg-zinc-900/50 border border-primary/20 flex flex-col gap-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Server size={80} />
                            </div>
                            <div className="flex items-center gap-3 text-primary">
                                <Info size={20} />
                                <h3 className="text-sm font-black uppercase tracking-widest">Integration Pending: Home Assistant Core</h3>
                            </div>
                            <p className="text-[11px] text-zinc-400 font-bold uppercase leading-relaxed max-w-2xl">
                                To synchronize your real-world hardware (Zigbee/Matter/Z-Wave), link this dashboard to your local Home Assistant instance.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                <div className="space-y-3">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[8px] text-zinc-500 font-black uppercase">Server URL</span>
                                        <input type="text" placeholder="http://homeassistant.local:8123" className="bg-zinc-950 border border-border px-3 py-2 text-[10px] font-black text-zinc-100 outline-none focus:border-primary" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[8px] text-zinc-500 font-black uppercase">Long-Lived Access Token</span>
                                        <input type="password" placeholder="••••••••••••••••" className="bg-zinc-950 border border-border px-3 py-2 text-[10px] font-black text-zinc-100 outline-none focus:border-primary" />
                                    </div>
                                    <button
                                        onClick={() => setIsConnected(true)}
                                        className="w-full bg-primary/10 border border-primary/20 text-primary py-2 text-[10px] font-black uppercase tracking-widest hover:bg-primary/20 transition-all"
                                    >
                                        INITIALIZE_UPLINK
                                    </button>
                                </div>
                                <div className="p-4 bg-zinc-950 border border-border flex flex-col gap-3">
                                    <span className="text-[9px] font-black text-primary uppercase">Quick Commands:</span>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between items-center text-[8px] font-black text-zinc-500 uppercase">
                                            <span>Light.Living_Room</span>
                                            <span className="text-primary">ON</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[8px] font-black text-zinc-500 uppercase">
                                            <span>Switch.Coffee_Machine</span>
                                            <span className="text-red-500">OFF</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[8px] font-black text-zinc-500 uppercase">
                                            <span>Climate.Main_Floor</span>
                                            <span>21°C</span>
                                        </div>
                                    </div>
                                    <a href="https://www.home-assistant.io/" target="_blank" rel="noreferrer" className="mt-auto flex items-center justify-center gap-2 text-[8px] font-black text-zinc-600 hover:text-primary transition-colors">
                                        DOCUMENTATION <ExternalLink size={10} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}

                    {isConnected && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'LIVING_LIGHTS', icon: <Lightbulb size={16} />, status: 'ON' },
                                { label: 'KITCHEN_MAIN', icon: <Lightbulb size={16} />, status: 'OFF' },
                                { label: 'GARAGE_DOOR', icon: <Lock size={16} />, status: 'LOCKED' },
                                { label: 'HVAC_FANS', icon: <Activity size={16} />, status: 'HIGH' }
                            ].map((item, i) => (
                                <button key={i} className="p-4 bg-zinc-900/50 border border-border flex flex-col items-center gap-3 group hover:border-primary transition-all">
                                    <div className={cn(
                                        "p-2 bg-zinc-950 border border-border group-hover:border-primary transition-colors",
                                        item.status === 'ON' || item.status === 'LOCKED' ? "text-primary" : "text-zinc-600"
                                    )}>{item.icon}</div>
                                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{item.label}</span>
                                    <span className={cn(
                                        "text-[8px] font-black uppercase",
                                        item.status === 'ON' ? "text-primary" : "text-zinc-600"
                                    )}>{item.status}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                    <Widget title="Tactical Log" icon={<Info size={14} />}>
                        <div className="flex flex-col gap-3 h-full overflow-y-auto pr-2 custom-scrollbar">
                            {[
                                { time: '08:42', msg: 'Climate synchronization sequence nominal.' },
                                { time: '08:15', msg: 'Interior sensor drift detected // Self-corrected.' },
                                { time: '07:30', msg: 'Bridge linked to Home Assistant Instance.' },
                                { time: '00:12', msg: 'HVAC status: Stable // All filters nominal.' }
                            ].map((log, i) => (
                                <div key={i} className="flex gap-4 p-3 bg-background border-l border-primary/20">
                                    <span className="text-[9px] font-black text-primary opacity-50">{log.time}</span>
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase leading-snug">{log.msg}</p>
                                </div>
                            ))}
                        </div>
                    </Widget>
                </div>
            </div>
        </div>
    );
}
