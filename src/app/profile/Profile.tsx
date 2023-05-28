import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText } from 'components/app-text';
import { ProfileType } from 'contexts/profile.context';
import React, { FC, memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { COLOR_PRIMARY, FONT_WEIGHT_BOLD, SPACING_XXSMALL } from 'styles';
import ProfileShows from './ProfileShows';
import ProfileTaggedPosts from './ProfileTaggedPosts';
import { ProfileTimeline } from './ProfileTimeline';
import ProfileHeader from './profile-header/ProfileHeader';
import { ProfileStackParamList } from './profile.types';

enum SelectedTab {
  SHOWS = 'shows',
  TAGGED = 'tagged',
  TIMELINE = 'timeline',
}
type ProfileProps = NativeStackScreenProps<ProfileStackParamList, 'Profile'> & {
  profileId: number;
  profileType: ProfileType;
};

// TODO: Might be better to just have a sigle performer profile and user profile component, rather than creating things like ProfileHeader which internally branches either to performer or proifle
// Benefit of current approach is Profile now doesn't ened to know how to deal with different profile types
// Use react memo due to need for render callback in ProfileStackScreen
const Profile: FC<ProfileProps> = memo(
  ({ profileId, profileType, navigation }) => {
    const [selectedTab, setSelectedTab] = React.useState<SelectedTab>(
      SelectedTab.SHOWS,
    );

    function handleTabSelected(selectedTab: SelectedTab) {
      setSelectedTab(selectedTab);
    }

    function handleCreatePerformancePress() {
      navigation.navigate('ProfileCreatePerformance', {});
    }

    function handleViewProfilePress() {
      setSelectedTab(SelectedTab.TAGGED);
    }

    // TODO: Might need to keep all components showing pist in dom so we dont reset limits etc. and loose all the posts they scroleld though when switching tabs
    return (
      <View style={styles.colContainer}>
        <ProfileHeader
          profileId={profileId}
          profileType={profileType}
        ></ProfileHeader>
        <View style={styles.headerContainer}>
          <Pressable onPress={() => handleTabSelected(SelectedTab.SHOWS)}>
            <AppText weight={FONT_WEIGHT_BOLD}>Gallery</AppText>
          </Pressable>
          <Pressable onPress={() => handleTabSelected(SelectedTab.TIMELINE)}>
            <AppText weight={FONT_WEIGHT_BOLD}>
              {profileType === ProfileType.PERFORMER ? 'Performances' : 'Shows'}
            </AppText>
          </Pressable>
          <Pressable onPress={() => handleTabSelected(SelectedTab.TAGGED)}>
            <AppText weight={FONT_WEIGHT_BOLD}>Tagged</AppText>
          </Pressable>
        </View>
        {selectedTab === SelectedTab.SHOWS && (
          <ProfileShows
            profileId={profileId}
            profileType={profileType} // TODO: Update this to be dynamic
          ></ProfileShows>
        )}
        {selectedTab === SelectedTab.TIMELINE && (
          <ProfileTimeline
            profileId={profileId}
            profileType={profileType}
            handleCreatePerformancePress={handleCreatePerformancePress}
            handleViewProfilePress={handleViewProfilePress}
          ></ProfileTimeline>
        )}
        {selectedTab === SelectedTab.TAGGED && ( // TODO: Hide for performer profiles
          <ProfileTaggedPosts
            profileId={profileId}
            profileType={profileType}
          ></ProfileTaggedPosts>
        )}
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
    justifyContent: 'flex-start',
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
});

export default Profile;
