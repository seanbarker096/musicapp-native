import { PostAttachment, PostAttachmentApi } from './post-attachments.types';

export function transformPostAttachmentApi(
  attachment: PostAttachmentApi,
): PostAttachment {
  return {
    id: attachment.id,
    postId: attachment.post_id,
    fileId: attachment.file_id,
    createTime: attachment.create_time,
  };
}
