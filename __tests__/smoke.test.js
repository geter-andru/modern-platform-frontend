/**
 * Smoke Test - Validates Jest Infrastructure
 *
 * This test ensures the Jest testing infrastructure is properly configured
 * and can successfully run tests. It validates:
 * - Jest can execute tests
 * - React Testing Library is working
 * - Basic component rendering works
 * - Test environment is configured correctly
 */

import { render, screen } from '@testing-library/react';

// Simple test component
function TestComponent() {
  return (
    <div>
      <h1>Test Component</h1>
      <p>Infrastructure is working!</p>
    </div>
  );
}

describe('Smoke Tests - Jest Infrastructure Validation', () => {
  test('Jest can execute tests', () => {
    expect(true).toBe(true);
  });

  test('React Testing Library renders components', () => {
    render(<TestComponent />);

    const heading = screen.getByText('Test Component');
    expect(heading).toBeInTheDocument();
  });

  test('Test environment has required globals', () => {
    expect(global.testUtils).toBeDefined();
    expect(global.testUtils.mockUser).toBeDefined();
    expect(global.fetch).toBeDefined();
  });

  test('Jest mocks are configured', () => {
    const mockFn = jest.fn();
    mockFn('test');
    expect(mockFn).toHaveBeenCalledWith('test');
  });

  test('Environment variables are set', () => {
    expect(process.env.NODE_ENV).toBe('test');
    expect(process.env.NEXT_PUBLIC_SITE_URL).toBeDefined();
  });
});
