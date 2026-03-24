import { lazy, Suspense, useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import SunCalc from 'suncalc';
import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Navigation';
import { StatusBar } from './components/layout/StatusBar';
import { AISidebar } from './components/layout/AISidebar';
import { SettingsModal } from './components/layout/SettingsModal';
import { callGemini } from './lib/api';

// Lazy-loaded tab components for code-splitting
const OverviewTab = lazy(() => import('./components/tabs/OverviewTab'));
const NewsTab = lazy(() => import('./components/tabs/NewsTab'));
const StocksTab = lazy(() => import('./components/tabs/StocksTab'));
const IntelTab = lazy(() => import('./components/tabs/IntelTab'));
const SportsF1Tab = lazy(() => import('./components/tabs/SportsF1Tab'));
const HomeTab = lazy(() => import('./components/tabs/HomeTab'));

const TAB_ROUTES = ['/overview', '/news', '/stocks', '/intel', '/sports', '/home'];

const LAT = parseFloat(import.meta.env.VITE_LAT || '45.0526');
const LON = parseFloat(import.meta.env.VITE_LON || '9.693');

function TabLoader() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-3 border-zinc-700 border-t-emerald-500 rounded-full animate-spin" />
        <p className="text-xs text-zinc-500 font-medium">Loading...</p>
      </div>
    </div>
  );
}

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState<{ role: string; content: string }[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Auto day/night theme based on sun position
  useEffect(() => {
    function updateTheme() {
      const now = new Date();
      const times = SunCalc.getTimes(now, LAT, LON);
      const isNight = now < times.sunrise || now > times.sunset;
      const newTheme = isNight ? 'dark' : 'light';
      setTheme(newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
    }
    updateTheme();
    const interval = setInterval(updateTheme, 60000);
    return () => clearInterval(interval);
  }, []);

  // Swipe to navigate tabs
  const currentTabIndex = TAB_ROUTES.indexOf(location.pathname);
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      const next = Math.min(currentTabIndex + 1, TAB_ROUTES.length - 1);
      navigate(TAB_ROUTES[next]);
    },
    onSwipedRight: () => {
      const prev = Math.max(currentTabIndex - 1, 0);
      navigate(TAB_ROUTES[prev]);
    },
    trackMouse: false,
    delta: 50,
  });

  const handleAiSend = async (content: string) => {
    const userMsg = { role: 'user', content };
    setAiMessages(prev => [...prev, userMsg]);
    setAiInput('');
    try {
      const response = await callGemini(content, aiMessages);
      setAiMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch {
      setAiMessages(prev => [...prev, { role: 'assistant', content: 'Unable to connect to AI. Please try again.' }]);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[var(--color-background)] text-zinc-300 overflow-hidden">
      <Header
        onAiToggle={() => setIsAiOpen(true)}
        onSettingsToggle={() => setIsSettingsOpen(!isSettingsOpen)}
        theme={theme}
      />

      <Navigation />

      <main className="flex-1 overflow-hidden relative" {...swipeHandlers}>
        <div className="h-full overflow-y-auto">
          <Suspense fallback={<TabLoader />}>
            <Routes>
              <Route path="/overview" element={<OverviewTab />} />
              <Route path="/news" element={<NewsTab />} />
              <Route path="/stocks" element={<StocksTab />} />
              <Route path="/intel" element={<IntelTab />} />
              <Route path="/sports" element={<SportsF1Tab />} />
              <Route path="/home" element={<HomeTab />} />
              <Route path="*" element={<Navigate to="/overview" replace />} />
            </Routes>
          </Suspense>
        </div>
      </main>

      <StatusBar />

      <AISidebar
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        messages={aiMessages}
        onSend={handleAiSend}
        input={aiInput}
        setInput={setAiInput}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}

export default App;
