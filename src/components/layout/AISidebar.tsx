import ReactMarkdown from 'react-markdown';
import { X, Send, MessageSquare, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useRef, useEffect } from 'react';

interface AISidebarProps {
    isOpen: boolean;
    onClose: () => void;
    messages: { role: string; content: string }[];
    onSend: (msg: string) => void;
    input: string;
    setInput: (val: string) => void;
}

export function AISidebar({ isOpen, onClose, messages, onSend, input, setInput }: AISidebarProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

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
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99998]"
                    />

                    <motion.aside
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px] bg-zinc-900 border-l border-zinc-800 z-[99999] flex flex-col"
                    >
                        {/* Header */}
                        <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/10 rounded-md">
                                    <Bot size={18} className="text-emerald-400" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-semibold text-zinc-200">AI Assistant</h2>
                                    <span className="text-[10px] text-zinc-500">Powered by Gemini</span>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2.5 hover:bg-zinc-800 rounded-md transition-colors text-zinc-500 hover:text-zinc-300 min-h-[44px] min-w-[44px] flex items-center justify-center"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-4">
                            {messages.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-3 opacity-40">
                                    <MessageSquare size={36} />
                                    <p className="text-xs text-zinc-500 max-w-[200px]">
                                        Ask anything — news analysis, market insights, weather forecasts, or control your home.
                                    </p>
                                </div>
                            )}
                            {messages.map((m, i) => (
                                <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user'
                                        ? 'bg-blue-500/20'
                                        : 'bg-emerald-500/10'
                                        }`}>
                                        {m.role === 'user'
                                            ? <User size={14} className="text-blue-400" />
                                            : <Bot size={14} className="text-emerald-400" />
                                        }
                                    </div>
                                    <div className={`max-w-[85%] px-4 py-3 rounded-xl text-sm leading-relaxed ${m.role === 'user'
                                        ? 'bg-blue-500/10 border border-blue-500/20 text-zinc-200'
                                        : 'bg-zinc-800/60 border border-zinc-800 text-zinc-300'
                                        }`}>
                                        <div className="markdown-content">
                                            <ReactMarkdown>{m.content}</ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 bg-zinc-950/50 border-t border-zinc-800">
                            <form onSubmit={handleSubmit} className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask anything..."
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 pr-12 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-emerald-500/50 transition-colors min-h-[44px]"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-emerald-500/60 hover:text-emerald-400 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                                >
                                    <Send size={16} />
                                </button>
                            </form>
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
}
