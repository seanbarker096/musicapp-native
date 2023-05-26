import { ProfileType } from 'contexts/profile.context';
import { PostAttachmentApi } from 'store/post-attachments/post-attachments.types';
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

export interface ProfilePostsGetFilterApi {
  profile_id?: number;
  profile_type: ProfileType;
  include_tagged: boolean;
  include_featured: boolean;
  include_owned: boolean;
  limit: number;
}

export interface ProfilePostsGetFilter {
  profileId?: number;
  profileType: ProfileType;
  includeTagged: boolean;
  includeFeatured: boolean;
  includeOwned: boolean;
  limit?: number;
}

export interface ProfilePostsGetResultApi {
  posts: readonly PostApi[];
  attachments?: readonly PostAttachmentApi[];
}
