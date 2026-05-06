import { useCallback, useEffect, useState } from 'react';
import { getPageView } from '../lib/pageApi';
import type { PageViewResponse } from '../types';

export function usePageView(pageId: string | undefined) {
  const [page, setPage] = useState<PageViewResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPage = useCallback(async () => {
    if (!pageId) {
      setPage(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const pageView = await getPageView(pageId);
      setPage(pageView);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Failed to load page');
      setPage(null);
    } finally {
      setIsLoading(false);
    }
  }, [pageId]);

  useEffect(() => {
    void loadPage();
  }, [loadPage]);

  return {
    page,
    isLoading,
    error,
    reload: loadPage,
    setPage,
  };
}
