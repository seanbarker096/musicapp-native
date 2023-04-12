import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { AppShellStackNavigatorParamList } from 'app/app-shell/appShell.types';
import CreatePerformanceStackScreen from 'app/create-performance/CreatePerformanceStackScreen';
import { PerformanceStackScreen } from 'app/performance/PerformanceStackScreen';
import { Post } from 'app/post/Post';
import PrimaryNav from 'app/primary-nav/PrimaryNav';
import { PrimaryScreens } from 'app/primary-nav/PrimaryNav.types';
import { TimelineStackScreen } from 'app/timeline/TimelineStackScreen';
import { ProfileType } from 'contexts/profile.context';
import React, { FC, useContext } from 'react';
import { AuthStateContext } from 'store/auth/auth.contexts';
import Profile from './Profile';
import {
  ProfileInternalStackScreenParams,
  ProfileStackParamList,
} from './profile.types';

type Props = NativeStackScreenProps<
  AppShellStackNavigatorParamList,
  PrimaryScreens.PROFILE
>;

const ProfileStackScreen: FC<Props> = () => {
  const { authState } = useContext(AuthStateContext);

  const ProfileTab = createBottomTabNavigator<{
    main: ProfileInternalStackScreenParams;
  }>();

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
        // @ts-ignore See ProfileInternalStackScreen for reason for this
        component={ProfileInternalStackScreen}
        name="main"
        initialParams={{
          profileId: authState.authUser.userId,
          profileType: ProfileType.USER,
        }}
      ></ProfileTab.Screen>
    </ProfileTab.Navigator>
  );
};

export default ProfileStackScreen;

type InternalStackScreenProps = {
  route: { params: ProfileInternalStackScreenParams };
};

/**
 * Currently we can't type usages of this screen,because it is used by multiple navigators of various types (e.g. BottomTabNavigator, StackNavigator). We therefore need to add a @ts-ignore to the usages of this component in any navigators.
 */
export const ProfileInternalStackScreen: FC<InternalStackScreenProps> = ({
  route: {
    params: { profileId, profileType },
  },
}) => {
  const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen name="Profile">
        {props => (
          <Profile
            {...props}
            profileId={profileId}
            profileType={profileType}
          />
        )}
      </ProfileStack.Screen>
      <ProfileStack.Screen
        name="ViewPost"
        component={Post}
      ></ProfileStack.Screen>
      <ProfileStack.Screen
        name="ProfileTimeline"
        component={TimelineStackScreen}
        options={{ headerShown: false }}
      ></ProfileStack.Screen>
      <ProfileStack.Screen
        name="ProfilePerformance"
        component={PerformanceStackScreen}
        options={{ headerShown: false }}
      ></ProfileStack.Screen>
      <ProfileStack.Screen
        name="ProfileCreatePerformance"
        component={CreatePerformanceStackScreen}
        options={{ headerShown: false }}
      ></ProfileStack.Screen>
    </ProfileStack.Navigator>
  );
};
