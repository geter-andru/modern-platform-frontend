'use client'

import React, { useState, useEffect } from 'react'
import { 
  backendService, 
  authService, 
  icpAnalysisService, 
  costCalculatorService, 
  businessCaseService,
  progressTrackingService,
  exportService 
} from '../lib/services'

interface TestResult {
  service: string;
  test: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  data?: Record<string, unknown>;
}

export default function BackendIntegrationTest() {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [overallStatus, setOverallStatus] = useState<'pending' | 'success' | 'error'>('pending')

  const addTestResult = (service: string, test: string, status: 'success' | 'error', message: string, data?: Record<string, unknown>) => {
    setTestResults(prev => [...prev, { service, test, status, message, data }])
  }

  const runBackendTests = async () => {
    setIsRunning(true)
    setTestResults([])
    setOverallStatus('pending')

    try {
      // Test 1: Backend Health Check
      console.log('🔍 Testing backend health...')
      const healthResponse = await backendService.checkHealth()
      if (healthResponse.success) {
        addTestResult('Backend', 'Health Check', 'success', 'Backend is healthy', healthResponse.data)
      } else {
        addTestResult('Backend', 'Health Check', 'error', healthResponse.error || 'Health check failed')
      }

      // Test 2: Authentication Service
      console.log('🔐 Testing authentication...')
      const authResult = await authService.validateCredentials('dru78DR9789SDF862', 'admin-demo-token-2025')
      if (authResult.valid) {
        addTestResult('Auth', 'Admin Validation', 'success', 'Admin authentication successful', authResult.customerData as any)
      } else {
        addTestResult('Auth', 'Admin Validation', 'error', authResult.error || 'Authentication failed')
      }

      // Test 3: Customer Data Retrieval
      console.log('👤 Testing customer data retrieval...')
      const customerResponse = await backendService.getCustomer('dru78DR9789SDF862')
      if (customerResponse.success) {
        addTestResult('Backend', 'Customer Data', 'success', 'Customer data retrieved successfully', customerResponse.data)
      } else {
        addTestResult('Backend', 'Customer Data', 'error', customerResponse.error || 'Failed to retrieve customer data')
      }

      // Test 4: Progress Tracking
      console.log('📊 Testing progress tracking...')
      const progressResponse = await progressTrackingService.getCustomerProgress('dru78DR9789SDF862')
      if (progressResponse.success) {
        addTestResult('Progress', 'Get Progress', 'success', 'Progress data retrieved successfully', progressResponse.data as any)
      } else {
        addTestResult('Progress', 'Get Progress', 'error', progressResponse.error || 'Failed to retrieve progress data')
      }

      // Test 5: ICP Analysis Service
      console.log('🎯 Testing ICP analysis service...')
      const icpTestData = {
        productName: 'Test Product',
        businessType: 'SaaS',
        productDescription: 'A comprehensive test product for backend integration testing with advanced features and capabilities designed for enterprise customers',
        keyFeatures: 'Feature 1, Feature 2, Feature 3',
        targetMarket: 'Enterprise'
      }
      
      const icpValidation = icpAnalysisService.validateProductData(icpTestData)
      if (icpValidation.valid) {
        addTestResult('ICP', 'Data Validation', 'success', 'ICP data validation passed', icpTestData)
      } else {
        addTestResult('ICP', 'Data Validation', 'error', `Validation failed: ${icpValidation.errors.join(', ')}`)
      }

      // Test 6: Cost Calculator Service
      console.log('💰 Testing cost calculator service...')
      const costTestData = {
        currentRevenue: 1000000,
        averageDealSize: 50000,
        conversionRate: 25
      }
      
      const costValidation = costCalculatorService.validateInput(costTestData)
      if (costValidation.valid) {
        addTestResult('Cost', 'Data Validation', 'success', 'Cost calculation data validation passed', costTestData)
      } else {
        addTestResult('Cost', 'Data Validation', 'error', `Validation failed: ${costValidation.errors.join(', ')}`)
      }

      // Test 7: Business Case Service
      console.log('📋 Testing business case service...')
      const businessCaseTestData = {
        template: 'revenue-optimization',
        customerData: {
          companyName: 'Test Company',
          industry: 'Technology',
          companySize: 'Medium',
          currentRevenue: 1000000
        }
      }
      
      const businessCaseValidation = businessCaseService.validateInput(businessCaseTestData)
      if (businessCaseValidation.valid) {
        addTestResult('Business Case', 'Data Validation', 'success', 'Business case data validation passed', businessCaseTestData)
      } else {
        addTestResult('Business Case', 'Data Validation', 'error', `Validation failed: ${businessCaseValidation.errors.join(', ')}`)
      }

      // Test 8: Export Service
      console.log('📤 Testing export service...')
      const exportFormats = (exportService as any).getSupportedFormats()
      if (exportFormats.length > 0) {
        addTestResult('Export', 'Format Support', 'success', `Supported formats: ${exportFormats.map((f: any) => f.format).join(', ')}`, exportFormats)
      } else {
        addTestResult('Export', 'Format Support', 'error', 'No export formats available')
      }

      // Test 9: Progress Tracking Action
      console.log('🎯 Testing progress tracking action...')
      const trackResult = await progressTrackingService.trackAction(
        'dru78DR9789SDF862',
        'test_action',
        { test: true, timestamp: new Date().toISOString() },
        'low',
        'other'
      )
      if (trackResult.success) {
        addTestResult('Progress', 'Action Tracking', 'success', 'Progress action tracked successfully')
      } else {
        addTestResult('Progress', 'Action Tracking', 'error', trackResult.error || 'Failed to track progress action')
      }

      // Determine overall status
      const errorCount = testResults.filter(r => r.status === 'error').length
      setOverallStatus(errorCount === 0 ? 'success' : 'error')

    } catch (error: unknown) {
      console.error('❌ Test suite failed:', error)
      addTestResult('System', 'Test Suite', 'error', error instanceof Error ? error.message : 'Test suite execution failed')
      setOverallStatus('error')
    } finally {
      setIsRunning(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50'
      case 'error': return 'text-red-600 bg-red-50'
      default: return 'text-yellow-600 bg-yellow-50'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅'
      case 'error': return '❌'
      default: return '⏳'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Backend Integration Test
            </h1>
            <p className="text-gray-600">
              Testing the connection between frontend services and backend APIs at{' '}
              <code className="bg-gray-100 px-2 py-1 rounded">https://hs-andru-test.onrender.com</code>
            </p>
          </div>

          <div className="mb-6">
            <button
              onClick={runBackendTests}
              disabled={isRunning}
              className={`px-6 py-3 rounded-lg font-medium ${
                isRunning
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isRunning ? 'Running Tests...' : 'Run Backend Tests'}
            </button>
          </div>

          {testResults.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg font-semibold">Test Results:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  overallStatus === 'success' 
                    ? 'bg-green-100 text-green-800' 
                    : overallStatus === 'error'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {overallStatus === 'success' ? 'All Tests Passed' : 
                   overallStatus === 'error' ? 'Some Tests Failed' : 'Tests Running'}
                </span>
              </div>

              {testResults.map((result, index) => (
                <div key={index} className={`p-4 rounded-lg border ${getStatusColor(result.status)}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg">{getStatusIcon(result.status)}</span>
                    <div>
                      <h3 className="font-semibold">{result.service} - {result.test}</h3>
                      <p className="text-sm opacity-75">{result.message}</p>
                    </div>
                  </div>
                  
                  {result.data && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-sm font-medium">View Data</summary>
                      <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Test Coverage</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✅ Backend Health Check</li>
              <li>✅ Authentication Service</li>
              <li>✅ Customer Data Retrieval</li>
              <li>✅ Progress Tracking</li>
              <li>✅ ICP Analysis Service</li>
              <li>✅ Cost Calculator Service</li>
              <li>✅ Business Case Service</li>
              <li>✅ Export Service</li>
              <li>✅ Progress Action Tracking</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
