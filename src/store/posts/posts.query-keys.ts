export const postsKeys = {
  all: ['posts'] as const,
  postById: (id: number) => [...postsKeys.all, id] as const,
  postsByOwnerId: (ownerId: number) => [...postsKeys.all, ownerId],
};
