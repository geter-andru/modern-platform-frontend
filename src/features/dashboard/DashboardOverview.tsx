import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Zap, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Lightbulb, 
  ArrowRight,
  BarChart3,
  UserCheck,
  FileText,
  Calculator
} from 'lucide-react';

interface CoreTool {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  status: 'available' | 'coming-soon' | 'beta';
  features: string[];
  stats: string[];
  bgColor: string;
  borderColor: string;
  color: string;
}

export default function DashboardOverview() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [hasAssessment, setHasAssessment] = useState<boolean>(false);
  const [assessmentLevel, setAssessmentLevel] = useState<any>(null);
  const [toolAccess, setToolAccess] = useState<any>(null);
  const [loadingAssessment, setLoadingAssessment] = useState<boolean>(true);

  const coreTools: CoreTool[] = [
    {
      id: 'icp-analysis',
      name: 'ICP Analysis',
      description: 'Build your ideal customer profile with AI-powered insights and persona generation',
      icon: UserCheck,
      status: 'available',
      features: ['AI Persona Generation', 'Market Research', 'Competitor Analysis', 'Pain Point Mapping'],
      stats: ['95% Accuracy', '150+ Templates', 'Real-time Data'],
      bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20',
      borderColor: 'border-blue-200 dark:border-blue-700',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'dashboard',
      name: 'Revenue Dashboard',
      description: 'Track performance, monitor KPIs, and get actionable insights for revenue growth',
      icon: BarChart3,
      status: 'available',
      features: ['Real-time Analytics', 'KPI Tracking', 'Performance Insights', 'Custom Reports'],
      stats: ['Live Updates', '50+ Metrics', 'Export Ready'],
      bgColor: 'bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20',
      borderColor: 'border-green-200 dark:border-green-700',
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'resources',
      name: 'Resources Library',
      description: 'Access personalized templates, guides, and tools based on your ICP analysis',
      icon: FileText,
      status: 'coming-soon',
      features: ['Personalized Templates', 'Industry Guides', 'Best Practices', 'Custom Content'],
      stats: ['500+ Resources', 'AI-Generated', 'Industry-Specific'],
      bgColor: 'bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/20 dark:to-violet-900/20',
      borderColor: 'border-purple-200 dark:border-purple-700',
      color: 'from-purple-500 to-violet-600'
    },
    {
      id: 'business-case',
      name: 'Business Case Builder',
      description: 'Create compelling business cases and ROI documentation for your initiatives',
      icon: Calculator,
      status: 'coming-soon',
      features: ['ROI Calculator', 'Business Case Templates', 'Financial Modeling', 'Stakeholder Reports'],
      stats: ['Automated Calculations', 'Professional Templates', 'Export Ready'],
      bgColor: 'bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/20',
      borderColor: 'border-orange-200 dark:border-orange-700',
      color: 'from-orange-500 to-amber-600'
    }
  ];

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString());
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const checkAssessmentStatus = async () => {
      try {
        setLoadingAssessment(true);
        const response = await fetch('/api/assessment/status');
        const result = await response.json() as {
          success: boolean;
          data?: {
            hasAssessment: boolean;
            level?: any;
            toolAccess?: any;
          };
        };
        
        if (result.success) {
          setHasAssessment(result.data?.hasAssessment || false);
          if (result.data?.hasAssessment) {
            setAssessmentLevel(result.data.level);
            setToolAccess(result.data.toolAccess);
          }
        }
      } catch (error) {
        console.log('No assessment data found or error checking status:', error);
        setHasAssessment(false);
      } finally {
        setLoadingAssessment(false);
      }
    };

    checkAssessmentStatus();
  }, []);

  const getToolStatus = (toolId: string): 'available' | 'coming-soon' | 'beta' | 'locked' => {
    if (!hasAssessment) {
      // If no assessment, only ICP Analysis is available
      return toolId === 'icp-analysis' ? 'available' : 'locked';
    }
    
    if (!toolAccess) return 'locked';
    
    switch (toolId) {
      case 'icp-analysis':
        return 'available'; // Always available
      case 'dashboard':
        return 'available'; // Always available
      case 'business-case':
        return toolAccess.businessCaseBuilder ? 'available' : 'locked';
      case 'resources':
        return toolAccess.advancedAnalytics ? 'available' : 'locked';
      default:
        return 'coming-soon';
    }
  };

  const handleToolClick = (tool: CoreTool) => {
    const status = getToolStatus(tool.id);
    if (status === 'available') {
      router.push(`/${tool.id}`);
    } else if (status === 'locked' && !hasAssessment) {
      // Redirect to assessment if no assessment completed
      window.open('https://andru-ai.com/assessment', '_blank');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
            Available
          </span>
        );
      case 'coming-soon':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
            Coming Soon
          </span>
        );
      case 'beta':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
            Beta
          </span>
        );
      case 'locked':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">
            {!hasAssessment ? 'Complete Assessment' : 'Level Required'}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background-primary">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="gradient-strategic rounded-2xl p-8 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Zap className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                Welcome to H&S Revenue Intelligence Platform
              </h1>
              <p className="text-blue-100 mt-1">
                AI-powered tools to accelerate your revenue growth
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-accent-success" />
              <div>
                <p className="text-sm text-blue-100">Revenue Growth</p>
                <p className="text-lg font-semibold">35% Average Increase</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-brand-primary" />
              <div>
                <p className="text-sm text-blue-100">Active Users</p>
                <p className="text-lg font-semibold">150+ Technical Founders</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DollarSign className="w-6 h-6 text-brand-accent" />
              <div>
                <p className="text-sm text-blue-100">Revenue Generated</p>
                <p className="text-lg font-semibold">$2.3M+ Additional</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8"
      >
        <div className="bg-gradient-primary/10 border border-brand-primary/20 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                🧠 Cumulative Intelligence Approach
              </h3>
              <p className="text-text-secondary">
                Each tool builds upon insights from previous tools, creating unmatched personalization. 
                Start with ICP Analysis to generate your ideal customer profile, then use those insights 
                to power your Dashboard, Resources Library, and Business Case Builder.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Assessment Status Card */}
      {!loadingAssessment && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          {!hasAssessment ? (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    🎯 Complete Your Revenue Readiness Assessment
                  </h3>
                  <p className="text-text-secondary">
                    Get personalized insights and unlock advanced tools based on your competency level.
                  </p>
                </div>
                <button
                  onClick={() => window.open('https://andru-ai.com/assessment', '_blank')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Start Assessment
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    🏆 Assessment Complete - {assessmentLevel?.name || 'Level Achieved'}
                  </h3>
                  <p className="text-text-secondary">
                    {assessmentLevel?.description || 'You have access to personalized tools and insights.'}
                  </p>
                </div>
                <button
                  onClick={() => router.push('/assessment')}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  View Results
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold text-text-primary mb-6">
          Core Revenue Intelligence Tools
        </h2>
        
        <div className="grid lg:grid-cols-2 gap-6">
          {coreTools.map((tool, index) => {
            const IconComponent = tool.icon;
            const dynamicStatus = getToolStatus(tool.id);
            const isAvailable = dynamicStatus === 'available';
            
            return (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                onClick={() => handleToolClick(tool)}
                className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                  isAvailable
                    ? 'cursor-pointer hover:shadow-lg hover:scale-105'
                    : 'cursor-not-allowed opacity-75'
                } ${tool.bgColor} ${tool.borderColor}`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 bg-gradient-to-br ${tool.color} rounded-xl flex items-center justify-center`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-text-primary">
                          {tool.name}
                        </h3>
                        {getStatusBadge(dynamicStatus)}
                      </div>
                    </div>
                    {isAvailable && (
                      <ArrowRight className="w-5 h-5 text-text-muted group-hover:text-text-primary transition-colors" />
                    )}
                  </div>
                  
                  <p className="text-text-secondary mb-4">
                    {tool.description}
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold text-text-primary mb-2">
                        Key Features:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {tool.features.map((feature, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-surface/50 text-xs font-medium text-text-secondary rounded-md"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold text-text-primary mb-2">
                        Stats:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {tool.stats.map((stat, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-surface text-xs font-medium text-text-muted rounded-md"
                          >
                            {stat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {isAvailable && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-background-secondary border border-border-standard rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          🚀 Quick Start Guide
        </h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-8 h-8 bg-brand-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-sm font-bold text-brand-primary">1</span>
            </div>
            <p className="text-sm text-text-secondary">
              Start with <strong>ICP Analysis</strong> to define your ideal customer
            </p>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 bg-brand-secondary/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-sm font-bold text-brand-secondary">2</span>
            </div>
            <p className="text-sm text-text-secondary">
              Use insights in <strong>Dashboard</strong> for performance tracking
            </p>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 bg-brand-accent/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-sm font-bold text-brand-accent">3</span>
            </div>
            <p className="text-sm text-text-secondary">
              Generate <strong>Resources</strong> from your ICP and personas
            </p>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 bg-accent-warning/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-sm font-bold text-accent-warning">4</span>
            </div>
            <p className="text-sm text-text-secondary">
              Build <strong>Business Cases</strong> with ROI documentation
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// export default DashboardOverview; // Already exported above