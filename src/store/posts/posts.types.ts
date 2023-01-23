/**
 * Store slice type definitions
 */

import { PostAttachmentApi } from 'store/post-attachments/post-attachments.types';
import { StoreSlice } from 'store/store.types';

export interface PostsStoreSlice extends StoreSlice {
  Name: 'posts';
  ObjectType: Post;
  Get: {
    RequestParametersType: PostsGetFilterApi;
    ResultType: PostsGetResultApi;
    ErrorType: {};
  };
}

export interface Post {
  id: number;
  ownerId: number;
  content: string;
  createTime: number;
  updateTime?: number;
  isDeleted?: boolean;
}

export interface PostApi {
  id: number;
  ownerId: number;
  content: string;
  createTime: number;
  isDeleted: boolean;
  updateTime?: number;
}

export interface PostsGetResultApi {
  posts: readonly PostApi[];
  attachments?: readonly PostAttachmentApi[];
}

export interface PostsGetFilterApi {
  post_ids?: readonly number[];
  is_deleted?: boolean;
  owner_ids?: readonly number[];
}
