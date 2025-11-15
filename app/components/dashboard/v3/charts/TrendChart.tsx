'use client';

/**
 * TrendChart - Multi-Line Trend Visualization
 *
 * Displays multiple tool outcome indicators trending over 12 weeks
 * Allows users to spot correlations and patterns across metrics
 * Interactive: hover to see all values at a specific week
 */

import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);

// ==================== TYPE DEFINITIONS ====================

export interface TrendDataSeries {
  id: string;
  label: string;
  data: number[];
  color: string;
  benchmark?: number;
}

export interface TrendChartProps {
  series: TrendDataSeries[];
  weekLabels: string[];
  title?: string;
  subtitle?: string;
  className?: string;
}

// ==================== HELPER FUNCTIONS ====================

const INDICATOR_COLORS = {
  low_fit_reduction: 'rgb(168, 85, 247)', // purple-500
  meeting_proposal: 'rgb(59, 130, 246)', // blue-500
  multi_stakeholder: 'rgb(34, 197, 94)', // green-500
  deal_size: 'rgb(16, 185, 129)', // emerald-500
  cycle_reduction: 'rgb(249, 115, 22)', // orange-500
  exec_engagement: 'rgb(234, 179, 8)', // yellow-500
  referral_rate: 'rgb(236, 72, 153)' // pink-500
};

// ==================== MAIN COMPONENT ====================

export const TrendChart: React.FC<TrendChartProps> = ({
  series,
  weekLabels,
  title = 'Tool Outcome Trends (12 Weeks)',
  subtitle = 'Track all indicators over time to spot patterns',
  className = ''
}) => {
  const [selectedSeries, setSelectedSeries] = useState<Set<string>>(
    new Set(series.map((s) => s.id))
  );

  // ==================== CHART DATA ====================

  const chartData = {
    labels: weekLabels,
    datasets: series
      .filter((s) => selectedSeries.has(s.id))
      .map((s) => ({
        label: s.label,
        data: s.data,
        borderColor: s.color,
        backgroundColor: s.color,
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: s.color,
        pointBorderColor: '#fff',
        pointBorderWidth: 1,
        pointHoverBackgroundColor: s.color,
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2
      }))
  };

  // ==================== CHART OPTIONS ====================

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        align: 'start',
        labels: {
          color: '#9ca3af', // gray-400
          font: {
            size: 11,
            weight: '500'
          },
          padding: 12,
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 6,
          boxHeight: 6
        }
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
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
        boxWidth: 8,
        boxHeight: 8,
        boxPadding: 4,
        callbacks: {
          title: (context) => {
            return context[0].label;
          },
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y.toFixed(1);
            return `${label}: ${value}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(75, 85, 99, 0.2)', // gray-600 with opacity
          lineWidth: 1
        },
        ticks: {
          color: '#9ca3af', // gray-400
          font: {
            size: 11
          }
        },
        border: {
          color: 'rgba(75, 85, 99, 0.5)'
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(75, 85, 99, 0.2)',
          lineWidth: 1
        },
        ticks: {
          color: '#9ca3af',
          font: {
            size: 11
          },
          callback: (value) => `${value}`
        },
        border: {
          color: 'rgba(75, 85, 99, 0.5)'
        }
      }
    }
  };

  // ==================== EVENT HANDLERS ====================

  const toggleSeries = (seriesId: string) => {
    const newSelected = new Set(selectedSeries);
    if (newSelected.has(seriesId)) {
      // Don't allow deselecting all series
      if (newSelected.size > 1) {
        newSelected.delete(seriesId);
      }
    } else {
      newSelected.add(seriesId);
    }
    setSelectedSeries(newSelected);
  };

  // ==================== RENDER ====================

  return (
    <div className={`bg-[#1f1f1f] border border-gray-800 rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
        <p className="text-sm text-gray-400">{subtitle}</p>
      </div>

      {/* Chart */}
      <div className="w-full" style={{ height: '400px' }}>
        <Line data={chartData} options={options} />
      </div>

      {/* Legend Toggles */}
      <div className="mt-6 flex flex-wrap gap-2">
        {series.map((s) => (
          <button
            key={s.id}
            onClick={() => toggleSeries(s.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedSeries.has(s.id)
                ? 'bg-opacity-20 border-opacity-50'
                : 'bg-opacity-5 border-opacity-20 opacity-50'
            } border`}
            style={{
              backgroundColor: selectedSeries.has(s.id)
                ? `${s.color}33`
                : `${s.color}0D`,
              borderColor: s.color,
              color: selectedSeries.has(s.id) ? s.color : '#6b7280'
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Stats Summary */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {series.filter((s) => selectedSeries.has(s.id)).map((s) => {
          const latestValue = s.data[s.data.length - 1];
          const previousValue = s.data[s.data.length - 2] || latestValue;
          const change = latestValue - previousValue;
          const changePercent = previousValue !== 0
            ? ((change / previousValue) * 100).toFixed(1)
            : '0.0';

          return (
            <div key={s.id} className="bg-[#151515] rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: s.color }}
                />
                <span className="text-xs text-gray-400 truncate">
                  {s.label}
                </span>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-lg font-bold text-white">
                  {latestValue.toFixed(1)}
                </span>
                <span
                  className={`text-xs font-medium ${
                    change >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {change >= 0 ? '+' : ''}
                  {changePercent}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrendChart;
