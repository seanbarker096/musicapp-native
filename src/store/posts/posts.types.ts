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
  Post: {
    RequestBodyType: PostCreateRequestApi;
    ResultType: PostCreateResultApi;
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
  /**
   * Added on frontend for convienent access. Not received in API response.
   */
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
  ids?: readonly number[];
  is_deleted?: boolean;
  owner_ids?: readonly number[];
}

export type Test = {
  [key in keyof PostsGetFilterApi]: any;
};

export interface PostCreateRequest {
  ownerId: number;
  content: string;
  attachmentFileIds: readonly number[];
}
export interface PostCreateRequestApi {
  attachment_file_ids: readonly number[];
  content: string;
  owner_id: number;
}

export interface PostCreateResultApi {
  post: PostApi;
  attachments: PostAttachmentApi[];
}

export interface PostCreateResult {
  post: Post;
  attachments: PostAttachment[];
}
