'use client';

import React, { useState } from 'react';
import { ArrowLeft, Brain, Target, Users, FileText, Zap } from 'lucide-react';

const WIDGETS = [
  {
    id: 'overview',
    name: 'My ICP',
    description: 'AI-generated Ideal Customer Profile',
    icon: Brain,
    available: true
  },
  {
    id: 'rating',
    name: 'My ICP Rating System',
    description: 'Tier 1-5 classification framework',
    icon: Target,
    available: true
  },
  {
    id: 'rate-company',
    name: 'Rate A Company',
    description: 'Score companies against your ICP',
    icon: Users,
    available: true
  },
  {
    id: 'personas',
    name: 'My Target Buyer Personas',
    description: 'Detailed buyer persona profiles',
    icon: FileText,
    available: false
  },
  {
    id: 'translator',
    name: 'Technical Translator',
    description: 'Translate technical concepts',
    icon: Zap,
    available: false
  }
];

export default function TestICPPage() {
  const [activeWidget, setActiveWidget] = useState('overview');

  const renderWidget = () => {
    switch (activeWidget) {
      case 'overview':
        return (
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">My ICP - Overview</h3>
            <p className="text-gray-400 mb-4">
              This widget will display your AI-generated Ideal Customer Profile with comprehensive analysis.
            </p>
            <div className="bg-blue-900/20 border border-blue-600/50 rounded-lg p-4">
              <p className="text-blue-300 text-sm">
                ✅ <strong>Available:</strong> This widget is fully implemented and ready for testing.
              </p>
            </div>
          </div>
        );

      case 'rating':
        return (
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">My ICP Rating System</h3>
            <p className="text-gray-400 mb-4">
              This widget provides a tier 1-5 classification framework for your ideal customers.
            </p>
            <div className="bg-blue-900/20 border border-blue-600/50 rounded-lg p-4">
              <p className="text-blue-300 text-sm">
                ✅ <strong>Available:</strong> This widget is fully implemented and ready for testing.
              </p>
            </div>
          </div>
        );

      case 'rate-company':
        return (
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Rate A Company</h3>
            <p className="text-gray-400 mb-4">
              This widget allows you to score companies against your ICP criteria.
            </p>
            <div className="bg-blue-900/20 border border-blue-600/50 rounded-lg p-4">
              <p className="text-blue-300 text-sm">
                ✅ <strong>Available:</strong> This widget is fully implemented and ready for testing.
              </p>
            </div>
          </div>
        );

      case 'personas':
        return (
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">My Target Buyer Personas</h3>
            <p className="text-gray-400 mb-4">
              This widget will provide detailed buyer persona profiles based on your ICP analysis.
            </p>
            <div className="bg-yellow-900/20 border border-yellow-600/50 rounded-lg p-4">
              <p className="text-yellow-300 text-sm">
                🚧 <strong>Coming Soon:</strong> This widget will be implemented in the next phase.
              </p>
            </div>
          </div>
        );

      case 'translator':
        return (
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Technical Translator</h3>
            <p className="text-gray-400 mb-4">
              This widget will translate technical concepts into business language.
            </p>
            <div className="bg-yellow-900/20 border border-yellow-600/50 rounded-lg p-4">
              <p className="text-yellow-300 text-sm">
                🚧 <strong>Coming Soon:</strong> This widget will be implemented in the next phase.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <a
              href="/"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </a>
            <h1 className="text-3xl font-bold text-white">ICP Analysis Tool - Test Environment</h1>
          </div>
          <p className="text-gray-400">
            Systematic buyer understanding and targeting framework
          </p>
          <div className="mt-4 p-4 bg-blue-900/20 border border-blue-600/50 rounded-lg">
            <p className="text-blue-300 text-sm">
              🧪 <strong>Test Environment:</strong> This page showcases the ICP Analysis Tool with the first three implemented widgets. 
              The remaining widgets are marked as "Coming Soon" and will be implemented in the next phases.
            </p>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex gap-2 flex-wrap">
            {WIDGETS.map((widget) => {
              const IconComponent = widget.icon;
              const isActive = activeWidget === widget.id;
              const isAvailable = widget.available;
              
              return (
                <button
                  key={widget.id}
                  onClick={() => setActiveWidget(widget.id)}
                  disabled={!isAvailable}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-200
                    ${isActive 
                      ? 'bg-blue-600 border-blue-500 text-white' 
                      : isAvailable 
                        ? 'bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:border-gray-500' 
                        : 'bg-gray-800/30 border-gray-700 text-gray-500 cursor-not-allowed'
                    }
                  `}
                >
                  <IconComponent className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">{widget.name}</div>
                    <div className="text-xs opacity-75">{widget.description}</div>
                  </div>
                  {!isAvailable && (
                    <div className="ml-2 text-xs bg-yellow-900/50 text-yellow-300 px-2 py-1 rounded">
                      Coming Soon
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {renderWidget()}
          </div>
          
          <div className="space-y-6">
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Widget Status</h3>
              <div className="space-y-3">
                {WIDGETS.map((widget) => (
                  <div key={widget.id} className="flex items-center justify-between">
                    <span className="text-gray-300">{widget.name}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      widget.available 
                        ? 'bg-green-900/50 text-green-300' 
                        : 'bg-yellow-900/50 text-yellow-300'
                    }`}>
                      {widget.available ? 'Available' : 'Coming Soon'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Test Instructions</h3>
              <div className="text-sm text-gray-400 space-y-2">
                <p>1. Click on available widgets to test functionality</p>
                <p>2. Verify that each widget loads correctly</p>
                <p>3. Test user interactions and data flow</p>
                <p>4. Report any issues or unexpected behavior</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}