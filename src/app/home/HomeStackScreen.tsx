import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppShellStackNavigatorParamList } from 'app/app-shell/appShell.types';
import PrimaryNav from 'app/primary-nav/PrimaryNav';
import { PrimaryScreens } from 'app/primary-nav/PrimaryNav.types';
import React, { FC } from 'react';
import Home from './Home';
import { HomeStackParamList } from './home.types';

type Props = NativeStackScreenProps<
  AppShellStackNavigatorParamList,
  PrimaryScreens.HOME
>;

const HomeTab = createBottomTabNavigator<HomeStackParamList>();

const HomeStackScreen: FC<Props> = () => {
  return (
    <HomeTab.Navigator
      tabBar={props => (
        <PrimaryNav
          {...props}
          navigation={props.navigation}
          currentScreen={PrimaryScreens.HOME}
        ></PrimaryNav>
      )}
    >
      <HomeTab.Screen
        name="Home"
        component={Home}
      ></HomeTab.Screen>
    </HomeTab.Navigator>
  );
};

export default HomeStackScreen;
