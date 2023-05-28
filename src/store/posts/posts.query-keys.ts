import { PostOwnerType } from './posts.types';

export const postsKeys = {
  all: ['posts'] as const,
  postById: (id: number) => [...postsKeys.all, id] as const,
  postsByOwner: (ownerId: number, ownerType: PostOwnerType, limit: number) =>
    [...postsKeys.all, ownerId, ownerType, 'limit', limit] as const,
  postsByOwnerIds: (ownerIds: readonly number[], limit?: number) => [
    ...postsKeys.all,
    ...ownerIds,
    // limit is optional because when we invalidate queries, we dont want to have to provide a limit
    ...(limit ? ['limit', limit] : []),
  ],
  postsByIds: (ids: readonly number[]) => [...postsKeys.all, ...ids],
  null: [],
};

export type postKeys = typeof postsKeys[keyof typeof postsKeys];
