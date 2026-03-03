import { Activity } from 'lucide-react';
import { Widget } from '../ui/Widget';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { cn } from '../../lib/utils';

export function PizzaIndex() {
    const [locations, setLocations] = useState([
        { name: 'Pentagon / DoD', hz: 12, status: 'NORMAL' },
        { name: 'CIA Headquarters', hz: 8, status: 'NORMAL' },
        { name: 'White House', hz: 15, status: 'ELEVATED' },
        { name: 'State Dept', hz: 5, status: 'NORMAL' }
    ]);
    const [history, setHistory] = useState<number[]>(Array(20).fill(10));

    // Simulate authentic proxy data
    useEffect(() => {
        const interval = setInterval(() => {
            let maxHz = 0;
            setLocations(prev => prev.map(loc => {
                const base = loc.name === 'White House' ? 30 : 15;
                const mockVol = base + Math.random() * 40;
                let status = 'NORMAL';
                if (mockVol > 55) status = 'CRITICAL';
                else if (mockVol > 35) status = 'ELEVATED';

                if (mockVol > maxHz) maxHz = mockVol;
                return { ...loc, hz: Math.floor(mockVol), status };
            }));

            setHistory(prev => [...prev.slice(1), maxHz]);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const maxHz = Math.max(...locations.map(l => l.hz));
    const globalStatus = maxHz > 55 ? 'CRITICAL' : maxHz > 35 ? 'ELEVATED' : 'NORMAL';
    const gaugeValue = Math.min((maxHz / 80) * 100, 100);

    // SVG graph path
    const w = 250;
    const h = 50;
    const points = history.map((val, i) => {
        const x = (i / (history.length - 1)) * w;
        const y = h - (Math.min(val, 80) / 80) * h;
        return `${x},${y}`;
    }).join(' ');

    return (
        <Widget title="Strategic Consumption (Pizza Index)" icon={<Activity size={14} />}>
            <div className="p-4 flex flex-col h-full font-mono gap-6 overflow-hidden relative">
                <div className="absolute top-4 right-4 z-10 flex flex-col items-end">
                    <div className={cn(
                        "text-xs font-black px-2 py-0.5 border uppercase",
                        globalStatus === 'CRITICAL' ? "text-red-500 border-red-500 bg-red-500/10" :
                            globalStatus === 'ELEVATED' ? "text-amber-500 border-amber-500 bg-amber-500/10" : "text-primary border-primary bg-primary/10"
                    )}>
                        {globalStatus}
                    </div>
                </div>

                {/* Gauge Section */}
                <div className="flex flex-col items-center justify-center mt-2">
                    <div className="relative w-40 h-24 overflow-hidden flex justify-center">
                        <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
                            {/* Background track */}
                            <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="currentColor" strokeWidth="8" className="text-zinc-900" strokeLinecap="round" />
                            {/* Gauge fill */}
                            <motion.path
                                d="M 10 50 A 40 40 0 0 1 90 50"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="8"
                                strokeDasharray={126}
                                strokeDashoffset={126 - (126 * gaugeValue) / 100}
                                className={cn(
                                    "transition-all duration-1000 ease-out",
                                    globalStatus === 'CRITICAL' ? "text-red-500" :
                                        globalStatus === 'ELEVATED' ? "text-amber-500" : "text-primary"
                                )}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute bottom-0 flex flex-col items-center">
                            <span className="text-3xl font-black text-zinc-100 leading-none tracking-tighter shadow-lg">{Math.round(maxHz)}<span className="text-xs text-primary ml-1">Hz</span></span>
                            <span className="text-[8px] text-zinc-500 font-black uppercase tracking-widest mt-1">Peak Volume</span>
                        </div>
                    </div>
                </div>

                {/* Locations list */}
                <div className="flex-1 flex flex-col gap-2 justify-center">
                    {locations.map((loc, i) => (
                        <div key={i} className="flex flex-col gap-1">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">{loc.name}</span>
                                <span className="text-[10px] text-zinc-300 font-bold">{loc.hz}Hz</span>
                            </div>
                            <div className="h-0.5 bg-zinc-900 w-full overflow-hidden">
                                <motion.div
                                    animate={{ width: `${Math.min((loc.hz / 80) * 100, 100)}%` }}
                                    className={cn(
                                        "h-full",
                                        loc.status === 'CRITICAL' ? "bg-red-500" :
                                            loc.status === 'ELEVATED' ? "bg-amber-500" : "bg-primary"
                                    )}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* History Sparkline */}
                <div className="mt-2 pt-4 border-t border-border/20 flex flex-col gap-2">
                    <span className="text-[8px] text-zinc-500 font-black uppercase tracking-widest">Global Volume History (T-20m)</span>
                    <div className="h-10 w-full bg-zinc-950/50 border border-border/30 relative">
                        <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full h-full">
                            <polyline
                                fill="none"
                                stroke={globalStatus === 'CRITICAL' ? '#ef4444' : globalStatus === 'ELEVATED' ? '#f59e0b' : '#10b981'}
                                strokeWidth="2"
                                points={points}
                                className="transition-all duration-500 drop-shadow-[0_0_4px_rgba(16,185,129,0.3)]"
                                vectorEffect="non-scaling-stroke"
                            />
                        </svg>
                    </div>
                </div>
            </div>
        </Widget>
    );
}
