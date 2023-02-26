import AppText from 'components/app-text/AppText';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { ArtistSearchArtist } from 'store/artists';
import { SPACING_XXSMALL } from 'styles';
import ProfileImage from '../profile-image/ProfileImage';

interface ArtistSearchCardProps {
  artist: ArtistSearchArtist;
}

const avatarImage = require('./../../assets/avatar.png');

const ArtistSearchCard: FC<ArtistSearchCardProps> = ({ artist }) => (
  <View>
    <ProfileImage
      styles={styles.profileImage}
      imageUrl={artist.imageUrl ?? avatarImage}
    ></ProfileImage>
    <AppText weight="bold">{artist.name}</AppText>
  </View>
);

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
  profileImage: {
    marginRight: SPACING_XXSMALL,
  },
});

export default ArtistSearchCard;
