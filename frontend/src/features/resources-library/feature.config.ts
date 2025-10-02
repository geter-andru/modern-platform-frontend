/**
 * Resources Library Feature Configuration
 * 
 * This file contains the configuration for the Resources Library feature,
 * including resource types, tier definitions, and system settings.
 */

export const RESOURCES_LIBRARY_CONFIG = {
  // Feature metadata
  name: 'Resources Library',
  version: '1.0.0',
  description: 'AI-powered resource generation with cumulative intelligence',
  
  // Resource categories
  categories: {
    content_templates: {
      id: 'content_templates',
      name: 'Content Templates',
      description: 'Reusable content frameworks and templates',
      icon: 'FileText',
      color: 'text-blue-600 bg-blue-50'
    },
    guides: {
      id: 'guides',
      name: 'Guides',
      description: 'Step-by-step instructions and tutorials',
      icon: 'FileText',
      color: 'text-green-600 bg-green-50'
    },
    frameworks: {
      id: 'frameworks',
      name: 'Frameworks',
      description: 'Structured methodologies and approaches',
      icon: 'CheckCircle',
      color: 'text-purple-600 bg-purple-50'
    },
    ai_prompts: {
      id: 'ai_prompts',
      name: 'AI Prompts',
      description: 'Ready-to-use prompt templates',
      icon: 'Sparkles',
      color: 'text-orange-600 bg-orange-50'
    },
    one_pagers: {
      id: 'one_pagers',
      name: 'One-Pagers',
      description: 'Executive summaries and overviews',
      icon: 'FileText',
      color: 'text-indigo-600 bg-indigo-50'
    },
    slide_decks: {
      id: 'slide_decks',
      name: 'Slide Decks',
      description: 'Presentation templates and structures',
      icon: 'FileText',
      color: 'text-pink-600 bg-pink-50'
    }
  },

  // Tier definitions
  tiers: {
    1: {
      id: 1,
      name: 'Core',
      description: 'Essential buyer intelligence and foundational frameworks',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      icon: 'FileText',
      isUnlocked: true,
      unlockRequirement: 'Available immediately',
      resourceCount: 12 // TODO: Update when all 35 resources are defined
    },
    2: {
      id: 2,
      name: 'Advanced',
      description: 'Advanced methodologies and systematic implementation',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      icon: 'Sparkles',
      isUnlocked: false,
      unlockRequirement: 'Complete Core tier + Competency Level 2',
      resourceCount: 15 // TODO: Update when all 35 resources are defined
    },
    3: {
      id: 3,
      name: 'Strategic',
      description: 'Sophisticated strategic frameworks for market leadership',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      icon: 'CheckCircle',
      isUnlocked: false,
      unlockRequirement: 'Complete Advanced tier + Competency Level 3',
      resourceCount: 8 // TODO: Update when all 35 resources are defined
    }
  },

  // Export formats
  exportFormats: {
    PDF: {
      id: 'PDF',
      name: 'PDF Document',
      description: 'Portable document format',
      icon: 'FileText',
      mimeType: 'application/pdf',
      extension: 'pdf',
      color: 'text-red-600 bg-red-50 hover:bg-red-100'
    },
    DOCX: {
      id: 'DOCX',
      name: 'Word Document',
      description: 'Editable document format',
      icon: 'File',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      extension: 'docx',
      color: 'text-blue-600 bg-blue-50 hover:bg-blue-100'
    },
    JSON: {
      id: 'JSON',
      name: 'JSON Data',
      description: 'Structured data format',
      icon: 'Database',
      mimeType: 'application/json',
      extension: 'json',
      color: 'text-green-600 bg-green-50 hover:bg-green-100'
    },
    CSV: {
      id: 'CSV',
      name: 'CSV Spreadsheet',
      description: 'Tabular data format',
      icon: 'Table',
      mimeType: 'text/csv',
      extension: 'csv',
      color: 'text-purple-600 bg-purple-50 hover:bg-purple-100'
    }
  },

  // Generation settings
  generation: {
    maxConcurrentGenerations: 3,
    defaultOptions: {
      temperature: 0.7,
      maxTokens: 4000,
      model: 'claude-3-5-sonnet-20241022',
      includeExamples: true
    },
    timeout: 30000, // 30 seconds
    retryAttempts: 3
  },

  // Export settings
  export: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxExportsPerHour: 20,
    supportedFormats: ['PDF', 'DOCX', 'JSON', 'CSV'],
    defaultOptions: {
      includeMetadata: true,
      customStyling: true,
      watermark: false,
      branding: true
    }
  },

  // UI settings
  ui: {
    gridColumns: {
      mobile: 1,
      tablet: 2,
      desktop: 3
    },
    itemsPerPage: 12,
    animationDuration: 200,
    loadingStates: {
      skeleton: true,
      shimmer: true
    }
  },

  // API settings
  api: {
    baseUrl: '/api/resources',
    endpoints: {
      list: '/list',
      generate: '/generate',
      export: '/export',
      dependencies: '/dependencies',
      tiers: '/tiers'
    },
    timeout: 10000, // 10 seconds
    retryAttempts: 2
  },

  // Analytics settings
  analytics: {
    trackViews: true,
    trackExports: true,
    trackGeneration: true,
    trackErrors: true,
    events: {
      resourceViewed: 'resource_viewed',
      resourceExported: 'resource_exported',
      resourceGenerated: 'resource_generated',
      tierUnlocked: 'tier_unlocked'
    }
  },

  // Development settings
  development: {
    enableMockData: true,
    enableDebugLogging: true,
    enablePerformanceMonitoring: true,
    mockGenerationDelay: 2000 // 2 seconds
  }
};

// Resource dependency mapping (placeholder - will be updated when provided)
export const RESOURCE_DEPENDENCIES: Record<string, string[]> = {
  'icp-analysis': ['product-details'],
  'buyer-personas': ['product-details', 'icp-analysis'],
  'empathy-maps': ['product-details', 'icp-analysis', 'buyer-personas'],
  'product-potential-assessment': ['product-details', 'icp-analysis', 'buyer-personas']
  // TODO: Add all 35 resources when dependency system is provided
};

// Tier unlock criteria (placeholder - will be updated when provided)
export const TIER_UNLOCK_CRITERIA: Record<number, any> = {
  1: {
    requiredResources: [],
    competencyLevel: 0,
    assessmentScore: 0,
    usageCount: 0
  },
  2: {
    requiredResources: ['icp-analysis', 'buyer-personas'],
    competencyLevel: 2,
    assessmentScore: 70,
    usageCount: 5
  },
  3: {
    requiredResources: ['icp-analysis', 'buyer-personas', 'empathy-maps', 'product-potential-assessment'],
    competencyLevel: 3,
    assessmentScore: 85,
    usageCount: 10
  }
};

// AI prompt templates (placeholder - will be updated when provided)
export const AI_PROMPT_TEMPLATES: Record<string, string> = {
  'icp-analysis': 'Generate a comprehensive ICP analysis for {productName}...',
  'buyer-personas': 'Create detailed buyer personas based on the ICP analysis...',
  'empathy-maps': 'Develop empathy maps using the buyer personas and ICP data...',
  'product-potential-assessment': 'Assess product potential using all previous resources...'
  // TODO: Add all 35 resource prompts when provided
};

export default RESOURCES_LIBRARY_CONFIG;