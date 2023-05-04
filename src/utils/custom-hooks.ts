import { useEffect } from 'react';
import {
  FeaturedPostsGetQueryFields,
  useFeaturedPostsGetQuery,
} from 'store/featured-posts/featured-posts.queries';
import { useFilesGetQuery } from 'store/files/files.queries';
import { File } from 'store/files/files.types';
import { usePostAttachmentsGetQuery } from 'store/post-attachments';
import { PostAttachment } from 'store/post-attachments/post-attachments.types';
import { Post, PostsGetQueryField, usePostsGetQuery } from 'store/posts';
import {
  ProfilePostsGetFilter,
  useProfilePostsGetQuery,
} from 'store/profile-posts';

// TODO: Add error handling/return error if it occurs for client to handle
export function useGetPostsWithAttachmentsAndFilesQuery({
  queryParams: { ownerId, ownerType, id },
  enabled = true,
}: {
  queryParams: Pick<PostsGetQueryField, 'ownerId' | 'ownerType' | 'id'>;
  enabled?: boolean;
}): {
  isLoading: boolean;
  postsWithAttachmentsAndFiles: readonly Post[] | undefined;
} {
  const {
    data: posts,
    isLoading: postsLoading,
    isError: postsError,
  } = usePostsGetQuery({
    queryParams: {
      ownerId,
      id,
      ownerType,
    },
    enabled,
  });

  const postsReady = !!posts && !postsLoading;

  const postIds = posts?.map(post => post.id);

  const {
    data: postsAttachments,
    isLoading: postsAttachmentsLoading,
    isError: postsAttachmentsError,
  } = usePostAttachmentsGetQuery({
    queryParams: { postId: postIds },
    enabled: postsReady && posts.length > 0,
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
    enabled: postsAttachmentsReady && postsAttachments.length > 0,
  });

  const filesReady = !!files && !filesLoading;

  const postsWithAttachmentsAndFiles = createPostsWithAttachmentsAndFiles(
    files,
    postsAttachments,
    posts,
  );

  const isLoading = postsLoading || postsAttachmentsLoading || filesLoading;

  return {
    isLoading,
    postsWithAttachmentsAndFiles,
  };
}

// TODO:: Extract logic that is repeated with one above
export function useGetProfilePostsWithAttachmentsAndFilesQuery({
  profileId,
  profileType,
  includeFeatured,
  includeOwned,
  includeTagged,
}: ProfilePostsGetFilter): {
  isLoading: boolean;
  postsWithAttachmentsAndFiles: readonly Post[] | undefined;
} {
  const {
    data: posts,
    isLoading: postsLoading,
    isError: postsError,
  } = useProfilePostsGetQuery({
    profileId,
    profileType,
    includeFeatured,
    includeOwned,
    includeTagged,
  });

  const postsReady = !!posts && !postsLoading;

  const postIds = posts?.map(post => post.id);

  const {
    data: postsAttachments,
    isLoading: postsAttachmentsLoading,
    isError: postsAttachmentsError,
  } = usePostAttachmentsGetQuery({
    queryParams: { postId: postIds },
    enabled: postsReady && posts.length > 0,
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
    enabled: postsAttachmentsReady && postsAttachments.length > 0,
  });

  const filesReady = !!files && !filesLoading;

  const postsWithAttachmentsAndFiles = createPostsWithAttachmentsAndFiles(
    files,
    postsAttachments,
    posts,
  );

  const isLoading = postsLoading || postsAttachmentsLoading || filesLoading;

  return {
    isLoading,
    postsWithAttachmentsAndFiles,
  };
}

export function useGetFeaturedPostsWithAttachmentsAndFilesQuery({
  queryParams: {
    ownerId,
    ownerType,
    isFeaturedByUsers,
    isFeaturedByPerformers,
  },
  enabled = true,
}: {
  queryParams: FeaturedPostsGetQueryFields;
  enabled?: boolean;
}) {
  const {
    data: posts,
    isLoading: postsLoading,
    isError: postsError,
  } = useFeaturedPostsGetQuery({
    queryParams: {
      ownerId,
      ownerType,
      isFeaturedByPerformers,
      isFeaturedByUsers,
    },
    enabled,
  });

  const postsReady = !!posts && !postsLoading;

  const postIds = posts?.map(post => post.id);

  const {
    data: postsAttachments,
    isLoading: postsAttachmentsLoading,
    isError: postsAttachmentsError,
  } = usePostAttachmentsGetQuery({
    queryParams: { postId: postIds },
    enabled: postsReady && posts.length > 0,
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
    enabled: postsAttachmentsReady && postsAttachments.length > 0,
  });

  const filesReady = !!files && !filesLoading;

  const postsWithAttachmentsAndFiles = createPostsWithAttachmentsAndFiles(
    files,
    postsAttachments,
    posts,
  );

  const isLoading = postsLoading || postsAttachmentsLoading || filesLoading;

  return {
    isLoading,
    postsWithAttachmentsAndFiles,
  };
}

function createPostsWithAttachmentsAndFiles(
  files?: readonly File[],
  attachments?: readonly PostAttachment[],
  posts?: readonly Post[],
) {
  const filesByIdMap: { [fileId: number]: File } = {};

  files?.forEach(file => {
    filesByIdMap[file.id] = file;
  });

  const postAttachmentsByPostIdMap: {
    [postId: number]: readonly PostAttachment[];
  } = {};

  attachments?.forEach(attachment => {
    const attachmentWithFile = { ...attachment };
    attachmentWithFile.file = filesByIdMap[attachment.fileId];

    postAttachmentsByPostIdMap[attachment.postId] = [
      ...(postAttachmentsByPostIdMap[attachment.postId] ?? []),
      attachmentWithFile,
    ];
  });

  return posts
    ? posts.map(post => {
        const postWithAttachments = { ...post };

        postWithAttachments.attachments = postAttachmentsByPostIdMap[post.id];
        return postWithAttachments;
      })
    : undefined;
}

export function useDebounceEffect<T>(value: T, callback: (value: T) => void) {
  let searchDebounceTimer: number | undefined = undefined;

  useEffect(() => {
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer);
    }

    // Once debounce timer is done, call parent callback so something
    // can be done with the search term
    searchDebounceTimer = setTimeout(() => callback(value), 500);

    return () => {
      if (searchDebounceTimer) {
        clearTimeout(searchDebounceTimer);
      }
    };
  }, [value]);
}


export function useIntervalEffect<T extends any[]>(
  handler: (...args: T) => void,
  interval: number,
  ...args: T
): void {
  let intervalReference: number | undefined = undefined;

  useEffect(() => {
    intervalReference = setInterval<T>(handler, interval, ...args);

    return () => {
      if (intervalReference) {
        clearInterval(intervalReference);
      }
      intervalReference = undefined;
    };
  }, []);
}
