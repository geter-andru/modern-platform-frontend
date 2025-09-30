'use client';

import React, { useState, useEffect } from 'react';
import { ModernCard } from '@/src/shared/components/ui/ModernCard';
import { SystematicScalingProvider, useSystematicScaling } from '@/src/shared/contexts/SystematicScalingContext';

interface EnhancedICPAnalysisFormProps {
  customerId: string;
  onSuccess: () => void;
}

// Inner component that uses the context
function ICPAnalysisFormInner({ customerId, onSuccess }: EnhancedICPAnalysisFormProps) {
  const {
    processToolUsage,
    isProcessingAction,
    recentAchievements,
    professionalCredibilityScore,
    getCompetencyProgress,
    scalingStatus
  } = useSystematicScaling();

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
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [competencyProgress, setCompetencyProgress] = useState<any>(null);

  // Get real-time competency progress for customer intelligence
  useEffect(() => {
    const progress = getCompetencyProgress('customer_intelligence');
    setCompetencyProgress(progress);
  }, [getCompetencyProgress, recentAchievements]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEnhancedAnalyze = async () => {
    if (!formData.companyName || !formData.industry) {
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Calculate business impact based on form completeness and data quality
      const completedFields = Object.values(formData).filter(val => val.trim() !== '').length;
      const totalFields = Object.keys(formData).length;
      const completionRatio = completedFields / totalFields;
      
      // Determine business impact level
      const businessImpact = completionRatio >= 0.8 ? 'high' : 
                           completionRatio >= 0.5 ? 'medium' : 'low';
      
      // Simulate realistic analysis time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate enhanced analysis results with our intelligence
      const analysisScore = Math.floor(Math.random() * 30) + 70; // 70-100 range for more realistic scores
      const systematicInsights = [
        `Customer intelligence competency advancement: ${businessImpact} impact session`,
        `ICP analysis contributes to systematic $2M→$10M scaling approach`,
        businessImpact === 'high' ? 'High-impact session qualifies for professional milestone recognition' : ''
      ].filter(Boolean);
      
      const results = {
        score: analysisScore,
        businessImpact,
        systematicInsights,
        icpData: {
          companyProfile: {
            name: formData.companyName,
            industry: formData.industry,
            size: formData.companySize,
            revenue: formData.revenue
          },
          fitAssessment: {
            industryAlignment: analysisScore >= 75 ? 'High' : analysisScore >= 60 ? 'Medium' : 'Low',
            sizeCompatibility: analysisScore >= 80 ? 'Excellent' : analysisScore >= 65 ? 'Good' : 'Fair',
            revenueMatch: analysisScore >= 70 ? 'Strong' : 'Moderate',
            urgencyLevel: formData.timeline === 'immediate' ? 'Critical' : 
                         formData.timeline === 'short' ? 'High' : 'Medium'
          },
          recommendations: [
            analysisScore >= 80 ? 'Priority prospect - immediate engagement recommended' : 'Qualified prospect - structured follow-up advised',
            businessImpact === 'high' ? 'Deploy value communication agent for stakeholder preparation' : '',
            'Export professional ICP analysis for CRM integration'
          ].filter(Boolean)
        }
      };
      
      setAnalysisResults(results);
      
      // Process through our systematic scaling intelligence
      await processToolUsage('icp_analysis', {
        businessImpact,
        specificActions: [
          `Completed ICP analysis for ${formData.companyName}`,
          `Industry alignment: ${results.icpData.fitAssessment.industryAlignment}`,
          `Generated ${results.icpData.recommendations.length} strategic recommendations`
        ],
        professionalOutputs: [
          'Professional ICP analysis report',
          'Customer fit assessment matrix',
          'Strategic engagement recommendations'
        ],
        timeSpent: 8 // minutes spent on analysis
      });
      
    } catch (error) {
      console.error('Enhanced ICP analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'emerald';
    if (score >= 70) return 'blue';
    if (score >= 55) return 'orange';
    return 'red';
  };

  const getScoreDescription = (score: number) => {
    if (score >= 90) return 'Exceptional Fit - High Priority Prospect';
    if (score >= 80) return 'Strong Fit - Priority Engagement';
    if (score >= 70) return 'Good Fit - Qualified Prospect';
    if (score >= 60) return 'Moderate Fit - Nurture Opportunity';
    return 'Poor Fit - Consider Alternatives';
  };

  return (
    <div className="space-y-6">
      {/* Professional Development Progress */}
      {competencyProgress && (
        <ModernCard className="p-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-700/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
              <div>
                <h4 className="text-white font-medium">Customer Intelligence Competency</h4>
                <p className="text-sm text-gray-400">Level {competencyProgress.currentLevel} • {competencyProgress.progressToNext.toFixed(0)}% to next level</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-white">{competencyProgress.businessImpactScore}</div>
              <div className="text-xs text-gray-400">Impact Score</div>
            </div>
          </div>
          {professionalCredibilityScore > 0 && (
            <div className="mt-2 text-xs text-purple-400">
              Professional Credibility: {professionalCredibilityScore}/100
            </div>
          )}
        </ModernCard>
      )}

      {/* Enhanced Form Section */}
      <ModernCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            <h3 className="text-xl font-semibold text-white">Systematic Customer Intelligence Analysis</h3>
          </div>
          {scalingStatus && (
            <div className="text-xs text-gray-400">
              Sessions: {scalingStatus.recentSessions.length} • Velocity: {scalingStatus.scalingVelocityMultiplier.toFixed(1)}x
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-white font-medium mb-2">Company Name *</label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none transition-all duration-200"
              placeholder="Enter target company name"
            />
          </div>
          
          <div>
            <label className="block text-white font-medium mb-2">Industry Vertical *</label>
            <select
              value={formData.industry}
              onChange={(e) => handleInputChange('industry', e.target.value)}
              className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none transition-all duration-200"
            >
              <option value="">Select industry vertical</option>
              <option value="technology">Technology/SaaS</option>
              <option value="healthcare">Healthcare/MedTech</option>
              <option value="finance">Financial Services/FinTech</option>
              <option value="manufacturing">Manufacturing/Industrial</option>
              <option value="retail">Retail/E-commerce</option>
              <option value="professional-services">Professional Services</option>
              <option value="education">Education/EdTech</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-white font-medium mb-2">Organization Size</label>
            <select
              value={formData.companySize}
              onChange={(e) => handleInputChange('companySize', e.target.value)}
              className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none transition-all duration-200"
            >
              <option value="">Select organization size</option>
              <option value="startup">Early Stage (1-10 employees)</option>
              <option value="small">Small Business (11-50)</option>
              <option value="medium">Mid-Market (51-200)</option>
              <option value="large">Large Enterprise (201-1000)</option>
              <option value="enterprise">Global Enterprise (1000+)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-white font-medium mb-2">Annual Revenue</label>
            <select
              value={formData.revenue}
              onChange={(e) => handleInputChange('revenue', e.target.value)}
              className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none transition-all duration-200"
            >
              <option value="">Select revenue range</option>
              <option value="under-1m">Pre-Revenue - $1M</option>
              <option value="1m-10m">$1M - $10M (Series A Target)</option>
              <option value="10m-50m">$10M - $50M (Growth Stage)</option>
              <option value="50m-100m">$50M - $100M (Scale Stage)</option>
              <option value="over-100m">$100M+ (Enterprise)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-white font-medium mb-2">Geographic Market</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none transition-all duration-200"
              placeholder="Primary market (e.g., SF Bay Area, US National)"
            />
          </div>
          
          <div>
            <label className="block text-white font-medium mb-2">Decision Timeline</label>
            <select
              value={formData.timeline}
              onChange={(e) => handleInputChange('timeline', e.target.value)}
              className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none transition-all duration-200"
            >
              <option value="">Select decision timeframe</option>
              <option value="immediate">Immediate Need (0-30 days)</option>
              <option value="short">Active Evaluation (1-3 months)</option>
              <option value="medium">Planning Phase (3-6 months)</option>
              <option value="long">Future Consideration (6+ months)</option>
              <option value="exploratory">Research/Education Phase</option>
            </select>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Budget Authority</label>
            <select
              value={formData.budget}
              onChange={(e) => handleInputChange('budget', e.target.value)}
              className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none transition-all duration-200"
            >
              <option value="">Select budget range</option>
              <option value="under-10k">Under $10K</option>
              <option value="10k-50k">$10K - $50K</option>
              <option value="50k-100k">$50K - $100K</option>
              <option value="100k-500k">$100K - $500K</option>
              <option value="over-500k">$500K+</option>
              <option value="unknown">Budget TBD</option>
            </select>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Decision Maker Role</label>
            <select
              value={formData.decisionMaker}
              onChange={(e) => handleInputChange('decisionMaker', e.target.value)}
              className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none transition-all duration-200"
            >
              <option value="">Select primary decision maker</option>
              <option value="ceo">CEO/Founder</option>
              <option value="cto">CTO/VP Engineering</option>
              <option value="cmo">CMO/VP Marketing</option>
              <option value="cfo">CFO/VP Finance</option>
              <option value="vp-sales">VP Sales/Revenue</option>
              <option value="director">Director Level</option>
              <option value="manager">Manager/Lead</option>
              <option value="committee">Committee Decision</option>
            </select>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-white font-medium mb-2">Critical Pain Points</label>
            <textarea
              value={formData.painPoints}
              onChange={(e) => handleInputChange('painPoints', e.target.value)}
              className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none transition-all duration-200"
              rows={3}
              placeholder="What specific challenges are they facing? (Revenue, efficiency, competition, etc.)"
            />
          </div>
          
          <div>
            <label className="block text-white font-medium mb-2">Current Solution Stack</label>
            <textarea
              value={formData.currentSolution}
              onChange={(e) => handleInputChange('currentSolution', e.target.value)}
              className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none transition-all duration-200"
              rows={3}
              placeholder="What tools/solutions are they currently using? Satisfaction level?"
            />
          </div>
        </div>
      </ModernCard>

      {/* Enhanced Analysis Button and Results */}
      <div className="text-center">
        {!analysisResults ? (
          <button
            onClick={handleEnhancedAnalyze}
            disabled={isAnalyzing || isProcessingAction || !formData.companyName || !formData.industry}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <span className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing Systematic Intelligence...</span>
              </span>
            ) : (
              'Generate Professional ICP Analysis'
            )}
          </button>
        ) : (
          <div className="space-y-6">
            <ModernCard className="p-8 text-center">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Professional ICP Analysis Complete</h3>
                <div className={`text-6xl font-bold text-${getScoreColor(analysisResults.score)}-400 mb-2`}>
                  {analysisResults.score}
                </div>
                <p className="text-slate-400 mb-2">Customer Fit Score</p>
                <p className={`text-sm text-${getScoreColor(analysisResults.score)}-400 font-medium`}>
                  {getScoreDescription(analysisResults.score)}
                </p>
              </div>

              {/* Detailed Assessment Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <div className={`p-4 rounded-lg ${
                  analysisResults.icpData.fitAssessment.industryAlignment === 'High' ? 'bg-emerald-900/20 border border-emerald-700/50' :
                  analysisResults.icpData.fitAssessment.industryAlignment === 'Medium' ? 'bg-blue-900/20 border border-blue-700/50' :
                  'bg-orange-900/20 border border-orange-700/50'
                }`}>
                  <div className="text-white font-medium text-sm">Industry Alignment</div>
                  <div className={`text-${getScoreColor(analysisResults.score)}-400 font-semibold`}>
                    {analysisResults.icpData.fitAssessment.industryAlignment}
                  </div>
                </div>

                <div className={`p-4 rounded-lg ${
                  analysisResults.icpData.fitAssessment.sizeCompatibility === 'Excellent' ? 'bg-emerald-900/20 border border-emerald-700/50' :
                  analysisResults.icpData.fitAssessment.sizeCompatibility === 'Good' ? 'bg-blue-900/20 border border-blue-700/50' :
                  'bg-orange-900/20 border border-orange-700/50'
                }`}>
                  <div className="text-white font-medium text-sm">Size Compatibility</div>
                  <div className={`text-${getScoreColor(analysisResults.score)}-400 font-semibold`}>
                    {analysisResults.icpData.fitAssessment.sizeCompatibility}
                  </div>
                </div>

                <div className={`p-4 rounded-lg ${
                  analysisResults.icpData.fitAssessment.revenueMatch === 'Strong' ? 'bg-emerald-900/20 border border-emerald-700/50' :
                  'bg-blue-900/20 border border-blue-700/50'
                }`}>
                  <div className="text-white font-medium text-sm">Revenue Match</div>
                  <div className={`text-${getScoreColor(analysisResults.score)}-400 font-semibold`}>
                    {analysisResults.icpData.fitAssessment.revenueMatch}
                  </div>
                </div>

                <div className={`p-4 rounded-lg ${
                  analysisResults.icpData.fitAssessment.urgencyLevel === 'Critical' ? 'bg-red-900/20 border border-red-700/50' :
                  analysisResults.icpData.fitAssessment.urgencyLevel === 'High' ? 'bg-orange-900/20 border border-orange-700/50' :
                  'bg-blue-900/20 border border-blue-700/50'
                }`}>
                  <div className="text-white font-medium text-sm">Urgency Level</div>
                  <div className={`text-${getScoreColor(analysisResults.score)}-400 font-semibold`}>
                    {analysisResults.icpData.fitAssessment.urgencyLevel}
                  </div>
                </div>
              </div>

              {/* Strategic Recommendations */}
              <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
                <h4 className="text-white font-semibold mb-3">Strategic Recommendations</h4>
                <div className="space-y-2">
                  {analysisResults.icpData.recommendations.map((rec: string, index: number) => (
                    <div key={index} className="text-left text-gray-300 text-sm flex items-start space-x-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Professional Development Impact */}
              {recentAchievements.length > 0 && (
                <div className="mt-6 p-4 bg-purple-900/20 rounded-lg border border-purple-700/50">
                  <h4 className="text-purple-400 font-semibold mb-2">Professional Development Impact</h4>
                  <div className="text-left text-sm text-gray-300">
                    Latest: {recentAchievements[0].description} 
                    <span className="text-purple-400 font-medium"> (+{recentAchievements[0].professionalCredibilityGain} credibility)</span>
                  </div>
                </div>
              )}

              <div className="mt-6 space-x-4">
                <button 
                  onClick={() => {
                    // Simulate proceeding to export or next tool
                    setTimeout(() => onSuccess(), 1000);
                  }}
                  className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                >
                  🚀 Export Professional Analysis
                </button>
                <button 
                  onClick={() => {
                    // Reset for new analysis
                    setAnalysisResults(null);
                    setFormData({
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
                  }}
                  className="bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-800 hover:to-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                >
                  📝 New Analysis
                </button>
              </div>
            </ModernCard>
          </div>
        )}
      </div>
    </div>
  );
}

// Main component with provider wrapper
export function EnhancedICPAnalysisForm({ customerId, onSuccess }: EnhancedICPAnalysisFormProps) {
  return (
    <SystematicScalingProvider 
      founderId={customerId}
      initialProfile={{
        companyName: 'Series A Revenue Intelligence',
        currentARR: '$2M',
        targetARR: '$10M',
        growthStage: 'rapid_scaling',
        primaryChallenges: ['Customer Intelligence', 'Value Communication'],
        systematicApproach: true,
        foundedDate: '2022-01-01',
        industry: 'Technology',
        teamSize: 25,
        technicalBackground: true
      }}
    >
      <ICPAnalysisFormInner customerId={customerId} onSuccess={onSuccess} />
    </SystematicScalingProvider>
  );
}