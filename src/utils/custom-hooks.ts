import { useFilesGetQuery } from 'store/files/files.queries';
import { File } from 'store/files/files.types';
import { usePostAttachmentsGetQuery } from 'store/post-attachments';
import { PostAttachment } from 'store/post-attachments/post-attachments.types';
import { Post, PostsGetQueryField, usePostsGetQuery } from 'store/posts';

// TODO: Add error handling/return error if it occurs for client to handle
export function useGetPostsWithAttachmentsAndFilesQuery({
  ownerId,
  ownerType,
  id,
}: Pick<PostsGetQueryField, 'ownerId' | 'ownerType' | 'id'>): {
  isLoading: boolean;
  postsWithAttachmentsAndFiles: readonly Post[] | undefined;
} {
  const {
    data: posts,
    isLoading: postsLoading,
    isError: postsError,
  } = usePostsGetQuery({
    ownerId,
    id,
    ownerType,
  });

  const postsReady = !!posts && !postsLoading;

  const postIds = posts?.map(post => post.id);

  const {
    data: postsAttachments,
    isLoading: postsAttachmentsLoading,
    isError: postsAttachmentsError,
  } = usePostAttachmentsGetQuery({
    queryParams: { postId: postIds },
    enabled: postsReady,
  });

  const postsAttachmentsReady = !!postsAttachments && !postsAttachmentsLoading;

  const {
    data: files,
    isLoading: filesLoading,
    isError: filesError,
  } = useFilesGetQuery({
    queryParams: {
      id: postsAttachments
        ? postsAttachments.map(attachment => attachment.fileId)
        : undefined,
    },
    enabled: postsAttachmentsReady,
  });

  const filesReady = !!files && !filesLoading;

  const filesByIdMap: { [fileId: number]: File } = {};

  files?.forEach(file => {
    filesByIdMap[file.id] = file;
  });

  const postAttachmentsByPostIdMap: {
    [postId: number]: readonly PostAttachment[];
  } = {};

  postsAttachments?.forEach(attachment => {
    const attachmentWithFile = { ...attachment };
    attachmentWithFile.file = filesByIdMap[attachment.fileId];

    postAttachmentsByPostIdMap[attachment.postId] = [
      ...(postAttachmentsByPostIdMap[attachment.postId] ?? []),
      attachmentWithFile,
    ];
  });

  const postsWithAttachmentsAndFiles = posts
    ? posts.map(post => {
        const postWithAttachments = { ...post };

        postWithAttachments.attachments = postAttachmentsByPostIdMap[post.id];
        return postWithAttachments;
      })
    : undefined;

  const isLoading = postsLoading || postsAttachmentsLoading || filesLoading;

  return {
    isLoading,
    postsWithAttachmentsAndFiles,
  };
}
