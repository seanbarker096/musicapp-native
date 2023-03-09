import { AppText } from 'components/app-text';
import { ProfileImage } from 'components/profile-image';
import React, { FC, useContext } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AuthStateContext } from 'store/auth/auth.contexts';
import { useFilesGetQuery } from 'store/files/files.queries';
import { PostOwnerType } from 'store/posts';
import { useUserGetQuery } from 'store/users';
import {
  COLOR_PRIMARY,
  FONT_WEIGHT_BOLD,
  SPACING_LARGE,
  SPACING_SMALL,
  SPACING_XXSMALL
} from 'styles';
import ProfileShows from './ProfileShows';
import ProfileTaggedPosts from './ProfileTaggedPosts';

enum SelectedTab {
  SHOWS = 'shows',
  TAGGED = 'tagged',
  TIMELINE = 'timeline',
}
interface UserProfileProps {}

const UserProfile: FC<UserProfileProps> = () => {
  const { authState } = useContext(AuthStateContext);

  const [selectedTab, setSelectedTab] = React.useState<SelectedTab>(
    SelectedTab.SHOWS,
  );

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

  function handleTabSelected(selectedTab: SelectedTab) {
    setSelectedTab(selectedTab);
  }

  /************************* Templates ********************************/

  const Loading = () => <Text>Loading...</Text>;

  const Error = () => <Text>Error...</Text>;

  return (
    <View style={styles.colContainer}>
      {user &&
        file && (
          <>
            <View
              style={{
                ...styles.rowContainer,
                height: '30%',
                width: '100%',
              }}
            >
              <View style={{ ...styles.colContainer }}>
                <ProfileImage imageUrl={file.url}></ProfileImage>
                <AppText
                  size="large"
                  weight="bold"
                >
                  {user.firstName} {user.secondName}
                </AppText>
                <Text>@{user.username}</Text>
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
            <View style={styles.headerContainer}>
              <Pressable onPress={() => handleTabSelected(SelectedTab.SHOWS)}>
                <AppText weight={FONT_WEIGHT_BOLD}>Shows</AppText>
              </Pressable>
              <Pressable onPress={() => handleTabSelected(SelectedTab.TAGGED)}>
                <AppText weight={FONT_WEIGHT_BOLD}>Tagged</AppText>
              </Pressable>
              <Pressable
                onPress={() => handleTabSelected(SelectedTab.TIMELINE)}
              >
                <AppText weight={FONT_WEIGHT_BOLD}>Timeline</AppText>
              </Pressable>
            </View>
            {selectedTab === SelectedTab.SHOWS && (
              <ProfileShows
                profileId={authState.authUser.userId}
                postOwnerType={PostOwnerType.USER} // TODO: Update this to be dynamic
              ></ProfileShows>
            )}
            {selectedTab === SelectedTab.TAGGED && (
              <ProfileTaggedPosts 
                profileId={authState.authUser.userId} 
                postOwnerType={PostOwnerType.USER}
              ></ProfileTaggedPosts>
            )}
            {selectedTab === SelectedTab.TIMELINE && <Text>timeline</Text>}
          </>,
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
  headerContainer: {
    alignItems: 'center',
    backgroundColor: COLOR_PRIMARY,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingTop: SPACING_XXSMALL,
    paddingBottom: SPACING_XXSMALL,
    width: '100%',
  },
});

export default UserProfile;
