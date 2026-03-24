import { WidgetShell } from '../ui/WidgetShell';
import { TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StockData {
    symbol: string;
    price: string;
    change: string;
    percent: string;
    history?: number[]; // Mock or real historical data for sparkline
}

interface MarketQuickLookProps {
    data?: StockData[];
    isLoading?: boolean;
}

const Sparkline = ({ data, color }: { data: number[], color: string }) => {
    if (!data || data.length < 2) return null;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const width = 60;
    const height = 20;
    const points = data.map((val, i) => ({
        x: (i / (data.length - 1)) * width,
        y: height - ((val - min) / range) * height
    }));

    const pathData = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;

    return (
        <svg width={width} height={height} className="overflow-visible">
            <path
                d={pathData}
                fill="none"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-[0_0_4px_rgba(0,0,0,0.5)]"
            />
        </svg>
    );
};

export function MarketQuickLook({ data = [], isLoading }: MarketQuickLookProps) {
    // Mock history if not provided
    const getMockHistory = () => Array.from({ length: 10 }, () => Math.random() * 100);

    return (
        <WidgetShell
            title="Global Markets"
            icon={<TrendingUp size={14} />}
            isLoading={isLoading}
            className="col-span-full xl:col-span-2"
        >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {data.length > 0 ? (
                    data.map((stock) => {
                        const isPositive = !stock.change.startsWith('-');
                        const colorClass = isPositive ? 'text-emerald-500' : 'text-red-500';
                        const strokeColor = isPositive ? '#10b981' : '#ef4444';

                        return (
                            <div
                                key={stock.symbol}
                                className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-700/50 transition-all group flex flex-col justify-between"
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <div className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.1em]">{stock.symbol}</div>
                                    {isPositive ? <ArrowUpRight size={10} className="text-emerald-500" /> : <ArrowDownRight size={10} className="text-red-500" />}
                                </div>

                                <div className="flex items-end justify-between">
                                    <div>
                                        <div className="text-sm font-black text-zinc-100 italic tracking-tighter">${stock.price}</div>
                                        <div className={cn("text-[9px] font-bold tracking-tight", colorClass)}>
                                            {stock.change} ({stock.percent})
                                        </div>
                                    </div>
                                    <div className="opacity-60 group-hover:opacity-100 transition-opacity pb-1">
                                        <Sparkline data={stock.history || getMockHistory()} color={strokeColor} />
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="col-span-full py-8 flex items-center justify-center opacity-20">
                        <TrendingUp size={32} className="text-zinc-600" />
                    </div>
                )}
            </div>
        </WidgetShell>
    );
}
