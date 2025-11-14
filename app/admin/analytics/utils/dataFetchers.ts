// @ts-nocheck
/**
 * Analytics Data Fetchers
 *
 * Centralized data fetching utilities for analytics dashboard.
 * All functions include proper error handling, data validation, and transformation.
 */

import { supabase } from '@/app/lib/supabase/client';
import type {
  PublicPageStats,
  CTAPerformance,
  UTMSourceStats,
  AssessmentStats,
  AssessmentScoreDistribution,
  TopCompanyByAssessment,
  PlatformUsageStats,
  ToolUsageStats,
  NavigationPath,
  ConversionFunnel,
  FunnelStage,
  DateRangeFilter,
  AnalyticsAPIResponse,
  UserJourney,
} from '../types';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Format date for SQL queries
 */
function formatDateForSQL(date: Date): string {
  return date.toISOString();
}

/**
 * Get default date range (last 30 days)
 */
export function getDefaultDateRange(): DateRangeFilter {
  const end_date = new Date();
  const start_date = new Date();
  start_date.setDate(start_date.getDate() - 30);

  return {
    start_date: formatDateForSQL(start_date),
    end_date: formatDateForSQL(end_date),
    preset: 'last_30_days',
  };
}

/**
 * Safe number parsing with fallback
 */
function safeNumber(value: any, fallback: number = 0): number {
  const parsed = Number(value);
  return isNaN(parsed) ? fallback : parsed;
}

/**
 * Safe percentage calculation
 */
function safePercentage(numerator: number, denominator: number): number {
  if (denominator === 0) return 0;
  return Math.round((numerator / denominator) * 100 * 100) / 100; // 2 decimal places
}

// ============================================================================
// PUBLIC PAGE ANALYTICS
// ============================================================================

/**
 * Fetch public page performance statistics
 */
export async function fetchPublicPageStats(
  dateRange: DateRangeFilter
): Promise<AnalyticsAPIResponse<PublicPageStats[]>> {
  try {
    const { data, error } = (await supabase.rpc('get_public_page_stats', {
      start_date: dateRange.start_date,
      end_date: dateRange.end_date,
    } as any)) as { data: any; error: any };

    if (error) {
      // If RPC doesn't exist, fall back to manual query
      return await fetchPublicPageStatsManual(dateRange);
    }

    return {
      success: true,
      data: data || [],
      metadata: {
        total_count: data?.length || 0,
        filtered_count: data?.length || 0,
        date_range: dateRange,
        generated_at: new Date().toISOString(),
      },
    };
  } catch (err) {
    console.error('Error fetching public page stats:', err);
    return {
      success: false,
      data: [],
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

/**
 * Manual fallback for public page stats
 */
async function fetchPublicPageStatsManual(
  dateRange: DateRangeFilter
): Promise<AnalyticsAPIResponse<PublicPageStats[]>> {
  try {
    const { data: visits, error } = await supabase
      .from('public_page_visits')
      .select('*')
      .gte('created_at', dateRange.start_date)
      .lte('created_at', dateRange.end_date) as { data: any[] | null; error: any };

    if (error) throw error;

    // Group by page_path and calculate stats
    const pageMap = new Map<string, any>();

    visits?.forEach((visit) => {
      const key = visit.page_path;
      if (!pageMap.has(key)) {
        pageMap.set(key, {
          page_path: visit.page_path,
          page_title: visit.page_title,
          visits: [],
          unique_sessions: new Set(),
          cta_clicks: 0,
          conversions: 0,
        });
      }

      const page = pageMap.get(key);
      page.visits.push(visit);
      page.unique_sessions.add(visit.anonymous_session_id);
      if (visit.clicked_cta) page.cta_clicks++;
      if (visit.attributed_conversion) page.conversions++;
    });

    // Transform to PublicPageStats
    const stats: PublicPageStats[] = Array.from(pageMap.values()).map((page) => {
      const totalVisits = page.visits.length;
      const uniqueVisitors = page.unique_sessions.size;

      // Calculate averages
      const validTimeOnPage = page.visits.filter((v: any) => v.time_on_page !== null);
      const avgTimeOnPage = validTimeOnPage.length > 0
        ? validTimeOnPage.reduce((sum: number, v: any) => sum + v.time_on_page, 0) / validTimeOnPage.length
        : 0;

      const validScrollDepth = page.visits.filter((v: any) => v.scroll_depth !== null);
      const avgScrollDepth = validScrollDepth.length > 0
        ? validScrollDepth.reduce((sum: number, v: any) => sum + v.scroll_depth, 0) / validScrollDepth.length
        : 0;

      // Bounce rate: sessions with only 1 page view
      // This is a simplified calculation - would need session-level data for accuracy
      const bounceRate = 0; // TODO: Implement proper bounce rate calculation

      return {
        page_path: page.page_path,
        page_title: page.page_title,
        total_visits: totalVisits,
        unique_visitors: uniqueVisitors,
        avg_time_on_page: Math.round(avgTimeOnPage),
        avg_scroll_depth: Math.round(avgScrollDepth),
        bounce_rate: bounceRate,
        cta_clicks: page.cta_clicks,
        cta_click_rate: safePercentage(page.cta_clicks, totalVisits),
        conversion_count: page.conversions,
        conversion_rate: safePercentage(page.conversions, totalVisits),
      };
    });

    // Sort by total visits descending
    stats.sort((a, b) => b.total_visits - a.total_visits);

    return {
      success: true,
      data: stats,
      metadata: {
        total_count: stats.length,
        filtered_count: stats.length,
        date_range: dateRange,
        generated_at: new Date().toISOString(),
      },
    };
  } catch (err) {
    console.error('Error in fetchPublicPageStatsManual:', err);
    return {
      success: false,
      data: [],
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

/**
 * Fetch CTA performance data
 */
export async function fetchCTAPerformance(
  dateRange: DateRangeFilter
): Promise<AnalyticsAPIResponse<CTAPerformance[]>> {
  try {
    const { data: visits, error } = await supabase
      .from('public_page_visits')
      .select('cta_text, cta_location, clicked_cta, attributed_conversion')
      .gte('created_at', dateRange.start_date)
      .lte('created_at', dateRange.end_date)
      .not('cta_text', 'is', null) as { data: any[] | null; error: any };

    if (error) throw error;

    // Group by CTA text and location
    const ctaMap = new Map<string, any>();

    visits?.forEach((visit) => {
      const key = `${visit.cta_text}|${visit.cta_location}`;
      if (!ctaMap.has(key)) {
        ctaMap.set(key, {
          cta_text: visit.cta_text,
          cta_location: visit.cta_location,
          impressions: 0,
          clicks: 0,
          conversions: 0,
        });
      }

      const cta = ctaMap.get(key);
      cta.impressions++;
      if (visit.clicked_cta) cta.clicks++;
      if (visit.attributed_conversion) cta.conversions++;
    });

    // Transform to CTAPerformance
    const performance: CTAPerformance[] = Array.from(ctaMap.values()).map((cta) => ({
      cta_text: cta.cta_text,
      cta_location: cta.cta_location,
      total_impressions: cta.impressions,
      total_clicks: cta.clicks,
      click_through_rate: safePercentage(cta.clicks, cta.impressions),
      conversions: cta.conversions,
      conversion_rate: safePercentage(cta.conversions, cta.clicks),
    }));

    // Sort by CTR descending
    performance.sort((a, b) => b.click_through_rate - a.click_through_rate);

    return {
      success: true,
      data: performance,
      metadata: {
        total_count: performance.length,
        filtered_count: performance.length,
        date_range: dateRange,
        generated_at: new Date().toISOString(),
      },
    };
  } catch (err) {
    console.error('Error fetching CTA performance:', err);
    return {
      success: false,
      data: [],
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

/**
 * Fetch UTM source statistics
 */
export async function fetchUTMSourceStats(
  dateRange: DateRangeFilter
): Promise<AnalyticsAPIResponse<UTMSourceStats[]>> {
  try {
    const { data: visits, error } = await supabase
      .from('public_page_visits')
      .select('utm_source, utm_medium, utm_campaign, anonymous_session_id, attributed_conversion, time_on_page')
      .gte('created_at', dateRange.start_date)
      .lte('created_at', dateRange.end_date)
      .not('utm_source', 'is', null) as { data: any[] | null; error: any };

    if (error) throw error;

    // Group by UTM source
    const utmMap = new Map<string, any>();

    visits?.forEach((visit) => {
      const key = `${visit.utm_source}|${visit.utm_medium || ''}|${visit.utm_campaign || ''}`;
      if (!utmMap.has(key)) {
        utmMap.set(key, {
          utm_source: visit.utm_source,
          utm_medium: visit.utm_medium,
          utm_campaign: visit.utm_campaign,
          visits: 0,
          unique_sessions: new Set(),
          conversions: 0,
          total_time: 0,
          time_count: 0,
        });
      }

      const utm = utmMap.get(key);
      utm.visits++;
      utm.unique_sessions.add(visit.anonymous_session_id);
      if (visit.attributed_conversion) utm.conversions++;
      if (visit.time_on_page) {
        utm.total_time += visit.time_on_page;
        utm.time_count++;
      }
    });

    // Transform to UTMSourceStats
    const stats: UTMSourceStats[] = Array.from(utmMap.values()).map((utm) => ({
      utm_source: utm.utm_source,
      utm_medium: utm.utm_medium,
      utm_campaign: utm.utm_campaign,
      total_visits: utm.visits,
      unique_visitors: utm.unique_sessions.size,
      conversions: utm.conversions,
      conversion_rate: safePercentage(utm.conversions, utm.unique_sessions.size),
      avg_time_on_site: utm.time_count > 0 ? Math.round(utm.total_time / utm.time_count) : 0,
    }));

    // Sort by conversions descending
    stats.sort((a, b) => b.conversions - a.conversions);

    return {
      success: true,
      data: stats,
      metadata: {
        total_count: stats.length,
        filtered_count: stats.length,
        date_range: dateRange,
        generated_at: new Date().toISOString(),
      },
    };
  } catch (err) {
    console.error('Error fetching UTM source stats:', err);
    return {
      success: false,
      data: [],
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

// ============================================================================
// ASSESSMENT ANALYTICS
// ============================================================================

/**
 * Fetch assessment statistics
 */
export async function fetchAssessmentStats(
  dateRange: DateRangeFilter
): Promise<AnalyticsAPIResponse<AssessmentStats>> {
  try {
    const { data: sessions, error } = await supabase
      .from('assessment_sessions')
      .select('*')
      .gte('created_at', dateRange.start_date)
      .lte('created_at', dateRange.end_date) as { data: any[] | null; error: any };

    if (error) throw error;

    const totalStarted = sessions?.length || 0;
    const completed = sessions?.filter((s) =>
      s.status === 'completed' || s.status === 'completed_awaiting_signup' || s.status === 'linked'
    ) || [];
    const abandoned = sessions?.filter((s) => s.status === 'abandoned') || [];
    const signups = sessions?.filter((s) => s.user_id !== null) || [];

    // Calculate scores
    const scoresOverall = completed
      .map((s) => s.overall_score)
      .filter((score): score is number => score !== null);
    const scoresBuyer = completed
      .map((s) => s.buyer_score)
      .filter((score): score is number => score !== null);

    const avgOverallScore = scoresOverall.length > 0
      ? scoresOverall.reduce((sum, score) => sum + score, 0) / scoresOverall.length
      : 0;

    const avgBuyerScore = scoresBuyer.length > 0
      ? scoresBuyer.reduce((sum, score) => sum + score, 0) / scoresBuyer.length
      : 0;

    // Calculate average time to complete
    const completionTimes = completed
      .map((s) => {
        const created = new Date(s.created_at).getTime();
        const updated = new Date(s.updated_at).getTime();
        return updated - created;
      })
      .filter((time) => time > 0);

    const avgTimeToComplete = completionTimes.length > 0
      ? Math.round(completionTimes.reduce((sum, time) => sum + time, 0) / completionTimes.length / 1000) // convert to seconds
      : 0;

    const stats: AssessmentStats = {
      total_started: totalStarted,
      total_completed: completed.length,
      total_abandoned: abandoned.length,
      completion_rate: safePercentage(completed.length, totalStarted),
      avg_overall_score: Math.round(avgOverallScore * 100) / 100,
      avg_buyer_score: Math.round(avgBuyerScore * 100) / 100,
      avg_time_to_complete: avgTimeToComplete,
      total_signups_after_assessment: signups.length,
      assessment_to_signup_conversion: safePercentage(signups.length, completed.length),
    };

    return {
      success: true,
      data: stats,
      metadata: {
        total_count: 1,
        filtered_count: 1,
        date_range: dateRange,
        generated_at: new Date().toISOString(),
      },
    };
  } catch (err) {
    console.error('Error fetching assessment stats:', err);
    return {
      success: false,
      data: {
        total_started: 0,
        total_completed: 0,
        total_abandoned: 0,
        completion_rate: 0,
        avg_overall_score: 0,
        avg_buyer_score: 0,
        avg_time_to_complete: 0,
        total_signups_after_assessment: 0,
        assessment_to_signup_conversion: 0,
      },
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

/**
 * Fetch assessment score distribution
 */
export async function fetchAssessmentScoreDistribution(
  dateRange: DateRangeFilter
): Promise<AnalyticsAPIResponse<AssessmentScoreDistribution[]>> {
  try {
    const { data: sessions, error } = await supabase
      .from('assessment_sessions')
      .select('overall_score')
      .gte('created_at', dateRange.start_date)
      .lte('created_at', dateRange.end_date)
      .not('overall_score', 'is', null) as { data: any[] | null; error: any };

    if (error) throw error;

    // Create score buckets
    const buckets = {
      '0-20': 0,
      '21-40': 0,
      '41-60': 0,
      '61-80': 0,
      '81-100': 0,
    };

    sessions?.forEach((session) => {
      const score = session.overall_score;
      if (score === null) return;

      if (score <= 20) buckets['0-20']++;
      else if (score <= 40) buckets['21-40']++;
      else if (score <= 60) buckets['41-60']++;
      else if (score <= 80) buckets['61-80']++;
      else buckets['81-100']++;
    });

    const total = sessions?.length || 0;
    const distribution: AssessmentScoreDistribution[] = Object.entries(buckets).map(([range, count]) => ({
      score_range: range,
      count,
      percentage: safePercentage(count, total),
    }));

    return {
      success: true,
      data: distribution,
      metadata: {
        total_count: distribution.length,
        filtered_count: distribution.length,
        date_range: dateRange,
        generated_at: new Date().toISOString(),
      },
    };
  } catch (err) {
    console.error('Error fetching score distribution:', err);
    return {
      success: false,
      data: [],
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

/**
 * Fetch top companies by assessment count
 */
export async function fetchTopCompanies(
  dateRange: DateRangeFilter,
  limit: number = 10
): Promise<AnalyticsAPIResponse<TopCompanyByAssessment[]>> {
  try {
    const { data: sessions, error } = await supabase
      .from('assessment_sessions')
      .select('company_name, overall_score, created_at')
      .gte('created_at', dateRange.start_date)
      .lte('created_at', dateRange.end_date)
      .not('company_name', 'is', null) as { data: any[] | null; error: any };

    if (error) throw error;

    // Group by company
    const companyMap = new Map<string, any>();

    (sessions as any[])?.forEach((session: any) => {
      const company = session.company_name;
      if (!company) return;

      if (!companyMap.has(company)) {
        companyMap.set(company, {
          company_name: company,
          assessments: [],
          latest_date: session.created_at,
        });
      }

      const companyData = companyMap.get(company);
      companyData.assessments.push(session);
      if (new Date(session.created_at) > new Date(companyData.latest_date)) {
        companyData.latest_date = session.created_at;
      }
    });

    // Transform and sort
    const companies: TopCompanyByAssessment[] = Array.from(companyMap.values())
      .map((company) => {
        const scores = company.assessments
          .map((a: any) => a.overall_score)
          .filter((score: any) => score !== null);

        const avgScore = scores.length > 0
          ? scores.reduce((sum: number, score: number) => sum + score, 0) / scores.length
          : 0;

        return {
          company_name: company.company_name,
          total_assessments: company.assessments.length,
          avg_score: Math.round(avgScore * 100) / 100,
          latest_assessment_date: company.latest_date,
        };
      })
      .sort((a, b) => b.total_assessments - a.total_assessments)
      .slice(0, limit);

    return {
      success: true,
      data: companies,
      metadata: {
        total_count: companyMap.size,
        filtered_count: companies.length,
        date_range: dateRange,
        generated_at: new Date().toISOString(),
      },
    };
  } catch (err) {
    console.error('Error fetching top companies:', err);
    return {
      success: false,
      data: [],
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

// ============================================================================
// PLATFORM USAGE ANALYTICS
// ============================================================================

/**
 * Fetch platform usage statistics for authenticated users
 * Aggregates behavior_sessions data
 */
export async function fetchPlatformUsageStats(
  dateRange: DateRangeFilter
): Promise<AnalyticsAPIResponse<PlatformUsageStats>> {
  try {
    // Query behavior_sessions within date range
    const { data: sessions, error } = await supabase
      .from('behavior_sessions')
      .select('*')
      .gte('created_at', dateRange.start_date)
      .lte('created_at', dateRange.end_date) as { data: any[] | null; error: any };

    if (error) throw error;

    if (!sessions || sessions.length === 0) {
      return {
        success: true,
        data: {
          total_sessions: 0,
          total_active_users: 0,
          avg_session_duration: 0,
          total_events: 0,
          total_exports: 0,
          avg_exports_per_user: 0,
          most_used_tool: null,
          most_used_tool_percentage: 0,
        },
        metadata: {
          total_count: 0,
          filtered_count: 0,
          date_range: dateRange,
          generated_at: new Date().toISOString(),
        },
      };
    }

    // Calculate aggregations
    const typedSessions = sessions as any[];
    const uniqueUsers = new Set(typedSessions.map((s: any) => s.customer_id)).size;
    const totalSessions = typedSessions.length;

    // Calculate average session duration (filter out null durations)
    const validDurations = typedSessions
      .map((s: any) => s.duration_seconds)
      .filter((d: any): d is number => d !== null);
    const avgDuration = validDurations.length > 0
      ? validDurations.reduce((sum, d) => sum + d, 0) / validDurations.length
      : 0;

    // Sum total events
    const totalEvents = typedSessions.reduce((sum: number, s: any) => sum + (s.events_count || 0), 0);

    // Sum total exports
    const totalExports = typedSessions.reduce((sum: number, s: any) => sum + (s.exports_generated || 0), 0);

    // Calculate avg exports per user
    const avgExportsPerUser = uniqueUsers > 0 ? totalExports / uniqueUsers : 0;

    // Find most used tool
    const toolUsageMap = new Map<string, number>();
    typedSessions.forEach((s: any) => {
      if (s.primary_tool) {
        toolUsageMap.set(s.primary_tool, (toolUsageMap.get(s.primary_tool) || 0) + 1);
      }
    });

    let mostUsedTool: string | null = null;
    let mostUsedToolCount = 0;
    toolUsageMap.forEach((count, tool) => {
      if (count > mostUsedToolCount) {
        mostUsedTool = tool;
        mostUsedToolCount = count;
      }
    });

    const mostUsedToolPercentage = totalSessions > 0
      ? safePercentage(mostUsedToolCount, totalSessions)
      : 0;

    return {
      success: true,
      data: {
        total_sessions: totalSessions,
        total_active_users: uniqueUsers,
        avg_session_duration: Math.round(avgDuration),
        total_events: totalEvents,
        total_exports: totalExports,
        avg_exports_per_user: Math.round(avgExportsPerUser * 100) / 100,
        most_used_tool: mostUsedTool,
        most_used_tool_percentage: mostUsedToolPercentage,
      },
      metadata: {
        total_count: totalSessions,
        filtered_count: totalSessions,
        date_range: dateRange,
        generated_at: new Date().toISOString(),
      },
    };
  } catch (err) {
    console.error('Error fetching platform usage stats:', err);
    return {
      success: false,
      data: {
        total_sessions: 0,
        total_active_users: 0,
        avg_session_duration: 0,
        total_events: 0,
        total_exports: 0,
        avg_exports_per_user: 0,
        most_used_tool: null,
        most_used_tool_percentage: 0,
      },
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

/**
 * Fetch tool usage statistics breakdown
 * Analyzes behavior_events for tool-specific usage patterns
 */
export async function fetchToolUsageStats(
  dateRange: DateRangeFilter
): Promise<AnalyticsAPIResponse<ToolUsageStats[]>> {
  try {
    // Query behavior_events for tool_use events
    const { data: events, error: eventsError } = await supabase
      .from('behavior_events')
      .select('*')
      .eq('event_type', 'tool_use')
      .gte('created_at', dateRange.start_date)
      .lte('created_at', dateRange.end_date) as { data: any[] | null; error: any };

    if (eventsError) throw eventsError;

    // Also get sessions for time spent calculations
    const { data: sessions, error: sessionsError } = await supabase
      .from('behavior_sessions')
      .select('*')
      .gte('created_at', dateRange.start_date)
      .lte('created_at', dateRange.end_date) as { data: any[] | null; error: any };

    if (sessionsError) throw sessionsError;

    if (!events || events.length === 0) {
      return {
        success: true,
        data: [],
        metadata: {
          total_count: 0,
          filtered_count: 0,
          date_range: dateRange,
          generated_at: new Date().toISOString(),
        },
      };
    }

    // Group events by tool_id
    const toolMap = new Map<string, {
      tool_id: string;
      uses: number;
      users: Set<string>;
      exports: number;
    }>();

    (events as any[]).forEach((event: any) => {
      if (!event.tool_id) return;

      if (!toolMap.has(event.tool_id)) {
        toolMap.set(event.tool_id, {
          tool_id: event.tool_id,
          uses: 0,
          users: new Set(),
          exports: 0,
        });
      }

      const tool = toolMap.get(event.tool_id)!;
      tool.uses += 1;
      tool.users.add(event.customer_id);

      // Check if this is an export event
      if (event.event_metadata?.action === 'export') {
        tool.exports += 1;
      }
    });

    // Calculate time spent per tool from sessions
    const toolTimeMap = new Map<string, number[]>();
    ((sessions as any[]) || []).forEach((session: any) => {
      if (session.primary_tool && session.duration_seconds) {
        if (!toolTimeMap.has(session.primary_tool)) {
          toolTimeMap.set(session.primary_tool, []);
        }
        toolTimeMap.get(session.primary_tool)!.push(session.duration_seconds);
      }
    });

    // Total uses across all tools for percentage calculation
    const totalUses = Array.from(toolMap.values()).reduce((sum, t) => sum + t.uses, 0);

    // Transform to ToolUsageStats array
    const stats: ToolUsageStats[] = Array.from(toolMap.values()).map((tool) => {
      const times = toolTimeMap.get(tool.tool_id) || [];
      const avgTime = times.length > 0
        ? times.reduce((sum, t) => sum + t, 0) / times.length
        : 0;

      return {
        tool_id: tool.tool_id,
        tool_name: formatToolName(tool.tool_id),
        total_uses: tool.uses,
        unique_users: tool.users.size,
        avg_time_spent: Math.round(avgTime),
        exports_generated: tool.exports,
        percentage_of_total_usage: safePercentage(tool.uses, totalUses),
      };
    }).sort((a, b) => b.total_uses - a.total_uses);

    return {
      success: true,
      data: stats,
      metadata: {
        total_count: stats.length,
        filtered_count: stats.length,
        date_range: dateRange,
        generated_at: new Date().toISOString(),
      },
    };
  } catch (err) {
    console.error('Error fetching tool usage stats:', err);
    return {
      success: false,
      data: [],
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

/**
 * Helper function to format tool IDs into readable names
 */
function formatToolName(toolId: string): string {
  // Convert snake_case or kebab-case to Title Case
  return toolId
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// ============================================================================
// USER FLOW / NAVIGATION ANALYTICS
// ============================================================================

/**
 * Fetch navigation paths (page transitions)
 * Analyzes behavior_events for navigation patterns
 */
export async function fetchNavigationPaths(
  dateRange: DateRangeFilter,
  limit: number = 50
): Promise<AnalyticsAPIResponse<NavigationPath[]>> {
  try {
    // Query navigation events
    const { data: events, error } = await supabase
      .from('behavior_events')
      .select('*')
      .eq('event_type', 'navigation')
      .gte('created_at', dateRange.start_date)
      .lte('created_at', dateRange.end_date)
      .order('created_at', { ascending: true });

    if (error) throw error;

    if (!events || events.length === 0) {
      return {
        success: true,
        data: [],
        metadata: {
          total_count: 0,
          filtered_count: 0,
          date_range: dateRange,
          generated_at: new Date().toISOString(),
        },
      };
    }

    // Group events by customer to build navigation sequences
    const customerPaths = new Map<string, Array<{
      page: string;
      timestamp: string;
    }>>();

    events.forEach((event) => {
      const page = event.event_metadata?.to_page || event.event_metadata?.page || 'unknown';

      if (!customerPaths.has(event.customer_id)) {
        customerPaths.set(event.customer_id, []);
      }

      customerPaths.get(event.customer_id)!.push({
        page,
        timestamp: event.created_at,
      });
    });

    // Build transition map (from_page -> to_page)
    const transitionMap = new Map<string, {
      from_page: string;
      to_page: string;
      transitions: number;
      users: Set<string>;
      times: number[];
      conversions: number;
      dropouts: number;
    }>();

    customerPaths.forEach((paths, customerId) => {
      for (let i = 0; i < paths.length - 1; i++) {
        const fromPage = paths[i].page;
        const toPage = paths[i + 1].page;
        const key = `${fromPage}::${toPage}`;

        if (!transitionMap.has(key)) {
          transitionMap.set(key, {
            from_page: fromPage,
            to_page: toPage,
            transitions: 0,
            users: new Set(),
            times: [],
            conversions: 0,
            dropouts: 0,
          });
        }

        const transition = transitionMap.get(key)!;
        transition.transitions += 1;
        transition.users.add(customerId);

        // Calculate time between pages
        const fromTime = new Date(paths[i].timestamp).getTime();
        const toTime = new Date(paths[i + 1].timestamp).getTime();
        const timeDiff = (toTime - fromTime) / 1000; // Convert to seconds

        // Only include reasonable time differences (< 30 minutes)
        if (timeDiff > 0 && timeDiff < 1800) {
          transition.times.push(timeDiff);
        }
      }

      // Check if user completed journey (reached dashboard or tool page as final destination)
      if (paths.length > 0) {
        const lastPage = paths[paths.length - 1].page;
        const isConversion = lastPage.includes('/dashboard') ||
                           lastPage.includes('/icp/') ||
                           lastPage.includes('/tools/');

        // Mark conversions/dropouts on all transitions for this user
        paths.slice(0, -1).forEach((path, idx) => {
          const fromPage = path.page;
          const toPage = paths[idx + 1].page;
          const key = `${fromPage}::${toPage}`;
          const transition = transitionMap.get(key);

          if (transition) {
            if (isConversion) {
              transition.conversions += 1;
            } else {
              transition.dropouts += 1;
            }
          }
        });
      }
    });

    // Transform to NavigationPath array
    const paths: NavigationPath[] = Array.from(transitionMap.values())
      .map((t) => {
        const avgTime = t.times.length > 0
          ? t.times.reduce((sum, time) => sum + time, 0) / t.times.length
          : 0;

        return {
          from_page: t.from_page,
          to_page: t.to_page,
          total_transitions: t.transitions,
          unique_users: t.users.size,
          avg_time_between: Math.round(avgTime),
          conversion_count: t.conversions,
          dropout_count: t.dropouts,
        };
      })
      .sort((a, b) => b.total_transitions - a.total_transitions)
      .slice(0, limit);

    return {
      success: true,
      data: paths,
      metadata: {
        total_count: transitionMap.size,
        filtered_count: paths.length,
        date_range: dateRange,
        generated_at: new Date().toISOString(),
      },
    };
  } catch (err) {
    console.error('Error fetching navigation paths:', err);
    return {
      success: false,
      data: [],
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

/**
 * Fetch common user journeys (complete path sequences)
 * Identifies the most common multi-step navigation patterns
 */
export async function fetchUserJourneys(
  dateRange: DateRangeFilter,
  minOccurrences: number = 2,
  limit: number = 20
): Promise<AnalyticsAPIResponse<UserJourney[]>> {
  try {
    // Query all navigation events
    const { data: events, error } = await supabase
      .from('behavior_events')
      .select('customer_id, event_metadata, created_at')
      .eq('event_type', 'navigation')
      .gte('created_at', dateRange.start_date)
      .lte('created_at', dateRange.end_date)
      .order('created_at', { ascending: true });

    if (error) throw error;

    if (!events || events.length === 0) {
      return {
        success: true,
        data: [],
        metadata: {
          total_count: 0,
          filtered_count: 0,
          date_range: dateRange,
          generated_at: new Date().toISOString(),
        },
      };
    }

    // Group by customer to build complete journeys
    const customerJourneys = new Map<string, {
      pages: string[];
      timestamps: string[];
      userType: 'anonymous' | 'authenticated';
    }>();

    events.forEach((event) => {
      const page = event.event_metadata?.to_page || event.event_metadata?.page || 'unknown';

      if (!customerJourneys.has(event.customer_id)) {
        customerJourneys.set(event.customer_id, {
          pages: [],
          timestamps: [],
          userType: 'authenticated', // behavior_events are only for authenticated users
        });
      }

      const journey = customerJourneys.get(event.customer_id)!;
      journey.pages.push(page);
      journey.timestamps.push(event.created_at);
    });

    // Group identical path sequences
    const journeyPatterns = new Map<string, {
      path_sequence: string[];
      occurrences: number;
      total_duration_ms: number;
      conversions: number;
      dropout_pages: Map<string, number>;
    }>();

    customerJourneys.forEach((journey) => {
      // Create unique key from path sequence
      const pathKey = journey.pages.join('→');

      if (!journeyPatterns.has(pathKey)) {
        journeyPatterns.set(pathKey, {
          path_sequence: journey.pages,
          occurrences: 0,
          total_duration_ms: 0,
          conversions: 0,
          dropout_pages: new Map(),
        });
      }

      const pattern = journeyPatterns.get(pathKey)!;
      pattern.occurrences += 1;

      // Calculate total journey duration
      if (journey.timestamps.length > 1) {
        const startTime = new Date(journey.timestamps[0]).getTime();
        const endTime = new Date(journey.timestamps[journey.timestamps.length - 1]).getTime();
        pattern.total_duration_ms += (endTime - startTime);
      }

      // Check if journey resulted in conversion
      const lastPage = journey.pages[journey.pages.length - 1];
      if (lastPage.includes('/dashboard') ||
          lastPage.includes('/tools/') ||
          lastPage.includes('/icp/')) {
        pattern.conversions += 1;
      } else {
        // Track dropout page
        pattern.dropout_pages.set(
          lastPage,
          (pattern.dropout_pages.get(lastPage) || 0) + 1
        );
      }
    });

    // Filter by minimum occurrences and transform to UserJourney array
    const journeys: UserJourney[] = Array.from(journeyPatterns.entries())
      .filter(([_, pattern]) => pattern.occurrences >= minOccurrences)
      .map(([pathKey, pattern]) => {
        // Find most common dropout page
        let dropoutStep: string | null = null;
        let maxDropouts = 0;
        pattern.dropout_pages.forEach((count, page) => {
          if (count > maxDropouts) {
            dropoutStep = page;
            maxDropouts = count;
          }
        });

        const avgDuration = pattern.occurrences > 0
          ? pattern.total_duration_ms / pattern.occurrences / 1000 // Convert to seconds
          : 0;

        const conversionRate = safePercentage(pattern.conversions, pattern.occurrences);

        return {
          journey_id: pathKey,
          user_type: 'authenticated',
          path_sequence: pattern.path_sequence,
          total_occurrences: pattern.occurrences,
          avg_duration: Math.round(avgDuration),
          conversion_rate: conversionRate,
          dropout_step: dropoutStep,
        };
      })
      .sort((a, b) => b.total_occurrences - a.total_occurrences)
      .slice(0, limit);

    return {
      success: true,
      data: journeys,
      metadata: {
        total_count: journeyPatterns.size,
        filtered_count: journeys.length,
        date_range: dateRange,
        generated_at: new Date().toISOString(),
      },
    };
  } catch (err) {
    console.error('Error fetching user journeys:', err);
    return {
      success: false,
      data: [],
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

// ============================================================================
// CONVERSION FUNNEL ANALYTICS
// ============================================================================

/**
 * Fetch complete conversion funnel
 * Tracks users through: Visit → Assessment → Signup → Payment
 *
 * NOTE: This is a complex aggregation across multiple tables:
 * - public_page_visits (visit stage)
 * - assessment_sessions (assessment stage)
 * - auth.users (signup stage - from Supabase Auth)
 * - user_milestones (payment stage)
 */
export async function fetchConversionFunnel(
  dateRange: DateRangeFilter
): Promise<AnalyticsAPIResponse<ConversionFunnel>> {
  try {
    // Stage 1: VISIT - Count unique visitors from public_page_visits
    const { data: visits, error: visitsError } = await supabase
      .from('public_page_visits')
      .select('anonymous_session_id, user_id, created_at')
      .gte('created_at', dateRange.start_date)
      .lte('created_at', dateRange.end_date);

    if (visitsError) throw visitsError;

    const visitSessions = new Set(
      (visits || []).map(v => v.anonymous_session_id)
    );
    const visitCount = visitSessions.size;

    // Stage 2: ASSESSMENT - Count users who started an assessment
    const { data: assessments, error: assessmentsError } = await supabase
      .from('assessment_sessions')
      .select('session_id, user_email, status, created_at, updated_at')
      .gte('created_at', dateRange.start_date)
      .lte('created_at', dateRange.end_date);

    if (assessmentsError) throw assessmentsError;

    const assessmentUsers = new Set(
      (assessments || []).map(a => a.user_email)
    );
    const assessmentCount = assessmentUsers.size;

    // Calculate completion count (completed or completed_awaiting_signup)
    const completedAssessments = (assessments || []).filter(a =>
      a.status === 'completed' ||
      a.status === 'completed_awaiting_signup' ||
      a.status === 'linked'
    );
    const completedAssessmentUsers = new Set(
      completedAssessments.map(a => a.user_email)
    );

    // Stage 3: SIGNUP - Count authenticated users (this requires querying auth.users)
    // Since we can't directly query auth.users from client, we'll use user_id from assessment_sessions
    // as a proxy for signup (when status is 'linked', user has signed up)
    const linkedAssessments = (assessments || []).filter(a => a.status === 'linked');
    const signupCount = linkedAssessments.length;

    // Stage 4: PAYMENT - Count users with is_founding_member = true
    const { data: milestones, error: milestonesError } = await supabase
      .from('user_milestones')
      .select('user_id, is_founding_member, created_at')
      .eq('is_founding_member', true)
      .gte('created_at', dateRange.start_date)
      .lte('created_at', dateRange.end_date);

    if (milestonesError) throw milestonesError;

    const paymentCount = (milestones || []).length;

    // Calculate time to convert (from first visit to payment)
    // This requires matching users across tables
    const conversionTimes: number[] = [];

    if (visits && milestones && milestones.length > 0) {
      // Map user_id to earliest visit time
      const userVisitTimes = new Map<string, number>();
      visits.forEach(visit => {
        if (visit.user_id) {
          const visitTime = new Date(visit.created_at).getTime();
          if (!userVisitTimes.has(visit.user_id) || visitTime < userVisitTimes.get(visit.user_id)!) {
            userVisitTimes.set(visit.user_id, visitTime);
          }
        }
      });

      // Calculate conversion time for each paying user
      milestones.forEach(milestone => {
        const visitTime = userVisitTimes.get(milestone.user_id);
        if (visitTime) {
          const paymentTime = new Date(milestone.created_at).getTime();
          const conversionTime = (paymentTime - visitTime) / 1000; // seconds
          if (conversionTime > 0 && conversionTime < 86400 * 30) { // < 30 days
            conversionTimes.push(conversionTime);
          }
        }
      });
    }

    const avgTimeToConvert = conversionTimes.length > 0
      ? conversionTimes.reduce((sum, t) => sum + t, 0) / conversionTimes.length
      : 0;

    // Calculate drop counts and rates for each stage
    const visitToAssessmentDrop = visitCount - assessmentCount;
    const assessmentToSignupDrop = assessmentCount - signupCount;
    const signupToPaymentDrop = signupCount - paymentCount;

    // Build funnel stages
    const stages: FunnelStage[] = [
      {
        stage_name: 'Visit',
        stage_order: 1,
        total_entered: visitCount,
        total_completed: assessmentCount,
        total_dropped: visitToAssessmentDrop,
        completion_rate: safePercentage(assessmentCount, visitCount),
        drop_rate: safePercentage(visitToAssessmentDrop, visitCount),
        avg_time_in_stage: 0, // Can't easily calculate without session tracking
        next_stage: 'Assessment',
      },
      {
        stage_name: 'Assessment',
        stage_order: 2,
        total_entered: assessmentCount,
        total_completed: signupCount,
        total_dropped: assessmentToSignupDrop,
        completion_rate: safePercentage(signupCount, assessmentCount),
        drop_rate: safePercentage(assessmentToSignupDrop, assessmentCount),
        avg_time_in_stage: 0, // Could calculate from assessment created_at to updated_at
        next_stage: 'Signup',
      },
      {
        stage_name: 'Signup',
        stage_order: 3,
        total_entered: signupCount,
        total_completed: paymentCount,
        total_dropped: signupToPaymentDrop,
        completion_rate: safePercentage(paymentCount, signupCount),
        drop_rate: safePercentage(signupToPaymentDrop, signupCount),
        avg_time_in_stage: 0,
        next_stage: 'Payment',
      },
      {
        stage_name: 'Payment',
        stage_order: 4,
        total_entered: paymentCount,
        total_completed: paymentCount,
        total_dropped: 0,
        completion_rate: 100,
        drop_rate: 0,
        avg_time_in_stage: 0,
        next_stage: null,
      },
    ];

    // Calculate overall conversion rate (visit to payment)
    const overallConversionRate = safePercentage(paymentCount, visitCount);

    const funnel: ConversionFunnel = {
      funnel_name: 'Complete User Journey',
      total_entered_funnel: visitCount,
      total_completed_funnel: paymentCount,
      overall_conversion_rate: overallConversionRate,
      stages,
      avg_time_to_convert: Math.round(avgTimeToConvert),
    };

    return {
      success: true,
      data: funnel,
      metadata: {
        total_count: visitCount,
        filtered_count: paymentCount,
        date_range: dateRange,
        generated_at: new Date().toISOString(),
      },
    };
  } catch (err) {
    console.error('Error fetching conversion funnel:', err);

    // Return empty funnel on error
    const emptyStages: FunnelStage[] = [
      {
        stage_name: 'Visit',
        stage_order: 1,
        total_entered: 0,
        total_completed: 0,
        total_dropped: 0,
        completion_rate: 0,
        drop_rate: 0,
        avg_time_in_stage: 0,
        next_stage: 'Assessment',
      },
      {
        stage_name: 'Assessment',
        stage_order: 2,
        total_entered: 0,
        total_completed: 0,
        total_dropped: 0,
        completion_rate: 0,
        drop_rate: 0,
        avg_time_in_stage: 0,
        next_stage: 'Signup',
      },
      {
        stage_name: 'Signup',
        stage_order: 3,
        total_entered: 0,
        total_completed: 0,
        total_dropped: 0,
        completion_rate: 0,
        drop_rate: 0,
        avg_time_in_stage: 0,
        next_stage: 'Payment',
      },
      {
        stage_name: 'Payment',
        stage_order: 4,
        total_entered: 0,
        total_completed: 0,
        total_dropped: 0,
        completion_rate: 0,
        drop_rate: 0,
        avg_time_in_stage: 0,
        next_stage: null,
      },
    ];

    return {
      success: false,
      data: {
        funnel_name: 'Complete User Journey',
        total_entered_funnel: 0,
        total_completed_funnel: 0,
        overall_conversion_rate: 0,
        stages: emptyStages,
        avg_time_to_convert: 0,
      },
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

// ============================================================================
// SCENARIO PAGE ANALYTICS
// ============================================================================

/**
 * Fetch scenario page overview metrics
 * Aggregates data from all /icp/[slug] pages
 */
export async function fetchScenarioPageOverview(
  dateRange: DateRangeFilter
): Promise<AnalyticsAPIResponse<any>> {
  try {
    // Get all visits to /icp/ pages (both anonymous and authenticated)
    const { data: visits, error } = await supabase
      .from('public_page_visits')
      .select('*')
      .like('page_path', '/icp/%')
      .gte('created_at', dateRange.start_date)
      .lte('created_at', dateRange.end_date) as { data: any[] | null; error: any };

    if (error) throw error;

    // Get assessment sessions started after scenario page visits
    const { data: assessments, error: assessError } = await supabase
      .from('assessment_sessions')
      .select('*')
      .gte('created_at', dateRange.start_date)
      .lte('created_at', dateRange.end_date) as { data: any[] | null; error: any };

    if (assessError) throw assessError;

    // Get signups (users with linked assessment sessions)
    const { data: signups, error: signupError } = await supabase
      .from('assessment_sessions')
      .select('*')
      .eq('status', 'linked')
      .gte('created_at', dateRange.start_date)
      .lte('created_at', dateRange.end_date) as { data: any[] | null; error: any };

    if (signupError) throw signupError;

    const visitArray = visits || [];
    const assessmentArray = assessments || [];
    const signupArray = signups || [];

    const total_views = visitArray.length;
    const unique_visitors = new Set(visitArray.map((v: any) => v.anonymous_session_id || v.user_id)).size;
    const avg_time_on_page = visitArray.length > 0
      ? visitArray.reduce((sum: number, v: any) => sum + (v.time_on_page || 0), 0) / visitArray.length
      : 0;
    const total_cta_clicks = visitArray.filter((v: any) => v.clicked_cta).length;
    const scenario_to_assessment_conversions = assessmentArray.length;
    const scenario_to_signup_conversions = signupArray.length;

    return {
      success: true,
      data: {
        total_views,
        unique_visitors,
        avg_time_on_page,
        total_cta_clicks,
        scenario_to_assessment_conversions,
        scenario_to_assessment_rate: safePercentage(scenario_to_assessment_conversions, total_views),
        scenario_to_signup_conversions,
        scenario_to_signup_rate: safePercentage(scenario_to_signup_conversions, total_views),
      },
      metadata: {
        total_count: total_views,
        filtered_count: total_views,
        date_range: dateRange,
        generated_at: new Date().toISOString(),
      },
    };
  } catch (err) {
    console.error('Error fetching scenario page overview:', err);
    return {
      success: false,
      data: {
        total_views: 0,
        unique_visitors: 0,
        avg_time_on_page: 0,
        total_cta_clicks: 0,
        scenario_to_assessment_conversions: 0,
        scenario_to_assessment_rate: 0,
        scenario_to_signup_conversions: 0,
        scenario_to_signup_rate: 0,
      },
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

/**
 * Fetch detailed stats for each scenario page
 * Returns per-scenario breakdown with all metrics
 */
export async function fetchScenarioDetailedStats(
  dateRange: DateRangeFilter
): Promise<AnalyticsAPIResponse<any[]>> {
  try {
    // Get all visits to /icp/ pages
    const { data: visits, error } = await supabase
      .from('public_page_visits')
      .select('*')
      .like('page_path', '/icp/%')
      .gte('created_at', dateRange.start_date)
      .lte('created_at', dateRange.end_date) as { data: any[] | null; error: any };

    if (error) throw error;

    const visitArray = visits || [];

    // Group by scenario slug
    const scenarioMap = new Map<string, any[]>();
    (visitArray as any[]).forEach((visit: any) => {
      const slug = visit.page_path.replace('/icp/', '').split('?')[0];
      if (!scenarioMap.has(slug)) {
        scenarioMap.set(slug, []);
      }
      scenarioMap.get(slug)!.push(visit);
    });

    // Calculate stats for each scenario
    const scenarios: any[] = [];
    for (const [slug, scenarioVisits] of scenarioMap.entries()) {
      const total_views = scenarioVisits.length;
      const unique_visitors = new Set(scenarioVisits.map(v => v.anonymous_session_id || v.user_id)).size;
      const avg_time_on_page = scenarioVisits.reduce((sum, v) => sum + (v.time_on_page || 0), 0) / total_views;
      const avg_scroll_depth = scenarioVisits.reduce((sum, v) => sum + (v.scroll_depth || 0), 0) / total_views;
      const cta_clicks = scenarioVisits.filter(v => v.clicked_cta).length;

      // Extract company and persona from page title if available
      const firstVisit = scenarioVisits[0];
      const pageTitle = firstVisit.page_title || '';
      const titleParts = pageTitle.split(' - ');
      const company_name = titleParts[0] || 'Unknown';
      const persona = titleParts[1] || 'Unknown Role';

      // Get last viewed timestamp
      const last_viewed = scenarioVisits
        .map(v => new Date(v.created_at).getTime())
        .sort((a, b) => b - a)[0];

      scenarios.push({
        scenario_slug: slug,
        scenario_title: pageTitle,
        company_name,
        persona,
        total_views,
        unique_visitors,
        avg_time_on_page,
        avg_scroll_depth,
        bounce_rate: 0, // TODO: Calculate based on single-page sessions
        cta_clicks,
        cta_click_rate: safePercentage(cta_clicks, total_views),
        assessment_conversions: 0, // TODO: Link to assessment sessions
        assessment_conversion_rate: 0,
        signup_conversions: 0, // TODO: Link to user signups
        signup_conversion_rate: 0,
        last_viewed: new Date(last_viewed).toISOString(),
      });
    }

    // Sort by total views descending
    scenarios.sort((a, b) => b.total_views - a.total_views);

    return {
      success: true,
      data: scenarios,
      metadata: {
        total_count: scenarios.length,
        filtered_count: scenarios.length,
        date_range: dateRange,
        generated_at: new Date().toISOString(),
      },
    };
  } catch (err) {
    console.error('Error fetching scenario detailed stats:', err);
    return {
      success: false,
      data: [],
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

// Export helper for testing
export { safePercentage, safeNumber };
