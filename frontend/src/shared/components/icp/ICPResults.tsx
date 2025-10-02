'use client';

import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  TrophyIcon,
  ExclamationTriangleIcon,
  ArrowDownTrayIcon,
  SparklesIcon,
  PresentationChartLineIcon,
} from '@heroicons/react/24/outline';
import { useExportData } from '@/lib/hooks/useAPI';

interface ICPSegment {
  name: string;
  score: number;
  criteria: string[];
  opportunities: string[];
  challenges: string[];
}

interface ICPData {
  segments: ICPSegment[];
  keyIndicators: string[];
  redFlags: string[];
  ratingCriteria: Array<{
    name: string;
    weight: number;
    description: string;
  }>;
  recommendations: string[];
  lastGenerated: string;
}

interface ICPResultsProps {
  customerId: string;
  icpData?: ICPData;
  isLoading: boolean;
}

export function ICPResults({ customerId, icpData, isLoading }: ICPResultsProps) {
  const exportData = useExportData();

  const handleExport = (format: 'pdf' | 'excel') => {
    exportData.mutate({
      type: 'icp',
      data: {
        customerId,
        icpData,
        format,
        timestamp: new Date().toISOString(),
      },
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!icpData) {
    return (
      <div className="text-center py-12">
        <PresentationChartLineIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No ICP Analysis Available</h3>
        <p className="text-gray-600 mb-6">
          Create your first ICP analysis to see detailed insights about your ideal customers.
        </p>
        <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
          Start Analysis
        </button>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 75) return 'text-blue-600 bg-blue-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getScoreText = (score: number) => {
    if (score >= 90) return 'Excellent Fit';
    if (score >= 75) return 'Good Fit';
    if (score >= 60) return 'Moderate Fit';
    return 'Poor Fit';
  };

  return (
    <div className="space-y-6">
      {/* Header with export */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">ICP Analysis Results</h2>
          <p className="text-gray-600 mt-1">
            Generated on {new Date(icpData.lastGenerated).toLocaleDateString()}
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => handleExport('pdf')}
            disabled={exportData.isPending}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            <span>Export PDF</span>
          </button>
          <button
            onClick={() => handleExport('excel')}
            disabled={exportData.isPending}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* Customer Segments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {icpData.segments?.map((segment, index) => (
          <motion.div
            key={segment.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{segment.name}</h3>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(segment.score)}`}>
                {segment.score}/100 - {getScoreText(segment.score)}
              </div>
            </div>

            {/* Score visualization */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Fit Score</span>
                <span>{segment.score}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${segment.score}%` }}
                  transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                  className={`h-3 rounded-full ${
                    segment.score >= 90 ? 'bg-green-500' :
                    segment.score >= 75 ? 'bg-blue-500' :
                    segment.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                />
              </div>
            </div>

            {/* Criteria */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                <ChartBarIcon className="h-4 w-4 mr-2" />
                Key Criteria
              </h4>
              <ul className="space-y-1">
                {segment.criteria?.map((criterion, idx) => (
                  <li key={idx} className="text-sm text-gray-600 flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    {criterion}
                  </li>
                ))}
              </ul>
            </div>

            {/* Opportunities */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                <TrophyIcon className="h-4 w-4 mr-2 text-green-600" />
                Opportunities
              </h4>
              <ul className="space-y-1">
                {segment.opportunities?.map((opportunity, idx) => (
                  <li key={idx} className="text-sm text-gray-600 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    {opportunity}
                  </li>
                ))}
              </ul>
            </div>

            {/* Challenges */}
            {segment.challenges?.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                  <ExclamationTriangleIcon className="h-4 w-4 mr-2 text-yellow-600" />
                  Challenges
                </h4>
                <ul className="space-y-1">
                  {segment.challenges.map((challenge, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-center">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                      {challenge}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Key Indicators & Red Flags */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrophyIcon className="h-5 w-5 mr-2 text-green-600" />
            Key Success Indicators
          </h3>
          <ul className="space-y-2">
            {icpData.keyIndicators?.map((indicator, idx) => (
              <li key={idx} className="text-sm text-gray-600 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                {indicator}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 mr-2 text-red-600" />
            Red Flags to Avoid
          </h3>
          <ul className="space-y-2">
            {icpData.redFlags?.map((flag, idx) => (
              <li key={idx} className="text-sm text-gray-600 flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                {flag}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Rating Criteria */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <ChartBarIcon className="h-5 w-5 mr-2 text-blue-600" />
          Rating Criteria & Weights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {icpData.ratingCriteria?.map((criteria, idx) => (
            <div key={idx} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-900">{criteria.name}</h4>
                <span className="text-sm font-medium text-blue-600">{criteria.weight}%</span>
              </div>
              <p className="text-sm text-gray-600">{criteria.description}</p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${criteria.weight}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* AI Recommendations */}
      {icpData.recommendations?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <SparklesIcon className="h-5 w-5 mr-2 text-indigo-600" />
            AI-Powered Recommendations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {icpData.recommendations.map((recommendation, idx) => (
              <div key={idx} className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm text-gray-700">{recommendation}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}