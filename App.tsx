
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingBubble from './components/FloatingBubble';
import Dashboard from './components/Dashboard';
import { AppMode, ClipboardItem, SavedFlow } from './types';
import { INITIAL_CLIPBOARD, INITIAL_FLOWS } from './constants';
import { Eye, Zap, MousePointer2, Ghost } from 'lucide-react';

const App: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [mode, setMode] = useState<AppMode>(AppMode.SUGGEST);
  const [clipboardHistory, setClipboardHistory] = useState<ClipboardItem[]>(INITIAL_CLIPBOARD);
  const [savedFlows] = useState<SavedFlow[]>(INITIAL_FLOWS);
  const [isPaused, setIsPaused] = useState(false);
  const [lastNotification, setLastNotification] = useState<string | null>(null);

  // Mock "Clipboard Listener" logic
  const addClipboardItem = (text: string) => {
    const newItem: ClipboardItem = {
      id: Math.random().toString(36).substr(2, 9),
      content: text,
      timestamp: Date.now(),
      type: 'text',
      appSource: 'Browser Context',
      analysis: 'Analyzing content...'
    };
    setClipboardHistory(prev => [newItem, ...prev]);
    setLastNotification('pulse');
    setTimeout(() => setLastNotification(null), 1000);
  };

  const handleTogglePause = () => setIsPaused(!isPaused);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-6">
      {/* Desktop Background Mock */}
      <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500 rounded-full blur-[120px]" />
      </div>

      {/* Main UI Overlay */}
      <div className="relative z-10 flex flex-col h-full">
        {/* App Bar / Controls */}
        <header className="flex justify-between items-center mb-4 px-4 py-2 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-400/30">
              <Zap className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h1 className="text-sm font-semibold tracking-wide uppercase opacity-80">Bubble Companion</h1>
              <p className="text-[10px] text-blue-400/60 font-medium">Windows Engine v1.0.4-beta</p>
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
              onClick={handleTogglePause}
              className={`p-2 rounded-lg border transition-all ${isPaused ? 'bg-red-500/20 border-red-500/40' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
              title={isPaused ? "Resume Observance" : "Pause Tracking"}
            >
              {isPaused ? <Ghost className="w-4 h-4 text-red-400" /> : <Eye className="w-4 h-4 text-blue-400" />}
            </button>
          </div>
        </header>

        {/* Content Area (Usually just the desktop) */}
        <main className="flex-1 flex items-center justify-center relative">
          <div className="text-center opacity-20 max-w-md">
            <MousePointer2 className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-xl font-light mb-2">Simulated Desktop Environment</h2>
            <p className="text-sm">Bubble is currently tracking system intent. Select text or click the bubble to expand the interface.</p>
            <button 
              onClick={() => addClipboardItem("Simulated New Lead: Sarah Connor, Skynet Systems.")}
              className="mt-6 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-xs font-medium border border-white/20 transition-all active:scale-95"
            >
              Simulate Ctrl + C
            </button>
          </div>
        </main>

        {/* The World Inside the Bubble (Expanded View) */}
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

        {/* The Floating Bubble itself */}
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
