import { useEffect, useState } from 'react';
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

// TODO: Currently isLoading won't be set back to true after first request, need to fix this
export function useGetPostsWithAttachmentsAndFilesQuery({
  queryParams: { ownerId, ownerType, id, limit },
  enabled = true,
}: {
  queryParams: Pick<
    PostsGetQueryField,
    'ownerId' | 'ownerType' | 'id' | 'limit'
  >;
  enabled?: boolean;
}): {
  isLoading: boolean;
  postsWithAttachmentsAndFiles: readonly Post[] | undefined;
} {
  const [isLoading, setIsLoading] = useState(true);
  const [postsWithAttachmentsAndFiles, setPostsWithAttachmentsAndFiles] =
    useState<readonly Post[] | undefined>(undefined);

  const {
    data: posts,
    isLoading: postsLoading,
    isError: postsError,
  } = usePostsGetQuery({
    queryParams: {
      ownerId,
      id,
      ownerType,
      limit,
    },
    enabled,
  });

  const postIds = posts?.map(post => post.id);

  const {
    data: postsAttachments,
    isLoading: postsAttachmentsLoading,
    isError: postsAttachmentsError,
  } = usePostAttachmentsGetQuery({
    queryParams: { postId: postIds },
    enabled: postIds && postIds.length > 0,
  });

  const {
    data: files,
    isLoading: filesLoading,
    isError: filesError,
  } = useFilesGetQuery({
    queryParams: {
      id: postsAttachments
        ? postsAttachments.reduce<readonly number[]>(
            (allIds, attachment) => [
              ...allIds,
              attachment.fileId,
              ...(attachment.thumbnailFileId
                ? [attachment.thumbnailFileId]
                : []),
            ],
            [],
          )
        : undefined,
    },
    enabled: postsAttachments && postsAttachments.length > 0,
  });

  useEffect(() => {
    if (!postsLoading && !postsAttachmentsLoading && !filesLoading) {
      const postsWithAttachmentsAndFiles = createPostsWithAttachmentsAndFiles(
        files,
        postsAttachments,
        posts,
      );
      setPostsWithAttachmentsAndFiles(postsWithAttachmentsAndFiles);
      setIsLoading(false);
    }
  }, [
    postsLoading,
    postsAttachmentsLoading,
    filesLoading,
    files,
    postsAttachments,
    posts,
  ]);

  return {
    isLoading,
    postsWithAttachmentsAndFiles,
  };
}

// TODO: Currently isLoading won't be set back to true after first request, need to fix this
export function useGetProfilePostsWithAttachmentsAndFilesQuery({
  profileId,
  profileType,
  includeFeatured,
  includeOwned,
  includeTagged,
  limit,
}: ProfilePostsGetFilter): {
  isLoading: boolean;
  postsWithAttachmentsAndFiles: readonly Post[] | undefined;
} {
  const [isLoading, setIsLoading] = useState(true);
  const [postsWithAttachmentsAndFiles, setPostsWithAttachmentsAndFiles] =
    useState<readonly Post[] | undefined>(undefined);

  const {
    data: posts,
    isPreviousData,
    isLoading: postsLoading,
    isError: postsError,
  } = useProfilePostsGetQuery({
    profileId,
    profileType,
    includeFeatured,
    includeOwned,
    includeTagged,
    limit,
  });

  const postIds = posts?.map(post => post.id);

  const {
    data: postsAttachments,
    isLoading: postsAttachmentsLoading,
    isError: postsAttachmentsError,
  } = usePostAttachmentsGetQuery({
    queryParams: { postId: postIds },
    enabled: postIds && postIds.length > 0,
  });

  const {
    data: files,
    isLoading: filesLoading,
    isError: filesError,
  } = useFilesGetQuery({
    queryParams: {
      id: postsAttachments
        ? postsAttachments.reduce<readonly number[]>(
            (allIds, attachment) => [
              ...allIds,
              attachment.fileId,
              ...(attachment.thumbnailFileId
                ? [attachment.thumbnailFileId]
                : []),
            ],
            [],
          )
        : undefined,
    },
    enabled: postsAttachments && postsAttachments.length > 0,
  });

  useEffect(() => {
    if (!postsLoading && !postsAttachmentsLoading && !filesLoading) {
      const postsWithAttachmentsAndFiles = createPostsWithAttachmentsAndFiles(
        files,
        postsAttachments,
        posts,
      );
      setPostsWithAttachmentsAndFiles(postsWithAttachmentsAndFiles);
      setIsLoading(false);
    }
  }, [
    postsLoading,
    postsAttachmentsLoading,
    filesLoading,
    files,
    postsAttachments,
    posts,
  ]);

  return {
    isLoading,
    postsWithAttachmentsAndFiles,
  };
}

// TODO: Currently isLoading won't be set back to true after first request, need to fix this
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
  const [isLoading, setIsLoading] = useState(true);
  const [postsWithAttachmentsAndFiles, setPostsWithAttachmentsAndFiles] =
    useState<readonly Post[] | undefined>(undefined);
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

  const postIds = posts?.map(post => post.id);

  const {
    data: postsAttachments,
    isLoading: postsAttachmentsLoading,
    isError: postsAttachmentsError,
  } = usePostAttachmentsGetQuery({
    queryParams: { postId: postIds },
    enabled: postIds && postIds.length > 0,
  });

  const {
    data: files,
    isLoading: filesLoading,
    isError: filesError,
  } = useFilesGetQuery({
    queryParams: {
      id: postsAttachments
        ? postsAttachments.reduce<readonly number[]>(
            (allIds, attachment) => [
              ...allIds,
              attachment.fileId,
              ...(attachment.thumbnailFileId
                ? [attachment.thumbnailFileId]
                : []),
            ],
            [],
          )
        : undefined,
    },
    enabled: postsAttachments && postsAttachments.length > 0,
  });

  useEffect(() => {
    if (!postsLoading && !postsAttachmentsLoading && !filesLoading) {
      const postsWithAttachmentsAndFiles = createPostsWithAttachmentsAndFiles(
        files,
        postsAttachments,
        posts,
      );
      setPostsWithAttachmentsAndFiles(postsWithAttachmentsAndFiles);
      setIsLoading(false);
    }
  }, [
    postsLoading,
    postsAttachmentsLoading,
    filesLoading,
    files,
    postsAttachments,
    posts,
  ]);

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
    // We dont want to create a new attachment object here. We want to keep the original object received from the backend, so ensure our UI doesn't re-render unnecessarily due to the attachment object changing, even though the attachment data itself has not changed. If the attachment data changes, our api query will re-run and we will get a new attachment object anyway due to our transformation of the api response
    attachment.file = filesByIdMap[attachment.fileId];
    attachment.thumbnailFile = attachment.thumbnailFileId
      ? filesByIdMap[attachment.thumbnailFileId]
      : undefined;

    postAttachmentsByPostIdMap[attachment.postId] = [
      ...(postAttachmentsByPostIdMap[attachment.postId] ?? []),
      attachment,
    ];
  });

  return posts
    ? posts.map(post => {
        // We dont want to create a new post object here. We want to keep the original object received from the backend, so ensure our UI doesn't re-render unnecessarily due to the post object changing, even though the post data itself has not changed. If the post data changes, our api query will re-run and we will get a new post object anyway due to our transformation of the api response
        post.attachments = postAttachmentsByPostIdMap[post.id];
        return post;
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
    searchDebounceTimer = setTimeout(() => callback(value), 250);

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
