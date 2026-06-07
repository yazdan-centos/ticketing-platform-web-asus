import { queryKeys } from '../lib/queryKeys';
import apiClient from '../api/apiClient';

/**
 * Query options factory for tickets.
 * Usage: useQuery(ticketListOptions(filters))
 */
export const ticketListOptions = (filters = {}) => ({
  queryKey: queryKeys.tickets.list(filters),
  queryFn: async () => {
    const params = { ...filters };
    return apiClient.get('/api/tickets', { params });
  },
  keepPreviousData: true,
});

export const ticketDetailOptions = (id) => ({
  queryKey: queryKeys.tickets.detail(id),
  queryFn: async () => apiClient.get(`/api/tickets/${id}`),
  enabled: !!id,
});

/**
 * Infinite query options for paginated ticket list.
 */
export const ticketInfiniteOptions = (filters = {}) => ({
  queryKey: queryKeys.tickets.list({ ...filters, infinite: true }),
  queryFn: async ({ pageParam = 0 }) => {
    return apiClient.get('/api/tickets', {
      params: { ...filters, page: pageParam },
    });
  },
  getNextPageParam: (lastPage) =>
    lastPage.last ? undefined : (lastPage.number ?? 0) + 1,
  initialPageParam: 0,
});
