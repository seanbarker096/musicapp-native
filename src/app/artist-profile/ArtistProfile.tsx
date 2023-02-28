import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SearchStackScreenParamList } from 'app/search/search-types';
import { AppText } from 'components/app-text';
import { Gallery } from 'components/gallery';
import { ProfileImage } from 'components/profile-image';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';

type ArtistProfileProps = NativeStackScreenProps<
  SearchStackScreenParamList,
  'ArtistProfile'
>;

const ArtistProfile: FC<ArtistProfileProps> = ({
  route: {
    params: { artist },
  },
}) => {
  // get features

  // get post ids from features

  // get posts by setting filter for useGetPostsWithAttachmentsAndFilesQuery

  return (
    <View style={styles.container}>
      <ProfileImage imageUrl={artist.imageUrl}></ProfileImage>
      <AppText
        size="large"
        weight="bold"
      >
        {artist.name}
      </AppText>
      <Gallery itemOwnerId={artist.id}></Gallery>
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
