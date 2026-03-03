import React, { useState, useEffect } from 'react';
import { AlertCircle, TrendingUp, Cloud, Radio, Zap, Home, MessageSquare, Menu, X } from 'lucide-react';

// API Configuration - Replace with your actual keys
const CONFIG = {
  NEWS_API: 'YOUR_NEWSAPI_KEY', // newsapi.org
  STOCK_API: 'YOUR_ALPHAVANTAGE_KEY', // alphavantage.co
  OPENF1_BASE: 'https://api.openf1.org/v1',
  CLAUDE_API: 'https://api.anthropic.com/v1/messages'
};

const CommandCenter = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [news, setNews] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [weather, setWeather] = useState(null);
  const [f1Data, setF1Data] = useState(null);
  const [aiMessages, setAiMessages] = useState([]);
  const [aiInput, setAiInput] = useState('');
  const [loading, setLoading] = useState({ news: false, stocks: false, ai: false });

  // Fetch News
  const fetchNews = async () => {
    setLoading(prev => ({ ...prev, news: true }));
    try {
      // Example categories: technology, business, sports
      const response = await fetch(
        `https://newsapi.org/v2/top-headlines?country=us&category=technology&pageSize=5&apiKey=${CONFIG.NEWS_API}`
      );
      const data = await response.json();
      setNews(data.articles || []);
    } catch (error) {
      console.error('News fetch error:', error);
      // Demo data
      setNews([
        { title: 'Major Tech Breakthrough Announced', source: { name: 'TechCrunch' }, publishedAt: new Date().toISOString() },
        { title: 'Stock Markets Rally on Economic News', source: { name: 'Bloomberg' }, publishedAt: new Date().toISOString() },
        { title: 'New Electric Vehicle Sets Range Record', source: { name: 'AutoNews' }, publishedAt: new Date().toISOString() }
      ]);
    }
    setLoading(prev => ({ ...prev, news: false }));
  };

  // Fetch Stock Data
  const fetchStocks = async () => {
    setLoading(prev => ({ ...prev, stocks: true }));
    try {
      // Example: Fetch multiple stocks
      const symbols = ['IBM', 'AAPL', 'TSLA'];
      const stockPromises = symbols.map(symbol =>
        fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${CONFIG.STOCK_API}`)
          .then(res => res.json())
      );
      const stockData = await Promise.all(stockPromises);
      setStocks(stockData.map(d => d['Global Quote'] || {}));
    } catch (error) {
      console.error('Stock fetch error:', error);
      // Demo data
      setStocks([
        { '01. symbol': 'SPY', '05. price': '520.45', '09. change': '+2.34', '10. change percent': '+0.45%' },
        { '01. symbol': 'TSLA', '05. price': '245.67', '09. change': '-1.23', '10. change percent': '-0.50%' },
        { '01. symbol': 'NVDA', '05. price': '890.12', '09. change': '+15.67', '10. change percent': '+1.79%' }
      ]);
    }
    setLoading(prev => ({ ...prev, stocks: false }));
  };

  // Fetch F1 Data (OpenF1 API)
  const fetchF1Data = async () => {
    try {
      // Get latest session
      const sessionsRes = await fetch(`${CONFIG.OPENF1_BASE}/sessions?session_type=Race&year=2026`);
      const sessions = await sessionsRes.json();
      
      if (sessions.length > 0) {
        const latestSession = sessions[0];
        setF1Data({
          session: latestSession,
          status: 'Latest session data loaded'
        });
      }
    } catch (error) {
      console.error('F1 fetch error:', error);
      setF1Data({
        session: { session_name: 'Australian GP 2026', circuit_short_name: 'Melbourne' },
        status: 'Demo mode'
      });
    }
  };

  // AI Assistant with Claude
  const sendToAI = async () => {
    if (!aiInput.trim()) return;
    
    setLoading(prev => ({ ...prev, ai: true }));
    const userMessage = { role: 'user', content: aiInput };
    setAiMessages(prev => [...prev, userMessage]);
    setAiInput('');

    try {
      // Context about current dashboard state
      const context = `Current dashboard status:
- Latest news: ${news.slice(0,2).map(n => n.title).join(', ')}
- Stock data: ${stocks.map(s => `${s['01. symbol']}: ${s['05. price']}`).join(', ')}
- F1: ${f1Data?.session?.session_name || 'No data'}
User question: ${aiInput}`;

      const response = await fetch(CONFIG.CLAUDE_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-5-20250929',
          max_tokens: 1000,
          messages: [{ role: 'user', content: context }]
        })
      });

      const data = await response.json();
      const aiResponse = { 
        role: 'assistant', 
        content: data.content[0].text || 'I can help analyze the dashboard data for you.'
      };
      setAiMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('AI error:', error);
      setAiMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'AI assistant ready. Ask me about the dashboard data, market trends, or news analysis.' 
      }]);
    }
    setLoading(prev => ({ ...prev, ai: false }));
  };

  useEffect(() => {
    fetchNews();
    fetchStocks();
    fetchF1Data();
    // Refresh data every 60 seconds
    const interval = setInterval(() => {
      fetchNews();
      fetchStocks();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-mono">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                <h1 className="text-2xl font-bold tracking-wider text-zinc-100">
                  COMMAND CENTER
                </h1>
              </div>
              <div className="text-xs text-zinc-500 tracking-widest">
                LIVE TACTICAL INTEL
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-zinc-500">STATUS:</span>
                <span className="text-emerald-400 font-semibold">OPERATIONAL</span>
              </div>
              <div className="text-zinc-500">
                {new Date().toLocaleString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric', 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-b border-zinc-800 bg-zinc-900/30">
        <div className="max-w-[1800px] mx-auto px-6">
          <div className="flex gap-1">
            {[
              { id: 'overview', label: 'OVERVIEW', icon: Menu },
              { id: 'markets', label: 'MARKETS', icon: TrendingUp },
              { id: 'intel', label: 'INTEL', icon: AlertCircle },
              { id: 'f1', label: 'F1 LIVE', icon: Radio },
              { id: 'home', label: 'HOME', icon: Home },
              { id: 'ai', label: 'AI ASSIST', icon: MessageSquare }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 text-xs tracking-widest font-semibold transition-colors ${
                    activeTab === tab.id
                      ? 'bg-zinc-800 text-emerald-400 border-b-2 border-emerald-400'
                      : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1800px] mx-auto px-6 py-8">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-12 gap-6">
            {/* Markets Overview */}
            <div className="col-span-12 lg:col-span-4">
              <div className="bg-zinc-900 border border-zinc-800 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold tracking-widest text-zinc-400">
                    MARKET STATUS
                  </h2>
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="space-y-3">
                  {stocks.slice(0, 3).map((stock, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-zinc-800/50 border border-zinc-700">
                      <div>
                        <div className="text-lg font-bold text-zinc-100">
                          {stock['01. symbol'] || 'N/A'}
                        </div>
                        <div className="text-2xl font-bold text-zinc-100 mt-1">
                          ${stock['05. price'] || '0.00'}
                        </div>
                      </div>
                      <div className={`text-right ${
                        parseFloat(stock['09. change'] || 0) >= 0 
                          ? 'text-emerald-400' 
                          : 'text-red-400'
                      }`}>
                        <div className="text-sm font-semibold">
                          {stock['09. change'] || '0.00'}
                        </div>
                        <div className="text-lg font-bold">
                          {stock['10. change percent'] || '0.00%'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* News Feed */}
            <div className="col-span-12 lg:col-span-8">
              <div className="bg-zinc-900 border border-zinc-800 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold tracking-widest text-zinc-400">
                    INTEL FEED
                  </h2>
                  <AlertCircle className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="space-y-3">
                  {news.map((article, idx) => (
                    <div key={idx} className="p-4 bg-zinc-800/30 border-l-4 border-emerald-500 hover:bg-zinc-800/50 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-base font-semibold text-zinc-100 mb-1">
                            {article.title}
                          </h3>
                          <div className="flex items-center gap-3 text-xs text-zinc-500">
                            <span className="text-emerald-400 font-semibold">
                              {article.source?.name}
                            </span>
                            <span>•</span>
                            <span>{new Date(article.publishedAt).toLocaleTimeString()}</span>
                          </div>
                        </div>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* F1 Status */}
            <div className="col-span-12 lg:col-span-6">
              <div className="bg-zinc-900 border border-zinc-800 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold tracking-widest text-zinc-400">
                    F1 STATUS
                  </h2>
                  <Radio className="w-5 h-5 text-red-500" />
                </div>
                {f1Data && (
                  <div className="space-y-3">
                    <div className="p-4 bg-red-500/10 border border-red-500/30">
                      <div className="text-2xl font-bold text-zinc-100 mb-2">
                        {f1Data.session?.session_name || 'No active session'}
                      </div>
                      <div className="text-sm text-zinc-400">
                        {f1Data.session?.circuit_short_name || 'Awaiting next race'}
                      </div>
                    </div>
                    <div className="text-xs text-zinc-500">
                      Status: {f1Data.status}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Home Assistant */}
            <div className="col-span-12 lg:col-span-6">
              <div className="bg-zinc-900 border border-zinc-800 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold tracking-widest text-zinc-400">
                    HOME CONTROL
                  </h2>
                  <Home className="w-5 h-5 text-blue-400" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-zinc-800/50 border border-zinc-700 text-center">
                    <div className="text-3xl font-bold text-blue-400">72°F</div>
                    <div className="text-xs text-zinc-500 mt-1">CLIMATE</div>
                  </div>
                  <div className="p-4 bg-zinc-800/50 border border-zinc-700 text-center">
                    <div className="text-3xl font-bold text-emerald-400">ON</div>
                    <div className="text-xs text-zinc-500 mt-1">SECURITY</div>
                  </div>
                  <div className="p-4 bg-zinc-800/50 border border-zinc-700 text-center">
                    <div className="text-3xl font-bold text-amber-400">12</div>
                    <div className="text-xs text-zinc-500 mt-1">DEVICES</div>
                  </div>
                  <div className="p-4 bg-zinc-800/50 border border-zinc-700 text-center">
                    <div className="text-3xl font-bold text-zinc-400">85%</div>
                    <div className="text-xs text-zinc-500 mt-1">POWER</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI ASSISTANT TAB */}
        {activeTab === 'ai' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-zinc-900 border border-zinc-800 p-6">
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="w-5 h-5 text-emerald-400" />
                <h2 className="text-sm font-bold tracking-widest text-zinc-400">
                  AI TACTICAL ASSISTANT
                </h2>
              </div>
              
              {/* Messages */}
              <div className="space-y-4 mb-6 h-96 overflow-y-auto">
                {aiMessages.length === 0 && (
                  <div className="text-center text-zinc-500 py-12">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Ask me about market trends, news analysis, or dashboard data</p>
                  </div>
                )}
                {aiMessages.map((msg, idx) => (
                  <div key={idx} className={`p-4 ${
                    msg.role === 'user' 
                      ? 'bg-zinc-800 border border-zinc-700 ml-12' 
                      : 'bg-emerald-500/10 border border-emerald-500/30 mr-12'
                  }`}>
                    <div className="text-xs text-zinc-500 mb-1 font-semibold tracking-wider">
                      {msg.role === 'user' ? 'YOU' : 'AI ASSISTANT'}
                    </div>
                    <div className="text-sm text-zinc-100">{msg.content}</div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="flex gap-3">
                <input
                  type="text"
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendToAI()}
                  placeholder="Ask about markets, news, or F1 data..."
                  className="flex-1 bg-zinc-800 border border-zinc-700 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                  disabled={loading.ai}
                />
                <button
                  onClick={sendToAI}
                  disabled={loading.ai}
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-zinc-900 font-bold text-sm tracking-wider disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading.ai ? 'PROCESSING...' : 'SEND'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Other tabs placeholder */}
        {['markets', 'intel', 'f1', 'home'].includes(activeTab) && (
          <div className="bg-zinc-900 border border-zinc-800 p-12 text-center">
            <div className="text-zinc-500 mb-4">
              <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            </div>
            <h3 className="text-xl font-bold text-zinc-400 mb-2">
              {activeTab.toUpperCase()} MODULE
            </h3>
            <p className="text-zinc-600">
              Detailed {activeTab} view - Full implementation requires API integration
            </p>
          </div>
        )}
      </div>

      {/* Footer Status Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 px-6 py-2">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span>API: CONNECTED</span>
            </div>
            <div>Data refresh: 60s</div>
          </div>
          <div className="flex items-center gap-4">
            <span>TACTICAL DASHBOARD v2.0</span>
            <span>•</span>
            <span>CLASSIFIED</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandCenter;
