import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Key, Layout, Bell, Volume2 } from 'lucide-react';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    const [activeSection, setActiveSection] = useState('api');

    const [haUrl, setHaUrl] = useState(localStorage.getItem('ha_url') || '');
    const [haToken, setHaToken] = useState(localStorage.getItem('ha_token') || '');
    const [audioEnabled, setAudioEnabled] = useState(localStorage.getItem('audio_enabled') !== 'false');
    const [notificationsEnabled, setNotificationsEnabled] = useState(localStorage.getItem('notifications_enabled') === 'true');

    const saveSettings = () => {
        localStorage.setItem('ha_url', haUrl);
        localStorage.setItem('ha_token', haToken);
        localStorage.setItem('audio_enabled', String(audioEnabled));
        localStorage.setItem('notifications_enabled', String(notificationsEnabled));
        onClose();
    };

    const sections = [
        { id: 'api', label: 'API Keys', icon: Key },
        { id: 'layout', label: 'Layout', icon: Layout },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'audio', label: 'Audio', icon: Volume2 },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[600px] sm:max-h-[80vh] bg-zinc-900 border border-zinc-700 rounded-xl z-50 overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
                            <h2 className="text-base font-semibold text-zinc-200">Settings</h2>
                            <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-md transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
                                <X size={18} className="text-zinc-400" />
                            </button>
                        </div>

                        <div className="flex flex-1 overflow-hidden">
                            {/* Sidebar */}
                            <div className="w-40 border-r border-zinc-800 py-2 shrink-0">
                                {sections.map(s => {
                                    const Icon = s.icon;
                                    return (
                                        <button
                                            key={s.id}
                                            onClick={() => setActiveSection(s.id)}
                                            className={`w-full flex items-center gap-2 px-4 py-3 text-xs font-medium transition-colors min-h-[44px] ${activeSection === s.id
                                                    ? 'text-emerald-400 bg-emerald-500/10'
                                                    : 'text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/50'
                                                }`}
                                        >
                                            <Icon size={14} />
                                            {s.label}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Content */}
                            <div className="flex-1 p-5 overflow-y-auto">
                                {activeSection === 'api' && (
                                    <div className="space-y-5">
                                        <div>
                                            <label className="block text-xs font-medium text-zinc-400 mb-2">Home Assistant URL</label>
                                            <input
                                                type="url"
                                                value={haUrl}
                                                onChange={e => setHaUrl(e.target.value)}
                                                placeholder="http://homeassistant.local:8123"
                                                className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-md text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 min-h-[44px]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-zinc-400 mb-2">Home Assistant Token</label>
                                            <input
                                                type="password"
                                                value={haToken}
                                                onChange={e => setHaToken(e.target.value)}
                                                placeholder="Long-Lived Access Token"
                                                className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-md text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 min-h-[44px]"
                                            />
                                        </div>
                                        <p className="text-xs text-zinc-600">
                                            API keys for News, Stocks, and Gemini are configured via server environment variables for security.
                                        </p>
                                    </div>
                                )}

                                {activeSection === 'layout' && (
                                    <div className="space-y-4">
                                        <p className="text-xs text-zinc-400">
                                            Drag and resize widgets on the Overview tab to customize your layout.
                                            Your layout is automatically saved to local storage.
                                        </p>
                                        <button
                                            onClick={() => {
                                                localStorage.removeItem('overview-layout');
                                                window.location.reload();
                                            }}
                                            className="px-4 py-2.5 bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-medium rounded-md hover:bg-zinc-700 transition-colors min-h-[44px]"
                                        >
                                            Reset Layout to Default
                                        </button>
                                    </div>
                                )}

                                {activeSection === 'notifications' && (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-zinc-300">Push Notifications</p>
                                                <p className="text-xs text-zinc-500 mt-1">Critical alerts from Home Assistant and world events</p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    if (!notificationsEnabled) {
                                                        Notification.requestPermission().then(perm => {
                                                            setNotificationsEnabled(perm === 'granted');
                                                        });
                                                    } else {
                                                        setNotificationsEnabled(false);
                                                    }
                                                }}
                                                className={`w-12 h-7 rounded-full transition-colors relative min-h-[44px] flex items-center ${notificationsEnabled ? 'bg-emerald-500' : 'bg-zinc-700'
                                                    }`}
                                            >
                                                <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                                                    }`} />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {activeSection === 'audio' && (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-zinc-300">UI Sound Effects</p>
                                                <p className="text-xs text-zinc-500 mt-1">Subtle chimes for state changes and alerts</p>
                                            </div>
                                            <button
                                                onClick={() => setAudioEnabled(!audioEnabled)}
                                                className={`w-12 h-7 rounded-full transition-colors relative min-h-[44px] flex items-center ${audioEnabled ? 'bg-emerald-500' : 'bg-zinc-700'
                                                    }`}
                                            >
                                                <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${audioEnabled ? 'translate-x-6' : 'translate-x-1'
                                                    }`} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="border-t border-zinc-800 px-5 py-3 flex justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-300 transition-colors min-h-[44px]"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveSettings}
                                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-md transition-colors min-h-[44px]"
                            >
                                Save
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
