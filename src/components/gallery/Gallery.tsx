import React, { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useGetPostsWithAttachmentsAndFilesQuery } from 'utils/custom-hooks';

import { COLOR_PRIMARY } from 'styles';
import GalleryLayout from './gallery-layout/GalleryLayout';

interface GalleryProps {
  itemOwnerId: number;
}

export const Gallery: FC<GalleryProps> = ({ itemOwnerId }) => {
  // TODO: MOve up to parent as need to get posts in various ways
  const { isLoading, postsWithAttachmentsAndFiles } =
    useGetPostsWithAttachmentsAndFilesQuery(itemOwnerId);

  const loading = !postsWithAttachmentsAndFiles && isLoading;

  return (
    <View style={{ width: '100%' }}>
      {postsWithAttachmentsAndFiles && (
        <>
          <View style={styles.headerContainer}></View>
          <GalleryLayout posts={postsWithAttachmentsAndFiles}></GalleryLayout>
        </>
      )}
      {loading && <Text>...Loading</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: COLOR_PRIMARY,
    height: 40,
    width: '100%',
  },
});
