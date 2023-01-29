import { PostAttachment } from 'store/post-attachments/post-attachments.types';
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

// map over each post and update their attachments
export function addPostAttachmentsToPosts(
  posts: readonly Post[],
  newPostAttachments: readonly PostAttachment[],
): readonly Post[] {
  const newPostAttachmentMap: { [id: number]: PostAttachment } = {};

  newPostAttachments.forEach(attachment => {
    newPostAttachmentMap[attachment.id] = attachment;
  });

  return posts.map(post => {
    const newAttachmentsForPost = newPostAttachments.filter(
      attachment => attachment.postId === post.id,
    );

    const allAttachments = post.attachments.reduce((prev, attachment) => {
      // If post should be replaced with a new one, dont add it to array
      if (newPostAttachmentMap[attachment.id]) {
        return prev;
      }
      // If post has to changed following update, add to array
      return [...prev, attachment];
    }, newAttachmentsForPost);

    return {
      ...post,
      attachments: allAttachments,
    };
  });
}
