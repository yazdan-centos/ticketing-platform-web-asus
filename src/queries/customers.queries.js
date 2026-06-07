import { queryKeys } from '../lib/queryKeys';
import apiClient from '../api/apiClient';

export const customerListOptions = (filters = {}) => ({
  queryKey: queryKeys.customers.list(filters),
  queryFn: async () => {
    return apiClient.get('/api/customers/search', { params: filters });
  },
  keepPreviousData: true,
});

export const customerDetailOptions = (id) => ({
  queryKey: queryKeys.customers.detail(id),
  queryFn: async () => apiClient.get(`/api/customers/${id}`),
  enabled: !!id,
});
