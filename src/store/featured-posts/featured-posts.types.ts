import { Post, PostApi, PostsGetFilterApi } from 'store/posts';
import { StoreSlice } from 'store/store.types';

export interface FeaturedPostsStoreSlice extends StoreSlice {
  Name: 'featuredPosts';
  ObjectType: Post;
  Get: {
    RequestParametersType: FeaturedPostsGetFilterApi;
    ResultType: FeaturedPostsGetResultApi;
    ErrorType: {};
  };
  Post: never;
}

export type FeaturedPostsGetFilterApi = PostsGetFilterApi & {
  featured_by_users: boolean;
  featured_by_performers: boolean;
};

export interface FeaturedPostsGetResultApi {
  posts: readonly PostApi[];
}
