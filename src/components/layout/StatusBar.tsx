import { Database, Activity } from 'lucide-react';

export function StatusBar() {
    return (
        <footer className="bg-zinc-900 border-t border-border px-8 py-3 shrink-0">
            <div className="flex items-center justify-between text-[10px] font-black tracking-widest text-zinc-500 uppercase sm:text-xs">
                <div className="flex items-center gap-6 px-4">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest italic">
                            System Integrity: Nominal
                        </span>
                    </div>
                    <div className="h-4 w-px bg-border/20" />
                    <div className="flex items-center gap-2">
                        <Database size={10} className="text-zinc-600" />
                        <span className="text-[10px] text-zinc-600 font-bold uppercase">
                            Vite_HMR: Ready // Port_5175
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-6 px-4">
                    <div className="flex items-center gap-2">
                        <Activity size={10} className="text-zinc-600" />
                        <span className="text-[10px] text-zinc-600 font-bold uppercase">
                            Real-Time Telemetry Feed: Synchronized
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
