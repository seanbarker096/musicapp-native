export const usersKeys = {
  all: ['users'] as const,
  usersById: (ids: readonly number[]) => [...usersKeys.all, ...ids] as const,
  null: [],
};
