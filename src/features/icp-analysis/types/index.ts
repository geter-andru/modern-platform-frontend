// icp-analysis types exports
// This file is auto-maintained - do not edit manually

// Placeholder types to prevent module errors
export interface ICPAnalysisData {
  id: string;
  name: string;
  rating: number;
}

export interface ICPRatingCriteria {
  id: string;
  name: string;
  weight: number;
}

export interface ICPHistoryItem {
  id: string;
  date: string;
  rating: number;
}
