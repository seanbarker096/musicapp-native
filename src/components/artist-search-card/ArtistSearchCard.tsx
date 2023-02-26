import AppText from 'components/app-text/AppText';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { ArtistSearchArtist } from 'store/artists';
import { SPACING_XXSMALL } from 'styles';
import ProfileImage from '../profile-image/ProfileImage';

interface ArtistSearchCardProps {
  artist: ArtistSearchArtist;
}

const ArtistSearchCard: FC<ArtistSearchCardProps> = ({ artist }) => (
  <View style={styles.container}>
    <ProfileImage
      styles={styles.profileImage}
      imageUrl={artist.imageUrl}
    ></ProfileImage>
    <AppText weight="bold">{artist.name}</AppText>
  </View>
);

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
  profileImage: {
    marginRight: SPACING_XXSMALL,
  },
});

export default ArtistSearchCard;
