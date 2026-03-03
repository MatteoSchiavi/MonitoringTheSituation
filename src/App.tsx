import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Navigation';
import { StatusBar } from './components/layout/StatusBar';
import { AISidebar } from './components/layout/AISidebar';
import { Overview } from './components/widgets/Overview';
import { StrategicIntel } from './components/widgets/StrategicIntel';
import { EnvironmentalIntelligence } from './components/widgets/EnvironmentalIntelligence';
import { Markets } from './components/widgets/Markets';
import { F1 } from './components/widgets/F1';
import { Habitat } from './components/widgets/Habitat';
import { ExecutiveSummary } from './components/widgets/ExecutiveSummary';
import { MapTab } from './components/widgets/MapTab';
import { Maintenance } from './components/widgets/Maintenance';
import { GlobalNews } from './components/widgets/GlobalNews';
import { useDashboardData } from './hooks/useDashboard';
import { cn } from './lib/utils';
import { getGeminiResponse } from './lib/gemini';

// API configuration handled in hooks/useDashboard

function App() {
  const [startTime] = useState(Date.now());
  const [activeTab, setActiveTab] = useState('overview');
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isMaintenanceOpen, setIsMaintenanceOpen] = useState(false);
  const [isAlertMode, setIsAlertMode] = useState(false);
  const [followedStocks, setFollowedStocks] = useState(['SPY', 'QQQ', 'BTCUSD', 'TSLA', 'AAPL', 'NVDA', 'FTSE:MIB']);
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState<{ role: string; content: string }[]>([]);

  // Sync theme with alert mode
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isAlertMode ? 'alert' : 'default');

    // Automated Morning Briefing Trigger (08:00)
    const checkTime = () => {
      const now = new Date();
      if (now.getHours() === 8 && now.getMinutes() === 0) {
        setActiveTab('summary');
      }
    };
    const timer = setInterval(checkTime, 60000);
    return () => clearInterval(timer);
  }, [isAlertMode]);

  // Core Data Hook
  const { news, stocks, weather, f1, loading } = useDashboardData(undefined, undefined, followedStocks);

  const handleAiSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    const userMsg = { role: 'user', content: aiInput };
    setAiMessages(prev => [...prev, userMsg]);
    setAiInput('');

    const response = await getGeminiResponse(userMsg.content, aiMessages);
    setAiMessages(prev => [...prev, {
      role: 'assistant',
      content: response
    }]);
  }, [aiInput, aiMessages]);

  const handleAddStock = (symbol: string) => {
    setFollowedStocks(prev => [...prev, symbol]);
  };

  return (
    <div className={cn(
      "h-screen w-screen flex flex-col bg-background text-zinc-300 font-mono overflow-hidden select-none",
      isAlertMode && "alert-mode"
    )}>
      {/* HEADER SECTION */}
      <Header
        onAiToggle={() => setIsAiOpen(true)}
        isAlertMode={isAlertMode}
        onAlertToggle={() => setIsAlertMode(!isAlertMode)}
        onSettingsToggle={() => setIsMaintenanceOpen(!isMaintenanceOpen)}
      />

      {/* STRATEGIC NAVIGATION */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* SYSTEM MAIN GRID */}
      <main className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="h-full"
          >
            {loading && activeTab === 'overview' && (
              <div className="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-primary/20 border-t-primary animate-spin" />
                  <div className="text-[10px] font-black tracking-[0.5em] text-primary uppercase animate-pulse">Syncing Operational Data...</div>
                </div>
              </div>
            )}
            {activeTab === 'overview' && (
              <Overview
                news={news}
                stocks={stocks}
                weather={weather}
                f1={f1}
                aiMessages={aiMessages}
                onAiSubmit={handleAiSubmit}
                aiInput={aiInput}
                setAiInput={setAiInput}
                isAlertMode={isAlertMode}
              />
            )}
            {activeTab === 'intel' && <StrategicIntel news={news} />}
            {activeTab === 'map' && <MapTab isAlertMode={isAlertMode} />}
            {activeTab === 'markets' && (
              <Markets
                stocks={stocks}
                followedStocks={followedStocks}
                onAddStock={handleAddStock}
              />
            )}
            {activeTab === 'f1' && <F1 f1={f1} />}
            {activeTab === 'habitat' && <Habitat />}
            {activeTab === 'environmental' && <EnvironmentalIntelligence />}
            {activeTab === 'news' && <GlobalNews news={news} />}
            {activeTab === 'summary' && <ExecutiveSummary />}
          </motion.div>
        </AnimatePresence>

        {/* Maintenance Overlay (Sneaked at bottom) */}
        <AnimatePresence>
          {isMaintenanceOpen && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed bottom-0 left-0 right-0 h-[60vh] bg-zinc-950 border-t border-primary/40 z-50 overflow-y-auto shadow-[0_-20px_50px_rgba(0,0,0,0.8)] custom-scrollbar"
            >
              <div className="absolute top-2 right-4 flex gap-2">
                <button
                  onClick={() => setIsMaintenanceOpen(false)}
                  className="text-[10px] font-black text-zinc-500 hover:text-primary uppercase py-1 px-2 border border-border bg-zinc-900"
                >
                  Close System Metrics [ESC]
                </button>
              </div>
              <Maintenance
                startTime={startTime}
                followedStocks={followedStocks}
                onAddStock={handleAddStock}
                onRemoveStock={(symbol) => setFollowedStocks(prev => prev.filter(s => s !== symbol))}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER STATUS BAR */}
      <StatusBar />

      {/* AI SIDEBAR */}
      <AISidebar
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        messages={aiMessages}
        onSend={async (content) => {
          const userMsg = { role: 'user', content };
          setAiMessages(prev => [...prev, userMsg]);
          setAiInput('');

          try {
            const response = await getGeminiResponse(content, aiMessages);
            setAiMessages(prev => [...prev, {
              role: 'assistant',
              content: response
            }]);
          } catch (e) {
            setAiMessages(prev => [...prev, {
              role: 'assistant',
              content: 'ERROR: TRANSMISSION FAILED. CHECK CONNECTION.'
            }]);
          }
        }}
        input={aiInput}
        setInput={setAiInput}
      />
    </div>
  );
}

export default App;
