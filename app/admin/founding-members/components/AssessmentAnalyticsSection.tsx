'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/lib/auth';
import { motion } from 'framer-motion';
import { ClipboardCheck, CheckCircle2, TrendingUp, Award, AlertCircle, RefreshCw } from 'lucide-react';

interface AssessmentAnalytics {
  totalFoundingMembers: number;
  completedAssessments: number;
  pendingAssessments: number;
  completionRate: number;
  avgOverallScore: number;
  avgBuyerScore: number;
  recentCompletions: Array<{
    email: string;
    overallScore: number;
    buyerScore: number;
    completedAt: string;
    status: string;
  }>;
  message?: string;
}

export function AssessmentAnalyticsSection() {
  const { session } = useAuth();
  const [data, setData] = useState<AssessmentAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAssessmentAnalytics();
  }, [session]);

  const fetchAssessmentAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!session?.access_token) {
        throw new Error('No session token available');
      }

      console.log('🚀 Fetching assessment analytics...');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/assessment-analytics`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch assessment analytics');
      }

      const result = await response.json();
      console.log('✅ Assessment analytics loaded:', result.data);
      setData(result.data);
    } catch (err) {
      console.error('❌ Error fetching assessment analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to load assessment analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-2" />
          <p className="text-sm text-text-secondary">Loading assessment analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-2xl bg-red-900/20 border border-red-500/30">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-red-300 mb-1">Error Loading Assessment Analytics</h3>
            <p className="text-xs text-red-400/80 mb-3">{error}</p>
            <button
              onClick={fetchAssessmentAnalytics}
              className="text-xs px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-lg text-white transition"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  // Empty state: No founding members yet
  const isEmpty = data.totalFoundingMembers === 0;

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-bold text-text-primary">Assessment Analytics</h2>
        <p className="text-sm text-text-secondary mt-1">
          Track assessment completion rates and scores for founding members
        </p>
      </div>

      {/* Empty State */}
      {isEmpty && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 rounded-2xl bg-gradient-to-br from-purple-900/20 to-purple-800/10 border border-purple-500/20"
        >
          <div className="text-center max-w-md mx-auto">
            <ClipboardCheck className="w-12 h-12 text-purple-400/60 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">No Assessment Data Yet</h3>
            <p className="text-sm text-text-secondary">
              Assessment analytics will appear here once founding members complete their assessments.
              The platform automatically tracks completion rates, scores, and trends.
            </p>
          </div>
        </motion.div>
      )}

      {/* Stats Grid */}
      {!isEmpty && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Founding Members */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-500/30"
            >
              <div className="flex items-center justify-between mb-4">
                <ClipboardCheck className="w-10 h-10 text-purple-400" />
                <span className="text-3xl font-bold text-white">{data.totalFoundingMembers}</span>
              </div>
              <h3 className="text-sm font-medium text-purple-300">Total Founding Members</h3>
              <p className="text-xs text-purple-400/60 mt-1">Eligible for assessment tracking</p>
            </motion.div>

            {/* Completed Assessments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-500/30"
            >
              <div className="flex items-center justify-between mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-400" />
                <span className="text-3xl font-bold text-white">{data.completedAssessments}</span>
              </div>
              <h3 className="text-sm font-medium text-green-300">Completed Assessments</h3>
              <p className="text-xs text-green-400/60 mt-1">
                {data.pendingAssessments} pending
              </p>
            </motion.div>

            {/* Completion Rate */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-500/30"
            >
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-10 h-10 text-blue-400" />
                <span className="text-3xl font-bold text-white">{data.completionRate}%</span>
              </div>
              <h3 className="text-sm font-medium text-blue-300">Completion Rate</h3>
              <p className="text-xs text-blue-400/60 mt-1">
                {data.completedAssessments} of {data.totalFoundingMembers} members
              </p>
            </motion.div>

            {/* Average Scores */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-amber-900/30 to-amber-800/20 border border-amber-500/30"
            >
              <div className="flex items-center justify-between mb-4">
                <Award className="w-10 h-10 text-amber-400" />
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{data.avgOverallScore}</div>
                  <div className="text-sm text-amber-300/60">Overall</div>
                </div>
              </div>
              <h3 className="text-sm font-medium text-amber-300">Average Scores</h3>
              <p className="text-xs text-amber-400/60 mt-1">
                Buyer: {data.avgBuyerScore}
              </p>
            </motion.div>
          </div>

          {/* Recent Completions */}
          {data.recentCompletions && data.recentCompletions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-6 rounded-2xl bg-surface-secondary border border-border-subtle"
            >
              <h3 className="text-lg font-semibold text-text-primary mb-4">Recent Completions</h3>
              <div className="space-y-3">
                {data.recentCompletions.map((completion, index) => (
                  <div
                    key={`${completion.email}-${index}`}
                    className="flex items-center justify-between p-4 rounded-lg bg-surface-primary border border-border-subtle hover:border-border-muted transition"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-text-primary">{completion.email}</p>
                      <p className="text-xs text-text-secondary mt-0.5">
                        {new Date(completion.completedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 ml-4">
                      <div className="text-right">
                        <p className="text-xs text-text-secondary">Overall</p>
                        <p className="text-sm font-semibold text-text-primary">{completion.overallScore}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-text-secondary">Buyer</p>
                        <p className="text-sm font-semibold text-text-primary">{completion.buyerScore}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* No Recent Completions */}
          {(!data.recentCompletions || data.recentCompletions.length === 0) && (
            <div className="p-6 rounded-2xl bg-surface-secondary border border-border-subtle">
              <div className="text-center py-4">
                <ClipboardCheck className="w-8 h-8 text-text-tertiary mx-auto mb-2" />
                <p className="text-sm text-text-secondary">No recent assessment completions</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
