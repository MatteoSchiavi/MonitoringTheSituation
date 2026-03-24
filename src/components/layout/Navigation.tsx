import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { LayoutDashboard, Newspaper, TrendingUp, Globe, Timer, Home } from 'lucide-react';

const tabs = [
    { path: '/overview', label: 'Overview', icon: LayoutDashboard },
    { path: '/news', label: 'News', icon: Newspaper },
    { path: '/stocks', label: 'Stocks', icon: TrendingUp },
    { path: '/intel', label: 'Intel', icon: Globe },
    { path: '/sports', label: 'Sports & F1', icon: Timer },
    { path: '/home', label: 'Home', icon: Home },
];

export function Navigation() {
    return (
        <nav className="border-b border-zinc-800 bg-zinc-900/60 shrink-0 sticky top-0 z-10 backdrop-blur-sm">
            <div className="max-w-[1800px] mx-auto px-0">
                <div className="flex w-full overflow-x-auto scrollbar-hide">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <NavLink
                                key={tab.path}
                                to={tab.path}
                                className={({ isActive }) => cn(
                                    "flex-1 flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold tracking-widest transition-all relative whitespace-nowrap min-h-[50px] uppercase",
                                    isActive
                                        ? "text-emerald-400 bg-emerald-500/5 shadow-[inset_0_-2px_0_rgba(16,185,129,0.5)]"
                                        : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30"
                                )}
                            >
                                {({ isActive }) => (
                                    <>
                                        <Icon size={14} className={isActive ? "animate-pulse" : ""} />
                                        <span className="hidden sm:inline">{tab.label}</span>
                                        {isActive && (
                                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                        )}
                                    </>
                                )}
                            </NavLink>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
