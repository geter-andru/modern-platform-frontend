'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, RefreshCw, Download, FileDown } from 'lucide-react'
import { Brain, Target, Users, FileText, Zap } from 'lucide-react'

interface Widget {
  id: string
  title: string
  description: string
  icon: React.ComponentType<any>
  available: boolean
  component?: React.ComponentType<any>
}

const WIDGETS: Widget[] = [
  {
    id: 'generate',
    title: 'Generate ICP',
    description: 'AI-powered customer profile generation',
    icon: Brain,
    available: true,
    component: () => <div className="p-8 text-center text-white">Generate ICP Component</div>
  },
  {
    id: 'rating-framework',
    title: 'Rating Framework',
    description: 'Create scoring systems for prospects',
    icon: Target,
    available: true,
    component: () => <div className="p-8 text-center text-white">Rating Framework Component</div>
  },
  {
    id: 'rate-companies',
    title: 'Rate Companies',
    description: 'Score and prioritize prospects',
    icon: Users,
    available: true,
    component: () => <div className="p-8 text-center text-white">Rate Companies Component</div>
  },
  {
    id: 'resources',
    title: 'Resources',
    description: 'Access generated materials',
    icon: FileText,
    available: true,
    component: () => <div className="p-8 text-center text-white">Resources Component</div>
  },
  {
    id: 'technical-translation',
    title: 'Tech Translation',
    description: 'Convert features to business value',
    icon: Zap,
    available: false
  }
]

export default function ICPAnalysisPage() {
  const [activeWidget, setActiveWidget] = useState('generate')
  const [loading, setLoading] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)

  const currentWidget = WIDGETS.find(w => w.id === activeWidget)

  const handleWidgetChange = (widgetId: string) => {
    setActiveWidget(widgetId)
  }

  const handleExport = (data: any) => {
    console.log('Exporting data:', data)
    // Handle export logic
  }

  const handleRefresh = async () => {
    setLoading(true)
    try {
      // Simulate refresh
      await new Promise(resolve => setTimeout(resolve, 1000))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => window.history.back()}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl font-bold text-white">ICP Analysis Tool</h1>
          </div>
          <p className="text-gray-400">
            Systematic buyer understanding and targeting framework
          </p>
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
                  onClick={() => handleWidgetChange(widget.id)}
                  disabled={!isAvailable}
                  className={`px-4 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : isAvailable
                      ? 'bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800'
                      : 'bg-gray-900 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {widget.title}
                  {!isAvailable && (
                    <span className="text-xs bg-gray-700 text-gray-500 px-2 py-1 rounded">
                      Coming Soon
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-8">
          <AnimatePresence mode="wait">
            {currentWidget && currentWidget.available && currentWidget.component && (
              <motion.div
                key={activeWidget}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <currentWidget.component
                  onExport={handleExport}
                  onRefresh={handleRefresh}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {currentWidget && !currentWidget.available && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center"
            >
              <currentWidget.icon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {currentWidget.title}
              </h3>
              <p className="text-gray-400 mb-6">
                {currentWidget.description}
              </p>
              <div className="bg-blue-900/20 border border-blue-600/50 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-blue-300 text-sm">
                  🚧 This widget is currently under development and will be available soon.
                </p>
              </div>
            </motion.div>
          )}
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
          
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Export All
          </button>
        </div>
      </div>

      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-2xl w-full">
            <div className="px-6 py-4 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Export ICP Analysis</h2>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <span className="sr-only">Close</span>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="text-center">
                <FileDown className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Export Options Coming Soon
                </h3>
                <p className="text-gray-400 mb-6">
                  Advanced export functionality will be available in the next phase of development.
                </p>
                
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-2">PDF Report</h4>
                    <p className="text-gray-400 text-sm">Comprehensive ICP analysis document</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-2">CRM Integration</h4>
                    <p className="text-gray-400 text-sm">HubSpot, Salesforce, Pipedrive</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-2">AI Prompts</h4>
                    <p className="text-gray-400 text-sm">Claude, ChatGPT, Perplexity</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-2">Sales Tools</h4>
                    <p className="text-gray-400 text-sm">Outreach, SalesLoft, Apollo</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
