import { transformPostAttachmentApi } from 'store/post-attachments/post-attachments.trasnformations';
import { PostAttachmentApi } from 'store/post-attachments/post-attachments.types';
import { Post, PostApi, PostCreateResult } from './posts.types';

export function transformPostApi(post: PostApi): Post {
  return {
    id: post.id,
    ownerId: post.owner_id,
    content: post.content,
    createTime: post.create_time,
    isDeleted: post.is_deleted,
    updateTime: post.update_time,
    attachments: [],
  };
}

export function transformPostAndAttachmentsApi(
  post: PostApi,
  attachments: readonly PostAttachmentApi[],
): PostCreateResult {
  const transformedAttachments = attachments.map(attachment =>
    transformPostAttachmentApi(attachment),
  );

  return {
    post: {
      id: post.id,
      ownerId: post.owner_id,
      ownerType: post.owner_type,
      content: post.content,
      createTime: post.create_time,
      updateTime: post.update_time,
      isDeleted: post.is_deleted,
      attachments: transformedAttachments,
    },
    attachments: transformedAttachments,
  };
}
