import { PostAttachment, PostAttachmentApi } from './post-attachments.types';

export function transformPostAttachmentApi(
  attachment: PostAttachmentApi,
): PostAttachment {
  return {
    id: attachment.id,
    postId: attachment.post_id,
    fileId: attachment.file_id,
    thumbnailFileId: attachment.thumbnail_file_id,
    createTime: attachment.create_time,
    file: undefined,
    thumbnailFile: undefined,
  };
}
