/**
 * Andru Revenue Intelligence - Brand Identity Constants
 *
 * OFFICIAL BRAND NAME: Andru Revenue Intelligence
 * SHORT FORM: Andru
 *
 * USAGE GUIDELINES:
 * - Use FULL name for: Titles, metadata, legal, first impressions, B2B materials
 * - Use SHORT form for: UI, conversations, repeated references, product features
 *
 * Last Updated: November 2, 2025
 */

export const BRAND_IDENTITY = {
  // ========================================
  // BRAND NAMES
  // ========================================
  FULL_NAME: 'Andru Revenue Intelligence',
  SHORT_NAME: 'Andru',
  TAGLINE: 'AI-powered ICP analysis for B2B SaaS founders',
  ELEVATOR_PITCH: 'Stop guessing who your buyers are. Start building revenue on signal, not hope.',

  // ========================================
  // METADATA
  // ========================================
  DEFAULT_TITLE: 'Andru Revenue Intelligence',
  DEFAULT_DESCRIPTION: 'Stop guessing who your buyers are. Andru uses AI to identify your ideal customer profile in under 3 minutes.',

  // SEO
  SEO_KEYWORDS: [
    'ICP analysis',
    'buyer personas',
    'B2B SaaS',
    'revenue intelligence',
    'customer profiling',
    'ideal customer profile',
    'sales enablement',
    'go-to-market strategy'
  ],

  // ========================================
  // LEGAL & COMPANY INFO
  // ========================================
  COMPANY_NAME: 'Andru Revenue Intelligence',
  COPYRIGHT_TEXT: '© 2025 Andru Revenue Intelligence. All rights reserved.',
  COPYRIGHT_YEAR: '2025',

  // ========================================
  // SOCIAL & CONTACT
  // ========================================
  TWITTER_HANDLE: '@AndruAI',
  LINKEDIN_URL: 'https://www.linkedin.com/company/andru-revenue-intelligence',
  SUPPORT_EMAIL: 'support@andru.com',

  // ========================================
  // FOUNDER INFORMATION
  // ========================================
  FOUNDER: {
    NAME: 'Brandon Geter',
    TITLE: 'Founder & CEO',
    BIO_SHORT: 'Silicon Valley SaaS Sales Veteran (9+ years)',
    BIO_MEDIUM: 'Built Andru in 4 months using Claude Code. Former sales leader at Apttus, Sumo Logic, Simpplr.',
    BIO_LONG: '9+ years enterprise SaaS sales experience. Scaled SDR teams from 1 → 10 people. Generated $7M+ quarterly pipeline. Deep expertise: CPQ, Cloud Monitoring, DevOps, Developer Tools.',
    PHILOSOPHY: 'People first, business second.',
    LINKEDIN: 'https://www.linkedin.com/in/brandongeter',
  },

  // ========================================
  // PRODUCT POSITIONING
  // ========================================
  POSITIONING: {
    CATEGORY: 'Revenue Intelligence',
    SUB_CATEGORY: 'ICP Analysis & Buyer Persona Generation',
    TARGET_MARKET: 'B2B SaaS Founders (Late Seed - Early Series A)',
    BUYER_PERSONA: 'Technical founders (INTJ/ENTJ) seeking data-driven GTM insights',
    UNIQUE_VALUE: 'Find your desert - the market context where your product becomes essential, not optional.',
  },

  // ========================================
  // PRICING & LAUNCH
  // ========================================
  PRICING: {
    FOUNDING_MEMBER_PRICE: '$149/mo',
    FOUNDING_MEMBER_PRICE_VALUE: 149,
    STANDARD_LAUNCH_PRICE: '$297/mo',
    STANDARD_LAUNCH_PRICE_VALUE: 297,
    FOUNDING_MEMBER_SPOTS: 100,
    LAUNCH_DATE: 'March 2025',
    BETA_LAUNCH_DATE: 'December 1, 2025',
  },
} as const;

export const BRAND_MESSAGING = {
  // ========================================
  // VALUE PROPOSITIONS
  // ========================================
  CORE_VALUE_PROP: 'Stop Guessing Who Your Buyers Are. Start Building Revenue on Signal, Not Hope.',

  SECONDARY_VALUE_PROPS: [
    'AI-powered ICP analysis in under 3 minutes',
    'From product description to buyer personas automatically',
    'Built for technical founders who value data over guesswork',
  ],

  // ========================================
  // TRUST SIGNALS
  // ========================================
  SOCIAL_PROOF: 'Used by 50+ B2B SaaS founding teams',
  TECHNICAL_PROOF: 'AI-powered ICP analysis',
  PERFORMANCE_PROOF: 'Sub-3s generation',

  // ========================================
  // KEY METAPHORS
  // ========================================
  DESERT_METAPHOR: {
    SHORT: 'Find your desert',
    MEDIUM: 'Your product has a desert - a context where it\'s essential, not optional',
    LONG: 'A bottle of water costs $0.10 in a grocery store. That same bottle is worth $1,000+ in the middle of the Sahara. Same product. 10,000x value difference. Your product has a "desert" - a context where it\'s not just useful, but essential.',
  },

  SIGNAL_VS_NOISE: {
    SHORT: 'Signal, not hope',
    MEDIUM: 'Build revenue on signal, not hope',
    LONG: 'Most founders analyze noise, not signal. We help you identify the buyers who are dying of thirst in the desert.',
  },

  // ========================================
  // CALLS TO ACTION
  // ========================================
  CTA: {
    PRIMARY: 'Generate Your ICP',
    SECONDARY: 'See Live Demo',
    FOUNDING_MEMBER: 'Apply for Founding Member Access',
    VIEW_PRICING: 'View Pricing',
    TRY_DEMO: 'Try Demo',
    GET_STARTED: 'Get Started',
  },

  // ========================================
  // CONVERSION COPY
  // ========================================
  FOMO: {
    FOUNDING_MEMBER_URGENCY: 'Join 100 founding members getting $149/mo locked-in pricing (launching at $297/mo in March 2025)',
    SPOTS_LIMITED: 'Only 100 founding member spots available',
    BETA_FREE: 'Free Beta • 100 Founding Member Spots • December 1, 2025',
  },

  OBJECTION_HANDLING: {
    TIME: 'Under 3 minutes from product description to complete ICP',
    QUALITY: 'Enterprise-grade AI analysis validated by 9+ years of B2B sales experience',
    TRUST: 'Built by Brandon Geter, former sales leader at Apttus, Sumo Logic, Simpplr',
  },
} as const;

export const BRAND_VOICE = {
  // ========================================
  // TONE & STYLE
  // ========================================
  TONE: {
    PRIMARY: 'Direct & Data-Driven',
    SECONDARY: 'Empathetic but No-Nonsense',
    AVOID: 'Hype, buzzwords, empty promises',
  },

  PERSONALITY: [
    'Systematic over chaotic',
    'Truth over polish',
    'Signal over noise',
    'People over products',
  ],

  // ========================================
  // WRITING GUIDELINES
  // ========================================
  DO: [
    'Use concrete examples and metaphors (desert, grocery store)',
    'Lead with outcomes, not features',
    'Be transparent about pricing and limitations',
    'Use founder story to build credibility',
    'Emphasize speed and efficiency (sub-3s, under 3 minutes)',
  ],

  DONT: [
    'Use vague claims ("revolutionary", "game-changing")',
    'Over-promise on results',
    'Hide pricing or use dark patterns',
    'Use emojis excessively (enterprise context)',
    'Mention competitors unless in direct comparison',
  ],
} as const;

// ========================================
// TYPE EXPORTS
// ========================================
export type BrandIdentity = typeof BRAND_IDENTITY;
export type BrandMessaging = typeof BRAND_MESSAGING;
export type BrandVoice = typeof BRAND_VOICE;

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Get appropriate brand name based on context
 */
export function getBrandName(context: 'full' | 'short' = 'short'): string {
  return context === 'full'
    ? BRAND_IDENTITY.FULL_NAME
    : BRAND_IDENTITY.SHORT_NAME;
}

/**
 * Format copyright notice
 */
export function getCopyrightNotice(): string {
  return BRAND_IDENTITY.COPYRIGHT_TEXT;
}

/**
 * Get metadata for page <head>
 */
export function getPageMetadata(overrides?: {
  title?: string;
  description?: string;
}): {
  title: string;
  description: string;
} {
  return {
    title: overrides?.title || BRAND_IDENTITY.DEFAULT_TITLE,
    description: overrides?.description || BRAND_IDENTITY.DEFAULT_DESCRIPTION,
  };
}

/**
 * Get founder bio by length
 */
export function getFounderBio(length: 'short' | 'medium' | 'long' = 'medium'): string {
  const { FOUNDER } = BRAND_IDENTITY;
  switch (length) {
    case 'short':
      return FOUNDER.BIO_SHORT;
    case 'medium':
      return FOUNDER.BIO_MEDIUM;
    case 'long':
      return FOUNDER.BIO_LONG;
    default:
      return FOUNDER.BIO_MEDIUM;
  }
}

/**
 * Get FOMO pricing copy
 */
export function getFOMOPricingCopy(): string {
  return BRAND_MESSAGING.FOMO.FOUNDING_MEMBER_URGENCY;
}
