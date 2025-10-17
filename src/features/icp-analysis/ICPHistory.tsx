'use client';

import React, { useState } from 'react';
import { ModernCard } from '@/src/shared/components/ui/ModernCard';

interface ICPHistoryProps {
  customerId: string;
}

export function ICPHistory({ customerId }: ICPHistoryProps) {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');

  // Mock historical data
  const historyData = [
    {
      id: 1,
      companyName: 'TechCorp Solutions',
      score: 87,
      status: 'qualified',
      analyzedDate: '2025-01-15',
      industry: 'Technology',
      size: 'Medium (51-200)',
      outcome: 'Demo Scheduled'
    },
    {
      id: 2,
      companyName: 'HealthFlow Inc',
      score: 72,
      status: 'qualified',
      analyzedDate: '2025-01-14',
      industry: 'Healthcare',
      size: 'Small (11-50)',
      outcome: 'In Negotiation'
    },
    {
      id: 3,
      companyName: 'RetailMax Corp',
      score: 45,
      status: 'disqualified',
      analyzedDate: '2025-01-13',
      industry: 'Retail',
      size: 'Large (201-1000)',
      outcome: 'Not Pursued'
    },
    {
      id: 4,
      companyName: 'FinanceFirst Ltd',
      score: 91,
      status: 'qualified',
      analyzedDate: '2025-01-12',
      industry: 'Financial Services',
      size: 'Enterprise (1000+)',
      outcome: 'Closed Won'
    },
    {
      id: 5,
      companyName: 'ManufacturingPro',
      score: 68,
      status: 'qualified',
      analyzedDate: '2025-01-11',
      industry: 'Manufacturing',
      size: 'Medium (51-200)',
      outcome: 'Nurturing'
    },
    {
      id: 6,
      companyName: 'StartupXYZ',
      score: 38,
      status: 'disqualified',
      analyzedDate: '2025-01-10',
      industry: 'Technology',
      size: 'Startup (1-10)',
      outcome: 'Too Small'
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'emerald';
    if (score >= 70) return 'blue';
    if (score >= 55) return 'orange';
    return 'red';
  };

  const getStatusColor = (status: string) => {
    return status === 'qualified' ? 'emerald' : 'red';
  };

  const filteredData = historyData.filter(item => {
    if (filterStatus === 'all') return true;
    return item.status === filterStatus;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    switch (sortBy) {
      case 'score':
        return b.score - a.score;
      case 'company':
        return a.companyName.localeCompare(b.companyName);
      case 'date':
      default:
        return new Date(b.analyzedDate).getTime() - new Date(a.analyzedDate).getTime();
    }
  });

  const stats = {
    total: historyData.length,
    qualified: historyData.filter(item => item.status === 'qualified').length,
    disqualified: historyData.filter(item => item.status === 'disqualified').length,
    avgScore: Math.round(historyData.reduce((sum, item) => sum + item.score, 0) / historyData.length)
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <ModernCard className="p-6 text-center">
          <div className="text-3xl font-bold text-white mb-2">{stats.total}</div>
          <div className="text-slate-400">Total Analyzed</div>
        </ModernCard>
        
        <ModernCard className="p-6 text-center">
          <div className="text-3xl font-bold text-emerald-400 mb-2">{stats.qualified}</div>
          <div className="text-slate-400">Qualified</div>
        </ModernCard>
        
        <ModernCard className="p-6 text-center">
          <div className="text-3xl font-bold text-red-400 mb-2">{stats.disqualified}</div>
          <div className="text-slate-400">Disqualified</div>
        </ModernCard>
        
        <ModernCard className="p-6 text-center">
          <div className="text-3xl font-bold text-blue-400 mb-2">{stats.avgScore}</div>
          <div className="text-slate-400">Avg Score</div>
        </ModernCard>
      </div>

      {/* Filters and Controls */}
      <ModernCard className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-white text-sm font-medium mb-1">Filter by Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="qualified">Qualified</option>
                <option value="disqualified">Disqualified</option>
              </select>
            </div>
            
            <div>
              <label className="block text-white text-sm font-medium mb-1">Sort by</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
              >
                <option value="date">Analysis Date</option>
                <option value="score">Score</option>
                <option value="company">Company Name</option>
              </select>
            </div>
          </div>
          
          <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200">
            Export History
          </button>
        </div>
      </ModernCard>

      {/* History Table */}
      <ModernCard className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
          <h3 className="text-xl font-semibold text-white">Analysis History</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left text-white font-semibold py-3 px-4">Company</th>
                <th className="text-left text-white font-semibold py-3 px-4">Score</th>
                <th className="text-left text-white font-semibold py-3 px-4">Status</th>
                <th className="text-left text-white font-semibold py-3 px-4">Industry</th>
                <th className="text-left text-white font-semibold py-3 px-4">Size</th>
                <th className="text-left text-white font-semibold py-3 px-4">Date</th>
                <th className="text-left text-white font-semibold py-3 px-4">Outcome</th>
                <th className="text-left text-white font-semibold py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((item) => (
                <tr key={item.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                  <td className="py-4 px-4">
                    <div className="text-white font-medium">{item.companyName}</div>
                  </td>
                  
                  <td className="py-4 px-4">
                    <div className={`text-2xl font-bold text-${getScoreColor(item.score)}-400`}>
                      {item.score}
                    </div>
                  </td>
                  
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.status === 'qualified' 
                        ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-700/50'
                        : 'bg-red-900/30 text-red-400 border border-red-700/50'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  
                  <td className="py-4 px-4 text-slate-400">{item.industry}</td>
                  <td className="py-4 px-4 text-slate-400">{item.size}</td>
                  <td className="py-4 px-4 text-slate-400">
                    {new Date(item.analyzedDate).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4 text-slate-400">{item.outcome}</td>
                  
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <button className="text-blue-400 hover:text-blue-300 text-sm">
                        View
                      </button>
                      <button className="text-purple-400 hover:text-purple-300 text-sm">
                        Re-analyze
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {sortedData.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-400 text-lg mb-4">No analyses match your filters</div>
            <button 
              onClick={() => setFilterStatus('all')}
              className="text-purple-400 hover:text-purple-300"
            >
              Clear filters
            </button>
          </div>
        )}
      </ModernCard>

      {/* Insights Panel */}
      <ModernCard className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
          <h3 className="text-xl font-semibold text-white">Analysis Insights</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-800 rounded-lg">
            <div className="text-emerald-400 font-semibold mb-2">Best Performing Industry</div>
            <div className="text-white">Financial Services</div>
            <div className="text-slate-400 text-sm">Average score: 91</div>
          </div>
          
          <div className="p-4 bg-slate-800 rounded-lg">
            <div className="text-blue-400 font-semibold mb-2">Optimal Company Size</div>
            <div className="text-white">Medium (51-200)</div>
            <div className="text-slate-400 text-sm">Highest qualification rate</div>
          </div>
          
          <div className="p-4 bg-slate-800 rounded-lg">
            <div className="text-purple-400 font-semibold mb-2">Qualification Rate</div>
            <div className="text-white">{Math.round((stats.qualified / stats.total) * 100)}%</div>
            <div className="text-slate-400 text-sm">Above industry average</div>
          </div>
        </div>
      </ModernCard>
    </div>
  );
}