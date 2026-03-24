import { cn } from '../../lib/utils';

interface WidgetSkeletonProps {
    lines?: number;
    className?: string;
}

export function WidgetSkeleton({ lines = 4, className }: WidgetSkeletonProps) {
    return (
        <div className={cn("animate-pulse space-y-3 p-4", className)}>
            {/* Title bar skeleton */}
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-zinc-700" />
                <div className="h-3 w-24 bg-zinc-800 rounded" />
            </div>
            {/* Content lines */}
            {Array.from({ length: lines }).map((_, i) => (
                <div key={i} className="space-y-2">
                    <div
                        className="h-3 bg-zinc-800/60 rounded"
                        style={{ width: `${70 + Math.random() * 30}%` }}
                    />
                </div>
            ))}
        </div>
    );
}

export function CardSkeleton({ className }: { className?: string }) {
    return (
        <div className={cn(
            "border border-zinc-800 bg-zinc-900/50 rounded-lg animate-pulse",
            className
        )}>
            <div className="p-3 border-b border-zinc-800">
                <div className="h-3 w-20 bg-zinc-800 rounded" />
            </div>
            <div className="p-4 space-y-3">
                <div className="h-8 bg-zinc-800/50 rounded w-1/2" />
                <div className="h-3 bg-zinc-800/30 rounded w-3/4" />
                <div className="h-3 bg-zinc-800/30 rounded w-1/2" />
            </div>
        </div>
    );
}
