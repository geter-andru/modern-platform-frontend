/**
 * Supabase Client Unit Tests
 *
 * Tests the Supabase client configuration and helper functions:
 * - Client initialization
 * - Environment variable validation
 * - Helper function exports
 * - Error handling
 */

import { supabase, getCustomerAssets, updateCustomerAssets } from '../client';

describe('Supabase Client', () => {
  describe('Client Initialization', () => {
    test('supabase client is defined', () => {
      expect(supabase).toBeDefined();
    });

    test('supabase client has auth methods', () => {
      expect(supabase.auth).toBeDefined();
      expect(supabase.auth.getUser).toBeDefined();
      expect(supabase.auth.signOut).toBeDefined();
    });

    test('supabase client has database methods', () => {
      expect(supabase.from).toBeDefined();
      expect(typeof supabase.from).toBe('function');
    });
  });

  describe('Helper Functions', () => {
    test('getCustomerAssets is exported', () => {
      expect(getCustomerAssets).toBeDefined();
      expect(typeof getCustomerAssets).toBe('function');
    });

    test('updateCustomerAssets is exported', () => {
      expect(updateCustomerAssets).toBeDefined();
      expect(typeof updateCustomerAssets).toBe('function');
    });
  });

  describe('Environment Configuration', () => {
    test('uses test environment variables', () => {
      // In test environment, these should be set by jest.setup.js
      expect(process.env.NEXT_PUBLIC_SUPABASE_URL).toBeDefined();
      expect(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBeDefined();
    });

    test('test environment URL is correct', () => {
      expect(process.env.NEXT_PUBLIC_SUPABASE_URL).toBe('https://test.supabase.co');
    });

    test('test environment key is correct', () => {
      expect(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBe('test-anon-key');
    });
  });
});

describe('Supabase Helper Functions', () => {
  describe('getCustomerAssets', () => {
    test('returns a promise', () => {
      const result = getCustomerAssets('test-customer-id');
      expect(result).toBeInstanceOf(Promise);
    });

    test('handles valid customer ID', async () => {
      const result = await getCustomerAssets('test-customer-id');

      // In test environment, mocked to return null
      expect(result).toBeDefined();
    });

    test('handles empty customer ID', async () => {
      const result = await getCustomerAssets('');

      // Should handle gracefully
      expect(result).toBeDefined();
    });
  });

  describe('updateCustomerAssets', () => {
    test('returns a promise', () => {
      const result = updateCustomerAssets('test-customer-id', {});
      expect(result).toBeInstanceOf(Promise);
    });

    test('handles valid update data', async () => {
      const updateData = {
        assessmentCompleted: true,
        competencyScores: { valueCommunication: 75 }
      };

      const result = await updateCustomerAssets('test-customer-id', updateData);

      // Should complete without throwing
      expect(result).toBeDefined();
    });

    test('handles empty update object', async () => {
      const result = await updateCustomerAssets('test-customer-id', {});

      // Should handle gracefully
      expect(result).toBeDefined();
    });
  });
});

describe('Supabase Client Error Handling', () => {
  test('database query structure is correct', () => {
    // Verify from() returns query builder
    const query = supabase.from('test_table');

    expect(query).toBeDefined();
    expect(query.select).toBeDefined();
    expect(query.insert).toBeDefined();
    expect(query.update).toBeDefined();
    expect(query.delete).toBeDefined();
  });

  test('auth methods return promises', () => {
    const getUserPromise = supabase.auth.getUser();
    expect(getUserPromise).toBeInstanceOf(Promise);
  });
});
