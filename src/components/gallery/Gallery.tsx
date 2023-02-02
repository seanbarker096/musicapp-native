import React, { FC, useContext } from 'react';
import { Text, View } from 'react-native';
import { useGetPostsWithAttachmentsAndFilesQuery } from 'utils/custom-hooks';

import { AuthStateContext } from 'store/auth/auth.contexts';

interface GalleryProps {}

const Gallery: FC<GalleryProps> = () => {
  const { authState } = useContext(AuthStateContext);

  const { isLoading, postsWithAttachmentsAndFiles } =
    useGetPostsWithAttachmentsAndFilesQuery(authState.authUser.userId);

  const loading = !postsWithAttachmentsAndFiles && isLoading;

  console.log('postsWithAttachmentsAndFiles', postsWithAttachmentsAndFiles);

  return (
    <View>
      {postsWithAttachmentsAndFiles && <Text>Got data</Text>}
      {loading && <Text>...Loading</Text>}
    </View>
  );
};

export default Gallery;
