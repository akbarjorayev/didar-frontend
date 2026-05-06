import { useCallback, useEffect, useState } from 'react';
import { createPage, getPageOwnerList, mapPageEntityToSummary, updatePage } from '../lib/pageApi';
import type { PageDTO, PageEntity, PageSummary } from '../types';

export function usePages(telegramId: string | null) {
  const [pages, setPages] = useState<PageSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPages = useCallback(async () => {
    if (!telegramId) {
      setPages([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const ownerPages = await getPageOwnerList(telegramId);
      setPages(ownerPages);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Failed to load pages');
      setPages([]);
    } finally {
      setIsLoading(false);
    }
  }, [telegramId]);

  useEffect(() => {
    void loadPages();
  }, [loadPages]);

  const handleCreatePage = useCallback(
    async (input: PageDTO) => {
      if (!telegramId) {
        throw new Error('Missing telegram id');
      }

      const createdPage = await createPage(telegramId, input);
      const summary = mapPageEntityToSummary(createdPage);
      setPages((current) => [summary, ...current.filter((page) => page.id !== summary.id)]);
      return createdPage;
    },
    [telegramId],
  );

  const handleUpdatePage = useCallback(
    async (pageId: string, input: Partial<PageDTO>) => {
      if (!telegramId) {
        throw new Error('Missing telegram id');
      }

      const updatedPage = await updatePage(telegramId, pageId, input);
      const summary = mapPageEntityToSummary(updatedPage);
      setPages((current) => current.map((page) => (page.id === summary.id ? summary : page)));
      return updatedPage;
    },
    [telegramId],
  );

  return {
    pages,
    isLoading,
    error,
    reload: loadPages,
    createPage: handleCreatePage,
    updatePage: handleUpdatePage,
  };
}
