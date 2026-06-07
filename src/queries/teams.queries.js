import { queryKeys } from '../lib/queryKeys';
import apiClient from '../api/apiClient';

// Team Manager queries
export const teamManagerListOptions = (filters = {}) => ({
  queryKey: queryKeys.teams.managers(),
  queryFn: async () => apiClient.get('/api/teams/managers', { params: filters }),
});

export const teamManagerDetailOptions = (id) => ({
  queryKey: queryKeys.teams.manager(id),
  queryFn: async () => apiClient.get(`/api/teams/managers/${id}`),
  enabled: !!id,
});

// Team Member queries
export const teamMemberListOptions = (filters = {}) => ({
  queryKey: queryKeys.teams.members(),
  queryFn: async () => apiClient.get('/api/teams/members', { params: filters }),
});

export const teamMemberDetailOptions = (id) => ({
  queryKey: queryKeys.teams.member(id),
  queryFn: async () => apiClient.get(`/api/teams/members/${id}`),
  enabled: !!id,
});

// User queries
export const userListOptions = (filters = {}) => ({
  queryKey: queryKeys.teams.users(),
  queryFn: async () => apiClient.get('/api/users', { params: filters }),
});

export const userDetailOptions = (id) => ({
  queryKey: queryKeys.teams.user(id),
  queryFn: async () => apiClient.get(`/api/users/${id}`),
  enabled: !!id,
});

// Domain queries
export const domainListOptions = () => ({
  queryKey: queryKeys.teams.domains(),
  queryFn: async () => apiClient.get('/api/teams/domains'),
});

export const domainDetailOptions = (id) => ({
  queryKey: queryKeys.teams.domain(id),
  queryFn: async () => apiClient.get(`/api/teams/domains/${id}`),
  enabled: !!id,
});
