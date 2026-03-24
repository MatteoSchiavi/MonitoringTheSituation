import { WidgetShell } from '../ui/WidgetShell';
import { Newspaper, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AINewsBriefProps {
    data?: string;
    isLoading?: boolean;
}

export function AINewsBrief({ data, isLoading }: AINewsBriefProps) {
    return (
        <WidgetShell
            title="AI Daily Brief"
            icon={<Newspaper size={14} />}
            isLoading={isLoading}
            actions={<Sparkles size={12} className="text-purple-400 animate-pulse" />}
        >
            <div className="h-full flex flex-col justify-center">
                {data ? (
                    <div className="prose prose-sm prose-invert max-w-none">
                        <div className="text-[13px] text-zinc-300 leading-relaxed font-medium space-y-2">
                            <ReactMarkdown
                                components={{
                                    ul: ({ node, ...props }) => <ul className="space-y-3 list-none p-0 m-0" {...props} />,
                                    li: ({ node, ...props }) => (
                                        <li className="flex items-start gap-3 group" {...props}>
                                            <div className="mt-1.5 w-1 h-1 rounded-full bg-emerald-500 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.5)] group-hover:scale-150 transition-transform" />
                                            <span className="opacity-90 group-hover:opacity-100 transition-opacity tracking-tight font-sans">
                                                {props.children}
                                            </span>
                                        </li>
                                    ),
                                    p: ({ node, ...props }) => <p className="m-0 p-0" {...props} />
                                }}
                            >
                                {data}
                            </ReactMarkdown>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full opacity-20 py-4">
                        <Sparkles size={32} className="mb-2 text-zinc-500" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Synthesizing Intel...</p>
                    </div>
                )}
            </div>
        </WidgetShell>
    );
}
