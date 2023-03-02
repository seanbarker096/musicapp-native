import { Artist } from 'store/artists';
import { Post } from 'store/posts/posts.types';

export type ArtistProfileStackParamList = {
  ArtistProfile: {
    artist: Artist;
  };
  ViewPost: {
    post: Post;
  };
};
