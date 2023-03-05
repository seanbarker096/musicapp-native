import {
  BottomTabScreenProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { AppShellStackNavigatorParamList } from 'app/app-shell/appShell.types';
import { Post as PostComponent } from 'app/post/Post';
import PrimaryNav from 'app/primary-nav/PrimaryNav';
import { PrimaryScreens } from 'app/primary-nav/PrimaryNav.types';
import React, { FC } from 'react';
import { UserProfileStackParamList } from './user-profile.types';
import UserProfile from './UserProfile';

type Props = BottomTabScreenProps<
  AppShellStackNavigatorParamList,
  PrimaryScreens.PROFILE
>;

const UserProfileTab = createBottomTabNavigator<UserProfileStackParamList>();

const UserProfileStackScreen: FC<Props> = () => {
  return (
    <UserProfileTab.Navigator
      tabBar={props => (
        <PrimaryNav
          navigation={props.navigation}
          currentScreen={PrimaryScreens.PROFILE}
        ></PrimaryNav>
      )}
    >
      <UserProfileTab.Screen
        name="UserProfile"
        component={UserProfile}
      ></UserProfileTab.Screen>
      <UserProfileTab.Screen
        name="ViewPost"
        component={PostComponent}
      ></UserProfileTab.Screen>
    </UserProfileTab.Navigator>
  );
};

export default UserProfileStackScreen;
