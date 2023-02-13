import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppShellStackParamList } from 'app/app-shell/appShell.types';
import { Post as PostComponent } from 'app/post/Post';
import React, { FC } from 'react';
import { UserProfileStackParamList } from './user-profile.types';
import UserProfile from './UserProfile';

type Props = BottomTabScreenProps<AppShellStackParamList, 'UserProfile'>;

// TODO: Type this
const UserProfileStack =
  createNativeStackNavigator<UserProfileStackParamList>();

const UserProfileStackScreen: FC<Props> = () => (
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

export default UserProfileStackScreen;
