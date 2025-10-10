import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import { safeAsync, logError } from '../utils/errorHandling';

// Advanced query configuration with intelligent defaults
interface AdvancedQueryOptions<TData = unknown, TError = unknown> extends Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'> {
  enableBackground?: boolean;
  enableOptimistic?: boolean;
  cacheTime?: number;
}

interface OptimisticUpdate<TData> {
  optimisticData: TData;
  rollbackFn?: () => void;
}

// Smart query hook with advanced caching strategies
export function useAdvancedQuery<TData = unknown, TError = unknown>(
  queryKey: string[],
  queryFn: () => Promise<TData>,
  options: AdvancedQueryOptions<TData, TError> = {}
) {
  const {
    enableBackground = true,
    enableOptimistic = false,
    cacheTime = 1000 * 60 * 5, // 5 minutes default
    ...queryOptions
  } = options;

  const result = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, error } = await safeAsync(queryFn, { queryKey });
      if (error) {
        logError(error, { queryKey, context: 'useAdvancedQuery' });
        throw error;
      }
      return data!;
    },
    staleTime: enableBackground ? 1000 * 60 * 2 : 0, // 2 minutes for background
    gcTime: cacheTime,
    refetchOnWindowFocus: enableBackground,
    refetchOnMount: 'always',
    retry: (failureCount, error: any) => {
      // Don't retry on authentication errors
      if (error?.code === 'AUTH_ERROR') return false;
      // Don't retry on validation errors
      if (error?.code === 'VALIDATION_ERROR') return false;
      // Retry network errors up to 3 times
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...queryOptions
  });

  return {
    ...result,
    isStale: result.isStale,
    isFresh: !result.isStale && !result.isLoading,
    lastFetched: result.dataUpdatedAt,
    cacheStatus: result.status
  };
}

// Advanced mutation with optimistic updates and rollback
export function useAdvancedMutation<TData = unknown, TError = unknown, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: UseMutationOptions<TData, TError, TVariables> & {
    optimisticUpdate?: (variables: TVariables) => OptimisticUpdate<any>;
    invalidateQueries?: string[][];
    relatedQueries?: string[][];
  } = {}
) {
  const queryClient = useQueryClient();
  const [isOptimistic, setIsOptimistic] = useState(false);
  const [rollbackData, setRollbackData] = useState<any>(null);

  const mutation = useMutation({
    mutationFn: async (variables: TVariables) => {
      const { data, error } = await safeAsync(
        () => mutationFn(variables),
        { variables, context: 'useAdvancedMutation' }
      );
      
      if (error) {
        logError(error, { variables, context: 'useAdvancedMutation' });
        throw error;
      }
      
      return data!;
    },
    onMutate: async (variables) => {
      // Handle optimistic updates
      if (options.optimisticUpdate) {
        setIsOptimistic(true);
        const { optimisticData, rollbackFn } = options.optimisticUpdate(variables);
        
        // Store rollback data
        if (rollbackFn) {
          setRollbackData(rollbackFn);
        }

        // Apply optimistic update to related queries
        if (options.relatedQueries) {
          options.relatedQueries.forEach(queryKey => {
            queryClient.setQueryData(queryKey, optimisticData);
          });
        }

        return { previousData: optimisticData };
      }

      return options.onMutate?.(variables);
    },
    onSuccess: (data, variables, context) => {
      setIsOptimistic(false);
      setRollbackData(null);

      // Invalidate specified queries
      if (options.invalidateQueries) {
        options.invalidateQueries.forEach(queryKey => {
          queryClient.invalidateQueries({ queryKey });
        });
      }

      // Update related queries with actual data
      if (options.relatedQueries) {
        options.relatedQueries.forEach(queryKey => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      options.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      setIsOptimistic(false);

      // Rollback optimistic updates
      if (rollbackData && options.relatedQueries) {
        options.relatedQueries.forEach(queryKey => {
          queryClient.setQueryData(queryKey, rollbackData);
        });
      }
      
      setRollbackData(null);
      options.onError?.(error, variables, context);
    },
    ...options
  });

  const mutateWithRollback = useCallback(
    async (variables: TVariables) => {
      try {
        const result = await mutation.mutateAsync(variables);
        return { success: true, data: result };
      } catch (error) {
        return { success: false, error };
      }
    },
    [mutation]
  );

  return {
    ...mutation,
    mutateWithRollback,
    isOptimistic,
    canRollback: !!rollbackData
  };
}

// Infinite query with advanced pagination
export function useAdvancedInfiniteQuery<TData = unknown>(
  queryKey: string[],
  queryFn: ({ pageParam }: { pageParam: any }) => Promise<{
    data: TData[];
    nextCursor?: any;
    hasMore: boolean;
  }>,
  options: {
    initialPageParam?: any;
    getNextPageParam?: (lastPage: any) => any;
    getPreviousPageParam?: (firstPage: any) => any;
    maxPages?: number;
  } = {}
) {
  const {
    initialPageParam = null,
    maxPages = 10,
    getNextPageParam = (lastPage) => lastPage.hasMore ? lastPage.nextCursor : undefined,
    getPreviousPageParam,
    ...restOptions
  } = options;

  const result = useQuery({
    queryKey: [...queryKey, 'infinite'],
    queryFn: async () => {
      const allPages = [];
      let pageParam = initialPageParam;
      let pageCount = 0;

      while (pageParam !== undefined && pageCount < maxPages) {
        const { data, error } = await safeAsync(
          () => queryFn({ pageParam }),
          { pageParam, pageCount }
        );

        if (error) {
          logError(error, { queryKey, pageParam, pageCount });
          throw error;
        }

        allPages.push(data!);
        pageParam = getNextPageParam(data!);
        pageCount++;
      }

      return {
        pages: allPages,
        pageParams: Array.from({ length: pageCount }, (_, i) => i)
      };
    },
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    ...restOptions
  });

  const flattenedData = result.data?.pages.flatMap(page => page.data) || [];

  return {
    ...result,
    data: result.data,
    flattenedData,
    hasNextPage: result.data?.pages[result.data.pages.length - 1]?.hasMore || false,
    totalItems: flattenedData.length,
    pageCount: result.data?.pages.length || 0
  };
}

// Query prefetching utilities
export function usePrefetchQueries() {
  const queryClient = useQueryClient();

  const prefetchQuery = useCallback(
    async <TData>(
      queryKey: string[],
      queryFn: () => Promise<TData>,
      options: { staleTime?: number } = {}
    ) => {
      await queryClient.prefetchQuery({
        queryKey,
        queryFn,
        staleTime: options.staleTime || 1000 * 60 * 5
      });
    },
    [queryClient]
  );

  const prefetchQueries = useCallback(
    async (queries: Array<{
      queryKey: string[];
      queryFn: () => Promise<any>;
      staleTime?: number;
    }>) => {
      await Promise.allSettled(
        queries.map(query => prefetchQuery(query.queryKey, query.queryFn, query))
      );
    },
    [prefetchQuery]
  );

  return { prefetchQuery, prefetchQueries };
}