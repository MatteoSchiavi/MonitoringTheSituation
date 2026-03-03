import { useState, useEffect } from 'react';
import { MessageSquare, Settings, Activity } from 'lucide-react';
import { cn } from '../../lib/utils';

interface HeaderProps {
    onAiToggle: () => void;
    isAlertMode: boolean;
    onAlertToggle: () => void;
    onSettingsToggle: () => void;
}

export function Header({ onAiToggle, isAlertMode, onAlertToggle, onSettingsToggle }: HeaderProps) {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <header className="border-b border-border bg-zinc-900/50 flex items-center justify-between px-6 py-4 shrink-0">
            <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "w-3 h-3 rounded-full animate-pulse shadow-[0_0_12px_var(--color-primary)]",
                        isAlertMode ? "bg-red-500" : "bg-primary"
                    )} />
                    <h1 className="text-2xl font-black tracking-widest text-zinc-100 uppercase sm:text-3xl">
                        Command Center
                    </h1>
                </div>
                <div className={cn(
                    "hidden sm:block text-[10px] tracking-[0.3em] font-bold border-l border-border pl-6 ml-2",
                    isAlertMode ? "text-red-500" : "text-primary"
                )}>
                    {isAlertMode ? 'CONDITION RED // EMERGENCY' : 'SYSTEM ACTIVE // v2.5.0-ALPHA'}
                </div>
            </div>

            <div className="flex items-center gap-10">
                <div className="flex items-center gap-2 border-r border-border pr-8 mr-2 hidden lg:flex">
                    <button
                        onClick={onAiToggle}
                        className="p-3 bg-primary/5 border border-primary/20 text-primary hover:bg-primary/20 transition-all flex items-center gap-3"
                    >
                        <MessageSquare size={16} />
                        <span className="text-[10px] font-black tracking-widest uppercase">AI Intel Feed</span>
                    </button>
                    <button
                        onClick={onAlertToggle}
                        className={cn(
                            "p-3 border transition-all flex items-center gap-3 group relative overflow-hidden",
                            isAlertMode
                                ? "bg-zinc-100 text-zinc-950 border-zinc-100"
                                : "bg-red-950/20 text-red-500 border-red-500/20 hover:bg-red-500 hover:text-white"
                        )}
                    >
                        <div className={cn(
                            "absolute inset-0 bg-red-600/20 animate-pulse",
                            !isAlertMode && "hidden"
                        )} />
                        <Activity size={16} className="relative z-10" />
                        <span className="text-[10px] font-black tracking-widest uppercase relative z-10">
                            {isAlertMode ? 'STAND BY' : 'ENGAGE RED'}
                        </span>
                    </button>
                    <button
                        onClick={onSettingsToggle}
                        className="p-3 bg-zinc-800/50 border border-border text-zinc-500 hover:text-zinc-200 transition-all"
                    >
                        <Settings size={16} />
                    </button>
                </div>
                <div className="flex flex-col items-end">
                    <div className="text-3xl font-black text-zinc-100 tracking-tighter leading-none flex items-baseline">
                        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                    </div>
                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest leading-none mt-2 font-black opacity-80">
                        {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                </div>
            </div>
        </header>
    );
}
