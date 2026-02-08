
import React from 'react';
import { motion } from 'framer-motion';
import { X, Search, History, Share2, Terminal, CheckCircle2, Wand2, Layers, BookMarked, Settings } from 'lucide-react';
import { ClipboardItem, SavedFlow, AppMode } from '../types';
import GlassCard from './GlassCard';

interface DashboardProps {
  onClose: () => void;
  clipboardHistory: ClipboardItem[];
  savedFlows: SavedFlow[];
  mode: AppMode;
}

const Dashboard: React.FC<DashboardProps> = ({ onClose, clipboardHistory, savedFlows, mode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
      className="absolute inset-0 z-40 p-4 lg:p-10 flex items-center justify-center bg-black/20 backdrop-blur-xl"
    >
      <div className="w-full h-full max-w-7xl flex flex-col gap-6 relative">
        
        {/* Close & Header */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <motion.h2 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-100 to-blue-400 bg-clip-text text-transparent"
            >
              System Intelligence
            </motion.h2>
            <p className="text-blue-400/60 text-sm font-medium mt-1">Analyzing active context & clipboard streams</p>
          </div>
          <button 
            onClick={onClose}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all group"
          >
            <X className="w-6 h-6 text-white/40 group-hover:text-white group-hover:rotate-90 transition-all" />
          </button>
        </div>

        {/* Main 3-Column Grid */}
        <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
          
          {/* Left: Saved Flows / Templates */}
          <aside className="col-span-3 flex flex-col gap-4 overflow-y-auto pr-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/30 px-2">Knowledge Base</h3>
            {savedFlows.map(flow => (
              <GlassCard key={flow.id} className="group cursor-pointer hover:border-blue-500/40 transition-colors">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-blue-500/20 group-hover:border-blue-500/30 transition-colors">
                    <Layers className="w-5 h-5 text-blue-400/60 group-hover:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white/90 group-hover:text-blue-100 transition-colors">{flow.name}</h4>
                    <p className="text-[11px] text-white/40 leading-relaxed mt-1">{flow.description}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
            <div className="mt-auto pt-6 border-t border-white/5 flex flex-col gap-2">
               <button className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl border border-white/10 text-xs font-semibold hover:bg-white/10 transition-colors">
                 <BookMarked className="w-4 h-4 text-white/40" />
                 Training Documentation
               </button>
               <button className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl border border-white/10 text-xs font-semibold hover:bg-white/10 transition-colors">
                 <Settings className="w-4 h-4 text-white/40" />
                 Global Preferences
               </button>
            </div>
          </aside>

          {/* Center: Timeline */}
          <section className="col-span-6 flex flex-col gap-4 overflow-y-auto px-2">
             <div className="flex justify-between items-center px-2">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/30">System Streams</h3>
                <div className="flex items-center gap-2 bg-black/30 rounded-full px-3 py-1 border border-white/5">
                  <Search className="w-3 h-3 text-white/40" />
                  <input placeholder="Filter history..." className="bg-transparent border-none text-[10px] focus:ring-0 w-24 text-white/60 placeholder-white/20" />
                </div>
             </div>

             <div className="space-y-4">
                {clipboardHistory.map((item, idx) => (
                  <GlassCard key={item.id} className={`relative overflow-hidden ${idx === 0 ? 'border-blue-500/30 bg-blue-500/[0.03]' : ''}`}>
                    {idx === 0 && (
                      <div className="absolute top-0 right-0 px-2 py-0.5 bg-blue-500 text-[9px] font-bold uppercase tracking-tighter rounded-bl-lg">Current Intent</div>
                    )}
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                           {item.type === 'code' ? <Terminal className="w-4 h-4 text-indigo-400" /> : <History className="w-4 h-4 text-blue-400" />}
                           <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{item.appSource || 'Unknown Source'}</span>
                        </div>
                        <span className="text-[10px] text-white/20">{new Date(item.timestamp).toLocaleTimeString()}</span>
                      </div>
                      
                      <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                        <p className="text-sm font-mono text-blue-100/80 line-clamp-3 leading-relaxed">{item.content}</p>
                      </div>

                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                          <Wand2 className="w-3 h-3 text-blue-400" />
                          <span className="text-[10px] font-medium text-blue-300">{item.analysis}</span>
                        </div>
                        <div className="flex gap-2">
                           <button className="p-2 hover:bg-white/10 rounded-lg transition-colors"><Share2 className="w-4 h-4 text-white/30" /></button>
                           <button className="px-4 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 rounded-lg text-xs font-bold text-blue-200 transition-all active:scale-95">Use This</button>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                ))}
             </div>
          </section>

          {/* Right: Actions */}
          <aside className="col-span-3 flex flex-col gap-6">
            <div className="flex flex-col gap-4">
               <h3 className="text-xs font-bold uppercase tracking-widest text-white/30 px-2">Contextual Actions</h3>
               
               <GlassCard className="border-green-500/20 bg-green-500/[0.02]">
                 <div className="flex items-start gap-4 mb-4">
                   <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                     <CheckCircle2 className="w-5 h-5 text-green-400" />
                   </div>
                   <div>
                     <h4 className="text-sm font-bold text-green-100">Ready to Map</h4>
                     <p className="text-[11px] text-green-500/60 font-medium">Form detected in active window</p>
                   </div>
                 </div>
                 <p className="text-[11px] text-white/50 mb-4 leading-relaxed">Active Window: <span className="text-white/80 font-mono">Salesforce_Leads_v2.exe</span></p>
                 <button className="w-full py-3 bg-green-500 hover:bg-green-400 text-black font-bold rounded-xl shadow-lg shadow-green-500/20 transition-all active:scale-95">
                   Apply Intent Mapping
                 </button>
               </GlassCard>

               <div className="grid grid-cols-2 gap-3">
                 <button className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center gap-2 hover:bg-white/10 transition-all">
                    <Share2 className="w-5 h-5 text-blue-400/60" />
                    <span className="text-[10px] font-bold text-white/40">Transmit</span>
                 </button>
                 <button className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center gap-2 hover:bg-white/10 transition-all">
                    <Layers className="w-5 h-5 text-purple-400/60" />
                    <span className="text-[10px] font-bold text-white/40">Augment</span>
                 </button>
               </div>
            </div>

            <div className="mt-auto bg-gradient-to-t from-blue-500/10 to-transparent p-6 rounded-3xl border border-white/10">
               <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">Agent Status</p>
               <div className="flex items-center gap-2 mb-4">
                 <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                 <span className="text-xs text-white/70">Observe & Suggest Mode</span>
               </div>
               <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                 <motion.div 
                   animate={{ width: ['0%', '70%', '40%', '90%'] }} 
                   transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                   className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
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
