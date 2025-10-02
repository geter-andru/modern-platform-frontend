'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ClockIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

interface ICPHistoryItem {
  id: string;
  name: string;
  createdAt: string;
  segments: number;
  averageScore: number;
  status: 'completed' | 'processing' | 'failed';
  size: string;
}

interface ICPHistoryProps {
  customerId: string;
}

// Mock data - in real app this would come from API
const mockHistory: ICPHistoryItem[] = [
  {
    id: '1',
    name: 'Enterprise SaaS Analysis',
    createdAt: '2024-08-15T10:30:00Z',
    segments: 3,
    averageScore: 87,
    status: 'completed',
    size: '2.3 MB',
  },
  {
    id: '2',
    name: 'Mid-Market Tech Companies',
    createdAt: '2024-08-10T14:20:00Z',
    segments: 2,
    averageScore: 75,
    status: 'completed',
    size: '1.8 MB',
  },
  {
    id: '3',
    name: 'Healthcare Vertical Analysis',
    createdAt: '2024-08-05T09:15:00Z',
    segments: 4,
    averageScore: 92,
    status: 'completed',
    size: '3.1 MB',
  },
];

export function ICPHistory({ customerId }: ICPHistoryProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'name'>('date');

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

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 55) return 'text-yellow-600';
    return 'text-red-600';
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

  const sortedHistory = [...mockHistory].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'score':
        return b.averageScore - a.averageScore;
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
          <h2 className="text-2xl font-bold text-gray-900">Analysis History</h2>
          <p className="text-gray-600 mt-1">
            {mockHistory.length} analyses • {selectedItems.length} selected
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="date">Sort by Date</option>
            <option value="score">Sort by Score</option>
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
            <span className="ml-2 text-sm text-gray-700">Select all analyses</span>
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
                    <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                      <span className="flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {formatDate(item.createdAt)}
                      </span>
                      <span className="flex items-center">
                        <ChartBarIcon className="h-4 w-4 mr-1" />
                        {item.segments} segments
                      </span>
                      <span>{item.size}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className={`text-sm font-medium ${getScoreColor(item.averageScore)}`}>
                      {item.averageScore}/100
                    </div>
                    <div className="text-xs text-gray-500">Avg. Score</div>
                  </div>

                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>

                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
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
          <ChartBarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis History</h3>
          <p className="text-gray-600 mb-6">
            Your completed ICP analyses will appear here for easy access and comparison.
          </p>
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
            Create First Analysis
          </button>
        </div>
      )}

      {/* Stats summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-gray-900">{mockHistory.length}</div>
          <div className="text-sm text-gray-600">Total Analyses</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-gray-900">
            {mockHistory.reduce((acc, item) => acc + item.segments, 0)}
          </div>
          <div className="text-sm text-gray-600">Customer Segments</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-gray-900">
            {Math.round(mockHistory.reduce((acc, item) => acc + item.averageScore, 0) / mockHistory.length) || 0}
          </div>
          <div className="text-sm text-gray-600">Avg. Fit Score</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-gray-900">
            {mockHistory.filter(item => item.status === 'completed').length}
          </div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
      </div>
    </div>
  );
}