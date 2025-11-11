'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * MotionBackground Component
 *
 * Premium animated gradient background for B2B SaaS
 * Inspired by Linear, Stripe, and modern tech companies
 *
 * Features:
 * - Slow-moving gradient orbs
 * - Blur effects for depth
 * - Subtle animation (no distraction)
 * - Professional dark theme
 * - Performance optimized with will-change
 */

export const MotionBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(17, 24, 39, 1) 0%, rgba(0, 0, 0, 1) 100%)'
        }}
      />

      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-0 -left-1/4 w-1/2 h-1/2 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.35) 0%, transparent 70%)',
          filter: 'blur(80px)',
          willChange: 'transform'
        }}
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute top-1/4 -right-1/4 w-1/2 h-1/2 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(147, 51, 234, 0.25) 0%, transparent 70%)',
          filter: 'blur(80px)',
          willChange: 'transform'
        }}
        animate={{
          x: [0, -100, 0],
          y: [0, 100, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute bottom-0 left-1/3 w-1/2 h-1/2 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
          filter: 'blur(80px)',
          willChange: 'transform'
        }}
        animate={{
          x: [0, -50, 0],
          y: [0, -100, 0],
          scale: [1, 1.15, 1]
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Subtle grid overlay for depth */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px'
        }}
      />

      {/* Noise texture for premium feel */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
          mixBlendMode: 'overlay'
        }}
      />
    </div>
  );
};

export default MotionBackground;
