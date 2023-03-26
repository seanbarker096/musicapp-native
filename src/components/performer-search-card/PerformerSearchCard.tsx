import { AppText } from 'components/app-text';
import React, { FC } from 'react';
import { GestureResponderEvent, Pressable, StyleSheet } from 'react-native';
import { PerformerSearchPerformer } from 'store/performers';
import { SPACING_XXSMALL } from 'styles';
import { ProfileImage } from '../profile-image';

interface PerformerSearchCardProps {
  performer: PerformerSearchPerformer;
  onPress?: (event: GestureResponderEvent) => void;
}

export const PerformerSearchCard: FC<PerformerSearchCardProps> = ({
  performer,
  onPress = () => {},
}) => (
  <Pressable
    onPress={onPress}
    style={styles.container}
  >
    <ProfileImage
      styles={styles.profileImage}
      imageUrl={performer.imageUrl}
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
