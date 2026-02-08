
import React from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Sparkles, Loader2 } from 'lucide-react';

interface FloatingBubbleProps {
  isExpanded: boolean;
  onExpand: () => void;
  notification: string | null;
  isPaused: boolean;
}

const FloatingBubble: React.FC<FloatingBubbleProps> = ({ isExpanded, onExpand, notification, isPaused }) => {
  const controls = useAnimation();

  // Floating behavior
  const floatingAnimation = {
    y: [0, -15, 0],
    x: [0, 5, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  // Pulse on new notification
  React.useEffect(() => {
    if (notification === 'pulse') {
      controls.start({
        scale: [1, 1.3, 1],
        boxShadow: ["0 0 0px rgba(59, 130, 246, 0)", "0 0 40px rgba(59, 130, 246, 0.8)", "0 0 0px rgba(59, 130, 246, 0)"],
        transition: { duration: 0.6 }
      });
    }
  }, [notification, controls]);

  if (isExpanded) return null;

  return (
    <motion.div
      className="fixed bottom-12 right-12 z-50"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
    >
      <motion.div
        animate={floatingAnimation}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9, borderRadius: "20%" }}
        onClick={onExpand}
        className={`relative cursor-pointer group w-20 h-20 rounded-full backdrop-blur-2xl border-2 flex items-center justify-center overflow-hidden
          ${isPaused ? 'bg-slate-800/40 border-slate-700/50' : 'bg-blue-500/20 border-blue-400/40 shadow-[0_0_30px_rgba(59,130,246,0.2)]'}
        `}
      >
        {/* Liquid/Surface Tension Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
        
        {/* Animated Inner Core */}
        <motion.div 
          animate={controls}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors
            ${isPaused ? 'bg-slate-700/50' : 'bg-blue-400/30'}
          `}
        >
          {isPaused ? (
            <div className="w-1.5 h-1.5 bg-slate-500 rounded-full" />
          ) : (
            <Sparkles className="w-6 h-6 text-blue-200 group-hover:rotate-12 transition-transform" />
          )}
        </motion.div>

        {/* Glow Ripple on Hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-radial-gradient from-blue-400/20 to-transparent" />
        
        {/* Status Indicator */}
        {!isPaused && (
           <div className="absolute top-2 right-2 flex gap-1">
             <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
           </div>
        )}
      </motion.div>

      {/* Label on Hover */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        whileHover={{ opacity: 1, y: 0 }}
        className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase text-blue-300 border border-blue-500/30 pointer-events-none"
      >
        Expand Interface
      </motion.div>
    </motion.div>
  );
};

export default FloatingBubble;
