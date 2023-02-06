import React, { FC, useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useGetPostsWithAttachmentsAndFilesQuery } from 'utils/custom-hooks';

import { AuthStateContext } from 'store/auth/auth.contexts';
import { COLOR_PRIMARY } from 'styles';
import GalleryLayout from './gallery-layout/GalleryLayout';

interface GalleryProps {}

const Gallery: FC<GalleryProps> = () => {
  const { authState } = useContext(AuthStateContext);

  const { isLoading, postsWithAttachmentsAndFiles } =
    useGetPostsWithAttachmentsAndFilesQuery(authState.authUser.userId);

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

export default Gallery;

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: COLOR_PRIMARY,
    height: 40,
    width: '100%',
  },
});
