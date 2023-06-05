import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { AppShellStackNavigatorParamList } from 'app/app-shell/appShell.types';
import CreatePerformanceStackScreen from 'app/create-performance/CreatePerformanceStackScreen';
import { PrimaryScreens } from 'app/primary-nav/PrimaryNav.types';
import ProfileStackScreen from 'app/profile/ProfileStackScreen';
import React, { FC } from 'react';
import { CreatePostStackParamList } from './create-post.types';
import CreatePost from './CreatePost';
import { CreatePostPerformanceSearch } from './CreatePostPerformanceSearch';
import { CreatePostPerformerSearch } from './CreatePostPerformerSearch';

type Props = NativeStackScreenProps<
  AppShellStackNavigatorParamList,
  PrimaryScreens.CREATE_POST
>;

const CreateStackTabNavigator =
  createNativeStackNavigator<CreatePostStackParamList>();

const CreatePostStackScreen: FC<Props> = () => {
  return (
    <CreateStackTabNavigator.Navigator>
      <CreateStackTabNavigator.Screen
        component={CreatePost}
        name="CreatePost"
      ></CreateStackTabNavigator.Screen>
      <CreateStackTabNavigator.Screen
        options={{ headerShown: false }}
        component={CreatePerformanceStackScreen}
        name="CreatePerformanceStack"
      ></CreateStackTabNavigator.Screen>
      <CreateStackTabNavigator.Screen
        component={CreatePostPerformerSearch}
        name="CreatePostPerformerSearch"
      ></CreateStackTabNavigator.Screen>
      <CreateStackTabNavigator.Screen
        component={CreatePostPerformanceSearch}
        name="CreatePostPerformanceSearch"
      ></CreateStackTabNavigator.Screen>
      <CreateStackTabNavigator.Screen
        options={{ headerShown: false }}
        component={ProfileStackScreen}
        name="ProfileStackScreen"
      ></CreateStackTabNavigator.Screen>
    </CreateStackTabNavigator.Navigator>
  );
};

export default CreatePostStackScreen;
