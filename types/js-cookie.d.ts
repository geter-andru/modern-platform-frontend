declare module 'js-cookie' {
  export interface CookieAttributes {
    expires?: number | Date;
    path?: string;
    domain?: string;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
  }

  export function get(name: string): string | undefined;
  export function set(name: string, value: string, options?: CookieAttributes): void;
  export function remove(name: string, options?: CookieAttributes): void;
  export function withAttributes(attributes: CookieAttributes): {
    get: (name: string) => string | undefined;
    set: (name: string, value: string, options?: CookieAttributes) => void;
    remove: (name: string, options?: CookieAttributes) => void;
  };

  export default {
    get,
    set,
    remove,
    withAttributes
  };
}

