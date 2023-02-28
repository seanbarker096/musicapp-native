import { AppText } from 'components/app-text';
import { Gallery } from 'components/gallery/Gallery';
import { ProfileImage } from 'components/profile-image';
import React, { FC, useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AuthStateContext } from 'store/auth/auth.contexts';
import { useFilesGetQuery } from 'store/files/files.queries';
import { useUserGetQuery } from 'store/users';

interface UserProfileProps {}

const UserProfile: FC<UserProfileProps> = () => {
  const { authState } = useContext(AuthStateContext);

  const {
    isLoading: userGetLoading,
    isError: isUsersGetError,
    data,
    error: usersGetError,
  } = useUserGetQuery({ id: authState.authUser.userId });

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
    <View style={styles.container}>
      {user && file && (
        <>
          <ProfileImage imageUrl={file.url}></ProfileImage>
          <AppText
            size="large"
            weight="bold"
          >
            {user.firstName} {user.secondName}
          </AppText>
          <Text>@{user.username}</Text>
          <Gallery itemOwnerId={user.id}></Gallery>
        </>
      )}
      {(userLoading || fileLoading) && <Loading></Loading>}
      {(!!userError || !!filesError) && <Error></Error>}
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  container: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    justifyContent: 'flex-start',
  },
});

export default UserProfile;
