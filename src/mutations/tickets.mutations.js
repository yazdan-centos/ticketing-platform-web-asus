import { queryKeys } from '../lib/queryKeys';
import { queryClient } from '../lib/queryClient';
import apiClient from '../api/apiClient';

/**
 * Mutation option factories for tickets.
 * Each returns an object suitable for useMutation().
 */

export const createTicketMutation = () => ({
  mutationFn: (newTicket) => apiClient.post('/api/tickets', newTicket),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.tickets.lists() });
  },
});

export const updateTicketMutation = () => ({
  mutationFn: ({ id, ...data }) => apiClient.put(`/api/tickets/${id}`, data),
  onMutate: async ({ id, ...data }) => {
    await queryClient.cancelQueries({ queryKey: queryKeys.tickets.detail(id) });

    const previousTicket = queryClient.getQueryData(queryKeys.tickets.detail(id));

    queryClient.setQueryData(queryKeys.tickets.detail(id), (old) => ({
      ...old,
      ...data,
    }));

    return { previousTicket };
  },
  onError: (_error, { id }, context) => {
    if (context?.previousTicket) {
      queryClient.setQueryData(queryKeys.tickets.detail(id), context.previousTicket);
    }
  },
  onSettled: (_data, _error, { id }) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.tickets.detail(id) });
    queryClient.invalidateQueries({ queryKey: queryKeys.tickets.lists() });
  },
});

export const assignTicketMutation = () => ({
  mutationFn: ({ ticketId, memberId }) =>
    apiClient.patch(`/api/tickets/${ticketId}/assign`, { assignedMemberId: memberId }),
  onMutate: async ({ ticketId, memberId }) => {
    await queryClient.cancelQueries({ queryKey: queryKeys.tickets.lists() });

    const previousLists = queryClient.getQueriesData({ queryKey: queryKeys.tickets.lists() });

    queryClient.setQueriesData({ queryKey: queryKeys.tickets.lists() }, (old) => {
      if (!old?.content) return old;
      return {
        ...old,
        content: old.content.map((ticket) =>
          ticket.id === ticketId ? { ...ticket, assignedMemberId: memberId } : ticket
        ),
      };
    });

    return { previousLists };
  },
  onError: (_error, _variables, context) => {
    context?.previousLists?.forEach(([key, data]) => {
      queryClient.setQueryData(key, data);
    });
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.tickets.lists() });
  },
});

export const deleteTicketMutation = () => ({
  mutationFn: (id) => apiClient.delete(`/api/tickets/${id}`),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.tickets.lists() });
  },
});
