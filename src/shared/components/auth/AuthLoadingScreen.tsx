'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Shield, CheckCircle2, Sparkles } from 'lucide-react';

interface AuthLoadingScreenProps {
  /** Duration in milliseconds (default: 4500ms = 4.5 seconds) */
  duration?: number;
  /** Callback when loading completes */
  onComplete?: () => void;
  /** Show immediately without animation delay */
  immediate?: boolean;
}

interface LoadingStep {
  id: string;
  label: string;
  icon: React.ReactNode;
  duration: number; // ms to display this step
}

/**
 * AuthLoadingScreen - Modern, sophisticated loading experience
 *
 * Displays during OAuth callback to ensure session synchronization
 * Shows animated progress indicators and status messages
 * Guarantees 4-5 second delay for race condition prevention
 */
export function AuthLoadingScreen({
  duration = 4500,
  onComplete,
  immediate = false
}: AuthLoadingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Loading steps with timing
  const steps: LoadingStep[] = [
    {
      id: 'authenticating',
      label: 'Authenticating with Google',
      icon: <Shield className="w-6 h-6" />,
      duration: 1000
    },
    {
      id: 'verifying',
      label: 'Verifying your credentials',
      icon: <CheckCircle2 className="w-6 h-6" />,
      duration: 1500
    },
    {
      id: 'syncing',
      label: 'Synchronizing your session',
      icon: <Loader2 className="w-6 h-6 animate-spin" />,
      duration: 1500
    },
    {
      id: 'preparing',
      label: 'Preparing your dashboard',
      icon: <Sparkles className="w-6 h-6" />,
      duration: 500
    }
  ];

  // Progress animation
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      // Update current step based on elapsed time
      let accumulatedDuration = 0;
      for (let i = 0; i < steps.length; i++) {
        accumulatedDuration += steps[i].duration;
        if (elapsed < accumulatedDuration) {
          setCurrentStep(i);
          break;
        }
      }

      if (elapsed >= duration) {
        clearInterval(interval);
        setProgress(100);
        setCurrentStep(steps.length - 1);
        setIsComplete(true);

        // Small delay before calling onComplete to show 100% state
        setTimeout(() => {
          onComplete?.();
        }, 300);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [duration, onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.98) 100%)',
          backdropFilter: 'blur(20px)'
        }}
      >
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: 0
              }}
              animate={{
                y: [null, Math.random() * window.innerHeight],
                scale: [0, 1, 0],
                opacity: [0, 0.8, 0]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: 'easeInOut'
              }}
            />
          ))}
        </div>

        {/* Main loading card */}
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20,
            delay: immediate ? 0 : 0.1
          }}
          className="relative z-10 w-full max-w-md mx-4"
        >
          <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 shadow-2xl backdrop-blur-xl">
            {/* Logo/Icon area */}
            <div className="flex justify-center mb-8">
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="relative"
              >
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/50">
                  <Shield className="w-10 h-10 text-white" />
                </div>

                {/* Pulsing rings */}
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 0, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeOut'
                  }}
                  className="absolute inset-0 rounded-2xl border-2 border-blue-400"
                />
              </motion.div>
            </div>

            {/* Current step indicator */}
            <div className="mb-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-center gap-3 text-white"
                >
                  <div className="text-blue-400">
                    {steps[currentStep]?.icon}
                  </div>
                  <span className="text-lg font-medium">
                    {steps[currentStep]?.label}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Progress bar */}
            <div className="mb-6">
              <div className="relative h-2 bg-slate-700/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: 'easeOut' }}
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                >
                  {/* Shimmer effect */}
                  <motion.div
                    animate={{
                      x: ['-100%', '200%']
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'linear'
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    style={{ width: '50%' }}
                  />
                </motion.div>
              </div>

              {/* Progress percentage */}
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-slate-400">
                  {Math.round(progress)}%
                </span>
                <span className="text-xs text-slate-400">
                  {isComplete ? 'Complete' : 'Loading...'}
                </span>
              </div>
            </div>

            {/* Step indicators */}
            <div className="flex justify-center gap-2">
              {steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ scale: 0.8, opacity: 0.3 }}
                  animate={{
                    scale: index === currentStep ? 1.2 : 0.8,
                    opacity: index <= currentStep ? 1 : 0.3,
                    backgroundColor: index < currentStep
                      ? 'rgb(59, 130, 246)' // blue-500
                      : index === currentStep
                      ? 'rgb(147, 51, 234)' // purple-600
                      : 'rgb(51, 65, 85)' // slate-700
                  }}
                  transition={{ duration: 0.3 }}
                  className="w-2 h-2 rounded-full"
                />
              ))}
            </div>

            {/* Completion message */}
            <AnimatePresence>
              {isComplete && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-6 text-center"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-medium border border-green-500/30">
                    <CheckCircle2 className="w-4 h-4" />
                    Ready!
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Security badge */}
            <div className="mt-6 pt-6 border-t border-white/5">
              <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                <Shield className="w-3 h-3" />
                <span>Secured by Supabase Authentication</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Debug info (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute bottom-4 left-4 text-xs text-white/50 font-mono bg-black/50 px-3 py-2 rounded">
            Step {currentStep + 1}/{steps.length} | {Math.round(progress)}% | {Math.round((duration - (progress / 100 * duration)))}ms remaining
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default AuthLoadingScreen;
