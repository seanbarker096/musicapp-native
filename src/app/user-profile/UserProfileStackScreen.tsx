import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppShellStackNavigatorParamList } from 'app/app-shell/appShell.types';
import { Post as PostComponent } from 'app/post/Post';
import { PrimaryScreens } from 'app/primary-nav/PrimaryNav.types';
import React, { FC, useCallback } from 'react';
import { UserProfileStackParamList } from './user-profile.types';
import UserProfile from './UserProfile';

type Props = BottomTabScreenProps<
  AppShellStackNavigatorParamList,
  PrimaryScreens.PROFILE
> & {
  setSelectedScreen: (screen: PrimaryScreens) => void;
};

// TODO: Type this
const UserProfileStack =
  createNativeStackNavigator<UserProfileStackParamList>();

const UserProfileStackScreen: FC<Props> = ({ setSelectedScreen }) => {
  useFocusEffect(
    useCallback(() => {
      setSelectedScreen(PrimaryScreens.PROFILE);
    }, [setSelectedScreen]),
  );

  return (
    <UserProfileStack.Navigator
      screenOptions={{
        contentStyle: {
          backgroundColor: '#FFFFFF',
        },
      }}
    >
      <UserProfileStack.Screen
        name="UserProfile"
        component={UserProfile}
      ></UserProfileStack.Screen>
      <UserProfileStack.Screen
        name="ViewPost"
        component={PostComponent}
      ></UserProfileStack.Screen>
    </UserProfileStack.Navigator>
  );
};

export default UserProfileStackScreen;
