import React, { FC, ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';

import { Post } from 'store/posts';
import GalleryLayout from './gallery-layout/GalleryLayout';

interface GalleryProps {
  postsWithAttachmentsAndFiles: readonly Post[]; // note that this should have files defined in each attachment
  /**
   * A function that returns a ReactElement to be rendered as the footer of each gallery item.
   */
  galleryItemFooter?: (post: Post) => ReactElement;
  isLoading?: boolean;
}

export const Gallery: FC<GalleryProps> = ({
  postsWithAttachmentsAndFiles,
  galleryItemFooter,
  isLoading = false, // TODO: Remove this and determine loading states in parent
}) => {
  return (
    <View style={{ width: '100%' }}>
      {postsWithAttachmentsAndFiles && (
        <>
          <GalleryLayout
            posts={postsWithAttachmentsAndFiles}
            galleryItemFooter={galleryItemFooter}
          ></GalleryLayout>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({});
