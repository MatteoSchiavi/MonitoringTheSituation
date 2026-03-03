import { Terminal as TerminalIcon, Server, MonitorIcon, Clock, Activity, AlertTriangle } from 'lucide-react';
import { Widget } from '../ui/Widget';
import { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '../../lib/utils';
import { getGeminiResponse } from '../../lib/gemini';
import { motion, AnimatePresence } from 'framer-motion';

interface AITerminalProps {
    isAlertMode?: boolean;
}

export function AITerminal({ isAlertMode }: AITerminalProps) {
    const [messages, setMessages] = useState<{ role: string; content: string; timestamp: Date }[]>([]);
    const [input, setInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isProcessing) return;

        const userMsg = { role: 'user', content: input, timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsProcessing(true);
        setError(null);

        try {
            const response = await getGeminiResponse(input, messages.slice(-10).map(m => ({ role: m.role, content: m.content })));
            if (!response) throw new Error("Connection failed");
            setMessages(prev => [...prev, { role: 'assistant', content: response, timestamp: new Date() }]);
        } catch (err) {
            setError("Analytical core offline. Retrying connection...");
            console.error(err);
        } finally {
            setIsProcessing(false);
        }
    }, [input, messages, isProcessing]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isProcessing, error]);

    return (
        <div className="h-full p-6 flex flex-col gap-6 bg-zinc-950/20 overflow-hidden relative font-mono">
            <header className="flex items-center justify-between shrink-0 mb-4 border-b border-border/30 pb-4 relative z-10">
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "p-3 border transition-all duration-500",
                        isAlertMode
                            ? "bg-red-500/10 border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                            : "bg-primary/10 border-primary text-primary shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    )}>
                        <TerminalIcon size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-zinc-100 uppercase tracking-widest">Strategic Interface</h2>
                        <div className="text-[10px] text-zinc-500 font-black tracking-widest uppercase mt-1">
                            Gemini AI Analytical Engine // Operational Node
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-12 gap-6 flex-1 overflow-hidden relative z-10">
                <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
                    <Widget title="System Status" icon={<Server size={14} />}>
                        <div className="space-y-4 py-3">
                            <div className="flex items-center gap-2 text-[10px] text-primary font-black uppercase">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                Operational
                            </div>
                            <div className="text-[10px] text-zinc-500 font-bold uppercase p-2 border border-border/30 bg-zinc-900/40">
                                Neural link stable. Ready for complex queries.
                            </div>
                        </div>
                    </Widget>
                </div>

                <div className="col-span-12 lg:col-span-9 flex flex-col gap-6">
                    <div className="flex-1 bg-zinc-950 border border-border flex flex-col relative overflow-hidden group">
                        {/* Terminal Background Elements */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none overflow-hidden text-[8px] leading-tight font-black text-primary p-4 whitespace-pre">
                            {Array.from({ length: 40 }).map((_, i) => (
                                <div key={i}>DAT_STREAM_{Math.random().toString(16).slice(2, 8).toUpperCase()} SYNC_OK__{Math.floor(Math.random() * 999)}</div>
                            ))}
                        </div>

                        {/* Header Bar */}
                        <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-zinc-900/50 relative z-10 shrink-0">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-3">
                                    <MonitorIcon size={14} className="text-primary" />
                                    <span className="text-[10px] font-black tracking-widest text-zinc-300 uppercase">Analytical Session // TTY1</span>
                                </div>
                                <div className="flex items-center gap-3 border-l border-zinc-800 pl-6">
                                    <Clock size={14} className="text-zinc-600" />
                                    <span className="text-[10px] font-black tracking-widest text-zinc-600 uppercase italic">Uptime: 24h 12m 04s</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <div className="w-2.5 h-2.5 rounded-none bg-zinc-800 border-zinc-700 border" />
                                <div className="w-2.5 h-2.5 rounded-none bg-zinc-800 border-zinc-700 border" />
                                <div className="w-2.5 h-2.5 rounded-none bg-primary/50 border-primary/20 border" />
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar relative z-10">
                            {messages.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-30">
                                    <div className="p-6 border-2 border-primary/20 bg-primary/5">
                                        <TerminalIcon size={48} className="text-primary" />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[11px] font-black tracking-[0.4em] uppercase">Ready for Analysis</p>
                                        <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest italic">Data stream synchronized and waiting for query input</p>
                                    </div>
                                </div>
                            )}

                            <AnimatePresence>
                                {messages.map((m, i) => (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        key={i}
                                        className="flex gap-6 max-w-[90%]"
                                    >
                                        <div className="shrink-0 pt-1.5 font-black text-primary opacity-30 text-[10px] uppercase">
                                            [{m.timestamp.toLocaleTimeString([], { hour12: false })}]
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <span className={cn(
                                                    "text-[10px] font-black tracking-widest uppercase",
                                                    m.role === 'user' ? "text-zinc-500" : "text-primary"
                                                )}>
                                                    {m.role === 'user' ? 'User' : 'Strategic_AI'}
                                                </span>
                                                <div className="w-1 h-1 bg-zinc-800 rotate-45" />
                                            </div>
                                            <p className={cn(
                                                "text-[13px] font-bold leading-relaxed whitespace-pre-wrap transition-colors duration-500",
                                                m.role === 'assistant'
                                                    ? (isAlertMode ? "text-red-500 bg-red-500/5 p-4 border-l-2 border-red-500" : "text-primary bg-primary/5 p-4 border-l-2 border-primary")
                                                    : "text-zinc-200"
                                            )}>
                                                {m.role === 'assistant' ? '>> ' : '> '}{m.content}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                                {isProcessing && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-6">
                                        <div className="shrink-0 pt-1.5 font-black text-primary opacity-30 text-[10px] uppercase">
                                            [{new Date().toLocaleTimeString([], { hour12: false })}]
                                        </div>
                                        <div className="space-y-3">
                                            <span className="text-[10px] font-black tracking-widest uppercase text-primary animate-pulse">Processing Analytical Query...</span>
                                            <div className="flex gap-1.5">
                                                <div className="w-1 h-1 bg-primary animate-pulse" />
                                                <div className="w-1 h-1 bg-primary animate-pulse delay-75" />
                                                <div className="w-1 h-1 bg-primary animate-pulse delay-150" />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                                {error && (
                                    <div className="flex gap-6 text-red-500 italic">
                                        <AlertTriangle size={14} className="shrink-0" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{error}</span>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="p-6 bg-zinc-900 border-t border-border relative z-10 shrink-0">
                            <form onSubmit={handleSubmit} className="flex items-center gap-6">
                                <div className={cn(
                                    "flex items-center gap-3 font-black text-xs uppercase tracking-widest shrink-0 transition-colors duration-500",
                                    isAlertMode ? "text-red-500" : "text-primary"
                                )}>
                                    <Activity size={16} /> Query &gt;
                                </div>
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="ENTER ANALYTICAL QUERY..."
                                    className={cn(
                                        "bg-transparent border-none outline-none flex-1 font-black text-sm uppercase tracking-widest transition-colors duration-500",
                                        isAlertMode ? "text-red-500 placeholder:text-red-900" : "text-primary placeholder:text-zinc-800"
                                    )}
                                    autoFocus
                                />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
