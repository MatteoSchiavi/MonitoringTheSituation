import { Terminal, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

interface AISidebarProps {
    isOpen: boolean;
    onClose: () => void;
    messages: { role: string; content: string }[];
    onSend: (msg: string) => void;
    input: string;
    setInput: (val: string) => void;
}

export function AISidebar({ isOpen, onClose, messages, onSend, input, setInput }: AISidebarProps) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            onSend(input);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[99998]"
                    />

                    {/* Sidebar */}
                    <motion.aside
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 bottom-0 w-full sm:w-[450px] bg-zinc-900 border-l border-border z-[99999] flex flex-col shadow-[0_0_40px_rgba(0,0,0,0.5)]"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-border flex items-center justify-between bg-zinc-950/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 border border-primary/20">
                                    <Terminal size={18} className="text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-black tracking-widest text-zinc-100 uppercase leading-none">AI Strategic Analysis</h2>
                                    <span className="text-[9px] text-primary/60 font-black tracking-widest uppercase mt-2 block">Claude // Operational</span>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-zinc-800 transition-colors text-zinc-500 hover:text-zinc-100"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                            {messages.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                                    <Terminal size={48} />
                                    <p className="text-[10px] font-black tracking-[0.3em] uppercase max-w-[200px]">
                                        Awaiting query for analytical processing...
                                    </p>
                                </div>
                            )}
                            {messages.map((m, i) => (
                                <div key={i} className={cn(
                                    "flex flex-col gap-2",
                                    m.role === 'user' ? "items-end" : "items-start"
                                )}>
                                    <span className="text-[9px] font-black text-zinc-500 tracking-widest uppercase">
                                        {m.role === 'user' ? "User" : "Strategic_AI"}
                                    </span>
                                    <div className={cn(
                                        "p-4 text-xs font-bold leading-relaxed border",
                                        m.role === 'user'
                                            ? "bg-zinc-800 border-border text-zinc-100"
                                            : "bg-primary/5 border-primary/20 text-primary"
                                    )}>
                                        {m.role === 'assistant' && <span className="mr-2 opacity-50">{'>'}</span>}
                                        {m.content}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input */}
                        <div className="p-6 bg-zinc-950/50 border-t border-border">
                            <form onSubmit={handleSubmit} className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="ENTER QUERY..."
                                    className="w-full bg-zinc-900 border border-border p-4 pr-12 text-xs font-black tracking-wider text-primary placeholder:text-zinc-700 outline-none focus:border-primary/50 transition-colors uppercase"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-primary/40 hover:text-primary transition-colors"
                                >
                                    <Send size={16} />
                                </button>
                            </form>
                            <div className="mt-4 flex items-center justify-between text-[8px] font-black text-zinc-600 tracking-widest uppercase">
                                <span>Direct Access Link // 12-B</span>
                                <span>Context: Dashboard_Primary</span>
                            </div>
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
}
