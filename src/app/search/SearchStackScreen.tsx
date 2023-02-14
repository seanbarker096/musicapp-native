import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppShellStackNavigatorParamList } from 'app/app-shell/appShell.types';
import { PrimaryScreens } from 'app/primary-nav/PrimaryNav.types';
import React, { FC, useCallback } from 'react';
import Search from './Search';

const SearchStackNavigator = createNativeStackNavigator();

type Props = BottomTabScreenProps<
  AppShellStackNavigatorParamList,
  PrimaryScreens.SEARCH
> & {
  setSelectedScreen: (screen: PrimaryScreens) => void;
};

const SearchStackScreen: FC<Props> = ({ setSelectedScreen }) => {
  useFocusEffect(
    useCallback(() => {
      setSelectedScreen(PrimaryScreens.SEARCH);
    }, [setSelectedScreen]),
  );

  return (
    <SearchStackNavigator.Navigator>
      <SearchStackNavigator.Screen
        component={Search}
        name="Search"
      ></SearchStackNavigator.Screen>
    </SearchStackNavigator.Navigator>
  );
};

export default SearchStackScreen;
