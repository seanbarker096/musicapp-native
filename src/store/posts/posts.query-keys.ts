export const postsKeys = {
  all: ['posts'] as const,
  postById: (id: number) => [...postsKeys.all, id] as const,
  postsByOwnerIds: (ownerIds: readonly number[]) => [
    ...postsKeys.all,
    ...ownerIds,
  ],
  postsByIds: (ids: readonly number[]) => [...postsKeys.all, ...ids],
  null: [],
};

export type postKeys = typeof postsKeys[keyof typeof postsKeys];
