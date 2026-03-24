import { useQuery } from '@tanstack/react-query';
import { fetchFlights, fetchEarthquakes, fetchDisasters, fetchPizzaIndex, fetchWildfires, fetchNewsHotspots } from '../lib/api';

export function useFlights(bounds?: { lamin: number; lomin: number; lamax: number; lomax: number }) {
    return useQuery({
        queryKey: ['flights', bounds],
        queryFn: () => fetchFlights(bounds),
        staleTime: 30 * 1000, // 30s
        refetchInterval: 30 * 1000,
    });
}

export function useEarthquakes() {
    return useQuery({
        queryKey: ['earthquakes'],
        queryFn: fetchEarthquakes,
        staleTime: 5 * 60 * 1000, // 5 min
        refetchInterval: 5 * 60 * 1000,
    });
}

export function useDisasters() {
    return useQuery({
        queryKey: ['disasters'],
        queryFn: fetchDisasters,
        staleTime: 60 * 60 * 1000, // 1 hour
    });
}

export function useWildfires() {
    return useQuery({
        queryKey: ['wildfires'],
        queryFn: fetchWildfires,
        staleTime: 30 * 60 * 1000, // 30 min
    });
}

export function usePizzaIndex() {
    return useQuery({
        queryKey: ['pizza-index'],
        queryFn: fetchPizzaIndex,
        staleTime: 5 * 60 * 1000,
        refetchInterval: 5 * 60 * 1000,
    });
}

export function useNewsHotspots() {
    return useQuery({
        queryKey: ['news-hotspots'],
        queryFn: fetchNewsHotspots,
        staleTime: 10 * 60 * 1000,
    });
}
