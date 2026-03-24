import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import type { FallbackProps } from 'react-error-boundary';
import { AlertTriangle, RefreshCw } from 'lucide-react';

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    return (
        <div className="flex flex-col items-center justify-center p-6 gap-3 text-center min-h-[120px] bg-zinc-900/50 border border-zinc-800 rounded-lg">
            <AlertTriangle size={24} className="text-amber-500" />
            <div>
                <p className="text-sm font-semibold text-zinc-300">Data Unavailable</p>
                <p className="text-xs text-zinc-500 mt-1 max-w-[280px]">
                    {errorMessage || 'This widget encountered an error.'}
                </p>
            </div>
            <button
                onClick={resetErrorBoundary}
                className="flex items-center gap-2 px-4 py-2 text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md transition-colors min-h-[44px] min-w-[44px]"
            >
                <RefreshCw size={14} />
                Retry
            </button>
        </div>
    );
}

interface WidgetErrorBoundaryProps {
    children: React.ReactNode;
    onReset?: () => void;
}

export function WidgetErrorBoundary({ children, onReset }: WidgetErrorBoundaryProps) {
    return (
        <ReactErrorBoundary FallbackComponent={ErrorFallback} onReset={onReset}>
            {children}
        </ReactErrorBoundary>
    );
}
