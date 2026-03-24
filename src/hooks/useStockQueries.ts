import { useQuery } from '@tanstack/react-query';
import { fetchStockQuote, fetchMultipleStocks, fetchEconomicCalendar } from '../lib/api';

export function useStockQuote(symbol: string, enabled = true) {
    return useQuery({
        queryKey: ['stock', symbol],
        queryFn: () => fetchStockQuote(symbol),
        staleTime: 60 * 1000, // 1 min
        refetchInterval: 60 * 1000,
        enabled,
    });
}

export function useMultipleStocks(symbols: string[]) {
    return useQuery({
        queryKey: ['stocks', symbols.join(',')],
        queryFn: () => fetchMultipleStocks(symbols),
        staleTime: 60 * 1000,
        refetchInterval: 60 * 1000,
    });
}

export function useEconomicCalendar(enabled = true) {
    return useQuery({
        queryKey: ['economic-calendar'],
        queryFn: fetchEconomicCalendar,
        staleTime: 60 * 60 * 1000, // 1 hour
        enabled,
    });
}
