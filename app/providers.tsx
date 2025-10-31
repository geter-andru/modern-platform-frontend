'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { useState } from 'react';
import { CommandProvider, CommandPaletteContainer, CommandRegistry } from '../src/shared/components/ui/command-palette';
import { DesignSystemProvider } from '../src/shared/design-system';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes (increased for better caching)
            gcTime: 10 * 60 * 1000, // 10 minutes (garbage collection time)
            refetchOnWindowFocus: false,
            refetchOnMount: 'always',
            retry: (failureCount: number, error: any) => {
              // Don't retry on authentication errors
              if (error?.code === 'AUTH_ERROR') return false;
              // Don't retry on validation errors
              if (error?.code === 'VALIDATION_ERROR') return false;
              // Retry network errors up to 3 times
              return failureCount < 3;
            },
            retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
          },
          mutations: {
            retry: 1,
            retryDelay: 1000,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <DesignSystemProvider>
        <CommandProvider>
          <CommandRegistry>
            <CommandPaletteContainer>
              {children}
            </CommandPaletteContainer>
          </CommandRegistry>
          <ReactQueryDevtools initialIsOpen={false} />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--bg-surface)', // Use design system tokens
                color: 'var(--text-primary)',   // Use design system tokens
              },
              success: {
                style: {
                  background: 'var(--color-success)', // Use design system tokens
                },
              },
              error: {
                style: {
                  background: 'var(--color-error)', // Use design system tokens
                },
              },
            }}
          />
        </CommandProvider>
      </DesignSystemProvider>
    </QueryClientProvider>
  );
}