import React from 'react';
import { motion } from 'framer-motion';

interface GlassButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onDragEnter' | 'onDragExit' | 'onDragLeave' | 'onDragOver' | 'onDrop' | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
  children: React.ReactNode;
}

const GlassButton: React.FC<GlassButtonProps> = ({
  variant = 'primary',
  size = 'md',
  glow = false,
  children,
  className = '',
  ...props
}) => {
  const baseStyles = `
    relative overflow-hidden rounded-xl
    font-semibold transition-all duration-300
    focus:outline-none focus:ring-2 focus:ring-brand/50
    disabled:opacity-50 disabled:cursor-not-allowed
    disabled:transform-none
  `;

  const variantStyles = {
    primary: `
      bg-gradient-to-r from-brand-primary to-blue-600
      text-white shadow-lg shadow-brand/30
      hover:from-blue-600 hover:to-blue-700
      hover:shadow-xl hover:shadow-brand/40
      hover:-translate-y-1 hover:scale-105
    `,
    secondary: `
      bg-white/10 backdrop-blur-xl
      border border-white/20 text-white
      hover:bg-white/20 hover:border-white/30
      hover:shadow-lg hover:shadow-white/10
      hover:-translate-y-1 hover:scale-105
    `,
    ghost: `
      bg-transparent text-white/80
      hover:bg-white/10 hover:text-white
      hover:backdrop-blur-xl
      hover:-translate-y-1 hover:scale-105
    `
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const glowStyles = glow ? `
    hover:shadow-brand/50
    hover:shadow-2xl
  ` : '';

  return (
    <motion.button
      whileHover={{ 
        scale: 1.05,
        y: -2,
        boxShadow: variant === 'primary' 
          ? '0 20px 40px rgba(59, 130, 246, 0.4)' 
          : '0 20px 40px rgba(255, 255, 255, 0.1)'
      }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${glowStyles} ${className}`}
      style={{
        background: variant === 'primary' 
          ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
          : variant === 'secondary'
          ? 'rgba(255, 255, 255, 0.1)'
          : 'transparent',
        backdropFilter: variant !== 'primary' ? 'blur(20px)' : 'none',
        border: variant === 'secondary' ? '1px solid rgba(255, 255, 255, 0.2)' : 'none',
        boxShadow: variant === 'primary' 
          ? '0 8px 25px rgba(59, 130, 246, 0.3)'
          : '0 4px 12px rgba(0, 0, 0, 0.2)'
      }}
      {...props}
    >
      {/* Shimmer effect for primary buttons */}
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      )}
      
      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
};

export default GlassButton;
