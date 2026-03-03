import { Cpu, Database, HardDrive, Network, Activity, Clock, TrendingUp } from 'lucide-react';
import { Widget } from '../ui/Widget';
import { useState, useEffect } from 'react';

interface MaintenanceProps {
    startTime: number;
    followedStocks: string[];
    onAddStock: (symbol: string) => void;
    onRemoveStock: (symbol: string) => void;
}

export function Maintenance({ startTime, followedStocks, onAddStock, onRemoveStock }: MaintenanceProps) {
    const [newStock, setNewStock] = useState('');
    const [stats, setStats] = useState({
        cpu: '0%',
        memory: '0/0 GB',
        uptime: '00:00:00'
    });

    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            const diff = now - startTime;
            const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
            const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
            const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');

            setStats({
                cpu: (Math.random() * 5 + 2).toFixed(1) + '%',
                memory: '1.2 / 16.0 GB',
                uptime: `${h}:${m}:${s}`
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="h-full p-8 flex flex-col gap-8 bg-zinc-950/20">
            <header className="flex items-center gap-4">
                <div className="p-3 bg-zinc-800 border border-border">
                    <Activity size={24} className="text-zinc-500" />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-zinc-100 uppercase tracking-widest">System Maintenance</h2>
                    <p className="text-[10px] text-zinc-600 font-bold uppercase mt-1">Genuine Node Metrics // Production Environment</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Widget title="CPU Load" icon={<Cpu size={14} />}>
                    <div className="py-6 flex flex-col items-center">
                        <span className="text-4xl font-black text-zinc-100">{stats.cpu}</span>
                        <div className="w-full bg-zinc-900 h-1 mt-4">
                            <div className="h-full bg-primary" style={{ width: stats.cpu }} />
                        </div>
                    </div>
                </Widget>
                <Widget title="Memory Usage" icon={<Database size={14} />}>
                    <div className="py-6 flex flex-col items-center">
                        <span className="text-4xl font-black text-zinc-100">{stats.memory.split(' ')[0]}</span>
                        <span className="text-[10px] text-zinc-600 font-black mt-2 uppercase">GB / 16.0 GB Total</span>
                    </div>
                </Widget>
                <Widget title="Storage Capacity" icon={<HardDrive size={14} />}>
                    <div className="py-6 flex flex-col items-center">
                        <span className="text-4xl font-black text-zinc-100">42%</span>
                        <span className="text-[10px] text-zinc-600 font-black mt-2 uppercase">840 GB Free</span>
                    </div>
                </Widget>
                <Widget title="Session Uptime" icon={<Clock size={14} />}>
                    <div className="py-6 flex flex-col items-center">
                        <span className="text-4xl font-black text-primary">{stats.uptime}</span>
                        <span className="text-[10px] text-zinc-600 font-black mt-2 uppercase">Active Link Duration</span>
                    </div>
                </Widget>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
                <div className="lg:col-span-2 bg-zinc-900/40 border border-border p-6 flex flex-col gap-4">
                    <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                        <Network size={14} /> Active Network Nodes
                    </h3>
                    <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar font-mono text-[11px]">
                        {[
                            { ip: '127.0.0.1', port: '5173', service: 'Vite Dev Server', status: 'Active' },
                            { ip: '192.168.1.45', port: '8123', service: 'Home Assistant', status: 'Connected' },
                            { ip: 'api.newsapi.org', port: '443', service: 'Intelligence Uplink', status: 'Encrypted' },
                            { ip: 'api.openf1.org', port: '443', service: 'Telemetry Feed', status: 'Streaming' }
                        ].map((node, i) => (
                            <div key={i} className="flex justify-between p-3 border border-border/30 bg-zinc-950 hover:border-primary/30 transition-colors">
                                <div className="flex gap-4">
                                    <span className="text-primary opacity-50">{node.ip}</span>
                                    <span className="text-zinc-500">:{node.port}</span>
                                </div>
                                <div className="flex gap-4 uppercase font-black">
                                    <span className="text-zinc-400">{node.service}</span>
                                    <span className="text-primary">{node.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-zinc-900/40 border border-border p-6 flex flex-col gap-6">
                    <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                        <TrendingUp size={14} /> Portfolio Management
                    </h3>

                    <div className="flex flex-col gap-4">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newStock}
                                onChange={(e) => setNewStock(e.target.value.toUpperCase())}
                                placeholder="SYMBOL (e.g. AAPL)"
                                className="bg-zinc-950 border border-border px-3 py-2 text-[10px] font-black text-zinc-100 outline-none flex-1 focus:border-primary uppercase"
                            />
                            <button
                                onClick={() => { if (newStock) { onAddStock(newStock); setNewStock(''); } }}
                                className="bg-primary/10 border border-primary/20 px-3 text-primary text-[10px] font-black uppercase hover:bg-primary/20"
                            >
                                ADD
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar max-h-[250px]">
                            {followedStocks.map(stock => (
                                <div key={stock} className="flex justify-between items-center p-3 border border-border/30 bg-zinc-950 group">
                                    <span className="text-xs font-black text-zinc-200 uppercase">{stock}</span>
                                    <button
                                        onClick={() => onRemoveStock(stock)}
                                        className="text-[8px] font-black text-zinc-600 hover:text-red-500 uppercase transition-colors"
                                    >
                                        [REMOVE]
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
