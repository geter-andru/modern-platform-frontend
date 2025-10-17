import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw, Download, FileDown } from 'lucide-react'
import { Brain, Target, Users, FileText, Zap } from 'lucide-react'

interface Widget {
  id: string
  title: string
  description: string
  icon: React.ComponentType<any>
  available: boolean
  component?: React.ComponentType<any>
}

interface ICPAnalysisPageProps {
  customerId: string
}

const WIDGETS: Widget[] = [
  {
    id: 'generate',
    title: 'Generate ICP',
    description: 'AI-powered customer profile generation',
    icon: Brain,
    available: true,
    component: () => <div>Generate ICP Component</div>
  },
  {
    id: 'rating-framework',
    title: 'Rating Framework',
    description: 'Create scoring systems for prospects',
    icon: Target,
    available: true,
    component: () => <div>Rating Framework Component</div>
  },
  {
    id: 'rate-companies',
    title: 'Rate Companies',
    description: 'Score and prioritize prospects',
    icon: Users,
    available: true,
    component: () => <div>Rate Companies Component</div>
  },
  {
    id: 'resources',
    title: 'Resources',
    description: 'Access generated materials',
    icon: FileText,
    available: true,
    component: () => <div>Resources Component</div>
  },
  {
    id: 'technical-translation',
    title: 'Tech Translation',
    description: 'Convert features to business value',
    icon: Zap,
    available: false
  }
]

export default function ICPAnalysisPage({ customerId }: ICPAnalysisPageProps) {
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

  const handleGenerateICP = (data: any) => {
    console.log('Generating ICP:', data)
    // Handle ICP generation
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">ICP Analysis Tool</h1>
        <p className="text-text-muted">
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
                    ? 'bg-brand-primary text-white'
                    : isAvailable
                    ? 'bg-background-secondary text-text-muted hover:text-text-primary hover:bg-surface-hover'
                    : 'bg-background-secondary text-text-disabled cursor-not-allowed'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                {widget.title}
                {!isAvailable && (
                  <span className="text-xs bg-surface text-text-disabled px-2 py-1 rounded">
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
                onGenerateICP={handleGenerateICP}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {currentWidget && !currentWidget.available && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-background-secondary border border-border-standard rounded-xl p-12 text-center"
          >
            <currentWidget.icon className="w-16 h-16 text-text-disabled mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              {currentWidget.title}
            </h3>
            <p className="text-text-muted mb-6">
              {currentWidget.description}
            </p>
            <div className="bg-brand-primary/20 border border-brand-primary/50 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-brand-primary text-sm">
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
          className="flex items-center gap-2 px-4 py-2 bg-background-secondary hover:bg-surface-hover text-text-primary rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Data
        </button>
        
        <button
          onClick={() => setShowExportModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-primary-dark text-white rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          Export All
        </button>
      </div>

      {showExportModal && (
        <div className="fixed inset-0 bg-background-darker bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-background-secondary border border-border-standard rounded-xl max-w-2xl w-full">
            <div className="px-6 py-4 border-b border-border-standard">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-text-primary">Export ICP Analysis</h2>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="text-text-muted hover:text-text-primary transition-colors"
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
                <FileDown className="w-12 h-12 text-brand-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  Export Options Coming Soon
                </h3>
                <p className="text-text-muted mb-6">
                  Advanced export functionality will be available in the next phase of development.
                </p>
                
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  <div className="bg-background-tertiary rounded-lg p-4">
                    <h4 className="text-text-primary font-medium mb-2">PDF Report</h4>
                    <p className="text-text-muted text-sm">Comprehensive ICP analysis document</p>
                  </div>
                  <div className="bg-background-tertiary rounded-lg p-4">
                    <h4 className="text-text-primary font-medium mb-2">CRM Integration</h4>
                    <p className="text-text-muted text-sm">HubSpot, Salesforce, Pipedrive</p>
                  </div>
                  <div className="bg-background-tertiary rounded-lg p-4">
                    <h4 className="text-text-primary font-medium mb-2">AI Prompts</h4>
                    <p className="text-text-muted text-sm">Claude, ChatGPT, Perplexity</p>
                  </div>
                  <div className="bg-background-tertiary rounded-lg p-4">
                    <h4 className="text-text-primary font-medium mb-2">Sales Tools</h4>
                    <p className="text-text-muted text-sm">Outreach, SalesLoft, Apollo</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

