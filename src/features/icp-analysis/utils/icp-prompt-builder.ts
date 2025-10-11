
export interface ProductData {
  productName: string;
  productDescription: string;
  distinguishingFeature: string;
  businessModel: 'b2b-subscription' | 'b2b-one-time';
}

export interface UserContext {
  industry?: string;
  companySize?: string;
  challenges?: string[];
  goals?: string[];
}

export interface ICPRequestData {
  productInfo: {
    name: string;
    description: string;
    distinguishingFeature: string;
    businessModel: string;
  };
  businessContext: {
    industry: string;
    companySize: string;
    currentChallenges: string[];
    goals: string[];
  };
}

/**
 * Build structured request data for ICP generation
 * Validates product data and prepares it for the backend API
 */
export function buildICPRequestData(productData: ProductData, userContext?: UserContext): ICPRequestData {
  // Validate required fields
  if (!productData.productName?.trim()) {
    throw new Error('Product name is required');
  }
  
  if (!productData.productDescription?.trim()) {
    throw new Error('Product description is required');
  }

  if (!productData.distinguishingFeature?.trim()) {
    throw new Error('Distinguishing feature is required');
  }

  if (!productData.businessModel) {
    throw new Error('Business model is required');
  }

  return {
    productInfo: {
      name: productData.productName.trim(),
      description: productData.productDescription.trim(),
      distinguishingFeature: productData.distinguishingFeature.trim(),
      businessModel: productData.businessModel
    },
    businessContext: {
      industry: userContext?.industry || 'Technology',
      companySize: userContext?.companySize || 'medium',
      currentChallenges: userContext?.challenges || ['scalability', 'efficiency'],
      goals: userContext?.goals || ['increase revenue', 'improve operations']
    }
  };
}

/**
 * Validate product data before sending to backend
 */
export function validateProductData(productData: ProductData): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!productData.productName?.trim()) {
    errors.push('Product name is required');
  }

  if (!productData.productDescription?.trim()) {
    errors.push('Product description is required');
  }

  if (!productData.distinguishingFeature?.trim()) {
    errors.push('Distinguishing feature is required');
  }

  if (!productData.businessModel) {
    errors.push('Business model is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

