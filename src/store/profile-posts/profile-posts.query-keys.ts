import { ProfileType } from 'contexts/profile.context';

export const profilePostsKeys = {
  all: ['profilePosts'] as const,
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
