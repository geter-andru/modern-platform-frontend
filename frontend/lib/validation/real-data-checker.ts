import React from 'react';

export const validateRealData = (data: any, context: string): boolean => {
  const mockPatterns = [ // @production-approved
    /mock|fake|dummy|test|sample/i,
    /lorem ipsum/i,
    /john doe|jane doe/i,
    /@example\.com/,
    /123-456-7890/,
    /placeholder/i
  ];

  const dataString = JSON.stringify(data).toLowerCase();
  
  for (const pattern of mockPatterns) { // @production-approved
    if (pattern.test(dataString)) {
      throw new Error(`❌ MOCK DATA DETECTED in ${context}: Real data required for production!`);
    }
  }
  
  // Additional validation for empty or minimal data
  if (!data || Object.keys(data).length === 0) {
    throw new Error(`❌ EMPTY DATA in ${context}: Real data implementation required!`);
  }
  
  return true;
};

// Usage in components (MANDATORY)
export const useRealData = (dataSource: string, data: any) => {
  React.useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      validateRealData(data, dataSource);
    }
  }, [data, dataSource]);
  
  return data;
};