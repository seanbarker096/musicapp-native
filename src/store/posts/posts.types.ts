/**
 * Store slice type definitions
 */

import {
  PostAttachment,
  PostAttachmentApi,
} from 'store/post-attachments/post-attachments.types';
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
  attachments: readonly PostAttachment[];
}

export interface PostApi {
  id: number;
  owner_id: number;
  content: string;
  create_time: number;
  is_deleted: boolean;
  update_time?: number;
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
