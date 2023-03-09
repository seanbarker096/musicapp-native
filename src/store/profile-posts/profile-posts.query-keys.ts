import { ProfileType } from './profile-posts.types';

export const profilePostsKeys = {
  all: ['profilePosts'] as const,
  profilePostsByProfile: (profileId: number, profileType: ProfileType) =>
    [...profilePostsKeys.all, profileId, profileType] as const,
};
