import { AppText } from 'components/app-text';
import React, { FC } from 'react';
import { GestureResponderEvent, Pressable, StyleSheet } from 'react-native';
import { PerformerSearchPerformer } from 'store/performers';
import { SPACING_XXSMALL } from 'styles';
import { ProfileImage, profileImageSizeGenerator } from '../profile-image';

interface PerformerSearchCardProps {
  performer: PerformerSearchPerformer;
  onPress?: (event: GestureResponderEvent) => void;
}

const IMAGE_SIZE = 'small';
const HEIGHT = profileImageSizeGenerator(IMAGE_SIZE);

// TODO: Add imgUrl as projection for User GET requests so we can have a single search card for users and performers
export const PerformerSearchCard: FC<PerformerSearchCardProps> = ({
  performer,
  onPress = () => {},
}) => (
  <Pressable
    onPress={onPress}
    style={{ ...styles.container, height: HEIGHT }}
  >
    <ProfileImage
      styles={styles.profileImage}
      imageUrl={performer.imageUrl}
      size={IMAGE_SIZE}
    ></ProfileImage>
    <AppText weight="bold">{performer.name}</AppText>
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
