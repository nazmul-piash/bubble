
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingBubble from './components/FloatingBubble';
import Dashboard from './components/Dashboard';
import { AppMode, ClipboardItem, SavedFlow } from './types';
import { INITIAL_CLIPBOARD, INITIAL_FLOWS } from './constants';
import { analyzeIntent } from './services/aiService';
import { Eye, Zap, MousePointer2, Ghost, RefreshCw } from 'lucide-react';

const App: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [mode, setMode] = useState<AppMode>(AppMode.SUGGEST);
  const [clipboardHistory, setClipboardHistory] = useState<ClipboardItem[]>(INITIAL_CLIPBOARD);
  const [savedFlows] = useState<SavedFlow[]>(INITIAL_FLOWS);
  const [isPaused, setIsPaused] = useState(false);
  const [lastNotification, setLastNotification] = useState<string | null>(null);

  const addClipboardItem = useCallback(async (text: string) => {
    if (!text || text.trim() === "") return;
    
    // Check if duplicate of last item to avoid loops
    if (clipboardHistory.length > 0 && clipboardHistory[0].content === text) return;

    const analysis = await analyzeIntent(text) as string;
    
    const newItem: ClipboardItem = {
      id: Math.random().toString(36).substr(2, 9),
      content: text,
      timestamp: Date.now(),
      type: 'text',
      appSource: 'Web Clipboard',
      analysis: analysis
    };

    setClipboardHistory(prev => [newItem, ...prev]);
    setLastNotification('pulse');
    setTimeout(() => setLastNotification(null), 1000);
  }, [clipboardHistory]);

  const syncClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) addClipboardItem(text);
    } catch (err) {
      console.error("Failed to read clipboard:", err);
    }
  };

  // Listen for 'copy' events within the browser tab
  useEffect(() => {
    const handleCopy = () => {
      // Small timeout to let the clipboard update
      setTimeout(syncClipboard, 100);
    };
    window.addEventListener('copy', handleCopy);
    return () => window.removeEventListener('copy', handleCopy);
  }, [addClipboardItem]);

  const handleTogglePause = () => setIsPaused(!isPaused);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-6">
      <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <header className="flex justify-between items-center mb-4 px-4 py-2 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-400/30">
              <Zap className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h1 className="text-sm font-semibold tracking-wide uppercase opacity-80">Bubble Companion</h1>
              <p className="text-[10px] text-blue-400/60 font-medium">Web-Hybrid Cloud Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center bg-black/40 rounded-lg p-1 border border-white/5">
              {(Object.values(AppMode) as AppMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-3 py-1 text-[11px] font-medium transition-all rounded-md ${
                    mode === m ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            
            <button 
              onClick={syncClipboard}
              className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-blue-400"
              title="Sync Browser Clipboard"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button 
              onClick={handleTogglePause}
              className={`p-2 rounded-lg border transition-all ${isPaused ? 'bg-red-500/20 border-red-500/40' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
              title={isPaused ? "Resume Observance" : "Pause Tracking"}
            >
              {isPaused ? <Ghost className="w-4 h-4 text-red-400" /> : <Eye className="w-4 h-4 text-blue-400" />}
            </button>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center relative">
          <div className="text-center opacity-20 max-w-md px-6">
            <MousePointer2 className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-xl font-light mb-2 uppercase tracking-widest">Active Listening Layer</h2>
            <p className="text-xs leading-relaxed">
              Bubble Companion is running in Web Mode. Copy text in this tab or use the sync button to ingest system data.
            </p>
          </div>
        </main>

        <AnimatePresence>
          {isExpanded && (
            <Dashboard 
              onClose={() => setIsExpanded(false)} 
              clipboardHistory={clipboardHistory}
              savedFlows={savedFlows}
              mode={mode}
            />
          )}
        </AnimatePresence>

        <FloatingBubble 
          isExpanded={isExpanded} 
          onExpand={() => setIsExpanded(true)} 
          notification={lastNotification}
          isPaused={isPaused}
        />
      </div>
    </div>
  );
};

export default App;
