import { AppText } from 'components/app-text';
import React, { FC } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ProfileType } from 'store/profile-posts';
import { COLOR_PRIMARY, FONT_WEIGHT_BOLD, SPACING_XXSMALL } from 'styles';
import ProfileHeader from './profile-header/ProfileHeader';
import ProfileShows from './ProfileShows';
import ProfileTaggedPosts from './ProfileTaggedPosts';

enum SelectedTab {
  SHOWS = 'shows',
  TAGGED = 'tagged',
  TIMELINE = 'timeline',
}
type ProfileProps = { profileId: number; profileType: ProfileType };

const Profile: FC<ProfileProps> = ({ profileId, profileType }) => {
  const [selectedTab, setSelectedTab] = React.useState<SelectedTab>(
    SelectedTab.SHOWS,
  );

  function handleTabSelected(selectedTab: SelectedTab) {
    setSelectedTab(selectedTab);
  }

  return (
    <View style={styles.colContainer}>
      <ProfileHeader
        profileId={profileId}
        profileType={profileType}
      ></ProfileHeader>
      <View style={styles.headerContainer}>
        <Pressable onPress={() => handleTabSelected(SelectedTab.SHOWS)}>
          <AppText weight={FONT_WEIGHT_BOLD}>Shows</AppText>
        </Pressable>
        <Pressable onPress={() => handleTabSelected(SelectedTab.TAGGED)}>
          <AppText weight={FONT_WEIGHT_BOLD}>Tagged</AppText>
        </Pressable>
        <Pressable onPress={() => handleTabSelected(SelectedTab.TIMELINE)}>
          <AppText weight={FONT_WEIGHT_BOLD}>Timeline</AppText>
        </Pressable>
      </View>
      {selectedTab === SelectedTab.SHOWS && (
        <ProfileShows
          profileId={profileId}
          profileType={profileType} // TODO: Update this to be dynamic
        ></ProfileShows>
      )}
      {selectedTab === SelectedTab.TAGGED && (
        <ProfileTaggedPosts
          profileId={profileId}
          profileType={profileType}
        ></ProfileTaggedPosts>
      )}
      {selectedTab === SelectedTab.TIMELINE && <Text>timeline</Text>}
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

export default Profile;
