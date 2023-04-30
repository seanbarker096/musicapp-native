import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { AppShellStackNavigatorParamList } from 'app/app-shell/appShell.types';
import PrimaryNav from 'app/primary-nav/PrimaryNav';
import { PrimaryScreens } from 'app/primary-nav/PrimaryNav.types';
import { ProfileInternalStackScreen } from 'app/profile/ProfileStackScreen';
import React, { FC } from 'react';
import Search from './Search';
import { InternalSearchStackScreenParamList } from './search-types';

type Props = NativeStackScreenProps<
  AppShellStackNavigatorParamList,
  PrimaryScreens.SEARCH
>;

export const SearchStackScreen: FC<Props> = () => {
  const SearchTabNavigator = createBottomTabNavigator<{ main: undefined }>();

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
        name="main"
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
        // @ts-ignore See ProfileInternalStackScreen for reason for this
        component={ProfileInternalStackScreen}
        name="SearchProfile"
        options={{ headerTitle: 'Profile' }}
      ></SearchStack.Screen>
    </SearchStack.Navigator>
  );
};
