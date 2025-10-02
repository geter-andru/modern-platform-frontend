'use client';

import React from 'react';
import {
  ChartBarIcon,
  ClockIcon,
  BoltIcon,
  ArrowTrendingUpIcon,
  ChartPieIcon,
  UserGroupIcon,
  DocumentTextIcon,
  CalculatorIcon,
  CheckCircleIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';

const CircularProgress = ({ percentage }: { percentage: number }) => {
  const radius = 45;
  const strokeWidth = 3;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;

  return (
    <div className="relative w-32 h-32">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90"
      >
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6"/>
            <stop offset="100%" stopColor="#ec4899"/>
          </linearGradient>
        </defs>
        <circle
          stroke="#334155"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="url(#progressGradient)"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{percentage}%</div>
          <div className="text-sm text-white">Complete</div>
        </div>
      </div>
    </div>
  );
};

export function EnterpriseDashboard() {
  const stats = [
    {
      label: 'Overall Progress',
      value: '73%',
      icon: ChartBarIcon,
      iconBg: 'bg-slate-700',
      iconColor: 'text-blue-400'
    },
    {
      label: 'Milestones',
      value: '3/5',
      icon: ArrowTrendingUpIcon,
      iconBg: 'bg-slate-700',
      iconColor: 'text-emerald-400'
    },
    {
      label: 'Time Invested',
      value: '24 hrs',
      icon: ClockIcon,
      iconBg: 'bg-slate-700',
      iconColor: 'text-purple-400'
    },
    {
      label: 'Current Streak',
      value: '7 days',
      icon: BoltIcon,
      iconBg: 'bg-slate-700',
      iconColor: 'text-pink-400'
    }
  ];

  const competencies = [
    { name: 'Customer Analysis', score: 73, progress: 73, baseline: 50, toUnlock: 20 },
    { name: 'Value Communication', score: 68, progress: 68, baseline: 50, toUnlock: 25 },
    { name: 'Sales Execution', score: 71, progress: 71, baseline: 50, toUnlock: 22 }
  ];

  const actions = [
    { id: 1, title: 'Complete ICP Analysis', description: 'Analyze 3 more prospects', icon: '📊', points: 5 },
    { id: 2, title: 'Generate Business Case', description: 'Create executive proposal', icon: '📈', points: 10 },
    { id: 3, title: 'Calculate Deal Value', description: 'Show cost of waiting', icon: '💰', points: 8 }
  ];

  const workflowSteps = ['Qualify', 'Calculate', 'Analyze', 'Export', 'Close'];
  const currentStep = 2;

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Revenue Intelligence Dashboard</h1>
          <p className="text-white">Track your sales capabilities and access generated materials</p>
        </div>

        {/* Workflow Progress Section */}
        <div className="mb-8 bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Sales Workflow Progress</h3>
            <span className="text-sm text-white">{Math.round((currentStep / workflowSteps.length) * 100)}% Complete</span>
          </div>
          <div className="flex items-center justify-between mb-6">
            {workflowSteps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index <= currentStep ? 'bg-blue-500 ring-4 ring-blue-500/30' : 'bg-slate-600'
                }`} />
                {index < workflowSteps.length - 1 && (
                  <div className={`w-full h-0.5 mx-2 transition-all ${
                    index < currentStep ? 'bg-blue-500' : 'bg-slate-600'
                  }`} style={{ width: '40px' }} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs">
            {workflowSteps.map((step, index) => (
              <span key={index} className="text-white">
                {step}
              </span>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="group bg-slate-800 border border-slate-700 rounded-xl p-6 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-500/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">{stat.label}</p>
                    <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.iconBg} rounded-xl flex items-center justify-center group-hover:bg-blue-500/20 transition-colors`}>
                    <Icon className={`w-6 h-6 ${stat.iconColor} group-hover:text-blue-400`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Strategic Gradient Section */}
        <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl p-8 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Revenue Intelligence Development</h3>
              <p className="text-blue-100 mb-1">Level: Developing • Focus Area: Export-ready Revenue Intelligence</p>
              <p className="text-blue-200 text-sm">Your revenue capabilities assessment shows solid foundation with optimization potential</p>
              <p className="text-blue-200 text-sm">Strategic enhancement opportunities identified worth $500K in additional revenue</p>
            </div>
            <div className="text-right">
              <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">Strategic</span>
              <p className="text-blue-100 text-sm mt-1">Priority Level</p>
            </div>
          </div>
        </div>

        {/* Unlock Progress Section */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Next Tool Unlock</h3>
              <p className="text-purple-100">Continue professional development activities</p>
              <p className="text-purple-200 text-sm">Current Progress: 73% • Target: 80% for advanced analytics unlock</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white">7</div>
              <div className="text-purple-100 text-sm">points needed</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-white/20 rounded-full h-3">
              <div className="bg-white h-3 rounded-full transition-all duration-500" style={{width: '73%'}}></div>
            </div>
          </div>
        </div>

        {/* Progress and Competency Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Development Progress */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Development Progress</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-sm text-white">Stable</span>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-white">Live</span>
              </div>
            </div>
            
            <div className="flex items-center justify-center py-12">
              <CircularProgress percentage={73} />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-700 border border-slate-600 rounded-lg">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-white">3 of 5 milestones</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-slate-700 border border-slate-600 rounded-lg">
                <div className="flex items-center">
                  <ClockIcon className="w-4 h-4 text-purple-400 mr-3" />
                  <span className="text-sm text-white">24h Time invested</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-slate-700 border border-slate-600 rounded-lg">
                <div className="flex items-center">
                  <ArrowTrendingUpIcon className="w-4 h-4 text-blue-400 mr-3" />
                  <span className="text-sm text-white">8h Estimated remaining</span>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Competency Development */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Professional Competency Development</h3>
            {competencies.map(comp => (
              <div key={comp.name} className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-medium">{comp.name}</span>
                  <span className="text-white font-semibold">{comp.score} <span className="text-white text-sm">/ Developing</span></span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 mb-1">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                    style={{width: `${comp.progress}%`}}
                  ></div>
                </div>
                <p className="text-xs text-white">Baseline: {comp.baseline} • {comp.toUnlock} to unlock</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions and Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Professional Development Actions */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Professional Development Actions</h3>
            {actions.map(action => (
              <div key={action.id} className="bg-slate-700 border border-slate-600 rounded-lg p-4 mb-4 transition-all hover:border-blue-500/50 hover:bg-slate-600/50 hover:transform hover:-translate-y-0.5 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">{action.title}</h4>
                    <p className="text-white text-sm">{action.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{action.icon}</span>
                    <div className="w-8 h-8 bg-blue-500/20 rounded text-white text-xs font-bold flex items-center justify-center">
                      +{action.points}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Recent Activity</h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 bg-slate-700 border border-slate-600 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircleIcon className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white">ICP Analysis Completed</p>
                  <p className="text-xs text-white mt-1">Analyzed TechCorp - Score: 92/100</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-slate-700 border border-slate-600 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <CalculatorIcon className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white">Cost Calculator Used</p>
                  <p className="text-xs text-white mt-1">Generated $2.3M impact analysis</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-slate-700 border border-slate-600 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <ArrowTrendingUpIcon className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white">Projected completion: 12/31/2024</p>
                  <p className="text-xs text-white mt-1">Based on current progress and usage patterns</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}