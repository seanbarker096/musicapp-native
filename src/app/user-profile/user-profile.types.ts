import { Post } from 'store/posts/posts.types';

export type UserProfileStackParamList = {
  UserProfile: undefined;
  ViewPost: {
    post: Post;
  };
};
