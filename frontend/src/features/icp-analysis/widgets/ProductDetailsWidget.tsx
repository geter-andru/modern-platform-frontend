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
  businessModel: string
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
  businessModel: string
  createdAt: string
}

export default function ProductDetailsWidget({ 
  className = '' 
}: ProductDetailsWidgetProps) {
  const [productDetails, setProductDetails] = useState<ProductDetails | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [saved, setSaved] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    productName: '',
    productDescription: '',
    distinguishingFeature: '',
    businessModel: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [productHistory, setProductHistory] = useState<ProductHistoryItem[]>([])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (!formData.productName.trim()) {
      setErrors({ productName: 'Product name is required' })
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
          customerId: 'current-user' // TODO: Get from auth context
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
    try {
      // Load user's saved products
      const response = await fetch('/api/products/history?customerId=current-user')
      
      if (response.ok) {
        const history = await response.json()
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
    
    try {
      // Validate form
      const newErrors: FormErrors = {}
      if (!formData.productName.trim()) newErrors.productName = 'Product name is required'
      if (!formData.productDescription.trim()) newErrors.productDescription = 'Product description is required'
      if (!formData.distinguishingFeature.trim()) newErrors.distinguishingFeature = 'Distinguishing feature is required'
      if (!formData.businessModel) newErrors.businessModel = 'Business model is required'
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors)
        return
      }

      console.log('🚀 Starting real ICP generation for:', formData.productName)
      
      // Call the real ICP generation API
      const response = await fetch('/api/icp-analysis/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productData: {
            productName: formData.productName.trim(),
            productDescription: formData.productDescription.trim(),
            distinguishingFeature: formData.distinguishingFeature.trim(),
            businessModel: formData.businessModel
          },
          customerId: 'current-user' // TODO: Get from auth context
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate ICP analysis')
      }
      
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'ICP generation failed')
      }
      
      console.log('✅ ICP Analysis generated successfully:', result.data)
      
      // Update product details with generated data
      const generatedProductDetails: ProductDetails = {
        name: formData.productName,
        description: formData.productDescription,
        category: 'SaaS', // Default category, could be enhanced
        targetMarket: result.data.sections?.targetCompanyProfile?.industry || 'B2B Companies',
        keyFeatures: [
          'ICP Analysis',
          'Market Intelligence', 
          'Decision Maker Profiling',
          'Competitive Analysis'
        ],
        pricing: formData.businessModel === 'b2b-subscription' ? 'Subscription-based' : 'One-time Purchase',
        competitiveAdvantage: formData.distinguishingFeature,
        lastUpdated: new Date().toISOString().split('T')[0]
      }
      
      setProductDetails(generatedProductDetails)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
      
      // TODO: Navigate to ICP results page or show success message
      console.log('🎯 ICP generation completed, ready for next steps')
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate ICP analysis. Please try again.'
      setErrors({ general: errorMessage })
      console.error('❌ ICP generation failed:', error)
    } finally {
      setIsGenerating(false)
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

  return (
    <div className={`bg-background-secondary border border-border-standard rounded-xl overflow-hidden ${className}`}>
      <div className="px-6 py-4 border-b" style={{ 
        backgroundColor: 'var(--color-background-tertiary)', 
        borderColor: 'var(--border-standard)' 
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
                  placeholder="Enter your product name"
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
                  placeholder="Describe what your product does and its main value proposition"
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
                disabled={isGenerating}
                whileHover={{ scale: isGenerating ? 1 : 1.02 }}
                whileTap={{ scale: isGenerating ? 1 : 0.98 }}
                className="flex items-center gap-3 px-6 py-3 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  backgroundColor: 'var(--color-brand-primary)',
                  color: 'var(--text-primary)'
                }}
                onMouseEnter={(e) => !isGenerating && ((e.target as HTMLElement).style.backgroundColor = 'var(--color-brand-primary-dark)')}
                onMouseLeave={(e) => !isGenerating && ((e.target as HTMLElement).style.backgroundColor = 'var(--color-brand-primary)')}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Generating ICP Analysis...
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
