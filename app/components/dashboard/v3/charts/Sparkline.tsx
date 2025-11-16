'use client';

/**
 * Sparkline - Mini Trend Chart Component
 *
 * Displays a compact line chart showing recent trend data (last 5-12 weeks)
 * Used inline within metric cards to show at-a-glance trends
 */

import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  ChartOptions
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip
);

// ==================== TYPE DEFINITIONS ====================

export interface SparklineProps {
  data: number[];
  color?: string;
  fillColor?: string;
  width?: number;
  height?: number;
  showTooltip?: boolean;
  className?: string;
}

// ==================== MAIN COMPONENT ====================

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  color = 'rgb(59, 130, 246)', // blue-500
  fillColor = 'rgba(59, 130, 246, 0.1)',
  width = 80,
  height = 32,
  showTooltip = false,
  className = ''
}) => {
  // ==================== CHART DATA ====================

  const chartData = {
    labels: data.map((_, i) => `Week ${i + 1}`),
    datasets: [
      {
        data: data,
        borderColor: color,
        backgroundColor: fillColor,
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: showTooltip ? 3 : 0,
        pointHoverBackgroundColor: color,
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2
      }
    ]
  };

  // ==================== CHART OPTIONS ====================

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: showTooltip,
        displayColors: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 8,
        cornerRadius: 4,
        titleFont: {
          size: 11
        },
        bodyFont: {
          size: 11
        },
        callbacks: {
          title: () => '',
          label: (context) => context.parsed.y !== null ? `${context.parsed.y.toFixed(1)}` : ''
        }
      }
    },
    scales: {
      x: {
        display: false,
        grid: {
          display: false
        }
      },
      y: {
        display: false,
        grid: {
          display: false
        }
      }
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 0
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  // ==================== RENDER ====================

  return (
    <div className={className} style={{ width, height }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default Sparkline;
