import { useState } from 'react';
import { GlobalStrategicMap } from './GlobalStrategicMap';
import { Widget } from '../ui/Widget';
import { Plane, Filter, Shield, AlertTriangle, Globe } from 'lucide-react';
import { cn } from '../../lib/utils';

interface MapTabProps {
    isAlertMode?: boolean;
}

export function MapTab({ isAlertMode }: MapTabProps) {
    const [filter, setFilter] = useState<'all' | 'military' | 'emergency'>('all');

    const filters = [
        { id: 'all', label: 'All Traffic', icon: Globe },
        { id: 'military', label: 'Military Only', icon: Shield },
        { id: 'emergency', label: 'Emergency (7700)', icon: AlertTriangle }
    ];

    return (
        <div className="h-full flex flex-col lg:flex-row overflow-hidden">
            {/* Sidebar Filters */}
            <aside className="w-full lg:w-80 bg-zinc-900/50 border-r border-border p-6 flex flex-col gap-6 shrink-0">
                <header className="flex items-center gap-3 border-b border-border pb-4">
                    <Filter size={18} className="text-primary" />
                    <h2 className="text-lg font-black text-zinc-100 uppercase tracking-widest">Global Filters</h2>
                </header>

                <div className="flex flex-col gap-3">
                    {filters.map(f => {
                        const Icon = f.icon;
                        const isActive = filter === f.id;
                        return (
                            <button
                                key={f.id}
                                onClick={() => setFilter(f.id as any)}
                                className={cn(
                                    "flex items-center justify-between p-4 border transition-all duration-300 group",
                                    isActive
                                        ? "bg-primary/10 border-primary text-primary shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                                        : "bg-zinc-900/40 border-border text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon size={16} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{f.label}</span>
                                </div>
                                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
                            </button>
                        );
                    })}
                </div>

                <Widget title="Global Intelligence" icon={<Plane size={14} />}>
                    <div className="py-4 space-y-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-[9px] text-zinc-600 font-black uppercase">Active Region</span>
                            <span className="text-xs font-black text-zinc-200 uppercase tracking-tighter">Global Strategic Overview (Live)</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[9px] text-zinc-600 font-black uppercase">Surveillance Range</span>
                            <span className="text-xs font-black text-zinc-200 uppercase tracking-tighter">50.0 KM Radial</span>
                        </div>
                        <div className="p-3 bg-zinc-950 border border-border mt-4">
                            <div className="text-[8px] text-zinc-500 font-black uppercase mb-1">DATA_STREAM</div>
                            <div className="text-[10px] font-black text-primary uppercase">OPENSKY_NET // LIVE</div>
                        </div>
                    </div>
                </Widget>
            </aside>

            {/* Map Area */}
            <main className="flex-1 relative bg-zinc-950">
                <GlobalStrategicMap isAlertMode={isAlertMode} />

                {/* Full Screen Hint */}
                <div className="absolute bottom-6 right-6 z-[1000] flex gap-2">
                    <div className="px-4 py-2 bg-zinc-900/80 border border-border backdrop-blur-md text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                        Press [F] for Fullscreen Immersion
                    </div>
                </div>
            </main>
        </div>
    );
}
