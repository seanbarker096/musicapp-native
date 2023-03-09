import { ProfileType } from './profile-posts.types';

export const profilePostKeys = {
  all: ['profilePosts'] as const,
  profilePostsByProfile: (profileId: number, profileType: ProfileType) =>
    [...profilePostKeys.all, profileId, profileType] as const,
};
