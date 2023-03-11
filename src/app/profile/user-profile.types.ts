import { Post } from 'store/posts/posts.types';

export type ProfileStackParamList = {
  Profile: {};
  ViewPost: {
    post: Post;
  };
};
