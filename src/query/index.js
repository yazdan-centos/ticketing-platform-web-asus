// Public barrel export for the React Query architecture layer.
// Import everything from here: import { ... } from './query';

// Core
export { queryKeys } from '../lib/queryKeys';
export { queryClient } from '../lib/queryClient';
export { default as apiClient } from '../api/apiClient';

// Query option factories
export {
  ticketListOptions,
  ticketDetailOptions,
  ticketInfiniteOptions,
} from '../queries/tickets.queries';
export {
  customerListOptions,
  customerDetailOptions,
} from '../queries/customers.queries';
export {
  teamManagerListOptions,
  teamManagerDetailOptions,
  teamMemberListOptions,
  teamMemberDetailOptions,
  userListOptions,
  userDetailOptions,
  domainListOptions,
  domainDetailOptions,
} from '../queries/teams.queries';

// Mutation option factories
export {
  createTicketMutation,
  updateTicketMutation,
  assignTicketMutation,
  deleteTicketMutation,
} from '../mutations/tickets.mutations';
export {
  createCustomerMutation,
  updateCustomerMutation,
  deleteCustomerMutation,
} from '../mutations/customers.mutations';

// Consumer hooks
export {
  useTicketList,
  useTicketDetail,
  useTicketsInfinite,
  useCreateTicket,
  useUpdateTicket,
  useAssignTicket,
  useDeleteTicket,
} from '../hooks/useTickets';
export { default as QueryStateHandler } from '../hooks/QueryStateHandler';
