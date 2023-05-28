import { ProfileType } from 'contexts/profile.context';

export const profilePostsKeys = {
  all: ['profilePosts'] as const,
  profilePostsByProfile: (
    profileId: number,
    profileType: ProfileType,
    includeFeatured: boolean,
    includeOwned: boolean,
    includeTagged: boolean,
    limit: number,
  ) =>
    [
      ...profilePostsKeys.all,
      'profileId',
      profileId,
      'profileType',
      profileType,
      'includeFeatured',
      includeFeatured,
      'includeOwned',
      includeOwned,
      'includeTagged',
      includeTagged,
      'limit',
      limit,
    ] as const,
};
