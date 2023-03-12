import { ProfileType } from 'contexts/profile.context';
import { Post } from 'store/posts/posts.types';

export type ProfileStackParamList = {
  Profile: {};
  ViewPost: {
    post: Post;
  };
};

/**
 * ProfileInternalStackScreen is reused by multiple navigators of various types (bottom tab, stack, etc.). Currently we can't type screens which are reused by multiple navigators. Hence we define this type to at least provide some type safety.
 */
export interface ProfileInternalStackScreenParams {
  profileId: number;
  profileType: ProfileType;
}
