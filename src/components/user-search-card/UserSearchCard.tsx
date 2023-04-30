import { AppText } from 'components/app-text';
import React, { FC } from 'react';
import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { useFilesGetQuery } from 'store/files/files.queries';
import { User } from 'store/users/users.types';
import { SPACING_XXSMALL } from 'styles';
import { ProfileImage } from '../profile-image';

interface UserSearchCardProps {
  user: User;
  onPress?: (event: GestureResponderEvent) => void;
}

// TODO: Add imgUrl as projection for User GET requests so we can have a single search card for users and performers
export const UserSearchCard: FC<UserSearchCardProps> = ({
  user,
  onPress = () => {},
}) => {
  const {
    isLoading: filesGetLoading,
    isError: isFilesGetError,
    data: files,
    error: filesGetError,
  } = useFilesGetQuery({
    queryParams: { uuid: user.avatarFileUuid },
    enabled: !!user.avatarFileUuid,
  });

  const fileLoading = !files && filesGetLoading;
  const filesError = !files && filesGetError;

  const file = files ? files[0] : undefined;

  console.log(file);
  console.log(filesGetLoading);

  return (
    <>
      {!fileLoading && (
        <Pressable
          onPress={onPress}
          style={styles.container}
        >
          <ProfileImage
            styles={styles.profileImage}
            imageUrl={file?.url}
          ></ProfileImage>
          <View style={styles.columnContainer}>
            <AppText weight="normal">{user.username}</AppText>
            <AppText weight="light">
              {user.firstName} {user.secondName}
            </AppText>
          </View>
        </Pressable>
      )}
      {fileLoading && <AppText>File Loading...</AppText>}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
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
