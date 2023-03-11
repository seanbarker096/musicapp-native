import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppShellStackNavigatorParamList } from 'app/app-shell/appShell.types';
import PrimaryNav from 'app/primary-nav/PrimaryNav';
import { PrimaryScreens } from 'app/primary-nav/PrimaryNav.types';
import React, { FC } from 'react';
import Manage from './Manage';

const ManageTabNavigator = createBottomTabNavigator();

type Props = NativeStackScreenProps<
  AppShellStackNavigatorParamList,
  PrimaryScreens.MANAGE
>;

const ManageStackScreen: FC<Props> = () => {
  return (
    <ManageTabNavigator.Navigator
      tabBar={props => (
        <PrimaryNav
          navigation={props.navigation}
          currentScreen={PrimaryScreens.MANAGE}
        ></PrimaryNav>
      )}
    >
      <ManageTabNavigator.Screen
        component={Manage}
        name="Manage"
      ></ManageTabNavigator.Screen>
    </ManageTabNavigator.Navigator>
  );
};

export default ManageStackScreen;
