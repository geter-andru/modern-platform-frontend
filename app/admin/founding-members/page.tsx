'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/lib/auth';
import { ModernSidebarLayout } from '../../../src/shared/components/layout/ModernSidebarLayout';
import { Users, DollarSign, Calendar, Lock, RefreshCw, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { AssessmentAnalyticsSection } from './components/AssessmentAnalyticsSection';
import { PlatformAnalyticsSection } from './components/PlatformAnalyticsSection';
import { useBehaviorTracking } from '../../../src/shared/hooks/useBehaviorTracking';
import { AuthLoadingScreen } from '../../../src/shared/components/auth/AuthLoadingScreen';
import { authService } from '@/app/lib/auth/auth-service';

interface FoundingMember {
  user_id: string;
  email: string;
  account_created: string;
  payment_date: string;
  access_granted_date: string;
  has_early_access: boolean;
  is_founding_member: boolean;
  forever_lock_price: number;
  stripe_customer_id: string;
  stripe_subscription_id: string | null;
  amount_paid: number;
  payment_currency: string;
  founding_member_number: number | null;
  assessment_session_id: string | null;
  assessmentStatus: {
    completed: boolean;
    overallScore: number | null;
    buyerScore: number | null;
    completedAt: string | null;
  };
  platformStatus: {
    lastActive: string | null;
    toolSessions: number;
    exportsGenerated: number;
    daysSinceLastActivity: number | null;
  };
}

interface AdminData {
  foundingMembers: FoundingMember[];
  totalCount: number;
  withEarlyAccess: number;
  withoutEarlyAccess: number;
  totalRevenue: number;
}

export default function AdminFoundingMembersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading, session, isAdmin } = useAuth();
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  // OAuth loading state - show sophisticated loading screen after OAuth callback
  const [showAuthLoading, setShowAuthLoading] = useState(false);
  const [sessionSyncComplete, setSessionSyncComplete] = useState(false);

  // Track admin page view for user flow analytics (auto-tracks navigation on mount/unmount)
  useBehaviorTracking({
    customerId: user?.id || '',
  });

  // 🔄 SESSION SYNCHRONIZATION: Detect OAuth callback and show loading screen
  useEffect(() => {
    const authLoading = searchParams.get('auth_loading');

    if (authLoading === 'true' && !sessionSyncComplete) {
      console.log('🔄 [AdminPage] OAuth callback detected - showing auth loading screen');
      setShowAuthLoading(true);

      // Force session refresh to ensure admin status is correctly set
      const syncSession = async () => {
        console.log('🔄 [AdminPage] Forcing session refresh...');
        try {
          const session = await authService.getServerSession();
          const currentUser = authService.getCurrentUser();
          console.log('✅ [AdminPage] Session synced:', {
            userId: currentUser?.id,
            email: currentUser?.email,
            isAdmin: currentUser?.isAdmin,
            sessionValid: !!session
          });
        } catch (error) {
          console.error('❌ [AdminPage] Session sync error:', error);
        }
      };

      // Start session sync immediately
      syncSession();
    }
  }, [searchParams, sessionSyncComplete]);

  // Handle auth loading completion
  const handleAuthLoadingComplete = () => {
    console.log('✅ [AdminPage] Auth loading complete - session synchronized');
    setShowAuthLoading(false);
    setSessionSyncComplete(true);

    // Clean up auth_loading parameter from URL
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete('auth_loading');
    router.replace(newUrl.pathname + newUrl.search);
  };

  useEffect(() => {
    // Check if user is admin using proper auth system
    if (authLoading) {
      console.log('🔐 [AdminPage] Auth loading...');
      return;
    }

    console.log('🔐 [AdminPage] Auth check:', {
      hasUser: !!user,
      email: user?.email,
      isAdmin: isAdmin
    });

    if (!user) {
      console.log('❌ [AdminPage] No user - redirecting to login');
      router.push('/login?redirect=/admin/founding-members');
      return;
    }

    if (!isAdmin) {
      console.log('❌ [AdminPage] User not admin - redirecting to dashboard');
      router.push('/dashboard');
      return;
    }

    console.log('✅ [AdminPage] Admin access granted');
    fetchFoundingMembers();
  }, [user, authLoading, isAdmin, router]);

  const fetchFoundingMembers = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!session?.access_token) {
        throw new Error('No session token available');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/founding-members`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch founding members');
      }

      const result = await response.json();
      setData(result.data);
      setLastRefresh(new Date());
    } catch (err) {
      console.error('Error fetching founding members:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Show sophisticated auth loading screen during OAuth session sync
  if (showAuthLoading) {
    return (
      <AuthLoadingScreen
        duration={4500} // 4.5 seconds for session sync
        onComplete={handleAuthLoadingComplete}
      />
    );
  }

  if (authLoading || loading) {
    return (
      <ModernSidebarLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-lg text-text-secondary">Loading admin dashboard...</p>
          </div>
        </div>
      </ModernSidebarLayout>
    );
  }

  if (error) {
    return (
      <ModernSidebarLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="max-w-md p-8 rounded-2xl bg-red-900/20 border border-red-500/30">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2 text-center">Error Loading Data</h2>
            <p className="text-red-300 text-center mb-4">{error}</p>
            <button
              onClick={fetchFoundingMembers}
              className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition"
            >
              Retry
            </button>
          </div>
        </div>
      </ModernSidebarLayout>
    );
  }

  if (!data) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <ModernSidebarLayout>
      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Founding Members Dashboard</h1>
            <p className="text-text-secondary mt-1">Admin view for geter@humusnshore.org</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            {lastRefresh && (
              <p className="text-xs text-text-secondary">
                Last updated: {lastRefresh.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
            )}
            <button
              onClick={fetchFoundingMembers}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white transition"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Members */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-500/30"
          >
            <div className="flex items-center justify-between mb-4">
              <Users className="w-10 h-10 text-blue-400" />
              <span className="text-3xl font-bold text-white">{data.totalCount}</span>
            </div>
            <h3 className="text-sm font-medium text-blue-300">Total Founding Members</h3>
            <p className="text-xs text-blue-400/60 mt-1">Out of 65 spots</p>
          </motion.div>

          {/* Total Revenue */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-500/30"
          >
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-10 h-10 text-green-400" />
              <span className="text-3xl font-bold text-white">{formatCurrency(data.totalRevenue)}</span>
            </div>
            <h3 className="text-sm font-medium text-green-300">Total Revenue</h3>
            <p className="text-xs text-green-400/60 mt-1">$497 per member</p>
          </motion.div>

          {/* With Early Access */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-500/30"
          >
            <div className="flex items-center justify-between mb-4">
              <CheckCircle2 className="w-10 h-10 text-purple-400" />
              <span className="text-3xl font-bold text-white">{data.withEarlyAccess}</span>
            </div>
            <h3 className="text-sm font-medium text-purple-300">With Early Access</h3>
            <p className="text-xs text-purple-400/60 mt-1">Immediate access granted</p>
          </motion.div>

          {/* Awaiting Access */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-orange-900/30 to-orange-800/20 border border-orange-500/30"
          >
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-10 h-10 text-orange-400" />
              <span className="text-3xl font-bold text-white">{data.withoutEarlyAccess}</span>
            </div>
            <h3 className="text-sm font-medium text-orange-300">Awaiting Dec 1 Access</h3>
            <p className="text-xs text-orange-400/60 mt-1">Access pending</p>
          </motion.div>
        </div>

        {/* Assessment Analytics Section */}
        <AssessmentAnalyticsSection />

        {/* Platform Analytics Section */}
        <PlatformAnalyticsSection />

        {/* Members Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl bg-surface/30 border border-white/10 overflow-hidden"
        >
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
              <Users className="w-5 h-5" />
              All Founding Members ({data.totalCount})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Payment Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Access Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Access Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Forever Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Stripe ID
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.foundingMembers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-text-secondary">
                      <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
                      <p className="text-lg">No founding members yet</p>
                      <p className="text-sm mt-1">First payment will appear here</p>
                    </td>
                  </tr>
                ) : (
                  data.foundingMembers.map((member, index) => (
                    <tr key={member.user_id} className="hover:bg-white/5 transition">
                      <td className="px-6 py-4 text-sm text-text-secondary">
                        {member.founding_member_number || index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm text-text-primary font-medium">
                        {member.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-text-secondary">
                        {formatDate(member.payment_date)}
                      </td>
                      <td className="px-6 py-4 text-sm text-green-400 font-medium">
                        {formatCurrency(member.amount_paid)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {member.has_early_access ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-900/30 text-green-400 rounded-full text-xs">
                            <CheckCircle2 className="w-3 h-3" />
                            Early Access
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-900/30 text-orange-400 rounded-full text-xs">
                            <Clock className="w-3 h-3" />
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-text-secondary">
                        {new Date(member.access_granted_date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm text-text-secondary">
                        ${member.forever_lock_price}/mo
                      </td>
                      <td className="px-6 py-4 text-sm text-text-secondary font-mono text-xs">
                        {member.stripe_customer_id.substring(0, 20)}...
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-6 rounded-2xl bg-blue-900/20 border border-blue-500/30"
        >
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-blue-300 mb-1">Admin Access Only</h3>
              <p className="text-xs text-blue-400/70">
                This dashboard is only accessible to geter@humusnshore.org. All founding member data is securely stored and HIPAA compliant.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </ModernSidebarLayout>
  );
}
