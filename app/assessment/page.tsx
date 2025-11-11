'use client';

/**
 * Public Assessment Results Page - Token-Based Intelligence Report
 *
 * This is the "WOW" page that converts assessment takers into founding members.
 * Displays consulting-grade buyer intelligence analysis that users want to share on LinkedIn.
 */

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Brain,
  Users,
  Target,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Clock,
  Award,
  AlertTriangle,
  Lightbulb,
  BarChart3,
  TrendingUp,
  Share2
} from 'lucide-react';
import { ModernCard } from '@/src/shared/components/ui/ModernCard';
import { GradientButton } from '@/src/shared/components/ui/GradientButton';
import { AnimatedCounter } from '@/src/shared/components/ui/AnimatedCounter';
import { ProgressRing } from '@/src/shared/components/ui/ProgressRing';
import { useAuth } from '@/app/lib/auth';
import { ModernSidebarLayout } from '@/src/shared/components/layout/ModernSidebarLayout';

// ============================================================================
// Types - Based on actual assessment data structure
// ============================================================================

interface Challenge {
  id: string;
  category: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  title: string;
  description: string;
  impact: string;
  evidence: string[];
}

interface Recommendation {
  id: string;
  category: string;
  priority: 'High' | 'Medium' | 'Low';
  title: string;
  description: string;
  benefits: string[];
  implementation: string;
  timeToImpact: string;
  applicableFor?: string;
}

interface AssessmentData {
  // Core scores
  overall?: {
    score: number;
    level: string; // 'foundation' | 'developing' | 'advanced' | 'elite'
    percentile: number;
  };
  categories?: {
    'buyer-understanding'?: {
      score: number;
      weight: string;
    };
    'tech-to-value'?: {
      score: number;
      weight: string;
    };
  };

  // Generated intelligence
  insights?: string[];
  challenges?: {
    challenges: Challenge[];
    summary: {
      totalChallenges: number;
      criticalChallenges: number;
      highChallenges: number;
      overallRisk: string;
      focusArea: string;
      description: string;
    };
  };
  recommendations?: Recommendation[];

  // User context
  userInfo?: {
    company: string;
    email: string;
    name?: string;
    role?: string;
  };
  productInfo?: {
    name?: string;
    description?: string;
  };

  // Metadata
  metadata?: {
    sessionId: string;
    createdAt: string;
    completionTime?: number;
  };
}

interface ValidationResponse {
  success: boolean;
  data?: {
    assessment: AssessmentData;
    isValid: boolean;
    isClaimed: boolean;
    expiresAt: string;
  };
  error?: string;
}

// ============================================================================
// Assessment Content Component
// ============================================================================

function AssessmentContent() {
  const searchParams = useSearchParams();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [assessment, setAssessment] = useState<AssessmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClaimed, setIsClaimed] = useState(false);

  useEffect(() => {
    // Wait for auth to finish loading before deciding what to fetch
    if (authLoading) {
      return;
    }

    const token = searchParams.get('token');

    // Priority 1: If token exists, use token flow (existing behavior)
    if (token) {
      validateAndFetchAssessment(token);
      return;
    }

    // Priority 2: If no token but user is authenticated, fetch their claimed assessment
    if (isAuthenticated) {
      fetchAuthenticatedAssessment();
      return;
    }

    // Priority 3: No token and not authenticated - show error
    setError('No assessment token provided. Please check your assessment link or sign in to view your saved assessment.');
    setLoading(false);
  }, [searchParams, authLoading, isAuthenticated]);

  const validateAndFetchAssessment = async (token: string) => {
    try {
      const response = await fetch('/api/assessment/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data: ValidationResponse = await response.json();

      if (!response.ok || !data.success || !data.data?.isValid) {
        throw new Error(data.error || 'Invalid or expired token');
      }

      setAssessment(data.data.assessment);
      setIsClaimed(data.data.isClaimed || false);
      setLoading(false);
    } catch (err) {
      console.error('❌ Token validation failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to load assessment');
      setLoading(false);
    }
  };

  const fetchAuthenticatedAssessment = async () => {
    try {
      const response = await fetch('/api/assessment/results');
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to load assessment');
      }

      if (data.isMock) {
        // No real assessment found - user hasn't claimed one yet
        setError('No assessment found. Complete an assessment first or use your assessment link.');
        setLoading(false);
        return;
      }

      setAssessment(data.data);
      setIsClaimed(true); // If they're viewing via auth, it's already claimed
      setLoading(false);
    } catch (err) {
      console.error('❌ Failed to fetch authenticated assessment:', err);
      setError(err instanceof Error ? err.message : 'Failed to load assessment');
      setLoading(false);
    }
  };

  // Grade calculation
  const getGrade = (score: number): { grade: string; color: string; label: string } => {
    if (score >= 90) return { grade: 'A+', color: 'var(--color-accent)', label: 'Elite' };
    if (score >= 80) return { grade: 'A', color: 'var(--color-accent)', label: 'Advanced' };
    if (score >= 70) return { grade: 'B', color: 'var(--color-primary)', label: 'Developing' };
    if (score >= 60) return { grade: 'C', color: 'var(--color-accent-warning)', label: 'Foundation' };
    return { grade: 'D', color: 'var(--color-accent-danger)', label: 'Emerging' };
  };

  // Severity color mapping
  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'Critical': return 'var(--color-accent-danger)';
      case 'High': return 'var(--color-accent-warning)';
      case 'Medium': return 'var(--color-primary)';
      default: return 'var(--color-accent)';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-background-primary)' }}>
        <div className="text-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6"
            style={{
              background: 'rgba(59, 130, 246, 0.15)',
              border: '2px solid rgba(59, 130, 246, 0.3)',
              boxShadow: 'var(--shadow-glow-primary)'
            }}
          >
            <Brain className="w-10 h-10" style={{ color: 'var(--color-primary)' }} />
          </motion.div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Loading Your Intelligence Report
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Validating assessment token...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !assessment) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--color-background-primary)' }}>
        <div className="max-w-md w-full">
          <ModernCard variant="warning" padding="spacious">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--color-accent-warning)' }} />
              <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                Assessment Not Found
              </h2>
              <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
                {error || 'We couldn\'t load your assessment. The link may be invalid or expired.'}
              </p>
              <GradientButton href="/pricing" size="lg" rightIcon={ArrowRight}>
                View Founding Member Pricing
              </GradientButton>
            </div>
          </ModernCard>
        </div>
      </div>
    );
  }

  // Extract scores
  const overallScore = assessment.overall?.score || 0;
  const overallGrade = getGrade(overallScore);
  const buyerScore = assessment.categories?.['buyer-understanding']?.score || 0;
  const techScore = assessment.categories?.['tech-to-value']?.score || 0;
  const buyerGrade = getGrade(buyerScore);
  const techGrade = getGrade(techScore);

  // Main content (same for both authenticated and public views)
  const content = (
    <div className="min-h-screen py-12 px-4" style={{ background: 'var(--color-background-primary)' }}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{
              background: 'rgba(59, 130, 246, 0.15)',
              border: '2px solid rgba(59, 130, 246, 0.3)',
              boxShadow: 'var(--shadow-glow-primary)'
            }}
          >
            <Brain className="w-8 h-8" style={{ color: 'var(--color-primary)' }} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Your Buyer Intelligence Report
          </h1>
          {assessment.userInfo?.company && (
            <p className="text-xl mb-2" style={{ color: 'var(--text-secondary)' }}>
              {assessment.userInfo.company}
            </p>
          )}
          {assessment.productInfo?.name && (
            <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
              {assessment.productInfo.name}
            </p>
          )}
          {isClaimed && (
            <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full"
              style={{
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }}
            >
              <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--color-accent)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--color-accent)' }}>
                Saved to Your Account
              </span>
            </div>
          )}
        </div>

        {/* Overall Score Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
          <ModernCard variant="highlighted" padding="spacious">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left flex-1">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                  <Award className="w-8 h-8" style={{ color: overallGrade.color }} />
                  <h2 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    Overall Performance
                  </h2>
                </div>
                <div className="flex items-baseline gap-3 mb-2 justify-center md:justify-start">
                  <span className="text-6xl font-bold" style={{ color: overallGrade.color }}>
                    <AnimatedCounter value={overallScore} />
                  </span>
                  <span className="text-3xl" style={{ color: 'var(--text-muted)' }}>/100</span>
                </div>
                <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                  <span className="text-2xl font-bold" style={{ color: overallGrade.color }}>
                    {overallGrade.grade}
                  </span>
                  <span className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                    {overallGrade.label} Level
                  </span>
                </div>
                {assessment.overall?.percentile && (
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    {assessment.overall.percentile}th percentile among B2B SaaS companies
                  </p>
                )}
              </div>
              <div>
                <ProgressRing value={overallScore} size={200} strokeWidth={16} />
              </div>
            </div>
          </ModernCard>
        </motion.div>

        {/* Category Breakdown */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <ModernCard padding="spacious">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-xl" style={{
                  background: 'rgba(59, 130, 246, 0.15)',
                  border: '1px solid rgba(59, 130, 246, 0.3)'
                }}>
                  <Users className="w-6 h-6" style={{ color: 'var(--color-primary)' }} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                    Buyer Understanding
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    How well you understand enterprise buyers
                  </p>
                </div>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold" style={{ color: buyerGrade.color }}>
                  <AnimatedCounter value={buyerScore} />
                </span>
                <span className="text-xl" style={{ color: 'var(--text-muted)' }}>/100</span>
                <span className="ml-auto text-xl font-bold" style={{ color: buyerGrade.color }}>
                  {buyerGrade.grade}
                </span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${buyerScore}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="h-full rounded-full"
                  style={{ background: buyerGrade.color }}
                />
              </div>
            </ModernCard>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <ModernCard padding="spacious">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-xl" style={{
                  background: 'rgba(139, 92, 246, 0.15)',
                  border: '1px solid rgba(139, 92, 246, 0.3)'
                }}>
                  <Target className="w-6 h-6" style={{ color: 'var(--color-secondary)' }} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                    Tech-to-Value Translation
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    Translating features into business outcomes
                  </p>
                </div>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold" style={{ color: techGrade.color }}>
                  <AnimatedCounter value={techScore} />
                </span>
                <span className="text-xl" style={{ color: 'var(--text-muted)' }}>/100</span>
                <span className="ml-auto text-xl font-bold" style={{ color: techGrade.color }}>
                  {techGrade.grade}
                </span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${techScore}%` }}
                  transition={{ duration: 1, delay: 0.4 }}
                  className="h-full rounded-full"
                  style={{ background: techGrade.color }}
                />
              </div>
            </ModernCard>
          </motion.div>
        </div>

        {/* Key Insights */}
        {assessment.insights && assessment.insights.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mb-12">
            <ModernCard padding="spacious">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-6 h-6" style={{ color: 'var(--color-accent)' }} />
                <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  AI-Discovered Insights
                </h3>
              </div>
              <ul className="space-y-3">
                {assessment.insights.map((insight, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + idx * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-lg"
                    style={{ background: 'rgba(16, 185, 129, 0.05)' }}
                  >
                    <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'var(--color-accent)' }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{insight}</span>
                  </motion.li>
                ))}
              </ul>
            </ModernCard>
          </motion.div>
        )}

        {/* Challenge Analysis */}
        {assessment.challenges && assessment.challenges.challenges.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="mb-12">
            <ModernCard padding="spacious">
              <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="w-6 h-6" style={{ color: 'var(--color-accent-warning)' }} />
                <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  Identified Challenges
                </h3>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6 p-4 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                <div className="text-center">
                  <div className="text-3xl font-bold" style={{ color: 'var(--color-accent-danger)' }}>
                    {assessment.challenges.summary.totalChallenges}
                  </div>
                  <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Total Challenges</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: getSeverityColor(assessment.challenges.summary.overallRisk) }}>
                    {assessment.challenges.summary.overallRisk}
                  </div>
                  <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Risk Level</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold" style={{ color: 'var(--color-primary)' }}>
                    {assessment.challenges.summary.focusArea}
                  </div>
                  <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Focus Area</div>
                </div>
              </div>

              {/* Challenge Cards */}
              <div className="space-y-4">
                {assessment.challenges.challenges.map((challenge, idx) => (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + idx * 0.1 }}
                    className="p-6 rounded-lg"
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderLeft: `4px solid ${getSeverityColor(challenge.severity)}`
                    }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                        {challenge.title}
                      </h4>
                      <span
                        className="px-3 py-1 rounded-full text-xs font-bold"
                        style={{
                          background: `${getSeverityColor(challenge.severity)}20`,
                          color: getSeverityColor(challenge.severity)
                        }}
                      >
                        {challenge.severity}
                      </span>
                    </div>
                    <p className="mb-3" style={{ color: 'var(--text-secondary)' }}>
                      {challenge.description}
                    </p>
                    <div className="p-3 rounded-lg mb-3" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                      <strong className="text-sm" style={{ color: 'var(--text-primary)' }}>Impact: </strong>
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{challenge.impact}</span>
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-subtle)' }}>
                      <strong>Evidence:</strong> {challenge.evidence.join(' • ')}
                    </div>
                  </motion.div>
                ))}
              </div>
            </ModernCard>
          </motion.div>
        )}

        {/* Recommendations */}
        {assessment.recommendations && assessment.recommendations.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }} className="mb-12">
            <ModernCard padding="spacious">
              <div className="flex items-center gap-3 mb-6">
                <Lightbulb className="w-6 h-6" style={{ color: 'var(--color-primary)' }} />
                <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  Strategic Recommendations
                </h3>
              </div>
              <div className="space-y-6">
                {assessment.recommendations.map((rec, idx) => (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 + idx * 0.15 }}
                    className="p-6 rounded-lg"
                    style={{ background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)' }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                        {rec.title}
                      </h4>
                      <span
                        className="px-3 py-1 rounded-full text-xs font-bold"
                        style={{
                          background: rec.priority === 'High' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(139, 92, 246, 0.2)',
                          color: rec.priority === 'High' ? 'var(--color-primary)' : 'var(--color-secondary)'
                        }}
                      >
                        {rec.priority} Priority
                      </span>
                    </div>
                    <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
                      {rec.description}
                    </p>
                    <div className="mb-4">
                      <strong className="text-sm block mb-2" style={{ color: 'var(--text-primary)' }}>Benefits:</strong>
                      <ul className="space-y-1">
                        {rec.benefits.map((benefit, bidx) => (
                          <li key={bidx} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--color-accent)' }} />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong style={{ color: 'var(--text-primary)' }}>Implementation: </strong>
                        <span style={{ color: 'var(--text-muted)' }}>{rec.implementation}</span>
                      </div>
                      <div>
                        <strong style={{ color: 'var(--text-primary)' }}>Time to Impact: </strong>
                        <span style={{ color: 'var(--text-muted)' }}>{rec.timeToImpact}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ModernCard>
          </motion.div>
        )}

        {/* CTA Section - Conditional based on auth state */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}>
          <ModernCard variant="glass" padding="spacious">
            <div className="text-center">
              {isAuthenticated ? (
                // Authenticated user CTAs
                <>
                  <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                    Ready to Apply These Insights?
                  </h2>
                  <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                    Use the ICP Analysis Tool to identify your ideal buyers and translate these insights into actionable strategies.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                    <GradientButton href="/icp" size="xl" rightIcon={ArrowRight}>
                      Explore ICP Tool
                    </GradientButton>
                    <button
                      className="px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all"
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: 'var(--text-primary)'
                      }}
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: 'My Buyer Intelligence Assessment',
                            text: `Just got my buyer intelligence score: ${overallScore}/100. Check out your score!`,
                            url: window.location.href
                          });
                        }
                      }}
                    >
                      <Share2 className="w-5 h-5" />
                      Share Results
                    </button>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Your assessment is saved to your account</span>
                  </div>
                </>
              ) : (
                // Public/unauthenticated user CTAs
                <>
                  <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                    Transform This Intelligence Into Revenue
                  </h2>
                  <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                    Join 100 founding members locking in $750/month forever pricing (vs. $1,250 standard).
                    Turn buyer intelligence insights into systematic revenue growth starting December 1, 2025.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                    <GradientButton href="/pricing" size="xl" rightIcon={ArrowRight}>
                      Lock In Founding Member Pricing
                    </GradientButton>
                    <button
                      className="px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all"
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: 'var(--text-primary)'
                      }}
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: 'My Buyer Intelligence Assessment',
                            text: `Just got my buyer intelligence score: ${overallScore}/100. Check out your score!`,
                            url: window.location.href
                          });
                        }
                      }}
                    >
                      <Share2 className="w-5 h-5" />
                      Share Results
                    </button>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                    <Clock className="w-4 h-4" />
                    <span>Limited to 100 members • Free until Series A • No credit card required</span>
                  </div>
                </>
              )}
            </div>
          </ModernCard>
        </motion.div>

      </div>
    </div>
  );

  // Conditional layout: Wrap with navigation if authenticated, standalone if public
  if (isAuthenticated) {
    return <ModernSidebarLayout>{content}</ModernSidebarLayout>;
  }

  return content;
}

// ============================================================================
// Main Page Export with Suspense
// ============================================================================

export default function AssessmentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-background-primary)' }}>
        <Brain className="w-16 h-16 animate-pulse" style={{ color: 'var(--color-primary)' }} />
      </div>
    }>
      <AssessmentContent />
    </Suspense>
  );
}
