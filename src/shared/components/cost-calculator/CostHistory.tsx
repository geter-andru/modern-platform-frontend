'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ClockIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';

interface CostHistoryItem {
  id: string;
  name: string;
  createdAt: string;
  totalCost: number;
  monthlyImpact: number;
  timeframe: string;
  industry: string;
  status: 'completed' | 'processing' | 'failed';
  aiEnhanced: boolean;
}

interface CostHistoryProps {
  customerId: string;
  onViewResults: (results: any) => void;
}

// Mock data - in real app this would come from API
const mockHistory: CostHistoryItem[] = [
  {
    id: '1',
    name: 'Q4 Sales Optimization Analysis',
    createdAt: '2024-08-15T14:30:00Z',
    totalCost: 247500,
    monthlyImpact: 41250,
    timeframe: '6 months delay',
    industry: 'Technology',
    status: 'completed',
    aiEnhanced: true,
  },
  {
    id: '2',
    name: 'Process Automation ROI',
    createdAt: '2024-08-10T09:15:00Z',
    totalCost: 185000,
    monthlyImpact: 30833,
    timeframe: '6 months delay',
    industry: 'Technology',
    status: 'completed',
    aiEnhanced: false,
  },
  {
    id: '3',
    name: 'Customer Retention Impact',
    createdAt: '2024-08-05T16:45:00Z',
    totalCost: 320000,
    monthlyImpact: 53333,
    timeframe: '6 months delay',
    industry: 'Technology',
    status: 'completed',
    aiEnhanced: true,
  },
];

export function CostHistory({ customerId, onViewResults }: CostHistoryProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'cost' | 'name'>('date');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'processing':
        return 'text-blue-600 bg-blue-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getCostColor = (cost: number) => {
    if (cost >= 300000) return 'text-red-600';
    if (cost >= 200000) return 'text-orange-600';
    if (cost >= 100000) return 'text-yellow-600';
    return 'text-green-600';
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedItems(
      selectedItems.length === mockHistory.length 
        ? [] 
        : mockHistory.map(item => item.id)
    );
  };

  const handleViewResults = (item: CostHistoryItem) => {
    // Mock results data - in real app this would fetch from API
    const mockResults = {
      totalCost: item.totalCost,
      monthlyImpact: item.monthlyImpact,
      categories: [
        {
          name: 'Lost Revenue',
          amount: item.totalCost * 0.4,
          description: 'Revenue opportunities missed due to delays',
          breakdown: [
            { item: 'Delayed deals', value: item.totalCost * 0.25, unit: '' },
            { item: 'Lost prospects', value: item.totalCost * 0.15, unit: '' },
          ]
        },
        {
          name: 'Operational Inefficiency',
          amount: item.totalCost * 0.35,
          description: 'Costs from inefficient processes',
          breakdown: [
            { item: 'Manual processes', value: item.totalCost * 0.2, unit: '' },
            { item: 'Productivity loss', value: item.totalCost * 0.15, unit: '' },
          ]
        },
        {
          name: 'Competitive Disadvantage',
          amount: item.totalCost * 0.25,
          description: 'Market position erosion',
          breakdown: [
            { item: 'Market share loss', value: item.totalCost * 0.15, unit: '' },
            { item: 'Competitive gap', value: item.totalCost * 0.1, unit: '' },
          ]
        }
      ],
      scenarios: [
        { name: 'Conservative', totalCost: item.totalCost * 0.8, confidence: 80 },
        { name: 'Realistic', totalCost: item.totalCost, confidence: 90 },
        { name: 'Aggressive', totalCost: item.totalCost * 1.2, confidence: 70 },
      ],
      recommendations: [
        'Implement automated lead scoring to improve qualification efficiency',
        'Deploy CRM integration to reduce manual data entry by 60%',
        'Establish clear sales process workflows to accelerate deal closure',
      ],
      insights: [
        'Sales cycle length is 23% above industry average',
        'Lead conversion rate has declined 8% in the last quarter',
        'Customer acquisition cost has increased by 15%',
      ],
      calculatedAt: item.createdAt,
      timeframe: item.timeframe,
    };

    onViewResults(mockResults);
  };

  const sortedHistory = [...mockHistory].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'cost':
        return b.totalCost - a.totalCost;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Calculation History</h2>
          <p className="text-gray-600 mt-1">
            {mockHistory.length} calculations • {selectedItems.length} selected
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="date">Sort by Date</option>
            <option value="cost">Sort by Cost</option>
            <option value="name">Sort by Name</option>
          </select>
          
          {selectedItems.length > 0 && (
            <div className="flex space-x-2">
              <button className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                <ArrowDownTrayIcon className="h-4 w-4" />
                <span>Export</span>
              </button>
              <button className="flex items-center space-x-1 px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 text-sm">
                <TrashIcon className="h-4 w-4" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={selectedItems.length === mockHistory.length}
              onChange={handleSelectAll}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="ml-2 text-sm text-gray-700">Select all calculations</span>
          </label>
        </div>

        <div className="divide-y divide-gray-200">
          {sortedHistory.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleSelectItem(item.id)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                      {item.aiEnhanced && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          AI Enhanced
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                      <span className="flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {formatDate(item.createdAt)}
                      </span>
                      <span>{item.industry}</span>
                      <span>{item.timeframe}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getCostColor(item.totalCost)}`}>
                      {formatCurrency(item.totalCost)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatCurrency(item.monthlyImpact)}/month
                    </div>
                  </div>

                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>

                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleViewResults(item)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <ArrowDownTrayIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {mockHistory.length === 0 && (
        <div className="text-center py-12">
          <CurrencyDollarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Calculation History</h3>
          <p className="text-gray-600 mb-6">
            Your cost calculations will appear here for easy access and comparison.
          </p>
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
            Create First Calculation
          </button>
        </div>
      )}

      {/* Stats summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">{mockHistory.length}</div>
              <div className="text-sm text-gray-600">Total Calculations</div>
            </div>
            <ChartBarIcon className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(mockHistory.reduce((acc, item) => acc + item.totalCost, 0))}
              </div>
              <div className="text-sm text-gray-600">Total Cost Identified</div>
            </div>
            <CurrencyDollarIcon className="h-8 w-8 text-red-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(Math.round(mockHistory.reduce((acc, item) => acc + item.totalCost, 0) / mockHistory.length) || 0)}
              </div>
              <div className="text-sm text-gray-600">Average Cost</div>
            </div>
            <ArrowTrendingUpIcon className="h-8 w-8 text-orange-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {mockHistory.filter(item => item.aiEnhanced).length}
              </div>
              <div className="text-sm text-gray-600">AI Enhanced</div>
            </div>
            <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-purple-600 text-sm font-bold">AI</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}