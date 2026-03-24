import { useQuery } from '@tanstack/react-query';
import { fetchF1LatestSession, fetchF1Sessions, fetchF1Positions, fetchF1Drivers, fetchF1LapData, fetchF1RaceControl, fetchF1Location, fetchF1Weather, fetchF1PitStops, fetchF1Intervals, fetchF1TrackContour } from '../lib/api';

/** Determines if a session is currently "active" (within a plausible live window) */
function isSessionActive(session: any): boolean {
    if (!session) return false;
    const start = new Date(session.date_start);
    const end = session.date_end ? new Date(session.date_end) : new Date(start.getTime() + 3 * 60 * 60 * 1000);
    const now = new Date();
    return now >= start && now <= end;
}

export function useF1LatestSession() {
    return useQuery({
        queryKey: ['f1', 'latest-session'],
        queryFn: fetchF1LatestSession,
        staleTime: 60 * 1000,
        refetchInterval: 60 * 1000,
    });
}

export function useF1Sessions(year?: number) {
    return useQuery({
        queryKey: ['f1', 'sessions', year],
        queryFn: () => fetchF1Sessions(year),
        staleTime: 60 * 60 * 1000, // 1 hour
    });
}

export function useF1Positions(sessionKey: number | undefined, isLive: boolean) {
    return useQuery({
        queryKey: ['f1', 'positions', sessionKey],
        queryFn: () => fetchF1Positions(sessionKey!),
        staleTime: isLive ? 3000 : 60 * 60 * 1000,
        refetchInterval: isLive ? 3000 : false, // 3s during live, off otherwise
        enabled: !!sessionKey,
    });
}

export function useF1Drivers(sessionKey: number | undefined) {
    return useQuery({
        queryKey: ['f1', 'drivers', sessionKey],
        queryFn: () => fetchF1Drivers(sessionKey!),
        staleTime: 60 * 60 * 1000,
        enabled: !!sessionKey,
    });
}

export function useF1TrackContour(sessionKey: number | undefined) {
    return useQuery({
        queryKey: ['f1', 'track-contour', sessionKey],
        queryFn: () => fetchF1TrackContour(sessionKey!),
        staleTime: Infinity, // once fetched, track doesn't change
        enabled: !!sessionKey,
    });
}

export function useF1LiveLocations(sessionKey: number | undefined, isLive: boolean) {
    return useQuery({
        queryKey: ['f1', 'live-locations', sessionKey],
        queryFn: async () => {
            // Get locations from the last 15 seconds to ensure we capture all live car updates
            const dateAfter = new Date(Date.now() - 15000).toISOString();
            return await fetchF1Location(sessionKey!, dateAfter);
        },
        staleTime: 0,
        refetchInterval: isLive ? 3000 : false, // Poll every 3 seconds for moving dots
        enabled: !!sessionKey && isLive,
    });
}

export function useF1Laps(sessionKey: number | undefined, isLive: boolean) {
    return useQuery({
        queryKey: ['f1', 'laps', sessionKey],
        queryFn: () => fetchF1LapData(sessionKey!),
        staleTime: isLive ? 5000 : 60 * 60 * 1000,
        refetchInterval: isLive ? 5000 : false,
        enabled: !!sessionKey,
    });
}

export function useF1RaceControl(sessionKey: number | undefined, isLive: boolean) {
    return useQuery({
        queryKey: ['f1', 'race-control', sessionKey],
        queryFn: () => fetchF1RaceControl(sessionKey!),
        staleTime: isLive ? 3000 : 60 * 60 * 1000,
        refetchInterval: isLive ? 3000 : false,
        enabled: !!sessionKey && isLive,
    });
}

export function useF1Weather(sessionKey: number | undefined, isLive: boolean) {
    return useQuery({
        queryKey: ['f1', 'weather', sessionKey],
        queryFn: () => fetchF1Weather(sessionKey!),
        staleTime: isLive ? 30000 : 60 * 60 * 1000,
        refetchInterval: isLive ? 30000 : false,
        enabled: !!sessionKey,
    });
}

export function useF1Intervals(sessionKey: number | undefined, isLive: boolean) {
    return useQuery({
        queryKey: ['f1', 'intervals', sessionKey],
        queryFn: () => fetchF1Intervals(sessionKey!),
        staleTime: isLive ? 3000 : 60 * 60 * 1000,
        refetchInterval: isLive ? 3000 : false,
        enabled: !!sessionKey,
    });
}

export function useF1PitStops(sessionKey: number | undefined, isLive: boolean) {
    return useQuery({
        queryKey: ['f1', 'pitstops', sessionKey],
        queryFn: () => fetchF1PitStops(sessionKey!),
        staleTime: isLive ? 15000 : 60 * 60 * 1000,
        refetchInterval: isLive ? 15000 : false,
        enabled: !!sessionKey,
    });
}

export { isSessionActive };
