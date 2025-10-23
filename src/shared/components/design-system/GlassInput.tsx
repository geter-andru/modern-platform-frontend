import React from 'react';
import { motion } from 'framer-motion';

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  className?: string;
}

const GlassInput: React.FC<GlassInputProps> = ({
  label,
  error,
  icon,
  className = '',
  ...props
}) => {
  const baseStyles = `
    w-full px-4 py-3 rounded-xl
    bg-white/5 backdrop-blur-xl
    border border-white/10
    text-white placeholder-white/50
    transition-all duration-300
    focus:outline-none focus:ring-2 focus:ring-brand/50
    focus:bg-white/10 focus:border-brand/50
    focus:shadow-lg focus:shadow-brand/20
    hover:bg-white/8 hover:border-white/20
  `;

  const errorStyles = error ? `
    border-red-500/50 bg-red-500/5
    focus:ring-red-500/50 focus:border-red-500/50
  ` : '';

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-white/90">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50">
            {icon}
          </div>
        )}
        
        <motion.input
          whileFocus={{ 
            scale: 1.02,
            y: -1
          }}
          className={`
            ${baseStyles} 
            ${errorStyles} 
            ${icon ? 'pl-10' : ''} 
            ${className}
          `}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: error 
              ? '1px solid rgba(239, 68, 68, 0.5)'
              : '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: error 
              ? '0 4px 12px rgba(239, 68, 68, 0.2)'
              : '0 4px 12px rgba(0, 0, 0, 0.2)'
          }}
          {...props}
        />
      </div>
      
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-400"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default GlassInput;
