import { WidgetShell } from '../ui/WidgetShell';
import { Package, Truck, Box, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Shipment {
    id: string;
    carrier: string;
    trackingNumber: string;
    status: 'In Transit' | 'Out for Delivery' | 'Delivered' | 'Pending';
    progress: number; // 0-100
}

interface LogisticsTrackerProps {
    shipments?: Shipment[];
    isLoading?: boolean;
}

const CarrierIcon = ({ carrier }: { carrier: string }) => {
    const c = carrier.toLowerCase();
    if (c.includes('dhl')) return <div className="w-6 h-6 bg-yellow-500 rounded flex items-center justify-center font-black text-[8px] text-red-600">DHL</div>;
    if (c.includes('ups')) return <div className="w-6 h-6 bg-amber-900 rounded flex items-center justify-center font-black text-[8px] text-amber-400 border border-amber-800">UPS</div>;
    if (c.includes('fedex')) return <div className="w-6 h-6 bg-purple-700 rounded flex items-center justify-center font-black text-[8px] text-white">FedEx</div>;
    if (c.includes('amazon')) return <div className="w-6 h-6 bg-zinc-900 rounded flex items-center justify-center font-black text-[8px] text-orange-400 border border-zinc-800">AMZN</div>;
    return <Package size={16} className="text-zinc-600" />;
};

export function LogisticsTracker({ shipments = [], isLoading }: LogisticsTrackerProps) {
    return (
        <WidgetShell
            title="Logistics"
            icon={<Package size={14} />}
            isLoading={isLoading}
            className="col-span-1"
        >
            <div className="space-y-4">
                {shipments.length > 0 ? (
                    shipments.map((shipment) => (
                        <div key={shipment.id} className="space-y-2 group">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <CarrierIcon carrier={shipment.carrier} />
                                    <div>
                                        <div className="text-[10px] font-black text-zinc-200 tracking-tight uppercase">
                                            {shipment.carrier} <span className="text-zinc-500 ml-1 font-bold">#{shipment.trackingNumber.slice(-4)}</span>
                                        </div>
                                        <div className={cn(
                                            "text-[8px] font-black uppercase tracking-widest",
                                            shipment.status === 'Out for Delivery' ? 'text-amber-500' :
                                                shipment.status === 'Delivered' ? 'text-emerald-500' : 'text-zinc-500'
                                        )}>
                                            {shipment.status}
                                        </div>
                                    </div>
                                </div>
                                {shipment.status === 'In Transit' && <Truck size={12} className="text-zinc-700 group-hover:text-zinc-400 transition-colors" />}
                                {shipment.status === 'Delivered' && <CheckCircle2 size={12} className="text-emerald-500" />}
                            </div>

                            <div className="relative h-1 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/50">
                                <div
                                    className={cn(
                                        "absolute top-0 left-0 h-full transition-all duration-1000 ease-out rounded-full",
                                        shipment.status === 'Delivered' ? 'bg-emerald-500' :
                                            shipment.status === 'Out for Delivery' ? 'bg-amber-500 animate-pulse' : 'bg-zinc-500'
                                    )}
                                    style={{ width: `${shipment.progress}%` }}
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-10 flex flex-col items-center justify-center opacity-20 space-y-2">
                        <Box size={32} className="text-zinc-600" />
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">No active shipments</p>
                    </div>
                )}
            </div>
        </WidgetShell>
    );
}
