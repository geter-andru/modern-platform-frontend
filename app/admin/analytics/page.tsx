'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/src/shared/components/design-system';
import { DateRangeFilter } from './types';
import { ConversionFunnelChart } from './components/ConversionFunnelChart';
import { UserFlowChart } from './components/UserFlowChart';
import { AssessmentAnalytics } from './components/AssessmentAnalytics';
import { PublicPageAnalytics } from './components/PublicPageAnalytics';
import { PlatformUsageAnalytics } from './components/PlatformUsageAnalytics';
import { ScenarioPageAnalytics } from './components/ScenarioPageAnalytics';
import {
  Calendar,
  TrendingUp,
  Users,
  FileText,
  Eye,
  Activity,
  Download,
  MapPin,
} from 'lucide-react';

type ActiveSection =
  | 'overview'
  | 'funnel'
  | 'flow'
  | 'assessment'
  | 'public'
  | 'platform'
  | 'scenarios';

/**
 * Admin Analytics Dashboard Page
 *
 * Comprehensive analytics dashboard featuring:
 * - Conversion funnel (Visit → Assessment → Signup → Payment)
 * - User flow analysis (navigation patterns and journeys)
 * - Assessment analytics (completion rates, scores, companies)
 * - Public page analytics (visitor tracking, CTA performance, UTM sources)
 * - Platform usage (authenticated user behavior, tool usage)
 */
export default function AnalyticsPage() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('overview');
  const [dateRange, setDateRange] = useState<DateRangeFilter>(() => getDefaultDateRange());

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Page Header */}
      <GlassCard className="border-b border-white/10 rounded-none">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
              <p className="text-sm text-white/60 mt-1">
                Full-funnel analytics from anonymous visitors to paying customers
              </p>
            </div>

            {/* Date Range Selector */}
            <DateRangeSelector
              dateRange={dateRange}
              onChange={setDateRange}
            />
          </div>
        </div>

        {/* Section Navigation */}
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex gap-4 border-t border-white/10 pt-4 pb-1 overflow-x-auto">
            <NavButton
              icon={<TrendingUp className="w-4 h-4" />}
              label="Overview"
              active={activeSection === 'overview'}
              onClick={() => setActiveSection('overview')}
            />
            <NavButton
              icon={<TrendingUp className="w-4 h-4" />}
              label="Conversion Funnel"
              active={activeSection === 'funnel'}
              onClick={() => setActiveSection('funnel')}
            />
            <NavButton
              icon={<Users className="w-4 h-4" />}
              label="User Flow"
              active={activeSection === 'flow'}
              onClick={() => setActiveSection('flow')}
            />
            <NavButton
              icon={<FileText className="w-4 h-4" />}
              label="Assessment"
              active={activeSection === 'assessment'}
              onClick={() => setActiveSection('assessment')}
            />
            <NavButton
              icon={<MapPin className="w-4 h-4" />}
              label="Scenario Pages"
              active={activeSection === 'scenarios'}
              onClick={() => setActiveSection('scenarios')}
            />
            <NavButton
              icon={<Eye className="w-4 h-4" />}
              label="Public Pages"
              active={activeSection === 'public'}
              onClick={() => setActiveSection('public')}
            />
            <NavButton
              icon={<Activity className="w-4 h-4" />}
              label="Platform Usage"
              active={activeSection === 'platform'}
              onClick={() => setActiveSection('platform')}
            />
          </nav>
        </div>
      </GlassCard>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeSection === 'overview' && (
          <OverviewSection dateRange={dateRange} />
        )}
        {activeSection === 'funnel' && (
          <ConversionFunnelChart dateRange={dateRange} />
        )}
        {activeSection === 'flow' && (
          <UserFlowChart dateRange={dateRange} />
        )}
        {activeSection === 'assessment' && (
          <AssessmentAnalytics dateRange={dateRange} />
        )}
        {activeSection === 'scenarios' && (
          <ScenarioPageAnalytics dateRange={dateRange} />
        )}
        {activeSection === 'public' && (
          <PublicPageAnalytics dateRange={dateRange} />
        )}
        {activeSection === 'platform' && (
          <PlatformUsageAnalytics dateRange={dateRange} />
        )}
      </div>
    </div>
  );
}

/**
 * Overview Section Component
 * Shows all analytics in a single view
 */
interface OverviewSectionProps {
  dateRange: DateRangeFilter;
}

function OverviewSection({ dateRange }: OverviewSectionProps) {
  return (
    <div className="space-y-8">
      {/* Conversion Funnel */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
          <TrendingUp className="w-6 h-6 mr-2 text-blue-400" />
          Conversion Funnel
        </h2>
        <ConversionFunnelChart dateRange={dateRange} />
      </motion.section>

      {/* Scenario Pages */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
          <MapPin className="w-6 h-6 mr-2 text-indigo-400" />
          Scenario Page Performance
        </h2>
        <ScenarioPageAnalytics dateRange={dateRange} />
      </motion.section>

      {/* Assessment Analytics */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
          <FileText className="w-6 h-6 mr-2 text-purple-400" />
          Assessment Performance
        </h2>
        <AssessmentAnalytics dateRange={dateRange} />
      </motion.section>

      {/* Platform Usage */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
          <Activity className="w-6 h-6 mr-2 text-green-400" />
          Platform Usage
        </h2>
        <PlatformUsageAnalytics dateRange={dateRange} />
      </motion.section>

      {/* User Flow */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
          <Users className="w-6 h-6 mr-2 text-orange-400" />
          User Flow Patterns
        </h2>
        <UserFlowChart dateRange={dateRange} />
      </motion.section>

      {/* Public Pages */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
          <Eye className="w-6 h-6 mr-2 text-pink-400" />
          Public Page Performance
        </h2>
        <PublicPageAnalytics dateRange={dateRange} />
      </motion.section>
    </div>
  );
}

/**
 * Navigation Button Component
 */
interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

function NavButton({ icon, label, active, onClick }: NavButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 whitespace-nowrap ${
        active
          ? 'bg-gradient-to-br from-brand-primary to-blue-600 text-white shadow-lg shadow-brand/30'
          : 'text-white/70 hover:text-white hover:bg-white/10'
      }`}
    >
      {icon}
      <span>{label}</span>
    </motion.button>
  );
}

/**
 * Date Range Selector Component
 */
interface DateRangeSelectorProps {
  dateRange: DateRangeFilter;
  onChange: (range: DateRangeFilter) => void;
}

function DateRangeSelector({ dateRange, onChange }: DateRangeSelectorProps) {
  const [isCustom, setIsCustom] = useState(false);

  const presets: Array<{ label: string; preset: DateRangeFilter['preset'] }> = [
    { label: 'Today', preset: 'today' },
    { label: 'Last 7 Days', preset: 'last_7_days' },
    { label: 'Last 30 Days', preset: 'last_30_days' },
    { label: 'Last 90 Days', preset: 'last_90_days' },
  ];

  const handlePresetChange = (preset: DateRangeFilter['preset']) => {
    const range = getDateRangeFromPreset(preset);
    onChange(range);
    setIsCustom(false);
  };

  const handleCustomChange = (field: 'start_date' | 'end_date', value: string) => {
    onChange({
      ...dateRange,
      [field]: value,
      preset: 'custom',
    });
  };

  return (
    <div className="flex items-center gap-3">
      <Calendar className="w-5 h-5 text-white/60" />

      {/* Preset Buttons */}
      <div className="flex gap-2">
        {presets.map((p) => (
          <motion.button
            key={p.preset}
            onClick={() => handlePresetChange(p.preset)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
              dateRange.preset === p.preset && !isCustom
                ? 'bg-gradient-to-br from-brand-primary to-blue-600 text-white shadow-lg shadow-brand/30'
                : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
            }`}
          >
            {p.label}
          </motion.button>
        ))}
        <motion.button
          onClick={() => setIsCustom(!isCustom)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
            isCustom
              ? 'bg-gradient-to-br from-brand-primary to-blue-600 text-white shadow-lg shadow-brand/30'
              : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
          }`}
        >
          Custom
        </motion.button>
      </div>

      {/* Custom Date Inputs */}
      {isCustom && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <input
            type="date"
            value={dateRange.start_date.split('T')[0]}
            onChange={(e) => handleCustomChange('start_date', e.target.value + 'T00:00:00Z')}
            className="px-3 py-1.5 rounded-lg border border-white/20 bg-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
          <span className="text-white/60">to</span>
          <input
            type="date"
            value={dateRange.end_date.split('T')[0]}
            onChange={(e) => handleCustomChange('end_date', e.target.value + 'T23:59:59Z')}
            className="px-3 py-1.5 rounded-lg border border-white/20 bg-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </motion.div>
      )}
    </div>
  );
}

/**
 * Helper function to get default date range (last 30 days)
 */
function getDefaultDateRange(): DateRangeFilter {
  return getDateRangeFromPreset('last_30_days');
}

/**
 * Helper function to convert preset to date range
 */
function getDateRangeFromPreset(preset: DateRangeFilter['preset']): DateRangeFilter {
  const now = new Date();
  const end = now.toISOString();
  let start: Date;

  switch (preset) {
    case 'today':
      start = new Date(now.setHours(0, 0, 0, 0));
      break;
    case 'last_7_days':
      start = new Date(now.setDate(now.getDate() - 7));
      break;
    case 'last_30_days':
      start = new Date(now.setDate(now.getDate() - 30));
      break;
    case 'last_90_days':
      start = new Date(now.setDate(now.getDate() - 90));
      break;
    default:
      start = new Date(now.setDate(now.getDate() - 30));
  }

  return {
    start_date: start.toISOString(),
    end_date: end,
    preset,
  };
}
