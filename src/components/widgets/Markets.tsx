import { useState } from 'react';
import { TrendingUp, Activity, Globe, DollarSign, PieChart, Info, Newspaper } from 'lucide-react';
import { Widget } from '../ui/Widget';
import type { StockData } from '../../types/dashboard';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

interface MarketsProps {
    stocks: StockData[];
    followedStocks?: string[];
    onAddStock: (symbol: string) => void;
}

const Sparkline = ({ data, color }: { data: number[], color: string }) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min;
    const width = 100;
    const height = 30;

    const points = data.map((v, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((v - min) / range) * height;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-24 h-8 overflow-visible">
            <polyline
                fill="none"
                stroke={color}
                strokeWidth="1.5"
                points={points}
                className="transition-all duration-1000"
            />
        </svg>
    );
};

export function Markets({ stocks, onAddStock }: MarketsProps) {
    const [newSymbol, setNewSymbol] = useState('');

    // Mock sparkline data
    const getMockHistory = () => Array.from({ length: 20 }).map(() => 100 + Math.random() * 20);

    return (
        <div className="h-full p-6 flex flex-col gap-6 bg-zinc-950/20 overflow-hidden relative font-mono">
            <header className="flex items-center justify-between shrink-0 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 border border-primary/20">
                        <TrendingUp size={24} className="text-primary" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-zinc-100 uppercase tracking-widest">Global Markets</h2>
                        <div className="text-[10px] text-zinc-500 font-black tracking-widest uppercase mt-1">
                            Real-Time Financial Intelligence Stream // Multi-Exchange Sync
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <input
                            type="text"
                            value={newSymbol}
                            onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
                            placeholder="ADD SYMBOL"
                            className="bg-zinc-900 border border-border px-4 py-2 text-[10px] font-black text-zinc-100 outline-none focus:border-primary transition-colors pr-10 uppercase w-48"
                        />
                        <button
                            onClick={() => {
                                if (newSymbol) {
                                    onAddStock(newSymbol);
                                    setNewSymbol('');
                                }
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:text-white transition-colors"
                        >
                            <Activity size={14} />
                        </button>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-12 gap-6 flex-1 overflow-hidden relative z-10">
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-6 overflow-y-auto pr-4 custom-scrollbar pb-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {stocks.map((s, i) => (
                            <Widget key={i} title={s.symbol} className="hover:border-primary transition-all group bg-zinc-900/60" icon={<DollarSign size={12} />}>
                                <div className="flex items-center justify-between py-2">
                                    <div className="flex flex-col">
                                        <div className="text-3xl font-black text-zinc-100 italic">${s.price}</div>
                                        <div className={cn(
                                            "flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mt-1",
                                            s.change.startsWith('+') ? "text-primary" : "text-red-500"
                                        )}>
                                            {s.change.startsWith('+') ? <TrendingUp size={14} /> : <TrendingUp size={14} className="rotate-180" />}
                                            {s.change} ({s.percent})
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <Sparkline
                                            data={getMockHistory()}
                                            color={s.change.startsWith('+') ? 'var(--color-primary)' : '#ef4444'}
                                        />
                                        <span className="text-[8px] text-zinc-600 font-black uppercase">24H Velocity</span>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-border/20 grid grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                        <span className="text-[8px] text-zinc-600 font-black uppercase mb-1">Market Cap</span>
                                        <span className="text-[10px] font-black text-zinc-400">{(Math.random() * 2).toFixed(2)}T</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[8px] text-zinc-600 font-black uppercase mb-1">Volume 24h</span>
                                        <span className="text-[10px] font-black text-zinc-400">
                                            {s.volume ? (parseInt(s.volume) / 1000000).toFixed(1) + 'M' : '--'}
                                        </span>
                                    </div>
                                </div>
                            </Widget>
                        ))}
                    </div>

                    <Widget title="Global Equity Sentiment" icon={<Globe size={14} />}>
                        <div className="grid grid-cols-3 gap-8 py-6 px-4">
                            {[
                                { label: 'TECH', val: 85, status: 'Bullish' },
                                { label: 'ENERGY', val: 32, status: 'Bearish' },
                                { label: 'RETAIL', val: 56, status: 'Neutral' }
                            ].map((s, i) => (
                                <div key={i} className="flex flex-col items-center gap-4">
                                    <div className="relative w-20 h-20 flex items-center justify-center">
                                        <svg className="w-full h-full -rotate-90">
                                            <circle cx="40" cy="40" r="35" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-zinc-900" />
                                            <circle cx="40" cy="40" r="35" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={220} strokeDashoffset={220 - (220 * s.val) / 100}
                                                className={cn("transition-all duration-1000", s.val > 60 ? "text-primary" : s.val < 40 ? "text-red-500" : "text-amber-500")} />
                                        </svg>
                                        <span className="absolute text-xs font-black text-zinc-100 italic">{s.val}%</span>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-[10px] font-black text-zinc-200 uppercase tracking-widest">{s.label}</div>
                                        <div className={cn("text-[8px] font-black uppercase mt-1", s.val > 60 ? "text-primary" : s.val < 40 ? "text-red-500" : "text-amber-500")}>{s.status}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Widget>
                </div>

                <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                    <Widget title="Analyst Intelligence" icon={<Newspaper size={14} />}>
                        <div className="space-y-4">
                            {[
                                { stock: 'NVDA', msg: 'Semiconductor demand remains parabolic. Price target upgrade to 1200.' },
                                { stock: 'TSLA', msg: 'Regulatory headwinds in APAC markets driving short-term volatility.' },
                                { stock: 'BTC', msg: 'Network hashrate reaches all-time high amidst institutional accumulation.' },
                                { stock: 'AAPL', msg: 'Services revenue growth providing reliable floor against hardware cycle lag.' }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 p-4 bg-zinc-900 border-l-2 border-primary group hover:bg-zinc-800 transition-colors">
                                    <div className="flex flex-col gap-1 w-full">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-[9px] font-black text-primary uppercase tracking-widest italic">{item.stock}</span>
                                            <span className="text-[7px] text-zinc-600 font-bold uppercase">5m ago</span>
                                        </div>
                                        <p className="text-[11px] font-bold text-zinc-300 leading-snug uppercase">{item.msg}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Widget>

                    <Widget title="Portfolio Allocation Analysis" icon={<PieChart size={14} />}>
                        <div className="flex flex-col gap-4 py-4 px-2">
                            {[
                                { label: 'Equities', val: 65, color: 'primary' },
                                { label: 'Indices', val: 18, color: 'blue-500' },
                                { label: 'Digital Assets', val: 12, color: 'amber-500' },
                                { label: 'Liquid Cash', val: 5, color: 'zinc-500' }
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col gap-1.5">
                                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-zinc-500">
                                        <span>{item.label}</span>
                                        <span className="text-zinc-300">{item.val}%</span>
                                    </div>
                                    <div className="h-1 bg-zinc-900 w-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: `${item.val}%` }} className={cn("h-full", `bg-${item.color}`)} />
                                    </div>
                                </div>
                            ))}
                            <div className="mt-4 p-3 bg-zinc-950 border border-primary/20 flex items-center gap-3">
                                <Info size={14} className="text-primary" />
                                <p className="text-[9px] font-black text-zinc-500 uppercase leading-relaxed">System weighted leverage is currently at 1.4x baseline. Risk levels optimal.</p>
                            </div>
                        </div>
                    </Widget>
                </div>
            </div>
        </div>
    );
}
