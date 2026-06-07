export const queryKeys = {
  tickets: {
    all: ['tickets'],
    lists: () => [...queryKeys.tickets.all, 'list'],
    list: (filters) => [...queryKeys.tickets.lists(), filters],
    details: () => [...queryKeys.tickets.all, 'detail'],
    detail: (id) => [...queryKeys.tickets.details(), id],
  },

  customers: {
    all: ['customers'],
    lists: () => [...queryKeys.customers.all, 'list'],
    list: (filters) => [...queryKeys.customers.lists(), filters],
    details: () => [...queryKeys.customers.all, 'detail'],
    detail: (id) => [...queryKeys.customers.details(), id],
  },

  teams: {
    all: ['teams'],
    managers: () => [...queryKeys.teams.all, 'manager'],
    manager: (id) => [...queryKeys.teams.managers(), id],
    members: () => [...queryKeys.teams.all, 'member'],
    member: (id) => [...queryKeys.teams.members(), id],
    users: () => [...queryKeys.teams.all, 'user'],
    user: (id) => [...queryKeys.teams.users(), id],
    domains: () => [...queryKeys.teams.all, 'domain'],
    domain: (id) => [...queryKeys.teams.domains(), id],
  },
};
