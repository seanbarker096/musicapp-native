import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppShellStackNavigatorParamList } from 'app/app-shell/appShell.types';
import { PrimaryScreens } from 'app/primary-nav/PrimaryNav.types';
import React, { FC, useCallback } from 'react';
import CreatePost from './CreatePost';
import { CreatePostStackParamList } from './post.types';

type Props = BottomTabScreenProps<
  AppShellStackNavigatorParamList,
  PrimaryScreens.CREATE_POST
> & {
  setSelectedScreen: (screen: PrimaryScreens) => void;
};

const CreatePostStackNavigator =
  createNativeStackNavigator<CreatePostStackParamList>();

const CreatePostStackScreen: FC<Props> = ({ setSelectedScreen }) => {
  useFocusEffect(
    useCallback(() => {
      setSelectedScreen(PrimaryScreens.CREATE_POST);
    }, [setSelectedScreen]),
  );

  return (
    <CreatePostStackNavigator.Navigator>
      <CreatePostStackNavigator.Screen
        component={CreatePost}
        name="CreatePost"
      ></CreatePostStackNavigator.Screen>
    </CreatePostStackNavigator.Navigator>
  );
};

export default CreatePostStackScreen;
