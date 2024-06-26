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
import { navHeaderFactory } from 'utils/utils';
import Manage from './Manage';
import { ManageArtistPicks } from './ManageArtistPicks';
import { ManageFeedback } from './ManageFeedback';
import { ManageTaggedPosts } from './ManageTaggedPosts';
import {
  InternalManageStackScreenParamsList,
  ManageStackParamList,
} from './manage-types';

type Props = NativeStackScreenProps<
  AppShellStackNavigatorParamList,
  PrimaryScreens.MANAGE
>;

const ManageStackScreen: FC<Props> = () => {
  const ManageTab = createBottomTabNavigator<{
    main: InternalManageStackScreenParamsList;
  }>();

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
        initialParams={{ hideBackForEntryScreen: true }}
        name="main"
      ></ManageTab.Screen>
    </ManageTab.Navigator>
  );
};

export default ManageStackScreen;

const InternalManageStackScreen: FC<
  NativeStackScreenProps<
    {
      main: InternalManageStackScreenParamsList;
    },
    'main'
  >
> = ({ navigation, route: { params } }) => {
  const InternalManageStack =
    createNativeStackNavigator<ManageStackParamList>();

  const hideBackForEntryScreen = params?.hideBackForEntryScreen;

  const state = navigation.getState();

  return (
    <InternalManageStack.Navigator
      screenOptions={navHeaderFactory({ hideBackForEntryScreen })}
    >
      <InternalManageStack.Screen
        component={Manage}
        name="Manage"
      ></InternalManageStack.Screen>
      <InternalManageStack.Screen
        component={ManageArtistPicks}
        name="ManageArtistPicks"
        options={{ headerTitle: 'Artist Picks' }}
      ></InternalManageStack.Screen>
      <InternalManageStack.Screen
        component={ManageTaggedPosts}
        name="ManageTaggedPosts"
        options={{ headerTitle: 'Tagged Posts' }}
      ></InternalManageStack.Screen>
      <InternalManageStack.Screen
        component={ManageFeedback}
        name="ManageFeedback"
        options={{ headerTitle: 'Feedback' }}
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
