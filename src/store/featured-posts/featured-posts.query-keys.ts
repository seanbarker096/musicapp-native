import { PostOwnerType } from 'store/posts';

export const featuredPostKeys = {
  all: ['featuredPosts'] as const,
  featuredPostsByOwner: (ownerId: number, ownerType: PostOwnerType) =>
    [
      ...featuredPostKeys.all,
      'ownerId',
      ownerId,
      'ownerType',
      ownerType,
    ] as const,
  null: [],
};
