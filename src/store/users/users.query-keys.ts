export const usersKeys = {
  all: ['users'] as const,
  usersById: (ids: readonly number[]) => [...usersKeys.all, ...ids] as const,
  usersBySearchQuery: (searchQuery: string) =>
    [...usersKeys.all, 'searchQueryString', searchQuery] as const,
  null: [],
};
