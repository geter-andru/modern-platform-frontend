'use client';

import React, { useState } from 'react';
import { ModernCard } from '@/src/shared/components/ui/ModernCard';

interface ICPAnalysisFormProps {
  customerId: string;
  onSuccess: () => void;
}

export function ICPAnalysisForm({ customerId, onSuccess }: ICPAnalysisFormProps) {
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    companySize: '',
    revenue: '',
    location: '',
    painPoints: '',
    currentSolution: '',
    budget: '',
    decisionMaker: '',
    timeline: ''
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisScore, setAnalysisScore] = useState<number | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAnalyze = async () => {
    if (!formData.companyName || !formData.industry) {
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const score = Math.floor(Math.random() * 40) + 60; // 60-100 range
      setAnalysisScore(score);
      setIsAnalyzing(false);
      
      // Auto-proceed after showing score
      setTimeout(() => {
        onSuccess();
      }, 2000);
    }, 3000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'emerald';
    if (score >= 70) return 'blue';
    if (score >= 55) return 'orange';
    return 'red';
  };

  return (
    <div className="space-y-6">
      {/* Form Section */}
      <ModernCard className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          <h3 className="text-xl font-semibold text-white">Company Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-white font-medium mb-2">Company Name *</label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
              placeholder="Enter company name"
            />
          </div>
          
          <div>
            <label className="block text-white font-medium mb-2">Industry *</label>
            <select
              value={formData.industry}
              onChange={(e) => handleInputChange('industry', e.target.value)}
              className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
            >
              <option value="">Select industry</option>
              <option value="technology">Technology</option>
              <option value="healthcare">Healthcare</option>
              <option value="finance">Financial Services</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="retail">Retail</option>
              <option value="professional-services">Professional Services</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-white font-medium mb-2">Company Size</label>
            <select
              value={formData.companySize}
              onChange={(e) => handleInputChange('companySize', e.target.value)}
              className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
            >
              <option value="">Select size</option>
              <option value="startup">Startup (1-10)</option>
              <option value="small">Small (11-50)</option>
              <option value="medium">Medium (51-200)</option>
              <option value="large">Large (201-1000)</option>
              <option value="enterprise">Enterprise (1000+)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-white font-medium mb-2">Annual Revenue</label>
            <select
              value={formData.revenue}
              onChange={(e) => handleInputChange('revenue', e.target.value)}
              className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
            >
              <option value="">Select revenue range</option>
              <option value="under-1m">Under $1M</option>
              <option value="1m-10m">$1M - $10M</option>
              <option value="10m-50m">$10M - $50M</option>
              <option value="50m-100m">$50M - $100M</option>
              <option value="over-100m">Over $100M</option>
            </select>
          </div>
          
          <div>
            <label className="block text-white font-medium mb-2">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
              placeholder="City, State/Country"
            />
          </div>
          
          <div>
            <label className="block text-white font-medium mb-2">Decision Timeline</label>
            <select
              value={formData.timeline}
              onChange={(e) => handleInputChange('timeline', e.target.value)}
              className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
            >
              <option value="">Select timeline</option>
              <option value="immediate">Immediate (0-30 days)</option>
              <option value="short">Short term (1-3 months)</option>
              <option value="medium">Medium term (3-6 months)</option>
              <option value="long">Long term (6+ months)</option>
              <option value="exploratory">Just exploring</option>
            </select>
          </div>
        </div>
        
        <div className="mt-6">
          <label className="block text-white font-medium mb-2">Key Pain Points</label>
          <textarea
            value={formData.painPoints}
            onChange={(e) => handleInputChange('painPoints', e.target.value)}
            className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
            rows={3}
            placeholder="What challenges is this company facing?"
          />
        </div>
        
        <div className="mt-6">
          <label className="block text-white font-medium mb-2">Current Solution</label>
          <input
            type="text"
            value={formData.currentSolution}
            onChange={(e) => handleInputChange('currentSolution', e.target.value)}
            className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
            placeholder="What are they currently using?"
          />
        </div>
      </ModernCard>

      {/* Analysis Button and Results */}
      <div className="text-center">
        {!analysisScore ? (
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !formData.companyName || !formData.industry}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <span className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Analyzing Company...</span>
              </span>
            ) : (
              'Analyze Prospect Fit'
            )}
          </button>
        ) : (
          <ModernCard className="p-8 text-center">
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-white mb-2">Analysis Complete!</h3>
              <div className={`text-6xl font-bold text-${getScoreColor(analysisScore)}-400 mb-4`}>
                {analysisScore}
              </div>
              <p className="text-slate-400">Prospect Fit Score</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className={`p-4 rounded-lg ${
                analysisScore >= 85 ? 'bg-emerald-900/20 border border-emerald-700/50' :
                analysisScore >= 70 ? 'bg-blue-900/20 border border-blue-700/50' :
                analysisScore >= 55 ? 'bg-orange-900/20 border border-orange-700/50' :
                'bg-red-900/20 border border-red-700/50'
              }`}>
                <div className="text-white font-medium">Company Size</div>
                <div className={`text-${getScoreColor(analysisScore)}-400 font-semibold`}>
                  {analysisScore >= 70 ? 'Good Fit' : analysisScore >= 55 ? 'Moderate Fit' : 'Poor Fit'}
                </div>
              </div>
              
              <div className={`p-4 rounded-lg ${
                analysisScore >= 85 ? 'bg-emerald-900/20 border border-emerald-700/50' :
                analysisScore >= 70 ? 'bg-blue-900/20 border border-blue-700/50' :
                analysisScore >= 55 ? 'bg-orange-900/20 border border-orange-700/50' :
                'bg-red-900/20 border border-red-700/50'
              }`}>
                <div className="text-white font-medium">Industry</div>
                <div className={`text-${getScoreColor(analysisScore)}-400 font-semibold`}>
                  {analysisScore >= 70 ? 'Target Market' : analysisScore >= 55 ? 'Adjacent Market' : 'Non-target'}
                </div>
              </div>
              
              <div className={`p-4 rounded-lg ${
                analysisScore >= 85 ? 'bg-emerald-900/20 border border-emerald-700/50' :
                analysisScore >= 70 ? 'bg-blue-900/20 border border-blue-700/50' :
                analysisScore >= 55 ? 'bg-orange-900/20 border border-orange-700/50' :
                'bg-red-900/20 border border-red-700/50'
              }`}>
                <div className="text-white font-medium">Timeline</div>
                <div className={`text-${getScoreColor(analysisScore)}-400 font-semibold`}>
                  {analysisScore >= 70 ? 'Active Buyer' : analysisScore >= 55 ? 'Future Buyer' : 'Not Ready'}
                </div>
              </div>
            </div>
            
            <p className="text-slate-400 mt-4">Proceeding to results view...</p>
          </ModernCard>
        )}
      </div>
    </div>
  );
}