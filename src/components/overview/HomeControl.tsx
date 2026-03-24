import { WidgetShell } from '../ui/WidgetShell';
import { Lightbulb, Thermometer, Shield, Power, Fan, Tv } from 'lucide-react';
import { cn } from '../../lib/utils';

interface HomeDevice {
    id: string;
    name: string;
    type: 'light' | 'climate' | 'security' | 'media' | 'fan' | 'switch';
    state: 'on' | 'off' | 'armed' | 'disarmed';
    value?: string;
}

interface HomeControlProps {
    devices?: HomeDevice[];
    isLoading?: boolean;
    onToggle?: (id: string) => void;
}

const DeviceIcon = ({ type, state, className }: { type: HomeDevice['type'], state: HomeDevice['state'], className?: string }) => {
    const active = state === 'on' || state === 'armed';
    switch (type) {
        case 'light': return <Lightbulb className={cn(className, active && "text-amber-400 fill-amber-400/20")} size={20} />;
        case 'climate': return <Thermometer className={cn(className, active && "text-blue-400")} size={20} />;
        case 'security': return <Shield className={cn(className, active ? "text-emerald-500 fill-emerald-500/10" : "text-zinc-600")} size={20} />;
        case 'fan': return <Fan className={cn(className, active && "text-cyan-400 animate-spin-slow")} size={20} />;
        case 'media': return <Tv className={cn(className, active && "text-purple-400")} size={20} />;
        default: return <Power className={cn(className, active && "text-zinc-100")} size={20} />;
    }
};

export function HomeControl({ devices = [], isLoading, onToggle }: HomeControlProps) {
    return (
        <WidgetShell
            title="Home Control"
            isLoading={isLoading}
            className="col-span-1"
        >
            <div className="grid grid-cols-2 gap-3 h-full">
                {devices.length > 0 ? (
                    devices.map((device) => {
                        const isActive = device.state === 'on' || device.state === 'armed';
                        return (
                            <button
                                key={device.id}
                                onClick={() => onToggle?.(device.id)}
                                className={cn(
                                    "p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-all duration-300 min-h-[80px] border active:scale-95 touch-none",
                                    isActive
                                        ? "bg-zinc-100 border-white text-zinc-950 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                                        : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-400 shadow-inner"
                                )}
                            >
                                <DeviceIcon type={device.type} state={device.state} />
                                <span className="text-[9px] font-black uppercase tracking-widest text-center leading-none">
                                    {device.name}
                                </span>
                                {device.value && (
                                    <span className={cn(
                                        "text-[10px] font-black italic -mt-1",
                                        isActive ? "text-zinc-600" : "text-zinc-500"
                                    )}>
                                        {device.value}
                                    </span>
                                )}
                            </button>
                        );
                    })
                ) : (
                    <div className="col-span-full py-10 flex flex-col items-center justify-center opacity-20 space-y-2">
                        <Power size={32} className="text-zinc-600" />
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">No devices connected</p>
                    </div>
                )}
            </div>
        </WidgetShell>
    );
}
