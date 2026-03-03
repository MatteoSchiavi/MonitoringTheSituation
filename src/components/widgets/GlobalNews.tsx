import { Newspaper, Zap, Activity, Globe, MessageSquare } from 'lucide-react';
import { Widget } from '../ui/Widget';
import type { NewsArticle } from '../../types/dashboard';
import { motion } from 'framer-motion';

interface GlobalNewsProps {
    news: NewsArticle[];
}

export function GlobalNews({ news }: GlobalNewsProps) {
    return (
        <div className="h-full p-6 flex flex-col gap-6 bg-zinc-950/20 overflow-hidden relative font-mono">
            <header className="flex items-center justify-between shrink-0 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 border border-primary/20">
                        <Newspaper size={24} className="text-primary" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-zinc-100 uppercase tracking-widest">Global News Intelligence</h2>
                        <div className="text-[10px] text-zinc-500 font-black tracking-widest uppercase mt-1">
                            Real-Time Multi-Source Aggregation // AI Analytical Layer
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-12 gap-6 flex-1 overflow-hidden relative z-10">
                {/* AI SUMMARY SECTION */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 overflow-hidden">
                    <Widget title="AI Strategic Briefing" icon={<Zap size={14} />} className="border-primary/40 bg-primary/5">
                        <div className="p-6 space-y-6">
                            <div className="flex items-center gap-3 text-primary">
                                <Activity size={16} className="animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Live Analysis Active</span>
                            </div>

                            <div className="space-y-4">
                                <section className="space-y-2">
                                    <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b border-border/20 pb-1 flex items-center gap-2">
                                        <Globe size={12} /> Key Narrative Shifts
                                    </h4>
                                    <p className="text-[11px] text-zinc-300 font-bold leading-relaxed uppercase">
                                        Surge in semiconductor trade discussions following APAC policy updates. Tech sector showing high sentiment correlation with AI infrastructure expansion.
                                    </p>
                                </section>

                                <section className="space-y-2">
                                    <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b border-border/20 pb-1 flex items-center gap-2">
                                        <Zap size={12} /> Critical Signals
                                    </h4>
                                    <ul className="space-y-2">
                                        <li className="text-[10px] text-primary font-black border-l border-primary/40 pl-3">
                                            ENERGY: RENEWABLE PARITY REACHED IN SCANDINAVIA
                                        </li>
                                        <li className="text-[10px] text-zinc-400 font-black border-l border-border/40 pl-3">
                                            LOGISTICS: FREIGHT VELOCITY RECOVERY IN RED SEA
                                        </li>
                                    </ul>
                                </section>
                            </div>

                            <div className="pt-6 border-t border-border/20">
                                <div className="text-[9px] font-black text-zinc-500 uppercase italic">Briefing generated via Gemini-1.5-Pro // Real-time context injected</div>
                            </div>
                        </div>
                    </Widget>

                    <Widget title="Information Sources" icon={<Globe size={14} />}>
                        <div className="p-4 grid grid-cols-2 gap-2">
                            {['REUTERS', 'BLOOMBERG', 'AP NEWS', 'FINANCIAL TIMES', 'TECHCRUNCH', 'BBC'].map(src => (
                                <div key={src} className="border border-border p-2 flex items-center justify-between group hover:border-primary transition-all cursor-pointer">
                                    <span className="text-[9px] font-black text-zinc-500 group-hover:text-primary transition-colors">{src}</span>
                                    <div className="w-1 h-1 bg-primary rounded-full" />
                                </div>
                            ))}
                        </div>
                    </Widget>

                    <Widget title="Live Visual Intelligence" icon={<Zap size={14} />} className="flex-1">
                        <div className="relative w-full h-full min-h-[200px] border border-border">
                            <iframe
                                width="100%"
                                height="100%"
                                src="https://www.youtube.com/embed/dp8PhLsUcFE?autoplay=1&mute=1&controls=0"
                                title="Bloomberg Global News Live"
                                className="absolute inset-0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </Widget>
                </div>

                {/* MAIN FEED SECTION */}
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-4 overflow-hidden">
                    <div className="flex items-center justify-between shrink-0 mb-2">
                        <div className="flex gap-4">
                            <span className="text-[10px] font-black text-primary border-b-2 border-primary pb-1 cursor-pointer uppercase tracking-widest">LATEST FEED</span>
                            <span className="text-[10px] font-black text-zinc-600 hover:text-zinc-400 transition-colors cursor-pointer uppercase tracking-widest">POLITICS</span>
                            <span className="text-[10px] font-black text-zinc-600 hover:text-zinc-400 transition-colors cursor-pointer uppercase tracking-widest">ECONOMY</span>
                        </div>
                        <div className="text-[10px] text-zinc-600 font-black uppercase">SYNC_OK // {news.length} ARTICLES</div>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar space-y-4 pb-10">
                        {news.map((n, i) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                key={i}
                                className="bg-zinc-900/40 border-l-2 border-primary/20 hover:border-primary p-6 transition-all group cursor-pointer"
                            >
                                <div className="flex justify-between items-center mb-3 text-[10px] font-black">
                                    <span className="text-primary tracking-[0.2em] uppercase">{n.source.name}</span>
                                    <span className="text-zinc-500">
                                        {new Date(n.publishedAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                    </span>
                                </div>
                                <h3 className="text-lg font-black text-zinc-100 group-hover:text-primary transition-colors leading-tight mb-3 uppercase tracking-tight">
                                    {n.title}
                                </h3>
                                <p className="text-[11px] text-zinc-400 font-bold leading-relaxed uppercase pr-10">
                                    {n.description || "Analytical summary extraction in progress. Full intelligence brief available in primary terminal link."}
                                </p>
                                <div className="mt-4 flex gap-4 text-[9px] font-black text-zinc-600 uppercase">
                                    <span className="flex items-center gap-1.5 hover:text-primary transition-colors"><MessageSquare size={10} /> ANALYZE</span>
                                    <span className="flex items-center gap-1.5 hover:text-primary transition-colors"><Globe size={10} /> WEB_ARCHIVE</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
