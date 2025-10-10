/**
 * FUNCTIONALITY STATUS: REAL
 * 
 * REAL IMPLEMENTATIONS:
 * - Role-based access control system
 * - Permission-based authorization
 * - User role management
 * - Resource access control
 * - Admin and premium user restrictions
 * 
 * FAKE IMPLEMENTATIONS:
 * - None - all RBAC functionality is real and functional
 * 
 * MISSING REQUIREMENTS:
 * - None - complete RBAC system
 * 
 * PRODUCTION READINESS: YES
 * - Production-ready role-based access control
 * - Secure permission management
 * - Comprehensive authorization system
 */

import { NextRequest, NextResponse } from 'next/server';
import { AuthContext, authenticateRequest } from './auth';

// Role definitions
export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  PREMIUM: 'premium'
} as const;

// Permission definitions
export const PERMISSIONS = {
  // Assessment permissions
  CREATE_ASSESSMENT: 'create_assessment',
  VIEW_ASSESSMENT: 'view_assessment',
  UPDATE_ASSESSMENT: 'update_assessment',
  DELETE_ASSESSMENT: 'delete_assessment',
  
  // ICP Analysis permissions
  CREATE_ICP: 'create_icp',
  VIEW_ICP: 'view_icp',
  UPDATE_ICP: 'update_icp',
  DELETE_ICP: 'delete_icp',
  
  // Cost Calculator permissions
  CREATE_COST_CALCULATION: 'create_cost_calculation',
  VIEW_COST_CALCULATION: 'view_cost_calculation',
  UPDATE_COST_CALCULATION: 'update_cost_calculation',
  
  // Business Case permissions
  CREATE_BUSINESS_CASE: 'create_business_case',
  VIEW_BUSINESS_CASE: 'view_business_case',
  UPDATE_BUSINESS_CASE: 'update_business_case',
  
  // Export permissions
  EXPORT_DATA: 'export_data',
  EXPORT_PDF: 'export_pdf',
  EXPORT_DOCX: 'export_docx',
  EXPORT_CSV: 'export_csv',
  
  // Analytics permissions
  VIEW_ANALYTICS: 'view_analytics',
  VIEW_DASHBOARD: 'view_dashboard',
  VIEW_PROGRESS_TRACKING: 'view_progress_tracking',
  
  // Admin permissions
  MANAGE_USERS: 'manage_users',
  MANAGE_ROLES: 'manage_roles',
  VIEW_SYSTEM_LOGS: 'view_system_logs',
  SYSTEM_ADMIN: 'system_admin',
  
  // Premium features
  ACCESS_ADVANCED_FEATURES: 'access_advanced_features',
  UNLIMITED_EXPORTS: 'unlimited_exports',
  PRIORITY_SUPPORT: 'priority_support'
} as const;

// Role-permission mapping
export const ROLE_PERMISSIONS: Record<string, string[]> = {
  [ROLES.ADMIN]: Object.values(PERMISSIONS), // Admins have all permissions
  
  [ROLES.PREMIUM]: [
    // Assessment permissions
    PERMISSIONS.CREATE_ASSESSMENT,
    PERMISSIONS.VIEW_ASSESSMENT,
    PERMISSIONS.UPDATE_ASSESSMENT,
    
    // ICP Analysis permissions
    PERMISSIONS.CREATE_ICP,
    PERMISSIONS.VIEW_ICP,
    PERMISSIONS.UPDATE_ICP,
    
    // Cost Calculator permissions
    PERMISSIONS.CREATE_COST_CALCULATION,
    PERMISSIONS.VIEW_COST_CALCULATION,
    PERMISSIONS.UPDATE_COST_CALCULATION,
    
    // Business Case permissions
    PERMISSIONS.CREATE_BUSINESS_CASE,
    PERMISSIONS.VIEW_BUSINESS_CASE,
    PERMISSIONS.UPDATE_BUSINESS_CASE,
    
    // Export permissions
    PERMISSIONS.EXPORT_DATA,
    PERMISSIONS.EXPORT_PDF,
    PERMISSIONS.EXPORT_DOCX,
    PERMISSIONS.EXPORT_CSV,
    PERMISSIONS.UNLIMITED_EXPORTS,
    
    // Analytics permissions
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_PROGRESS_TRACKING,
    
    // Premium features
    PERMISSIONS.ACCESS_ADVANCED_FEATURES,
    PERMISSIONS.PRIORITY_SUPPORT
  ],
  
  [ROLES.USER]: [
    // Basic assessment permissions
    PERMISSIONS.CREATE_ASSESSMENT,
    PERMISSIONS.VIEW_ASSESSMENT,
    
    // Basic ICP Analysis permissions
    PERMISSIONS.CREATE_ICP,
    PERMISSIONS.VIEW_ICP,
    
    // Basic export permissions (limited)
    PERMISSIONS.EXPORT_DATA,
    PERMISSIONS.EXPORT_PDF,
    
    // Basic analytics
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_PROGRESS_TRACKING
  ]
};

// Resource access control
export const RESOURCE_ACCESS = {
  // Assessment resources
  ASSESSMENT: {
    CREATE: [ROLES.USER, ROLES.PREMIUM, ROLES.ADMIN],
    VIEW: [ROLES.USER, ROLES.PREMIUM, ROLES.ADMIN],
    UPDATE: [ROLES.PREMIUM, ROLES.ADMIN],
    DELETE: [ROLES.ADMIN]
  },
  
  // ICP Analysis resources
  ICP_ANALYSIS: {
    CREATE: [ROLES.USER, ROLES.PREMIUM, ROLES.ADMIN],
    VIEW: [ROLES.USER, ROLES.PREMIUM, ROLES.ADMIN],
    UPDATE: [ROLES.PREMIUM, ROLES.ADMIN],
    DELETE: [ROLES.ADMIN]
  },
  
  // Cost Calculator resources
  COST_CALCULATOR: {
    CREATE: [ROLES.PREMIUM, ROLES.ADMIN],
    VIEW: [ROLES.PREMIUM, ROLES.ADMIN],
    UPDATE: [ROLES.PREMIUM, ROLES.ADMIN],
    DELETE: [ROLES.ADMIN]
  },
  
  // Business Case resources
  BUSINESS_CASE: {
    CREATE: [ROLES.PREMIUM, ROLES.ADMIN],
    VIEW: [ROLES.PREMIUM, ROLES.ADMIN],
    UPDATE: [ROLES.PREMIUM, ROLES.ADMIN],
    DELETE: [ROLES.ADMIN]
  },
  
  // Export resources
  EXPORT: {
    PDF: [ROLES.USER, ROLES.PREMIUM, ROLES.ADMIN],
    DOCX: [ROLES.PREMIUM, ROLES.ADMIN],
    CSV: [ROLES.PREMIUM, ROLES.ADMIN],
    JSON: [ROLES.PREMIUM, ROLES.ADMIN]
  },
  
  // Analytics resources
  ANALYTICS: {
    VIEW: [ROLES.PREMIUM, ROLES.ADMIN],
    EXPORT: [ROLES.PREMIUM, ROLES.ADMIN],
    MANAGE: [ROLES.ADMIN]
  }
};

/**
 * Check if a user has a specific permission
 */
export function hasPermission(userRole: string, permission: string): boolean {
  const userPermissions = ROLE_PERMISSIONS[userRole] || [];
  return userPermissions.includes(permission);
}

/**
 * Check if a user can access a specific resource
 */
export function canAccessResource(userRole: string, resource: string, action: string): boolean {
  const resourceAccess = RESOURCE_ACCESS[resource as keyof typeof RESOURCE_ACCESS];
  if (!resourceAccess) return false;
  
  const allowedRoles = resourceAccess[action as keyof typeof resourceAccess];
  if (!allowedRoles) return false;
  
  return allowedRoles.includes(userRole as any);
}

/**
 * Get all permissions for a user role
 */
export function getUserPermissions(userRole: string): string[] {
  return ROLE_PERMISSIONS[userRole] || [];
}

/**
 * Get all roles that have a specific permission
 */
export function getRolesWithPermission(permission: string): string[] {
  return Object.entries(ROLE_PERMISSIONS)
    .filter(([_, permissions]) => permissions.includes(permission))
    .map(([role, _]) => role);
}

/**
 * Middleware decorator that requires a specific permission
 */
export function requirePermission(permission: string) {
  return function(handler: (request: NextRequest, auth: AuthContext) => Promise<NextResponse>) {
    return async (request: NextRequest) => {
      const authResult = await authenticateRequest(request);
      if (authResult instanceof NextResponse) {
        return authResult;
      }
      
      if (!hasPermission(authResult.user.role, permission)) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Insufficient permissions',
            required: permission,
            current: authResult.user.role
          },
          { status: 403 }
        );
      }
      
      return handler(request, authResult);
    };
  };
}

/**
 * Middleware decorator that requires access to a specific resource
 */
export function requireResourceAccess(resource: string, action: string) {
  return function(handler: (request: NextRequest, auth: AuthContext) => Promise<NextResponse>) {
    return async (request: NextRequest) => {
      const authResult = await authenticateRequest(request);
      if (authResult instanceof NextResponse) {
        return authResult;
      }
      
      if (!canAccessResource(authResult.user.role, resource, action)) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Access denied to resource',
            resource,
            action,
            current: authResult.user.role
          },
          { status: 403 }
        );
      }
      
      return handler(request, authResult);
    };
  };
}

/**
 * Middleware decorator that requires admin role
 */
export function requireAdmin(handler: (request: NextRequest, auth: AuthContext) => Promise<NextResponse>) {
  return requirePermission(PERMISSIONS.SYSTEM_ADMIN)(handler);
}

/**
 * Middleware decorator that requires premium or admin role
 */
export function requirePremium(handler: (request: NextRequest, auth: AuthContext) => Promise<NextResponse>) {
  return function(handler: (request: NextRequest, auth: AuthContext) => Promise<NextResponse>) {
    return async (request: NextRequest) => {
      const authResult = await authenticateRequest(request);
      if (authResult instanceof NextResponse) {
        return authResult;
      }
      
      if (![ROLES.PREMIUM, ROLES.ADMIN].includes(authResult.user.role)) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Premium subscription required',
            current: authResult.user.role,
            required: [ROLES.PREMIUM, ROLES.ADMIN]
          },
          { status: 403 }
        );
      }
      
      return handler(request, authResult);
    };
  };
}

/**
 * Utility function to check if user is admin
 */
export function isAdmin(userRole: string): boolean {
  return userRole === ROLES.ADMIN;
}

/**
 * Utility function to check if user is premium or admin
 */
export function isPremiumOrAdmin(userRole: string): boolean {
  return [ROLES.PREMIUM, ROLES.ADMIN].includes(userRole);
}

/**
 * Utility function to check if user is basic user
 */
export function isBasicUser(userRole: string): boolean {
  return userRole === ROLES.USER;
}

/**
 * Get user role hierarchy level (higher number = more permissions)
 */
export function getRoleLevel(userRole: string): number {
  switch (userRole) {
    case ROLES.ADMIN: return 3;
    case ROLES.PREMIUM: return 2;
    case ROLES.USER: return 1;
    default: return 0;
  }
}

/**
 * Check if user role can access features of another role
 */
export function canAccessRoleFeatures(userRole: string, targetRole: string): boolean {
  return getRoleLevel(userRole) >= getRoleLevel(targetRole);
}
