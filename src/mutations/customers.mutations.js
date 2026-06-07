import { queryKeys } from '../lib/queryKeys';
import { queryClient } from '../lib/queryClient';
import apiClient from '../api/apiClient';

export const createCustomerMutation = () => ({
  mutationFn: (newCustomer) => apiClient.post('/api/customers', newCustomer),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.customers.lists() });
  },
});

export const updateCustomerMutation = () => ({
  mutationFn: ({ id, ...data }) => apiClient.put(`/api/customers/${id}`, data),
  onMutate: async ({ id, ...data }) => {
    await queryClient.cancelQueries({ queryKey: queryKeys.customers.detail(id) });

    const previousCustomer = queryClient.getQueryData(queryKeys.customers.detail(id));

    queryClient.setQueryData(queryKeys.customers.detail(id), (old) => ({
      ...old,
      ...data,
    }));

    return { previousCustomer };
  },
  onError: (_error, { id }, context) => {
    if (context?.previousCustomer) {
      queryClient.setQueryData(queryKeys.customers.detail(id), context.previousCustomer);
    }
  },
  onSettled: (_data, _error, { id }) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.customers.detail(id) });
    queryClient.invalidateQueries({ queryKey: queryKeys.customers.lists() });
  },
});

export const deleteCustomerMutation = () => ({
  mutationFn: (id) => apiClient.delete(`/api/customers/${id}`),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.customers.lists() });
  },
});
