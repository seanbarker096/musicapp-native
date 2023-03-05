import {
  BottomTabScreenProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { AppShellStackNavigatorParamList } from 'app/app-shell/appShell.types';
import ArtistProfileStackScreen from 'app/artist-profile/ArtistProfileStackScreen';
import PrimaryNav from 'app/primary-nav/PrimaryNav';
import { PrimaryScreens } from 'app/primary-nav/PrimaryNav.types';
import React, { FC } from 'react';
import Search from './Search';
import { SearchStackScreenParamList } from './search-types';

const SearchTabNavigator =
  createBottomTabNavigator<SearchStackScreenParamList>();

type Props = BottomTabScreenProps<
  AppShellStackNavigatorParamList,
  PrimaryScreens.SEARCH
>;

const SearchStackScreen: FC<Props> = () => {
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
        component={Search}
        name="Search"
      ></SearchTabNavigator.Screen>
      <SearchTabNavigator.Screen
        component={ArtistProfileStackScreen}
        name="ArtistProfileStackScreen"
        options={{ headerShown: false }}
      ></SearchTabNavigator.Screen>
    </SearchTabNavigator.Navigator>
  );
};

export default SearchStackScreen;
