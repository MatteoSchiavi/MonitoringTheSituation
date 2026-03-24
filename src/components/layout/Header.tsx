import { useState, useEffect } from 'react';
import { MessageSquare, Settings } from 'lucide-react';

interface HeaderProps {
    onAiToggle: () => void;
    onSettingsToggle: () => void;
    theme: 'light' | 'dark';
}

export function Header({ onAiToggle, onSettingsToggle, theme }: HeaderProps) {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <header className="border-b border-zinc-800 bg-zinc-900/70 backdrop-blur-sm flex items-center justify-between px-4 sm:px-6 py-3 shrink-0">
            <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)] animate-pulse" />
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-100">
                    World Monitor
                </h1>
                <span className="hidden sm:inline text-xs text-zinc-500 border-l border-zinc-700 pl-3 ml-1 font-medium">
                    {theme === 'dark' ? 'Night Mode' : 'Day Mode'}
                </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
                <button
                    onClick={onAiToggle}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all rounded-md text-xs font-medium min-h-[44px] min-w-[44px]"
                >
                    <MessageSquare size={16} />
                    <span className="hidden sm:inline">AI Assistant</span>
                </button>

                <button
                    onClick={onSettingsToggle}
                    className="p-2.5 bg-zinc-800/50 border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-all rounded-md min-h-[44px] min-w-[44px]"
                >
                    <Settings size={18} />
                </button>

                <div className="hidden sm:flex flex-col items-end border-l border-zinc-700 pl-4 ml-1">
                    <div className="text-xl font-bold text-zinc-100 tracking-tight leading-none tabular-nums">
                        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                    </div>
                    <div className="text-[10px] text-zinc-500 leading-none mt-1 font-medium">
                        {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                </div>
            </div>
        </header>
    );
}
