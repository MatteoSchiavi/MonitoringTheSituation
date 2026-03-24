import { useState } from 'react';
import { Widget } from '../ui/Widget';
import { useMultipleStocks, useEconomicCalendar } from '../../hooks/useStockQueries';
import { Plus, X, Calendar, DollarSign, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const DEFAULT_PORTFOLIO = ['SPY', 'QQQ', 'BTCUSD', 'TSLA', 'AAPL', 'NVDA', 'FTSE:MIB'];

const WORLD_INDICES = [
    { symbol: 'SPY', name: 'S&P 500' },
    { symbol: 'QQQ', name: 'NASDAQ' },
    { symbol: 'DIA', name: 'Dow Jones' },
    { symbol: 'IWM', name: 'Russell 2000' },
];

const SECTORS = [
    { symbol: 'XLF', name: 'Financials' },
    { symbol: 'XLK', name: 'Technology' },
    { symbol: 'XLV', name: 'Healthcare' },
    { symbol: 'XLE', name: 'Energy' },
    { symbol: 'XLY', name: 'Consumer Disc.' },
    { symbol: 'XLI', name: 'Industrials' },
];

export default function StocksTab() {
    const [portfolio, setPortfolio] = useState<string[]>(() => {
        const saved = localStorage.getItem('portfolio_stocks');
        return saved ? JSON.parse(saved) : DEFAULT_PORTFOLIO;
    });
    const [newSymbol, setNewSymbol] = useState('');

    const stocks = useMultipleStocks(portfolio);
    const worldIndices = useMultipleStocks(WORLD_INDICES.map(i => i.symbol));
    const sectorPerformance = useMultipleStocks(SECTORS.map(s => s.symbol));
    const calendar = useEconomicCalendar();

    const addStock = () => {
        if (newSymbol.trim() && !portfolio.includes(newSymbol.toUpperCase())) {
            const updated = [...portfolio, newSymbol.toUpperCase()];
            setPortfolio(updated);
            localStorage.setItem('portfolio_stocks', JSON.stringify(updated));
            setNewSymbol('');
        }
    };

    const removeStock = (symbol: string) => {
        const updated = portfolio.filter(s => s !== symbol);
        setPortfolio(updated);
        localStorage.setItem('portfolio_stocks', JSON.stringify(updated));
    };

    return (
        <div className="p-4 space-y-4 max-w-[1800px] mx-auto tab-content">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* World Indices */}
                <Widget
                    title="World Markets"
                    icon={<BarChart3 size={14} />}
                    loading={worldIndices.isLoading}
                    error={worldIndices.isError ? 'Unable to fetch market data' : null}
                >
                    <div className="grid grid-cols-2 gap-3">
                        {(worldIndices.data || []).map((stock: any, i: number) => {
                            const isUp = stock.change.startsWith('+');
                            return (
                                <div key={stock.symbol} className="bg-zinc-800/40 border border-zinc-800 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-medium text-zinc-500">{WORLD_INDICES[i]?.name || stock.symbol}</span>
                                        {isUp ? <ArrowUpRight size={14} className="text-emerald-400" /> : <ArrowDownRight size={14} className="text-red-400" />}
                                    </div>
                                    <div className="text-xl font-bold text-zinc-100">${stock.price}</div>
                                    <div className={`text-xs font-semibold mt-1 ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {stock.change} ({stock.percent})
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Widget>

                {/* Sector Performance */}
                <Widget
                    title="Sector Performance"
                    icon={<BarChart3 size={14} />}
                    loading={sectorPerformance.isLoading}
                    error={sectorPerformance.isError ? 'Unable to fetch sector data' : null}
                >
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {(sectorPerformance.data || []).map((stock: any, i: number) => {
                            const isUp = stock.change.startsWith('+');
                            return (
                                <div key={stock.symbol} className="bg-zinc-800/20 border border-zinc-800/50 rounded-lg p-3 hover:bg-zinc-800/50 transition-colors">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{SECTORS[i]?.name || stock.symbol}</span>
                                        {isUp ? <ArrowUpRight size={12} className="text-emerald-400" /> : <ArrowDownRight size={12} className="text-red-400" />}
                                    </div>
                                    <div className="text-base font-bold text-zinc-200">${stock.price}</div>
                                    <div className={`text-[10px] font-bold mt-0.5 ${isUp ? 'text-emerald-500' : 'text-red-500'}`}>
                                        {stock.change} ({stock.percent})
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Widget>
            </div>

            {/* Portfolio */}
            <Widget
                title="My Portfolio"
                icon={<DollarSign size={14} />}
                loading={stocks.isLoading}
                error={stocks.isError ? 'Unable to fetch stock data' : null}
                actions={
                    <form
                        onSubmit={e => { e.preventDefault(); addStock(); }}
                        className="flex gap-2"
                    >
                        <input
                            type="text"
                            value={newSymbol}
                            onChange={e => setNewSymbol(e.target.value)}
                            placeholder="Add symbol..."
                            className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-md text-xs text-zinc-300 placeholder:text-zinc-600 w-32 focus:outline-none focus:border-emerald-500/50 min-h-[44px]"
                        />
                        <button
                            type="submit"
                            className="px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-md hover:bg-emerald-500/30 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                        >
                            <Plus size={14} />
                        </button>
                    </form>
                }
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-xs text-zinc-500 border-b border-zinc-800">
                                <th className="text-left py-2 font-medium">Symbol</th>
                                <th className="text-right py-2 font-medium">Price</th>
                                <th className="text-right py-2 font-medium">Change</th>
                                <th className="text-right py-2 font-medium">%</th>
                                <th className="text-right py-2 font-medium">High</th>
                                <th className="text-right py-2 font-medium">Low</th>
                                <th className="w-10"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {(stocks.data || []).map((stock: any) => {
                                const isUp = stock.change.startsWith('+');
                                return (
                                    <tr key={stock.symbol} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                                        <td className="py-3 font-semibold text-zinc-200">{stock.symbol}</td>
                                        <td className="py-3 text-right text-zinc-200 font-medium">${stock.price}</td>
                                        <td className={`py-3 text-right font-medium ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                                            {stock.change}
                                        </td>
                                        <td className={`py-3 text-right font-medium ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                                            {stock.percent}
                                        </td>
                                        <td className="py-3 text-right text-zinc-400">${stock.high}</td>
                                        <td className="py-3 text-right text-zinc-400">${stock.low}</td>
                                        <td className="py-3 text-right">
                                            <button
                                                onClick={() => removeStock(stock.symbol)}
                                                className="p-2 text-zinc-600 hover:text-red-400 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                                            >
                                                <X size={12} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </Widget>

            {/* Economic Calendar */}
            <Widget
                title="Economic Calendar"
                icon={<Calendar size={14} />}
                loading={calendar.isLoading}
                error={calendar.isError ? 'Unable to fetch economic calendar' : null}
            >
                {calendar.data && calendar.data.length > 0 ? (
                    <div className="divide-y divide-zinc-800/50 max-h-[300px] overflow-y-auto pr-2">
                        {calendar.data.map((event: any, i: number) => (
                            <div key={i} className="py-3 first:pt-0 last:pb-0">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-bold text-zinc-200">{event.event}</span>
                                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${event.impact === 'High' ? 'bg-red-500/20 text-red-400' :
                                                event.impact === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                                                    'bg-zinc-800 text-zinc-400'
                                                }`}>
                                                {event.impact || 'Low'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-[10px] text-zinc-500 font-medium">
                                            <span className="uppercase text-zinc-400">{event.country}</span>
                                            <span>Est: {event.estimate || '—'}</span>
                                            <span>Act: {event.actual || '—'}</span>
                                        </div>
                                    </div>
                                    <div className="text-right whitespace-nowrap">
                                        <div className="text-xs font-medium text-zinc-400">
                                            {new Date(event.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        <div className="text-[9px] text-zinc-600">
                                            {new Date(event.time).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
                        <Calendar size={24} className="text-zinc-600" />
                        <p className="text-sm text-zinc-400">No major macro events scheduled</p>
                    </div>
                )}
            </Widget>
        </div>
    );
}
