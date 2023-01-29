import React, { FC } from 'react';
import { View } from 'react-native';
import { usePostAttachmentsGetQuery } from 'store/post-attachments/post-attachments.queries';
import { usePostsGetQuery } from 'store/posts';

interface GalleryProps {}

const Gallery: FC<GalleryProps> = () => {
  const {
    data: posts,
    isLoading: postLoading,
    isError: postsError,
  } = usePostsGetQuery({
    ownerId: 1,
  });

  console.log('ppppoooossstts', posts);

  const postReady = !!posts && !!posts[0] && !postLoading;

  const post = postReady ? posts[0] : undefined;

  const {
    data: postAttachment,
    isLoading: postAttachmentLoading,
    isError: postAttachmentsError,
  } = usePostAttachmentsGetQuery({
    queryParams: { postId: post?.id },
    enabled: !!post,
  });

  const postAttachmentReady =
    !!postAttachment && !!postAttachment[0] && !postAttachmentLoading;

  // const {
  //   isLoading: filesLoading,
  //   isError: isFilesGetError,
  //   data: files,
  //   error: filesGetError,
  // } = useFileGetQuery({
  //   queryParams: { id: postAttachment ? postAttachment[0].fileId : undefined },
  //   enabled: postAttachmentReady,
  // });

  // need to hack getting attachments. We dont want an actual data function
  // for this which amkes requests. Just want to hit cache
  return <View></View>;
};

export default Gallery;
