import { useQuery, useInfiniteQuery, useMutation } from '@tanstack/react-query';
import {
  ticketListOptions,
  ticketDetailOptions,
  ticketInfiniteOptions,
} from '../queries/tickets.queries';
import {
  createTicketMutation,
  updateTicketMutation,
  assignTicketMutation,
  deleteTicketMutation,
} from '../mutations/tickets.mutations';

export const useTicketList = (filters) => useQuery(ticketListOptions(filters));

export const useTicketDetail = (id) => useQuery(ticketDetailOptions(id));

export const useTicketsInfinite = (filters) =>
  useInfiniteQuery(ticketInfiniteOptions(filters));

export const useCreateTicket = () => useMutation(createTicketMutation());

export const useUpdateTicket = () => useMutation(updateTicketMutation());

export const useAssignTicket = () => useMutation(assignTicketMutation());

export const useDeleteTicket = () => useMutation(deleteTicketMutation());
