import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onDragEnter' | 'onDragExit' | 'onDragLeave' | 'onDragOver' | 'onDrop' | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'> {
  children: React.ReactNode;
  hover?: boolean;
  glow?: boolean;
  className?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  hover = true,
  glow = false,
  className = '',
  ...props
}) => {
  const baseStyles = `
    relative overflow-hidden rounded-2xl
    bg-white/5 backdrop-blur-xl
    border border-white/10
    shadow-2xl
    transition-all duration-500 ease-out
  `;

  const hoverStyles = hover ? `
    hover:bg-white/8
    hover:border-white/20
    hover:shadow-3xl
    hover:-translate-y-2
    hover:scale-[1.02]
  ` : '';

  const glowStyles = glow ? `
    hover:shadow-brand/30
    hover:border-brand/30
  ` : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { 
        y: -8, 
        scale: 1.02
      } : {}}
      className={`${baseStyles} ${hoverStyles} ${glowStyles} ${className}`}
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2), 0 8px 16px rgba(0, 0, 0, 0.1)'
      }}
      {...props}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export default GlassCard;
