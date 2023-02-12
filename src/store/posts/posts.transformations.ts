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

export function postAndAttachmentsApiToPostAndAttachments(
  post: PostApi,
  attachments: readonly PostAttachmentApi[],
): PostCreateResult {
  return {
    post: {
      id: post.id,
      ownerId: post.owner_id,
      content: post.content,
      createTime: post.create_time,
      updateTime: post.create_time,
      isDeleted: post.is_deleted,
      attachments: attachments.map(attachment =>
        transformPostAttachmentApi(attachment),
      ),
    },
    attachments: attachments.map(attachment =>
      transformPostAttachmentApi(attachment),
    ),
  };
}
