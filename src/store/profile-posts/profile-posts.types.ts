import { Post, PostApi } from 'store/posts';
import { StoreSlice } from 'store/store.types';

export interface ProfilePostsStoreSlice extends StoreSlice {
  Name: 'profilePosts';
  ObjectType: Post;
  Get: {
    RequestParametersType: ProfilePostsGetFilterApi;
    ResultType: ProfilePostsGetResultApi;
    ErrorType: {};
  };
}

export enum ProfileType {
  ARTIST = 'artist',
  USER = 'user',
}

export interface ProfilePostsGetFilterApi {
  profile_id?: number;
  profile_type: ProfileType;
  include_tagged: boolean;
  include_featured: boolean;
  include_owned: boolean;
}

export interface ProfilePostsGetFilter {
  profileId?: number;
  profileType: ProfileType;
  includeTagged: boolean;
  includeFeatured: boolean;
  includeOwned: boolean;
}

export interface ProfilePostsGetResultApi {
  posts: readonly PostApi[];
}
