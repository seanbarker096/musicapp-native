import { AppText } from 'components/app-text';
import { default as ProfileImage } from 'components/profile-image/ProfileImage';
import React, { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useFileGetQuery } from 'store/files/files.queries';
import { useUserGetQuery } from 'store/users';

interface UserProfileProps {}

const UserProfile: FC<UserProfileProps> = () => {
  const {
    isLoading: usersLoading,
    isError: isUsersGetError,
    data,
    error: usersGetError,
  } = useUserGetQuery({ id: 1 });

  const userReady = data && !usersLoading;

  const user = userReady ? data[0] : undefined;

  const {
    isLoading: filesLoading,
    isError: isFilesGetError,
    data: files,
    error: filesGetError,
  } = useFileGetQuery({
    queryParams: { uuid: data ? data[0].avatarFileUuid : undefined },
    enabled: !!userReady,
  });

  const fileReady = files && !filesLoading;

  const file = files ? files[0] : undefined;

  /************************* Templates ********************************/

  const Loading = () => <Text>Loading...</Text>;

  const Error = () => <Text>Error...</Text>;

  return (
    <View>
      {user && file && (
        <View>
          <ProfileImage imageUrl={file.url}></ProfileImage>
          <AppText
            size="large"
            weight="bold"
          >
            {user.firstName} {user.secondName}
          </AppText>
          <Text>@{user.username}</Text>
          <View class="Gallery"></View>
        </View>
      )}
      {(usersLoading || filesLoading) && <Loading></Loading>}
      {(isUsersGetError || isFilesGetError) && <Error></Error>}
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default UserProfile;
