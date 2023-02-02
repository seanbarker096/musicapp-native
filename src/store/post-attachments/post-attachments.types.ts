import { File } from 'store/files/files.types';
import { StoreSlice } from 'store/store.types';

export interface PostAttachmentsStoreSlice extends StoreSlice {
  Name: 'postAttachments';
  ObjectType: PostAttachment;
  Get: {
    RequestParametersType: PostAttachmentsGetFilterApi;
    ResultType: PostAttachmentsGetResultApi;
    ErrorType: {};
  };
}

export interface PostAttachment {
  id: number;
  postId: number;
  fileId: number;
  createTime: number;
  /**
   * Added on frontend for convienent access. Not received in API response.
   */
  file?: File;
}

export interface PostAttachmentApi {
  id: number;
  post_id: number;
  file_id: number;
  create_time: number;
}

export interface PostAttachmentsGetFilterApi {
  post_attachment_ids?: readonly number[];
  post_ids?: readonly number[];
}

export interface PostAttachmentsGetResultApi {
  attachments: readonly PostAttachmentApi[];
}
