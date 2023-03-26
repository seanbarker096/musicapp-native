import { Performer } from 'store/performers';
import { Post } from 'store/posts/posts.types';

export type PerformerProfileStackParamList = {
  PerformerProfile: {
    performer: Performer;
  };
  ViewPost: {
    post: Post;
  };
};
