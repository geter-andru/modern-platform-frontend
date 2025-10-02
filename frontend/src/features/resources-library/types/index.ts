// resources-library types exports
// This file is auto-maintained - do not edit manually

// Placeholder types to prevent module errors
export interface ResourceItem {
  id: string;
  title: string;
  category: string;
  content: string;
}

export interface ResourceCategory {
  id: string;
  name: string;
  description: string;
}

export interface ResourceGenerationRequest {
  product: string;
  category: string;
  requirements: string[];
}
