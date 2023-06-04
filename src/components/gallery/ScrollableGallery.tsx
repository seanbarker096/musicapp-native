import React, { FC, ReactElement } from 'react';

import { Post } from 'store/posts';
import { ScrollableGalleryLayout } from './gallery-layout/ScrollableGalleryLayout';

interface ScrollableGalleryProps {
  postsWithAttachmentsAndFiles: readonly Post[]; // note that this should have files defined in each attachment
  /**
   * A function that returns a ReactElement to be rendered as the footer of each gallery item.
   */
  galleryItemFooter?: (post: Post) => ReactElement;
  isLoading?: boolean;
  onEndReached?: () => void;
  hasMoreData?: boolean;
}

export const ScrollableGallery: FC<ScrollableGalleryProps> = ({
  postsWithAttachmentsAndFiles,
  galleryItemFooter,
  isLoading = false, // TODO: Remove this and determine loading states in parent
  onEndReached,
  hasMoreData,
}) => {
  return (
    <ScrollableGalleryLayout
      posts={postsWithAttachmentsAndFiles}
      galleryItemFooter={galleryItemFooter}
      onEndReached={onEndReached}
      hasMoreData={hasMoreData}
    ></ScrollableGalleryLayout>
  );
};
