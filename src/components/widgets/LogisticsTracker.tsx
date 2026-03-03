import { Package, Truck, Box, MapPin, Activity } from 'lucide-react';
import { Widget } from '../ui/Widget';
import { motion } from 'framer-motion';

export function LogisticsTracker() {
    const shipments = [
        { id: 'AMZ-9932', service: 'Amazon Prime', status: 'IN_TRANSIT', ETA: '14:30', origin: 'MIL-HUB-01', type: 'SUPPLY' },
        { id: 'FDX-2201', service: 'FedEx Express', status: 'OUT_FOR_DELIVERY', ETA: '09:15', origin: 'INTL-DIST-04', type: 'STRATEGIC' },
        { id: 'UPS-8843', service: 'UPS Ground', status: 'PROCESSING', ETA: 'T+2D', origin: 'ROM-HUB-02', type: 'MAINTENANCE' }
    ];

    return (
        <Widget title="Logistics Tracker // Incoming Supply Drops" icon={<Package size={14} />}>
            <div className="p-4 flex flex-col gap-4 font-mono overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <Activity size={16} className="text-primary animate-pulse" />
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Active Supply Chain Link</span>
                    </div>
                    <span className="text-[9px] font-black text-zinc-700 uppercase">Sync: 100%</span>
                </div>

                <div className="space-y-3">
                    {shipments.map((s, i) => (
                        <div key={i} className="bg-zinc-900 border border-border group hover:border-primary transition-all p-4">
                            <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-zinc-950 border border-border group-hover:border-primary/40 transition-colors text-primary">
                                        {s.service === 'Amazon Prime' ? <Box size={14} /> : <Truck size={14} />}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-zinc-100 uppercase italic tracking-tighter">{s.id}</span>
                                        <span className="text-[8px] text-zinc-500 font-bold uppercase">{s.service}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={cn(
                                        "text-[9px] font-black px-2 py-0.5 border uppercase mb-1",
                                        s.status === 'OUT_FOR_DELIVERY' ? "text-primary border-primary bg-primary/10" : "text-zinc-500 border-zinc-500"
                                    )}>
                                        {s.status.replace(/_/g, ' ')}
                                    </div>
                                    <span className="text-[9px] font-black text-zinc-400 uppercase italic">ETA: {s.ETA}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 border-t border-border/20 pt-3">
                                <div className="flex items-center gap-2">
                                    <MapPin size={10} className="text-zinc-600" />
                                    <span className="text-[8px] font-black text-zinc-500 uppercase">Origin: {s.origin}</span>
                                </div>
                                <div className="flex items-center gap-2 justify-end">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                    <span className="text-[8px] font-black text-zinc-500 uppercase">Class: {s.type}</span>
                                </div>
                            </div>

                            {/* Delivery Progress Bar */}
                            <div className="mt-4 h-0.5 bg-zinc-950 w-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: s.status === 'OUT_FOR_DELIVERY' ? '92%' : s.status === 'IN_TRANSIT' ? '65%' : '15%' }}
                                    className="h-full bg-primary"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 pt-4 border-t border-border/20 flex items-center justify-between">
                    <button className="text-[9px] font-black text-zinc-600 hover:text-primary transition-colors uppercase tracking-widest flex items-center gap-2">
                        <Package size={12} /> Add Manual Supply Code
                    </button>
                    <span className="text-[8px] text-zinc-700 font-bold uppercase italic italic">Global Logistics Layer V4.0</span>
                </div>
            </div>
        </Widget>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
