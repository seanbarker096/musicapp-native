import { useFileGetQuery } from 'store/files/files.queries';
import { usePostAttachmentsGetQuery } from 'store/post-attachments';
import { usePostsGetQuery } from 'store/posts';

export function useGetPostsAndAttachments() {
  const {
    data: posts,
    isLoading: postLoading,
    isError: postsError,
  } = usePostsGetQuery({
    ownerId: 1,
  });

  const postsReady = !!posts && !postLoading;

  const postIds = posts?.map(post => post.id)

  const {
    data: postAttachments,
    isLoading: postAttachmentLoading,
    isError: postAttachmentsError,
  } = usePostAttachmentsGetQuery({
    queryParams: { postId: postIds},
    enabled: postsReady,
  });

  const postAttachmentsReady =
    !!postAttachments && !postAttachmentLoading;

  const {
    data: file,
    isLoading: fileLoading,
    isError: fileError,
  } = useFileGetQuery({
    queryParams: {
      id: postAttachments ? postAttachments[0].fileId : undefined,
    },
    enabled: postAttachmentReady,
  });


  const attachmentWithFile = postAttachments[]

  return {
    ready: true,
    postsAndAttachments: [],
  };
}
