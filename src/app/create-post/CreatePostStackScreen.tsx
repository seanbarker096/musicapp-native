import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { AppShellStackNavigatorParamList } from 'app/app-shell/appShell.types';
import CreatePerformanceStackScreen from 'app/create-performance/CreatePerformanceStackScreen';
import { PrimaryScreens } from 'app/primary-nav/PrimaryNav.types';
import { ProfileStackParamList } from 'app/profile/profile.types';
import React, { FC } from 'react';
import { CreatePostStackParamList } from './create-post.types';
import CreatePost from './CreatePost';
import { CreatePostPerformanceSearch } from './CreatePostPerformanceSearch';
import { CreatePostPerformerSearch } from './CreatePostPerformerSearch';

type Props =
  | NativeStackScreenProps<
      AppShellStackNavigatorParamList,
      PrimaryScreens.CREATE_POST
    >
  | NativeStackScreenProps<ProfileStackParamList, 'CreatePostStack'>;

const CreateStackTabNavigator =
  createNativeStackNavigator<CreatePostStackParamList>();

const CreatePostStackScreen: FC<Props> = ({ route: { params } }) => {
  return (
    <CreateStackTabNavigator.Navigator>
      <CreateStackTabNavigator.Screen
        component={CreatePost}
        // Should be ok, but might need to check if any issues here with initialParams becoming stale
        initialParams={params ? { performer: params?.performer } : undefined}
        name="CreatePost"
        options={{ headerTitle: 'Create Post' }}
      ></CreateStackTabNavigator.Screen>
      <CreateStackTabNavigator.Screen
        options={{ headerShown: false }}
        component={CreatePerformanceStackScreen}
        name="CreatePerformanceStack"
      ></CreateStackTabNavigator.Screen>
      <CreateStackTabNavigator.Screen
        component={CreatePostPerformerSearch}
        name="CreatePostPerformerSearch"
        options={{ headerTitle: 'Artist Search' }}
      ></CreateStackTabNavigator.Screen>
      <CreateStackTabNavigator.Screen
        component={CreatePostPerformanceSearch}
        name="CreatePostPerformanceSearch"
        options={{ headerTitle: 'Performance Search' }}
      ></CreateStackTabNavigator.Screen>
    </CreateStackTabNavigator.Navigator>
  );
};

export default CreatePostStackScreen;
