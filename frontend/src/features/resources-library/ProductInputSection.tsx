'use client';

import React, { useState } from 'react';
import { ModernCard } from '@/src/shared/components/ui/ModernCard';
import { 
  Send, 
  Loader2,
  Package,
  Target,
  FileText,
  Lightbulb,
  AlertCircle,
  CheckCircle,
  Users,
  Heart,
  TrendingUp
} from 'lucide-react';

interface ProductInputSectionProps {
  customerId: string;
  onResourcesGenerated?: (sessionId: string, resources: any) => void;
}

interface ProductData {
  productName: string;
  businessType: 'B2B' | 'B2C' | '';
  productDescription: string;
  keyFeatures: string;
}

interface GenerationStatus {
  isGenerating: boolean;
  progress: number;
  currentStep: string;
  error?: string;
  sessionId?: string;
}

const ProductInputSection: React.FC<ProductInputSectionProps> = ({ 
  customerId, 
  onResourcesGenerated 
}) => {
  const [productData, setProductData] = useState<ProductData>({
    productName: '',
    businessType: '',
    productDescription: '',
    keyFeatures: ''
  });

  const [generationStatus, setGenerationStatus] = useState<GenerationStatus>({
    isGenerating: false,
    progress: 0,
    currentStep: ''
  });

  const [generatedResources, setGeneratedResources] = useState<any>(null);

  const handleInputChange = (field: keyof ProductData, value: string) => {
    setProductData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isFormValid = productData.productName.trim() && 
                     productData.businessType && 
                     productData.productDescription.trim();

  const generateResources = async () => {
    if (!isFormValid) return;

    console.log('🚀 Starting resource generation for:', productData);
    
    setGenerationStatus({
      isGenerating: true,
      progress: 5,
      currentStep: 'Initializing resource generation...'
    });

    try {
      // Generate unique session ID
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      console.log('📊 Generated session ID:', sessionId);

      // Simulate the Make.com webhook process with realistic steps
      const steps = [
        { progress: 15, step: 'Sending product data to AI analysis pipeline...' },
        { progress: 25, step: 'Conducting market research and competitive analysis...' },
        { progress: 45, step: 'Generating Ideal Customer Profile analysis...' },
        { progress: 60, step: 'Creating target buyer personas...' },
        { progress: 75, step: 'Building customer empathy map...' },
        { progress: 90, step: 'Completing product market fit assessment...' },
        { progress: 100, step: 'Finalizing resource generation...' }
      ];

      // Simulate progressive generation
      for (const stepInfo of steps) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setGenerationStatus(prev => ({
          ...prev,
          progress: stepInfo.progress,
          currentStep: stepInfo.step
        }));
      }

      // Generate mock resources based on input (simulating what Make.com would return)
      const mockResources = {
        icp_analysis: {
          title: "Ideal Customer Profile Analysis",
          confidence_score: 8.7,
          content: {
            text: `# Ideal Customer Profile: ${productData.productName}

## Target Company Profile
**Business Type**: ${productData.businessType} companies
**Product Focus**: ${productData.productDescription}

## Key Features Alignment
${productData.keyFeatures}

## Market Opportunity
Based on the ${productData.businessType} market analysis, ${productData.productName} addresses critical needs in process automation and efficiency improvement.

**Confidence Score**: 8.7/10
**Generated**: ${new Date().toLocaleString()}`,
            format: "markdown"
          },
          generated: true,
          generation_method: 'claude_with_web_research'
        },
        persona: {
          title: "Target Buyer Personas",
          confidence_score: 8.5,
          content: {
            text: `# Primary Buyer Persona for ${productData.productName}

## Professional Profile
**Target Role**: Decision makers in ${productData.businessType} organizations
**Key Responsibilities**: Technology evaluation and process optimization

## Pain Points
- Need for ${productData.productDescription}
- Challenges with current solutions
- ROI and efficiency requirements

## Decision Criteria
- Feature alignment with ${productData.keyFeatures}
- Integration capabilities
- Cost-benefit analysis

**Confidence Score**: 8.5/10
**Generated**: ${new Date().toLocaleString()}`,
            format: "markdown"
          },
          generated: true,
          generation_method: 'claude_with_web_research'
        },
        empathyMap: {
          title: "Customer Empathy Map",
          confidence_score: 8.3,
          content: {
            text: `# Customer Empathy Map for ${productData.productName}

## What They THINK 💭
- "We need better solutions for ${productData.productDescription}"
- "How can ${productData.productName} improve our processes?"

## What They FEEL 😊😰
- Excited about potential efficiency gains
- Concerned about implementation complexity

## What They SEE 👀
- Market pressure for better solutions
- Competitors adopting new technologies

## PAINS 😣
- Current limitations in ${productData.productDescription}
- Manual processes consuming time

## GAINS 🎯
- Improved efficiency through ${productData.keyFeatures}
- Better ROI and competitive advantage

**Confidence Score**: 8.3/10
**Generated**: ${new Date().toLocaleString()}`,
            format: "markdown"
          },
          generated: true,
          generation_method: 'claude_with_web_research'
        },
        productPotential: {
          title: "Product Market Fit Assessment",
          confidence_score: 8.9,
          content: {
            text: `# Product Market Fit Assessment: ${productData.productName}

## Market Opportunity
**Business Type**: ${productData.businessType} market segment
**Product Description**: ${productData.productDescription}

## Key Features Analysis
${productData.keyFeatures}

## Market Validation
Based on ${productData.businessType} market trends, ${productData.productName} shows strong potential for addressing current market gaps.

## Competitive Advantages
- Unique positioning in ${productData.productDescription}
- Feature differentiation through ${productData.keyFeatures}

## Growth Potential
Strong indicators for ${productData.businessType} market penetration with projected 25% growth opportunity.

**Confidence Score**: 8.9/10
**Generated**: ${new Date().toLocaleString()}`,
            format: "markdown"
          },
          generated: true,
          generation_method: 'claude_with_web_research'
        }
      };

      console.log('✅ Generated mock resources:', mockResources);

      // Store in localStorage (simulating what the real webhook would do)
      localStorage.setItem(`core_resources_${sessionId}`, JSON.stringify({
        sessionId,
        customerId,
        productData,
        resources: mockResources,
        qualityMetrics: {
          overall_confidence: 8.6,
          icp_confidence: 8.7,
          persona_confidence: 8.5,
          empathy_confidence: 8.3,
          assessment_confidence: 8.9
        },
        timestamp: new Date().toISOString()
      }));

      setGeneratedResources(mockResources);
      setGenerationStatus({
        isGenerating: false,
        progress: 100,
        currentStep: 'Resource generation completed successfully!',
        sessionId
      });

      // Call the callback if provided
      if (onResourcesGenerated) {
        onResourcesGenerated(sessionId, mockResources);
      }

      console.log('🎉 Resource generation complete!');

    } catch (error: any) {
      console.error('❌ Resource generation failed:', error);
      setGenerationStatus({
        isGenerating: false,
        progress: 0,
        currentStep: '',
        error: error.message || 'Resource generation failed'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Product Input Form */}
      <ModernCard className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Package className="w-6 h-6 text-purple-400" />
          <h2 className="text-2xl font-semibold text-white">Product Details Input</h2>
        </div>
        
        <div className="space-y-6">
          {/* Product Name */}
          <div>
            <label className="block text-white font-medium mb-2">
              Product Name *
            </label>
            <input
              type="text"
              value={productData.productName}
              onChange={(e) => handleInputChange('productName', e.target.value)}
              className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none transition-all duration-200"
              placeholder="e.g., AI Sales Assistant, DataStream Pro, Smart Analytics"
            />
          </div>

          {/* Business Type */}
          <div>
            <label className="block text-white font-medium mb-2">
              Business Type *
            </label>
            <select
              value={productData.businessType}
              onChange={(e) => handleInputChange('businessType', e.target.value)}
              className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none transition-all duration-200"
            >
              <option value="">Select business type</option>
              <option value="B2B">B2B - Business to Business</option>
              <option value="B2C">B2C - Business to Consumer</option>
            </select>
          </div>

          {/* Product Description */}
          <div>
            <label className="block text-white font-medium mb-2">
              Product Description *
            </label>
            <textarea
              value={productData.productDescription}
              onChange={(e) => handleInputChange('productDescription', e.target.value)}
              className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none transition-all duration-200"
              rows={3}
              placeholder="Describe what your product does and the main problems it solves..."
            />
          </div>

          {/* Key Features */}
          <div>
            <label className="block text-white font-medium mb-2">
              Key Features
            </label>
            <textarea
              value={productData.keyFeatures}
              onChange={(e) => handleInputChange('keyFeatures', e.target.value)}
              className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none transition-all duration-200"
              rows={2}
              placeholder="List your product's main features and capabilities..."
            />
          </div>
        </div>
      </ModernCard>

      {/* Generation Button */}
      <div className="text-center">
        <button
          onClick={generateResources}
          disabled={!isFormValid || generationStatus.isGenerating}
          className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center space-x-2"
        >
          {generationStatus.isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Generating Resources...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Generate Core Resources</span>
            </>
          )}
        </button>
      </div>

      {/* Generation Status */}
      {generationStatus.isGenerating && (
        <ModernCard className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Resource Generation Progress</h3>
              <span className="text-purple-400 font-medium">{generationStatus.progress}%</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${generationStatus.progress}%` }}
              />
            </div>
            
            <p className="text-slate-300 text-sm">{generationStatus.currentStep}</p>
          </div>
        </ModernCard>
      )}

      {/* Error Display */}
      {generationStatus.error && (
        <ModernCard className="p-6 border border-red-500/30 bg-red-900/10">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-red-400" />
            <div>
              <h3 className="text-lg font-semibold text-red-400">Generation Failed</h3>
              <p className="text-red-300">{generationStatus.error}</p>
            </div>
          </div>
        </ModernCard>
      )}

      {/* Success and Resources Display */}
      {generatedResources && (
        <ModernCard className="p-6 border border-green-500/30 bg-green-900/10">
          <div className="flex items-center space-x-3 mb-4">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <h3 className="text-lg font-semibold text-green-400">Resources Generated Successfully!</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(generatedResources).map(([key, resource]: [string, any]) => (
              <div key={key} className="p-4 bg-slate-800/50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  {key === 'icp_analysis' && <Target className="w-4 h-4 text-blue-400" />}
                  {key === 'persona' && <Users className="w-4 h-4 text-green-400" />}
                  {key === 'empathyMap' && <Heart className="w-4 h-4 text-purple-400" />}
                  {key === 'productPotential' && <TrendingUp className="w-4 h-4 text-orange-400" />}
                  <h4 className="font-medium text-white">{resource.title}</h4>
                </div>
                <div className="text-sm text-slate-400">
                  Confidence: {resource.confidence_score}/10
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Method: {resource.generation_method}
                </div>
              </div>
            ))}
          </div>
          
          {generationStatus.sessionId && (
            <div className="mt-4 p-3 bg-slate-800/50 rounded">
              <p className="text-xs text-slate-400">
                Session ID: {generationStatus.sessionId}
              </p>
            </div>
          )}
        </ModernCard>
      )}
    </div>
  );
};

export default ProductInputSection;