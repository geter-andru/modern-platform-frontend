/**
 * Environment Variable Validation Schemas
 * 
 * Defines Zod schemas for validating environment variables
 * at build time and runtime.
 */

import { z } from 'zod';

// Core application environment variables
export const CoreEnvironmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  NEXT_PUBLIC_NODE_ENV: z.enum(['development', 'production', 'test']).optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
});

// Supabase environment variables
export const SupabaseEnvironmentSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().startsWith('https://'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(100).startsWith('eyJ'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(100).startsWith('eyJ').optional(),
});

// AI service environment variables
export const AIEnvironmentSchema = z.object({
  OPENAI_API_KEY: z.string().startsWith('sk-').optional(),
  ANTHROPIC_API_KEY: z.string().startsWith('sk-ant-').optional(),
});

// Airtable environment variables
export const AirtableEnvironmentSchema = z.object({
  AIRTABLE_API_KEY: z.string().startsWith('pat').optional(),
  AIRTABLE_BASE_ID: z.string().startsWith('app').optional(),
  AIRTABLE_API_URL: z.string().url().optional(),
});

// Complete environment schema
export const EnvironmentSchema = CoreEnvironmentSchema
  .merge(SupabaseEnvironmentSchema)
  .merge(AIEnvironmentSchema)
  .merge(AirtableEnvironmentSchema);

// Environment validation result
export const EnvironmentValidationResult = z.object({
  success: z.boolean(),
  missing: z.array(z.string()).optional(),
  invalid: z.array(z.string()).optional(),
  error: z.string().optional(),
});

export type CoreEnvironment = z.infer<typeof CoreEnvironmentSchema>;
export type SupabaseEnvironment = z.infer<typeof SupabaseEnvironmentSchema>;
export type AIEnvironment = z.infer<typeof AIEnvironmentSchema>;
export type AirtableEnvironment = z.infer<typeof AirtableEnvironmentSchema>;
export type Environment = z.infer<typeof EnvironmentSchema>;
export type EnvironmentValidationResult = z.infer<typeof EnvironmentValidationResult>;
