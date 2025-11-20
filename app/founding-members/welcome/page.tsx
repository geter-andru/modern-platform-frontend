'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/lib/auth';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Calendar,
  Users,
  Zap,
  MessageSquare,
  Award,
  Clock,
  ArrowRight,
  Sparkles,
  Shield,
  TrendingUp,
  Download
} from 'lucide-react';
import { AuthLoadingScreen } from '../../../src/shared/components/auth/AuthLoadingScreen';

interface FoundingMemberData {
  founding_member_number: number | null;
  access_granted_date: string;
  is_founding_member: boolean;
  has_early_access: boolean;
  forever_lock_price: number;
  assessment_completed: boolean;
}

export default function FoundingMemberWelcomePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [memberData, setMemberData] = useState<FoundingMemberData | null>(null);
  const [loading, setLoading] = useState(true);
  const [daysUntilLaunch, setDaysUntilLaunch] = useState(0);
  const [downloadingBadge, setDownloadingBadge] = useState(false);

  // Download founding member badge
  const handleDownloadBadge = async () => {
    if (!user?.id || !memberData?.is_founding_member) return;

    setDownloadingBadge(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/admin/founding-member/${user.id}/badge`,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `andru-beta-user-${memberData.founding_member_number || 'certificate'}.svg`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.error('Failed to download badge:', response.status);
        alert('Failed to download badge. Please try again.');
      }
    } catch (error) {
      console.error('Error downloading badge:', error);
      alert('Failed to download badge. Please try again.');
    } finally {
      setDownloadingBadge(false);
    }
  };

  // Calculate days until December 1, 2025
  useEffect(() => {
    const launchDate = new Date('2025-12-01T00:00:00Z');
    const today = new Date();
    const diffTime = launchDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDaysUntilLaunch(diffDays > 0 ? diffDays : 0);
  }, []);

  // Fetch founding member data
  useEffect(() => {
    const fetchMemberData = async () => {
      if (!user?.id) return;

      try {
        // Call the new founding member endpoint
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/admin/founding-member/${user.id}`, {
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        if (response.ok) {
          const result = await response.json();

          if (result.success && result.data) {
            setMemberData({
              founding_member_number: result.data.founding_member_number,
              access_granted_date: result.data.access_granted_date,
              is_founding_member: result.data.is_founding_member,
              has_early_access: result.data.has_early_access,
              forever_lock_price: result.data.forever_lock_price,
              assessment_completed: result.data.assessment_completed
            });
          } else {
            console.error('Invalid API response:', result);
          }
        } else {
          console.error('API request failed:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching founding member data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user) {
      fetchMemberData();
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return <AuthLoadingScreen />;
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  const benefits = [
    {
      icon: Shield,
      title: 'Forever Price Lock',
      description: '$750/month when platform launches',
      highlight: 'vs. $1,250/month standard',
      savings: '$6,000/year saved, every year'
    },
    {
      icon: Zap,
      title: 'Early Access',
      description: 'Tools unlock as we build them',
      highlight: 'Test features before anyone else',
      savings: 'Your feedback shapes the product'
    },
    {
      icon: Users,
      title: 'Private Community',
      description: 'Founding Member Slack (Dec 1)',
      highlight: 'Direct access to founders',
      savings: 'Network with technical founders'
    },
    {
      icon: MessageSquare,
      title: '1:1 Strategy Sessions',
      description: '2 hours with founder',
      highlight: 'Sales hiring guidance',
      savings: 'ICP workshop & deal reviews'
    },
    {
      icon: TrendingUp,
      title: 'Priority Support',
      description: 'First in line for new features',
      highlight: 'Dedicated support channel',
      savings: 'Feature request influence'
    }
  ];

  const timeline = [
    {
      status: 'complete',
      title: 'TODAY',
      items: [
        "You're officially on the paid waitlist",
        'Magic link sent to your email',
        'Forever price lock secured at $750/month'
      ]
    },
    {
      status: 'active',
      title: 'NOW - DECEMBER 1, 2025',
      items: [
        'Early access to tools as they roll out',
        'Direct email support from founders',
        'Priority feature requests'
      ]
    },
    {
      status: 'upcoming',
      title: 'DECEMBER 1, 2025',
      items: [
        'Full platform access unlocks',
        'Private Slack community launches',
        'Your $750/month forever pricing activates',
        'Complete ICP analysis suite available'
      ]
    }
  ];

  const faqs = [
    {
      question: 'When will I get access?',
      answer: 'Full platform access unlocks December 1, 2025. Early access to individual tools begins rolling out starting now.'
    },
    {
      question: 'What if I want to cancel?',
      answer: "You can cancel anytime with no penalties. However, you'll lose your $750/month forever price lock and would pay $1,250/month if you rejoin."
    },
    {
      question: 'How do I login?',
      answer: 'Check your email for the magic link. Click it to access your dashboard. You can also login anytime at platform.andru-ai.com/login'
    },
    {
      question: 'What should I do now?',
      answer: '1. Join the Slack community\n2. Book your 1:1 strategy session\n3. Take the free ICP assessment (if you haven\'t)\n4. We\'ll email you when new tools unlock'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-gray-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          {/* Founding Member Badge */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 blur-2xl opacity-30" />
              <div className="relative bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 px-8 py-3 rounded-full font-bold text-lg flex items-center gap-2 shadow-2xl">
                <Award className="w-6 h-6" />
                FOUNDING MEMBER #{memberData?.founding_member_number || '—'}
              </div>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            Welcome to the Founding 65 🎉
          </motion.h1>

          {/* Subheadline */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-12"
          >
            <p className="text-xl text-gray-300 mb-4">
              You've secured your spot as Founding Member #{memberData?.founding_member_number || '—'} of 65
            </p>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-white">
                Your forever price: <span className="text-green-400">${memberData?.forever_lock_price || 750}/month</span> (locked in)
              </p>
              <p className="text-gray-400">
                Standard pricing: <span className="line-through">${1250}/month</span>
              </p>
              <p className="text-lg text-yellow-400 font-semibold">
                You're saving $6,000/year. Every year. Forever.
              </p>
            </div>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="max-w-md mx-auto mb-12"
          >
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Founding Members</span>
              <span>{memberData?.founding_member_number || 0} of 65 spots claimed</span>
            </div>
            <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000"
                style={{ width: `${((memberData?.founding_member_number || 0) / 65) * 100}%` }}
              />
            </div>
          </motion.div>

          {/* Download Beta User Badge */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="max-w-sm mx-auto mb-8 text-center"
          >
            <button
              onClick={handleDownloadBadge}
              disabled={downloadingBadge || !memberData?.is_founding_member}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-gray-900 font-semibold px-6 py-3 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              <Download className="w-5 h-5" />
              {downloadingBadge ? 'Downloading...' : 'Download Your Beta User Badge'}
            </button>
            <p className="text-gray-500 text-sm mt-2">Share your status on social media!</p>
          </motion.div>

          {/* Countdown Timer */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="max-w-sm mx-auto mb-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center"
          >
            <Clock className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-gray-400 text-sm mb-1">Full Platform Access In</p>
            <p className="text-4xl font-bold text-white">{daysUntilLaunch} Days</p>
            <p className="text-gray-500 text-xs mt-1">December 1, 2025</p>
          </motion.div>
        </div>
      </div>

      {/* Immediate Next Steps */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Your Next Steps
        </h2>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {/* Book Strategy Session */}
          <motion.a
            href="https://calendly.com/andru-founder/strategy-session"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="group relative bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-xl border border-yellow-500/30 rounded-2xl p-6 hover:border-yellow-400/50 transition-all duration-300 cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/0 to-orange-500/0 group-hover:from-yellow-500/10 group-hover:to-orange-500/10 rounded-2xl transition-all duration-300" />
            <div className="relative">
              <Calendar className="w-12 h-12 text-yellow-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Book Strategy Session</h3>
              <p className="text-gray-400 mb-4">
                2 hours with founder - $1,000 value included free
              </p>
              <div className="flex items-center text-yellow-400 font-semibold">
                Book Now <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.a>

          {/* Check Email */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          >
            <CheckCircle2 className="w-12 h-12 text-green-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Check Your Email</h3>
            <p className="text-gray-400 mb-4">
              Click the magic link to set up your account and access your dashboard
            </p>
            <div className="text-gray-500 text-sm">
              Sent to {user?.email}
            </div>
          </motion.div>

          {/* Take Assessment */}
          <motion.button
            onClick={() => router.push('/assessment')}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-purple-400/50 transition-all duration-300 text-left"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 rounded-2xl transition-all duration-300" />
            <div className="relative">
              <Sparkles className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                {memberData?.assessment_completed ? 'View Your ICP Analysis' : 'Take the ICP Assessment'}
              </h3>
              <p className="text-gray-400 mb-4">
                {memberData?.assessment_completed
                  ? 'Review your free ICP analysis and insights'
                  : 'Get your free analysis while you wait'
                }
              </p>
              <div className="flex items-center text-purple-400 font-semibold">
                {memberData?.assessment_completed ? 'View Results' : 'Start Assessment'}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.button>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          What Happens Next
        </h2>

        <div className="space-y-8">
          {timeline.map((phase, index) => (
            <motion.div
              key={phase.title}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1 + index * 0.1 }}
              className="relative"
            >
              <div className={`flex items-start gap-4 ${
                phase.status === 'complete' ? 'opacity-100' :
                phase.status === 'active' ? 'opacity-100' :
                'opacity-60'
              }`}>
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                  phase.status === 'complete' ? 'bg-green-500/20 text-green-400 border-2 border-green-500' :
                  phase.status === 'active' ? 'bg-blue-500/20 text-blue-400 border-2 border-blue-500 animate-pulse' :
                  'bg-gray-500/20 text-gray-500 border-2 border-gray-500'
                }`}>
                  {phase.status === 'complete' ? <CheckCircle2 className="w-6 h-6" /> :
                   phase.status === 'active' ? <Zap className="w-6 h-6" /> :
                   <Clock className="w-6 h-6" />}
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">{phase.title}</h3>
                  <ul className="space-y-2">
                    {phase.items.map((item, i) => (
                      <li key={i} className="text-gray-400 flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {index < timeline.length - 1 && (
                <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gradient-to-b from-blue-500/50 to-transparent"
                     style={{ height: '100%' }} />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          What You Get as a Founding Member
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-blue-400/50 transition-all duration-300"
              >
                <Icon className="w-10 h-10 text-blue-400 mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">{benefit.title}</h3>
                <p className="text-gray-400 text-sm mb-2">{benefit.description}</p>
                <p className="text-gray-500 text-xs mb-1">{benefit.highlight}</p>
                <p className="text-blue-400 text-xs font-semibold">{benefit.savings}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.question}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.5 + index * 0.1 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
            >
              <h3 className="text-lg font-bold text-white mb-3">{faq.question}</h3>
              <p className="text-gray-400 whitespace-pre-line">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2 }}
          className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-white/10 rounded-2xl p-12"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Questions? We're Here to Help
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Have questions? Reach out to our founding team at founders@andru-ai.com
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="mailto:founders@andru-ai.com"
              className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
              Email Founding Team
            </a>
            <a
              href="https://calendly.com/andru-founder/strategy-session"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-semibold transition-colors border border-white/20"
            >
              <Calendar className="w-5 h-5" />
              Book Strategy Call
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
