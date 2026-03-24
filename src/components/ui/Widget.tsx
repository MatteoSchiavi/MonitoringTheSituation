import React from 'react';
import { cn } from '../../lib/utils';
import { WidgetSkeleton } from './WidgetSkeleton';
import { WidgetErrorBoundary } from './ErrorBoundary';

interface WidgetProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  status?: 'online' | 'offline' | 'warning' | 'loading' | 'live';
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  noPadding?: boolean;
}

export function Widget({
  title,
  children,
  className = '',
  status = 'online',
  icon,
  actions,
  loading = false,
  error = null,
  onRetry,
  noPadding = false
}: WidgetProps) {
  const statusColor = {
    online: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]',
    live: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse',
    loading: 'bg-blue-500/50 animate-pulse',
    warning: 'bg-amber-500 shadow-[0_0_8px_#f59e0b]',
    offline: 'bg-red-500 shadow-[0_0_8px_#ef4444]'
  };

  return (
    <WidgetErrorBoundary onReset={onRetry}>
      <div className={cn(
        "border border-zinc-800 bg-zinc-900/60 flex flex-col relative rounded-lg overflow-hidden",
        className
      )}>
        {/* Header */}
        <div className="border-b border-zinc-800 px-4 py-2.5 flex justify-between items-center bg-zinc-900/80 min-h-[44px]">
          <div className="flex items-center gap-2.5">
            <div className={cn("w-2 h-2 rounded-full shrink-0", statusColor[status])} />
            <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider leading-none">
              {title}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {actions}
            {icon && <div className="text-zinc-500">{icon}</div>}
          </div>
        </div>

        {/* Content */}
        <div className={cn("flex-1 overflow-auto", !noPadding && "p-4")}>
          {loading ? (
            <WidgetSkeleton />
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
              <p className="text-sm text-zinc-400">Data Unavailable</p>
              <p className="text-xs text-zinc-600">{error}</p>
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="px-4 py-2 text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md transition-colors min-h-[44px] min-w-[44px]"
                >
                  Retry
                </button>
              )}
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </WidgetErrorBoundary>
  );
}