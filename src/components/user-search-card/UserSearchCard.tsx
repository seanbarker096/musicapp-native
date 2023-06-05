import { AppText } from 'components/app-text';
import React, { FC } from 'react';
import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { User } from 'store/users/users.types';
import { SPACING_XXSMALL, SPACING_XXXSMALL } from 'styles';
import { ProfileImage, profileImageSizeGenerator } from '../profile-image';

interface UserSearchCardProps {
  user: User;
  onPress?: (event: GestureResponderEvent) => void;
}

const IMAGE_SIZE = 'small';
const HEIGHT = profileImageSizeGenerator(IMAGE_SIZE) + 10;

// TODO: Add imgUrl as projection for User GET requests so we can have a single search card for users and performers
export const UserSearchCard: FC<UserSearchCardProps> = ({
  user,
  onPress = () => {},
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={{ ...styles.container }}
    >
      <ProfileImage
        styles={styles.profileImage}
        imageUrl={user.avatarFile?.url}
        size={IMAGE_SIZE}
      ></ProfileImage>
      <View style={styles.columnContainer}>
        <AppText weight="bold">{user.username}</AppText>
        <AppText
          weight="light"
          size="small"
        >
          {user.firstName} {user.secondName}
        </AppText>
      </View>
    </Pressable>
  );
};

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
  columnContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: '100%',
  },
  profileImage: {
    marginRight: SPACING_XXSMALL,
  },
});
