export const usersKeys = {
  all: ['users'] as const,
  userById: (id: number) => [...usersKeys.all, id] as const,
};
