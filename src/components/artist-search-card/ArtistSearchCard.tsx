import { AppText } from 'components/app-text';
import React, { FC } from 'react';
import { GestureResponderEvent, Pressable, StyleSheet } from 'react-native';
import { ArtistSearchArtist } from 'store/artists';
import { SPACING_XXSMALL } from 'styles';
import { ProfileImage } from '../profile-image';

interface ArtistSearchCardProps {
  artist: ArtistSearchArtist;
  onPress?: (event: GestureResponderEvent) => void;
}

export const ArtistSearchCard: FC<ArtistSearchCardProps> = ({
  artist,
  onPress = () => {},
}) => (
  <Pressable
    onPress={onPress}
    style={styles.container}
  >
    <ProfileImage
      styles={styles.profileImage}
      imageUrl={artist.imageUrl}
    ></ProfileImage>
    <AppText weight="bold">{artist.name}</AppText>
  </Pressable>
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
