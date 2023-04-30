import { AppText } from 'components/app-text';
import { ProfileImage } from 'components/profile-image';
import React, { FC } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useUserGetQuery } from 'store/users';
import { FONT_WEIGHT_BOLD, SPACING_LARGE, SPACING_SMALL } from 'styles';

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

  return (
    <>
      {profileReady && (
        <View
          style={{
            ...styles.rowContainer,
            height: '30%',
            width: '100%',
          }}
        >
          <View style={{ ...styles.colContainer }}>
            <ProfileImage imageUrl={user.avatarFile?.url} />
            <AppText
              size="large"
              weight="bold"
            >
              {user.firstName} {user.secondName}
            </AppText>
            <AppText>@{user.username}</AppText>
          </View>
          <View
            style={{
              ...styles.rowContainer,
              flexGrow: 1,
              justifyContent: 'space-between',
              marginTop: SPACING_SMALL,
              paddingLeft: SPACING_LARGE,
              paddingRight: SPACING_LARGE,
            }}
          >
            <AppText weight={FONT_WEIGHT_BOLD}>20 Posts</AppText>
            <AppText weight={FONT_WEIGHT_BOLD}>5 Features</AppText>
            <Pressable>
              <AppText weight={FONT_WEIGHT_BOLD}>12 Tags</AppText>
            </Pressable>
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
