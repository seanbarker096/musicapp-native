import { ProfileType } from 'contexts/profile.context';

export const profilePostsKeys = {
  all: ['profilePosts'] as const,
  profilePostsByProfile: (
    profileId: number,
    profileType: ProfileType,
    limit: number,
  ) =>
    [
      ...profilePostsKeys.all,
      'profileId',
      profileId,
      'profileType',
      profileType,
      'limit',
      limit,
    ] as const,
};
