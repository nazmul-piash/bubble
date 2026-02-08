
import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`
        bg-white/[0.03] backdrop-blur-md 
        border border-white/10 
        rounded-3xl p-5 
        shadow-xl shadow-black/20
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default GlassCard;
