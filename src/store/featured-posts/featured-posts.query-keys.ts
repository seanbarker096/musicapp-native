import { PostOwnerType } from 'store/posts';

export const featuredPostKeys = {
  all: ['featuredPosts'] as const,
  featuredPostsByOwner: (
    ownerId: number,
    ownerType: PostOwnerType,
    limit?: number,
  ) =>
    [
      ...featuredPostKeys.all,
      'ownerId',
      ownerId,
      'ownerType',
      ownerType,
      // limit is optional because when we invalidate queries, we dont want to have to provide a limit
      ...(limit ? ['limit', limit] : []),
    ] as const,
  null: [],
};
