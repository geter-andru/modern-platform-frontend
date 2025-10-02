import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Share2, Download, RefreshCw } from 'lucide-react'
import { AssessmentOverviewWidget } from './AssessmentOverviewWidget'
import { AssessmentChallengesWidget } from './AssessmentChallengesWidget'
import { AssessmentRecommendationsWidget } from './AssessmentRecommendationsWidget'
import { AssessmentInsightsWidget } from './AssessmentInsightsWidget'

interface AssessmentData {
  [key: string]: unknown;
  results?: {
    overallScore: number;
    buyerScore: number;
    techScore: number;
  };
  userInfo?: {
    company: string;
    email: string;
  };
}

interface AssessmentResultsWidgetProps {
  assessmentData: AssessmentData
  className?: string
}

export function AssessmentResultsWidget({ 
  assessmentData, 
  className = '' 
}: AssessmentResultsWidgetProps) {
  const [activeSection, setActiveSection] = useState('overview')

  const handleLinkedInShare = () => {
    console.log('Share to LinkedIn')
  }

  const handlePDFDownload = () => {
    console.log('Download PDF')
  }

  const handleRetakeAssessment = () => {
    console.log('Retake assessment')
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Assessment Results</h1>
          <p className="text-text-muted">Your comprehensive revenue readiness analysis</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleLinkedInShare}
            className="bg-brand-primary hover:bg-blue-700 text-text-primary px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 shadow-medium"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
          <button
            onClick={handlePDFDownload}
            className="bg-brand-accent hover:bg-violet-700 text-text-primary px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 shadow-medium"
          >
            <Download className="w-4 h-4" />
            <span>PDF</span>
          </button>
          <button
            onClick={handleRetakeAssessment}
            className="bg-brand-secondary hover:bg-emerald-700 text-text-primary px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 shadow-medium"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retake</span>
          </button>
        </div>
      </div>

      <div className="border-b border-surface">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'challenges', label: 'Challenges' },
            { id: 'recommendations', label: 'Recommendations' },
            { id: 'insights', label: 'Insights' }
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeSection === id
                  ? 'border-brand-accent text-brand-accent'
                  : 'border-transparent text-text-muted hover:text-text-secondary'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>

      {activeSection === 'overview' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <AssessmentOverviewWidget 
            assessmentData={assessmentData as any}
            results={assessmentData.results || { overallScore: 0, buyerScore: 0, techScore: 0, qualification: 'unknown' } as any}
            userInfo={assessmentData.userInfo || { company: '', email: '' }}
          />
        </motion.div>
      )}

      {activeSection === 'challenges' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <AssessmentChallengesWidget assessmentData={assessmentData as any} />
        </motion.div>
      )}

      {activeSection === 'recommendations' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <AssessmentRecommendationsWidget />
        </motion.div>
      )}

      {activeSection === 'insights' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <AssessmentInsightsWidget 
            results={assessmentData.results || { overallScore: 0, buyerScore: 0, techScore: 0, qualification: 'unknown' } as any}
          />
        </motion.div>
      )}
    </div>
  );
}

