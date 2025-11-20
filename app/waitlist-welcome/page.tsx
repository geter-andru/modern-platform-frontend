'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase/client-rewrite';
import { motion } from 'framer-motion';
import { CheckCircle2, Calendar, Lock, Users, Sparkles, ArrowRight, Mail } from 'lucide-react';
import { GradientButton } from '../../src/shared/components/ui/GradientButton';
import { FooterLayout } from '../../src/shared/components/layout/FooterLayout';

interface UserMilestone {
  id: string;
  user_id: string;
  milestone_type: string;
  status: string;
  completed_at: string;
  is_founding_member: boolean;
  has_early_access: boolean;
  access_granted_date: string;
  forever_lock_price: number;
  metadata: {
    payment_amount?: number;
    payment_currency?: string;
    early_access_price?: number;
    founding_member_number?: number;
  };
}

export default function WaitlistWelcomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>('');
  const [milestone, setMilestone] = useState<UserMilestone | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    checkAuthAndLoadMilestone();
  }, []);

  const checkAuthAndLoadMilestone = async () => {
    try {
      // Check if user is authenticated
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        throw sessionError;
      }

      if (!session) {
        // Not authenticated - redirect to login
        router.push('/login');
        return;
      }

      setUserEmail(session.user.email || '');

      // Load user milestone data
      const { data: milestones, error: milestoneError } = await supabase
        .from('user_milestones')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('milestone_type', 'waitlist_paid')
        .single();

      if (milestoneError) {
        console.error('Error loading milestone:', milestoneError);
        // Continue anyway - might be a new user
      } else {
        setMilestone(milestones);
      }

      setLoading(false);
    } catch (err) {
      console.error('Error in checkAuthAndLoadMilestone:', err);
      setError('Failed to load your founding member status. Please refresh the page.');
      setLoading(false);
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'var(--color-background-primary, #000000)',
        color: 'var(--color-text-primary, #ffffff)'
      }}>
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-xl">Loading your founding member portal...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'var(--color-background-primary, #000000)',
        color: 'var(--color-text-primary, #ffffff)'
      }}>
        <div className="text-center max-w-md">
          <p className="text-xl mb-4 text-red-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  const accessDate = milestone?.access_granted_date
    ? new Date(milestone.access_granted_date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    : 'December 1, 2025';

  const earlyAccessPrice = milestone?.metadata?.early_access_price || 497;
  const foreverLockPrice = milestone?.forever_lock_price || 750;
  const foundingMemberNumber = milestone?.metadata?.founding_member_number || '?';

  return (
    <div className="min-h-screen" style={{
      background: 'var(--color-background-primary, #000000)',
      color: 'var(--color-text-primary, #ffffff)',
      fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
    }}>
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center" style={{
        background: 'var(--color-background-primary, #000000)'
      }}>
        {/* Background */}
        <div className="absolute inset-0" style={{
          background: `
            radial-gradient(circle at 30% 20%, rgba(120, 119, 198, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 70% 80%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
            linear-gradient(135deg, rgba(10, 10, 10, 0.8) 0%, rgba(26, 26, 46, 0.9) 50%, rgba(22, 33, 62, 0.8) 100%)
          `
        }} />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            className="text-center"
            initial="initial"
            animate="animate"
            variants={staggerChildren}
          >
            {/* Success Icon */}
            <motion.div variants={fadeInUp} className="mb-8">
              <div className="inline-block p-6 rounded-full" style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '2px solid rgba(34, 197, 94, 0.3)'
              }}>
                <CheckCircle2 className="w-16 h-16 text-green-400" />
              </div>
            </motion.div>

            {/* Founding Member Badge */}
            <motion.div variants={fadeInUp} className="mb-6">
              <div className="inline-block px-8 py-3 rounded-full" style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                boxShadow: '0 8px 32px rgba(59, 130, 246, 0.2)'
              }}>
                <p className="font-semibold" style={{
                  color: '#3b82f6',
                  letterSpacing: '0.5px'
                }}>
                  <Sparkles className="inline w-5 h-5 mr-2" />
                  FOUNDING MEMBER #{foundingMemberNumber}
                </p>
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight"
              style={{
                color: 'var(--color-text-primary, #ffffff)',
                fontWeight: 'var(--font-weight-bold, 700)',
                letterSpacing: 'var(--tracking-tighter, -0.02em)',
                textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
              }}
            >
              Welcome to Andru! 🎉
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={fadeInUp}
              className="text-xl sm:text-2xl mb-12 leading-relaxed max-w-2xl mx-auto"
              style={{
                color: 'var(--color-text-secondary, rgba(255, 255, 255, 0.8))',
                lineHeight: 'var(--line-height-relaxed, 1.6)'
              }}
            >
              Your payment has been processed successfully. You're officially one of our 65 founding members with exclusive lifetime benefits.
            </motion.p>

            {/* User Email Confirmation */}
            <motion.div variants={fadeInUp} className="mb-12">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl" style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <Mail className="w-5 h-5 text-blue-400" />
                <span className="text-lg">{userEmail}</span>
              </div>
            </motion.div>

            {/* Key Benefits Grid */}
            <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {/* Platform Access Date */}
              <div className="p-8 rounded-2xl" style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.06)'
              }}>
                <Calendar className="w-12 h-12 text-blue-400 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-2">Platform Access</h3>
                <p className="text-3xl font-bold text-blue-400 mb-2">{accessDate}</p>
                <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                  Early access to all features as they're built
                </p>
              </div>

              {/* Forever Lock Pricing */}
              <div className="p-8 rounded-2xl" style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.06)'
              }}>
                <Lock className="w-12 h-12 text-green-400 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-2">Forever Lock Price</h3>
                <p className="text-3xl font-bold text-green-400 mb-2">
                  ${foreverLockPrice}/month
                </p>
                <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                  vs. $1,250 standard (save $6,000/year)
                </p>
              </div>
            </motion.div>

            {/* What's Next Section */}
            <motion.div variants={fadeInUp} className="p-8 rounded-2xl mb-12" style={{
              background: 'rgba(59, 130, 246, 0.05)',
              border: '1px solid rgba(59, 130, 246, 0.2)'
            }}>
              <h2 className="text-2xl font-bold mb-6 text-blue-400">
                What Happens Next?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{
                      background: 'rgba(59, 130, 246, 0.2)',
                      border: '1px solid rgba(59, 130, 246, 0.4)'
                    }}>
                      <span className="text-sm font-bold text-blue-400">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Check Your Email</h4>
                      <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        You'll receive a welcome email with next steps and community access
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{
                      background: 'rgba(59, 130, 246, 0.2)',
                      border: '1px solid rgba(59, 130, 246, 0.4)'
                    }}>
                      <span className="text-sm font-bold text-blue-400">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Join Slack Community</h4>
                      <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Connect with other founding members and influence the roadmap
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{
                      background: 'rgba(59, 130, 246, 0.2)',
                      border: '1px solid rgba(59, 130, 246, 0.4)'
                    }}>
                      <span className="text-sm font-bold text-blue-400">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Platform Access</h4>
                      <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Get notified when your founding member access unlocks
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <GradientButton
                href="/dashboard"
                size="xl"
                ariaLabel="View your dashboard"
              >
                <Users className="w-5 h-5 mr-2" />
                View Dashboard
              </GradientButton>

              <button
                onClick={() => router.push('/icp/demo')}
                className="group px-8 py-4 rounded-2xl font-semibold text-lg min-w-[240px] transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 flex items-center justify-center gap-2"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#ffffff'
                }}
              >
                Try ICP Demo
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <FooterLayout variant="standard" theme="dark" />
    </div>
  );
}
