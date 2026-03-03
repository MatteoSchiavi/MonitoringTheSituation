import { FileText, Zap, Target, TrendingUp, AlertTriangle, ChevronRight } from 'lucide-react';
import { Widget } from '../ui/Widget';
import { cn } from '../../lib/utils';

export function ExecutiveSummary() {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="h-full p-6 flex flex-col gap-6 bg-zinc-950/20 overflow-hidden relative">
            <header className="flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-500/10 border border-amber-500/20">
                        <FileText size={24} className="text-amber-500" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-zinc-100 uppercase tracking-widest">Executive Briefing // 08:00</h2>
                        <div className="text-[10px] text-zinc-500 font-black tracking-widest uppercase mt-1">
                            {today} // Strategic Intelligence Summary
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-12 gap-6 flex-1 overflow-hidden">
                {/* Main Briefing Text */}
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
                    <div className="space-y-6 text-zinc-300 font-bold uppercase text-[12px] leading-relaxed tracking-wide">
                        <section className="p-6 bg-zinc-900/30 border-l-2 border-amber-500 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <Zap size={80} />
                            </div>
                            <h3 className="text-amber-500 font-black mb-4 flex items-center gap-2 tracking-[0.2em]">
                                <Zap size={14} /> Situation Overview
                            </h3>
                            <p>
                                Global instability index remains elevated at 64/100. Market volatility in the tech sector is driving increased signal velocity.
                                Regional focus on Piacenza confirms all parameters stable. Infrastructure monitor indicates a minor bottleneck in the Panama Canal following a logistics anomaly.
                            </p>
                        </section>

                        <section className="p-6 bg-zinc-900/30 border-l-2 border-primary">
                            <h3 className="text-primary font-black mb-4 flex items-center gap-2 tracking-[0.2em]">
                                <Target size={14} /> Strategic Objectives
                            </h3>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-4">
                                    <ChevronRight size={14} className="text-primary mt-0.5" />
                                    <span>Monitor SQUAWK 7700 alerts in the Northern Italian region.</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <ChevronRight size={14} className="text-primary mt-0.5" />
                                    <span>Review FTSE MIB opening parity; adjust portfolio hedges accordingly.</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <ChevronRight size={14} className="text-primary mt-0.5" />
                                    <span>Analyze marine weather for Caprera; window for sailing opens at 14:00.</span>
                                </li>
                            </ul>
                        </section>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="p-4 bg-zinc-900/50 border border-border">
                                <div className="text-[10px] text-zinc-500 font-black mb-2 uppercase italic opacity-50">SENTIMENT ANALYSIS</div>
                                <div className="text-xl font-black text-red-500 uppercase tracking-tighter">BEARISH_TENSION</div>
                            </div>
                            <div className="p-4 bg-zinc-900/50 border border-border">
                                <div className="text-[10px] text-zinc-500 font-black mb-2 uppercase italic opacity-50">THREAT LEVEL</div>
                                <div className="text-xl font-black text-amber-500 uppercase tracking-tighter">ELEVATED_OSINT</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                    <Widget title="Directives" icon={<TrendingUp size={14} />}>
                        <div className="flex flex-col gap-4 py-4">
                            {[
                                { label: 'PRIORITY_ALPHA', msg: 'Secure Home Assistant uplink node.', color: 'text-primary' },
                                { label: 'PRIORITY_BETA', msg: 'Verify NASA FIRMS thermal hotspots.', color: 'text-amber-500' },
                                { label: 'PRIORITY_GAMMA', msg: 'Update "Condition Red" filter lists.', color: 'text-zinc-500' }
                            ].map((d, i) => (
                                <div key={i} className="flex flex-col gap-1 p-3 bg-zinc-900/50 border border-border group hover:border-primary transition-all">
                                    <span className={cn("text-[9px] font-black uppercase tracking-widest", d.color)}>{d.label}</span>
                                    <p className="text-[10px] font-bold text-zinc-300 uppercase mt-1">{d.msg}</p>
                                </div>
                            ))}
                        </div>
                    </Widget>

                    <div className="mt-auto p-4 bg-amber-500/5 border border-amber-500/20 text-center">
                        <AlertTriangle size={24} className="mx-auto text-amber-500 mb-2" />
                        <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Authentication Required</span>
                        <p className="text-[8px] text-zinc-600 font-bold uppercase mt-1 leading-relaxed">
                            Full analytical override requires System Administrator status.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
