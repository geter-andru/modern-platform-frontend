/**
 * ProgressRing Component - Expert Requirement: Donut Chart for Metrics
 * 
 * Replaces text boxes with visual progress rings/donut charts for percentages
 * Expert spec: Visual progress indicators instead of text boxes
 * 
 * STYLING ONLY - No logic changes
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ProgressRingProps {
  /** Percentage value (0-100) */
  value: number;
  /** Size of the ring (default: 64px for compact display) */
  size?: number;
  /** Stroke width (default: 6px) */
  strokeWidth?: number;
  /** Color scheme based on value */
  colorScheme?: 'auto' | 'primary' | 'success' | 'warning' | 'danger';
  /** Show percentage text in center */
  showLabel?: boolean;
  /** Custom label (overrides percentage) */
  label?: string;
  /** Additional CSS class */
  className?: string;
}

export function ProgressRing({
  value,
  size = 64,
  strokeWidth = 6,
  colorScheme = 'auto',
  showLabel = true,
  label,
  className = ''
}: ProgressRingProps) {
  // Clamp value between 0 and 100
  const percentage = Math.max(0, Math.min(100, value));
  
  // Calculate SVG dimensions
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  // Determine color based on value or scheme (expert: Electric Teal for interactive)
  const getColor = () => {
    if (colorScheme !== 'auto') {
      switch (colorScheme) {
        case 'primary': return '#00CED1'; // Electric Teal
        case 'success': return '#4CAF50'; // Green
        case 'warning': return '#FFC107'; // Amber
        case 'danger': return '#F44336'; // Red
        default: return '#00CED1';
      }
    }
    // Auto color based on value
    if (percentage >= 90) return '#4CAF50'; // Green - excellent
    if (percentage >= 80) return '#00CED1'; // Electric Teal - good
    if (percentage >= 70) return '#FFC107'; // Amber - fair
    return '#F44336'; // Red - poor
  };

  const color = getColor();
  const bgColor = '#2a2a2a'; // Dark background for ring track

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* Background circle (track) */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={bgColor}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          
          {/* Progress circle (donut) */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        
        {/* Center label */}
        {showLabel && (
          <div
            className="flex items-center justify-center"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0
            }}
          >
            <span
              className="text-text-primary font-medium"
              style={{
                fontSize: size * 0.22,
                color: '#E0E0E0' // Expert requirement: #E0E0E0 text
              }}
            >
              {label || `${Math.round(percentage)}%`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

