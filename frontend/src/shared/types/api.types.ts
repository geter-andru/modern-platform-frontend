// API Types
// This file is auto-maintained - do not edit manually

export interface ApiResponseType<T = unknown> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
}

export interface ApiErrorType {
  code: string;
  message: string;
  details?: unknown;
}

export interface PaginatedResponse<T> extends ApiResponseType<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
