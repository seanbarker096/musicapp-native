import { AppText } from 'components/app-text';
import { Gallery } from 'components/gallery';
import { ProfileImage } from 'components/profile-image';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Artist } from 'store/artists';
import { useFeaturesGetQuery } from 'store/features/features.queries';
import {
  FeatureContextType,
  FeatureOwnerType,
} from 'store/features/features.types';
import { useGetPostsWithAttachmentsAndFilesQuery } from 'utils/custom-hooks';

type ArtistProfileProps = {
  artist: Artist;
};

const ArtistProfile: FC<ArtistProfileProps> = ({ artist }) => {
  const {
    data: features,
    isLoading: isFeaturesGetLoading,
    error: featuresGetError,
  } = useFeaturesGetQuery({
    queryParams: {
      ownerId: artist.id,
      ownerType: FeatureOwnerType.ARTIST,
      contextType: FeatureContextType.POST,
    },
  });

  const featuresLoading = !features && isFeaturesGetLoading;

  const postIds = features?.map(feature => feature.contextId);

  const { isLoading: isPostsGetLoading, postsWithAttachmentsAndFiles } =
    useGetPostsWithAttachmentsAndFilesQuery({ id: postIds });

  const postsLoading = !postsWithAttachmentsAndFiles && isPostsGetLoading;

  return (
    <View style={styles.container}>
      <ProfileImage imageUrl={artist.imageUrl}></ProfileImage>
      <AppText
        size="large"
        weight="bold"
      >
        {artist.name}
      </AppText>
      {postsWithAttachmentsAndFiles && (
        <Gallery
          isLoading={isPostsGetLoading}
          postsWithAttachmentsAndFiles={postsWithAttachmentsAndFiles}
        ></Gallery>
      )}
      {(postsLoading || featuresLoading) && <AppText>Loading...</AppText>}
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  container: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    justifyContent: 'flex-start',
  },
});

export default ArtistProfile;
