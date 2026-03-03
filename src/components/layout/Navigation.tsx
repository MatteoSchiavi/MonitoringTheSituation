import { cn } from '../../lib/utils';
import { Menu, AlertCircle, TrendingUp, Radio, Home, Newspaper, Waves, Map as MapIcon } from 'lucide-react';

interface NavigationProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export function Navigation({ activeTab, setActiveTab }: NavigationProps) {
    const tabs = [
        { id: 'overview', label: 'OVERVIEW', icon: Menu },
        { id: 'intel', label: 'STRATEGIC INTEL', icon: AlertCircle },
        { id: 'map', label: 'GLOBAL MAP', icon: MapIcon },
        { id: 'markets', label: 'FINANCE', icon: TrendingUp },
        { id: 'f1', label: 'F1 TELEMETRY', icon: Radio },
        { id: 'habitat', label: 'HABITAT', icon: Home },
        { id: 'environmental', label: 'ENVIRONMENTAL', icon: Waves },
        { id: 'news', label: 'GLOBAL NEWS', icon: Newspaper }
    ];

    return (
        <nav className="border-b border-border bg-zinc-900/40 shrink-0 sticky top-0 z-10 backdrop-blur-sm">
            <div className="max-w-[1800px] mx-auto px-4">
                <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "flex items-center gap-3 px-8 py-4 text-[11px] tracking-widest font-black transition-all duration-300 uppercase relative whitespace-nowrap",
                                    isActive
                                        ? "text-primary bg-zinc-800/60"
                                        : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/40"
                                )}
                            >
                                <Icon size={16} />
                                {tab.label}
                                {isActive && (
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary shadow-[0_0_12px_rgba(var(--color-primary-rgb),0.5)]" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
