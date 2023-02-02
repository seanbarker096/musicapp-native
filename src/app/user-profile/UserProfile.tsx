import { AppText } from 'components/app-text';
import Gallery from 'components/gallery/Gallery';
import { default as ProfileImage } from 'components/profile-image/ProfileImage';
import React, { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useFilesGetQuery } from 'store/files/files.queries';
import { useUserGetQuery } from 'store/users';

interface UserProfileProps {}

const UserProfile: FC<UserProfileProps> = () => {
  const {
    isLoading: userGetLoading,
    isError: isUsersGetError,
    data,
    error: usersGetError,
  } = useUserGetQuery({ id: 1 });

  const userReady = data && !userGetLoading;
  const userLoading = !userReady && userGetLoading;
  // Error if no data exists AND error. If error but previous data exists don't render error state
  const userError = !userReady && usersGetError;

  const user = userReady ? data[0] : undefined;

  const {
    isLoading: filesGetLoading,
    isError: isFilesGetError,
    data: files,
    error: filesGetError,
  } = useFilesGetQuery({
    queryParams: { uuid: data ? data[0].avatarFileUuid : undefined },
    enabled: !!userReady,
  });

  const fileReady = files && !filesGetLoading;
  const fileLoading = !fileReady && filesGetLoading;
  const filesError = !fileReady && filesGetError;

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
          <Gallery></Gallery>
        </View>
      )}
      {(userLoading || fileLoading) && <Loading></Loading>}
      {(!!userError || !!filesError) && <Error></Error>}
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
