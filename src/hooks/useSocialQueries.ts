import { useQuery } from '@tanstack/react-query';
import { fetchBlueskyFeed } from '../lib/api';

export function useBlueskyFeed(query: string = 'world news', enabled = true) {
    return useQuery({
        queryKey: ['bluesky', query],
        queryFn: () => fetchBlueskyFeed(query),
        staleTime: 10 * 60 * 1000, // 10 min
        enabled,
    });
}
