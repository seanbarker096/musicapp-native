import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { AppShellStackNavigatorParamList } from 'app/app-shell/appShell.types';
import CreatePerformanceStackScreen from 'app/create-performance/CreatePerformanceStackScreen';
import { PostStackScreen } from 'app/post/PostStackScreen';
import PrimaryNav from 'app/primary-nav/PrimaryNav';
import { PrimaryScreens } from 'app/primary-nav/PrimaryNav.types';
import React, { FC } from 'react';
import Manage from './Manage';
import { ManageFeaturedPosts } from './ManageFeaturedPosts';
import { ManageTaggedPosts } from './ManageTaggedPosts';
import { ManageStackParamList } from './manage-types';

type Props = NativeStackScreenProps<
  AppShellStackNavigatorParamList,
  PrimaryScreens.MANAGE
>;

const ManageStackScreen: FC<Props> = () => {
  const ManageTab = createBottomTabNavigator();

  return (
    <ManageTab.Navigator
      tabBar={props => (
        <PrimaryNav
          navigation={props.navigation}
          currentScreen={PrimaryScreens.MANAGE}
        ></PrimaryNav>
      )}
    >
      <ManageTab.Screen
        options={{ headerShown: false }}
        component={InternalManageStackScreen}
        name="main"
      ></ManageTab.Screen>
    </ManageTab.Navigator>
  );
};

export default ManageStackScreen;

const InternalManageStackScreen = () => {
  const InternalManageStack =
    createNativeStackNavigator<ManageStackParamList>();

  return (
    <InternalManageStack.Navigator>
      <InternalManageStack.Screen
        component={Manage}
        name="Manage"
      ></InternalManageStack.Screen>
      <InternalManageStack.Screen
        component={ManageFeaturedPosts}
        name="ManageFeaturedPosts"
      ></InternalManageStack.Screen>
      <InternalManageStack.Screen
        component={ManageTaggedPosts}
        name="ManageTaggedPosts"
      ></InternalManageStack.Screen>
      <InternalManageStack.Screen
        component={PostStackScreen}
        name="ViewPost"
        options={{ headerShown: false }}
      ></InternalManageStack.Screen>
      <InternalManageStack.Screen
        options={{ headerShown: false }}
        component={CreatePerformanceStackScreen}
        name="ManageCreatePerformance"
      ></InternalManageStack.Screen>
    </InternalManageStack.Navigator>
  );
};
