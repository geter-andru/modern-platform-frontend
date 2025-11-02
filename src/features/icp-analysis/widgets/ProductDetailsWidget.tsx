import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Package,
  Edit,
  Save,
  RefreshCw,
  Target,
  TrendingUp,
  Users,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Star,
  Award,
  BarChart3,
  Building2,
  MapPin,
  Calendar,
  Zap,
  Brain,
  ArrowRight
} from 'lucide-react'
import { useAuth } from '@/app/lib/auth'
import { buildICPRequestData, validateProductData } from '../utils/icp-prompt-builder'
import { useJobStatus } from '@/app/hooks/useJobStatus'
import { authenticatedFetch } from '@/app/lib/middleware/api-auth'
import { API_CONFIG } from '@/app/lib/config/api'
import toast from 'react-hot-toast'

interface ProductDetails {
  name: string
  description: string
  category: string
  targetMarket: string
  keyFeatures: string[]
  pricing: string
  competitiveAdvantage: string
  lastUpdated: string
}

interface ProductDetailsWidgetProps {
  className?: string
}

interface FormData {
  productName: string
  productDescription: string
  distinguishingFeature: string
  businessModel: 'b2b-subscription' | 'b2b-one-time'
}

interface FormErrors {
  productName?: string
  productDescription?: string
  distinguishingFeature?: string
  businessModel?: string
  general?: string
}

interface ProductHistoryItem {
  id: string
  productName: string
  productDescription: string
  distinguishingFeature?: string
  businessModel: 'b2b-subscription' | 'b2b-one-time'
  createdAt: string
}

export default function ProductDetailsWidget({
  className = ''
}: ProductDetailsWidgetProps) {
  const { user, loading, session } = useAuth()
  const [productDetails, setProductDetails] = useState<ProductDetails | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [saved, setSaved] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    productName: '',
    productDescription: '',
    distinguishingFeature: '',
    businessModel: 'b2b-subscription'
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [productHistory, setProductHistory] = useState<ProductHistoryItem[]>([])
  const [showSuccessBanner, setShowSuccessBanner] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [generationStage, setGenerationStage] = useState('')
  const [jobId, setJobId] = useState<string | null>(null)

  // Ref to store progress interval for cleanup
  const progressIntervalRef = React.useRef<NodeJS.Timeout | null>(null)

  // Use job status hook to poll for ICP generation completion
  const { 
    status: jobStatus, 
    progress: jobProgress, 
    result: jobResult, 
    error: jobError, 
    isComplete, 
    isFailed,
    isLoading: isJobLoading
  } = useJobStatus(jobId, {
    onComplete: (result) => {
      console.log('✅ ICP generation job completed:', result);
      
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      setGenerationStage('✨ ICP Analysis Complete!');
      setGenerationProgress(100);
      setIsGenerating(false);
      setJobId(null); // Clear job ID after completion

      // Show success toast
      toast.success('ICP Analysis generated successfully!');

      // Update product details (will be saved by backend worker)
      const generatedProductDetails: ProductDetails = {
        name: formData.productName,
        description: formData.productDescription,
        category: 'SaaS',
        targetMarket: 'B2B Companies',
        keyFeatures: [
          'ICP Analysis',
          'Market Intelligence',
          'Decision Maker Profiling',
          'Competitive Analysis'
        ],
        pricing: formData.businessModel === 'b2b-subscription' ? 'Subscription-based' : 'One-time Purchase',
        competitiveAdvantage: formData.distinguishingFeature,
        lastUpdated: new Date().toISOString().split('T')[0]
      };

      setProductDetails(generatedProductDetails);
      setSaved(true);
      setShowSuccessBanner(true);

      // Refresh product history
      handleRefresh();

      // Auto-navigate to ICP Overview tab after 2 seconds
      setTimeout(() => {
        const overviewButton = document.querySelector('[data-widget-id="overview"]') as HTMLElement;
        if (overviewButton) {
          overviewButton.click();
        }
      }, 2000);
    },
    onError: (error) => {
      console.error('❌ ICP generation job failed:', error);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      setErrors({ general: error || 'Failed to generate ICP analysis' });
      setIsGenerating(false);
      setJobId(null);
      toast.error(error || 'ICP generation failed');
    },
    onStatusUpdate: (statusData) => {
      // Update progress based on job status
      if (statusData.status === 'waiting') {
        setGenerationProgress(10);
        setGenerationStage('Job queued, waiting to start...');
      } else if (statusData.status === 'active') {
        setGenerationProgress(30 + (statusData.progress || 0) * 0.6); // 30-90%
        setGenerationStage('Andru is doing the smart stuff...');
      } else if (statusData.status === 'completed') {
        setGenerationProgress(100);
        setGenerationStage('Adding the final touches...');
      }
    },
    autoStart: true
  });

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (!formData.productName.trim()) {
      setErrors({ productName: 'Product name is required' })
      return
    }

    if (!user) {
      setErrors({ general: 'User not authenticated' })
      return
    }

    setIsSaving(true)
    try {
      // Save product details to user's profile
      const response = await fetch('/api/products/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productData: formData,
          customerId: user.id
        })
      })

      if (!response.ok) {
        throw new Error('Failed to save product details')
      }

      setIsEditing(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
      console.log('✅ Product details saved successfully')
      
    } catch (error) {
      console.error('❌ Error saving product details:', error)
      setErrors({ general: 'Failed to save product details. Please try again.' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleRefresh = async () => {
    if (!user) return

    try {
      // Load user's saved products
      const response = await fetch(`/api/products/history?customerId=${user.id}`)

      if (response.ok) {
        const result = await response.json()
        // Backend returns { success: true, data: [...] }
        const history = result.data || result || []
        setProductHistory(history)
        console.log('✅ Product history loaded:', history.length, 'products')
      }
    } catch (error) {
      console.error('❌ Failed to load product history:', error)
    }
  }

  // Load product history on component mount
  useEffect(() => {
    handleRefresh()
  }, [])

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleGenerateICP = async () => {
    setIsGenerating(true)
    setErrors({})
    setShowSuccessBanner(false)
    setGenerationProgress(0)
    setGenerationStage('Waking up Andru...')

    // Progress simulation for better UX while waiting for job to start
    progressIntervalRef.current = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 30) return prev // Cap at 30% until job starts
        return prev + Math.random() * 5
      })
    }, 500)

    try {
      setGenerationStage('Reading your product details...')

      // Validate form using the prompt builder
      const validation = validateProductData(formData)
      if (!validation.isValid) {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current)
          progressIntervalRef.current = null
        }
        const newErrors: FormErrors = {}
        validation.errors.forEach(error => {
          if (error.includes('Product name')) newErrors.productName = error
          else if (error.includes('Product description')) newErrors.productDescription = error
          else if (error.includes('Distinguishing feature')) newErrors.distinguishingFeature = error
          else if (error.includes('Business model')) newErrors.businessModel = error
        })
        setErrors(newErrors)
        setIsGenerating(false)
        return
      }

      if (!user) {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current)
          progressIntervalRef.current = null
        }
        setErrors({ general: 'User not authenticated' })
        setIsGenerating(false)
        return
      }

      setGenerationStage('Getting Andru caffeinated...')
      console.log('🚀 Starting async ICP generation for:', formData.productName)

      // Build product info from form data
      const productInfo = {
        name: formData.productName,
        description: formData.productDescription,
        distinguishingFeature: formData.distinguishingFeature,
        businessModel: formData.businessModel
      }

      console.log('📤 Submitting ICP generation job to queue...')

      // Submit job to async queue (matches usePersonasCache pattern)
      const jobResponse = await authenticatedFetch(`${API_CONFIG.backend}/api/jobs/generate-icp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productInfo,
          industry: 'Technology', // TODO: Get from form or user profile
          goals: ['increase revenue', 'improve operations']
        })
      })

      if (!jobResponse.ok) {
        const errorData = await jobResponse.json();
        throw new Error(errorData.error || 'Failed to submit ICP generation job');
      }

      const jobData = await jobResponse.json();

      if (!jobData.success || !jobData.jobId) {
        throw new Error('Failed to get job ID from ICP generation submission');
      }

      console.log('✅ ICP generation job submitted:', jobData.jobId);

      // Set job ID to trigger useJobStatus polling
      setJobId(jobData.jobId);

      // Clear progress interval - useJobStatus will update progress now
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }

      setGenerationStage('Job submitted, processing...');
      setGenerationProgress(20);

    } catch (error) {
      // Clear progress interval on error
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }

      const errorMessage = error instanceof Error ? error.message : 'Failed to generate ICP analysis. Please try again.';
      setErrors({ general: errorMessage });
      console.error('❌ ICP generation job submission failed:', error);
      toast.error(errorMessage);
      setIsGenerating(false);
      setJobId(null);
    }
  }

  const loadProductFromHistory = (product: ProductHistoryItem) => {
    setFormData({
      productName: product.productName,
      productDescription: product.productDescription,
      distinguishingFeature: product.distinguishingFeature || '',
      businessModel: product.businessModel
    })
  }

  // Combine isGenerating and isJobLoading for overlay display
  const isProcessing = isGenerating || isJobLoading;

  return (
    <div className={`bg-background-secondary border border-transparent rounded-xl overflow-hidden ${className}`}>
      {/* Loading Overlay - Modern & Sophisticated */}
      {isProcessing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)'
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4"
            style={{
              border: '1px solid rgba(124, 77, 255, 0.3)',
              boxShadow: '0 0 60px rgba(124, 77, 255, 0.2)'
            }}
          >
            {/* Animated Brain Icon */}
            <div className="flex justify-center mb-6">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Brain className="w-16 h-16" style={{ color: 'var(--color-brand-primary)' }} />
              </motion.div>
            </div>

            {/* Stage Text */}
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                {generationStage}
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Andru is analyzing your product...
              </p>
            </div>

            {/* Progress Bar */}
            <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden mb-4">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  background: 'linear-gradient(90deg, var(--color-brand-primary), var(--color-brand-secondary))',
                  width: `${generationProgress}%`
                }}
                initial={{ width: '0%' }}
                animate={{ width: `${generationProgress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>

            {/* Progress Percentage */}
            <div className="text-center">
              <span className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>
                {Math.round(generationProgress)}%
              </span>
            </div>

            {/* Witty Messages */}
            <motion.div
              key={generationStage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mt-4"
            >
              <p className="text-xs italic" style={{ color: 'var(--text-tertiary)' }}>
                {generationProgress < 30 && "Warming up the neural networks..."}
                {generationProgress >= 30 && generationProgress < 60 && "Crunching the numbers with style..."}
                {generationProgress >= 60 && generationProgress < 90 && "Almost there! Making it perfect..."}
                {generationProgress >= 90 && "Putting on the finishing touches..."}
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}

      {/* Success Banner */}
      {showSuccessBanner && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 right-4 z-50 max-w-md"
        >
          <div
            className="rounded-lg shadow-2xl p-4 border"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-accent-success)',
              boxShadow: '0 10px 40px rgba(0, 255, 0, 0.2)'
            }}
          >
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 flex-shrink-0" style={{ color: 'var(--color-accent-success)' }} />
              <div className="flex-1">
                <h4 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                  ICP Analysis Complete!
                </h4>
                <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                  Your ICP has been generated successfully. Redirecting to overview...
                </p>
                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-brand-primary)' }}>
                  <ArrowRight className="w-4 h-4" />
                  <span>Auto-navigating in 2 seconds</span>
                </div>
              </div>
              <button
                onClick={() => setShowSuccessBanner(false)}
                className="text-sm hover:opacity-70 transition-opacity"
                style={{ color: 'var(--text-tertiary)' }}
              >
                ✕
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="px-6 py-4 border-b border-transparent" style={{ 
        backgroundColor: 'var(--color-background-tertiary)'
      }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6" style={{ color: 'var(--color-brand-primary)' }} />
            <div>
              <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>My Product Details</h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {productDetails ? 'Product configured - ready for ICP analysis' : 'Define your product to generate accurate ICP analysis'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {saved && (
              <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-accent-success)' }}>
                <CheckCircle className="w-4 h-4" />
                Saved
              </div>
            )}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              style={{ 
                backgroundColor: 'var(--color-surface)',
                color: 'var(--text-primary)'
              }}
              onMouseEnter={(e) => !isSaving && ((e.target as HTMLElement).style.backgroundColor = 'var(--color-surface-hover)')}
              onMouseLeave={(e) => !isSaving && ((e.target as HTMLElement).style.backgroundColor = 'var(--color-surface)')}
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        
        <div className="flex-1 p-6">
          <div className="max-w-2xl">
            <div className="space-y-6">
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Product Name *
                </label>
                <input
                  type="text"
                  value={formData.productName}
                  onChange={(e) => handleInputChange('productName', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: errors.productName ? 'var(--color-accent-danger)' : 'var(--border-standard)',
                    color: 'var(--text-primary)'
                  } as React.CSSProperties}
                  placeholder="e.g., Revenue Intelligence Platform, API Gateway, Data Pipeline"
                />
                {errors.productName && (
                  <p className="text-sm mt-1" style={{ color: 'var(--color-accent-danger)' }}>{errors.productName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Product Description *
                </label>
                <textarea
                  value={formData.productDescription}
                  onChange={(e) => handleInputChange('productDescription', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: errors.productDescription ? 'var(--color-accent-danger)' : 'var(--border-standard)',
                    color: 'var(--text-primary)'
                  } as React.CSSProperties}
                  placeholder="Describe core functionality, technical architecture, and primary use cases. Include key technical capabilities (e.g., real-time data processing, REST API integration, multi-tenant architecture)."
                />
                {errors.productDescription && (
                  <p className="text-sm mt-1" style={{ color: 'var(--color-accent-danger)' }}>{errors.productDescription}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Distinguishing Feature *
                </label>
                <textarea
                  value={formData.distinguishingFeature}
                  onChange={(e) => handleInputChange('distinguishingFeature', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: errors.distinguishingFeature ? 'var(--color-accent-danger)' : 'var(--border-standard)',
                    color: 'var(--text-primary)'
                  } as React.CSSProperties}
                  placeholder="What makes your product unique or different from competitors?"
                />
                {errors.distinguishingFeature && (
                  <p className="text-sm mt-1" style={{ color: 'var(--color-accent-danger)' }}>{errors.distinguishingFeature}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Business Model *
                </label>
                <select
                  value={formData.businessModel}
                  onChange={(e) => handleInputChange('businessModel', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: errors.businessModel ? 'var(--color-accent-danger)' : 'var(--border-standard)',
                    color: 'var(--text-primary)'
                  } as React.CSSProperties}
                >
                  <option value="">Select business model</option>
                  <option value="b2b-subscription">B2B Subscription</option>
                  <option value="b2b-one-time">B2B One-time Purchase</option>
                </select>
                {errors.businessModel && (
                  <p className="text-sm mt-1" style={{ color: 'var(--color-accent-danger)' }}>{errors.businessModel}</p>
                )}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--border-standard)' }}>
              {errors.general && (
                <div className="mb-4 p-3 rounded-lg" style={{ 
                  backgroundColor: 'rgba(239, 68, 68, 0.1)', 
                  border: '1px solid rgba(239, 68, 68, 0.3)' 
                }}>
                  <p className="text-sm" style={{ color: 'var(--color-accent-danger)' }}>{errors.general}</p>
                </div>
              )}
              
              {productDetails && (
                <div className="mb-4 p-3 rounded-lg" style={{ 
                  backgroundColor: 'rgba(34, 197, 94, 0.1)', 
                  border: '1px solid rgba(34, 197, 94, 0.3)' 
                }}>
                  <p className="text-sm" style={{ color: 'var(--color-accent-success)' }}>
                    ✅ ICP Analysis generated successfully! Your product "{productDetails.name}" is ready for analysis.
                  </p>
                </div>
              )}
              <motion.button
                onClick={handleGenerateICP}
                disabled={isProcessing}
                whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                className="flex items-center gap-3 px-6 py-3 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  backgroundColor: 'var(--color-brand-primary)',
                  color: 'var(--text-primary)'
                }}
                onMouseEnter={(e) => !isProcessing && ((e.target as HTMLElement).style.backgroundColor = 'var(--color-brand-primary-dark)')}
                onMouseLeave={(e) => !isProcessing && ((e.target as HTMLElement).style.backgroundColor = 'var(--color-brand-primary)')}
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    {isGenerating ? 'Submitting job...' : 'Processing ICP Analysis...'}
                  </>
                ) : (
                  <>
                    <Target className="w-5 h-5" />
                    Generate ICP Analysis
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>

        <div className="w-80 border-l p-6" style={{ 
          backgroundColor: 'var(--color-background-tertiary)', 
          borderColor: 'var(--border-standard)' 
        }}>
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5" style={{ color: 'var(--color-brand-primary)' }} />
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Product History</h3>
          </div>
          
          {productHistory.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No saved products yet</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Save your first product to see it here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {productHistory.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-lg p-4 cursor-pointer transition-colors"
                  style={{ backgroundColor: 'var(--color-surface)' }}
                  onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = 'var(--color-surface-hover)'}
                  onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = 'var(--color-surface)'}
                  onClick={() => loadProductFromHistory(product)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm truncate" style={{ color: 'var(--text-primary)' }}>{product.productName}</h4>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {new Date(product.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs mb-2 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                    {product.productDescription}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded text-xs font-medium" style={{
                      backgroundColor: product.businessModel === 'b2b-subscription' 
                        ? 'rgba(59, 130, 246, 0.2)' 
                        : 'rgba(16, 185, 129, 0.2)',
                      color: product.businessModel === 'b2b-subscription' 
                        ? 'var(--color-brand-primary)' 
                        : 'var(--color-brand-secondary)'
                    }}>
                      {product.businessModel === 'b2b-subscription' ? 'Subscription' : 'One-time'}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
