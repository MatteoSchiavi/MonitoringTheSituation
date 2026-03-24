import { useQuery } from '@tanstack/react-query';
import { fetchTopHeadlines, fetchNewsByCategory, fetchNewsByQuery, summarizeWithGemini } from '../lib/api';

export function useTopHeadlines(sources?: string) {
    return useQuery({
        queryKey: ['news', 'headlines', sources],
        queryFn: () => fetchTopHeadlines(sources),
        staleTime: 15 * 60 * 1000, // 15 min
        refetchInterval: 15 * 60 * 1000,
    });
}

export function useNewsByCategory(category: string, enabled = true) {
    return useQuery({
        queryKey: ['news', 'category', category],
        queryFn: () => fetchNewsByCategory(category),
        staleTime: 15 * 60 * 1000,
        enabled,
    });
}

export function useNewsByQuery(query: string, enabled = true) {
    return useQuery({
        queryKey: ['news', 'query', query],
        queryFn: () => fetchNewsByQuery(query),
        staleTime: 15 * 60 * 1000,
        enabled,
    });
}

export function useGeminiSummary(content: string, instruction?: string, enabled = true) {
    return useQuery({
        queryKey: ['gemini-summary', content.slice(0, 100), instruction],
        queryFn: () => summarizeWithGemini(content, instruction),
        staleTime: 30 * 60 * 1000, // 30 min
        enabled: enabled && content.length > 0,
    });
}
