// Advanced TypeScript utilities and patterns for Next.js platform

// Utility types for enhanced type safety
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

export type Nullable<T> = T | null;

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Brand types for primitive type safety
export type Brand<K, T> = K & { __brand: T };

export type UserId = Brand<string, 'UserId'>;
export type CustomerToken = Brand<string, 'CustomerToken'>;
export type Timestamp = Brand<number, 'Timestamp'>;
export type EmailAddress = Brand<string, 'EmailAddress'>;

// Advanced function types
export type AsyncFunction<T extends any[], R> = (...args: T) => Promise<R>;

export type EventHandler<T = any> = (event: T) => void;

export type AsyncEventHandler<T = any> = (event: T) => Promise<void>;

// State management types
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Timestamp | null;
}

export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface InfiniteData<T> {
  pages: PaginatedData<T>[];
  pageParams: unknown[];
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {
    timestamp: Timestamp;
    requestId: string;
    version: string;
  };
}

export interface ApiPaginatedResponse<T> extends ApiResponse<PaginatedData<T>> {
  links?: {
    first?: string;
    previous?: string;
    next?: string;
    last?: string;
  };
}

// Form validation types
export interface ValidationRule<T = any> {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: T) => string | null;
  message?: string;
}

export interface FormField<T = any> {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'checkbox' | 'textarea';
  placeholder?: string;
  defaultValue?: T;
  options?: Array<{ value: T; label: string }>;
  validation?: ValidationRule<T>;
  disabled?: boolean;
  hidden?: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface FormState<T = Record<string, any>> {
  values: T;
  errors: ValidationError[];
  touched: Record<string, boolean>;
  isValid: boolean;
  isSubmitting: boolean;
}

// Component prop types
export interface BaseProps {
  className?: string;
  children?: React.ReactNode;
  'data-testid'?: string;
}

export interface LoadingProps {
  loading?: boolean;
  loadingText?: string;
  skeleton?: boolean;
}

export interface ErrorProps {
  error?: string | Error | null;
  onErrorRetry?: () => void;
  showErrorDetails?: boolean;
}

export interface InteractiveProps {
  disabled?: boolean;
  onClick?: EventHandler<React.MouseEvent>;
  onHover?: EventHandler<React.MouseEvent>;
  onFocus?: EventHandler<React.FocusEvent>;
  onBlur?: EventHandler<React.FocusEvent>;
}

// Advanced component patterns
export type ComponentWithAs<P = {}, T extends React.ElementType = 'div'> = P & {
  as?: T;
} & Omit<React.ComponentPropsWithoutRef<T>, keyof P | 'as'>;

export type PolymorphicRef<T extends React.ElementType> = React.ComponentPropsWithRef<T>['ref'];

export type PolymorphicComponentPropsWithRef<
  T extends React.ElementType,
  P = {}
> = P & {
  as?: T;
  ref?: PolymorphicRef<T>;
} & Omit<React.ComponentPropsWithoutRef<T>, keyof P | 'as'>;

// Type guards and validation
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isArray<T>(value: unknown): value is T[] {
  return Array.isArray(value);
}

export function isFunction(value: unknown): value is Function {
  return typeof value === 'function';
}

export function isPromise<T = any>(value: unknown): value is Promise<T> {
  return value instanceof Promise;
}

export function isEmail(value: string): value is EmailAddress {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

export function isValidUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

// Advanced type transformations
export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

export type ValuesOf<T> = T[keyof T];

export type NonEmptyArray<T> = [T, ...T[]];

export type AtLeastOne<T> = [T, ...T[]] | T[];

export type ExactlyOne<T, K extends keyof T> = {
  [P in K]: T[P];
} & {
  [P in Exclude<keyof T, K>]?: never;
};

export type XOR<T, U> = (T | U) extends object 
  ? (Without<T, U> & U) | (Without<U, T> & T) 
  : T | U;

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

// Conditional types for complex scenarios
export type IfEquals<X, Y, A = X, B = never> = (<T>() => T extends X ? 1 : 2) extends <
  T
>() => T extends Y ? 1 : 2
  ? A
  : B;

export type WritableKeys<T> = {
  [P in keyof T]-?: IfEquals<
    { [Q in P]: T[P] },
    { -readonly [Q in P]: T[P] },
    P
  >;
}[keyof T];

export type ReadonlyKeys<T> = {
  [P in keyof T]-?: IfEquals<
    { [Q in P]: T[P] },
    { -readonly [Q in P]: T[P] },
    never,
    P
  >;
}[keyof T];

// Runtime type checking with TypeScript
export class TypeChecker {
  static validateApiResponse<T>(
    response: unknown,
    validator: (data: unknown) => data is T
  ): response is ApiResponse<T> {
    if (!isObject(response)) return false;
    
    const { success, data, error } = response as any;
    
    if (!isBoolean(success)) return false;
    
    if (success && data !== undefined) {
      return validator(data);
    }
    
    if (!success && error) {
      return isObject(error) && isString(error.message);
    }
    
    return false;
  }

  static validateFormField<T>(field: unknown): field is FormField<T> {
    if (!isObject(field)) return false;
    
    const { name, label, type } = field as any;
    
    return (
      isString(name) &&
      isString(label) &&
      isString(type) &&
      ['text', 'email', 'password', 'number', 'select', 'checkbox', 'textarea'].includes(type)
    );
  }

  static createValidator<T>(schema: {
    [K in keyof T]: (value: unknown) => value is T[K];
  }) {
    return function validate(obj: unknown): obj is T {
      if (!isObject(obj)) return false;
      
      return Object.entries(schema).every(([key, validator]) => {
        return (validator as (value: unknown) => boolean)((obj as any)[key]);
      });
    };
  }
}

// Advanced error handling types
export interface TypedError<T = any> extends Error {
  code: string;
  data?: T;
  timestamp: Timestamp;
  context?: Record<string, unknown>;
}

export function createTypedError<T = any>(
  message: string,
  code: string,
  data?: T,
  context?: Record<string, unknown>
): TypedError<T> {
  const error = new Error(message) as TypedError<T>;
  error.code = code;
  error.data = data;
  error.timestamp = Date.now() as Timestamp;
  error.context = context;
  return error;
}

// Generic repository pattern types
export interface Repository<T, ID = string> {
  findById(id: ID): Promise<T | null>;
  findAll(filters?: Partial<T>): Promise<T[]>;
  create(item: Omit<T, 'id'>): Promise<T>;
  update(id: ID, updates: Partial<T>): Promise<T>;
  delete(id: ID): Promise<boolean>;
  count(filters?: Partial<T>): Promise<number>;
}

export interface PaginatedRepository<T, ID = string> extends Repository<T, ID> {
  findPaginated(
    page: number,
    pageSize: number,
    filters?: Partial<T>
  ): Promise<PaginatedData<T>>;
}

// Event system types
export interface DomainEvent<T = any> {
  type: string;
  payload: T;
  timestamp: Timestamp;
  aggregateId?: string;
  version?: number;
  metadata?: Record<string, unknown>;
}

export interface DomainEventHandler<T = any> {
  handle(event: DomainEvent<T>): Promise<void>;
}

export interface EventBus {
  publish<T>(event: DomainEvent<T>): Promise<void>;
  subscribe<T>(eventType: string, handler: DomainEventHandler<T>): void;
  unsubscribe(eventType: string, handler: DomainEventHandler): void;
}

// Configuration types
export interface EnvironmentConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  API_BASE_URL: string;
  DATABASE_URL?: string;
  REDIS_URL?: string;
  JWT_SECRET?: string;
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
  AIRTABLE_API_KEY?: string;
  AIRTABLE_BASE_ID?: string;
}

export interface FeatureFlags {
  enableAdvancedAnalytics: boolean;
  enableRealTimeUpdates: boolean;
  enableExperimentalFeatures: boolean;
  enableDebugMode: boolean;
}

// Performance monitoring types
export interface PerformanceMetric {
  name: string;
  value: number;
  unit: 'ms' | 'bytes' | 'count' | '%';
  timestamp: Timestamp;
  tags?: Record<string, string>;
}

export interface PerformanceTracker {
  track(metric: PerformanceMetric): void;
  startTimer(name: string): () => void;
  recordMemoryUsage(component: string): void;
  getMetrics(filter?: string): PerformanceMetric[];
}