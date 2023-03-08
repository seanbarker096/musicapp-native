import { PostOwnerType } from './posts.types';

export const postsKeys = {
  all: ['posts'] as const,
  postById: (id: number) => [...postsKeys.all, id] as const,
  postsByOwner: (ownerId: number, ownerType: PostOwnerType) =>
    [...postsKeys.all, ownerId, ownerType] as const,
  postsByOwnerIds: (ownerIds: readonly number[]) => [
    ...postsKeys.all,
    ...ownerIds,
  ],
  postsByIds: (ids: readonly number[]) => [...postsKeys.all, ...ids],
  null: [],
};

export type postKeys = typeof postsKeys[keyof typeof postsKeys];
