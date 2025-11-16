'use client';

/**
 * FunnelChart - Prediction Lifecycle Conversion Funnel
 *
 * Shows conversion through the prediction pipeline:
 * Tool Uses → Outcomes Recorded → Predictions Made → Validated → Accurate
 *
 * Uses horizontal bars with decreasing widths to create funnel effect
 */

import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// ==================== TYPE DEFINITIONS ====================

export interface FunnelStage {
  label: string;
  value: number;
  color: string;
  description?: string;
}

export interface FunnelChartProps {
  stages: FunnelStage[];
  title?: string;
  subtitle?: string;
  className?: string;
}

// ==================== MAIN COMPONENT ====================

export const FunnelChart: React.FC<FunnelChartProps> = ({
  stages,
  title = 'Prediction Lifecycle Funnel',
  subtitle = 'Conversion through the predictive analytics pipeline',
  className = ''
}) => {
  // ==================== CHART DATA ====================

  const chartData = {
    labels: stages.map((stage) => stage.label),
    datasets: [
      {
        data: stages.map((stage) => stage.value),
        backgroundColor: stages.map((stage) => stage.color),
        borderColor: stages.map((stage) => stage.color.replace('0.8', '1')),
        borderWidth: 2,
        borderRadius: 6,
        barPercentage: 0.8,
        categoryPercentage: 0.9
      }
    ]
  };

  // ==================== CHART OPTIONS ====================

  const options: ChartOptions<'bar'> = {
    indexAxis: 'y', // Horizontal bars
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
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
        displayColors: false,
        callbacks: {
          title: (context) => {
            return stages[context[0].dataIndex].label;
          },
          label: (context) => {
            const value = context.parsed.x;
            if (value === null) return '';
            const total = stages[0].value;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${value} (${percentage}% of total)`;
          },
          afterLabel: (context) => {
            const description = stages[context.dataIndex].description;
            return description ? `\n${description}` : '';
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          color: 'rgba(75, 85, 99, 0.2)',
          lineWidth: 1
        },
        ticks: {
          color: '#9ca3af',
          font: {
            size: 11
          }
        },
        border: {
          color: 'rgba(75, 85, 99, 0.5)'
        }
      },
      y: {
        grid: {
          display: false
        },
        ticks: {
          color: '#d1d5db',
          font: {
            size: 12,
            weight: 500
          },
          padding: 10
        },
        border: {
          display: false
        }
      }
    }
  };

  // ==================== CALCULATIONS ====================

  const totalValue = stages[0]?.value || 0;
  const conversionRates = stages.map((stage, index) => {
    if (index === 0) return 100;
    const previousValue = stages[index - 1].value;
    return previousValue > 0 ? ((stage.value / previousValue) * 100).toFixed(1) : '0';
  });

  const overallConversion = totalValue > 0
    ? ((stages[stages.length - 1].value / totalValue) * 100).toFixed(1)
    : '0';

  // ==================== RENDER ====================

  return (
    <div className={`bg-[#1f1f1f] border border-gray-800 rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
            <p className="text-sm text-gray-400">{subtitle}</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">Overall Conversion</div>
            <div className="text-2xl font-bold text-blue-400">{overallConversion}%</div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full" style={{ height: '300px' }}>
        <Bar data={chartData} options={options} />
      </div>

      {/* Stage Details */}
      <div className="mt-6 space-y-3">
        {stages.map((stage, index) => {
          const previousStage = index > 0 ? stages[index - 1] : null;
          const dropoff = previousStage
            ? previousStage.value - stage.value
            : 0;
          const dropoffPercent = previousStage && previousStage.value > 0
            ? ((dropoff / previousStage.value) * 100).toFixed(1)
            : '0';

          return (
            <div
              key={stage.label}
              className="flex items-center justify-between p-3 bg-[#151515] rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: stage.color }}
                />
                <div>
                  <div className="text-sm font-medium text-gray-200">
                    {stage.label}
                  </div>
                  {stage.description && (
                    <div className="text-xs text-gray-500 mt-0.5">
                      {stage.description}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-white">{stage.value}</div>
                {index > 0 && (
                  <div className="text-xs text-gray-500">
                    {conversionRates[index]}% conversion
                    {dropoff > 0 && (
                      <span className="text-red-400 ml-1">
                        (-{dropoff})
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4 pt-6 border-t border-gray-800">
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-1">Total Input</div>
          <div className="text-xl font-bold text-white">{totalValue}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-1">Final Output</div>
          <div className="text-xl font-bold text-white">
            {stages[stages.length - 1]?.value || 0}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-1">Efficiency</div>
          <div className={`text-xl font-bold ${
            parseFloat(overallConversion) >= 70 ? 'text-green-400' :
            parseFloat(overallConversion) >= 50 ? 'text-yellow-400' :
            'text-red-400'
          }`}>
            {overallConversion}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default FunnelChart;
