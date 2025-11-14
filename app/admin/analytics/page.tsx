'use client';

import { useState } from 'react';
import { DateRangeFilter } from './types';
import { ConversionFunnelChart } from './components/ConversionFunnelChart';
import { UserFlowChart } from './components/UserFlowChart';
import { AssessmentAnalytics } from './components/AssessmentAnalytics';
import { PublicPageAnalytics } from './components/PublicPageAnalytics';
import { PlatformUsageAnalytics } from './components/PlatformUsageAnalytics';
import {
  Calendar,
  TrendingUp,
  Users,
  FileText,
  Eye,
  Activity,
  Download,
} from 'lucide-react';

type ActiveSection =
  | 'overview'
  | 'funnel'
  | 'flow'
  | 'assessment'
  | 'public'
  | 'platform';

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
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">
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
          <nav className="flex gap-4 border-t border-gray-200 pt-4 pb-1 overflow-x-auto">
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
      </div>

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
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-6 h-6 mr-2 text-blue-600" />
          Conversion Funnel
        </h2>
        <ConversionFunnelChart dateRange={dateRange} />
      </section>

      {/* Assessment Analytics */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <FileText className="w-6 h-6 mr-2 text-purple-600" />
          Assessment Performance
        </h2>
        <AssessmentAnalytics dateRange={dateRange} />
      </section>

      {/* Platform Usage */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <Activity className="w-6 h-6 mr-2 text-green-600" />
          Platform Usage
        </h2>
        <PlatformUsageAnalytics dateRange={dateRange} />
      </section>

      {/* User Flow */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <Users className="w-6 h-6 mr-2 text-orange-600" />
          User Flow Patterns
        </h2>
        <UserFlowChart dateRange={dateRange} />
      </section>

      {/* Public Pages */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <Eye className="w-6 h-6 mr-2 text-pink-600" />
          Public Page Performance
        </h2>
        <PublicPageAnalytics dateRange={dateRange} />
      </section>
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
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium transition-colors whitespace-nowrap ${
        active
          ? 'bg-white text-blue-600 border-t-2 border-x border-blue-600 -mb-px'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
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
      <Calendar className="w-5 h-5 text-gray-400" />

      {/* Preset Buttons */}
      <div className="flex gap-2">
        {presets.map((p) => (
          <button
            key={p.preset}
            onClick={() => handlePresetChange(p.preset)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              dateRange.preset === p.preset && !isCustom
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {p.label}
          </button>
        ))}
        <button
          onClick={() => setIsCustom(!isCustom)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            isCustom
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Custom
        </button>
      </div>

      {/* Custom Date Inputs */}
      {isCustom && (
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateRange.start_date.split('T')[0]}
            onChange={(e) => handleCustomChange('start_date', e.target.value + 'T00:00:00Z')}
            className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm"
          />
          <span className="text-gray-500">to</span>
          <input
            type="date"
            value={dateRange.end_date.split('T')[0]}
            onChange={(e) => handleCustomChange('end_date', e.target.value + 'T23:59:59Z')}
            className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm"
          />
        </div>
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
