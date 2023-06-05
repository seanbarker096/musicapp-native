import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  createNativeStackNavigator,
  NativeStackHeaderProps,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { AppShellStackNavigatorParamList } from 'app/app-shell/appShell.types';
import CreatePerformanceStackScreen from 'app/create-performance/CreatePerformanceStackScreen';
import CreatePostStackScreen from 'app/create-post/CreatePostStackScreen';
import { PerformanceStackScreen } from 'app/performance/PerformanceStackScreen';
import { PostStackScreen } from 'app/post/PostStackScreen';
import PrimaryNav from 'app/primary-nav/PrimaryNav';
import { PrimaryScreens } from 'app/primary-nav/PrimaryNav.types';
import SettingsStackScreen from 'app/settings/SettingsStackScreen';
import { TimelineStackScreen } from 'app/timeline/TimelineStackScreen';
import { AppText } from 'components/app-text';
import { SVGIcon } from 'components/icon';
import { BurgerMenuSVG } from 'components/icon/svg-components';
import { ProfileContext, ProfileType } from 'contexts/profile.context';
import React, { FC, useContext } from 'react';
import { View } from 'react-native';
import { SPACING_MID } from 'styles';
import Profile from './Profile';
import {
  ProfileInternalStackScreenParams,
  ProfileStackParamList,
  SelectedProfileTab,
} from './profile.types';

type Props = NativeStackScreenProps<
  AppShellStackNavigatorParamList,
  PrimaryScreens.PROFILE
>;

const ProfileStackScreen: FC<Props> = ({ route: { params } }) => {
  const ProfileTab = createBottomTabNavigator<{
    main: ProfileInternalStackScreenParams;
  }>();

  const { profileState } = useContext(ProfileContext);
  const { profileId, profileType } = profileState;

  return (
    <ProfileTab.Navigator
      tabBar={props => (
        <PrimaryNav
          navigation={props.navigation}
          currentScreen={PrimaryScreens.PROFILE}
        ></PrimaryNav>
      )}
    >
      <ProfileTab.Screen
        options={{ headerShown: false }}
        name="main"
      >
        {props => (
          <ProfileInternalStackScreen
            {...props}
            profileId={profileId}
            profileType={profileType}
            createPostSuccess={params?.createPostSuccess}
          />
        )}
      </ProfileTab.Screen>
    </ProfileTab.Navigator>
  );
};

export default ProfileStackScreen;

/**
 * Currently we can't type usages of this screen,because it is used by multiple navigators of various types (e.g. BottomTabNavigator, StackNavigator). We therefore need to add a @ts-ignore to the usages of this component in any navigators.
 */

type InternalStackScreenProps = {
  profileId: number;
  profileType: ProfileType;
  createPostSuccess?: boolean;
  isLoggedInUsersProfile?: boolean;
};

export const ProfileInternalStackScreen: FC<InternalStackScreenProps> = ({
  profileId,
  profileType,
  createPostSuccess,
  isLoggedInUsersProfile = false,
}) => {
  const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

  const { profileState } = useContext(ProfileContext);
  const { profileId: contextProfileId, profileType: contextProfileType } =
    profileState;

  let profileScreenPropsProfileId = profileId;
  let profileScreenPropsProfileType = profileType;

  // The logged in user can switch between viewing the app from their artist profile (if they have one) and their usre profile. Therefore, if the profile being viewed is the logged in users profile, we should use the up to date profile context. This is because initialParams passed in by ProfileStackScreen will be stale once the user has switched between the two

  if (isLoggedInUsersProfile) {
    profileScreenPropsProfileId = contextProfileId;
    profileScreenPropsProfileType = contextProfileType;
  }

  return (
    <ProfileStack.Navigator
      screenOptions={
        isLoggedInUsersProfile
          ? {
              header: ProfileStackScreenHeader,
            }
          : {}
      }
    >
      <ProfileStack.Screen name="Profile">
        {props => (
          <Profile
            {...props}
            profileId={profileScreenPropsProfileId}
            profileType={profileScreenPropsProfileType}
            initialTab={
              createPostSuccess ? SelectedProfileTab.SHOWS : undefined
            }
          />
        )}
      </ProfileStack.Screen>
      <ProfileStack.Screen
        name="ViewPost"
        component={PostStackScreen}
        options={{ headerShown: false }}
      ></ProfileStack.Screen>
      <ProfileStack.Screen
        name="TimelineStack"
        component={TimelineStackScreen}
        options={{ headerShown: false }}
      ></ProfileStack.Screen>
      <ProfileStack.Screen
        name="PerformanceStack"
        component={PerformanceStackScreen}
        options={{ headerShown: false }}
      ></ProfileStack.Screen>
      <ProfileStack.Screen
        name="ProfileCreatePerformance"
        component={CreatePerformanceStackScreen}
        options={{ headerShown: false }}
      ></ProfileStack.Screen>
      <ProfileStack.Screen
        name="CreatePostStack"
        component={CreatePostStackScreen}
        options={{ headerShown: false }}
      ></ProfileStack.Screen>
      <ProfileStack.Screen
        name="ProfileSettings"
        component={SettingsStackScreen}
        options={{ animation: 'none' }}
      ></ProfileStack.Screen>
    </ProfileStack.Navigator>
  );
};

const ProfileStackScreenHeader: FC<NativeStackHeaderProps> = ({
  navigation,
  route,
}) => {
  function navigate() {
    if (route.name === 'ProfileSettings') {
      navigation.goBack();
    } else {
      navigation.navigate('ProfileSettings');
    }
  }
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: SPACING_MID,
        paddingLeft: SPACING_MID,
        paddingBottom: SPACING_MID,
      }}
    >
      <AppText>My App</AppText>
      <SVGIcon
        handlePress={navigate}
        styles={{ flexShrink: 1 }}
      >
        <BurgerMenuSVG></BurgerMenuSVG>
      </SVGIcon>
    </View>
  );
};
