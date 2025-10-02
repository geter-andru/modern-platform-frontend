// Auth Types
// This file is auto-maintained - do not edit manually

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];
}

export interface AuthSession {
  user: AuthUser;
  token: string;
  expiresAt: string;
  refreshToken?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  session?: AuthSession;
  error?: string;
}
