import {
  BottomTabScreenProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { AppShellStackNavigatorParamList } from 'app/app-shell/appShell.types';
import { Post as PostComponent } from 'app/post/Post';
import PrimaryNav from 'app/primary-nav/PrimaryNav';
import { PrimaryScreens } from 'app/primary-nav/PrimaryNav.types';
import { InternalSearchStackScreenParamList } from 'app/search/search-types';
import React, { FC } from 'react';
import Profile from './Profile';
import { ProfileStackParamList } from './user-profile.types';

type Props = BottomTabScreenProps<
  AppShellStackNavigatorParamList,
  PrimaryScreens.PROFILE
>;

type ProfileStackScreenParamList = {
  [PrimaryScreens.PROFILE]: undefined;
};

const LoggedInShellTab =
  createBottomTabNavigator<ProfileStackScreenParamList>();

const ProfileStackScreen: FC<Props> = () => {
  return (
    <LoggedInShellTab.Navigator
      tabBar={props => (
        <PrimaryNav
          navigation={props.navigation}
          currentScreen={PrimaryScreens.PROFILE}
        ></PrimaryNav>
      )}
    >
      <LoggedInShellTab.Screen
        options={{ headerShown: false }}
        component={ProfileInternalStackScreen}
        name={PrimaryScreens.PROFILE}
      ></LoggedInShellTab.Screen>
    </LoggedInShellTab.Navigator>
  );
};

export default ProfileStackScreen;

/**
 * In order to be able to hide the bottom tab navigator on certain primary screens (e.g. PrimaryScreens.CREATE_POST) we need to create a new tab navigator for each primary screen. We then create a stack navigator internally for each primary screen so we can navigate back and forth between screens within the primary screen
 *
 * We use an intersection type here because a union of 2 types (rather than a indvidual union type) is actually the intersection of the two types (i.e. all common properties/type. No screen would have the intersection of BottomTabsScreenProps and NativeStackScreenProps so we need to use an intersection type here.
 */

type ProfileInternalStackScreenProps = BottomTabScreenProps<
  ProfileStackScreenParamList,
  PrimaryScreens.PROFILE
> & // This is the prop if this Screen is accessed via the bottom tab navigator
  NativeStackScreenProps<
    InternalSearchStackScreenParamList,
    'ProfileInternalStackScreen'
  >; // Props if screen accessed via any other navigators e.g in Search page

export const ProfileInternalStackScreen: FC<
  ProfileInternalStackScreenProps
> = () => {
  const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="Profile"
        component={Profile}
      ></ProfileStack.Screen>
      <ProfileStack.Screen
        name="ViewPost"
        component={PostComponent}
      ></ProfileStack.Screen>
    </ProfileStack.Navigator>
  );
};
