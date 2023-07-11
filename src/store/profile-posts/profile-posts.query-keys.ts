import { ProfileType } from 'contexts/profile.context';

export const profilePostsKeys = {
  all: ['profilePosts'] as const,
  performerFeaturedProfilePosts: (performerId: number) => [
    ...profilePostsKeys.all,
    'profileId',
    performerId,
    'profileType',
    ProfileType.PERFORMER,
    'includeFeatured',
    true,
  ],
  profilePostsByProfileIdAndType: (
    profileId: number,
    profileType: ProfileType,
  ) => [
    ...profilePostsKeys.all,
    'profileId',
    profileId,
    'profileType',
    profileType,
  ],
  profilePostsByProfile: (
    profileId: number,
    profileType: ProfileType,
    includeFeatured: boolean,
    includeOwned: boolean,
    includeTagged: boolean,
    limit?: number,
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
      // limit is optional because when we invalidate queries, we dont want to have to provide a limit
      ...(limit ? ['limit', limit] : []),
    ] as const,
};
