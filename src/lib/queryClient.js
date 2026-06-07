import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      gcTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

// Global error observer for logging / toast notifications
queryClient.getQueryCache().subscribe((event) => {
  if (event?.type === 'updated' && event.action?.type === 'error') {
    const error = event.action.error;
    console.error('[Query Error]', error?.message || error);
  }
});

queryClient.getMutationCache().subscribe((event) => {
  if (event?.type === 'updated' && event.action?.type === 'error') {
    const error = event.action.error;
    console.error('[Mutation Error]', error?.message || error);
  }
});
