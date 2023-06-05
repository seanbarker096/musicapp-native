import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText } from 'components/app-text';
import { ProfileType } from 'contexts/profile.context';
import React, { FC, memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { PerformanceWithEvent } from 'store/performances/performances.types';
import {
  COLOR_PRIMARY,
  COLOR_PRIMARY_DARK,
  FONT_WEIGHT_BOLD,
  SPACING_XXSMALL,
} from 'styles';
import ProfileShows from './ProfileShows';
import ProfileTaggedPosts from './ProfileTaggedPosts';
import { ProfileTimeline } from './ProfileTimeline';
import PerformerProfileHeader from './profile-header/PerformerProfileHeader';
import UserProfileHeader from './profile-header/UserProfileHeader';
import { ProfileStackParamList, SelectedProfileTab } from './profile.types';

type ProfileProps = NativeStackScreenProps<ProfileStackParamList, 'Profile'> & {
  profileId: number;
  profileType: ProfileType;
  initialTab?: SelectedProfileTab;
};

// TODO: Might be better to just have a sigle performer profile and user profile component, rather than creating things like ProfileHeader which internally branches either to performer or proifle
// Benefit of current approach is Profile now doesn't ened to know how to deal with different profile types
// Use react memo due to need for render callback in ProfileStackScreen
const Profile: FC<ProfileProps> = memo(
  ({
    profileId,
    profileType,
    initialTab = SelectedProfileTab.TIMELINE,
    navigation,
  }) => {
    const [selectedTab, setSelectedTab] =
      React.useState<SelectedProfileTab>(initialTab);

    function handleTabSelected(selectedTab: SelectedProfileTab) {
      setSelectedTab(selectedTab);
    }

    function handleCreatePerformancePress() {
      navigation.navigate('ProfileCreatePerformance');
    }

    function handleUploadPostPress() {
      navigation.navigate('CreatePostStack');
    }

    function handleViewProfilePress() {
      setSelectedTab(SelectedProfileTab.TAGGED);
    }

    function handlePostPress(postId: number) {
      navigation.navigate('ViewPost', { postId });
    }

    function handlePerformancePress(
      performanceWithCounts: PerformanceWithEvent,
    ) {
      navigation.navigate('PerformanceStack', {
        performanceId: performanceWithCounts.id,
        performerId: performanceWithCounts.performerId,
      });
    }
    // TODO: Might need to keep all components showing pist in dom so we dont reset limits etc. and loose all the posts they scroleld though when switching tabs
    return (
      <View style={styles.colContainer}>
        {profileType === ProfileType.USER ? (
          <UserProfileHeader userId={profileId}></UserProfileHeader>
        ) : (
          <PerformerProfileHeader
            performerId={profileId}
            handleUploadPostPress={handleUploadPostPress}
          ></PerformerProfileHeader>
        )}
        <View
          // We want the header container and content of the tab to appear at the bottom of the screen
          style={{ width: '100%', flexGrow: 1, justifyContent: 'flex-end' }}
        >
          <View style={styles.headerContainer}>
            <Pressable
              style={
                selectedTab === SelectedProfileTab.TIMELINE
                  ? styles.selectedTab
                  : styles.tabItem
              }
              onPress={() => handleTabSelected(SelectedProfileTab.TIMELINE)}
            >
              <AppText weight={FONT_WEIGHT_BOLD}>Shows</AppText>
            </Pressable>
            <Pressable
              style={
                selectedTab === SelectedProfileTab.SHOWS
                  ? styles.selectedTab
                  : styles.tabItem
              }
              onPress={() => handleTabSelected(SelectedProfileTab.SHOWS)}
            >
              <AppText weight={FONT_WEIGHT_BOLD}>
                {profileType === ProfileType.PERFORMER
                  ? 'Artist Picks'
                  : 'Gallery'}
              </AppText>
            </Pressable>
            {profileType === ProfileType.PERFORMER && (
              <Pressable
                style={
                  selectedTab === SelectedProfileTab.TAGGED
                    ? styles.selectedTab
                    : styles.tabItem
                }
                onPress={() => handleTabSelected(SelectedProfileTab.TAGGED)}
              >
                <AppText weight={FONT_WEIGHT_BOLD}>Tagged</AppText>
              </Pressable>
            )}
          </View>
          <View style={{ height: 350 }}>
            {selectedTab === SelectedProfileTab.SHOWS && (
              <ProfileShows
                profileId={profileId}
                profileType={profileType} // TODO: Update this to be dynamic
                handlePostPress={handlePostPress}
                handleCreatePostPress={() =>
                  navigation.navigate('CreatePostStack')
                }
              ></ProfileShows>
            )}
            {selectedTab === SelectedProfileTab.TIMELINE && (
              <ProfileTimeline
                profileId={profileId}
                profileType={profileType}
                handleCreatePerformancePress={handleCreatePerformancePress}
                handleViewProfilePress={handleViewProfilePress}
                handlePerformancePress={handlePerformancePress}
              ></ProfileTimeline>
            )}
            {selectedTab === SelectedProfileTab.TAGGED && ( // TODO: Hide for performer profiles
              <ProfileTaggedPosts
                profileId={profileId}
                profileType={profileType}
                handleTaggedPostPress={handlePostPress}
              ></ProfileTaggedPosts>
            )}
          </View>
        </View>
      </View>
    );
  },
);

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
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
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
  selectedTab: {
    borderWidth: 0,
    borderBottomWidth: 5,
    borderBottomColor: COLOR_PRIMARY_DARK,
    padding: SPACING_XXSMALL,
    paddingBottom: 0,
  },
  tabItem: {
    padding: SPACING_XXSMALL,
    paddingBottom: 0,
  },
});

export default Profile;
