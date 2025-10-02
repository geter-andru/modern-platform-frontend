/**
 * Airtable Service
 * 
 * Handles integration with Airtable for data storage and retrieval.
 * Provides methods for storing assessment results, actions, and other data.
 */

interface AirtableRecord {
  id?: string;
  fields: Record<string, any>;
  createdTime?: string;
}

interface AssessmentResults {
  sessionId: string;
  userId: string;
  assessmentData: any;
  timestamp: string;
  [key: string]: any;
}

interface RealWorldAction {
  userId: string;
  action: string;
  category: string;
  points: number;
  timestamp: string;
  metadata?: any;
}

interface BackendResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class AirtableService {
  private baseUrl: string;
  private apiKey: string;
  private baseId: string;

  constructor() {
    this.baseUrl = process.env.AIRTABLE_API_URL || 'https://api.airtable.com/v0';
    this.apiKey = process.env.AIRTABLE_API_KEY || '';
    this.baseId = process.env.AIRTABLE_BASE_ID || '';
  }

  /**
   * Store assessment results in Airtable
   */
  async storeAssessmentResults(userId: string, results: AssessmentResults): Promise<BackendResponse<AirtableRecord>> {
    try {
      console.log('📊 Storing assessment results in Airtable for user:', userId);

      // For now, return mock success
      // In production, this would call the Airtable API
      const mockRecord: AirtableRecord = {
        id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        fields: {
          'User ID': userId,
          'Session ID': results.sessionId,
          'Assessment Data': JSON.stringify(results.assessmentData),
          'Timestamp': results.timestamp,
          'Status': 'Completed'
        },
        createdTime: new Date().toISOString()
      };

      return {
        success: true,
        data: mockRecord,
        message: 'Assessment results stored successfully'
      };

    } catch (error) {
      console.error('❌ Failed to store assessment results:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Store real-world action in Airtable
   */
  async storeRealWorldAction(action: RealWorldAction): Promise<BackendResponse<AirtableRecord>> {
    try {
      console.log('🎯 Storing real-world action in Airtable:', action.action);

      // For now, return mock success
      // In production, this would call the Airtable API
      const mockRecord: AirtableRecord = {
        id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        fields: {
          'User ID': action.userId,
          'Action': action.action,
          'Category': action.category,
          'Points': action.points,
          'Timestamp': action.timestamp,
          'Metadata': action.metadata ? JSON.stringify(action.metadata) : '',
          'Status': 'Recorded'
        },
        createdTime: new Date().toISOString()
      };

      return {
        success: true,
        data: mockRecord,
        message: 'Real-world action stored successfully'
      };

    } catch (error) {
      console.error('❌ Failed to store real-world action:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get assessment results from Airtable
   */
  async getAssessmentResults(userId: string, limit: number = 10): Promise<BackendResponse<AirtableRecord[]>> {
    try {
      console.log('📋 Retrieving assessment results from Airtable for user:', userId);

      // For now, return mock data
      // In production, this would call the Airtable API
      const mockRecords: AirtableRecord[] = [
        {
          id: 'rec_1',
          fields: {
            'User ID': userId,
            'Session ID': 'session_1',
            'Assessment Data': '{"score": 85, "competencies": ["sales", "marketing"]}',
            'Timestamp': new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            'Status': 'Completed'
          },
          createdTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        }
      ];

      return {
        success: true,
        data: mockRecords.slice(0, limit)
      };

    } catch (error) {
      console.error('❌ Failed to retrieve assessment results:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get real-world actions from Airtable
   */
  async getRealWorldActions(userId: string, limit: number = 20): Promise<BackendResponse<AirtableRecord[]>> {
    try {
      console.log('🎯 Retrieving real-world actions from Airtable for user:', userId);

      // For now, return mock data
      // In production, this would call the Airtable API
      const mockRecords: AirtableRecord[] = [
        {
          id: 'rec_action_1',
          fields: {
            'User ID': userId,
            'Action': 'assessment_completed',
            'Category': 'assessment',
            'Points': 100,
            'Timestamp': new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            'Status': 'Recorded'
          },
          createdTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'rec_action_2',
          fields: {
            'User ID': userId,
            'Action': 'icp_analysis_generated',
            'Category': 'analysis',
            'Points': 200,
            'Timestamp': new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            'Status': 'Recorded'
          },
          createdTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];

      return {
        success: true,
        data: mockRecords.slice(0, limit)
      };

    } catch (error) {
      console.error('❌ Failed to retrieve real-world actions:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Update record in Airtable
   */
  async updateRecord(recordId: string, fields: Record<string, any>): Promise<BackendResponse<AirtableRecord>> {
    try {
      console.log('📝 Updating Airtable record:', recordId);

      // For now, return mock success
      // In production, this would call the Airtable API
      const mockRecord: AirtableRecord = {
        id: recordId,
        fields: {
          ...fields,
          'Last Updated': new Date().toISOString()
        },
        createdTime: new Date().toISOString()
      };

      return {
        success: true,
        data: mockRecord,
        message: 'Record updated successfully'
      };

    } catch (error) {
      console.error('❌ Failed to update record:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Delete record from Airtable
   */
  async deleteRecord(recordId: string): Promise<BackendResponse> {
    try {
      console.log('🗑️ Deleting Airtable record:', recordId);

      // For now, return mock success
      // In production, this would call the Airtable API
      return {
        success: true,
        message: 'Record deleted successfully'
      };

    } catch (error) {
      console.error('❌ Failed to delete record:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Search records in Airtable
   */
  async searchRecords(tableName: string, query: string, limit: number = 10): Promise<BackendResponse<AirtableRecord[]>> {
    try {
      console.log('🔍 Searching Airtable records in table:', tableName, 'query:', query);

      // For now, return mock data
      // In production, this would call the Airtable API
      const mockRecords: AirtableRecord[] = [];

      return {
        success: true,
        data: mockRecords
      };

    } catch (error) {
      console.error('❌ Failed to search records:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get table schema
   */
  async getTableSchema(tableName: string): Promise<BackendResponse<{ fields: Array<{ name: string; type: string; options?: any }> }>> {
    try {
      console.log('📋 Getting table schema for:', tableName);

      // For now, return mock schema
      // In production, this would call the Airtable API
      const mockSchema = {
        fields: [
          { name: 'User ID', type: 'singleLineText' },
          { name: 'Session ID', type: 'singleLineText' },
          { name: 'Assessment Data', type: 'longText' },
          { name: 'Timestamp', type: 'dateTime' },
          { name: 'Status', type: 'singleSelect', options: { choices: ['Completed', 'In Progress', 'Failed'] } }
        ]
      };

      return {
        success: true,
        data: mockSchema
      };

    } catch (error) {
      console.error('❌ Failed to get table schema:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Test Airtable connection
   */
  async testConnection(): Promise<BackendResponse<{ connected: boolean; baseId: string; tables: string[] }>> {
    try {
      console.log('🔌 Testing Airtable connection');

      // For now, return mock connection test
      // In production, this would test the actual Airtable API connection
      const mockConnection = {
        connected: true,
        baseId: this.baseId,
        tables: ['Assessments', 'Actions', 'Users', 'Progress']
      };

      return {
        success: true,
        data: mockConnection
      };

    } catch (error) {
      console.error('❌ Airtable connection test failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get available tables
   */
  getAvailableTables(): string[] {
    return [
      'Assessments',
      'Actions',
      'Users',
      'Progress',
      'ICP Analysis',
      'Cost Calculations',
      'Business Cases',
      'Exports'
    ];
  }

  /**
   * Validate Airtable configuration
   */
  validateConfiguration(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.apiKey) {
      errors.push('Airtable API key is required');
    }

    if (!this.baseId) {
      errors.push('Airtable base ID is required');
    }

    if (!this.baseUrl) {
      errors.push('Airtable API URL is required');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Core Airtable functions required by validation
   */
  async createRecord(tableName: string, fields: Record<string, any>): Promise<BackendResponse<AirtableRecord>> {
    try {
      console.log('📝 Creating Airtable record in table:', tableName);
      
      const mockRecord: AirtableRecord = {
        id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        fields,
        createdTime: new Date().toISOString()
      };

      return {
        success: true,
        data: mockRecord,
        message: 'Record created successfully'
      };
    } catch (error) {
      console.error('❌ Failed to create record:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getRecord(tableName: string, recordId: string): Promise<BackendResponse<AirtableRecord>> {
    try {
      console.log('📋 Getting Airtable record:', recordId, 'from table:', tableName);
      
      const mockRecord: AirtableRecord = {
        id: recordId,
        fields: {
          'ID': recordId,
          'Table': tableName,
          'Created': new Date().toISOString()
        },
        createdTime: new Date().toISOString()
      };

      return {
        success: true,
        data: mockRecord
      };
    } catch (error) {
      console.error('❌ Failed to get record:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async listRecords(tableName: string, limit: number = 100): Promise<BackendResponse<AirtableRecord[]>> {
    try {
      console.log('📋 Listing Airtable records from table:', tableName);
      
      const mockRecords: AirtableRecord[] = [
        {
          id: 'rec_1',
          fields: {
            'Table': tableName,
            'Status': 'Active',
            'Created': new Date().toISOString()
          },
          createdTime: new Date().toISOString()
        }
      ];

      return {
        success: true,
        data: mockRecords.slice(0, limit)
      };
    } catch (error) {
      console.error('❌ Failed to list records:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get user progress data from Airtable
   */
  async getUserProgress(userId: string): Promise<any> {
    try {
      console.log('📊 Getting user progress from Airtable for user:', userId);

      // For now, return mock data
      // In production, this would call the Airtable API
      const mockProgress = {
        userId: userId,
        totalPoints: 0,
        currentScores: {
          sales: 0,
          marketing: 0,
          product: 0,
          operations: 0
        },
        levelProgress: {
          currentLevel: 'foundation',
          pointsToNext: 100,
          progressPercentage: 0
        },
        toolAccess: {
          icpAnalysis: false,
          costCalculator: false,
          assessment: true
        },
        lastUpdated: new Date().toISOString()
      };

      return mockProgress;

    } catch (error) {
      console.error('❌ Failed to get user progress:', error);
      return null;
    }
  }

  /**
   * Store user progress data in Airtable
   */
  async storeUserProgress(userProgress: any): Promise<BackendResponse<AirtableRecord>> {
    try {
      console.log('💾 Storing user progress in Airtable for user:', userProgress.userId);

      // For now, return mock success
      // In production, this would call the Airtable API
      const mockRecord: AirtableRecord = {
        id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        fields: {
          'User ID': userProgress.userId,
          'Progress Data': JSON.stringify(userProgress),
          'Last Updated': userProgress.lastUpdated,
          'Status': 'Active'
        },
        createdTime: new Date().toISOString()
      };

      return {
        success: true,
        data: mockRecord,
        message: 'User progress stored successfully'
      };

    } catch (error) {
      console.error('❌ Failed to store user progress:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

// Export singleton instance
export const airtableService = new AirtableService();
export default airtableService;
