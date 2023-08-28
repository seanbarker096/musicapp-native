import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  createNativeStackNavigator,
  NativeStackHeaderProps,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { AppShellStackNavigatorParamList } from 'app/app-shell/appShell.types';
import CreatePerformanceStackScreen from 'app/create-performance/CreatePerformanceStackScreen';
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
import React, { FC, memo, useContext } from 'react';
import { View } from 'react-native';

import { SPACING_SMALL, SPACING_XSMALL } from 'styles';

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

const ProfileStackScreen: FC<Props> = ({ route: { params }, navigation }) => {
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
        // Previously had issues with this being stale when navigating from create post sucess, and wanting createPostSuccess to have the updated value of true. To get this to work i am resetting the navigation state following a post success, which resets these initial params. See CreatePost.tsx
        initialParams={{
          profileId,
          profileType,
          createPostSuccess: params?.createPostSuccess,
          isLoggedInUsersProfile: true,
        }}
        component={ProfileInternalStackScreen}
      ></ProfileTab.Screen>
    </ProfileTab.Navigator>
  );
};

export default ProfileStackScreen;

/**
 * Currently we can't type usages of this screen,because it is used by multiple navigators of various types (e.g. BottomTabNavigator, StackNavigator). We therefore need to add a @ts-ignore to the usages of this component in any navigators.
 */

type T = {
  main: ProfileInternalStackScreenParams;
};

type InternalStackScreenProps = NativeStackScreenProps<T, 'main'>;

export const ProfileInternalStackScreen: FC<InternalStackScreenProps> = memo(
  ({ route: { params } }) => {
    const {
      profileId,
      profileType,
      createPostSuccess,
      isLoggedInUsersProfile = false,
    } = params;

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
                header: ProfileStackScreenHeader, // We set showHeader to false for all screens except the main profile screen
              }
            : {}
        }
      >
        <ProfileStack.Screen name="Profile">
          {props => (
            <>
              {profileScreenPropsProfileType === ProfileType.PERFORMER && (
                //To prevent stale data, if a user switches between viewing their user and performer account, we want to re-mount so our queries don't return data from the previous profile
                <Profile
                  {...props}
                  profileId={profileScreenPropsProfileId}
                  profileType={ProfileType.PERFORMER}
                  initialTab={
                    createPostSuccess ? SelectedProfileTab.SHOWS : undefined
                  }
                />
              )}
              {profileScreenPropsProfileType === ProfileType.USER && (
                <Profile
                  {...props}
                  profileId={profileScreenPropsProfileId}
                  profileType={ProfileType.USER}
                  initialTab={
                    createPostSuccess ? SelectedProfileTab.SHOWS : undefined
                  }
                />
              )}
            </>
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
          name="ProfileSettings"
          component={SettingsStackScreen}
          options={{ animation: 'none' }}
        ></ProfileStack.Screen>
      </ProfileStack.Navigator>
    );
  },
);

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
        paddingRight: SPACING_SMALL,
        paddingLeft: SPACING_SMALL,
        marginBottom: SPACING_SMALL,
        paddingTop: SPACING_XSMALL,
      }}
    >
      <AppText
        size="xlarge"
        weight="semi-bold"
      >
        Gigstory
      </AppText>
      <SVGIcon
        handlePress={navigate}
        height={22}
        width={22}
      >
        <BurgerMenuSVG></BurgerMenuSVG>
      </SVGIcon>
    </View>
  );
};
