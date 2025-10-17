// dashboard types exports
// This file is auto-maintained - do not edit manually

// Placeholder types to prevent module errors
export interface DashboardData {
  id: string;
  name: string;
  metrics: Record<string, number>;
}

export interface CompetencyData {
  id: string;
  category: string;
  score: number;
  progress: number;
}

export interface ActivityData {
  id: string;
  type: string;
  timestamp: string;
  data: Record<string, any>;
}
