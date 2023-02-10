import { PostAttachmentApi } from 'store/post-attachments/post-attachments.types';
import { Post, PostApi } from './posts.types';

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

export function postsAndAttachmentsApiToPostsAndAttachments(
  posts: readonly PostApi[],
  attachments: readonly PostAttachmentApi[],
) {}
