'use client';

import { useState, useEffect, useCallback } from 'react';

export interface UseFetchResult<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: (bypassCache?: boolean) => Promise<void>;
}

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

const DEFAULT_STALE_TIME_MS = 60_000; // 60 seconds default client-side stale time
const clientCache = new Map<string, CacheItem<any>>();

export function clearFetchCache(urlPattern?: string) {
  if (!urlPattern) {
    clientCache.clear();
    return;
  }
  for (const key of clientCache.keys()) {
    if (key.includes(urlPattern)) {
      clientCache.delete(key);
    }
  }
}

export function useFetch<T>(
  url: string | null,
  options?: { staleTime?: number }
): UseFetchResult<T> {
  const staleTime = options?.staleTime ?? DEFAULT_STALE_TIME_MS;

  const cached = url ? clientCache.get(url) : undefined;
  const isCacheValid = !!(cached && Date.now() - cached.timestamp < staleTime);

  const [data, setData] = useState<T | null>(isCacheValid ? cached.data : null);
  const [isLoading, setIsLoading] = useState<boolean>(!!url && !isCacheValid);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(
    async (bypassCache = false) => {
      if (!url) {
        setData(null);
        setIsLoading(false);
        setError(null);
        return;
      }

      if (!bypassCache) {
        const item = clientCache.get(url);
        if (item && Date.now() - item.timestamp < staleTime) {
          setData(item.data);
          setIsLoading(false);
          setError(null);
          return;
        }
      }

      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(url);
        if (!res.ok) {
          if (
            res.status === 401 &&
            typeof window !== 'undefined' &&
            url.includes('/api/admin') &&
            !url.includes('/api/admin/check')
          ) {
            window.location.href = '/admin/auth';
          }
          throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
        }
        const json = await res.json();
        const resultData = json.data !== undefined ? json.data : json;

        clientCache.set(url, { data: resultData, timestamp: Date.now() });
        setData(resultData);
      } catch (err: any) {
        setError(err instanceof Error ? err : new Error(String(err)));
        setData(null);
      } finally {
        setIsLoading(false);
      }
    },
    [url, staleTime]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch: () => fetchData(true),
  };
}

