import {
    TrendingUp,
    AlertCircle,
    CloudRain,
    Terminal,
    ChevronRight,
    Map as MapIcon,
    Flag
} from 'lucide-react';
import { Widget } from '../ui/Widget';
import { cn } from '../../lib/utils';
import { GlobalStrategicMap } from './GlobalStrategicMap';
import { LogisticsTracker } from './LogisticsTracker';
import type { NewsArticle, StockData, WeatherData, F1Data } from '../../types/dashboard';

interface OverviewProps {
    news: NewsArticle[];
    stocks: StockData[];
    weather: WeatherData | null;
    f1: F1Data | null;
    aiMessages: { role: string; content: string }[];
    onAiSubmit: (e: React.FormEvent) => void;
    aiInput: string;
    setAiInput: (val: string) => void;
    isAlertMode?: boolean;
}

export function Overview({
    news,
    stocks,
    weather,
    f1,
    aiMessages,
    onAiSubmit,
    aiInput,
    setAiInput,
    isAlertMode
}: OverviewProps) {
    return (
        <div className="h-full overflow-y-auto lg:overflow-hidden p-4 custom-scrollbar bg-background">
            <div className="grid grid-cols-1 lg:grid-cols-12 lg:grid-rows-6 gap-4 min-h-max lg:h-full">
                {/* Markets Snapshot (3x3) */}
                <div className="col-span-1 lg:col-span-3 lg:row-span-3 min-h-[300px] lg:min-h-0">
                    <Widget title="Global Markets" className="h-full" icon={<TrendingUp size={14} />}>
                        <div className="flex flex-col gap-3 h-full justify-center">
                            {stocks.map((s, i) => (
                                <div key={i} className="flex justify-between items-end border-b border-border/50 pb-3 mb-1 last:border-0 last:pb-0 last:mb-0 group cursor-pointer hover:bg-zinc-800/10 transition-colors">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-zinc-500 font-black tracking-widest">{s.symbol}</span>
                                        <span className="text-xl font-black text-zinc-100">${s.price}</span>
                                    </div>
                                    <div className={cn(
                                        "flex flex-col items-end",
                                        s.change.startsWith('+') ? "text-primary" : "text-red-500"
                                    )}>
                                        <span className="text-sm font-black leading-none">{s.change}</span>
                                        <span className="text-[10px] font-bold leading-none mt-1.5 opacity-80">{s.percent}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Widget>
                </div>

                {/* Regional Geospatial Map (6x4) */}
                <div className="col-span-1 lg:col-span-6 lg:row-span-4 min-h-[400px] lg:min-h-0 border border-border overflow-hidden relative group">
                    <GlobalStrategicMap isAlertMode={isAlertMode} />
                    <div className="absolute top-2 right-2 z-[1001] bg-zinc-950/80 p-2 border border-border">
                        <MapIcon size={14} className="text-primary" />
                    </div>
                </div>

                {/* Intelligence Feed (expanded to 3x4) */}
                <div className="col-span-1 lg:col-span-3 lg:row-span-4 min-h-[300px] lg:min-h-0">
                    <Widget title="Intelligence Feed" className="h-full" icon={<AlertCircle size={14} />}>
                        <div className="flex flex-col gap-4 overflow-y-auto h-full pr-4 custom-scrollbar">
                            {news.map((n, i) => (
                                <div key={i} className="group border-l-2 border-primary/20 pl-5 py-2 hover:border-primary hover:bg-zinc-800/20 transition-all cursor-pointer">
                                    <div className="flex justify-between items-center text-[10px] mb-2 font-black">
                                        <span className="text-primary tracking-[0.2em] uppercase">{n.source.name}</span>
                                        <span className="text-zinc-500 opacity-60">
                                            {new Date(n.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <h3 className="text-zinc-100 text-[13px] font-bold leading-tight group-hover:text-primary transition-colors pr-4">
                                        {n.title}
                                    </h3>
                                </div>
                            ))}
                        </div>
                    </Widget>
                </div>

                {/* Logistics Tracker (3x3) */}
                <div className="col-span-1 lg:col-span-3 lg:row-span-3 min-h-[300px] lg:min-h-0">
                    <LogisticsTracker />
                </div>

                {/* AI Strategic Interface (6x2) */}
                <div className="col-span-1 lg:col-span-6 lg:row-span-2 min-h-[300px] lg:min-h-0">
                    <Widget title="AI Strategic Interface" className="h-full" icon={<Terminal size={14} />}>
                        <div className="flex flex-col h-full font-mono text-[11px] bg-zinc-950/80 rounded-none p-4 border border-border/30">
                            <div className="flex-1 space-y-2 text-primary/70 overflow-hidden">
                                {aiMessages.slice(-2).map((m, i) => (
                                    <p key={i} className="flex gap-3 leading-relaxed">
                                        <span className="text-primary font-black opacity-40">[{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}]</span>
                                        <span className={m.role === 'assistant' ? 'text-primary' : 'text-zinc-400'}>
                                            {m.role === 'assistant' ? '>> ' : '> '}{m.content}
                                        </span>
                                    </p>
                                ))}
                                {aiMessages.length === 0 && <p className="text-primary/40 leading-relaxed font-black transition-all">{" >> "} Awaiting Strategic Command...</p>}
                            </div>
                            <form onSubmit={onAiSubmit} className="flex border-t border-border/30 pt-4 shrink-0 mt-2">
                                <input
                                    type="text"
                                    value={aiInput}
                                    onChange={(e) => setAiInput(e.target.value)}
                                    placeholder="TRANSMIT ANALYTICAL QUERY..."
                                    className="bg-transparent outline-none flex-1 text-primary placeholder:text-zinc-800 uppercase font-black tracking-wider"
                                />
                                <ChevronRight size={16} className="text-primary opacity-50" />
                            </form>
                        </div>
                    </Widget>
                </div>

                {/* Meteorology (3x1) */}
                <div className="col-span-1 lg:col-span-3 lg:row-span-1 min-h-[120px] lg:min-h-0">
                    <Widget title={`Meteorology // Piacenza`} className="h-full" icon={<CloudRain size={14} />}>
                        <div className="flex justify-between items-center h-full px-4 overflow-hidden">
                            <CloudRain size={24} className="text-blue-500/80 drop-shadow-[0_0_8px_rgba(59,130,246,0.3)] shrink-0" />
                            <div className="text-right">
                                <div className="text-2xl font-black text-zinc-100 leading-none tracking-tighter">
                                    {weather?.temp || '14.2'}<span className="text-primary text-sm ml-1">°C</span>
                                </div>
                            </div>
                        </div>
                    </Widget>
                </div>

                {/* F1 Snapshot (3x1) */}
                <div className="col-span-1 lg:col-span-3 lg:row-span-1 min-h-[120px] lg:min-h-0">
                    <Widget title="F1 Session Status" className="h-full" icon={<Flag size={14} />}>
                        <div className="flex flex-col justify-center h-full px-4 overflow-hidden">
                            {f1?.session ? (
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] text-zinc-500 font-extrabold uppercase truncate mr-2">{f1.session.circuit_short_name}</span>
                                    <div className="flex items-center gap-1 text-[10px] font-black text-primary uppercase shrink-0">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                        Live
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] text-zinc-500 font-extrabold uppercase">Next: 4D 12H</span>
                                    <span className="text-[10px] font-black text-zinc-100 uppercase italic truncate ml-2">Saudi Arabia</span>
                                </div>
                            )}
                        </div>
                    </Widget>
                </div>
            </div>
        </div>
    );
}
