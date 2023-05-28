import { Post, PostApi, PostOwnerType } from 'store/posts';
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

export type FeaturedPostsGetFilter = {
  ownerId: number;
  ownerType: PostOwnerType;
  isFeaturedByUsers: boolean;
  isFeaturedByPerformers: boolean;
  limit?: number;
};

export type FeaturedPostsGetFilterApi = {
  owner_id: number;
  owner_type: PostOwnerType;
  is_featured_by_users: boolean;
  is_featured_by_performers: boolean;
  limit?: number;
};

export interface FeaturedPostsGetResultApi {
  posts: readonly PostApi[];
}
