'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AssessmentResultsWidget } from '@/src/features/assessment/components/AssessmentResultsWidget';
import { AssessmentErrorBoundary } from '@/src/features/assessment/components/AssessmentErrorBoundary';
import { ModernCircularProgress } from '@/src/shared/components/ui/ModernCircularProgress';

interface AssessmentData {
  results?: {
    overallScore: number;
    buyerScore: number;
    techScore: number;
    qualification: string;
  };
  userInfo?: {
    company: string;
    email: string;
    name?: string;
    role?: string;
  };
  generatedContent?: {
    buyerGap?: any;
    icp?: any;
    tbp?: any;
  };
  productInfo?: any;
  questionTimings?: any;
  challenges?: any;
  recommendations?: any;
  insights?: any;
  metadata?: {
    sessionId: string;
    createdAt: string;
    updatedAt: string;
    status: string;
  };
}

export default function AssessmentPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId');
  const userId = searchParams.get('userId');
  const source = searchParams.get('source');
  const synced = searchParams.get('synced');
  
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssessmentData = async () => {
      try {
        setLoading(true);
        setError(null);

               if (source === 'andru-assessment' && sessionId && userId) {
                 console.log('🔄 Loading assessment data from andru-assessment via data bridge...');
                 
                 // Use data bridge to get assessment data
                 const response = await fetch(`/api/bridge/assessment?sessionId=${sessionId}`);
                 const result = await response.json();
                 
                 if (result.success && result.data.assessment) {
                   const assessment = result.data.assessment;
                   
                   // Transform the data to match the expected format
                   const transformedData: AssessmentData = {
                     results: {
                       overallScore: assessment.fields?.['Overall Score'] || 0,
                       buyerScore: assessment.fields?.['Buyer Score'] || 0,
                       techScore: assessment.fields?.['Tech Score'] || 0,
                       qualification: assessment.fields?.['Qualification'] || 'Foundation'
                     },
                     userInfo: assessment.fields?.['User Info'] ? JSON.parse(assessment.fields['User Info']) : {
                       company: 'Your Company',
                       email: userId,
                       name: 'User',
                       role: 'Founder'
                     },
                     productInfo: assessment.fields?.['Product Info'] ? JSON.parse(assessment.fields['Product Info']) : {},
                     questionTimings: assessment.fields?.['Question Timings'] ? JSON.parse(assessment.fields['Question Timings']) : {},
                     generatedContent: assessment.fields?.['Generated Content'] ? JSON.parse(assessment.fields['Generated Content']) : {},
                     metadata: {
                       sessionId: sessionId,
                       createdAt: assessment.createdTime || new Date().toISOString(),
                       updatedAt: new Date().toISOString(),
                       status: 'completed'
                     }
                   };
                   
                   setAssessmentData(transformedData);
                   console.log('✅ Assessment data loaded from data bridge');
                 } else {
                   setError(result.message || 'Failed to load assessment data from data bridge');
                 }
               } else {
          console.log('🔄 Loading assessment data from existing platform API...');
          
          // Fallback to existing API for platform users
          const response = await fetch('/api/assessment/results');
          const result = await response.json();
          
          if (result.assessmentData) {
            setAssessmentData(result.assessmentData);
            console.log('✅ Assessment data loaded from platform API');
          } else {
            setError('No assessment data found');
          }
        }
      } catch (err) {
        console.error('❌ Error loading assessment data:', err);
        setError('Failed to load assessment data');
      } finally {
        setLoading(false);
      }
    };

    fetchAssessmentData();
  }, [sessionId, userId, source]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background-primary">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <ModernCircularProgress value={0} size="lg" />
              <p className="text-lg text-gray-600 mt-4">
                {source === 'andru-assessment' ? 'Loading your assessment results...' : 'Loading assessment data...'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background-primary">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Error Loading Assessment
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-primary">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Assessment Results</h1>
          <p className="text-text-muted">
            Your comprehensive revenue readiness analysis and performance baselines
          </p>
          {source === 'andru-assessment' && synced === 'true' && (
            <div className="mt-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                ✅ Synced from Assessment
              </span>
            </div>
          )}
        </div>

        <AssessmentErrorBoundary>
          <AssessmentResultsWidget assessmentData={assessmentData || {}} />
        </AssessmentErrorBoundary>
      </div>
    </div>
  );
}
