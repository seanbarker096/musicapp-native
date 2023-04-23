import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { AppShellStackNavigatorParamList } from 'app/app-shell/appShell.types';
import { PrimaryScreens } from 'app/primary-nav/PrimaryNav.types';
import React, { FC } from 'react';
import { CreatePostStackParamList } from './create-post.types';
import CreatePost from './CreatePost';

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
    </CreateStackTabNavigator.Navigator>
  );
};

export default CreatePostStackScreen;
