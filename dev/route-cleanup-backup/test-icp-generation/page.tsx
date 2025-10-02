'use client';

import React, { useState } from 'react';
import { ProductInputSection } from '@/src/features/resources-library';
import { ModernCard } from '@/src/shared/components/ui';
import { 
  Target,
  Users,
  Heart,
  TrendingUp,
  FileText,
  Download,
  Eye,
  ArrowLeft
} from 'lucide-react';

const TestICPGenerationPage: React.FC = () => {
  const [generatedResources, setGeneratedResources] = useState<any>(null);
  const [sessionId, setSessionId] = useState<string>('');

  const handleResourcesGenerated = (newSessionId: string, resources: any) => {
    console.log('📋 Resources received from ProductInputSection:', { newSessionId, resources });
    setSessionId(newSessionId);
    setGeneratedResources(resources);
  };

  const viewResource = (resource: any) => {
    // Create a simple modal or new window to view the full content
    const newWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes');
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>${resource.title}</title>
            <style>
              body { 
                font-family: system-ui, -apple-system, sans-serif; 
                max-width: 800px; 
                margin: 40px auto; 
                padding: 20px; 
                background: #1a1a1a; 
                color: #e0e0e0; 
              }
              pre { 
                background: #2a2a2a; 
                padding: 20px; 
                border-radius: 8px; 
                overflow-x: auto; 
                white-space: pre-wrap;
              }
              .confidence {
                background: #4c1d95;
                color: white;
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: bold;
                margin: 10px 0;
                display: inline-block;
              }
            </style>
          </head>
          <body>
            <h1>${resource.title}</h1>
            <div class="confidence">Confidence: ${resource.confidence_score}/10</div>
            <pre>${resource.content.text}</pre>
          </body>
        </html>
      `);
      newWindow.document.close();
    }
  };

  const getResourceIcon = (key: string) => {
    switch (key) {
      case 'icp_analysis': return <Target className="w-5 h-5 text-blue-400" />;
      case 'persona': return <Users className="w-5 h-5 text-green-400" />;
      case 'empathyMap': return <Heart className="w-5 h-5 text-purple-400" />;
      case 'productPotential': return <TrendingUp className="w-5 h-5 text-orange-400" />;
      default: return <FileText className="w-5 h-5 text-gray-400" />;
    }
  };

  const getResourceColor = (key: string) => {
    switch (key) {
      case 'icp_analysis': return 'border-blue-500/30 bg-blue-900/10';
      case 'persona': return 'border-green-500/30 bg-green-900/10';
      case 'empathyMap': return 'border-purple-500/30 bg-purple-900/10';
      case 'productPotential': return 'border-orange-500/30 bg-orange-900/10';
      default: return 'border-gray-500/30 bg-gray-900/10';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Target className="w-8 h-8 text-purple-400" />
            <h1 className="text-3xl font-bold text-white">
              ICP Generation Test
            </h1>
          </div>
          <p className="text-slate-300 text-lg mb-2">
            Test the complete Product Details → Core Resources generation workflow
          </p>
          <p className="text-slate-400 text-sm">
            Enter product information to generate ICP Analysis, Buyer Personas, Empathy Map, and Market Assessment
          </p>
          
          <div className="mt-4">
            <button 
              onClick={() => window.history.back()}
              className="inline-flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Test Dashboard</span>
            </button>
          </div>
        </div>

        {/* Product Input Section */}
        <ProductInputSection
          customerId="test-customer-icp"
          onResourcesGenerated={handleResourcesGenerated}
        />

        {/* Generated Resources Display */}
        {generatedResources && (
          <div className="space-y-6">
            <ModernCard className="p-6">
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center space-x-3">
                <FileText className="w-6 h-6 text-purple-400" />
                <span>Generated Core Resources</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(generatedResources).map(([key, resource]: [string, any]) => (
                  <ModernCard key={key} className={`p-6 ${getResourceColor(key)} border`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {getResourceIcon(key)}
                        <div>
                          <h3 className="font-semibold text-white text-lg">
                            {resource.title}
                          </h3>
                          <p className="text-sm text-slate-400">
                            Confidence: {resource.confidence_score}/10
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-slate-300 text-sm mb-4 line-clamp-3">
                      {resource.content.text.substring(0, 200)}...
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => viewResource(resource)}
                        className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Full Content</span>
                      </button>
                    </div>
                    
                    <div className="mt-3 text-xs text-slate-500">
                      Method: {resource.generation_method}
                    </div>
                  </ModernCard>
                ))}
              </div>
              
              {sessionId && (
                <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Generation Details</h4>
                  <div className="text-sm text-slate-400 space-y-1">
                    <p><strong>Session ID:</strong> {sessionId}</p>
                    <p><strong>Generated:</strong> {new Date().toLocaleString()}</p>
                    <p><strong>Resources:</strong> {Object.keys(generatedResources).length} resources created</p>
                  </div>
                </div>
              )}
            </ModernCard>
          </div>
        )}

        {/* Instructions */}
        <ModernCard className="p-6 border border-yellow-500/30 bg-yellow-900/10">
          <h3 className="text-yellow-400 font-semibold mb-3">Testing Instructions</h3>
          <div className="text-yellow-200 text-sm space-y-2">
            <p><strong>1.</strong> Fill out the product details form above with your product information</p>
            <p><strong>2.</strong> Click "Generate Core Resources" to start the process</p>
            <p><strong>3.</strong> Watch the progress as it generates all 4 resources</p>
            <p><strong>4.</strong> Review the generated resources and click "View Full Content" to see details</p>
            <p><strong>Note:</strong> This is currently generating mock data. In production, this would call the real Make.com webhook.</p>
          </div>
        </ModernCard>
      </div>
    </div>
  );
};

export default TestICPGenerationPage;