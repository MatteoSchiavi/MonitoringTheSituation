import React from 'react';
import { cn } from '../../lib/utils';

interface WidgetProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  status?: 'online' | 'offline' | 'warning' | 'loading' | 'live';
  icon?: React.ReactNode;
  actions?: React.ReactNode;
}

export function Widget({
  title,
  children,
  className = '',
  status = 'online',
  icon,
  actions
}: WidgetProps) {
  return (
    <div className={cn(
      "border border-border bg-surface flex flex-col relative",
      className
    )}>
      {/* Tactical Header */}
      <div className="border-b border-border p-2 flex justify-between items-center bg-zinc-900/80">
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-2 h-2 rounded-full",
            status === 'online' || status === 'live' ? 'bg-primary shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.5)]' :
              status === 'loading' ? 'bg-primary/50 animate-pulse' :
                status === 'warning' ? 'bg-amber-500 shadow-[0_0_8px_#f59e0b]' :
                  'bg-red-500 shadow-[0_0_8px_#ef4444]'
          )} />
          <h3 className="text-primary text-[10px] font-bold uppercase tracking-widest leading-none">
            {title}
          </h3>
        </div>
        {icon && <div className="text-primary/50">{icon}</div>}
      </div>

      {/* Widget Payload */}
      <div className="p-3 flex-1 overflow-hidden">
        {children}
      </div>

      {actions && (
        <div className="border-t border-border p-2 flex gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}