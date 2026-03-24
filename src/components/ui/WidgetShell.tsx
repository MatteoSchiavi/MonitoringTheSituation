import React from 'react';
import { cn } from '../../lib/utils';
import { ErrorBoundary } from 'react-error-boundary';

interface WidgetShellProps {
    title?: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    isLoading?: boolean;
    error?: Error | null;
    onReset?: () => void;
    actions?: React.ReactNode;
    statusColor?: string;
}

const Shimmer = () => (
    <div className="animate-pulse space-y-4">
        <div className="h-4 bg-zinc-800 rounded w-3/4"></div>
        <div className="h-24 bg-zinc-900/50 rounded-lg border border-zinc-800/50"></div>
        <div className="space-y-2">
            <div className="h-3 bg-zinc-800 rounded w-full"></div>
            <div className="h-3 bg-zinc-800 rounded w-5/6"></div>
        </div>
    </div>
);

const ErrorFallback = ({ error, resetErrorBoundary }: { error: any, resetErrorBoundary: () => void }) => (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="p-3 bg-red-500/10 rounded-full">
            <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
        </div>
        <div className="space-y-1">
            <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-widest">Data Unavailable</h4>
            <p className="text-[10px] text-zinc-500 leading-tight max-w-[200px]">
                {error?.message || 'An unexpected error occurred while loading this widget.'}
            </p>
        </div>
        <button
            onClick={resetErrorBoundary}
            className="px-4 py-2 text-[10px] font-black uppercase tracking-widest bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-md transition-all min-h-[44px]"
        >
            Retry Feed
        </button>
    </div>
);

export function WidgetShell({
    title,
    icon,
    children,
    className,
    isLoading,
    error,
    onReset,
    actions,
    statusColor = 'bg-emerald-500'
}: WidgetShellProps) {
    return (
        <div className={cn(
            "h-full w-full bg-zinc-950/80 backdrop-blur-md border border-zinc-800/50 rounded-xl overflow-hidden shadow-2xl flex flex-col group transition-all duration-300 hover:border-zinc-700/50",
            className
        )}>
            {/* Header */}
            <div className="widget-header px-4 py-3 border-b border-zinc-800/50 flex items-center justify-between shrink-0 bg-zinc-900/40 cursor-grab active:cursor-grabbing">
                <div className="flex items-center gap-2.5">
                    <div className={cn("w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor]", statusColor)} />
                    {title && (
                        <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] leading-none">
                            {title}
                        </h3>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    {actions}
                    {icon && <div className="text-zinc-600 transition-colors group-hover:text-zinc-400">{icon}</div>}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-auto relative p-4 scrollbar-hide">
                {error ? (
                    <ErrorFallback error={error} resetErrorBoundary={onReset || (() => { })} />
                ) : (
                    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={onReset}>
                        {isLoading ? <Shimmer /> : children}
                    </ErrorBoundary>
                )}
            </div>
        </div>
    );
}
