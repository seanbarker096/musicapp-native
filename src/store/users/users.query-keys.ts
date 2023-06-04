export const usersKeys = {
  all: ['users'] as const,
  usersById: (ids: readonly number[]) => [...usersKeys.all, ...ids] as const,
  usersBySearchQuery: (searchQuery: string, limit: number) =>
    [
      ...usersKeys.all,
      'searchQueryString',
      searchQuery,
      'limit',
      limit,
    ] as const,
  null: [],
};
