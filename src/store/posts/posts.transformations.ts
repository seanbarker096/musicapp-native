import { Post, PostApi } from './posts.types';

export function transformPostApi(post: PostApi): Post {
  return {
    id: post.id,
    ownerId: post.ownerId,
    content: post.content,
    createTime: post.createTime,
    isDeleted: post.isDeleted,
    updateTime: post.updateTime,
  };
}
