import { Flag, Activity, Database, Users } from 'lucide-react';
import { Widget } from '../ui/Widget';
import type { F1Data } from '../../types/dashboard';
import { motion } from 'framer-motion';

interface F1Props {
    f1: F1Data | null;
}

export function F1({ f1 }: F1Props) {
    const session = f1?.session;
    const standings = f1?.standings || [];
    const nextGp = f1?.nextGp;

    return (
        <div className="h-full p-6 flex flex-col gap-6 bg-zinc-950/20 overflow-hidden relative font-mono">
            {/* Background Decorative Circuit (Generic) */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <svg className="w-full h-full text-primary" viewBox="0 0 800 400" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M100,200 L150,100 L300,80 L450,120 L600,100 L700,200 L650,300 L500,320 L300,350 L150,300 Z" strokeDasharray="10 10" />
                </svg>
            </div>

            <header className="flex items-center justify-between shrink-0 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 border border-primary/20">
                        <Flag size={24} className="text-primary" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-zinc-100 uppercase tracking-widest">
                            {session ? session.session_name : 'Inter-Race Interval'}
                        </h2>
                        <div className="text-[10px] text-zinc-500 font-black tracking-widest uppercase mt-1">
                            {session ? `${session.circuit_short_name} // Live Telemetry Feed` : `Next Event: ${nextGp?.name} // ${nextGp?.circuit}`}
                        </div>
                    </div>
                </div>

                {!session && nextGp && (
                    <div className="flex flex-col items-end">
                        <div className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">T-Minus to Green Flag</div>
                        <div className="text-xl font-black text-primary italic">18D 04H 22M</div>
                    </div>
                )}
            </header>

            <div className="grid grid-cols-12 gap-6 flex-1 overflow-hidden relative z-10">
                {/* Main View: Live Map or Standings */}
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-6 overflow-hidden">
                    {session ? (
                        <Widget title="Circuit Telemetry // Live Track Visualization" icon={<Activity size={14} />} className="flex-1">
                            <div className="relative h-full bg-zinc-900/40 p-10 flex flex-col items-center justify-center overflow-hidden">
                                <div className="absolute top-4 left-4 flex flex-col gap-1 z-20">
                                    <div className="text-[10px] font-black text-primary uppercase">Satellite Uplink: SAT-F1-GLOBAL-01</div>
                                    <div className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">Signal Strength: 98% // Low Latency</div>
                                </div>

                                {/* Circuit SVG with Drivers */}
                                <div className="w-full max-w-4xl aspect-[2/1] relative">
                                    <svg viewBox="0 0 800 400" className="w-full h-full text-zinc-800" fill="none" stroke="currentColor" strokeWidth="4">
                                        <path
                                            id="circuit-path"
                                            d="M100,200 C100,100 200,50 400,50 C600,50 700,100 700,200 C700,300 600,350 400,350 C200,350 100,300 100,200"
                                            stroke="rgba(var(--color-primary-rgb), 0.1)"
                                            strokeDasharray="10 5"
                                        />

                                        {/* Simulated Drivers */}
                                        {[
                                            { id: 'VER', color: '#1e40af', offset: 0, delay: 0 },
                                            { id: 'PER', color: '#1e40af', offset: 5, delay: 1 },
                                            { id: 'LEC', color: '#dc2626', offset: 15, delay: 2 },
                                            { id: 'SAI', color: '#dc2626', offset: 20, delay: 3 },
                                            { id: 'HAM', color: '#06b6d4', offset: 35, delay: 4 },
                                            { id: 'RUS', color: '#06b6d4', offset: 40, delay: 5 },
                                            { id: 'NOR', color: '#f97316', offset: 55, delay: 6 },
                                            { id: 'PIA', color: '#f97316', offset: 60, delay: 7 }
                                        ].map((d) => (
                                            <motion.g key={d.id}>
                                                <circle r="4" fill={d.color} className="shadow-lg">
                                                    <animateMotion
                                                        path="M100,200 C100,100 200,50 400,50 C600,50 700,100 700,200 C700,300 600,350 400,350 C200,350 100,300 100,200"
                                                        dur="30s"
                                                        repeatCount="indefinite"
                                                        begin={`${d.delay}s`}
                                                    />
                                                </circle>
                                                <text fontSize="10" fontWeight="900" fill="white" dy="-10">
                                                    <animateMotion
                                                        path="M100,200 C100,100 200,50 400,50 C600,50 700,100 700,200 C700,300 600,350 400,350 C200,350 100,300 100,200"
                                                        dur="30s"
                                                        repeatCount="indefinite"
                                                        begin={`${d.delay}s`}
                                                    />
                                                    {d.id}
                                                </text>
                                            </motion.g>
                                        ))}
                                    </svg>

                                    {/* Sector Times Overlay */}
                                    <div className="absolute bottom-4 right-4 bg-zinc-950/80 border border-primary/20 p-4 font-mono z-20">
                                        <div className="text-[9px] text-zinc-500 uppercase mb-2">Sector Analysis</div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between gap-8">
                                                <span className="text-[10px] font-black text-zinc-100">S1 // SPEED_TRAP</span>
                                                <span className="text-[10px] font-black text-primary italic">334.2 KM/H</span>
                                            </div>
                                            <div className="flex justify-between gap-8">
                                                <span className="text-[10px] font-black text-zinc-100">S2 // TECHNICAL</span>
                                                <span className="text-[10px] font-black text-primary italic">PURPLE_GAP</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Widget>
                    ) : (
                        <div className="flex-1 flex flex-col gap-6">
                            <Widget title="Next Grand Prix // Strategic Briefing" icon={<Activity size={14} />} className="flex-1">
                                <div className="h-full bg-zinc-900/40 p-12 flex flex-col items-center justify-center text-center relative overflow-hidden">
                                    {/* Background Decorative Element */}
                                    <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
                                        <Flag size={400} className="text-zinc-500" />
                                    </div>

                                    <div className="flex flex-col items-center gap-4 relative z-10">
                                        <div className="text-[12px] font-black text-primary uppercase tracking-[0.4em] mb-2">T-Minus Sequence Initiated</div>
                                        <div className="text-6xl font-black text-zinc-100 italic tracking-tighter">18D : 04H : 22M</div>
                                        <div className="h-px w-32 bg-primary/30 my-4" />
                                        <div className="text-2xl font-black text-zinc-100 uppercase tracking-widest">{nextGp?.name || 'Saudi Arabian Grand Prix'}</div>
                                        <div className="text-sm font-black text-zinc-500 uppercase tracking-widest">{nextGp?.circuit || 'Jeddah Corniche Circuit'} // {nextGp?.location || 'Jeddah'}</div>
                                    </div>

                                    <div className="mt-12 grid grid-cols-3 gap-12 relative z-10 w-full max-w-2xl px-8">
                                        <div className="flex flex-col gap-2">
                                            <span className="text-[9px] font-black text-zinc-600 uppercase">Track Type</span>
                                            <span className="text-xs font-black text-zinc-100 uppercase italic">Street Circuit</span>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <span className="text-[9px] font-black text-zinc-600 uppercase">Avg Speed</span>
                                            <span className="text-xs font-black text-zinc-100 uppercase italic">250+ KM/H</span>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <span className="text-[9px] font-black text-zinc-600 uppercase">Complexity</span>
                                            <span className="text-xs font-black text-zinc-100 uppercase italic">Extreme</span>
                                        </div>
                                    </div>
                                </div>
                            </Widget>
                        </div>
                    )}
                </div>

                {/* Sidebar Stats */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
                    <Widget title="Session Status" icon={<Activity size={14} />}>
                        <div className="py-2 space-y-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] text-zinc-600 font-black uppercase">Data Uplink</span>
                                <span className="text-xs font-black text-primary uppercase italic">{session ? 'Live Active // OpenF1' : 'Idle // Standby'}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] text-zinc-600 font-black uppercase">Telemetry Refresh</span>
                                <span className="text-xs font-black text-zinc-300 uppercase">1.0s Interval</span>
                            </div>
                        </div>
                    </Widget>

                    <Widget title="Circuit Data" icon={<Database size={14} />}>
                        <div className="py-4 space-y-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] text-zinc-600 font-black uppercase">Location</span>
                                <span className="text-xs font-black text-zinc-200 uppercase">{session ? session.location : (nextGp?.location || 'Awaiting Data')}</span>
                            </div>
                        </div>
                    </Widget>

                    <Widget title="Championship Standings" icon={<Users size={14} />} className="flex-1 min-h-[400px]">
                        <div className="p-4 space-y-2 overflow-y-auto max-h-full custom-scrollbar pt-4">
                            {standings.map((s, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-zinc-900 border-l-2 border-primary hover:bg-zinc-800 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs font-black text-zinc-500 w-4 italic">#{s.pos}</span>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-zinc-100 uppercase">{s.driver}</span>
                                            <span className="text-[8px] text-zinc-500 font-bold uppercase">{s.team}</span>
                                        </div>
                                    </div>
                                    <div className="text-sm font-black text-primary italic">{s.pts}</div>
                                </div>
                            ))}
                        </div>
                    </Widget>
                </div>
            </div>
        </div>
    );
}
