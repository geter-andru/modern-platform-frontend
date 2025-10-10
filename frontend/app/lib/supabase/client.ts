// Re-export from the existing comprehensive client
export { supabase, getCustomerAssets, updateCustomerAssets, getCompetencyData, updateCompetencyData, getCompetencyActions, addCompetencyAction, getCompetencyMilestones, updateCompetencyMilestone } from './client-rewrite';
export type { Database, Tables, Enums } from './client-rewrite';