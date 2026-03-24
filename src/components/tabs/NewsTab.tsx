import ReactMarkdown from 'react-markdown';
import { useState, useMemo } from 'react';
import { Widget } from '../ui/Widget';
import { useNewsByCategory, useNewsByQuery, useGeminiSummary } from '../../hooks/useNewsQueries';
import { useBlueskyFeed } from '../../hooks/useSocialQueries';
import { Newspaper, Globe, MessageCircle, Heart, Repeat, ExternalLink, TrendingDown, Cpu, Zap, Search } from 'lucide-react';

const CATEGORIES = [
    { id: 'general', label: 'World' },
    { id: 'business', label: 'Business' },
    { id: 'technology', label: 'Technology' },
    { id: 'science', label: 'Science' },
    { id: 'health', label: 'Health' },
];

const FOCUS_TOPICS = [
    { id: 'conflicts', label: 'Geopolitics & Conflicts', query: 'global conflicts war geopolitics', icon: Globe, color: 'text-red-400' },
    { id: 'economy', label: 'Macro Economy', query: 'inflation interest rates global recession banking', icon: TrendingDown, color: 'text-amber-400' },
    { id: 'tech', label: 'Tech & AI Giants', query: 'artificial intelligence Nvidia Microsoft OpenAI big tech', icon: Cpu, color: 'text-emerald-400' },
    { id: 'environment', label: 'Climate & Energy', query: 'climate change green energy power grids extreme weather', icon: Zap, color: 'text-cyan-400' },
];

export default function NewsTab() {
    const [activeCategory, setActiveCategory] = useState('general');
    const categoryNews = useNewsByCategory(activeCategory);
    const bluesky = useBlueskyFeed('breaking news');

    // Gemini summary of current category
    const newsText = useMemo(() => {
        try {
            if (!categoryNews.data || !Array.isArray(categoryNews.data) || categoryNews.data.length === 0) return '';
            return categoryNews.data.slice(0, 10)
                .filter((a: any) => a && a.title)
                .map((a: any) => `${a.title}: ${a.description || ''}`)
                .join('\n');
        } catch (e) {
            console.error('Error processing news for summary:', e);
            return '';
        }
    }, [categoryNews.data]);

    const aiSummary = useGeminiSummary(
        newsText,
        `Summarize these ${activeCategory} news articles in 3-4 concise bullet points. Highlight the most important developments.`,
        newsText.length > 0
    );

    // --- Deep Focus Feature ---
    const [activeFocusId, setActiveFocusId] = useState<string | null>(null);
    const activeFocus = useMemo(() => FOCUS_TOPICS.find(f => f.id === activeFocusId), [activeFocusId]);
    const focusNews = useNewsByQuery(activeFocus?.query || '', !!activeFocusId);

    const focusText = useMemo(() => {
        if (!focusNews.data || !Array.isArray(focusNews.data)) return '';
        return focusNews.data.slice(0, 15)
            .filter((a: any) => a && a.title)
            .map((a: any) => `- ${a.title}`)
            .join('\n');
    }, [focusNews.data]);

    const deepReview = useGeminiSummary(
        focusText,
        `DEEP FOCUS ANALYTICAL REVIEW: ${activeFocus?.label}. Analyze these news headlines. Identify 3 critical patterns or emerging risks. Be analytical, data-driven, and extremely direct.`,
        !!activeFocusId && focusText.length > 0
    );

    return (
        <div className="p-4 space-y-4 max-w-[1800px] mx-auto tab-content">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Unified Left Column: Controls + AI Brief */}
                <div className="lg:col-span-3 space-y-4">
                    {/* Navigation Bar (Categories + Deep Focus Toggles) */}
                    <div className="flex flex-col md:flex-row gap-4 p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                        <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 md:border-r md:border-zinc-800 md:pr-4">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => { setActiveCategory(cat.id); setActiveFocusId(null); }}
                                    className={`px-4 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${!activeFocusId && activeCategory === cat.id
                                        ? 'bg-zinc-100 text-zinc-900 shadow-sm'
                                        : 'bg-zinc-800/80 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
                                        }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 items-center">
                            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest px-2 hidden lg:block">Deep Focus</span>
                            {FOCUS_TOPICS.map(topic => {
                                const Icon = topic.icon;
                                const active = activeFocusId === topic.id;
                                return (
                                    <button
                                        key={topic.id}
                                        onClick={() => setActiveFocusId(active ? null : topic.id)}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-md border transition-all whitespace-nowrap ${active
                                            ? `bg-zinc-800 border-emerald-500/50 shadow-[0_4px_20px_-5px_rgba(16,185,129,0.2)]`
                                            : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                                            }`}
                                    >
                                        <Icon size={14} className={active ? topic.color : 'text-zinc-500'} />
                                        <span className={`text-[11px] font-bold ${active ? 'text-zinc-100' : 'text-zinc-500'}`}>
                                            {topic.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Integrated AI Brief / Deep Focus View */}
                    <Widget
                        title={activeFocusId ? `Deep Analysis: ${activeFocus?.label}` : `AI ${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Brief`}
                        icon={activeFocusId ? <Search size={14} /> : <Globe size={14} />}
                        status={(activeFocusId ? deepReview.isLoading : aiSummary.isLoading) ? 'loading' : 'online'}
                        loading={activeFocusId ? deepReview.isLoading : aiSummary.isLoading}
                        className={activeFocusId ? "bg-emerald-500/5 border-emerald-500/20 min-h-[250px]" : "min-h-[250px]"}
                        actions={activeFocusId ? (
                            <button
                                onClick={() => setActiveFocusId(null)}
                                className="text-[10px] text-zinc-500 hover:text-zinc-300 uppercase font-bold tracking-tighter"
                            >
                                Return to Details
                            </button>
                        ) : null}
                    >
                        {activeFocusId ? (
                            deepReview.data ? (
                                <div className="text-sm text-zinc-300 leading-relaxed markdown-content py-1">
                                    <ReactMarkdown>{deepReview.data}</ReactMarkdown>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 gap-3">
                                    <Search size={24} className="text-zinc-700 animate-pulse" />
                                    <p className="text-xs text-zinc-600 font-medium">Aggregating primary sources and analyzing risk factors...</p>
                                </div>
                            )
                        ) : (
                            aiSummary.data ? (
                                <div className="text-sm text-zinc-300 leading-relaxed markdown-content">
                                    <ReactMarkdown>{aiSummary.data}</ReactMarkdown>
                                </div>
                            ) : (
                                <p className="text-xs text-zinc-500">Generating summary...</p>
                            )
                        )}
                    </Widget>
                </div>

                {/* Right Column: Social Pulse */}
                <div className="lg:col-span-1 space-y-4">
                    {/* Social Pulse */}
                    <Widget
                        title="Social Pulse"
                        icon={<MessageCircle size={14} />}
                        status={bluesky.isLoading ? 'loading' : 'online'}
                        loading={bluesky.isLoading}
                    >
                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                            {(bluesky.data || []).slice(0, 10).map((post: any, i: number) => (
                                <div key={post.id || i} className="border-b border-zinc-800/50 pb-3 last:border-0">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        {post.avatar && (
                                            <img src={post.avatar} alt="" className="w-5 h-5 rounded-full" />
                                        )}
                                        <span className="text-xs font-semibold text-zinc-300">{post.displayName}</span>
                                        <span className="text-[10px] text-zinc-600">@{post.author}</span>
                                    </div>
                                    <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3 mb-2">{post.content}</p>
                                    <div className="flex items-center gap-4 text-[10px] text-zinc-600">
                                        <span className="flex items-center gap-1"><Heart size={10} /> {post.likes}</span>
                                        <span className="flex items-center gap-1"><Repeat size={10} /> {post.reposts}</span>
                                        <span>{new Date(post.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Widget>
                </div>
            </div>

            {/* Categorized News Feed */}
            <Widget
                title={`${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} News Links`}
                icon={<Newspaper size={14} />}
                loading={categoryNews.isLoading}
                error={categoryNews.isError ? 'Unable to fetch news' : null}
                onRetry={() => categoryNews.refetch()}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-2">
                    {(categoryNews.data || []).map((article: any, i: number) => (
                        <a
                            key={i}
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex gap-3 p-3 bg-zinc-800/20 border border-zinc-800/50 rounded-lg hover:bg-zinc-800/60 transition-all group min-h-[44px]"
                        >
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-zinc-300 line-clamp-2 group-hover:text-zinc-100">{article.title}</p>
                                {article.description && (
                                    <p className="text-xs text-zinc-500 mt-1.5 line-clamp-2">{article.description}</p>
                                )}
                                <div className="flex items-center gap-2 mt-3">
                                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{article.source?.name}</span>
                                    <span className="text-[10px] text-zinc-700">·</span>
                                    <span className="text-[10px] text-zinc-600">{new Date(article.publishedAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                            </div>
                            <ExternalLink size={14} className="text-zinc-700 shrink-0 mt-1 group-hover:text-zinc-400" />
                        </a>
                    ))}
                </div>
            </Widget>
        </div>
    );
}
