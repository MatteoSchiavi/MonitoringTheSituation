import { WidgetShell } from '../ui/WidgetShell';
import { Activity, Wind, Thermometer, Cloud } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SportsViabilityProps {
    status?: 'OPTIMAL' | 'NOT OPTIMAL' | 'CAUTION';
    metrics?: {
        wind: string;
        aqi: number;
        temp: string;
    };
    isLoading?: boolean;
}

export function SportsViability({ status = 'OPTIMAL', metrics, isLoading }: SportsViabilityProps) {
    const isOptimal = status === 'OPTIMAL';
    const isCaution = status === 'CAUTION';

    const statusColor = isOptimal ? 'text-emerald-500' : isCaution ? 'text-amber-500' : 'text-red-500';
    const statusBg = isOptimal ? 'bg-emerald-500/10' : isCaution ? 'bg-amber-500/10' : 'bg-red-500/10';
    const statusBorder = isOptimal ? 'border-emerald-500/20' : isCaution ? 'border-amber-500/20' : 'border-red-500/20';

    return (
        <WidgetShell
            title="Sport Viability"
            icon={<Activity size={14} />}
            isLoading={isLoading}
            className="col-span-1"
        >
            <div className="flex flex-col h-full justify-between items-center py-2">
                <div className={cn(
                    "px-6 py-4 rounded-2xl border text-center transition-all duration-500",
                    statusBg, statusBorder
                )}>
                    <div className={cn("text-3xl font-black italic tracking-tighter", statusColor)}>
                        {status}
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 mt-1 opacity-60">Status Assessment</p>
                </div>

                <div className="w-full grid grid-cols-3 gap-2 mt-4">
                    <div className="flex flex-col items-center">
                        <Wind size={12} className="text-zinc-600 mb-1" />
                        <span className="text-[10px] font-bold text-zinc-200">{metrics?.wind || '—'}</span>
                        <span className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">Wind</span>
                    </div>
                    <div className="flex flex-col items-center border-x border-zinc-800/50">
                        <Cloud size={12} className="text-zinc-600 mb-1" />
                        <span className="text-[10px] font-bold text-zinc-200">{metrics?.aqi || '—'}</span>
                        <span className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">AQI</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <Thermometer size={12} className="text-zinc-600 mb-1" />
                        <span className="text-[10px] font-bold text-zinc-200">{metrics?.temp || '—'}</span>
                        <span className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">Temp</span>
                    </div>
                </div>
            </div>
        </WidgetShell>
    );
}
