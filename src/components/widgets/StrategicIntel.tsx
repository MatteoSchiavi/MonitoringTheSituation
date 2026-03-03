import { Activity, Globe, TrendingUp, Play } from 'lucide-react';
import { Widget } from '../ui/Widget';
import { motion } from 'framer-motion';
import type { NewsArticle } from '../../types/dashboard';
import { PizzaIndex } from './PizzaIndex';

interface StrategicIntelProps {
    news?: NewsArticle[];
}

export function StrategicIntel({ news = [] }: StrategicIntelProps) {
    const vulnerabilityScore = 42;

    const forecasts = [
        { event: 'Global Semiconductor Supply Recovery', prob: 65 },
        { event: 'Inter-State Trade Policy Shift (Q3)', prob: 28 },
        { event: 'Renewable Energy Grid Parity', prob: 82 },
        { id: 'f-1', event: 'Central Bank Digital Currency Integration', prob: 45 },
        { id: 'f-2', event: 'Autonomous Logistics Network Alpha', prob: 91 }
    ];

    return (
        <div className="h-full p-6 flex flex-col gap-6 bg-zinc-950/20 overflow-hidden relative font-mono">
            <div className="grid grid-cols-12 gap-6 shrink-0">
                <div className="col-span-12 lg:col-span-8">
                    <Widget title="Global Risk Index" icon={<Globe size={14} />}>
                        <div className="flex items-center gap-12 py-6 px-10">
                            <div className="relative w-40 h-40 flex items-center justify-center">
                                <svg className="w-full h-full -rotate-90">
                                    <circle
                                        cx="80" cy="80" r="70"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        fill="transparent"
                                        className="text-zinc-900"
                                    />
                                    <circle
                                        cx="80" cy="80" r="70"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        fill="transparent"
                                        strokeDasharray={440}
                                        strokeDashoffset={440 - (440 * vulnerabilityScore) / 100}
                                        className="text-primary transition-all duration-1000"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-4xl font-black text-zinc-100">{vulnerabilityScore}</span>
                                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mt-1 italic">Composite Risk</span>
                                </div>
                            </div>
                            <div className="flex-1 space-y-4">
                                <div className="space-y-1">
                                    <div className="flex justify-between text-[10px] font-black uppercase text-zinc-500">
                                        <span>Information Velocity</span>
                                        <span className="text-zinc-300 italic">Moderate</span>
                                    </div>
                                    <div className="h-1 bg-zinc-900 overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: '45%' }} className="h-full bg-primary" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-[10px] font-black uppercase text-zinc-500">
                                        <span>Geopolitical Volatility</span>
                                        <span className="text-zinc-300 italic">Stable</span>
                                    </div>
                                    <div className="h-1 bg-zinc-900 overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: '22%' }} className="h-full bg-primary" />
                                    </div>
                                </div>
                                <div className="border-t border-border/20 pt-4 mt-4">
                                    <p className="text-[10px] text-zinc-400 leading-relaxed font-bold">
                                        Aggregated risk assessment indicates stability in primary economic zones. Continued surveillance of APAC trade corridors recommended.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Widget>
                </div>

                <div className="col-span-12 lg:col-span-4">
                    <PizzaIndex />
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6 flex-1 overflow-hidden">
                {/* Bloomberg Live Feed */}
                <div className="col-span-12 lg:col-span-8 flex flex-col overflow-hidden">
                    <Widget title="Bloomberg Global News Live" icon={<Play size={14} />} className="flex-1">
                        <div className="w-full h-full bg-zinc-950 flex flex-col relative group">
                            <iframe
                                className="w-full h-full border-none opacity-90 grayscale-[0.3] hover:grayscale-0 transition-all duration-700"
                                src="https://www.youtube.com/embed/dp8PhLsUcFE?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1"
                                title="Bloomberg Global Finance Live"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                            {/* High-density overlay for aesthetic consistency */}
                            <div className="absolute top-4 left-4 pointer-events-none flex flex-col gap-1">
                                <div className="bg-primary/20 backdrop-blur-md px-2 py-0.5 border border-primary/40 flex items-center gap-2">
                                    <div className="w-1 h-1 bg-red-500 animate-pulse rounded-full" />
                                    <span className="text-[8px] font-black text-primary uppercase">Live Coverage</span>
                                </div>
                                <div className="bg-zinc-950/80 px-2 py-0.5 border border-border">
                                    <span className="text-[7px] font-black text-zinc-400 uppercase">Node ID: NY-CENTRAL-01</span>
                                </div>
                            </div>
                        </div>
                    </Widget>
                </div>

                <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 overflow-hidden">
                    <Widget title="Global Intelligence Feed" icon={<TrendingUp size={14} />} className="flex-1">
                        <div className="flex flex-col h-full bg-zinc-950/30 overflow-hidden">
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                                {news.length > 0 ? (
                                    news.map((item, i) => (
                                        <div key={i} className="group border-b border-border/20 pb-4 last:border-0">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-[8px] font-black text-primary uppercase tracking-widest">{item.source.name}</span>
                                                <span className="text-[7px] text-zinc-600 font-bold uppercase">{new Date(item.publishedAt).toLocaleTimeString()}</span>
                                            </div>
                                            <h4 className="text-[11px] font-bold text-zinc-200 leading-snug group-hover:text-primary transition-colors cursor-pointer uppercase tracking-tight">
                                                {item.title}
                                            </h4>
                                        </div>
                                    ))
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center opacity-20 text-center uppercase gap-2">
                                        <Activity size={24} className="animate-pulse" />
                                        <span className="text-[10px] font-black tracking-widest">Awaiting Feed Stream...</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-4 border-t border-border/20 bg-zinc-900/50">
                                <div className="text-[9px] font-black text-zinc-500 uppercase mb-3 tracking-[0.2em]">Strategy Forecasts</div>
                                <div className="space-y-3">
                                    {forecasts.map((f, i) => (
                                        <div key={i} className="space-y-1">
                                            <div className="flex justify-between text-[9px] font-bold uppercase">
                                                <span className="text-zinc-400 truncate max-w-[80%]">{f.event}</span>
                                                <span className="text-primary italic">{f.prob}%</span>
                                            </div>
                                            <div className="h-0.5 bg-zinc-900 overflow-hidden">
                                                <motion.div initial={{ width: 0 }} animate={{ width: `${f.prob}%` }} className="h-full bg-primary" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Widget>
                </div>
            </div>
        </div>
    );
}
