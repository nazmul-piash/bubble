
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Search, History, Share2, Terminal, CheckCircle2, Wand2, Layers, BookMarked, Settings, Sparkles } from 'lucide-react';
import { ClipboardItem, SavedFlow, AppMode } from '../types';
import GlassCard from './GlassCard';
import { getGeminiSuggestion } from '../services/aiService';

interface DashboardProps {
  onClose: () => void;
  clipboardHistory: ClipboardItem[];
  savedFlows: SavedFlow[];
  mode: AppMode;
}

const Dashboard: React.FC<DashboardProps> = ({ onClose, clipboardHistory, savedFlows, mode }) => {
  const [aiSuggestions, setAiSuggestions] = useState<{action: string, description: string}[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleDeepAnalysis = async () => {
    if (clipboardHistory.length === 0) return;
    setIsAnalyzing(true);
    const suggestions = await getGeminiSuggestion(clipboardHistory[0].content);
    setAiSuggestions(suggestions);
    setIsAnalyzing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
      className="absolute inset-0 z-40 p-4 lg:p-10 flex items-center justify-center bg-black/40 backdrop-blur-2xl"
    >
      <div className="w-full h-full max-w-7xl flex flex-col gap-6 relative">
        
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <motion.h2 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-100 to-blue-400 bg-clip-text text-transparent"
            >
              System Intelligence
            </motion.h2>
            <p className="text-blue-400/60 text-sm font-medium mt-1">Unified Clipboard & Intent Engine</p>
          </div>
          <button 
            onClick={onClose}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all group"
          >
            <X className="w-6 h-6 text-white/40 group-hover:text-white group-hover:rotate-90 transition-all" />
          </button>
        </div>

        <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
          <aside className="col-span-12 lg:col-span-3 flex flex-col gap-4 overflow-y-auto pr-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/30 px-2">Flow Templates</h3>
            {savedFlows.map(flow => (
              <GlassCard key={flow.id} className="group cursor-pointer hover:border-blue-500/40 transition-colors py-3">
                <div className="flex gap-3 items-center">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                    <Layers className="w-4 h-4 text-blue-400/60" />
                  </div>
                  <div>
                    <h4 className="text-[13px] font-semibold text-white/90">{flow.name}</h4>
                    <p className="text-[10px] text-white/30 truncate w-32">{flow.description}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
            <div className="mt-auto pt-6 border-t border-white/5 flex flex-col gap-2">
               <button className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl border border-white/10 text-xs font-semibold hover:bg-white/10 transition-colors">
                 <BookMarked className="w-4 h-4 text-white/40" />
                 Docs
               </button>
            </div>
          </aside>

          <section className="col-span-12 lg:col-span-6 flex flex-col gap-4 overflow-y-auto px-2">
             <div className="flex justify-between items-center px-2">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/30">History</h3>
             </div>

             <div className="space-y-4 pb-10">
                {clipboardHistory.map((item, idx) => (
                  <GlassCard key={item.id} className={`relative overflow-hidden ${idx === 0 ? 'border-blue-500/30 bg-blue-500/[0.03]' : ''}`}>
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                           <History className="w-4 h-4 text-blue-400" />
                           <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{item.appSource}</span>
                        </div>
                        <span className="text-[10px] text-white/20">{new Date(item.timestamp).toLocaleTimeString()}</span>
                      </div>
                      
                      <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                        <p className="text-sm font-mono text-blue-100/80 line-clamp-3 leading-relaxed">{item.content}</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                          <Wand2 className="w-3 h-3 text-blue-400" />
                          <span className="text-[10px] font-medium text-blue-300">{item.analysis}</span>
                        </div>
                        <button 
                          onClick={handleDeepAnalysis}
                          className="px-4 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 rounded-lg text-xs font-bold text-blue-200 transition-all active:scale-95 flex items-center gap-2"
                        >
                          {isAnalyzing && idx === 0 ? 'Analyzing...' : 'Deep Analysis'}
                          {idx === 0 && <Sparkles className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                ))}
             </div>
          </section>

          <aside className="col-span-12 lg:col-span-3 flex flex-col gap-6">
            <div className="flex flex-col gap-4">
               <h3 className="text-xs font-bold uppercase tracking-widest text-white/30 px-2">AI Suggestions</h3>
               
               {aiSuggestions.length > 0 ? (
                 <div className="space-y-3">
                   {aiSuggestions.map((s, i) => (
                     <GlassCard key={i} className="py-3 border-blue-500/20 hover:bg-blue-500/10 transition-colors cursor-pointer">
                        <h4 className="text-xs font-bold text-blue-100">{s.action}</h4>
                        <p className="text-[10px] text-white/40 mt-1">{s.description}</p>
                     </GlassCard>
                   ))}
                 </div>
               ) : (
                 <GlassCard className="border-dashed border-white/10 opacity-50 flex flex-col items-center justify-center py-10">
                   <Sparkles className="w-6 h-6 text-white/20 mb-2" />
                   <p className="text-[10px] font-medium text-white/30 text-center">Run Deep Analysis to see intelligent actions</p>
                 </GlassCard>
               )}

               <GlassCard className="border-green-500/20 bg-green-500/[0.02]">
                 <div className="flex items-start gap-4 mb-4">
                   <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                     <CheckCircle2 className="w-5 h-5 text-green-400" />
                   </div>
                   <div>
                     <h4 className="text-sm font-bold text-green-100">Ready to Map</h4>
                     <p className="text-[11px] text-green-500/60 font-medium">Auto-mapping enabled</p>
                   </div>
                 </div>
                 <button className="w-full py-3 bg-green-500 hover:bg-green-400 text-black font-bold rounded-xl transition-all">
                   Process Current Intent
                 </button>
               </GlassCard>
            </div>

            <div className="mt-auto bg-gradient-to-t from-blue-500/10 to-transparent p-6 rounded-3xl border border-white/10">
               <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">Agent Active</p>
               <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                 <motion.div 
                   animate={{ width: ['20%', '90%', '40%', '80%'] }} 
                   transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                   className="h-full bg-blue-500" 
                 />
               </div>
            </div>
          </aside>

        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
