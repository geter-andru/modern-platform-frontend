'use client';

import * as Sentry from "@sentry/nextjs";
import { useState } from "react";

export default function SentryTestPage() {
  const [testResult, setTestResult] = useState<string>('');

  const testClientError = () => {
    setTestResult('Triggering client-side error...');
    // Trigger an intentional error
    throw new Error('This is a test client-side error for Sentry!');
  };

  const testAsyncError = async () => {
    setTestResult('Triggering async error...');
    try {
      // @ts-ignore - intentional error
      await myUndefinedFunction();
    } catch (error) {
      Sentry.captureException(error);
      setTestResult('Async error captured and sent to Sentry!');
    }
  };

  const testPerformanceTracking = () => {
    setTestResult('Testing performance tracking...');
    Sentry.startSpan(
      {
        op: "ui.test",
        name: "Test Performance Tracking Button Click",
      },
      (span) => {
        span.setAttribute("testType", "manual");
        span.setAttribute("environment", process.env.NODE_ENV || 'development');

        // Simulate some work
        const start = Date.now();
        while (Date.now() - start < 100) {
          // Busy wait for 100ms
        }

        setTestResult('Performance span sent to Sentry! Check your dashboard.');
      },
    );
  };

  const testManualCapture = () => {
    setTestResult('Capturing manual error...');
    Sentry.captureException(new Error('Manual test error'), {
      level: 'warning',
      extra: {
        testType: 'manual',
        timestamp: new Date().toISOString(),
        userAction: 'clicked test button',
      },
    });
    setTestResult('Manual error sent to Sentry with context!');
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Sentry Integration Test Page</h1>
      <p style={{ marginBottom: '20px', color: '#666' }}>
        This page is for testing Sentry error tracking and performance monitoring.
        Click the buttons below to trigger test errors.
      </p>

      {testResult && (
        <div style={{
          padding: '15px',
          marginBottom: '20px',
          backgroundColor: '#f0f9ff',
          border: '1px solid #0ea5e9',
          borderRadius: '4px',
        }}>
          {testResult}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <button
          onClick={testClientError}
          style={{
            padding: '12px 24px',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Test Client-Side Error (Throws Exception)
        </button>

        <button
          onClick={testAsyncError}
          style={{
            padding: '12px 24px',
            backgroundColor: '#f97316',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Test Async Error (Undefined Function)
        </button>

        <button
          onClick={testPerformanceTracking}
          style={{
            padding: '12px 24px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Test Performance Tracking
        </button>

        <button
          onClick={testManualCapture}
          style={{
            padding: '12px 24px',
            backgroundColor: '#8b5cf6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Test Manual Error Capture
        </button>
      </div>

      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
        <h2>Backend Test Endpoints</h2>
        <p style={{ color: '#666', marginBottom: '15px' }}>
          Test backend Sentry integration (development only):
        </p>
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <li>
            <a
              href="http://localhost:3001/test/sentry-status"
              target="_blank"
              style={{ color: '#3b82f6', textDecoration: 'underline' }}
            >
              GET /test/sentry-status - Check Sentry configuration
            </a>
          </li>
          <li>
            <a
              href="http://localhost:3001/test/sentry-error"
              target="_blank"
              style={{ color: '#ef4444', textDecoration: 'underline' }}
            >
              GET /test/sentry-error - Trigger backend error
            </a>
          </li>
          <li>
            <a
              href="http://localhost:3001/test/sentry-performance"
              target="_blank"
              style={{ color: '#8b5cf6', textDecoration: 'underline' }}
            >
              GET /test/sentry-performance - Test performance monitoring
            </a>
          </li>
        </ul>
      </div>

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#fef3c7', borderRadius: '8px', border: '1px solid #f59e0b' }}>
        <strong>Note:</strong> In development mode, errors are logged to the console but NOT sent to Sentry.
        Deploy to production or set NODE_ENV=production to see errors in your Sentry dashboard.
      </div>
    </div>
  );
}
