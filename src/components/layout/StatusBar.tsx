import { useEffect, useState } from 'react';
import { Activity, Wifi, WifiOff, Clock } from 'lucide-react';

export function StatusBar() {
    const [latency, setLatency] = useState<number | null>(null);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [lastRefresh, setLastRefresh] = useState(new Date());

    useEffect(() => {
        // Monitor network status
        const onOnline = () => setIsOnline(true);
        const onOffline = () => setIsOnline(false);
        window.addEventListener('online', onOnline);
        window.addEventListener('offline', onOffline);

        // Measure latency
        async function measureLatency() {
            try {
                const start = performance.now();
                await fetch('https://api.open-meteo.com/v1/forecast?latitude=0&longitude=0&current=temperature_2m', { method: 'HEAD', mode: 'no-cors' });
                const end = performance.now();
                setLatency(Math.round(end - start));
                setLastRefresh(new Date());
            } catch {
                setLatency(null);
            }
        }
        measureLatency();
        const interval = setInterval(measureLatency, 30000);

        return () => {
            window.removeEventListener('online', onOnline);
            window.removeEventListener('offline', onOffline);
            clearInterval(interval);
        };
    }, []);

    return (
        <footer className="bg-zinc-950 border-t border-zinc-800 px-4 sm:px-6 py-2 shrink-0">
            <div className="flex items-center justify-between text-[10px] font-medium text-zinc-500">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                        {isOnline ? (
                            <Wifi size={10} className="text-emerald-500" />
                        ) : (
                            <WifiOff size={10} className="text-red-500" />
                        )}
                        <span>{isOnline ? 'Online' : 'Offline'}</span>
                    </div>

                    {latency !== null && (
                        <>
                            <span className="text-zinc-700">|</span>
                            <div className="flex items-center gap-1.5">
                                <Activity size={10} className={latency < 200 ? 'text-emerald-500' : latency < 500 ? 'text-amber-500' : 'text-red-500'} />
                                <span>{latency}ms</span>
                            </div>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-1.5">
                    <Clock size={10} />
                    <span>Updated {lastRefresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            </div>
        </footer>
    );
}
