import { AppText } from 'components/app-text';
import React, { FC, memo } from 'react';
import { GestureResponderEvent, Pressable, StyleSheet } from 'react-native';
import { PerformerSearchPerformer } from 'store/performers';
import { SPACING_XXSMALL, SPACING_XXXSMALL } from 'styles';
import { ProfileImage, profileImageSizeGenerator } from '../profile-image';

interface PerformerSearchCardProps {
  performer: PerformerSearchPerformer;
  onPress?: (event: GestureResponderEvent) => void;
}

const IMAGE_SIZE = 'small';
const HEIGHT = profileImageSizeGenerator(IMAGE_SIZE);

// TODO: Add imgUrl as projection for User GET requests so we can have a single search card for users and performers
export const PerformerSearchCard: FC<PerformerSearchCardProps> = memo(({
  performer,
  onPress = () => {},
}) => (
  <Pressable
    onPress={onPress}
    style={{ ...styles.container }}
  >
    <ProfileImage
      styles={styles.profileImage}
      imageUrl={performer.imageUrl}
      size={IMAGE_SIZE}
    ></ProfileImage>
    <AppText>{performer.name}</AppText>
  </Pressable>
);

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: SPACING_XXXSMALL,
    paddingBottom: SPACING_XXXSMALL,
    width: '100%',
  },
  profileImage: {
    marginRight: SPACING_XXSMALL,
  },
}));
