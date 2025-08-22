import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader } from 'lucide-react';

interface InfiniteScrollProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  loadMore: () => Promise<void>;
  hasMore: boolean;
  loading: boolean;
  threshold?: number;
  className?: string;
  loadingComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  error?: Error | null;
}

export function InfiniteScroll<T>({
  items,
  renderItem,
  loadMore,
  hasMore,
  loading,
  threshold = 100,
  className = '',
  loadingComponent,
  emptyComponent,
  errorComponent,
  error
}: InfiniteScrollProps<T>) {
  const [isMounted, setIsMounted] = useState(false);
  const observerRef = useRef<IntersectionObserver>();
  const loadingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();
      
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            loadMore();
          }
        },
        { rootMargin: `${threshold}px` }
      );
      
      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore, loadMore, threshold]
  );

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  if (error && errorComponent) {
    return <div className={className}>{errorComponent}</div>;
  }

  if (!isMounted || (items.length === 0 && !loading)) {
    return emptyComponent ? <div className={className}>{emptyComponent}</div> : null;
  }

  return (
    <div className={className}>
      <AnimatePresence>
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            ref={index === items.length - 1 ? lastElementRef : undefined}
          >
            {renderItem(item, index)}
          </motion.div>
        ))}
      </AnimatePresence>

      {loading && (
        <motion.div
          ref={loadingRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center py-8"
        >
          {loadingComponent || (
            <div className="flex items-center space-x-2 text-gray-500">
              <Loader className="h-5 w-5 animate-spin" />
              <span>Loading more...</span>
            </div>
          )}
        </motion.div>
      )}

      {!loading && !hasMore && items.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 text-gray-500"
        >
          <p>You've reached the end!</p>
        </motion.div>
      )}
    </div>
  );
}

// Hook for infinite scroll functionality
export const useInfiniteScroll = <T,>(
  fetchFunction: (page: number) => Promise<{ data: T[]; hasMore: boolean }>,
  pageSize: number = 10
) => {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(0);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const result = await fetchFunction(page);
      setItems(prev => [...prev, ...result.data]);
      setHasMore(result.hasMore);
      setPage(prev => prev + 1);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, page, loading, hasMore]);

  const reset = useCallback(() => {
    setItems([]);
    setPage(0);
    setHasMore(true);
    setError(null);
  }, []);

  useEffect(() => {
    loadMore();
  }, []); // Load initial data

  return {
    items,
    loading,
    hasMore,
    error,
    loadMore,
    reset
  };
};