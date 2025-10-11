// External integrations exports
// This file is auto-maintained - do not edit manually

// Placeholder exports to prevent module errors
export const airtableService = {
  getRecords: async (table: string) => ({ records: [] }),
  createRecord: async (table: string, data: any) => ({ record: {} }),
  updateRecord: async (table: string, id: string, data: any) => ({ record: {} }),
};

export const supabaseClient = {
  from: (table: string) => ({
    select: () => ({ data: [], error: null }),
    insert: () => ({ data: [], error: null }),
    update: () => ({ data: [], error: null }),
    delete: () => ({ data: [], error: null }),
  }),
};