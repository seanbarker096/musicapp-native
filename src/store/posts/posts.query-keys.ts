export const postsKeys = {
  all: ['posts'] as const,
  postById: (id: number) => [...postsKeys.all, id] as const,
  postsByOwnerId: (ownerId: number | undefined) => [...postsKeys.all, ownerId],
  postsByOwnerIds: (ownerIds: readonly number[]) => [
    ...postsKeys.all,
    ...ownerIds,
  ],
};

export type postKeys = typeof postsKeys[keyof typeof postsKeys];