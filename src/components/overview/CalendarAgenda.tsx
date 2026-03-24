import { WidgetShell } from '../ui/WidgetShell';
import { Calendar, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

interface CalendarEvent {
    id: string;
    title: string;
    start: string; // ISO string
    end: string;
    location?: string;
}

interface CalendarAgendaProps {
    events?: CalendarEvent[];
    isLoading?: boolean;
}

export function CalendarAgenda({ events = [], isLoading }: CalendarAgendaProps) {
    const now = new Date();

    // Find the current or next upcoming event
    const sortedEvents = [...events].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    const nextEventIndex = sortedEvents.findIndex(e => new Date(e.start) > now);
    const currentEventIndex = sortedEvents.findIndex(e => new Date(e.start) <= now && new Date(e.end) >= now);

    const activeIdx = currentEventIndex !== -1 ? currentEventIndex : nextEventIndex;

    return (
        <WidgetShell
            title="Agenda"
            icon={<Calendar size={14} />}
            isLoading={isLoading}
            className="col-span-1"
        >
            <div className="space-y-3">
                {sortedEvents.length > 0 ? (
                    sortedEvents.slice(0, 5).map((event, idx) => {
                        const startDate = new Date(event.start);
                        const isToday = startDate.toDateString() === now.toDateString();
                        const timeStr = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                        const isActive = idx === activeIdx;

                        return (
                            <div
                                key={event.id}
                                className={cn(
                                    "flex items-start gap-3 p-2 rounded-lg border transition-all",
                                    isActive
                                        ? "bg-emerald-500/5 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]"
                                        : "bg-zinc-900/30 border-transparent hover:border-zinc-800"
                                )}
                            >
                                <div className="flex flex-col items-center shrink-0 w-10">
                                    <span className={cn(
                                        "text-xs font-black italic tracking-tighter leading-none",
                                        isActive ? "text-emerald-400" : "text-zinc-200"
                                    )}>
                                        {timeStr}
                                    </span>
                                    <span className="text-[8px] text-zinc-500 font-bold uppercase mt-0.5">
                                        {isToday ? 'Today' : 'TMWR'}
                                    </span>
                                </div>

                                <div className="flex-1 space-y-0.5 min-w-0">
                                    <h4 className={cn(
                                        "text-[11px] font-bold uppercase tracking-tight truncate",
                                        isActive ? "text-zinc-100" : "text-zinc-400"
                                    )}>
                                        {event.title}
                                    </h4>
                                    {event.location && (
                                        <p className="text-[9px] text-zinc-600 truncate flex items-center gap-1">
                                            <span className="w-1 h-1 rounded-full bg-zinc-700" /> {event.location}
                                        </p>
                                    )}
                                </div>

                                {isActive && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className="py-10 flex flex-col items-center justify-center opacity-20 space-y-2">
                        <Clock size={32} className="text-zinc-600" />
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">No upcoming events</p>
                    </div>
                )}
            </div>
        </WidgetShell>
    );
}
