/**
 * Store slice type definitions
 */

import { Performer, PerformerApi } from 'store/performers';
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
  ownerType: PostOwnerType;
  content: string;
  creatorId: number;
  createTime: number;
  updateTime?: number;
  isDeleted?: boolean;
  /**
   * Added on frontend for convienent access. Not received in API response.
   */
  attachments?: readonly PostAttachment[];
  /**
   * The performer who this post is about, and how has featured it on their profile. If the have not featured this post on their profile, this will be undefined.
   */
  featuringPerformer?: Performer;
  featureCount?: number;
}

export interface PostApi {
  id: number;
  owner_id: number;
  owner_type: PostOwnerType;
  content: string;
  creator_id: number;
  create_time: number;
  is_deleted: boolean;
  update_time?: number;
  feature_count?: number;
  featuring_performer?: PerformerApi;
}

// API supports more owner types, but we only use user for now
export enum PostOwnerType {
  USER = 'user',
}

export interface PostsGetResultApi {
  posts: readonly PostApi[];
  attachments?: readonly PostAttachmentApi[];
}

export interface PostsGetFilterApi {
  ids?: readonly number[];
  is_deleted?: boolean;
  owner_ids?: readonly number[];
  owner_types?: readonly PostOwnerType[];
  limit?: number;
}

export type Test = {
  [key in keyof PostsGetFilterApi]: any;
};

export interface PostAttachmentFile {
  attachmentFileId: number;
  thumbnailFileId?: number;
}

export interface PostAttachmentFileApi {
  attachment_file_id: number;
  thumbnail_file_id?: number;
}

export interface PostCreateRequest {
  ownerId: number;
  ownerType: PostOwnerType;
  content: string;
  note?: string;
  attachmentFiles: readonly PostAttachmentFile[];
}
export interface PostCreateRequestApi {
  content: string;
  owner_id: number;
  owner_type: PostOwnerType;
  note?: string;
  attachment_files: readonly PostAttachmentFileApi[];
}

export interface PostCreateResultApi {
  post: PostApi;
  attachments: PostAttachmentApi[];
}

export interface PostCreateResult {
  post: Post;
  attachments: PostAttachment[];
}
