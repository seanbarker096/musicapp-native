import { AppText } from 'components/app-text';
import { ProfileImage } from 'components/profile-image';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { useUserGetQuery } from 'store/users';
import { SPACING_MID } from 'styles';

interface UserProfileHeaderProps {
  userId: number;
}

const UserProfileHeader: FC<UserProfileHeaderProps> = ({ userId }) => {
  const {
    isLoading: userGetLoading,
    isError: isUsersGetError,
    data: userData,
    error: usersGetError,
  } = useUserGetQuery({
    queryParams: { id: userId },
  });

  const userReady = userData && !userGetLoading;
  const userLoading = !userReady && userGetLoading;
  // Error if no userData exists AND error. If error but previous userData exists don't render error state
  const userError = !userReady && usersGetError;

  const user = userReady ? userData[0] : undefined;

  const profileReady = user;

  console.log('user', user);
  return (
    <>
      {profileReady && (
        <View
          style={{
            ...styles.colContainer,
            height: '30%',
            width: '100%',
          }}
        >
          <View style={{ ...styles.colContainer, marginTop: SPACING_MID }}>
            <ProfileImage
              imageUrl={user.avatarFile?.url}
              size="large"
            />
            <AppText
              size="large"
              weight="bold"
            >
              {user.firstName} {user.secondName}
            </AppText>
            <AppText>@{user.username}</AppText>
            <AppText>{user.bio}</AppText>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  text: {
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  rowContainer: {
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  colContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
});

export default UserProfileHeader;
