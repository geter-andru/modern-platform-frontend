'use client';

/**
 * RadarComparisonChart - Spider Chart for Multi-Metric Comparison
 *
 * Displays all 7 tool outcome indicators on a radar chart
 * Compares user performance against industry benchmarks
 * Shows at-a-glance where user excels vs struggles
 */

import React from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

// ==================== TYPE DEFINITIONS ====================

export interface RadarDataPoint {
  label: string;
  currentValue: number;
  benchmark: number;
}

export interface RadarComparisonChartProps {
  data: RadarDataPoint[];
  title?: string;
  currentLabel?: string;
  benchmarkLabel?: string;
  className?: string;
}

// ==================== MAIN COMPONENT ====================

export const RadarComparisonChart: React.FC<RadarComparisonChartProps> = ({
  data,
  title = 'Performance vs Industry Benchmark',
  currentLabel = 'Your Performance',
  benchmarkLabel = 'Industry Benchmark',
  className = ''
}) => {
  // ==================== CHART DATA ====================

  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        label: currentLabel,
        data: data.map((d) => d.currentValue),
        backgroundColor: 'rgba(59, 130, 246, 0.2)', // blue-500 with opacity
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: 'rgb(59, 130, 246)',
        pointHoverBorderColor: '#fff'
      },
      {
        label: benchmarkLabel,
        data: data.map((d) => d.benchmark),
        backgroundColor: 'rgba(234, 179, 8, 0.2)', // yellow-500 with opacity
        borderColor: 'rgb(234, 179, 8)',
        borderWidth: 2,
        pointBackgroundColor: 'rgb(234, 179, 8)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: 'rgb(234, 179, 8)',
        pointHoverBorderColor: '#fff'
      }
    ]
  };

  // ==================== CHART OPTIONS ====================

  const options: ChartOptions<'radar'> = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#9ca3af', // gray-400
          font: {
            size: 12,
            weight: '500'
          },
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        cornerRadius: 8,
        titleColor: '#fff',
        bodyColor: '#fff',
        titleFont: {
          size: 13,
          weight: 'bold'
        },
        bodyFont: {
          size: 12
        },
        displayColors: true,
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.r.toFixed(1);
            return `${label}: ${value}`;
          }
        }
      }
    },
    scales: {
      r: {
        beginAtZero: true,
        grid: {
          color: 'rgba(75, 85, 99, 0.3)', // gray-600 with opacity
          lineWidth: 1
        },
        angleLines: {
          color: 'rgba(75, 85, 99, 0.3)',
          lineWidth: 1
        },
        pointLabels: {
          color: '#d1d5db', // gray-300
          font: {
            size: 11,
            weight: '500'
          },
          padding: 10
        },
        ticks: {
          color: '#6b7280', // gray-500
          backdropColor: 'transparent',
          font: {
            size: 10
          },
          stepSize: 20
        }
      }
    }
  };

  // ==================== RENDER ====================

  return (
    <div className={`bg-[#1f1f1f] border border-gray-800 rounded-lg p-6 ${className}`}>
      {/* Title */}
      <h3 className="text-lg font-semibold text-white mb-6">{title}</h3>

      {/* Chart */}
      <div className="w-full" style={{ maxHeight: '400px' }}>
        <Radar data={chartData} options={options} />
      </div>

      {/* Legend Description */}
      <div className="mt-6 grid grid-cols-2 gap-4 text-xs">
        <div className="flex items-start space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full mt-0.5 flex-shrink-0"></div>
          <div>
            <p className="text-gray-300 font-medium">{currentLabel}</p>
            <p className="text-gray-500">Current week performance</p>
          </div>
        </div>
        <div className="flex items-start space-x-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full mt-0.5 flex-shrink-0"></div>
          <div>
            <p className="text-gray-300 font-medium">{benchmarkLabel}</p>
            <p className="text-gray-500">Series A B2B SaaS average</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadarComparisonChart;
