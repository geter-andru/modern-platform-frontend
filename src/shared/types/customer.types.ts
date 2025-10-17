// Customer Types
// This file is auto-maintained - do not edit manually

export interface CustomerType {
  id: string;
  name: string;
  email: string;
  company: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerProfile extends CustomerType {
  preferences: Record<string, unknown>;
  settings: Record<string, unknown>;
  metadata: Record<string, unknown>;
}

export interface CustomerSession {
  id: string;
  customerId: string;
  token: string;
  expiresAt: string;
  createdAt: string;
}
