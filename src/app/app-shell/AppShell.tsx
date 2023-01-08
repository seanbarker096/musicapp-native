import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from 'app/home/Home';
import ManageStackScreen from 'app/manage/ManageStackScreen';
import PrimaryNav from 'app/primary-nav/PrimaryNav';
import { PrimaryScreens } from 'app/primary-nav/PrimaryNav.types';
import SearchStackScreen from 'app/search/SearchStackScreen';
import UserProfileStackScreen from 'app/user-profile/UserProfileStackScreen';
import React, { FC } from 'react';

interface LoggedInAppShellProps {}
const LoggedInAppShell: FC<LoggedInAppShellProps> = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={props => <PrimaryNav navigation={props.navigation}></PrimaryNav>}
    >
      <Tab.Screen
        name={PrimaryScreens.HOME}
        component={Home}
      ></Tab.Screen>
      <Tab.Screen
        name={PrimaryScreens.SEARCH}
        component={SearchStackScreen}
      ></Tab.Screen>
      <Tab.Screen
        name={PrimaryScreens.PROFILE}
        component={UserProfileStackScreen}
      />
      <Tab.Screen
        name={PrimaryScreens.MANAGE}
        component={ManageStackScreen}
      ></Tab.Screen>
    </Tab.Navigator>
  );
};

export default LoggedInAppShell;
