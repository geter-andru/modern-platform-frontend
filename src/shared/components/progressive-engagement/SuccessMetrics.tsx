'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SuccessMetricsProps {
  metrics?: {
    revenue: number;
    efficiency: number;
    satisfaction: number;
  };
}

interface UseSuccessMetricsReturn {
  metrics: {
    revenue: number;
    efficiency: number;
    satisfaction: number;
  };
  isLoading: boolean;
  refreshMetrics: () => void;
}

export const useSuccessMetrics = (): UseSuccessMetricsReturn => {
  const [metrics, setMetrics] = useState({
    revenue: 0,
    efficiency: 0,
    satisfaction: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  const refreshMetrics = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setMetrics({
        revenue: Math.floor(Math.random() * 100),
        efficiency: Math.floor(Math.random() * 100),
        satisfaction: Math.floor(Math.random() * 100)
      });
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    refreshMetrics();
  }, []);

  return { metrics, isLoading, refreshMetrics };
};

const SuccessMetricsDisplay: React.FC<SuccessMetricsProps> = ({
  metrics = { revenue: 0, efficiency: 0, satisfaction: 0 }
}) => {
  const [animatedMetrics, setAnimatedMetrics] = useState({
    revenue: 0,
    efficiency: 0,
    satisfaction: 0
  });

  useEffect(() => {
    const animateValue = (key: keyof typeof metrics, target: number) => {
      const duration = 2000;
      const start = Date.now();
      const startValue = animatedMetrics[key];

      const animate = () => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const current = startValue + (target - startValue) * progress;
        
        setAnimatedMetrics(prev => ({ ...prev, [key]: Math.floor(current) }));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      animate();
    };

    Object.entries(metrics).forEach(([key, value]) => {
      animateValue(key as keyof typeof metrics, value);
    });
  }, [metrics]);

  const metricItems = [
    { key: 'revenue', label: 'Revenue Growth', color: 'text-green-400', icon: '💰' },
    { key: 'efficiency', label: 'Efficiency Gain', color: 'text-blue-400', icon: '⚡' },
    { key: 'satisfaction', label: 'User Satisfaction', color: 'text-purple-400', icon: '😊' }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-white mb-4">
        Success Metrics
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metricItems.map((item, index) => (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 p-4 rounded-lg border border-gray-700"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{item.icon}</span>
              <span className={`text-2xl font-bold ${item.color}`}>
                {animatedMetrics[item.key as keyof typeof animatedMetrics]}%
              </span>
            </div>
            <div className="text-gray-300 text-sm">{item.label}</div>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
              <motion.div
                className={`h-2 rounded-full ${
                  item.key === 'revenue' ? 'bg-green-500' :
                  item.key === 'efficiency' ? 'bg-blue-500' : 'bg-purple-500'
                }`}
                initial={{ width: 0 }}
                animate={{ 
                  width: `${animatedMetrics[item.key as keyof typeof animatedMetrics]}%` 
                }}
                transition={{ duration: 1, delay: index * 0.2 }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SuccessMetricsDisplay;
