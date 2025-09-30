'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ModernCircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  showPercentage?: boolean;
  label?: string;
}

export default function ModernCircularProgress({
  percentage,
  size = 120,
  strokeWidth = 8,
  color = '#8B5CF6',
  backgroundColor = '#374151',
  showPercentage = true,
  label
}: ModernCircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={backgroundColor}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        
        {/* Percentage text */}
        {showPercentage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span 
              className="text-white font-bold"
              style={{ fontSize: size / 6 }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              {Math.round(percentage)}%
            </motion.span>
          </div>
        )}
      </div>
      
      {label && (
        <span className="text-sm text-gray-400 mt-2 text-center">{label}</span>
      )}
    </div>
  );
}

export function ModernProgressGroup({ 
  items, 
  className = '' 
}: { 
  items: Array<{
    label: string;
    percentage: number;
    color?: string;
  }>;
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap gap-6 justify-center ${className}`}>
      {items.map((item, index) => (
        <ModernCircularProgress
          key={index}
          percentage={item.percentage}
          color={item.color}
          label={item.label}
          size={100}
        />
      ))}
    </div>
  );
}