'use client';

import { useState, useEffect } from 'react';
import {
  PublicPageStats,
  CTAPerformance,
  UTMSourceStats,
  DateRangeFilter,
} from '../types';
import {
  fetchPublicPageStats,
  fetchCTAPerformance,
  fetchUTMSourceStats,
} from '../utils/dataFetchers';
import { Eye, MousePointerClick, TrendingUp, ExternalLink, Clock, Users } from 'lucide-react';

interface PublicPageAnalyticsProps {
  dateRange: DateRangeFilter;
}

/**
 * Public Page Analytics Component
 *
 * Displays analytics for anonymous visitors on public pages:
 * - Page performance metrics (visits, bounce rate, time on page)
 * - CTA click-through rates
 * - UTM source attribution
 */
export function PublicPageAnalytics({ dateRange }: PublicPageAnalyticsProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageStats, setPageStats] = useState<PublicPageStats[]>([]);
  const [ctaPerformance, setCtaPerformance] = useState<CTAPerformance[]>([]);
  const [utmStats, setUtmStats] = useState<UTMSourceStats[]>([]);

  useEffect(() => {
    loadPublicPageData();
  }, [dateRange]);

  const loadPublicPageData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [pagesResult, ctaResult, utmResult] = await Promise.all([
        fetchPublicPageStats(dateRange),
        fetchCTAPerformance(dateRange),
        fetchUTMSourceStats(dateRange),
      ]);

      if (!pagesResult.success) {
        setError(pagesResult.error || 'Failed to load page stats');
        return;
      }
      if (!ctaResult.success) {
        setError(ctaResult.error || 'Failed to load CTA performance');
        return;
      }
      if (!utmResult.success) {
        setError(utmResult.error || 'Failed to load UTM stats');
        return;
      }

      setPageStats(pagesResult.data);
      setCtaPerformance(ctaResult.data);
      setUtmStats(utmResult.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading public page analytics...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-8">
        <div className="flex items-center text-red-600">
          <TrendingUp className="w-5 h-5 mr-2" />
          <span>Error: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Performance Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Page Performance</h2>
          <p className="text-sm text-gray-500 mt-1">
            Traffic, engagement, and conversion metrics by page
          </p>
        </div>

        <div className="overflow-x-auto">
          <PagePerformanceTable pages={pageStats} />
        </div>
      </div>

      {/* CTA Performance */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">CTA Performance</h2>
          <p className="text-sm text-gray-500 mt-1">
            Click-through rates and conversion by call-to-action
          </p>
        </div>

        <div className="p-6">
          <CTAPerformanceGrid ctas={ctaPerformance} />
        </div>
      </div>

      {/* UTM Source Attribution */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Traffic Sources</h2>
          <p className="text-sm text-gray-500 mt-1">
            Performance by UTM source, medium, and campaign
          </p>
        </div>

        <div className="overflow-x-auto">
          <UTMSourceTable sources={utmStats} />
        </div>
      </div>
    </div>
  );
}

/**
 * Page Performance Table Component
 */
interface PagePerformanceTableProps {
  pages: PublicPageStats[];
}

function PagePerformanceTable({ pages }: PagePerformanceTableProps) {
  if (pages.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 p-6">
        No page performance data available
      </div>
    );
  }

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead>
        <tr className="bg-gray-50">
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Page
          </th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            Total Visits
          </th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            Unique Visitors
          </th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            Avg Time
          </th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            Bounce Rate
          </th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            CTA Clicks
          </th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            Conversions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {pages.map((page) => (
          <tr key={page.page_path} className="hover:bg-gray-50">
            <td className="px-6 py-4 max-w-xs">
              <div className="flex items-center">
                <ExternalLink className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {page.page_title || page.page_path}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{page.page_path}</p>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right">
              <span className="text-sm font-bold text-gray-900">
                {page.total_visits.toLocaleString()}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right">
              <div className="flex items-center justify-end">
                <Users className="w-4 h-4 mr-1 text-gray-400" />
                <span className="text-sm text-gray-900">
                  {page.unique_visitors.toLocaleString()}
                </span>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right">
              <div className="flex items-center justify-end">
                <Clock className="w-4 h-4 mr-1 text-gray-400" />
                <span className="text-sm text-gray-900">
                  {formatDuration(page.avg_time_on_page)}
                </span>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                page.bounce_rate >= 70 ? 'bg-red-100 text-red-800' :
                page.bounce_rate >= 40 ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {page.bounce_rate.toFixed(1)}%
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right">
              <span className="text-sm text-gray-900">
                {page.cta_clicks} <span className="text-gray-500">({page.cta_click_rate.toFixed(1)}%)</span>
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                page.conversion_rate >= 5 ? 'bg-green-100 text-green-800' :
                page.conversion_rate >= 2 ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {page.conversion_count} ({page.conversion_rate.toFixed(1)}%)
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/**
 * CTA Performance Grid Component
 */
interface CTAPerformanceGridProps {
  ctas: CTAPerformance[];
}

function CTAPerformanceGrid({ ctas }: CTAPerformanceGridProps) {
  if (ctas.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No CTA performance data available
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {ctas.map((cta) => (
        <div
          key={`${cta.cta_text}-${cta.cta_location}`}
          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          {/* CTA Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-1">{cta.cta_text}</h3>
              <p className="text-sm text-gray-500">Location: {cta.cta_location}</p>
            </div>
            <MousePointerClick className="w-5 h-5 text-blue-500 flex-shrink-0 ml-2" />
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded p-2">
              <p className="text-xs text-gray-500">Impressions</p>
              <p className="text-lg font-bold text-gray-900">
                {cta.total_impressions.toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-50 rounded p-2">
              <p className="text-xs text-gray-500">Clicks</p>
              <p className="text-lg font-bold text-gray-900">
                {cta.total_clicks.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Rates */}
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-500 mb-1">Click-Through Rate</p>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
                cta.click_through_rate >= 10 ? 'bg-green-100 text-green-800' :
                cta.click_through_rate >= 5 ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {cta.click_through_rate.toFixed(1)}%
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Conversion Rate</p>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
                cta.conversion_rate >= 5 ? 'bg-green-100 text-green-800' :
                cta.conversion_rate >= 2 ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {cta.conversion_rate.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * UTM Source Table Component
 */
interface UTMSourceTableProps {
  sources: UTMSourceStats[];
}

function UTMSourceTable({ sources }: UTMSourceTableProps) {
  if (sources.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 p-6">
        No UTM source data available
      </div>
    );
  }

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead>
        <tr className="bg-gray-50">
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Source
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Medium
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Campaign
          </th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            Total Visits
          </th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            Unique Visitors
          </th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            Conversions
          </th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            Avg Time on Site
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {sources.map((source, index) => (
          <tr key={`${source.utm_source}-${source.utm_medium}-${source.utm_campaign}-${index}`} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="text-sm font-medium text-gray-900">
                {source.utm_source}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="text-sm text-gray-600">
                {source.utm_medium || '—'}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="text-sm text-gray-600">
                {source.utm_campaign || '—'}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right">
              <span className="text-sm font-bold text-gray-900">
                {source.total_visits.toLocaleString()}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right">
              <div className="flex items-center justify-end">
                <Users className="w-4 h-4 mr-1 text-gray-400" />
                <span className="text-sm text-gray-900">
                  {source.unique_visitors.toLocaleString()}
                </span>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                source.conversion_rate >= 5 ? 'bg-green-100 text-green-800' :
                source.conversion_rate >= 2 ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {source.conversions} ({source.conversion_rate.toFixed(1)}%)
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right">
              <div className="flex items-center justify-end">
                <Clock className="w-4 h-4 mr-1 text-gray-400" />
                <span className="text-sm text-gray-900">
                  {formatDuration(source.avg_time_on_site)}
                </span>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/**
 * Helper function to format duration
 */
function formatDuration(seconds: number): string {
  if (seconds === 0) return '—';

  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}
