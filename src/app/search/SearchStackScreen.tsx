import {
  BottomTabScreenProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppShellStackNavigatorParamList } from 'app/app-shell/appShell.types';
import PrimaryNav from 'app/primary-nav/PrimaryNav';
import { PrimaryScreens } from 'app/primary-nav/PrimaryNav.types';
import { ProfileInternalStackScreen } from 'app/profile/ProfileStackScreen';
import React, { FC } from 'react';
import Search from './Search';
import { InternalSearchStackScreenParamList } from './search-types';

type Props = BottomTabScreenProps<
  AppShellStackNavigatorParamList,
  PrimaryScreens.SEARCH
>;

type SearchStackScreenParamList = {
  [PrimaryScreens.SEARCH]: undefined;
};

export const SearchStackScreen: FC<Props> = () => {
  const SearchTabNavigator =
    createBottomTabNavigator<SearchStackScreenParamList>();

  return (
    <SearchTabNavigator.Navigator
      tabBar={props => (
        <PrimaryNav
          navigation={props.navigation}
          currentScreen={PrimaryScreens.SEARCH}
        ></PrimaryNav>
      )}
    >
      <SearchTabNavigator.Screen
        options={{ headerShown: false }}
        component={SearchInternalStackScreen}
        name={PrimaryScreens.SEARCH}
      ></SearchTabNavigator.Screen>
    </SearchTabNavigator.Navigator>
  );
};

export const SearchInternalStackScreen = () => {
  const SearchStack =
    createNativeStackNavigator<InternalSearchStackScreenParamList>();

  return (
    <SearchStack.Navigator>
      <SearchStack.Screen
        component={Search}
        name="Search"
      ></SearchStack.Screen>
      <SearchStack.Screen
        component={ProfileInternalStackScreen}
        name="ProfileInternalStackScreen"
        options={{ headerShown: false }}
      ></SearchStack.Screen>
    </SearchStack.Navigator>
  );
};
