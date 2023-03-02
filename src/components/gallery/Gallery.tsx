import React, { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Post } from 'store/posts';
import { COLOR_PRIMARY } from 'styles';
import GalleryLayout from './gallery-layout/GalleryLayout';

interface GalleryProps {
  postsWithAttachmentsAndFiles: readonly Post[]; // note that this should have files defined in each attachment
  isLoading: boolean;
}

export const Gallery: FC<GalleryProps> = ({
  postsWithAttachmentsAndFiles,
  isLoading,
}) => {
  return (
    <View style={{ width: '100%' }}>
      {postsWithAttachmentsAndFiles && (
        <>
          <View style={styles.headerContainer}></View>
          <GalleryLayout posts={postsWithAttachmentsAndFiles}></GalleryLayout>
        </>
      )}
      {isLoading && <Text>...Loading</Text>}
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
