import { ProfileType } from 'contexts/profile.context';

export const profilePostsKeys = {
  all: ['profilePosts'] as const,
  profilePostsByProfile: (profileId: number, profileType: ProfileType) =>
    [...profilePostsKeys.all, profileId, profileType] as const,
};
